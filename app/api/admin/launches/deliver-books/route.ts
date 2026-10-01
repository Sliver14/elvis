import { NextRequest, NextResponse } from 'next/server'
import crypto from 'crypto'
import { isAuthorizedAdmin } from '@/lib/auth'
import {
  getDb,
  getConfirmedPresaleOrders,
  recordBroadcastCampaign,
  logAdminAudit,
  DEFAULT_LAUNCH,
} from '@/lib/db'
import { sendBulkPresaleBookDeliveryEmails, PresaleDeliveryItem } from '@/lib/email'

export async function POST(request: NextRequest) {
  if (!isAuthorizedAdmin(request)) {
    return NextResponse.json({ success: false, error: 'Unauthorized' }, { status: 401 })
  }

  try {
    const body = await request.json()
    const {
      launch_id,
      scheduled_at,
      only_undelivered = false,
      admin_email = 'hello@elvisjusticebooks.com',
    } = body

    const sql = getDb()

    // Fetch all confirmed presale orders
    const { orders, count } = await getConfirmedPresaleOrders({
      launchId: launch_id || undefined,
      onlyUndelivered: Boolean(only_undelivered),
    })

    if (count === 0) {
      return NextResponse.json({
        success: false,
        error: only_undelivered
          ? 'No undelivered confirmed presale orders found.'
          : 'No confirmed presale orders found to fulfill.',
      }, { status: 400 })
    }

    const appUrl = process.env.NEXT_PUBLIC_APP_URL || 'http://localhost:3000'

    // Format delivery payload for each order
    const deliveryItems: PresaleDeliveryItem[] = orders.map((order) => {
      const isPhysical =
        order.book_format?.includes('printed') || order.book_format?.includes('bundle')
      const downloadToken = order.download_token || order.access_token
      const downloadUrl = !isPhysical
        ? `${appUrl}/api/books/download?token=${downloadToken}`
        : undefined

      return {
        orderNumber: order.order_number || order.reference,
        customerEmail: order.customer_email,
        customerName: order.customer_name || 'Reader',
        bookTitle: order.book_title || DEFAULT_LAUNCH.title,
        bookFormat: order.book_format || 'digital_ebook',
        downloadUrl,
        accessToken: order.access_token,
        trackingUrl: `${appUrl}/order/${order.access_token || order.order_number}`,
        trackingReference: order.tracking_reference,
        courierName: order.courier_name,
      }
    })

    // Validate scheduled_at if provided
    let effectiveScheduledAt: string | undefined = undefined
    if (scheduled_at) {
      const parsedDate = new Date(scheduled_at)
      if (isNaN(parsedDate.getTime())) {
        return NextResponse.json({ success: false, error: 'Invalid scheduled date format.' }, { status: 400 })
      }
      effectiveScheduledAt = parsedDate.toISOString()
    }

    // Dispatch bulk delivery emails
    const result = await sendBulkPresaleBookDeliveryEmails({
      items: deliveryItems,
      scheduledAt: effectiveScheduledAt,
    })

    if (!result.success && !result.totalDelivered) {
      return NextResponse.json({
        success: false,
        error: result.error || 'Failed to dispatch bulk book delivery.',
      }, { status: 500 })
    }

    // Update orders in DB to mark pdf_sent = true and fulfilment_status = 'Delivered' (or 'Ready for Delivery')
    if (sql) {
      const orderIds = orders.map((o) => o.id)
      await sql`
        UPDATE orders
        SET
          pdf_sent = true,
          fulfilment_status = CASE
            WHEN book_format LIKE '%printed%' OR book_format LIKE '%bundle%' THEN 'Ready for Delivery'
            ELSE 'Delivered'
          END,
          updated_at = CURRENT_TIMESTAMP
        WHERE id = ANY(${orderIds});
      `
    }

    const campaignId = `camp_delivery_${Date.now()}_${crypto.randomBytes(3).toString('hex')}`

    // Record Campaign Log
    await recordBroadcastCampaign({
      id: campaignId,
      campaignType: 'presale_book_delivery',
      launchId: launch_id || DEFAULT_LAUNCH.id,
      subject: `Presale Book Delivery: ${DEFAULT_LAUNCH.title}`,
      totalRecipients: deliveryItems.length,
      scheduledAt: effectiveScheduledAt,
      status: effectiveScheduledAt ? 'scheduled' : 'completed',
      sentBy: admin_email,
      details: {
        orders_count: deliveryItems.length,
        order_numbers: deliveryItems.map((d) => d.orderNumber),
        scheduled_at: effectiveScheduledAt,
        mocked: Boolean(result.mocked),
      },
    })

    // Log Admin Audit
    await logAdminAudit(
      admin_email,
      effectiveScheduledAt ? 'schedule_presale_book_delivery' : 'deliver_presale_books',
      'presale_orders',
      `${deliveryItems.length}_orders`,
      {
        campaign_id: campaignId,
        orders_count: deliveryItems.length,
        scheduled_at: effectiveScheduledAt,
      }
    )

    return NextResponse.json({
      success: true,
      campaign_id: campaignId,
      total_delivered: deliveryItems.length,
      scheduled: Boolean(effectiveScheduledAt),
      scheduled_at: effectiveScheduledAt,
      orders: deliveryItems.map((d) => ({
        order_number: d.orderNumber,
        customer_email: d.customerEmail,
        customer_name: d.customerName,
        book_format: d.bookFormat,
      })),
      message: effectiveScheduledAt
        ? `Presale book fulfillment successfully scheduled for ${new Date(effectiveScheduledAt).toLocaleString()} for ${deliveryItems.length} paid customer orders.`
        : `Book delivery and secure digital access successfully dispatched to ${deliveryItems.length} paid presale customers.`,
    })
  } catch (error: any) {
    console.error('Deliver presale books error:', error)
    return NextResponse.json({ success: false, error: error?.message || 'Delivery failed' }, { status: 500 })
  }
}

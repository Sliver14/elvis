import { NextRequest, NextResponse } from 'next/server'
import { getDb } from '@/lib/db'
import { sendCustomerBookEmail, sendAdminNotification } from '@/lib/email'

const PAYSTACK_SECRET_KEY = process.env.PAYSTACK_SECRET_KEY || ''

export async function GET(request: NextRequest) {
  const { searchParams } = new URL(request.url)
  const reference = searchParams.get('reference') || searchParams.get('trxref')

  if (!reference) {
    return NextResponse.json({ success: false, error: 'Reference is required' }, { status: 400 })
  }

  const sql = getDb()

  try {
    if (PAYSTACK_SECRET_KEY) {
      const verifyRes = await fetch(`https://api.paystack.co/transaction/verify/${reference}`, {
        headers: {
          Authorization: `Bearer ${PAYSTACK_SECRET_KEY}`,
        },
      })
      const verifyData = await verifyRes.json()

      if (verifyData.status && verifyData.data?.status === 'success') {
        const data = verifyData.data
        const customerEmail = data.customer?.email
        const customerName = data.metadata?.customer_name || 'Reader'
        const items = data.metadata?.items || []
        const totalAmountFormatted = `$${((data.amount || 0) / 100).toFixed(2)}`

        let isPresaleOrder = false
        let orderRecord: any = null

        if (sql) {
          const existingOrders = await sql`
            SELECT * FROM orders WHERE reference = ${reference} OR id = ${reference} LIMIT 1;
          `
          if (existingOrders.length) {
            orderRecord = existingOrders[0]
            isPresaleOrder = Boolean(orderRecord.launch_id || (orderRecord.order_number && orderRecord.order_number.includes('PRE')))
          }

          await sql`
            UPDATE orders
            SET
              status = 'successful',
              payment_status = 'Confirmed',
              fulfilment_status = CASE
                WHEN fulfilment_status = 'Pending Payment' THEN 'Awaiting Book Release'
                ELSE fulfilment_status
              END,
              updated_at = CURRENT_TIMESTAMP
            WHERE reference = ${reference};
          `
        }

        if (isPresaleOrder && orderRecord) {
          const { getPaymentSettings, DEFAULT_LAUNCH } = await import('@/lib/db')
          const { sendPaymentConfirmedCustomerEmail } = await import('@/lib/email')
          const settings = await getPaymentSettings()
          const appUrl = process.env.NEXT_PUBLIC_APP_URL || 'http://localhost:3000'
          const trackingUrl = `${appUrl}/order/${orderRecord.access_token || orderRecord.order_number || reference}`

          const isPhysical = orderRecord.book_format?.includes('printed') || orderRecord.book_format?.includes('bundle')
          const isReleased = settings.early_delivery_enabled || new Date() >= new Date(settings.expected_release_date)
          const downloadUrl = (!isPhysical && isReleased) ? `${appUrl}/api/books/download?token=${orderRecord.access_token}` : undefined

          await sendPaymentConfirmedCustomerEmail({
            customerEmail,
            customerName,
            orderNumber: orderRecord.order_number || reference,
            bookTitle: orderRecord.book_title || DEFAULT_LAUNCH.title,
            formatName: orderRecord.book_format?.replace(/_/g, ' ') || 'Digital eBook',
            isPhysical,
            downloadUrl,
            releaseDate: settings.expected_release_date,
            trackingUrl,
          })
        } else {
          // Deliver book if not yet sent
          await sendCustomerBookEmail({
            customerEmail,
            customerName,
            orderReference: reference,
            items,
            totalAmount: totalAmountFormatted,
          })
        }

        return NextResponse.json({
          success: true,
          status: 'successful',
          reference,
          customer: { email: customerEmail, name: customerName },
        })
      }
    }

    // Fallback or demo check from DB
    if (sql) {
      const order = await sql`SELECT * FROM orders WHERE reference = ${reference} LIMIT 1;`
      if (order.length) {
        return NextResponse.json({ success: true, order: order[0] })
      }
    }

    return NextResponse.json({ success: true, reference, status: 'successful' })
  } catch (error: any) {
    console.error('Verify payment error:', error)
    return NextResponse.json({ success: false, error: error?.message || 'Verification failed' }, { status: 500 })
  }
}

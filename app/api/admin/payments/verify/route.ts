import { NextRequest, NextResponse } from 'next/server'
import crypto from 'crypto'
import { getDb, logAdminAudit, getPaymentSettings } from '@/lib/db'
import { isAuthorizedAdmin } from '@/lib/auth'
import { sendPaymentConfirmedCustomerEmail } from '@/lib/email'

export async function POST(request: NextRequest) {
  if (!isAuthorizedAdmin(request)) {
    return NextResponse.json({ success: false, error: 'Unauthorized' }, { status: 401 })
  }

  try {
    const body = await request.json()
    const { order_id, proof_id, reference_note, admin_email = 'hello@elvisjusticebooks.com' } = body

    if (!order_id) {
      return NextResponse.json({ success: false, error: 'Order ID is required' }, { status: 400 })
    }

    const sql = getDb()
    if (!sql) {
      return NextResponse.json({ success: false, error: 'Database unavailable' }, { status: 500 })
    }

    // Lookup order
    const orders = await sql`
      SELECT * FROM orders WHERE id = ${order_id} OR order_number = ${order_id} LIMIT 1;
    `
    if (!orders.length) {
      return NextResponse.json({ success: false, error: 'Order not found' }, { status: 404 })
    }

    const order = orders[0]

    // 1. Update order status
    await sql`
      UPDATE orders
      SET
        payment_status = 'Confirmed',
        fulfilment_status = CASE
          WHEN fulfilment_status = 'Pending Payment' THEN 'Awaiting Book Release'
          ELSE fulfilment_status
        END,
        notes = CASE
          WHEN ${reference_note || ''} != '' THEN CONCAT(COALESCE(notes, ''), ' [Verified: ', ${reference_note || ''}, ']')
          ELSE notes
        END,
        updated_at = CURRENT_TIMESTAMP
      WHERE id = ${order.id};
    `

    // 2. Update specific proof if provided
    if (proof_id) {
      await sql`
        UPDATE payment_proofs
        SET
          status = 'Verified',
          reviewed_by = ${admin_email},
          reviewed_at = CURRENT_TIMESTAMP
        WHERE id = ${proof_id};
      `
    } else {
      await sql`
        UPDATE payment_proofs
        SET
          status = 'Verified',
          reviewed_by = ${admin_email},
          reviewed_at = CURRENT_TIMESTAMP
        WHERE order_id = ${order.id} AND status = 'Under Review';
      `
    }

    // 3. Provision Book Entitlement for digital download
    const downloadToken = crypto.randomUUID()
    await sql`
      INSERT INTO book_entitlements (
        order_id,
        order_number,
        customer_email,
        download_token,
        download_count,
        max_downloads,
        created_at
      )
      VALUES (
        ${order.id},
        ${order.order_number},
        ${order.customer_email},
        ${downloadToken},
        0,
        10,
        CURRENT_TIMESTAMP
      )
      ON CONFLICT DO NOTHING;
    `

    // 4. Record Audit Log
    await logAdminAudit(
      admin_email,
      'verify_payment',
      'order',
      order.order_number,
      {
        order_id: order.id,
        amount: order.total_amount,
        currency: order.currency,
        payment_method: order.payment_method,
        proof_id: proof_id || null,
        note: reference_note || 'Approved by administrator',
      }
    )

    // 5. Send Payment Confirmation Email to customer
    const settings = await getPaymentSettings()
    const appUrl = process.env.NEXT_PUBLIC_APP_URL || 'http://localhost:3000'
    const trackingUrl = `${appUrl}/order/${order.access_token}`

    const isPhysical = order.book_format?.includes('printed') || order.book_format?.includes('bundle')
    const isReleased = settings.early_delivery_enabled || new Date() >= new Date(settings.expected_release_date)
    const downloadUrl = (!isPhysical && isReleased) ? `${appUrl}/api/books/download?token=${downloadToken}` : undefined

    sendPaymentConfirmedCustomerEmail({
      customerEmail: order.customer_email,
      customerName: order.customer_name || 'Reader',
      orderNumber: order.order_number,
      bookTitle: order.book_title || 'Practical Trading Psychology',
      formatName: order.book_format?.replace(/_/g, ' ') || 'Digital eBook',
      isPhysical,
      downloadUrl,
      releaseDate: settings.expected_release_date,
      trackingUrl,
    }).catch((err) => console.error('Error sending payment confirmed email:', err))

    return NextResponse.json({
      success: true,
      message: `Payment for Order #${order.order_number} confirmed successfully.`,
    })
  } catch (error: any) {
    console.error('Verify payment error:', error)
    return NextResponse.json({ success: false, error: error?.message }, { status: 500 })
  }
}

import { NextRequest, NextResponse } from 'next/server'
import { getDb, logAdminAudit } from '@/lib/db'
import { isAuthorizedAdmin } from '@/lib/auth'
import { sendPaymentRejectedCustomerEmail } from '@/lib/email'

export async function POST(request: NextRequest) {
  if (!isAuthorizedAdmin(request)) {
    return NextResponse.json({ success: false, error: 'Unauthorized' }, { status: 401 })
  }

  try {
    const body = await request.json()
    const { order_id, proof_id, rejection_reason, admin_email = 'hello@elvisjusticebooks.com' } = body

    if (!order_id) {
      return NextResponse.json({ success: false, error: 'Order ID is required' }, { status: 400 })
    }

    if (!rejection_reason) {
      return NextResponse.json(
        { success: false, error: 'A rejection reason is required so the customer can correct it.' },
        { status: 400 }
      )
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

    // 1. Update order
    await sql`
      UPDATE orders
      SET
        payment_status = 'Rejected',
        rejection_reason = ${rejection_reason},
        updated_at = CURRENT_TIMESTAMP
      WHERE id = ${order.id};
    `

    // 2. Update payment proof if specified
    if (proof_id) {
      await sql`
        UPDATE payment_proofs
        SET
          status = 'Rejected',
          reviewed_by = ${admin_email},
          reviewed_at = CURRENT_TIMESTAMP,
          rejection_reason = ${rejection_reason}
        WHERE id = ${proof_id};
      `
    } else {
      await sql`
        UPDATE payment_proofs
        SET
          status = 'Rejected',
          reviewed_by = ${admin_email},
          reviewed_at = CURRENT_TIMESTAMP,
          rejection_reason = ${rejection_reason}
        WHERE order_id = ${order.id} AND status = 'Under Review';
      `
    }

    // 3. Log Audit
    await logAdminAudit(
      admin_email,
      'reject_payment',
      'order',
      order.order_number,
      {
        order_id: order.id,
        rejection_reason,
        proof_id: proof_id || null,
      }
    )

    // 4. Send customer notification with direct update link
    const appUrl = process.env.NEXT_PUBLIC_APP_URL || 'http://localhost:3000'
    const trackingUrl = `${appUrl}/order/${order.access_token}`

    sendPaymentRejectedCustomerEmail({
      customerEmail: order.customer_email,
      customerName: order.customer_name || 'Reader',
      orderNumber: order.order_number,
      rejectionReason: rejection_reason,
      trackingUrl,
    }).catch((err) => console.error('Error sending payment rejected email:', err))

    return NextResponse.json({
      success: true,
      message: `Payment for Order #${order.order_number} marked as Rejected. Customer was notified.`,
    })
  } catch (error: any) {
    console.error('Reject payment error:', error)
    return NextResponse.json({ success: false, error: error?.message }, { status: 500 })
  }
}

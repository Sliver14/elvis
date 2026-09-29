import { NextRequest, NextResponse } from 'next/server'
import { getDb, logAdminAudit } from '@/lib/db'
import { isAuthorizedAdmin } from '@/lib/auth'
import { sendBookReleasedCustomerEmail } from '@/lib/email'

export async function POST(
  request: NextRequest,
  context: { params: Promise<{ id: string }> }
) {
  if (!isAuthorizedAdmin(request)) {
    return NextResponse.json({ success: false, error: 'Unauthorized' }, { status: 401 })
  }

  try {
    const { id } = await context.params
    const body = await request.json()
    const {
      fulfilment_status,
      payment_status,
      tracking_reference,
      courier_name,
      notes,
      admin_email = 'hello@elvisjusticebooks.com',
    } = body

    const sql = getDb()
    if (!sql) {
      return NextResponse.json({ success: false, error: 'Database unavailable' }, { status: 500 })
    }

    const orders = await sql`
      SELECT * FROM orders WHERE id = ${id} OR order_number = ${id} LIMIT 1;
    `
    if (!orders.length) {
      return NextResponse.json({ success: false, error: 'Order not found' }, { status: 404 })
    }

    const order = orders[0]

    await sql`
      UPDATE orders
      SET
        fulfilment_status = COALESCE(${fulfilment_status || null}, fulfilment_status),
        payment_status = COALESCE(${payment_status || null}, payment_status),
        tracking_reference = COALESCE(${tracking_reference || null}, tracking_reference),
        courier_name = COALESCE(${courier_name || null}, courier_name),
        notes = CASE
          WHEN ${notes || ''} != '' THEN ${notes}
          ELSE notes
        END,
        updated_at = CURRENT_TIMESTAMP
      WHERE id = ${order.id};
    `

    // Log audit
    await logAdminAudit(
      admin_email,
      'update_fulfilment',
      'order',
      order.order_number,
      {
        previous_fulfilment: order.fulfilment_status,
        new_fulfilment: fulfilment_status || order.fulfilment_status,
        tracking_reference,
        courier_name,
      }
    )

    // If marked Delivered or Dispatched, trigger dispatch email if physical
    if (fulfilment_status === 'Delivered' || (fulfilment_status === 'Ready for Delivery' && tracking_reference)) {
      sendBookReleasedCustomerEmail({
        customerEmail: order.customer_email,
        customerName: order.customer_name || 'Reader',
        orderNumber: order.order_number,
        bookTitle: order.book_title || 'Practical Trading Psychology',
        trackingReference: tracking_reference || order.tracking_reference,
        courierName: courier_name || order.courier_name,
      }).catch((err) => console.error('Error sending delivery email:', err))
    }

    return NextResponse.json({
      success: true,
      message: `Order #${order.order_number} status updated successfully.`,
    })
  } catch (error: any) {
    console.error('Update fulfilment error:', error)
    return NextResponse.json({ success: false, error: error?.message }, { status: 500 })
  }
}

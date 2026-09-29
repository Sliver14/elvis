import { NextRequest, NextResponse } from 'next/server'
import { getDb } from '@/lib/db'
import { sendPaymentProofSubmittedCustomerEmail, sendAdminNotification } from '@/lib/email'

export async function POST(request: NextRequest) {
  try {
    const body = await request.json()
    const {
      access_token,
      order_id,
      order_number,
      payment_method,
      reference_number,
      transaction_hash,
      sender_name_or_phone,
      crypto_network,
      amount_submitted,
      currency = 'USD',
      receipt_url,
      notes,
    } = body

    if (!access_token && !order_id && !order_number) {
      return NextResponse.json(
        { success: false, error: 'Order identifier is required' },
        { status: 400 }
      )
    }

    if (!receipt_url && !reference_number && !transaction_hash) {
      return NextResponse.json(
        { success: false, error: 'Please provide a receipt screenshot, transaction reference, or blockchain hash.' },
        { status: 400 }
      )
    }

    const sql = getDb()
    if (!sql) {
      return NextResponse.json({ success: false, error: 'Database unavailable' }, { status: 500 })
    }

    // Lookup order
    const orders = await sql`
      SELECT *
      FROM orders
      WHERE access_token = ${access_token || ''}
         OR id = ${order_id || ''}
         OR order_number = ${order_number || ''}
      LIMIT 1;
    `

    if (!orders.length) {
      return NextResponse.json({ success: false, error: 'Order not found' }, { status: 404 })
    }

    const order = orders[0]

    // Insert payment proof record
    await sql`
      INSERT INTO payment_proofs (
        order_id,
        order_number,
        payment_method,
        reference_number,
        transaction_hash,
        sender_name_or_phone,
        crypto_network,
        amount_submitted,
        currency,
        receipt_url,
        notes,
        status,
        submitted_at
      )
      VALUES (
        ${order.id},
        ${order.order_number},
        ${payment_method || order.payment_method},
        ${reference_number || null},
        ${transaction_hash || null},
        ${sender_name_or_phone || null},
        ${crypto_network || null},
        ${amount_submitted ? Number(amount_submitted) : order.total_amount},
        ${currency || order.currency},
        ${receipt_url || null},
        ${notes || null},
        'Under Review',
        CURRENT_TIMESTAMP
      );
    `

    // Update order payment status to 'Proof Submitted'
    await sql`
      UPDATE orders
      SET
        payment_status = 'Proof Submitted',
        updated_at = CURRENT_TIMESTAMP
      WHERE id = ${order.id};
    `

    const appUrl = process.env.NEXT_PUBLIC_APP_URL || 'http://localhost:3000'
    const trackingUrl = `${appUrl}/order/${order.access_token}`

    // Send confirmation email to customer
    sendPaymentProofSubmittedCustomerEmail({
      customerEmail: order.customer_email,
      customerName: order.customer_name || 'Reader',
      orderNumber: order.order_number,
      paymentMethod: payment_method || order.payment_method,
      trackingUrl,
    }).catch((err) => console.error('Error sending proof confirmation email:', err))

    // Send admin notification
    sendAdminNotification({
      type: 'new_order',
      subject: `Payment Evidence Submitted: #${order.order_number}`,
      title: 'Payment Proof Submitted For Review',
      details: {
        order_number: order.order_number,
        customer_name: order.customer_name,
        customer_email: order.customer_email,
        payment_method: payment_method || order.payment_method,
        reference_or_hash: reference_number || transaction_hash || 'Uploaded Screenshot',
        total_amount: `${Number(order.total_amount).toFixed(2)} ${order.currency}`,
      },
    }).catch((err) => console.error('Error sending admin alert:', err))

    return NextResponse.json({
      success: true,
      message: 'Payment proof submitted successfully and queued for review.',
      payment_status: 'Proof Submitted',
    })
  } catch (error: any) {
    console.error('Payment proof submission error:', error)
    return NextResponse.json(
      { success: false, error: error?.message || 'Failed to submit payment evidence' },
      { status: 500 }
    )
  }
}

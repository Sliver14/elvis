import { NextRequest, NextResponse } from 'next/server'
import crypto from 'crypto'
import { getDb } from '@/lib/db'
import { sendCustomerBookEmail, sendAdminNotification } from '@/lib/email'

const PAYSTACK_SECRET_KEY = process.env.PAYSTACK_SECRET_KEY || ''

export async function POST(request: NextRequest) {
  try {
    const rawBody = await request.text()
    const signature = request.headers.get('x-paystack-signature')

    // Verify webhook signature if PAYSTACK_SECRET_KEY is configured
    if (PAYSTACK_SECRET_KEY) {
      const hash = crypto
        .createHmac('sha512', PAYSTACK_SECRET_KEY)
        .update(rawBody)
        .digest('hex')

      if (hash !== signature) {
        console.warn('Invalid Paystack webhook signature')
        return NextResponse.json({ success: false, error: 'Invalid signature' }, { status: 400 })
      }
    }

    const payload = JSON.parse(rawBody)
    const { event, data } = payload

    if (event === 'charge.success') {
      const reference = data.reference
      const customerEmail = data.customer?.email
      const customerName = data.metadata?.customer_name || data.customer?.first_name || 'Reader'
      const items = data.metadata?.items || []
      const totalAmountFormatted = `$${((data.amount || 0) / 100).toFixed(2)}`

      const sql = getDb()
      if (sql) {
        await sql`
          UPDATE orders
          SET
            status = 'successful',
            pdf_sent = true,
            updated_at = CURRENT_TIMESTAMP
          WHERE reference = ${reference} OR id = ${reference};
        `
      }

      // 1. Send Purchased Ebook / PDF Email to Customer via Resend
      await sendCustomerBookEmail({
        customerEmail,
        customerName,
        orderReference: reference,
        items,
        totalAmount: totalAmountFormatted,
      })

      // 2. Send Admin Notification Email via Resend
      await sendAdminNotification({
        type: 'new_order',
        subject: `New Book Purchase (${totalAmountFormatted}) by ${customerName}`,
        title: 'New Customer Book Order Fulfilled',
        details: {
          order_reference: reference,
          customer_name: customerName,
          customer_email: customerEmail,
          total_paid: totalAmountFormatted,
          books_purchased: items.map((i: any) => `${i.title} (x${i.quantity || 1})`).join(', ') || 'Book Order',
          delivery_status: 'Ebooks & Download links sent via Resend',
          fulfilled_at: new Date().toLocaleString(),
        },
      })

      console.log(`[Paystack Webhook] Successfully processed order ${reference} for ${customerEmail}`)
    }

    return NextResponse.json({ status: true })
  } catch (error: any) {
    console.error('Paystack webhook error:', error)
    return NextResponse.json({ success: false, error: error?.message || 'Webhook processing failed' }, { status: 500 })
  }
}

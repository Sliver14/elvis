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
          WHERE reference = ${reference} OR id = ${reference};
        `
      }

      if (isPresaleOrder && orderRecord) {
        // Presale: Send payment confirmed email explaining book delivery on launch date
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
        // Standard bookstore instant delivery
        await sendCustomerBookEmail({
          customerEmail,
          customerName,
          orderReference: reference,
          items,
          totalAmount: totalAmountFormatted,
        })
      }

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
          delivery_status: isPresaleOrder ? 'Presale Confirmed (Delivery Scheduled on Launch Date)' : 'Ebooks & Download links sent via Resend',
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

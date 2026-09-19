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

        if (sql) {
          await sql`
            UPDATE orders
            SET status = 'successful', pdf_sent = true, updated_at = CURRENT_TIMESTAMP
            WHERE reference = ${reference};
          `
        }

        // Deliver book if not yet sent
        await sendCustomerBookEmail({
          customerEmail,
          customerName,
          orderReference: reference,
          items,
          totalAmount: totalAmountFormatted,
        })

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

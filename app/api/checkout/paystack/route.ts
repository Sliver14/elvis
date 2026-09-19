import { NextRequest, NextResponse } from 'next/server'
import { getDb } from '@/lib/db'

const PAYSTACK_SECRET_KEY = process.env.PAYSTACK_SECRET_KEY || ''

export async function POST(request: NextRequest) {
  try {
    const body = await request.json()
    const { email, name, items, callback_url } = body

    if (!email || !items || !Array.isArray(items) || items.length === 0) {
      return NextResponse.json({ success: false, error: 'Email and items are required' }, { status: 400 })
    }

    // Calculate total amount in USD (and convert to cents/kobo for Paystack)
    const totalDollars = items.reduce((sum: number, item: any) => {
      const priceNum = Number(String(item.price || '0').replace(/[^0-9.]/g, ''))
      return sum + priceNum * (Number(item.quantity) || 1)
    }, 0)

    const amountInCents = Math.round(totalDollars * 100)
    const orderReference = `SEREN-${Date.now()}-${Math.floor(Math.random() * 10000)}`

    const sql = getDb()
    if (sql) {
      await sql`
        INSERT INTO orders (id, reference, customer_email, customer_name, total_amount, currency, status, items)
        VALUES (
          ${orderReference},
          ${orderReference},
          ${email.trim().toLowerCase()},
          ${name || 'Reader'},
          ${totalDollars},
          'USD',
          'pending',
          ${JSON.stringify(items)}::jsonb
        );
      `
    }

    if (!PAYSTACK_SECRET_KEY) {
      // Mock Paystack checkout URL if key is not configured
      console.log(`[Paystack Mock Checkout] Created Order ${orderReference} for $${totalDollars.toFixed(2)} (${email})`)
      return NextResponse.json({
        success: true,
        reference: orderReference,
        authorization_url: `${callback_url || '/'}?paystack_mock_success=true&ref=${orderReference}`,
        access_code: 'mock_access_code',
        mocked: true,
        message: 'Paystack is running in local prototyping mode (configure PAYSTACK_SECRET_KEY for live gateway).',
      })
    }

    // Initialize transaction with Paystack REST API
    const paystackRes = await fetch('https://api.paystack.co/transaction/initialize', {
      method: 'POST',
      headers: {
        Authorization: `Bearer ${PAYSTACK_SECRET_KEY}`,
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({
        email,
        amount: amountInCents,
        currency: 'USD',
        reference: orderReference,
        callback_url: callback_url || `${process.env.NEXT_PUBLIC_APP_URL || 'http://localhost:3000'}/?payment_success=true&ref=${orderReference}`,
        metadata: {
          customer_name: name || 'Reader',
          items,
          custom_fields: [
            {
              display_name: 'Store',
              variable_name: 'store',
              value: 'Serendipity / Elvis',
            },
          ],
        },
      }),
    })

    const paystackData = await paystackRes.json()

    if (!paystackRes.ok || !paystackData.status) {
      console.error('Paystack initialization error:', paystackData)
      return NextResponse.json({
        success: false,
        error: paystackData.message || 'Failed to initialize Paystack payment',
      }, { status: 400 })
    }

    return NextResponse.json({
      success: true,
      reference: orderReference,
      authorization_url: paystackData.data.authorization_url,
      access_code: paystackData.data.access_code,
    })
  } catch (error: any) {
    console.error('Checkout API error:', error)
    return NextResponse.json({ success: false, error: error?.message || 'Payment initiation failed' }, { status: 500 })
  }
}

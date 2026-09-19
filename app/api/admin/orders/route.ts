import { NextRequest, NextResponse } from 'next/server'
import { getDb } from '@/lib/db'
import { isAuthorizedAdmin } from '@/lib/auth'

export async function GET(request: NextRequest) {
  if (!isAuthorizedAdmin(request)) {
    return NextResponse.json({ success: false, error: 'Unauthorized' }, { status: 401 })
  }

  const sql = getDb()
  if (!sql) {
    return NextResponse.json({
      success: true,
      orders: [
        {
          id: 'SEREN-1726000001',
          reference: 'SEREN-1726000001',
          customer_email: 'reader@example.com',
          customer_name: 'David Mills',
          total_amount: '46.00',
          currency: 'USD',
          status: 'successful',
          pdf_sent: true,
          items: [{ title: 'Practical Trading Psychology', quantity: 1, price: '$24.00' }, { title: 'The Art of Attention', quantity: 1, price: '$22.00' }],
          created_at: new Date().toISOString(),
        }
      ],
      source: 'mock'
    })
  }

  try {
    const orders = await sql`
      SELECT id, reference, customer_email, customer_name, total_amount, currency, status, items, pdf_sent, created_at
      FROM orders
      ORDER BY created_at DESC;
    `

    return NextResponse.json({ success: true, orders, source: 'neon' })
  } catch (error: any) {
    console.error('Fetch orders error:', error)
    return NextResponse.json({ success: false, error: error?.message }, { status: 500 })
  }
}

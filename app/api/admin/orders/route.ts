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
      orders: [],
      source: 'unconfigured'
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
    return NextResponse.json({ success: false, error: error?.message, orders: [] }, { status: 500 })
  }
}

import { NextRequest, NextResponse } from 'next/server'
import { getDb, getPaymentSettings } from '@/lib/db'

export async function GET(
  request: NextRequest,
  context: { params: Promise<{ token: string }> }
) {
  try {
    const { token } = await context.params
    if (!token) {
      return NextResponse.json({ success: false, error: 'Access token required' }, { status: 400 })
    }

    const sql = getDb()
    if (!sql) {
      return NextResponse.json({ success: false, error: 'Database unavailable' }, { status: 500 })
    }

    // Lookup by access_token OR order_number (if query allows)
    const orders = await sql`
      SELECT *
      FROM orders
      WHERE access_token = ${token} OR order_number = ${token}
      LIMIT 1;
    `

    if (!orders.length) {
      return NextResponse.json({ success: false, error: 'Order not found' }, { status: 404 })
    }

    const order = orders[0]

    // Fetch submitted payment proofs for this order
    const proofs = await sql`
      SELECT id, payment_method, reference_number, transaction_hash, sender_name_or_phone, crypto_network, amount_submitted, currency, receipt_url, notes, status, submitted_at, rejection_reason
      FROM payment_proofs
      WHERE order_id = ${order.id} OR order_number = ${order.order_number}
      ORDER BY submitted_at DESC;
    `

    // Fetch payment settings to attach current payment instructions & release info
    const settings = await getPaymentSettings()

    // Check if book release has occurred or early download is allowed
    const releaseDate = new Date(settings.expected_release_date || '2026-11-06T09:00:00+01:00')
    const now = new Date()
    const isReleased = now >= releaseDate || settings.early_delivery_enabled
    const isPaidAndEligible = order.payment_status === 'Confirmed' && isReleased

    // Look up entitlement download token if eligible
    let downloadUrl = null
    if (isPaidAndEligible) {
      const entitlements = await sql`
        SELECT download_token FROM book_entitlements WHERE order_id = ${order.id} LIMIT 1;
      `
      if (entitlements.length) {
        downloadUrl = `/api/books/download?token=${entitlements[0].download_token}`
      } else {
        downloadUrl = `/api/books/download?token=${order.access_token}`
      }
    }

    return NextResponse.json({
      success: true,
      order: {
        ...order,
        shipping_address: typeof order.shipping_address === 'string' ? JSON.parse(order.shipping_address) : order.shipping_address,
        items: typeof order.items === 'string' ? JSON.parse(order.items) : order.items,
      },
      proofs: proofs || [],
      settings: {
        bank: settings.bank,
        mtn_momo: settings.mtn_momo,
        vodafone_momo: settings.vodafone_momo,
        btc: settings.btc,
        usdt: settings.usdt,
        expected_release_date: settings.expected_release_date,
      },
      release_info: {
        is_released: isReleased,
        release_date: settings.expected_release_date,
        can_download: isPaidAndEligible,
        download_url: downloadUrl,
      },
    })
  } catch (error: any) {
    console.error('Fetch order error:', error)
    return NextResponse.json({ success: false, error: error?.message || 'Failed to fetch order' }, { status: 500 })
  }
}

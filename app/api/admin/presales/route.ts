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
      stats: {
        total_orders: 0,
        awaiting_payment: 0,
        under_review: 0,
        confirmed_count: 0,
        rejected_count: 0,
        verified_revenue: 0,
        sales_by_method: {},
        sales_by_format: {},
      },
    })
  }

  try {
    const searchParams = request.nextUrl.searchParams
    const search = searchParams.get('search') || ''
    const paymentStatus = searchParams.get('payment_status') || ''
    const fulfilmentStatus = searchParams.get('fulfilment_status') || ''
    const paymentMethod = searchParams.get('payment_method') || ''
    const bookFormat = searchParams.get('book_format') || ''

    // Fetch all orders
    const rawOrders = await sql`
      SELECT *
      FROM orders
      ORDER BY created_at DESC;
    `

    // Fetch all proofs
    const rawProofs = await sql`
      SELECT *
      FROM payment_proofs
      ORDER BY submitted_at DESC;
    `

    // Map proofs to orders
    const proofsByOrderId = new Map<string, any[]>()
    for (const proof of rawProofs) {
      const key = proof.order_id || proof.order_number
      if (!proofsByOrderId.has(key)) proofsByOrderId.set(key, [])
      proofsByOrderId.get(key)!.push(proof)
    }

    // Calculate aggregated metrics
    let totalOrders = 0
    let awaitingPayment = 0
    let underReview = 0
    let confirmedCount = 0
    let rejectedCount = 0
    let verifiedRevenue = 0
    const salesByMethod: Record<string, { count: number; revenue: number }> = {}
    const salesByFormat: Record<string, { count: number; revenue: number }> = {}

    const orders = rawOrders.map((o: any) => {
      totalOrders++
      const pStatus = o.payment_status || (o.status === 'successful' ? 'Confirmed' : 'Awaiting Payment')
      const totalAmt = Number(o.total_amount) || 0
      const method = o.payment_method || 'bank_transfer'
      const format = o.book_format || 'digital_ebook'

      if (pStatus === 'Awaiting Payment') awaitingPayment++
      else if (pStatus === 'Proof Submitted' || pStatus === 'Under Review') underReview++
      else if (pStatus === 'Confirmed') {
        confirmedCount++
        verifiedRevenue += totalAmt
      } else if (pStatus === 'Rejected') rejectedCount++

      // Aggregate sales by method
      if (!salesByMethod[method]) salesByMethod[method] = { count: 0, revenue: 0 }
      salesByMethod[method].count++
      if (pStatus === 'Confirmed') salesByMethod[method].revenue += totalAmt

      // Aggregate sales by format
      if (!salesByFormat[format]) salesByFormat[format] = { count: 0, revenue: 0 }
      salesByFormat[format].count++
      if (pStatus === 'Confirmed') salesByFormat[format].revenue += totalAmt

      const orderProofs = proofsByOrderId.get(o.id) || proofsByOrderId.get(o.order_number) || []

      return {
        ...o,
        payment_status: pStatus,
        fulfilment_status: o.fulfilment_status || (pStatus === 'Confirmed' ? 'Awaiting Book Release' : 'Pending Payment'),
        shipping_address: typeof o.shipping_address === 'string' ? JSON.parse(o.shipping_address) : o.shipping_address,
        items: typeof o.items === 'string' ? JSON.parse(o.items) : o.items,
        proofs: orderProofs,
      }
    })

    // Filter orders according to search parameters
    const filteredOrders = orders.filter((o: any) => {
      if (paymentStatus && paymentStatus !== 'all' && o.payment_status !== paymentStatus) return false
      if (fulfilmentStatus && fulfilmentStatus !== 'all' && o.fulfilment_status !== fulfilmentStatus) return false
      if (paymentMethod && paymentMethod !== 'all' && o.payment_method !== paymentMethod) return false
      if (bookFormat && bookFormat !== 'all' && o.book_format !== bookFormat) return false
      if (search) {
        const q = search.toLowerCase()
        const matchName = o.customer_name?.toLowerCase().includes(q)
        const matchEmail = o.customer_email?.toLowerCase().includes(q)
        const matchNumber = o.order_number?.toLowerCase().includes(q) || o.reference?.toLowerCase().includes(q)
        if (!matchName && !matchEmail && !matchNumber) return false
      }
      return true
    })

    return NextResponse.json({
      success: true,
      orders: filteredOrders,
      stats: {
        total_orders: totalOrders,
        awaiting_payment: awaitingPayment,
        under_review: underReview,
        confirmed_count: confirmedCount,
        rejected_count: rejectedCount,
        verified_revenue: verifiedRevenue,
        sales_by_method: salesByMethod,
        sales_by_format: salesByFormat,
      },
    })
  } catch (error: any) {
    console.error('Fetch admin presales error:', error)
    return NextResponse.json({ success: false, error: error?.message }, { status: 500 })
  }
}

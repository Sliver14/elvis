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
      stats: {
        booksCount: 0,
        subscribersCount: 0,
        monthlyVisits: 0,
        salesCount: 0,
        revenue: 0,
        inquiriesCount: 0,
        registrationsCount: 0,
      },
      recentActivity: [],
      source: 'unconfigured'
    })
  }

  try {
    const [booksRes, subsRes, ordersRes, messagesRes, regRes, recentOrders, recentMessages] = await Promise.all([
      sql`SELECT COUNT(*) FROM books;`,
      sql`SELECT COUNT(*) FROM newsletter_subscribers;`,
      sql`SELECT COUNT(*), COALESCE(SUM(total_amount), 0) as revenue FROM orders WHERE status = 'successful';`,
      sql`SELECT COUNT(*) FROM contact_messages;`,
      sql`SELECT COUNT(*) FROM launch_registrations;`,
      sql`SELECT reference, customer_name, customer_email, total_amount, created_at FROM orders ORDER BY created_at DESC LIMIT 5;`,
      sql`SELECT name, email, created_at FROM contact_messages ORDER BY created_at DESC LIMIT 5;`,
    ])

    const booksCount = Number(booksRes[0]?.count || 0)
    const subscribersCount = Number(subsRes[0]?.count || 0)
    const salesCount = Number(ordersRes[0]?.count || 0)
    const revenue = Number(ordersRes[0]?.revenue || 0)
    const inquiriesCount = Number(messagesRes[0]?.count || 0)
    const registrationsCount = Number(regRes[0]?.count || 0)

    const recentActivity = [
      ...recentOrders.map((o: any) => ({
        type: 'order',
        title: `Order #${o.reference.slice(-6)}`,
        desc: `${o.customer_name || o.customer_email} purchased books ($${Number(o.total_amount).toFixed(2)})`,
        time: new Date(o.created_at).toLocaleDateString(),
      })),
      ...recentMessages.map((m: any) => ({
        type: 'message',
        title: `Inquiry from ${m.name}`,
        desc: m.email,
        time: new Date(m.created_at).toLocaleDateString(),
      })),
    ].slice(0, 5)

    return NextResponse.json({
      success: true,
      stats: {
        booksCount,
        subscribersCount,
        monthlyVisits: 0,
        salesCount,
        revenue,
        inquiriesCount,
        registrationsCount,
      },
      recentActivity,
      source: 'neon'
    })

  } catch (error: any) {
    console.error('Fetch admin stats error:', error)
    return NextResponse.json({ success: false, error: error?.message }, { status: 500 })
  }
}


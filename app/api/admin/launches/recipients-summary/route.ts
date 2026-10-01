import { NextRequest, NextResponse } from 'next/server'
import { isAuthorizedAdmin } from '@/lib/auth'
import {
  getDeduplicatedLaunchRecipients,
  getConfirmedPresaleOrders,
  getPaymentSettings,
  getDb,
  DEFAULT_LAUNCH,
} from '@/lib/db'

export async function GET(request: NextRequest) {
  if (!isAuthorizedAdmin(request)) {
    return NextResponse.json({ success: false, error: 'Unauthorized' }, { status: 401 })
  }

  try {
    const searchParams = request.nextUrl.searchParams
    const launchId = searchParams.get('launch_id') || undefined

    const [audienceSummary, presaleOrders, paymentSettings] = await Promise.all([
      getDeduplicatedLaunchRecipients({ launchId }),
      getConfirmedPresaleOrders({ launchId }),
      getPaymentSettings(),
    ])

    const sql = getDb()
    let launchTitle = DEFAULT_LAUNCH.title
    let launchDate = paymentSettings.expected_release_date || DEFAULT_LAUNCH.launch_date

    if (sql && launchId) {
      const l = await sql`SELECT title, launch_date FROM book_launches WHERE id = ${launchId} LIMIT 1;`
      if (l.length) {
        launchTitle = l[0].title
        launchDate = l[0].launch_date
      }
    } else if (sql) {
      const active = await sql`SELECT title, launch_date FROM book_launches WHERE is_active = true ORDER BY updated_at DESC LIMIT 1;`
      if (active.length) {
        launchTitle = active[0].title
        launchDate = active[0].launch_date
      }
    }

    return NextResponse.json({
      success: true,
      summary: {
        launch_title: launchTitle,
        launch_date: launchDate,
        waitlist_count: audienceSummary.waitlistCount,
        newsletter_count: audienceSummary.newsletterCount,
        total_unique_recipients: audienceSummary.totalUnique,
        confirmed_presale_orders_count: presaleOrders.count,
        early_delivery_enabled: paymentSettings.early_delivery_enabled,
      },
    })
  } catch (error: any) {
    console.error('Recipients summary error:', error)
    return NextResponse.json({ success: false, error: error?.message }, { status: 500 })
  }
}

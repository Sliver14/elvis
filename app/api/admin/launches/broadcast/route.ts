import { NextRequest, NextResponse } from 'next/server'
import crypto from 'crypto'
import { isAuthorizedAdmin } from '@/lib/auth'
import {
  getDb,
  getDeduplicatedLaunchRecipients,
  recordBroadcastCampaign,
  logAdminAudit,
  DEFAULT_LAUNCH,
} from '@/lib/db'
import { sendBulkLaunchNotificationEmails } from '@/lib/email'

export async function POST(request: NextRequest) {
  if (!isAuthorizedAdmin(request)) {
    return NextResponse.json({ success: false, error: 'Unauthorized' }, { status: 401 })
  }

  try {
    const body = await request.json()
    const {
      launch_id,
      subject,
      custom_message,
      scheduled_at,
      include_waitlist = true,
      include_newsletter = true,
      admin_email = 'hello@elvisjusticebooks.com',
    } = body

    const sql = getDb()
    let launchTitle = DEFAULT_LAUNCH.title
    let launchDate = DEFAULT_LAUNCH.launch_date
    let tagline = DEFAULT_LAUNCH.tagline || 'Process over profit. Win in the mind first.'

    if (sql && launch_id) {
      const launchRes = await sql`
        SELECT title, tagline, launch_date FROM book_launches WHERE id = ${launch_id} LIMIT 1;
      `
      if (launchRes.length) {
        launchTitle = launchRes[0].title
        launchDate = launchRes[0].launch_date
        tagline = launchRes[0].tagline || tagline
      }
    } else if (sql) {
      const activeRes = await sql`
        SELECT title, tagline, launch_date FROM book_launches WHERE is_active = true ORDER BY updated_at DESC LIMIT 1;
      `
      if (activeRes.length) {
        launchTitle = activeRes[0].title
        launchDate = activeRes[0].launch_date
        tagline = activeRes[0].tagline || tagline
      }
    }

    // Fetch deduplicated recipients
    const { recipients, waitlistCount, newsletterCount, totalUnique } =
      await getDeduplicatedLaunchRecipients({
        launchId: launch_id || undefined,
        includeWaitlist: Boolean(include_waitlist),
        includeNewsletter: Boolean(include_newsletter),
      })

    if (recipients.length === 0) {
      return NextResponse.json({
        success: false,
        error: 'No active recipients found in selected audience lists (Waitlist / Newsletter).',
      }, { status: 400 })
    }

    const appUrl = process.env.NEXT_PUBLIC_APP_URL || 'http://localhost:3000'
    const finalSubject = subject || `Out Now: ${launchTitle} by Dr Elvis Justice Bedi`

    // Validate scheduled_at if provided
    let effectiveScheduledAt: string | undefined = undefined
    if (scheduled_at) {
      const parsedDate = new Date(scheduled_at)
      if (isNaN(parsedDate.getTime())) {
        return NextResponse.json({ success: false, error: 'Invalid scheduled date format.' }, { status: 400 })
      }
      effectiveScheduledAt = parsedDate.toISOString()
    }

    // Dispatch bulk emails with scheduled sending
    const result = await sendBulkLaunchNotificationEmails({
      recipients,
      launchTitle,
      authorName: 'Dr Elvis Justice Bedi',
      launchDate: String(launchDate),
      tagline,
      customMessage: custom_message,
      storeUrl: appUrl,
      previewUrl: `${appUrl}/preview/practical-trading-psychology`,
      scheduledAt: effectiveScheduledAt,
    })

    if (!result.success && !result.totalSent) {
      return NextResponse.json({
        success: false,
        error: result.error || 'Failed to dispatch broadcast batch.',
      }, { status: 500 })
    }

    const campaignId = `camp_launch_${Date.now()}_${crypto.randomBytes(3).toString('hex')}`

    // Record Broadcast Campaign in database
    await recordBroadcastCampaign({
      id: campaignId,
      campaignType: 'launch_announcement',
      launchId: launch_id || DEFAULT_LAUNCH.id,
      subject: finalSubject,
      totalRecipients: recipients.length,
      scheduledAt: effectiveScheduledAt,
      status: effectiveScheduledAt ? 'scheduled' : 'dispatched',
      sentBy: admin_email,
      details: {
        waitlist_count: waitlistCount,
        newsletter_count: newsletterCount,
        total_unique: totalUnique,
        custom_message: custom_message || null,
        mocked: Boolean(result.mocked),
        scheduled_at: effectiveScheduledAt,
      },
    })

    // Log Admin Audit Log
    await logAdminAudit(
      admin_email,
      effectiveScheduledAt ? 'schedule_launch_broadcast' : 'send_launch_broadcast',
      'launch',
      launch_id || DEFAULT_LAUNCH.id,
      {
        campaign_id: campaignId,
        subject: finalSubject,
        recipients_count: recipients.length,
        waitlist_count: waitlistCount,
        newsletter_count: newsletterCount,
        scheduled_at: effectiveScheduledAt,
      }
    )

    return NextResponse.json({
      success: true,
      campaign_id: campaignId,
      total_recipients: recipients.length,
      waitlist_count: waitlistCount,
      newsletter_count: newsletterCount,
      total_unique: totalUnique,
      scheduled: Boolean(effectiveScheduledAt),
      scheduled_at: effectiveScheduledAt,
      message: effectiveScheduledAt
        ? `Launch announcement successfully scheduled for ${new Date(effectiveScheduledAt).toLocaleString()} to ${totalUnique} unique subscribers (zero duplicates).`
        : `Launch announcement successfully dispatched to ${totalUnique} unique waitlist & newsletter subscribers (zero duplicates).`,
    })
  } catch (error: any) {
    console.error('Launch broadcast error:', error)
    return NextResponse.json({ success: false, error: error?.message || 'Broadcast failed' }, { status: 500 })
  }
}

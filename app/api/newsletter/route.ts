import { NextRequest, NextResponse } from 'next/server'
import { getDb } from '@/lib/db'
import { sendAdminNotification } from '@/lib/email'

export async function POST(request: NextRequest) {
  try {
    const body = await request.json()
    const { email } = body

    if (!email || !email.includes('@')) {
      return NextResponse.json({ success: false, error: 'Valid email address is required' }, { status: 400 })
    }

    const sql = getDb()
    if (sql) {
      await sql`
        INSERT INTO newsletter_subscribers (email)
        VALUES (${email.trim().toLowerCase()})
        ON CONFLICT (email) DO NOTHING;
      `
    }

    // Trigger Admin Notification Email via Resend
    await sendAdminNotification({
      type: 'newsletter',
      subject: `New Newsletter Subscriber: ${email}`,
      title: 'New Reading List Subscriber',
      details: {
        subscriber_email: email,
        source: 'Serendipity / Elvis Newsletter Form',
        subscribed_at: new Date().toLocaleString(),
      },
    })

    return NextResponse.json({ success: true, message: "You're on the list." })
  } catch (error: any) {
    console.error('Newsletter subscribe error:', error)
    return NextResponse.json({ success: false, error: error?.message || 'Subscription failed' }, { status: 500 })
  }
}

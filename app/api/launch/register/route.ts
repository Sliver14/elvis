import { NextRequest, NextResponse } from 'next/server'
import { getDb } from '@/lib/db'
import { sendAdminNotification, sendLaunchConfirmationEmail } from '@/lib/email'

export async function POST(request: NextRequest) {
  try {
    const body = await request.json()
    const { name, email, phone, launch_id, launch_title, launch_date, author_name, agreed_updates } = body

    if (!name || !email) {
      return NextResponse.json({ success: false, error: 'Name and email are required' }, { status: 400 })
    }

    const isAgreed = agreed_updates !== false
    const sql = getDb()
    let recordId: any = null

    if (sql) {
      // Find active launch id if not provided
      let effectiveLaunchId = launch_id
      if (!effectiveLaunchId) {
        const active = await sql`SELECT id, title FROM book_launches WHERE is_active = true LIMIT 1;`
        if (active.length) {
          effectiveLaunchId = active[0].id
        }
      }

      if (effectiveLaunchId) {
        // Ensure column exists gracefully
        try {
          await sql`ALTER TABLE launch_registrations ADD COLUMN IF NOT EXISTS agreed_updates BOOLEAN DEFAULT true;`
        } catch {
          // Ignore if already exists
        }

        const result = await sql`
          INSERT INTO launch_registrations (launch_id, name, email, phone, agreed_updates)
          VALUES (${effectiveLaunchId}, ${name}, ${email}, ${phone || ''}, ${isAgreed})
          RETURNING id, created_at;
        `
        recordId = result[0]?.id

        // If opted into updates, also enroll into general reading list newsletter
        if (isAgreed) {
          try {
            await sql`
              INSERT INTO newsletter_subscribers (email)
              VALUES (${email})
              ON CONFLICT (email) DO NOTHING;
            `
          } catch {
            // Ignore conflict or subscriber table error
          }
        }
      }
    }

    // 1. Send Priority Confirmation & Welcome Email to Reader
    await sendLaunchConfirmationEmail({
      readerEmail: email,
      readerName: name,
      launchTitle: launch_title || 'Practical Trading Psychology',
      authorName: author_name || 'Dr Elvis Justice Bedi',
      launchDate: launch_date,
    })

    // 2. Trigger Admin Notification Alert Email
    await sendAdminNotification({
      type: 'launch_registration',
      subject: `New Book Launch Registration: ${name} (${launch_title || 'Upcoming Launch'})`,
      title: 'New Book Launch Registration',
      details: {
        reader_name: name,
        reader_email: email,
        reader_phone: phone || 'Not provided',
        launch_title: launch_title || 'Active Launch',
        agreed_to_updates: isAgreed ? 'Yes (Opted In)' : 'No',
        registration_id: recordId ? `#${recordId}` : 'Recorded',
        timestamp: new Date().toLocaleString(),
      },
    })

    return NextResponse.json({
      success: true,
      message: 'You have been successfully registered for the book launch and priority confirmation has been dispatched.',
      id: recordId,
      opted_in: isAgreed,
    })
  } catch (error: any) {
    console.error('Launch registration error:', error)
    return NextResponse.json({ success: false, error: error?.message || 'Registration failed' }, { status: 500 })
  }
}


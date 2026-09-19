import { NextRequest, NextResponse } from 'next/server'
import { getDb, DEFAULT_LAUNCH } from '@/lib/db'
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
      // 1. Ensure table and column exist
      try {
        await sql`
          CREATE TABLE IF NOT EXISTS launch_registrations (
            id SERIAL PRIMARY KEY,
            launch_id VARCHAR(255) NOT NULL REFERENCES book_launches(id) ON DELETE CASCADE,
            name VARCHAR(255) NOT NULL,
            email VARCHAR(255) NOT NULL,
            phone VARCHAR(100),
            agreed_updates BOOLEAN DEFAULT true,
            created_at TIMESTAMPTZ DEFAULT CURRENT_TIMESTAMP
          );
        `
        await sql`ALTER TABLE launch_registrations ADD COLUMN IF NOT EXISTS agreed_updates BOOLEAN DEFAULT true;`
      } catch {
        // Table or column already ready
      }

      // 2. Resolve a valid launch_id that exists in book_launches
      let effectiveLaunchId = launch_id
      if (effectiveLaunchId) {
        const check = await sql`SELECT id FROM book_launches WHERE id = ${effectiveLaunchId} LIMIT 1;`
        if (!check.length) {
          effectiveLaunchId = null
        }
      }

      if (!effectiveLaunchId) {
        const active = await sql`SELECT id, title FROM book_launches WHERE is_active = true ORDER BY updated_at DESC LIMIT 1;`
        if (active.length) {
          effectiveLaunchId = active[0].id
        } else {
          const recent = await sql`SELECT id FROM book_launches ORDER BY created_at DESC LIMIT 1;`
          if (recent.length) {
            effectiveLaunchId = recent[0].id
          } else {
            // Seed default launch if table empty
            await sql`
              INSERT INTO book_launches (id, slug, title, tagline, intro, description, themes, cover_image, launch_date, is_active)
              VALUES (${DEFAULT_LAUNCH.id}, ${DEFAULT_LAUNCH.slug}, ${DEFAULT_LAUNCH.title}, ${DEFAULT_LAUNCH.tagline}, ${DEFAULT_LAUNCH.intro}, ${DEFAULT_LAUNCH.description}, ${DEFAULT_LAUNCH.themes}::jsonb, ${DEFAULT_LAUNCH.cover_image}, ${DEFAULT_LAUNCH.launch_date}, ${DEFAULT_LAUNCH.is_active})
              ON CONFLICT (id) DO NOTHING;
            `
            effectiveLaunchId = DEFAULT_LAUNCH.id
          }
        }
      }

      if (effectiveLaunchId) {
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


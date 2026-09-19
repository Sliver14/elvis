import { NextRequest, NextResponse } from 'next/server'
import { getDb } from '@/lib/db'
import { sendAdminNotification } from '@/lib/email'

export async function POST(request: NextRequest) {
  try {
    const body = await request.json()
    const { name, email, phone, launch_id, launch_title } = body

    if (!name || !email) {
      return NextResponse.json({ success: false, error: 'Name and email are required' }, { status: 400 })
    }

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
        const result = await sql`
          INSERT INTO launch_registrations (launch_id, name, email, phone)
          VALUES (${effectiveLaunchId}, ${name}, ${email}, ${phone || ''})
          RETURNING id, created_at;
        `
        recordId = result[0]?.id
      }
    }

    // Trigger Admin Notification Email via Resend
    await sendAdminNotification({
      type: 'launch_registration',
      subject: `New Book Launch Registration: ${name} (${launch_title || 'Upcoming Launch'})`,
      title: 'New Book Launch Registration',
      details: {
        reader_name: name,
        reader_email: email,
        reader_phone: phone || 'Not provided',
        launch_title: launch_title || 'Active Launch',
        registration_id: recordId ? `#${recordId}` : 'Recorded',
        timestamp: new Date().toLocaleString(),
      },
    })

    return NextResponse.json({
      success: true,
      message: 'You have been successfully registered for the book launch.',
      id: recordId
    })
  } catch (error: any) {
    console.error('Launch registration error:', error)
    return NextResponse.json({ success: false, error: error?.message || 'Registration failed' }, { status: 500 })
  }
}

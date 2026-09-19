import { NextRequest, NextResponse } from 'next/server'
import { getDb } from '@/lib/db'
import { sendAdminNotification } from '@/lib/email'

export async function POST(request: NextRequest) {
  try {
    const body = await request.json()
    const { name, email, message } = body

    if (!name || !email || !message) {
      return NextResponse.json({ success: false, error: 'Name, email, and message are required' }, { status: 400 })
    }

    const sql = getDb()
    let messageId: any = null

    if (sql) {
      const result = await sql`
        INSERT INTO contact_messages (name, email, message)
        VALUES (${name}, ${email.trim().toLowerCase()}, ${message})
        RETURNING id, created_at;
      `
      messageId = result[0]?.id
    }

    // Trigger Admin Notification Email via Resend
    await sendAdminNotification({
      type: 'contact',
      subject: `New Reader Inquiry from ${name}`,
      title: 'New Storefront Contact Message',
      details: {
        sender_name: name,
        sender_email: email,
        message_content: message,
        inquiry_id: messageId ? `#${messageId}` : 'Recorded',
        received_at: new Date().toLocaleString(),
      },
    })

    return NextResponse.json({ success: true, message: "Thank you for writing. We'll be in touch soon." })
  } catch (error: any) {
    console.error('Contact form error:', error)
    return NextResponse.json({ success: false, error: error?.message || 'Failed to submit message' }, { status: 500 })
  }
}

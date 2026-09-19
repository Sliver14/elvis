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
      messages: [],
      source: 'unconfigured'
    })
  }

  try {
    const messages = await sql`
      SELECT id, name, email, message, created_at
      FROM contact_messages
      ORDER BY created_at DESC;
    `

    return NextResponse.json({ success: true, messages, source: 'neon' })
  } catch (error: any) {
    console.error('Fetch contact messages error:', error)
    return NextResponse.json({ success: false, error: error?.message, messages: [] }, { status: 500 })
  }
}

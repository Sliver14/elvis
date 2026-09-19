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
      subscribers: [],
      source: 'unconfigured'
    })
  }

  try {
    const subscribers = await sql`
      SELECT id, email, created_at
      FROM newsletter_subscribers
      ORDER BY created_at DESC;
    `

    return NextResponse.json({ success: true, subscribers, source: 'neon' })
  } catch (error: any) {
    console.error('Fetch subscribers error:', error)
    return NextResponse.json({ success: false, error: error?.message, subscribers: [] }, { status: 500 })
  }
}

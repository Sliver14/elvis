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
      subscribers: [
        { id: 1, email: 'elena.read@example.com', created_at: new Date().toISOString() },
        { id: 2, email: 'investor.mind@example.com', created_at: new Date(Date.now() - 43200000).toISOString() },
      ],
      source: 'mock'
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
    return NextResponse.json({ success: false, error: error?.message }, { status: 500 })
  }
}

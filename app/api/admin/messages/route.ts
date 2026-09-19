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
      messages: [
        { id: 1, name: 'Claire Dubois', email: 'claire@example.com', message: 'Hello! Are you considering publishing limited hardcover editions?', created_at: new Date().toISOString() },
        { id: 2, name: 'Arthur Pendelton', email: 'arthur@example.com', message: 'Inquiring about bulk orders for our financial study group.', created_at: new Date(Date.now() - 86400000).toISOString() },
      ],
      source: 'mock'
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
    return NextResponse.json({ success: false, error: error?.message }, { status: 500 })
  }
}

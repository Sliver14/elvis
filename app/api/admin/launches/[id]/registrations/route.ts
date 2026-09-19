import { NextRequest, NextResponse } from 'next/server'
import { getDb } from '@/lib/db'
import { isAuthorizedAdmin } from '@/lib/auth'

export async function GET(request: NextRequest, { params }: { params: Promise<{ id: string }> }) {
  if (!isAuthorizedAdmin(request)) {
    return NextResponse.json({ success: false, error: 'Unauthorized' }, { status: 401 })
  }

  const { id } = await params
  const sql = getDb()

  if (!sql) {
    return NextResponse.json({
      success: true,
      registrations: [
        { id: 1, name: 'Marcus Sterling', email: 'marcus@example.com', phone: '+44 7700 900077', created_at: new Date().toISOString() },
        { id: 2, name: 'Elena Rostova', email: 'elena@example.com', phone: '+1 555 0192', created_at: new Date().toISOString() },
      ],
      source: 'mock'
    })
  }

  try {
    const registrations = await sql`
      SELECT id, name, email, phone, created_at
      FROM launch_registrations
      WHERE launch_id = ${id}
      ORDER BY created_at DESC;
    `

    return NextResponse.json({ success: true, registrations, count: registrations.length })
  } catch (error: any) {
    console.error('Fetch launch registrations error:', error)
    return NextResponse.json({ success: false, error: error?.message }, { status: 500 })
  }
}

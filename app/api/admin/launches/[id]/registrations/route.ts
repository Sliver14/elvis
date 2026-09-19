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
      registrations: [],
      count: 0,
      source: 'unconfigured'
    })
  }

  try {
    const registrations = await sql`
      SELECT id, name, email, phone, agreed_updates, created_at
      FROM launch_registrations
      WHERE launch_id = ${id}
      ORDER BY created_at DESC;
    `

    return NextResponse.json({ success: true, registrations, count: registrations.length })
  } catch (error: any) {
    console.error('Fetch launch registrations error:', error)
    return NextResponse.json({ success: false, error: error?.message, registrations: [], count: 0 }, { status: 500 })
  }
}

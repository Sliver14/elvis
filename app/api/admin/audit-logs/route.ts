import { NextRequest, NextResponse } from 'next/server'
import { getDb } from '@/lib/db'
import { isAuthorizedAdmin } from '@/lib/auth'

export async function GET(request: NextRequest) {
  if (!isAuthorizedAdmin(request)) {
    return NextResponse.json({ success: false, error: 'Unauthorized' }, { status: 401 })
  }

  const sql = getDb()
  if (!sql) {
    return NextResponse.json({ success: true, logs: [] })
  }

  try {
    const logs = await sql`
      SELECT id, admin_email, action, entity_type, entity_id, details, created_at
      FROM admin_audit_logs
      ORDER BY created_at DESC
      LIMIT 100;
    `

    return NextResponse.json({
      success: true,
      logs: logs.map((l: any) => ({
        ...l,
        details: typeof l.details === 'string' ? JSON.parse(l.details) : l.details,
      })),
    })
  } catch (error: any) {
    console.error('Fetch audit logs error:', error)
    return NextResponse.json({ success: false, error: error?.message }, { status: 500 })
  }
}

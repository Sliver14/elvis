import { NextResponse } from 'next/server'
import { initDatabase } from '@/lib/db'

export async function GET() {
  try {
    const result = await initDatabase()
    return NextResponse.json({ success: true, ...result })
  } catch (error: any) {
    console.error('Init DB error:', error)
    return NextResponse.json({ success: false, error: error?.message || 'Database initialization failed' }, { status: 500 })
  }
}

export async function POST() {
  return GET()
}

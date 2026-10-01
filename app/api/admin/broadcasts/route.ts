import { NextRequest, NextResponse } from 'next/server'
import { isAuthorizedAdmin } from '@/lib/auth'
import { getBroadcastCampaigns } from '@/lib/db'

export async function GET(request: NextRequest) {
  if (!isAuthorizedAdmin(request)) {
    return NextResponse.json({ success: false, error: 'Unauthorized' }, { status: 401 })
  }

  try {
    const campaigns = await getBroadcastCampaigns(30)
    return NextResponse.json({ success: true, campaigns })
  } catch (error: any) {
    console.error('Fetch broadcast campaigns error:', error)
    return NextResponse.json({ success: false, error: error?.message, campaigns: [] }, { status: 500 })
  }
}

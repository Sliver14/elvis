import { NextRequest, NextResponse } from 'next/server'
import { getBookPreview } from '@/lib/db'

export async function GET(request: NextRequest) {
  try {
    const preview = await getBookPreview('practical-trading-psychology')

    if (!preview.is_published) {
      return NextResponse.json(
        { success: false, error: 'Preview is currently unpublished.' },
        { status: 404 }
      )
    }

    return NextResponse.json({
      success: true,
      preview,
    })
  } catch (error: any) {
    console.error('Fetch preview error:', error)
    return NextResponse.json(
      { success: false, error: error?.message || 'Failed to fetch preview' },
      { status: 500 }
    )
  }
}

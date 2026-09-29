import { NextRequest, NextResponse } from 'next/server'
import { getBookPreview, saveBookPreview, logAdminAudit } from '@/lib/db'
import { isAuthorizedAdmin } from '@/lib/auth'
import { BookPreview } from '@/lib/types'

export async function GET(request: NextRequest) {
  if (!isAuthorizedAdmin(request)) {
    return NextResponse.json({ success: false, error: 'Unauthorized' }, { status: 401 })
  }

  try {
    const preview = await getBookPreview('practical-trading-psychology')
    return NextResponse.json({ success: true, preview })
  } catch (error: any) {
    console.error('Fetch preview error:', error)
    return NextResponse.json({ success: false, error: error?.message }, { status: 500 })
  }
}

export async function POST(request: NextRequest) {
  if (!isAuthorizedAdmin(request)) {
    return NextResponse.json({ success: false, error: 'Unauthorized' }, { status: 401 })
  }

  try {
    const body = await request.json()
    const { preview, admin_email = 'hello@elvisjusticebooks.com' } = body

    if (!preview) {
      return NextResponse.json({ success: false, error: 'Preview data required' }, { status: 400 })
    }

    const saved = await saveBookPreview(preview as BookPreview)
    if (!saved) {
      return NextResponse.json({ success: false, error: 'Failed to save preview' }, { status: 500 })
    }

    await logAdminAudit(admin_email, 'update_preview', 'book_preview', preview.slug || 'practical-trading-psychology', {
      chapters_count: preview.chapters?.length || 0,
      is_published: preview.is_published,
    })

    return NextResponse.json({
      success: true,
      message: 'Book preview content updated successfully.',
      preview,
    })
  } catch (error: any) {
    console.error('Save preview error:', error)
    return NextResponse.json({ success: false, error: error?.message }, { status: 500 })
  }
}

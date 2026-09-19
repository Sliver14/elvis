import { NextRequest, NextResponse } from 'next/server'
import { uploadImageToCloudinary } from '@/lib/cloudinary'
import { isAuthorizedAdmin } from '@/lib/auth'

export async function POST(request: NextRequest) {
  if (!isAuthorizedAdmin(request)) {
    return NextResponse.json({ success: false, error: 'Unauthorized' }, { status: 401 })
  }

  try {
    const formData = await request.formData()
    const file = formData.get('file') as File | null
    const folder = (formData.get('folder') as string) || 'serendipity-books'

    if (!file) {
      return NextResponse.json({ success: false, error: 'No file provided' }, { status: 400 })
    }

    const bytes = await file.arrayBuffer()
    const buffer = Buffer.from(bytes)

    const uploadResult = await uploadImageToCloudinary(buffer, folder)

    if (!uploadResult.success) {
      return NextResponse.json({ success: false, error: uploadResult.error || 'Upload failed' }, { status: 500 })
    }

    return NextResponse.json({
      success: true,
      url: uploadResult.url,
      public_id: uploadResult.public_id,
    })
  } catch (error: any) {
    console.error('Upload endpoint error:', error)
    return NextResponse.json({ success: false, error: error?.message || 'Upload processing error' }, { status: 500 })
  }
}

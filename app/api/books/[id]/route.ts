import { NextRequest, NextResponse } from 'next/server'
import { getDb } from '@/lib/db'
import { isAuthorizedAdmin } from '@/lib/auth'

const AUTHOR_NAME = 'Dr Elvis Justice Bedi'
const AUTHOR_IMAGE = '/elvis.jpeg'
const AUTHOR_BIO =
  'Dr Elvis Justice Bedi is a trader, educator, and author dedicated to helping people understand the psychology behind financial decision-making. Through his work in trading and education, he explores discipline, emotional control, self-awareness, and the habits that turn uncertainty into a more thoughtful process. Practical Trading Psychology brings together his belief that lasting progress begins with mastering the mind before pursuing the outcome.'

export async function PUT(request: NextRequest, { params }: { params: Promise<{ id: string }> }) {
  if (!isAuthorizedAdmin(request)) {
    return NextResponse.json({ success: false, error: 'Unauthorized' }, { status: 401 })
  }

  const { id } = await params
  const sql = getDb()
  if (!sql) {
    return NextResponse.json({ success: false, error: 'Database not connected' }, { status: 500 })
  }

  try {
    const body = await request.json()
    const { title, category, price, description, image, pdf_url, featured } = body

    const updated = await sql`
      UPDATE books
      SET
        title = COALESCE(${title}, title),
        category = COALESCE(${category}, category),
        price = COALESCE(${price}, price),
        description = COALESCE(${description}, description),
        image = COALESCE(${image}, image),
        pdf_url = COALESCE(${pdf_url}, pdf_url),
        featured = COALESCE(${featured}, featured),
        updated_at = CURRENT_TIMESTAMP
      WHERE id = ${id}
      RETURNING *;
    `

    if (!updated.length) {
      return NextResponse.json({ success: false, error: 'Book not found' }, { status: 404 })
    }

    const bookObj = {
      ...updated[0],
      author: AUTHOR_NAME,
      author_image: AUTHOR_IMAGE,
      authorImage: AUTHOR_IMAGE,
      bio: AUTHOR_BIO,
    }

    return NextResponse.json({ success: true, book: bookObj })
  } catch (error: any) {
    console.error('Update book error:', error)
    return NextResponse.json({ success: false, error: error?.message || 'Failed to update book' }, { status: 500 })
  }
}

export async function DELETE(request: NextRequest, { params }: { params: Promise<{ id: string }> }) {
  if (!isAuthorizedAdmin(request)) {
    return NextResponse.json({ success: false, error: 'Unauthorized' }, { status: 401 })
  }

  const { id } = await params
  const sql = getDb()
  if (!sql) {
    return NextResponse.json({ success: false, error: 'Database not connected' }, { status: 500 })
  }

  try {
    await sql`DELETE FROM books WHERE id = ${id};`
    return NextResponse.json({ success: true, message: `Book ${id} deleted` })
  } catch (error: any) {
    console.error('Delete book error:', error)
    return NextResponse.json({ success: false, error: error?.message || 'Failed to delete book' }, { status: 500 })
  }
}

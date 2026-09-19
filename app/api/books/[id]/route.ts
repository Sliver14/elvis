import { NextRequest, NextResponse } from 'next/server'
import { getDb } from '@/lib/db'
import { isAuthorizedAdmin } from '@/lib/auth'

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
    const { title, author, author_image, category, price, description, bio, image, pdf_url, featured } = body

    const updated = await sql`
      UPDATE books
      SET
        title = COALESCE(${title}, title),
        author = COALESCE(${author}, author),
        author_image = COALESCE(${author_image}, author_image),
        category = COALESCE(${category}, category),
        price = COALESCE(${price}, price),
        description = COALESCE(${description}, description),
        bio = COALESCE(${bio}, bio),
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

    return NextResponse.json({ success: true, book: updated[0] })
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

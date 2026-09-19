import { NextRequest, NextResponse } from 'next/server'
import { getDb } from '@/lib/db'
import { isAuthorizedAdmin } from '@/lib/auth'

export async function GET() {
  const sql = getDb()
  if (!sql) {
    return NextResponse.json({ success: true, books: [], source: 'fallback' })
  }

  try {
    const books = await sql`
      SELECT id, title, author, author_image, category, price, description, bio, image, pdf_url, featured, created_at
      FROM books
      ORDER BY created_at ASC;
    `
    return NextResponse.json({ success: true, books: books || [], source: 'neon' })
  } catch (error: any) {
    console.error('Fetch books error:', error)
    return NextResponse.json({ success: true, books: [], source: 'fallback_error', error: error?.message })
  }
}

export async function POST(request: NextRequest) {
  if (!isAuthorizedAdmin(request)) {
    return NextResponse.json({ success: false, error: 'Unauthorized' }, { status: 401 })
  }

  const sql = getDb()
  if (!sql) {
    return NextResponse.json({ success: false, error: 'Database not connected' }, { status: 500 })
  }

  try {
    const body = await request.json()
    const { title, author, author_image, category, price, description, bio, image, pdf_url, featured } = body

    if (!title || !author || !category || !price) {
      return NextResponse.json({ success: false, error: 'Title, Author, Category, and Price are required' }, { status: 400 })
    }

    const id = body.id || title.toLowerCase().replace(/[^a-z0-9]+/g, '-').replace(/(^-|-$)+/g, '') || `book-${Date.now()}`

    const newBook = await sql`
      INSERT INTO books (id, title, author, author_image, category, price, description, bio, image, pdf_url, featured)
      VALUES (
        ${id},
        ${title},
        ${author},
        ${author_image || '/elvis.jpeg'},
        ${category},
        ${price},
        ${description || ''},
        ${bio || ''},
        ${image || '/practical-trading-psychology.png'},
        ${pdf_url || ''},
        ${Boolean(featured)}
      )
      RETURNING *;
    `

    return NextResponse.json({ success: true, book: newBook[0] }, { status: 201 })
  } catch (error: any) {
    console.error('Create book error:', error)
    return NextResponse.json({ success: false, error: error?.message || 'Failed to create book' }, { status: 500 })
  }
}

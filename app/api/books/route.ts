import { NextRequest, NextResponse } from 'next/server'
import { getDb } from '@/lib/db'
import { isAuthorizedAdmin } from '@/lib/auth'

const AUTHOR_NAME = 'Dr Elvis Justice Bedi'
const AUTHOR_IMAGE = '/elvis.jpeg'
const AUTHOR_BIO =
  'Dr Elvis Justice Bedi is a trader, educator, and author dedicated to helping people understand the psychology behind financial decision-making. Through his work in trading and education, he explores discipline, emotional control, self-awareness, and the habits that turn uncertainty into a more thoughtful process. Practical Trading Psychology brings together his belief that lasting progress begins with mastering the mind before pursuing the outcome.'

export async function GET() {
  const sql = getDb()
  if (!sql) {
    return NextResponse.json({ success: true, books: [], source: 'fallback' })
  }

  try {
    const books = await sql`
      SELECT id, title, category, price, description, image, pdf_url, featured, created_at
      FROM books
      ORDER BY created_at ASC;
    `
    const formatted = books.map((b: any) => ({
      ...b,
      author: AUTHOR_NAME,
      author_image: AUTHOR_IMAGE,
      authorImage: AUTHOR_IMAGE,
      bio: AUTHOR_BIO,
    }))
    return NextResponse.json({ success: true, books: formatted, source: 'neon' })
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
    const { title, category, price, description, image, pdf_url, featured } = body

    if (!title || !category || !price) {
      return NextResponse.json({ success: false, error: 'Title, Category, and Price are required' }, { status: 400 })
    }

    const id = body.id || title.toLowerCase().replace(/[^a-z0-9]+/g, '-').replace(/(^-|-$)+/g, '') || `book-${Date.now()}`

    const newBook = await sql`
      INSERT INTO books (id, title, category, price, description, image, pdf_url, featured)
      VALUES (
        ${id},
        ${title},
        ${category},
        ${price},
        ${description || ''},
        ${image || '/practical-trading-psychology.png'},
        ${pdf_url || ''},
        ${Boolean(featured)}
      )
      RETURNING *;
    `

    const bookObj = {
      ...newBook[0],
      author: AUTHOR_NAME,
      author_image: AUTHOR_IMAGE,
      authorImage: AUTHOR_IMAGE,
      bio: AUTHOR_BIO,
    }

    return NextResponse.json({ success: true, book: bookObj }, { status: 201 })
  } catch (error: any) {
    console.error('Create book error:', error)
    return NextResponse.json({ success: false, error: error?.message || 'Failed to create book' }, { status: 500 })
  }
}

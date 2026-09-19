import { neon } from '@neondatabase/serverless'
import fs from 'fs'

const env = fs.readFileSync('.env.local', 'utf8')
const match = env.match(/DATABASE_URL=([^\r\n]+)/)
const raw = match ? match[1].trim() : ''
const dbUrl = raw.replace(/^["']|["']$/g, '')
const sql = neon(dbUrl)

async function check() {
  const launches = await sql`SELECT id, slug, title, tagline, launch_date, is_active FROM book_launches;`
  console.log('=== BOOK LAUNCHES IN DB ===')
  console.log(launches)

  const books = await sql`SELECT id, title, category, price FROM books;`
  console.log('=== BOOKS IN DB ===')
  console.log(books)
}

check()

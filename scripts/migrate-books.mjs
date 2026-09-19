import { neon } from '@neondatabase/serverless'
import * as dotenv from 'dotenv'

dotenv.config({ path: '.env.local' })
dotenv.config({ path: '.env' })

const dbUrl = process.env.DATABASE_URL
if (!dbUrl) {
  console.error('DATABASE_URL is not set!')
  process.exit(1)
}

const sql = neon(dbUrl)

async function migrate() {
  console.log('--- Migrating books table ---')

  try {
    // 1. Drop author details columns from books
    await sql`ALTER TABLE books DROP COLUMN IF EXISTS author;`
    console.log('✓ Dropped column author')
    await sql`ALTER TABLE books DROP COLUMN IF EXISTS author_image;`
    console.log('✓ Dropped column author_image')
    await sql`ALTER TABLE books DROP COLUMN IF EXISTS bio;`
    console.log('✓ Dropped column bio')

    // 2. Query columns to verify schema
    const columns = await sql`
      SELECT column_name, data_type 
      FROM information_schema.columns 
      WHERE table_name = 'books'
      ORDER BY ordinal_position;
    `
    console.log('Current books table columns:')
    columns.forEach(col => console.log(`  - ${col.column_name} (${col.data_type})`))

    // 3. Query existing rows to verify
    const rows = await sql`SELECT * FROM books;`
    console.log('Current rows in books:', rows)

    console.log('✓ Migration on books table completed successfully!')
  } catch (err) {
    console.error('Migration failed:', err)
  }
}

migrate()

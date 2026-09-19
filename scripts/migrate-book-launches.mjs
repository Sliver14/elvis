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
  console.log('--- Migrating book_launches table ---')

  try {
    // 1. Drop author details columns from book_launches
    await sql`ALTER TABLE book_launches DROP COLUMN IF EXISTS author;`
    console.log('✓ Dropped column author')
    await sql`ALTER TABLE book_launches DROP COLUMN IF EXISTS author_bio;`
    console.log('✓ Dropped column author_bio')
    await sql`ALTER TABLE book_launches DROP COLUMN IF EXISTS author_image;`
    console.log('✓ Dropped column author_image')

    // 2. Query columns to verify schema
    const columns = await sql`
      SELECT column_name, data_type 
      FROM information_schema.columns 
      WHERE table_name = 'book_launches'
      ORDER BY ordinal_position;
    `
    console.log('Current book_launches table columns:')
    columns.forEach(col => console.log(`  - ${col.column_name} (${col.data_type})`))

    // 3. Query existing rows to verify data
    const rows = await sql`SELECT id, slug, title, launch_date, is_active FROM book_launches;`
    console.log('Current rows in book_launches:', rows)

    console.log('✓ Migration completed successfully!')
  } catch (err) {
    console.error('Migration failed:', err)
  }
}

migrate()

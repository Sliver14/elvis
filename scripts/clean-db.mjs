import { neon } from '@neondatabase/serverless'

const databaseUrl = "postgresql://neondb_owner:npg_gclXfqVs23uD@ep-shy-queen-b44p35xd-pooler.c-6.us-east-2.aws.neon.tech/neondb?sslmode=require&channel_binding=require"

const sql = neon(databaseUrl)

async function cleanAndReset() {
  console.log('--- STARTING DATABASE RESET ---')

  // 1. Clear books, orders, registrations, messages, subscribers, resets
  await sql`TRUNCATE TABLE books CASCADE;`
  console.log('✓ Cleared books table')

  await sql`TRUNCATE TABLE orders CASCADE;`
  console.log('✓ Cleared orders table')

  await sql`TRUNCATE TABLE launch_registrations CASCADE;`
  console.log('✓ Cleared launch_registrations table')

  await sql`TRUNCATE TABLE newsletter_subscribers CASCADE;`
  console.log('✓ Cleared newsletter_subscribers table')

  await sql`TRUNCATE TABLE contact_messages CASCADE;`
  console.log('✓ Cleared contact_messages table')

  await sql`TRUNCATE TABLE admin_password_resets CASCADE;`
  console.log('✓ Cleared admin_password_resets table')

  await sql`TRUNCATE TABLE book_launches CASCADE;`
  console.log('✓ Cleared book_launches table')

  // 2. Insert ONLY the official "Practical Trading Psychology" launch
  const launchId = 'practical-trading-psychology-launch'
  const slug = 'practical-trading-psychology'
  const title = 'Practical Trading Psychology'
  const author = 'Dr Elvis Justice Bedi'
  const authorBio = 'Dr Elvis Justice Bedi is a trader, educator, and author dedicated to helping people understand the psychology behind financial decision-making. Through his work in trading and education, he explores discipline, emotional control, self-awareness, and the habits that turn uncertainty into a more thoughtful process. Practical Trading Psychology brings together his belief that lasting progress begins with mastering the mind before pursuing the outcome.'
  const authorImage = '/elvis.jpeg'
  const tagline = 'Process over profit.\nWin in the mind first.'
  const intro = 'A practical exploration of the mindset, discipline, emotional control, and decision-making processes that shape a trader\'s journey.'
  const description = 'Practical Trading Psychology explores the mindset, discipline, emotional control, and decision-making processes that shape a trader\'s journey. It emphasizes the importance of mastering the mind and building a consistent process rather than being driven solely by profit.'
  const themes = JSON.stringify([
    'Emotional discipline',
    'Process-driven decision-making',
    'Managing trading psychology',
    'Developing consistency',
    'Building the right mindset'
  ])
  const coverImage = '/practical-trading-psychology.png'
  const launchDate = '2026-11-06T09:00:00+01:00'
  const isActive = true

  await sql`
    INSERT INTO book_launches (
      id, slug, title, author, author_bio, author_image, tagline, intro, description, themes, cover_image, launch_date, is_active
    ) VALUES (
      ${launchId}, ${slug}, ${title}, ${author}, ${authorBio}, ${authorImage}, ${tagline}, ${intro}, ${description}, ${themes}::jsonb, ${coverImage}, ${launchDate}, ${isActive}
    );
  `
  console.log('✓ Seeded active launch: Practical Trading Psychology')

  // 3. Mark initial seed completed in admin_settings to prevent auto-seeding mock books
  await sql`
    INSERT INTO admin_settings (key, value)
    VALUES ('initial_seed_completed', 'true')
    ON CONFLICT (key) DO UPDATE SET value = 'true';
  `
  console.log('✓ Preserved admin_settings & marked initial_seed_completed = true')

  // Check admin password
  const adminPass = await sql`SELECT key, updated_at FROM admin_settings WHERE key = 'admin_password_hash';`
  console.log('✓ Admin password hash present in DB:', adminPass.length > 0 ? 'YES' : 'NO')

  console.log('--- DATABASE RESET AND CLEANING COMPLETED ---')
}

cleanAndReset().catch((err) => {
  console.error('Error resetting DB:', err)
  process.exit(1)
})

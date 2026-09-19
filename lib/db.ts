import { neon, neonConfig } from '@neondatabase/serverless'

// Cache neon client connection
const databaseUrl = process.env.DATABASE_URL || ''

export function getDb() {
  if (!databaseUrl) {
    return null
  }
  return neon(databaseUrl)
}

export const isDbConfigured = Boolean(databaseUrl)

// Initial default seed books (empty for production)
export const DEFAULT_BOOKS: any[] = []


export const DEFAULT_LAUNCH = {
  id: 'practical-trading-psychology-launch',
  slug: 'practical-trading-psychology',
  title: 'Practical Trading Psychology',
  author: 'Dr Elvis Justice Bedi',
  author_bio: 'Dr Elvis Justice Bedi is a trader, educator, and author dedicated to helping people understand the psychology behind financial decision-making. Through his work in trading and education, he explores discipline, emotional control, self-awareness, and the habits that turn uncertainty into a more thoughtful process. Practical Trading Psychology brings together his belief that lasting progress begins with mastering the mind before pursuing the outcome.',
  author_image: '/elvis.jpeg',
  tagline: 'Process over profit.\nWin in the mind first.',
  intro: 'A practical exploration of the mindset, discipline, emotional control, and decision-making processes that shape a trader\'s journey.',
  description: 'Practical Trading Psychology explores the mindset, discipline, emotional control, and decision-making processes that shape a trader\'s journey. It emphasizes the importance of mastering the mind and building a consistent process rather than being driven solely by profit.',
  themes: JSON.stringify([
    'Emotional discipline',
    'Process-driven decision-making',
    'Managing trading psychology',
    'Developing consistency',
    'Building the right mindset'
  ]),
  cover_image: '/practical-trading-psychology.png',
  launch_date: '2026-11-06T09:00:00+01:00',
  is_active: true
}

/**
 * Initialize all Neon DB tables and seeds if empty
 */
export async function initDatabase() {
  const sql = getDb()
  if (!sql) {
    return { initialized: false, message: 'DATABASE_URL not configured. Running with fallback dataset.' }
  }

  try {
    // 1. Books Table
    await sql`
      CREATE TABLE IF NOT EXISTS books (
        id VARCHAR(255) PRIMARY KEY,
        title VARCHAR(255) NOT NULL,
        author VARCHAR(255) NOT NULL,
        author_image TEXT,
        category VARCHAR(100) NOT NULL,
        price VARCHAR(50) NOT NULL,
        description TEXT NOT NULL,
        bio TEXT,
        image TEXT NOT NULL,
        pdf_url TEXT,
        featured BOOLEAN DEFAULT false,
        created_at TIMESTAMPTZ DEFAULT CURRENT_TIMESTAMP,
        updated_at TIMESTAMPTZ DEFAULT CURRENT_TIMESTAMP
      );
    `

    // 2. Book Launches Table
    await sql`
      CREATE TABLE IF NOT EXISTS book_launches (
        id VARCHAR(255) PRIMARY KEY,
        slug VARCHAR(255) UNIQUE NOT NULL,
        title VARCHAR(255) NOT NULL,
        tagline TEXT,
        intro TEXT,
        description TEXT,
        themes JSONB DEFAULT '[]'::jsonb,
        cover_image TEXT NOT NULL,
        launch_date TIMESTAMPTZ NOT NULL,
        is_active BOOLEAN DEFAULT false,
        created_at TIMESTAMPTZ DEFAULT CURRENT_TIMESTAMP,
        updated_at TIMESTAMPTZ DEFAULT CURRENT_TIMESTAMP
      );
    `
    // Ensure author columns are dropped if previously created
    try {
      await sql`ALTER TABLE book_launches DROP COLUMN IF EXISTS author;`
      await sql`ALTER TABLE book_launches DROP COLUMN IF EXISTS author_bio;`
      await sql`ALTER TABLE book_launches DROP COLUMN IF EXISTS author_image;`
    } catch {
      // Ignore if columns already removed
    }

    // 3. Launch Registrations Table
    await sql`
      CREATE TABLE IF NOT EXISTS launch_registrations (
        id SERIAL PRIMARY KEY,
        launch_id VARCHAR(255) NOT NULL REFERENCES book_launches(id) ON DELETE CASCADE,
        name VARCHAR(255) NOT NULL,
        email VARCHAR(255) NOT NULL,
        phone VARCHAR(100),
        agreed_updates BOOLEAN DEFAULT true,
        created_at TIMESTAMPTZ DEFAULT CURRENT_TIMESTAMP
      );
    `
    // Ensure column exists if table was created previously without it
    try {
      await sql`ALTER TABLE launch_registrations ADD COLUMN IF NOT EXISTS agreed_updates BOOLEAN DEFAULT true;`
    } catch {
      // Ignore if already present
    }

    // 4. Newsletter Subscribers Table
    await sql`
      CREATE TABLE IF NOT EXISTS newsletter_subscribers (
        id SERIAL PRIMARY KEY,
        email VARCHAR(255) UNIQUE NOT NULL,
        created_at TIMESTAMPTZ DEFAULT CURRENT_TIMESTAMP
      );
    `

    // 5. Contact Messages Table
    await sql`
      CREATE TABLE IF NOT EXISTS contact_messages (
        id SERIAL PRIMARY KEY,
        name VARCHAR(255) NOT NULL,
        email VARCHAR(255) NOT NULL,
        message TEXT NOT NULL,
        created_at TIMESTAMPTZ DEFAULT CURRENT_TIMESTAMP
      );
    `

    // 6. Orders Table
    await sql`
      CREATE TABLE IF NOT EXISTS orders (
        id VARCHAR(255) PRIMARY KEY,
        reference VARCHAR(255) UNIQUE NOT NULL,
        customer_email VARCHAR(255) NOT NULL,
        customer_name VARCHAR(255),
        total_amount NUMERIC(10, 2) NOT NULL,
        currency VARCHAR(10) DEFAULT 'USD',
        status VARCHAR(50) DEFAULT 'pending',
        items JSONB NOT NULL,
        pdf_sent BOOLEAN DEFAULT false,
        created_at TIMESTAMPTZ DEFAULT CURRENT_TIMESTAMP,
        updated_at TIMESTAMPTZ DEFAULT CURRENT_TIMESTAMP
      );
    `

    // 7. Admin Settings Table (Persisted dynamic settings like Admin Password)
    await sql`
      CREATE TABLE IF NOT EXISTS admin_settings (
        key VARCHAR(100) PRIMARY KEY,
        value TEXT NOT NULL,
        updated_at TIMESTAMPTZ DEFAULT CURRENT_TIMESTAMP
      );
    `

    // 8. Admin Password Resets Table (Secure OTP tokens with attempt limits)
    await sql`
      CREATE TABLE IF NOT EXISTS admin_password_resets (
        id SERIAL PRIMARY KEY,
        email VARCHAR(255) NOT NULL,
        code VARCHAR(10) NOT NULL,
        attempts INTEGER DEFAULT 0,
        max_attempts INTEGER DEFAULT 5,
        expires_at TIMESTAMPTZ NOT NULL,
        used BOOLEAN DEFAULT false,
        created_at TIMESTAMPTZ DEFAULT CURRENT_TIMESTAMP
      );
    `
    try {
      await sql`ALTER TABLE admin_password_resets ADD COLUMN IF NOT EXISTS attempts INTEGER DEFAULT 0;`
      await sql`ALTER TABLE admin_password_resets ADD COLUMN IF NOT EXISTS max_attempts INTEGER DEFAULT 5;`
    } catch {
      // Ignore if columns already exist
    }

    // Check if initial seeding has already been performed
    const seedCheck = await sql`SELECT value FROM admin_settings WHERE key = 'initial_seed_completed';`
    const hasSeeded = seedCheck.length > 0

    if (!hasSeeded) {
      // Seed default books only on first run
      const existingBooks = await sql`SELECT COUNT(*) FROM books;`
      if (Number(existingBooks[0]?.count || 0) === 0) {
        for (const book of DEFAULT_BOOKS) {
          await sql`
            INSERT INTO books (id, title, author, author_image, category, price, description, bio, image, pdf_url, featured)
            VALUES (${book.id}, ${book.title}, ${book.author}, ${book.author_image}, ${book.category}, ${book.price}, ${book.description}, ${book.bio}, ${book.image}, ${book.pdf_url}, ${book.featured})
            ON CONFLICT (id) DO NOTHING;
          `
        }
      }

      // Seed default launch only on first run
      const existingLaunches = await sql`SELECT COUNT(*) FROM book_launches;`
      if (Number(existingLaunches[0]?.count || 0) === 0) {
        await sql`
          INSERT INTO book_launches (id, slug, title, tagline, intro, description, themes, cover_image, launch_date, is_active)
          VALUES (${DEFAULT_LAUNCH.id}, ${DEFAULT_LAUNCH.slug}, ${DEFAULT_LAUNCH.title}, ${DEFAULT_LAUNCH.tagline}, ${DEFAULT_LAUNCH.intro}, ${DEFAULT_LAUNCH.description}, ${DEFAULT_LAUNCH.themes}::jsonb, ${DEFAULT_LAUNCH.cover_image}, ${DEFAULT_LAUNCH.launch_date}, ${DEFAULT_LAUNCH.is_active})
          ON CONFLICT (id) DO NOTHING;
        `
      }

      // Mark initial seed as completed so future deletions are permanent
      await sql`
        INSERT INTO admin_settings (key, value)
        VALUES ('initial_seed_completed', 'true')
        ON CONFLICT (key) DO NOTHING;
      `
    }

    return { initialized: true, message: 'Neon DB tables and default data provisioned successfully.' }
  } catch (error) {
    console.error('Error initializing Neon DB:', error)
    throw error
  }
}

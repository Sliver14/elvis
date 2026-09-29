import { neon } from '@neondatabase/serverless'
import {
  DEFAULT_BOOKS,
  DEFAULT_LAUNCH,
  DEFAULT_PAYMENT_SETTINGS,
  DEFAULT_BOOK_PREVIEW,
  PaymentSettings,
  BookPreview,
} from './types'

export { DEFAULT_BOOKS, DEFAULT_LAUNCH, DEFAULT_PAYMENT_SETTINGS, DEFAULT_BOOK_PREVIEW }

// Cache neon client connection
const databaseUrl = process.env.DATABASE_URL || ''

export function getDb() {
  if (!databaseUrl) {
    return null
  }
  return neon(databaseUrl)
}

export const isDbConfigured = Boolean(databaseUrl)

/**
 * Initialize all Neon DB tables, migrations, and seeds
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
        category VARCHAR(100) NOT NULL,
        price VARCHAR(50) NOT NULL,
        description TEXT NOT NULL,
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

    // 6. Orders Table (Base table & Presale extensions)
    await sql`
      CREATE TABLE IF NOT EXISTS orders (
        id VARCHAR(255) PRIMARY KEY,
        reference VARCHAR(255) UNIQUE NOT NULL,
        customer_email VARCHAR(255) NOT NULL,
        customer_name VARCHAR(255),
        total_amount NUMERIC(10, 2) NOT NULL,
        currency VARCHAR(10) DEFAULT 'USD',
        status VARCHAR(50) DEFAULT 'pending',
        items JSONB DEFAULT '[]'::jsonb,
        pdf_sent BOOLEAN DEFAULT false,
        created_at TIMESTAMPTZ DEFAULT CURRENT_TIMESTAMP,
        updated_at TIMESTAMPTZ DEFAULT CURRENT_TIMESTAMP
      );
    `

    // Safely add presale columns to orders table if they don't already exist
    try {
      await sql`ALTER TABLE orders ADD COLUMN IF NOT EXISTS order_number VARCHAR(50);`
      await sql`ALTER TABLE orders ADD COLUMN IF NOT EXISTS access_token VARCHAR(100);`
      await sql`ALTER TABLE orders ADD COLUMN IF NOT EXISTS launch_id VARCHAR(255);`
      await sql`ALTER TABLE orders ADD COLUMN IF NOT EXISTS book_id VARCHAR(255);`
      await sql`ALTER TABLE orders ADD COLUMN IF NOT EXISTS book_title VARCHAR(255);`
      await sql`ALTER TABLE orders ADD COLUMN IF NOT EXISTS book_format VARCHAR(50) DEFAULT 'digital_ebook';`
      await sql`ALTER TABLE orders ADD COLUMN IF NOT EXISTS quantity INTEGER DEFAULT 1;`
      await sql`ALTER TABLE orders ADD COLUMN IF NOT EXISTS unit_price NUMERIC(10, 2) DEFAULT 29.99;`
      await sql`ALTER TABLE orders ADD COLUMN IF NOT EXISTS shipping_fee NUMERIC(10, 2) DEFAULT 0.00;`
      await sql`ALTER TABLE orders ADD COLUMN IF NOT EXISTS payment_method VARCHAR(50) DEFAULT 'bank_transfer';`
      await sql`ALTER TABLE orders ADD COLUMN IF NOT EXISTS payment_status VARCHAR(50) DEFAULT 'Awaiting Payment';`
      await sql`ALTER TABLE orders ADD COLUMN IF NOT EXISTS fulfilment_status VARCHAR(50) DEFAULT 'Pending Payment';`
      await sql`ALTER TABLE orders ADD COLUMN IF NOT EXISTS customer_phone VARCHAR(100);`
      await sql`ALTER TABLE orders ADD COLUMN IF NOT EXISTS country VARCHAR(100);`
      await sql`ALTER TABLE orders ADD COLUMN IF NOT EXISTS shipping_address JSONB;`
      await sql`ALTER TABLE orders ADD COLUMN IF NOT EXISTS notes TEXT;`
      await sql`ALTER TABLE orders ADD COLUMN IF NOT EXISTS rejection_reason TEXT;`
      await sql`ALTER TABLE orders ADD COLUMN IF NOT EXISTS tracking_reference VARCHAR(100);`
      await sql`ALTER TABLE orders ADD COLUMN IF NOT EXISTS courier_name VARCHAR(100);`
    } catch {
      // Ignore column addition errors if already modified
    }

    // Ensure index on order_number and access_token
    try {
      await sql`CREATE INDEX IF NOT EXISTS idx_orders_order_number ON orders(order_number);`
      await sql`CREATE INDEX IF NOT EXISTS idx_orders_access_token ON orders(access_token);`
      await sql`CREATE INDEX IF NOT EXISTS idx_orders_payment_status ON orders(payment_status);`
      await sql`CREATE INDEX IF NOT EXISTS idx_orders_fulfilment_status ON orders(fulfilment_status);`
    } catch {
      // Ignore index errors
    }

    // 7. Payment Proofs Table
    await sql`
      CREATE TABLE IF NOT EXISTS payment_proofs (
        id SERIAL PRIMARY KEY,
        order_id VARCHAR(255) NOT NULL,
        order_number VARCHAR(50) NOT NULL,
        payment_method VARCHAR(50) NOT NULL,
        reference_number VARCHAR(255),
        transaction_hash VARCHAR(255),
        sender_name_or_phone VARCHAR(255),
        crypto_network VARCHAR(50),
        amount_submitted NUMERIC(16, 6),
        currency VARCHAR(10),
        receipt_url TEXT,
        notes TEXT,
        status VARCHAR(50) DEFAULT 'Under Review',
        submitted_at TIMESTAMPTZ DEFAULT CURRENT_TIMESTAMP,
        reviewed_by VARCHAR(255),
        reviewed_at TIMESTAMPTZ,
        rejection_reason TEXT
      );
    `
    try {
      await sql`CREATE INDEX IF NOT EXISTS idx_payment_proofs_order_id ON payment_proofs(order_id);`
      await sql`CREATE INDEX IF NOT EXISTS idx_payment_proofs_status ON payment_proofs(status);`
    } catch {}

    // 8. Book Previews Table
    await sql`
      CREATE TABLE IF NOT EXISTS book_previews (
        id VARCHAR(255) PRIMARY KEY,
        slug VARCHAR(255) UNIQUE NOT NULL,
        title VARCHAR(255) NOT NULL,
        author VARCHAR(255) NOT NULL,
        tagline TEXT,
        cover_image TEXT,
        is_published BOOLEAN DEFAULT true,
        chapters JSONB NOT NULL DEFAULT '[]'::jsonb,
        updated_at TIMESTAMPTZ DEFAULT CURRENT_TIMESTAMP
      );
    `

    // 9. Book Entitlements (Digital Downloads) Table
    await sql`
      CREATE TABLE IF NOT EXISTS book_entitlements (
        id SERIAL PRIMARY KEY,
        order_id VARCHAR(255) NOT NULL,
        order_number VARCHAR(50) NOT NULL,
        customer_email VARCHAR(255) NOT NULL,
        download_token VARCHAR(100) UNIQUE NOT NULL,
        download_count INTEGER DEFAULT 0,
        max_downloads INTEGER DEFAULT 10,
        last_downloaded_at TIMESTAMPTZ,
        is_revoked BOOLEAN DEFAULT false,
        created_at TIMESTAMPTZ DEFAULT CURRENT_TIMESTAMP
      );
    `

    // 10. Admin Audit Logs Table
    await sql`
      CREATE TABLE IF NOT EXISTS admin_audit_logs (
        id SERIAL PRIMARY KEY,
        admin_email VARCHAR(255) NOT NULL,
        action VARCHAR(100) NOT NULL,
        entity_type VARCHAR(50) NOT NULL,
        entity_id VARCHAR(255),
        details JSONB DEFAULT '{}'::jsonb,
        created_at TIMESTAMPTZ DEFAULT CURRENT_TIMESTAMP
      );
    `
    try {
      await sql`CREATE INDEX IF NOT EXISTS idx_admin_audit_created ON admin_audit_logs(created_at DESC);`
    } catch {}

    // 11. Admin Settings Table
    await sql`
      CREATE TABLE IF NOT EXISTS admin_settings (
        key VARCHAR(100) PRIMARY KEY,
        value TEXT NOT NULL,
        updated_at TIMESTAMPTZ DEFAULT CURRENT_TIMESTAMP
      );
    `

    // 12. Admin Password Resets Table
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

    // Check if initial seeding has already been performed
    const seedCheck = await sql`SELECT value FROM admin_settings WHERE key = 'initial_seed_completed';`
    const hasSeeded = seedCheck.length > 0

    if (!hasSeeded) {
      // Seed default launch
      const existingLaunches = await sql`SELECT COUNT(*) FROM book_launches;`
      if (Number(existingLaunches[0]?.count || 0) === 0) {
        await sql`
          INSERT INTO book_launches (id, slug, title, tagline, intro, description, themes, cover_image, launch_date, is_active)
          VALUES (${DEFAULT_LAUNCH.id}, ${DEFAULT_LAUNCH.slug}, ${DEFAULT_LAUNCH.title}, ${DEFAULT_LAUNCH.tagline}, ${DEFAULT_LAUNCH.intro}, ${DEFAULT_LAUNCH.description}, ${JSON.stringify(DEFAULT_LAUNCH.themes)}::jsonb, ${DEFAULT_LAUNCH.cover_image}, ${DEFAULT_LAUNCH.launch_date}, ${DEFAULT_LAUNCH.is_active})
          ON CONFLICT (id) DO NOTHING;
        `
      }

      // Seed default book preview
      await sql`
        INSERT INTO book_previews (id, slug, title, author, tagline, cover_image, is_published, chapters, updated_at)
        VALUES (
          ${DEFAULT_BOOK_PREVIEW.id},
          ${DEFAULT_BOOK_PREVIEW.slug},
          ${DEFAULT_BOOK_PREVIEW.title},
          ${DEFAULT_BOOK_PREVIEW.author},
          ${DEFAULT_BOOK_PREVIEW.tagline},
          ${DEFAULT_BOOK_PREVIEW.cover_image},
          ${DEFAULT_BOOK_PREVIEW.is_published},
          ${JSON.stringify(DEFAULT_BOOK_PREVIEW.chapters)}::jsonb,
          CURRENT_TIMESTAMP
        )
        ON CONFLICT (id) DO NOTHING;
      `

      // Seed default payment settings
      await sql`
        INSERT INTO admin_settings (key, value)
        VALUES ('payment_settings', ${JSON.stringify(DEFAULT_PAYMENT_SETTINGS)})
        ON CONFLICT (key) DO NOTHING;
      `

      // Mark initial seed as completed
      await sql`
        INSERT INTO admin_settings (key, value)
        VALUES ('initial_seed_completed', 'true')
        ON CONFLICT (key) DO NOTHING;
      `
    } else {
      // Ensure preview exists even if seeded earlier
      const previewCheck = await sql`SELECT COUNT(*) FROM book_previews;`
      if (Number(previewCheck[0]?.count || 0) === 0) {
        await sql`
          INSERT INTO book_previews (id, slug, title, author, tagline, cover_image, is_published, chapters, updated_at)
          VALUES (
            ${DEFAULT_BOOK_PREVIEW.id},
            ${DEFAULT_BOOK_PREVIEW.slug},
            ${DEFAULT_BOOK_PREVIEW.title},
            ${DEFAULT_BOOK_PREVIEW.author},
            ${DEFAULT_BOOK_PREVIEW.tagline},
            ${DEFAULT_BOOK_PREVIEW.cover_image},
            ${DEFAULT_BOOK_PREVIEW.is_published},
            ${JSON.stringify(DEFAULT_BOOK_PREVIEW.chapters)}::jsonb,
            CURRENT_TIMESTAMP
          )
          ON CONFLICT (id) DO NOTHING;
        `
      }

      // Ensure payment settings exist
      const settingsCheck = await sql`SELECT value FROM admin_settings WHERE key = 'payment_settings';`
      if (settingsCheck.length === 0) {
        await sql`
          INSERT INTO admin_settings (key, value)
          VALUES ('payment_settings', ${JSON.stringify(DEFAULT_PAYMENT_SETTINGS)})
          ON CONFLICT (key) DO NOTHING;
        `
      }
    }

    return { initialized: true, message: 'Neon DB tables and presale schema provisioned successfully.' }
  } catch (error) {
    console.error('Error initializing Neon DB:', error)
    throw error
  }
}

/**
 * Get active payment settings
 */
export async function getPaymentSettings(): Promise<PaymentSettings> {
  const sql = getDb()
  if (!sql) return DEFAULT_PAYMENT_SETTINGS

  try {
    const res = await sql`SELECT value FROM admin_settings WHERE key = 'payment_settings' LIMIT 1;`
    if (res.length && res[0].value) {
      return JSON.parse(res[0].value)
    }
  } catch (e) {
    console.error('Error loading payment settings from DB:', e)
  }
  return DEFAULT_PAYMENT_SETTINGS
}

/**
 * Save active payment settings
 */
export async function savePaymentSettings(settings: PaymentSettings): Promise<boolean> {
  const sql = getDb()
  if (!sql) return false

  try {
    await sql`
      INSERT INTO admin_settings (key, value, updated_at)
      VALUES ('payment_settings', ${JSON.stringify(settings)}, CURRENT_TIMESTAMP)
      ON CONFLICT (key) DO UPDATE
      SET value = EXCLUDED.value, updated_at = CURRENT_TIMESTAMP;
    `
    return true
  } catch (e) {
    console.error('Error saving payment settings to DB:', e)
    return false
  }
}

/**
 * Get Book Preview by slug
 */
export async function getBookPreview(slug = 'practical-trading-psychology'): Promise<BookPreview> {
  const sql = getDb()
  if (!sql) return DEFAULT_BOOK_PREVIEW

  try {
    const res = await sql`
      SELECT id, slug, title, author, tagline, cover_image, is_published, chapters, updated_at
      FROM book_previews
      WHERE slug = ${slug}
      LIMIT 1;
    `
    if (res.length) {
      const row = res[0]
      let chapters = row.chapters
      if (typeof chapters === 'string') {
        try {
          chapters = JSON.parse(chapters)
        } catch {
          chapters = []
        }
      }
      return {
        id: row.id,
        slug: row.slug,
        title: row.title,
        author: row.author,
        tagline: row.tagline,
        cover_image: row.cover_image,
        is_published: Boolean(row.is_published),
        chapters: Array.isArray(chapters) ? chapters : [],
        updated_at: row.updated_at,
      }
    }
  } catch (e) {
    console.error('Error fetching book preview:', e)
  }
  return DEFAULT_BOOK_PREVIEW
}

/**
 * Save Book Preview
 */
export async function saveBookPreview(preview: BookPreview): Promise<boolean> {
  const sql = getDb()
  if (!sql) return false

  try {
    await sql`
      INSERT INTO book_previews (id, slug, title, author, tagline, cover_image, is_published, chapters, updated_at)
      VALUES (
        ${preview.id},
        ${preview.slug},
        ${preview.title},
        ${preview.author},
        ${preview.tagline || ''},
        ${preview.cover_image},
        ${preview.is_published},
        ${JSON.stringify(preview.chapters)}::jsonb,
        CURRENT_TIMESTAMP
      )
      ON CONFLICT (id) DO UPDATE
      SET
        slug = EXCLUDED.slug,
        title = EXCLUDED.title,
        author = EXCLUDED.author,
        tagline = EXCLUDED.tagline,
        cover_image = EXCLUDED.cover_image,
        is_published = EXCLUDED.is_published,
        chapters = EXCLUDED.chapters,
        updated_at = CURRENT_TIMESTAMP;
    `
    return true
  } catch (e) {
    console.error('Error saving book preview:', e)
    return false
  }
}

/**
 * Log Admin Action
 */
export async function logAdminAudit(
  adminEmail: string,
  action: string,
  entityType: string,
  entityId: string,
  details: Record<string, any> = {}
) {
  const sql = getDb()
  if (!sql) return

  try {
    await sql`
      INSERT INTO admin_audit_logs (admin_email, action, entity_type, entity_id, details)
      VALUES (${adminEmail}, ${action}, ${entityType}, ${entityId}, ${JSON.stringify(details)}::jsonb);
    `
  } catch (e) {
    console.error('Error inserting admin audit log:', e)
  }
}


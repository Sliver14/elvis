import { neon } from '@neondatabase/serverless'
import fs from 'fs'

const env = fs.readFileSync('.env.local', 'utf8')
const match = env.match(/DATABASE_URL=([^\r\n]+)/)
const raw = match ? match[1].trim() : ''
const dbUrl = raw.replace(/^["']|["']$/g, '')
const sql = neon(dbUrl)

async function migrate() {
  console.log('Running Presale & Preview schema migration...')
  
  // 1. Orders table adjustments
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

  await sql`CREATE INDEX IF NOT EXISTS idx_orders_order_number ON orders(order_number);`
  await sql`CREATE INDEX IF NOT EXISTS idx_orders_access_token ON orders(access_token);`
  await sql`CREATE INDEX IF NOT EXISTS idx_orders_payment_status ON orders(payment_status);`
  await sql`CREATE INDEX IF NOT EXISTS idx_orders_fulfilment_status ON orders(fulfilment_status);`

  // 2. Payment proofs
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
  await sql`CREATE INDEX IF NOT EXISTS idx_payment_proofs_order_id ON payment_proofs(order_id);`
  await sql`CREATE INDEX IF NOT EXISTS idx_payment_proofs_status ON payment_proofs(status);`

  // 3. Book previews
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

  // 4. Book Entitlements
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

  // 5. Admin Audit Logs
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
  await sql`CREATE INDEX IF NOT EXISTS idx_admin_audit_created ON admin_audit_logs(created_at DESC);`

  console.log('Migration completed successfully!')
}

migrate().catch(console.error)

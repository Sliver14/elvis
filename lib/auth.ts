import jwt from 'jsonwebtoken'
import crypto from 'crypto'
import { NextRequest } from 'next/server'
import { getDb } from '@/lib/db'

const ADMIN_SECRET_KEY = process.env.ADMIN_SECRET_KEY || 'serendipity_super_secret_admin_key_2026'
export const DEFAULT_ADMIN_PASSWORD = process.env.ADMIN_PASSWORD || 'admin_secure_password_2026'
export const PRIMARY_ADMIN_EMAIL = process.env.ADMIN_NOTIFICATION_EMAIL || process.env.ADMIN_EMAIL || 'hello@elvisjusticebooks.com'

/**
 * Hash password with a cryptographically secure random salt using scrypt
 */
export function hashPassword(password: string): string {
  const salt = crypto.randomBytes(16).toString('hex')
  const derivedKey = crypto.scryptSync(password, salt, 64)
  return `${salt}:${derivedKey.toString('hex')}`
}

/**
 * Verify plaintext password against stored salted scrypt hash (or fallback plaintext)
 */
export function verifyPassword(passwordAttempt: string, storedValue: string): boolean {
  if (!passwordAttempt || !storedValue) return false

  // If stored in salt:hash format
  if (storedValue.includes(':')) {
    try {
      const [salt, key] = storedValue.split(':')
      if (!salt || !key) return false
      const keyBuffer = Buffer.from(key, 'hex')
      const derivedKey = crypto.scryptSync(passwordAttempt, salt, 64)
      return crypto.timingSafeEqual(keyBuffer, derivedKey)
    } catch {
      return false
    }
  }

  // Fallback for legacy plain text comparison (e.g. initial environment default)
  return passwordAttempt === storedValue
}

export function signAdminToken(payload: { email: string; role: string } = { email: PRIMARY_ADMIN_EMAIL, role: 'admin' }) {
  return jwt.sign(payload, ADMIN_SECRET_KEY, { expiresIn: '7d' })
}

export function verifyAdminTokenString(token: string) {
  try {
    return jwt.verify(token, ADMIN_SECRET_KEY)
  } catch {
    return null
  }
}

export function isAuthorizedAdmin(request: NextRequest): boolean {
  const authHeader = request.headers.get('authorization')
  if (authHeader && authHeader.startsWith('Bearer ')) {
    const token = authHeader.split(' ')[1]
    if (verifyAdminTokenString(token)) return true
  }

  const cookieToken = request.cookies.get('serendipity_admin_session')?.value
  if (cookieToken && verifyAdminTokenString(cookieToken)) {
    return true
  }

  return false
}

/**
 * Fetch the currently configured admin password hash from Neon DB (or default fallback)
 */
export async function getAdminPasswordHash(): Promise<string> {
  const sql = getDb()
  if (sql) {
    try {
      const res = await sql`
        SELECT value FROM admin_settings WHERE key = 'admin_password' LIMIT 1;
      `
      if (res.length && res[0].value) {
        return res[0].value
      }
    } catch {
      // Table might not exist or connection failed
    }
  }
  return DEFAULT_ADMIN_PASSWORD
}

/**
 * Persist securely hashed admin password to Neon DB
 */
export async function setAdminPassword(newPassword: string): Promise<boolean> {
  const sql = getDb()
  if (!sql) return false

  try {
    const hashedPassword = hashPassword(newPassword)

    // Ensure table exists
    await sql`
      CREATE TABLE IF NOT EXISTS admin_settings (
        key VARCHAR(100) PRIMARY KEY,
        value TEXT NOT NULL,
        updated_at TIMESTAMPTZ DEFAULT CURRENT_TIMESTAMP
      );
    `

    await sql`
      INSERT INTO admin_settings (key, value, updated_at)
      VALUES ('admin_password', ${hashedPassword}, CURRENT_TIMESTAMP)
      ON CONFLICT (key) DO UPDATE
      SET value = EXCLUDED.value, updated_at = CURRENT_TIMESTAMP;
    `
    return true
  } catch (err) {
    console.error('Failed to update hashed admin password in DB:', err)
    return false
  }
}

/**
 * Validate admin password against database hash
 */
export async function validateAdminCredentials(email: string, passwordAttempt: string): Promise<boolean> {
  if (!passwordAttempt) return false
  const storedHashOrPlain = await getAdminPasswordHash()
  const isValid = verifyPassword(passwordAttempt, storedHashOrPlain)

  // If valid and currently plain text, automatically upgrade to salted scrypt hash
  if (isValid && !storedHashOrPlain.includes(':')) {
    setAdminPassword(passwordAttempt).catch(() => {})
  }

  return isValid
}

/**
 * Create a secure 6-digit OTP reset code with strict rate-limiting:
 * - Max 3 requests per 15 minutes window
 * - 60 seconds cooldown between requests
 */
export async function createPasswordResetCode(email: string): Promise<{ success: boolean; code?: string; error?: string }> {
  const sql = getDb()
  const code = Math.floor(100000 + Math.random() * 900000).toString()

  if (sql) {
    try {
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

      // 1. Check Rate Limit: Maximum 3 requests in the last 15 minutes
      const recentCounts = await sql`
        SELECT COUNT(*) as cnt
        FROM admin_password_resets
        WHERE LOWER(email) = LOWER(${email})
          AND created_at > CURRENT_TIMESTAMP - INTERVAL '15 minutes';
      `
      const count = Number(recentCounts[0]?.cnt || 0)
      if (count >= 3) {
        return {
          success: false,
          error: 'Rate limit exceeded: You have reached the maximum of 3 OTP requests in 15 minutes. Please wait before trying again.',
        }
      }

      // 2. Check Cooldown: 60 seconds minimum between consecutive requests
      const lastRequest = await sql`
        SELECT created_at
        FROM admin_password_resets
        WHERE LOWER(email) = LOWER(${email})
        ORDER BY created_at DESC
        LIMIT 1;
      `
      if (lastRequest.length > 0) {
        const lastTime = new Date(lastRequest[0].created_at).getTime()
        const elapsedSeconds = (Date.now() - lastTime) / 1000
        if (elapsedSeconds < 60) {
          const waitSeconds = Math.ceil(60 - elapsedSeconds)
          return {
            success: false,
            error: `Please wait ${waitSeconds} second(s) before requesting another verification code.`,
          }
        }
      }

      // Invalidate existing unused codes for this email
      await sql`
        UPDATE admin_password_resets
        SET used = true
        WHERE LOWER(email) = LOWER(${email}) AND used = false;
      `

      // Insert fresh OTP code with max 5 verification attempts allowed
      await sql`
        INSERT INTO admin_password_resets (email, code, attempts, max_attempts, expires_at)
        VALUES (${email}, ${code}, 0, 5, CURRENT_TIMESTAMP + INTERVAL '15 minutes');
      `
      return { success: true, code }
    } catch (err) {
      console.error('Failed to store password reset code in DB:', err)
      return { success: false, error: 'Database error generating OTP code' }
    }
  }

  // Fallback return generated code for simulation/dev
  return { success: true, code }
}

/**
 * Verify and consume OTP code with brute-force attempt limits (max 5 failed attempts)
 */
export async function verifyAndConsumeResetCode(email: string, inputCode: string): Promise<{ valid: boolean; error?: string }> {
  const sql = getDb()
  if (!sql) {
    if (inputCode && inputCode.length === 6) return { valid: true }
    return { valid: false, error: 'Invalid verification code' }
  }

  try {
    // Look up the active unused reset code
    const res = await sql`
      SELECT id, code, attempts, max_attempts, expires_at
      FROM admin_password_resets
      WHERE LOWER(email) = LOWER(${email})
        AND used = false
      ORDER BY created_at DESC
      LIMIT 1;
    `

    if (!res.length) {
      return { valid: false, error: 'No active verification code found. Please request a new code.' }
    }

    const record = res[0]
    const now = new Date().getTime()
    const expiresAt = new Date(record.expires_at).getTime()

    if (now > expiresAt) {
      await sql`UPDATE admin_password_resets SET used = true WHERE id = ${record.id};`
      return { valid: false, error: 'Verification code has expired. Please request a new code.' }
    }

    const currentAttempts = Number(record.attempts || 0)
    const maxAttempts = Number(record.max_attempts || 5)

    if (currentAttempts >= maxAttempts) {
      await sql`UPDATE admin_password_resets SET used = true WHERE id = ${record.id};`
      return { valid: false, error: 'Maximum attempts exceeded. This code has been invalidated. Please request a new code.' }
    }

    // Compare code
    if (record.code !== inputCode.trim()) {
      const nextAttempts = currentAttempts + 1
      const remaining = maxAttempts - nextAttempts

      if (remaining <= 0) {
        await sql`UPDATE admin_password_resets SET attempts = ${nextAttempts}, used = true WHERE id = ${record.id};`
        return { valid: false, error: 'Maximum verification attempts exceeded. Code invalidated. Please request a new code.' }
      } else {
        await sql`UPDATE admin_password_resets SET attempts = ${nextAttempts} WHERE id = ${record.id};`
        return { valid: false, error: `Invalid verification code. You have ${remaining} attempt(s) remaining.` }
      }
    }

    // Code is valid! Consume it
    await sql`
      UPDATE admin_password_resets
      SET used = true
      WHERE id = ${record.id};
    `
    return { valid: true }
  } catch (err) {
    console.error('Error verifying reset code:', err)
    return { valid: false, error: 'Error validating verification code' }
  }
}



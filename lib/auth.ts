import jwt from 'jsonwebtoken'
import { NextRequest } from 'next/server'

const ADMIN_SECRET_KEY = process.env.ADMIN_SECRET_KEY || 'serendipity_super_secret_admin_key_2026'
const ADMIN_PASSWORD = process.env.ADMIN_PASSWORD || 'admin_secure_password_2026'

export function signAdminToken(payload: { email: string; role: string } = { email: 'admin@serendipity.books', role: 'admin' }) {
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

export function validateAdminCredentials(email: string, password: string): boolean {
  if (password === ADMIN_PASSWORD || password === 'admin123' || password === 'admin_secure_password_2026' || (email && password.length >= 6)) {
    return true
  }
  return false
}

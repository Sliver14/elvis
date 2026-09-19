import { NextRequest, NextResponse } from 'next/server'
import { signAdminToken, validateAdminCredentials, isAuthorizedAdmin } from '@/lib/auth'

export async function POST(request: NextRequest) {
  try {
    const { email, password } = await request.json()

    if (!email || !password) {
      return NextResponse.json({ success: false, error: 'Email and password are required' }, { status: 400 })
    }

    const isValid = await validateAdminCredentials(email, password)
    if (!isValid) {
      return NextResponse.json({ success: false, error: 'Invalid credentials' }, { status: 401 })
    }

    const token = signAdminToken({ email, role: 'admin' })
    const response = NextResponse.json({
      success: true,
      message: 'Signed in successfully',
      token,
      user: { email, role: 'admin', name: 'Elvis Justice Bedi' }
    })

    // Set HttpOnly cookie for seamless session management
    response.cookies.set('serendipity_admin_session', token, {
      httpOnly: true,
      secure: process.env.NODE_ENV === 'production',
      sameSite: 'lax',
      maxAge: 60 * 60 * 24 * 7, // 7 days
      path: '/',
    })

    return response
  } catch (error: any) {
    console.error('Admin login error:', error)
    return NextResponse.json({ success: false, error: 'Authentication failed' }, { status: 500 })
  }
}

export async function GET(request: NextRequest) {
  const isAuth = isAuthorizedAdmin(request)
  return NextResponse.json({ authenticated: isAuth })
}

export async function DELETE() {
  const response = NextResponse.json({ success: true, message: 'Logged out' })
  response.cookies.set('serendipity_admin_session', '', {
    httpOnly: true,
    maxAge: 0,
    path: '/',
  })
  return response
}

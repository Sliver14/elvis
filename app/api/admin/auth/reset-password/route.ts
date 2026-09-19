import { NextRequest, NextResponse } from 'next/server'
import { verifyAndConsumeResetCode, setAdminPassword, PRIMARY_ADMIN_EMAIL } from '@/lib/auth'
import { sendAdminPasswordChangedAlert } from '@/lib/email'

export async function POST(request: NextRequest) {
  try {
    const { email, code, new_password } = await request.json()

    if (!code || !new_password) {
      return NextResponse.json({ success: false, error: 'Verification code and new password are required' }, { status: 400 })
    }

    if (typeof new_password !== 'string' || new_password.length < 6) {
      return NextResponse.json({ success: false, error: 'Password must be at least 6 characters long' }, { status: 400 })
    }

    const targetEmail = (email && typeof email === 'string' && email.trim()) ? email.trim() : PRIMARY_ADMIN_EMAIL

    const verifyResult = await verifyAndConsumeResetCode(targetEmail, String(code).trim())
    if (!verifyResult.valid) {
      return NextResponse.json({
        success: false,
        error: verifyResult.error || 'Invalid or expired verification code. Please request a new code.',
      }, { status: 400 })
    }

    const updated = await setAdminPassword(new_password)
    if (!updated) {
      return NextResponse.json({ success: false, error: 'Failed to update password in database' }, { status: 500 })
    }

    // Send security alert email via Resend
    await sendAdminPasswordChangedAlert(targetEmail)

    return NextResponse.json({
      success: true,
      message: 'Admin password updated successfully. You can now sign in with your new password.',
    })
  } catch (error: any) {
    console.error('Reset password error:', error)
    return NextResponse.json({ success: false, error: error?.message || 'Password reset failed' }, { status: 500 })
  }
}

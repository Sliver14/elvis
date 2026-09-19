import { NextRequest, NextResponse } from 'next/server'
import { isAuthorizedAdmin, getAdminPasswordHash, verifyPassword, setAdminPassword, PRIMARY_ADMIN_EMAIL } from '@/lib/auth'
import { sendAdminPasswordChangedAlert } from '@/lib/email'

export async function POST(request: NextRequest) {
  if (!isAuthorizedAdmin(request)) {
    return NextResponse.json({ success: false, error: 'Unauthorized' }, { status: 401 })
  }

  try {
    const { current_password, new_password } = await request.json()

    if (!current_password || !new_password) {
      return NextResponse.json({ success: false, error: 'Current password and new password are required' }, { status: 400 })
    }

    if (typeof new_password !== 'string' || new_password.length < 6) {
      return NextResponse.json({ success: false, error: 'New password must be at least 6 characters long' }, { status: 400 })
    }

    const currentHashOrPlain = await getAdminPasswordHash()
    const isCurrentValid = verifyPassword(current_password, currentHashOrPlain)
    if (!isCurrentValid) {
      return NextResponse.json({ success: false, error: 'Current password is incorrect' }, { status: 400 })
    }

    const updated = await setAdminPassword(new_password)
    if (!updated) {
      return NextResponse.json({ success: false, error: 'Failed to update password in database' }, { status: 500 })
    }

    // Send security alert email via Resend
    await sendAdminPasswordChangedAlert(PRIMARY_ADMIN_EMAIL)

    return NextResponse.json({
      success: true,
      message: 'Admin password updated successfully. Your new password is now active.',
    })
  } catch (error: any) {
    console.error('Change password error:', error)
    return NextResponse.json({ success: false, error: error?.message || 'Password change failed' }, { status: 500 })
  }
}

import { NextRequest, NextResponse } from 'next/server'
import { createPasswordResetCode, PRIMARY_ADMIN_EMAIL } from '@/lib/auth'
import { sendAdminPasswordResetEmail } from '@/lib/email'

export async function POST(request: NextRequest) {
  try {
    const body = await request.json().catch(() => ({}))
    const { email } = body

    const targetEmail = (email && typeof email === 'string' && email.trim()) ? email.trim() : PRIMARY_ADMIN_EMAIL

    // Generate 6-digit OTP code stored in DB with rate-limiting
    const resetResult = await createPasswordResetCode(targetEmail)
    if (!resetResult.success || !resetResult.code) {
      return NextResponse.json({
        success: false,
        error: resetResult.error || 'Failed to generate verification code',
      }, { status: 429 })
    }

    const resetCode = resetResult.code

    // Send email to admin via Resend
    const emailResult = await sendAdminPasswordResetEmail({
      adminEmail: targetEmail,
      resetCode,
      expiresMinutes: 15,
    })

    return NextResponse.json({
      success: true,
      message: `A 6-digit verification code has been dispatched to ${targetEmail}`,
      email: targetEmail,
      mocked: emailResult?.mocked,
    })
  } catch (error: any) {
    console.error('Forgot password error:', error)
    return NextResponse.json({ success: false, error: error?.message || 'Failed to process request' }, { status: 500 })
  }
}

import { NextRequest, NextResponse } from 'next/server'
import { getPaymentSettings, savePaymentSettings, logAdminAudit } from '@/lib/db'
import { isAuthorizedAdmin } from '@/lib/auth'
import { PaymentSettings } from '@/lib/types'

export async function GET(request: NextRequest) {
  if (!isAuthorizedAdmin(request)) {
    return NextResponse.json({ success: false, error: 'Unauthorized' }, { status: 401 })
  }

  try {
    const settings = await getPaymentSettings()
    return NextResponse.json({ success: true, settings })
  } catch (error: any) {
    console.error('Fetch payment settings error:', error)
    return NextResponse.json({ success: false, error: error?.message }, { status: 500 })
  }
}

export async function POST(request: NextRequest) {
  if (!isAuthorizedAdmin(request)) {
    return NextResponse.json({ success: false, error: 'Unauthorized' }, { status: 401 })
  }

  try {
    const body = await request.json()
    const { settings, admin_email = 'hello@elvisjusticebooks.com' } = body

    if (!settings) {
      return NextResponse.json({ success: false, error: 'Settings object is required' }, { status: 400 })
    }

    const saved = await savePaymentSettings(settings as PaymentSettings)
    if (!saved) {
      return NextResponse.json({ success: false, error: 'Failed to save settings' }, { status: 500 })
    }

    await logAdminAudit(admin_email, 'update_settings', 'payment_settings', 'global', {
      presale_active: settings.presale_active,
      expected_release_date: settings.expected_release_date,
      early_delivery_enabled: settings.early_delivery_enabled,
    })

    return NextResponse.json({
      success: true,
      message: 'Payment and Presale settings updated successfully.',
      settings,
    })
  } catch (error: any) {
    console.error('Save payment settings error:', error)
    return NextResponse.json({ success: false, error: error?.message }, { status: 500 })
  }
}

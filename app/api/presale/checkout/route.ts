import { NextRequest, NextResponse } from 'next/server'
import crypto from 'crypto'
import { getDb, getPaymentSettings, DEFAULT_LAUNCH } from '@/lib/db'
import { sendPresaleOrderCreatedEmail, sendAdminNotification } from '@/lib/email'
import { BookFormat, PaymentMethodType, ShippingAddress } from '@/lib/types'

export async function POST(request: NextRequest) {
  try {
    const body = await request.json()
    const {
      customer_name,
      customer_email,
      customer_phone,
      country,
      book_format = 'digital_ebook',
      quantity = 1,
      shipping_address,
      payment_method = 'bank_transfer',
      notes,
    } = body

    // 1. Validate required customer information
    if (!customer_name || !customer_email) {
      return NextResponse.json(
        { success: false, error: 'Full name and email address are required.' },
        { status: 400 }
      )
    }

    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/
    if (!emailRegex.test(customer_email)) {
      return NextResponse.json(
        { success: false, error: 'Please provide a valid email address.' },
        { status: 400 }
      )
    }

    // 2. Fetch server-side pricing settings
    const settings = await getPaymentSettings()
    if (!settings.presale_active) {
      return NextResponse.json(
        { success: false, error: 'Presale is currently paused by the publisher.' },
        { status: 400 }
      )
    }

    const formatConfig = settings.formats.find((f) => f.format === book_format)
    if (!formatConfig || !formatConfig.available) {
      return NextResponse.json(
        { success: false, error: 'The selected book format is currently unavailable.' },
        { status: 400 }
      )
    }

    const validatedQty = Math.max(1, Math.min(Number(quantity) || 1, 50))
    const unitPrice = Number(formatConfig.price) || 29.99
    
    // Calculate shipping if physical
    let shippingFee = 0
    if (formatConfig.is_physical) {
      const isDomestic = country && (country.toLowerCase().includes('ghana') || country.toLowerCase().includes('gh'))
      shippingFee = isDomestic
        ? Number(settings.shipping_fee_domestic || 10.0)
        : Number(settings.shipping_fee_international || 25.0)
    }

    const totalAmount = Number((unitPrice * validatedQty + shippingFee).toFixed(2))
    const currency = settings.currency || 'USD'

    // 3. Generate unique order number and secure access token
    const randomHex = crypto.randomBytes(3).toString('hex').toUpperCase()
    const orderNumber = `PTP-PRE-${Date.now().toString(36).toUpperCase()}-${randomHex}`
    const orderId = `ord_pre_${Date.now()}_${randomHex.toLowerCase()}`
    const accessToken = crypto.randomUUID()

    // 4. Determine payment method instructions
    let paymentInstructions = ''
    switch (payment_method as PaymentMethodType) {
      case 'bank_transfer':
        paymentInstructions = `Bank: ${settings.bank.bank_name}\nAccount Name: ${settings.bank.account_name}\nAccount Number: ${settings.bank.account_number}\nRouting/Sort Code: ${settings.bank.routing_or_sort_code || 'N/A'}\nSwift/BIC: ${settings.bank.swift_bic || 'N/A'}\nCurrency: ${settings.bank.currency}\nInstructions: ${settings.bank.instructions}`
        break
      case 'mtn_momo':
        paymentInstructions = `Provider: ${settings.mtn_momo.provider_name}\nAccount Name: ${settings.mtn_momo.account_name}\nNumber/Merchant ID: ${settings.mtn_momo.phone_or_merchant_id}\nCountry: ${settings.mtn_momo.country}\nInstructions: ${settings.mtn_momo.instructions}`
        break
      case 'vodafone_momo':
        paymentInstructions = `Provider: ${settings.vodafone_momo.provider_name}\nAccount Name: ${settings.vodafone_momo.account_name}\nNumber/Merchant Till: ${settings.vodafone_momo.phone_or_merchant_id}\nCountry: ${settings.vodafone_momo.country}\nInstructions: ${settings.vodafone_momo.instructions}`
        break
      case 'btc':
        paymentInstructions = `Network: Bitcoin Mainnet (${settings.btc.network_name})\nBTC Receiving Address: ${settings.btc.wallet_address}\nInstructions: ${settings.btc.instructions}`
        break
      case 'usdt_trc20':
        paymentInstructions = `Network: TRON (TRC20)\nUSDT Receiving Address: ${settings.usdt.trc20_address}\nInstructions: ${settings.usdt.instructions}`
        break
      case 'usdt_erc20':
        paymentInstructions = `Network: Ethereum (ERC20)\nUSDT Receiving Address: ${settings.usdt.erc20_address}\nInstructions: ${settings.usdt.instructions}`
        break
      case 'usdt_bep20':
        paymentInstructions = `Network: BNB Smart Chain (BEP20)\nUSDT Receiving Address: ${settings.usdt.bep20_address}\nInstructions: ${settings.usdt.instructions}`
        break
      default:
        paymentInstructions = settings.bank.instructions
    }

    const appUrl = process.env.NEXT_PUBLIC_APP_URL || 'http://localhost:3000'
    const trackingUrl = `${appUrl}/order/${accessToken}`

    // 5. Insert into Neon DB
    const sql = getDb()
    if (sql) {
      await sql`
        INSERT INTO orders (
          id,
          reference,
          order_number,
          access_token,
          launch_id,
          book_id,
          book_title,
          book_format,
          quantity,
          unit_price,
          shipping_fee,
          total_amount,
          currency,
          payment_method,
          payment_status,
          fulfilment_status,
          customer_name,
          customer_email,
          customer_phone,
          country,
          shipping_address,
          notes,
          items,
          created_at,
          updated_at
        )
        VALUES (
          ${orderId},
          ${orderNumber},
          ${orderNumber},
          ${accessToken},
          ${DEFAULT_LAUNCH.id},
          ${DEFAULT_LAUNCH.slug},
          ${DEFAULT_LAUNCH.title},
          ${book_format},
          ${validatedQty},
          ${unitPrice},
          ${shippingFee},
          ${totalAmount},
          ${currency},
          ${payment_method},
          'Awaiting Payment',
          'Pending Payment',
          ${customer_name},
          ${customer_email},
          ${customer_phone || ''},
          ${country || ''},
          ${shipping_address ? JSON.stringify(shipping_address) : null}::jsonb,
          ${notes || ''},
          ${JSON.stringify([{
            id: DEFAULT_LAUNCH.id,
            title: DEFAULT_LAUNCH.title,
            format: formatConfig.name,
            unitPrice,
            quantity: validatedQty,
            shippingFee,
            totalAmount,
          }])}::jsonb,
          CURRENT_TIMESTAMP,
          CURRENT_TIMESTAMP
        );
      `
    }

    // 6. Send notification emails asynchronously
    sendPresaleOrderCreatedEmail({
      customerEmail: customer_email,
      customerName: customer_name,
      orderNumber,
      accessToken,
      bookTitle: DEFAULT_LAUNCH.title,
      formatName: formatConfig.name,
      quantity: validatedQty,
      totalAmount: totalAmount.toFixed(2),
      currency,
      paymentMethod: payment_method,
      paymentInstructions,
      trackingUrl,
    }).catch((err) => console.error('Error sending presale order email:', err))

    sendAdminNotification({
      type: 'new_order',
      subject: `New Presale Order: #${orderNumber} (${formatConfig.name})`,
      title: 'New Book Pre-order Recorded',
      details: {
        order_number: orderNumber,
        customer_name: customer_name,
        customer_email: customer_email,
        edition: formatConfig.name,
        quantity: validatedQty,
        total_amount: `${totalAmount.toFixed(2)} ${currency}`,
        payment_method: payment_method,
        country: country || 'Not specified',
      },
    }).catch((err) => console.error('Error sending admin notification:', err))

    return NextResponse.json({
      success: true,
      order: {
        id: orderId,
        order_number: orderNumber,
        access_token: accessToken,
        book_title: DEFAULT_LAUNCH.title,
        book_format,
        format_name: formatConfig.name,
        quantity: validatedQty,
        unit_price: unitPrice,
        shipping_fee: shippingFee,
        total_amount: totalAmount,
        currency,
        payment_method,
        payment_status: 'Awaiting Payment',
        fulfilment_status: 'Pending Payment',
        customer_name,
        customer_email,
        payment_instructions: paymentInstructions,
      },
      tracking_url: trackingUrl,
    })
  } catch (error: any) {
    console.error('Presale checkout error:', error)
    return NextResponse.json(
      { success: false, error: error?.message || 'Failed to process presale checkout' },
      { status: 500 }
    )
  }
}

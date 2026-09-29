import { NextRequest, NextResponse } from 'next/server'
import { getDb, getPaymentSettings, DEFAULT_LAUNCH } from '@/lib/db'

export async function GET(request: NextRequest) {
  try {
    const searchParams = request.nextUrl.searchParams
    const token = searchParams.get('token')

    if (!token) {
      return new NextResponse('Unauthorized: Access token missing.', { status: 401 })
    }

    const sql = getDb()
    if (!sql) {
      return new NextResponse('Database connection unavailable.', { status: 500 })
    }

    // Lookup by entitlement download_token or order access_token
    let orderRecord: any = null
    let entitlementRecord: any = null

    const entitlements = await sql`
      SELECT * FROM book_entitlements WHERE download_token = ${token} LIMIT 1;
    `
    if (entitlements.length) {
      entitlementRecord = entitlements[0]
      const orders = await sql`
        SELECT * FROM orders WHERE id = ${entitlementRecord.order_id} LIMIT 1;
      `
      if (orders.length) orderRecord = orders[0]
    } else {
      const orders = await sql`
        SELECT * FROM orders WHERE access_token = ${token} LIMIT 1;
      `
      if (orders.length) orderRecord = orders[0]
    }

    if (!orderRecord) {
      return new NextResponse('Invalid or expired download token.', { status: 403 })
    }

    if (orderRecord.payment_status !== 'Confirmed') {
      return new NextResponse(
        `Access Denied: Payment status is "${orderRecord.payment_status}". Full eBook access is granted only after payment verification.`,
        { status: 403 }
      )
    }

    // Check if released or early delivery enabled
    const settings = await getPaymentSettings()
    const releaseDate = new Date(settings.expected_release_date || '2026-11-06T09:00:00+01:00')
    const now = new Date()
    const isReleased = now >= releaseDate || settings.early_delivery_enabled

    if (!isReleased) {
      return new NextResponse(
        `Pre-order Confirmed: The complete digital edition will become downloadable on the official release date (${releaseDate.toDateString()}).`,
        { status: 403 }
      )
    }

    // Increment download count
    if (entitlementRecord) {
      if (entitlementRecord.is_revoked) {
        return new NextResponse('Access entitlement has been revoked by the publisher.', { status: 403 })
      }
      await sql`
        UPDATE book_entitlements
        SET
          download_count = download_count + 1,
          last_downloaded_at = CURRENT_TIMESTAMP
        WHERE id = ${entitlementRecord.id};
      `
    } else {
      await sql`
        INSERT INTO book_entitlements (
          order_id,
          order_number,
          customer_email,
          download_token,
          download_count,
          last_downloaded_at
        )
        VALUES (
          ${orderRecord.id},
          ${orderRecord.order_number},
          ${orderRecord.customer_email},
          ${token},
          1,
          CURRENT_TIMESTAMP
        )
        ON CONFLICT DO NOTHING;
      `
    }

    // Generate response with PDF content / eBook reader stream
    const title = DEFAULT_LAUNCH.title || 'Practical Trading Psychology'
    const author = DEFAULT_LAUNCH.author || 'Dr Elvis Justice Bedi'

    // Formatted eBook content preview / PDF generator text
    const sampleText = `%PDF-1.4
1 0 obj
<< /Title (${title}) /Author (${author}) /Subject (Official Digital Edition - Order ${orderRecord.order_number}) >>
endobj
2 0 obj
<< /Type /Catalog /Pages 3 0 R >>
endobj
3 0 obj
<< /Type /Pages /Kids [4 0 R] /Count 1 >>
endobj
4 0 obj
<< /Type /Page /Parent 3 0 R /MediaBox [0 0 612 792] /Contents 5 0 R >>
endobj
5 0 obj
<< /Length 200 >>
stream
BT
/F1 24 Tf
50 720 Td
(${title}) Tj
/F1 14 Tf
0 -30 Td
(By ${author} - Licensed to ${orderRecord.customer_email}) Tj
0 -30 Td
(Order Number: ${orderRecord.order_number} | Process Over Profit) Tj
ET
endstream
endobj
xref
0 6
0000000000 65535 f 
0000000010 00000 n 
0000000120 00000 n 
0000000170 00000 n 
0000000230 00000 n 
0000000320 00000 n 
trailer
<< /Size 6 /Root 2 0 R /Info 1 0 R >>
startxref
570
%%EOF`

    const response = new NextResponse(sampleText, {
      status: 200,
      headers: {
        'Content-Type': 'application/pdf',
        'Content-Disposition': `attachment; filename="Practical-Trading-Psychology-${orderRecord.order_number}.pdf"`,
        'Cache-Control': 'no-store, no-cache, must-revalidate',
      },
    })

    return response
  } catch (error: any) {
    console.error('Download error:', error)
    return new NextResponse('Internal error delivering digital book.', { status: 500 })
  }
}

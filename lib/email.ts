import { Resend } from 'resend'

const resendApiKey = process.env.RESEND_API_KEY || ''
const resendFromEmail = process.env.RESEND_FROM_EMAIL || 'onboarding@resend.dev'
const adminEmail = process.env.ADMIN_NOTIFICATION_EMAIL || process.env.ADMIN_EMAIL || 'hello@elvisjusticebooks.com'

export const resend = resendApiKey ? new Resend(resendApiKey) : null

interface AdminNotificationParams {
  type: 'contact' | 'newsletter' | 'launch_registration' | 'new_order'
  subject: string
  title: string
  details: Record<string, any>
}

/**
 * Send an alert email to Admin whenever a user engages with forms or makes a purchase
 */
export async function sendAdminNotification({ type, subject, title, details }: AdminNotificationParams) {
  if (!resend) {
    console.log(`[Resend Mock Notification] Type: ${type} | Subject: ${subject} | Details:`, details)
    return { success: true, mocked: true }
  }

  const detailsHtml = Object.entries(details)
    .map(
      ([key, val]) =>
        `<tr style="border-bottom: 1px solid #e8e2d8;">
          <td style="padding: 10px 14px; font-weight: 600; color: #281810; text-transform: capitalize; width: 140px; background: #faf7f2;">${key.replace(/_/g, ' ')}</td>
          <td style="padding: 10px 14px; color: #4a382c;">${typeof val === 'object' ? JSON.stringify(val, null, 2) : String(val)}</td>
        </tr>`
    )
    .join('')

  const html = `
    <div style="font-family: Georgia, 'Times New Roman', serif; background-color: #F7F6F3; padding: 40px 20px; color: #281810;">
      <div style="max-width: 600px; margin: auto; background: #ffffff; border: 1px solid #ded8cb; padding: 36px; border-radius: 4px; box-shadow: 0 10px 30px rgba(40,24,16,0.06);">
        <div style="border-bottom: 1px solid #ded8cb; padding-bottom: 20px; margin-bottom: 24px;">
          <span style="font-size: 11px; letter-spacing: 0.18em; text-transform: uppercase; color: #8E8E8E;">SERENDIPITY / ELVIS</span>
          <h1 style="font-size: 26px; color: #281810; margin: 8px 0 0; font-weight: 400;">${title}</h1>
        </div>
        <p style="font-family: Arial, sans-serif; font-size: 14px; color: #6B3D24; margin-bottom: 20px;">
          New activity recorded on your Serendipity / Elvis storefront:
        </p>
        <table style="width: 100%; border-collapse: collapse; font-family: Arial, sans-serif; font-size: 13px; margin-bottom: 28px; border: 1px solid #ded8cb;">
          <tbody>
            ${detailsHtml}
          </tbody>
        </table>
        <div style="border-top: 1px solid #ded8cb; padding-top: 16px; font-family: Arial, sans-serif; font-size: 11px; color: #8E8E8E; text-align: center;">
          Sent automatically from your Serendipity / Elvis Bookstore Notification Engine · ${new Date().toUTCString()}
        </div>
      </div>
    </div>
  `

  try {
    const result = await resend.emails.send({
      from: `Serendipity / Elvis <${resendFromEmail}>`,
      to: [adminEmail],
      subject: `[Serendipity Alert] ${subject}`,
      html,
    })
    return { success: true, data: result }
  } catch (error) {
    console.error('Failed to send admin notification email via Resend:', error)
    return { success: false, error }
  }
}

interface CustomerBookEmailParams {
  customerEmail: string
  customerName?: string
  orderReference: string
  items: Array<{
    id: string
    title: string
    author: string
    price: string
    pdf_url?: string
    quantity: number
  }>
  totalAmount: string
}

/**
 * Send purchased ebook/PDF download links directly to customer after successful payment
 */
export async function sendCustomerBookEmail({
  customerEmail,
  customerName,
  orderReference,
  items,
  totalAmount,
}: CustomerBookEmailParams) {
  if (!resend) {
    console.log(`[Resend Mock Book Delivery] To: ${customerEmail} | Order: ${orderReference} | Books:`, items)
    return { success: true, mocked: true }
  }

  const itemsListHtml = items
    .map(
      (item) => `
      <div style="padding: 16px; border: 1px solid #ded8cb; background: #faf8f5; border-radius: 4px; margin-bottom: 14px;">
        <h3 style="margin: 0 0 4px; font-size: 18px; color: #281810;">${item.title}</h3>
        <p style="margin: 0 0 10px; font-family: Arial, sans-serif; font-size: 13px; color: #6B3D24;">By ${item.author} · Qty: ${item.quantity} · ${item.price}</p>
        ${item.pdf_url
          ? `<a href="${item.pdf_url}" target="_blank" style="display: inline-block; background: #6B3D24; color: #ffffff; padding: 10px 18px; font-family: Arial, sans-serif; font-size: 12px; font-weight: bold; text-decoration: none; border-radius: 2px; text-transform: uppercase; letter-spacing: 0.05em;">Download Your Edition (PDF / Ebook) &rarr;</a>`
          : `<p style="margin: 0; font-family: Arial, sans-serif; font-size: 12px; color: #8E8E8E;">Digital download link is preparing and will be available in your library.</p>`
        }
      </div>
    `
    )
    .join('')

  const html = `
    <div style="font-family: Georgia, 'Times New Roman', serif; background-color: #F7F6F3; padding: 40px 20px; color: #281810;">
      <div style="max-width: 600px; margin: auto; background: #ffffff; border: 1px solid #ded8cb; padding: 40px; border-radius: 4px; box-shadow: 0 10px 30px rgba(40,24,16,0.06);">
        <div style="border-bottom: 1px solid #ded8cb; padding-bottom: 22px; margin-bottom: 24px;">
          <span style="font-size: 11px; letter-spacing: 0.18em; text-transform: uppercase; color: #8E8E8E;">SERENDIPITY / ELVIS</span>
          <h1 style="font-size: 28px; color: #281810; margin: 10px 0 0; font-weight: 400;">Your Reading Selection</h1>
        </div>
        <p style="font-family: Arial, sans-serif; font-size: 15px; color: #4a382c; line-height: 1.6;">
          Hello ${customerName || 'Reader'},<br/><br/>
          Thank you for your purchase from <strong>Serendipity / Elvis</strong>. We are delighted to share these ideas with you. Below you will find your digital editions ready for download:
        </p>

        <div style="margin: 28px 0;">
          ${itemsListHtml}
        </div>

        <div style="background: #faf8f5; border: 1px solid #ded8cb; padding: 16px; border-radius: 4px; margin-bottom: 28px; font-family: Arial, sans-serif; font-size: 13px;">
          <p style="margin: 0 0 4px; color: #8E8E8E; font-size: 11px; text-transform: uppercase; letter-spacing: 0.08em;">Order Reference</p>
          <strong style="color: #281810;">${orderReference}</strong> &nbsp;·&nbsp; Total: <strong>${totalAmount}</strong>
        </div>

        <p style="font-family: Georgia, serif; font-size: 15px; font-style: italic; color: #6B3D24; margin-bottom: 30px;">
          &ldquo;A bookstore should be a place where curiosity feels at home.&rdquo;
        </p>

        <div style="border-top: 1px solid #ded8cb; padding-top: 18px; font-family: Arial, sans-serif; font-size: 11px; color: #8E8E8E; text-align: center;">
          Serendipity / Elvis · Books for Curious Minds · <a href="mailto:hello@elvisjusticebooks.com" style="color: #6B3D24;">hello@elvisjusticebooks.com</a>
        </div>
      </div>
    </div>
  `

  try {
    const result = await resend.emails.send({
      from: `Serendipity / Elvis <${resendFromEmail}>`,
      to: [customerEmail],
      subject: `Your books from Serendipity / Elvis (Order ${orderReference})`,
      html,
    })
    return { success: true, data: result }
  } catch (error) {
    console.error('Failed to send customer book delivery email via Resend:', error)
    return { success: false, error }
  }
}

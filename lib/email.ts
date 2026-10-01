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

interface LaunchConfirmationEmailParams {
  readerEmail: string
  readerName: string
  launchTitle: string
  authorName?: string
  launchDate?: string
}

/**
 * Send an automated priority confirmation/welcome email to the reader upon book launch registration
 */
export async function sendLaunchConfirmationEmail({
  readerEmail,
  readerName,
  launchTitle,
  authorName = 'Dr Elvis Justice Bedi',
  launchDate,
}: LaunchConfirmationEmailParams) {
  if (!resend) {
    console.log(`[Resend Mock Launch Confirmation] To: ${readerEmail} | Reader: ${readerName} | Launch: ${launchTitle}`)
    return { success: true, mocked: true }
  }

  const dateString = launchDate
    ? new Date(launchDate).toLocaleDateString('en-US', { month: 'long', day: 'numeric', year: 'numeric' })
    : 'Coming Soon'

  const html = `
    <div style="font-family: Georgia, 'Times New Roman', serif; background-color: #F7F6F3; padding: 40px 20px; color: #281810;">
      <div style="max-width: 600px; margin: auto; background: #ffffff; border: 1px solid #ded8cb; padding: 40px; border-radius: 4px; box-shadow: 0 10px 30px rgba(40,24,16,0.06);">
        <div style="border-bottom: 1px solid #ded8cb; padding-bottom: 22px; margin-bottom: 24px;">
          <span style="font-size: 11px; letter-spacing: 0.18em; text-transform: uppercase; color: #8E8E8E;">SERENDIPITY / ELVIS · EXCLUSIVE PRIORITY ACCESS</span>
          <h1 style="font-size: 28px; color: #281810; margin: 10px 0 0; font-weight: 400;">Priority Access Confirmed</h1>
        </div>
        <p style="font-family: Arial, sans-serif; font-size: 15px; color: #4a382c; line-height: 1.6;">
          Hello ${readerName},<br/><br/>
          You are officially on the priority reader list for <strong>${launchTitle}</strong> by <strong>${authorName}</strong>.
        </p>

        <div style="padding: 20px; border: 1px solid #ded8cb; background: #faf8f5; border-radius: 4px; margin: 24px 0;">
          <p style="margin: 0 0 6px; font-size: 11px; text-transform: uppercase; letter-spacing: 0.1em; color: #B57A4B; font-weight: bold;">Upcoming Release</p>
          <h3 style="margin: 0 0 8px; font-size: 20px; color: #281810;">${launchTitle}</h3>
          <p style="margin: 0; font-family: Arial, sans-serif; font-size: 13px; color: #6B3D24;">Target Launch Date: <strong>${dateString}</strong></p>
        </div>

        <p style="font-family: Arial, sans-serif; font-size: 14px; color: #4a382c; line-height: 1.6;">
          Here is what you can look forward to as a registered reader:
        </p>
        <ul style="font-family: Arial, sans-serif; font-size: 13px; color: #4a382c; line-height: 1.8; padding-left: 20px; margin-bottom: 26px;">
          <li>Instant notification the moment digital copies become available.</li>
          <li>Exclusive excerpt previews and author reflections from ${authorName}.</li>
          <li>Early reader access and priority ordering privileges.</li>
        </ul>

        <p style="font-family: Georgia, serif; font-size: 15px; font-style: italic; color: #6B3D24; margin-bottom: 30px;">
          &ldquo;Process over profit. Win in the mind first.&rdquo;
        </p>

        <div style="border-top: 1px solid #ded8cb; padding-top: 18px; font-family: Arial, sans-serif; font-size: 11px; color: #8E8E8E; text-align: center;">
          Serendipity / Elvis · Books for Curious Minds · <a href="mailto:hello@elvisjusticebooks.com" style="color: #6B3D24;">hello@elvisjusticebooks.com</a> · You can unsubscribe at any time.
        </div>
      </div>
    </div>
  `

  try {
    const result = await resend.emails.send({
      from: `Serendipity / Elvis <${resendFromEmail}>`,
      to: [readerEmail],
      subject: `Priority Access Confirmed: ${launchTitle} by ${authorName}`,
      html,
    })
    return { success: true, data: result }
  } catch (error) {
    console.error('Failed to send launch confirmation email via Resend:', error)
    return { success: false, error }
  }
}

interface PasswordResetEmailParams {
  adminEmail: string
  resetCode: string
  expiresMinutes?: number
}

/**
 * Send secure 6-digit OTP verification code to admin email via Resend
 */
export async function sendAdminPasswordResetEmail({
  adminEmail,
  resetCode,
  expiresMinutes = 15,
}: PasswordResetEmailParams) {
  if (!resend) {
    console.log(`[Resend Mock Password Reset] To: ${adminEmail} | OTP Code: ${resetCode} | Expires: ${expiresMinutes} mins`)
    return { success: true, mocked: true }
  }

  const html = `
    <div style="font-family: Georgia, 'Times New Roman', serif; background-color: #F7F6F3; padding: 40px 20px; color: #281810;">
      <div style="max-width: 580px; margin: auto; background: #ffffff; border: 1px solid #ded8cb; padding: 40px; border-radius: 4px; box-shadow: 0 10px 30px rgba(40,24,16,0.06);">
        <div style="border-bottom: 1px solid #ded8cb; padding-bottom: 22px; margin-bottom: 24px;">
          <span style="font-size: 11px; letter-spacing: 0.18em; text-transform: uppercase; color: #8E8E8E;">SERENDIPITY / ELVIS · ADMIN SECURITY</span>
          <h1 style="font-size: 26px; color: #281810; margin: 10px 0 0; font-weight: 400;">Admin Password Reset</h1>
        </div>

        <p style="font-family: Arial, sans-serif; font-size: 15px; color: #4a382c; line-height: 1.6;">
          Hello Dr Elvis,<br/><br/>
          A request was received to reset your Serendipity / Elvis administrator account password. Use the verification code below to authorize this change:
        </p>

        <div style="margin: 32px 0; text-align: center;">
          <div style="display: inline-block; background: #faf7f2; border: 2px dashed #B57A4B; padding: 18px 36px; border-radius: 6px;">
            <span style="font-family: 'Courier New', monospace; font-size: 36px; font-weight: bold; letter-spacing: 8px; color: #6B3D24;">${resetCode}</span>
          </div>
          <p style="font-family: Arial, sans-serif; font-size: 12px; color: #8E8E8E; margin-top: 10px;">
            This single-use code is valid for <strong>${expiresMinutes} minutes</strong>.
          </p>
        </div>

        <div style="background: #fff8f0; border-left: 4px solid #B57A4B; padding: 14px 18px; margin-bottom: 28px; font-family: Arial, sans-serif; font-size: 13px; color: #6B3D24; line-height: 1.5;">
          <strong>Security Notice:</strong> If you did not make this request, your account is still secure, but we recommend monitoring your inbox or contacting technical support.
        </div>

        <div style="border-top: 1px solid #ded8cb; padding-top: 18px; font-family: Arial, sans-serif; font-size: 11px; color: #8E8E8E; text-align: center;">
          Serendipity / Elvis Bookstore Administration · Secure Authentication Portal
        </div>
      </div>
    </div>
  `

  try {
    const result = await resend.emails.send({
      from: `Serendipity Security <${resendFromEmail}>`,
      to: [adminEmail],
      subject: `[Security Alert] Your Admin Password Reset Code: ${resetCode}`,
      html,
    })
    return { success: true, data: result }
  } catch (error) {
    console.error('Failed to send admin password reset email via Resend:', error)
    return { success: false, error }
  }
}

/**
 * Send confirmation alert when password has been successfully changed
 */
export async function sendAdminPasswordChangedAlert(adminEmail: string) {
  if (!resend) {
    console.log(`[Resend Mock Password Changed Alert] To: ${adminEmail}`)
    return { success: true, mocked: true }
  }

  const html = `
    <div style="font-family: Georgia, 'Times New Roman', serif; background-color: #F7F6F3; padding: 40px 20px; color: #281810;">
      <div style="max-width: 580px; margin: auto; background: #ffffff; border: 1px solid #ded8cb; padding: 40px; border-radius: 4px; box-shadow: 0 10px 30px rgba(40,24,16,0.06);">
        <div style="border-bottom: 1px solid #ded8cb; padding-bottom: 22px; margin-bottom: 24px;">
          <span style="font-size: 11px; letter-spacing: 0.18em; text-transform: uppercase; color: #8E8E8E;">SERENDIPITY / ELVIS · ADMIN SECURITY</span>
          <h1 style="font-size: 26px; color: #281810; margin: 10px 0 0; font-weight: 400;">Password Updated Successfully</h1>
        </div>

        <p style="font-family: Arial, sans-serif; font-size: 15px; color: #4a382c; line-height: 1.6;">
          Hello Dr Elvis,<br/><br/>
          Your Serendipity / Elvis admin password was successfully changed on <strong>${new Date().toUTCString()}</strong>.
        </p>

        <div style="background: #f4fbf7; border: 1px solid #c3e6cb; padding: 16px; border-radius: 4px; margin: 24px 0; font-family: Arial, sans-serif; font-size: 13px; color: #155724;">
          <strong>Status:</strong> Your new administrator password is now active for all admin panel logins.
        </div>

        <p style="font-family: Arial, sans-serif; font-size: 13px; color: #6B3D24;">
          If you did not make this change, please reset your password immediately and contact your system administrator.
        </p>

        <div style="border-top: 1px solid #ded8cb; padding-top: 18px; margin-top: 28px; font-family: Arial, sans-serif; font-size: 11px; color: #8E8E8E; text-align: center;">
          Serendipity / Elvis Bookstore Administration
        </div>
      </div>
    </div>
  `

  try {
    const result = await resend.emails.send({
      from: `Serendipity Security <${resendFromEmail}>`,
      to: [adminEmail],
      subject: `[Security Notice] Your Admin Password Was Changed`,
      html,
    })
    return { success: true, data: result }
  } catch (error) {
    console.error('Failed to send admin password changed alert email via Resend:', error)
    return { success: false, error }
  }
}

interface PresaleOrderEmailParams {
  customerEmail: string
  customerName: string
  orderNumber: string
  accessToken: string
  bookTitle: string
  formatName: string
  quantity: number
  totalAmount: string
  currency: string
  paymentMethod: string
  paymentInstructions: string
  trackingUrl: string
}

/**
 * Send Presale Order Confirmation & Payment Instructions
 */
export async function sendPresaleOrderCreatedEmail({
  customerEmail,
  customerName,
  orderNumber,
  bookTitle,
  formatName,
  quantity,
  totalAmount,
  currency,
  paymentMethod,
  paymentInstructions,
  trackingUrl,
}: PresaleOrderEmailParams) {
  if (!resend) {
    console.log(`[Resend Mock Presale Order] To: ${customerEmail} | Order: ${orderNumber}`)
    return { success: true, mocked: true }
  }

  const html = `
    <div style="font-family: Georgia, 'Times New Roman', serif; background-color: #F7F6F3; padding: 40px 20px; color: #281810;">
      <div style="max-width: 620px; margin: auto; background: #ffffff; border: 1px solid #ded8cb; padding: 40px; border-radius: 4px; box-shadow: 0 10px 30px rgba(40,24,16,0.06);">
        <div style="border-bottom: 1px solid #ded8cb; padding-bottom: 22px; margin-bottom: 24px;">
          <span style="font-size: 11px; letter-spacing: 0.18em; text-transform: uppercase; color: #8E8E8E;">SERENDIPITY / ELVIS · OFFICIAL PRESALE</span>
          <h1 style="font-size: 28px; color: #281810; margin: 10px 0 0; font-weight: 400;">Pre-order Received: ${orderNumber}</h1>
        </div>

        <p style="font-family: Arial, sans-serif; font-size: 15px; color: #4a382c; line-height: 1.6;">
          Hello <strong>${customerName}</strong>,<br/><br/>
          Thank you for securing your copy of <strong>${bookTitle}</strong> by Dr Elvis Justice Bedi. Your pre-order has been recorded and is currently <strong>Awaiting Payment Verification</strong>.
        </p>

        <div style="background: #faf8f5; border: 1px solid #ded8cb; padding: 20px; border-radius: 4px; margin: 24px 0; font-family: Arial, sans-serif;">
          <table style="width: 100%; font-size: 13px; line-height: 1.8;">
            <tr>
              <td style="color: #8E8E8E; width: 140px;">Order Number:</td>
              <td style="font-weight: bold; color: #281810;">${orderNumber}</td>
            </tr>
            <tr>
              <td style="color: #8E8E8E;">Edition Selected:</td>
              <td style="color: #281810;">${formatName} (Qty: ${quantity})</td>
            </tr>
            <tr>
              <td style="color: #8E8E8E;">Total Amount:</td>
              <td style="font-weight: bold; color: #6B3D24; font-size: 15px;">${totalAmount} ${currency}</td>
            </tr>
            <tr>
              <td style="color: #8E8E8E;">Payment Method:</td>
              <td style="text-transform: capitalize; color: #281810;">${paymentMethod.replace(/_/g, ' ')}</td>
            </tr>
          </table>
        </div>

        <div style="background: #fffdfa; border-left: 4px solid #B57A4B; padding: 18px; margin: 24px 0; font-family: Arial, sans-serif; font-size: 13px;">
          <strong style="color: #6B3D24; display: block; margin-bottom: 6px;">Next Step: Complete Payment & Submit Proof</strong>
          <p style="margin: 0 0 10px; color: #4a382c; white-space: pre-line;">${paymentInstructions}</p>
          <p style="margin: 0; color: #8E8E8E; font-size: 12px;">
            Please use <strong>${orderNumber}</strong> as the payment reference or memo.
          </p>
        </div>

        <div style="text-align: center; margin: 32px 0;">
          <a href="${trackingUrl}" target="_blank" style="display: inline-block; background: #6B3D24; color: #ffffff; padding: 14px 28px; font-family: Arial, sans-serif; font-size: 13px; font-weight: bold; text-decoration: none; border-radius: 2px; text-transform: uppercase; letter-spacing: 0.06em;">
            View Order Status & Submit Proof &rarr;
          </a>
        </div>

        <p style="font-family: Georgia, serif; font-size: 14px; font-style: italic; color: #6B3D24; margin-bottom: 28px; text-align: center;">
          &ldquo;Process over profit. Win in the mind first.&rdquo;
        </p>

        <div style="border-top: 1px solid #ded8cb; padding-top: 18px; font-family: Arial, sans-serif; font-size: 11px; color: #8E8E8E; text-align: center;">
          Serendipity / Elvis Bookstore · Need help? Reply to this email or reach us at <a href="mailto:hello@elvisjusticebooks.com" style="color: #6B3D24;">hello@elvisjusticebooks.com</a>
        </div>
      </div>
    </div>
  `

  try {
    const result = await resend.emails.send({
      from: `Serendipity / Elvis <${resendFromEmail}>`,
      to: [customerEmail],
      subject: `Order Confirmed: ${bookTitle} Pre-order #${orderNumber}`,
      html,
    })
    return { success: true, data: result }
  } catch (error) {
    console.error('Failed to send presale order confirmation email via Resend:', error)
    return { success: false, error }
  }
}

/**
 * Send Payment Proof Confirmation to Customer
 */
export async function sendPaymentProofSubmittedCustomerEmail({
  customerEmail,
  customerName,
  orderNumber,
  paymentMethod,
  trackingUrl,
}: {
  customerEmail: string
  customerName: string
  orderNumber: string
  paymentMethod: string
  trackingUrl: string
}) {
  if (!resend) {
    console.log(`[Resend Mock Proof Acknowledged] To: ${customerEmail} | Order: ${orderNumber}`)
    return { success: true, mocked: true }
  }

  const html = `
    <div style="font-family: Georgia, 'Times New Roman', serif; background-color: #F7F6F3; padding: 40px 20px; color: #281810;">
      <div style="max-width: 600px; margin: auto; background: #ffffff; border: 1px solid #ded8cb; padding: 40px; border-radius: 4px; box-shadow: 0 10px 30px rgba(40,24,16,0.06);">
        <div style="border-bottom: 1px solid #ded8cb; padding-bottom: 22px; margin-bottom: 24px;">
          <span style="font-size: 11px; letter-spacing: 0.18em; text-transform: uppercase; color: #8E8E8E;">SERENDIPITY / ELVIS · PAYMENT STATUS</span>
          <h1 style="font-size: 26px; color: #281810; margin: 10px 0 0; font-weight: 400;">Payment Proof Received</h1>
        </div>

        <p style="font-family: Arial, sans-serif; font-size: 15px; color: #4a382c; line-height: 1.6;">
          Hello <strong>${customerName}</strong>,<br/><br/>
          We have successfully received your payment evidence for order <strong>#${orderNumber}</strong> (${paymentMethod.replace(/_/g, ' ')}).
        </p>

        <div style="background: #f8fafc; border: 1px solid #e2e8f0; padding: 18px; border-radius: 4px; margin: 24px 0; font-family: Arial, sans-serif; font-size: 13px; color: #334155;">
          <strong>Status: Under Verification</strong>
          <p style="margin: 6px 0 0; line-height: 1.5;">
            Our finance team is actively verifying the funds in our accounts. Once verified, your order status will be updated to <strong>Confirmed</strong> and you will receive an official verification certificate and release timeline.
          </p>
        </div>

        <div style="text-align: center; margin: 28px 0;">
          <a href="${trackingUrl}" target="_blank" style="display: inline-block; background: #281810; color: #ffffff; padding: 12px 24px; font-family: Arial, sans-serif; font-size: 12px; font-weight: bold; text-decoration: none; border-radius: 2px; text-transform: uppercase; letter-spacing: 0.05em;">
            Track Order Live &rarr;
          </a>
        </div>

        <div style="border-top: 1px solid #ded8cb; padding-top: 18px; font-family: Arial, sans-serif; font-size: 11px; color: #8E8E8E; text-align: center;">
          Serendipity / Elvis Bookstore · <a href="mailto:hello@elvisjusticebooks.com" style="color: #6B3D24;">hello@elvisjusticebooks.com</a>
        </div>
      </div>
    </div>
  `

  try {
    const result = await resend.emails.send({
      from: `Serendipity / Elvis <${resendFromEmail}>`,
      to: [customerEmail],
      subject: `Payment Evidence Under Review: Pre-order #${orderNumber}`,
      html,
    })
    return { success: true, data: result }
  } catch (error) {
    console.error('Failed to send proof receipt email via Resend:', error)
    return { success: false, error }
  }
}

/**
 * Send Payment Confirmed Email to Customer
 * Confirms payment has been received and explains book delivery on launch date
 */
export async function sendPaymentConfirmedCustomerEmail({
  customerEmail,
  customerName,
  orderNumber,
  bookTitle,
  formatName,
  isPhysical,
  downloadUrl,
  releaseDate,
  trackingUrl,
}: {
  customerEmail: string
  customerName: string
  orderNumber: string
  bookTitle: string
  formatName: string
  isPhysical: boolean
  downloadUrl?: string
  releaseDate?: string
  trackingUrl: string
}) {
  if (!resend) {
    console.log(`[Resend Mock Payment Confirmed] To: ${customerEmail} | Order: ${orderNumber}`)
    return { success: true, mocked: true }
  }

  const releaseDateStr = releaseDate
    ? new Date(releaseDate).toLocaleDateString('en-US', { month: 'long', day: 'numeric', year: 'numeric' })
    : 'November 6, 2026'

  const html = `
    <div style="font-family: Georgia, 'Times New Roman', serif; background-color: #F7F6F3; padding: 40px 20px; color: #281810;">
      <div style="max-width: 600px; margin: auto; background: #ffffff; border: 1px solid #ded8cb; padding: 40px; border-radius: 4px; box-shadow: 0 10px 30px rgba(40,24,16,0.06);">
        <div style="border-bottom: 1px solid #ded8cb; padding-bottom: 22px; margin-bottom: 24px;">
          <span style="font-size: 11px; letter-spacing: 0.18em; text-transform: uppercase; color: #8E8E8E;">SERENDIPITY / ELVIS · VERIFIED PRESALE PURCHASE</span>
          <h1 style="font-size: 28px; color: #281810; margin: 10px 0 0; font-weight: 400;">Pre-order Payment Confirmed!</h1>
        </div>

        <p style="font-family: Arial, sans-serif; font-size: 15px; color: #4a382c; line-height: 1.6;">
          Hello <strong>${customerName}</strong>,<br/><br/>
          Your payment for <strong>${bookTitle}</strong> (Order <strong>#${orderNumber}</strong>) has been verified and officially confirmed. Your copy is now securely reserved.
        </p>

        <div style="background: #f4fbf7; border: 1px solid #c3e6cb; padding: 22px; border-radius: 4px; margin: 24px 0; font-family: Arial, sans-serif;">
          <h3 style="margin: 0 0 8px; color: #155724; font-size: 16px;">Pre-order Status: Confirmed & Reserved</h3>
          <p style="margin: 0 0 10px; font-size: 13px; color: #2d6a4f; line-height: 1.6;">
            <strong>Edition Selected:</strong> ${formatName}<br/>
            <strong>Official Launch Date:</strong> ${releaseDateStr}
          </p>
          <p style="margin: 0; font-size: 13px; color: #2d6a4f; line-height: 1.6; border-top: 1px dashed #a3d9b8; padding-top: 10px;">
            ${
              isPhysical
                ? 'Your physical hardcover edition is allocated and queued for priority dispatch on the official launch day.'
                : `Your complete digital book download link will be delivered directly to your inbox (<strong>${customerEmail}</strong>) on the official launch date (${releaseDateStr}).`
            }
          </p>
        </div>

        ${
          downloadUrl
            ? `
          <div style="text-align: center; margin: 28px 0;">
            <p style="font-family: Arial, sans-serif; font-size: 13px; color: #155724; margin-bottom: 12px;">
              Early digital access has been granted for your edition:
            </p>
            <a href="${downloadUrl}" target="_blank" style="display: inline-block; background: #6B3D24; color: #ffffff; padding: 14px 28px; font-family: Arial, sans-serif; font-size: 13px; font-weight: bold; text-decoration: none; border-radius: 2px; text-transform: uppercase; letter-spacing: 0.05em;">
              Download Your Book Now &rarr;
            </a>
          </div>
        `
            : `
          <div style="text-align: center; margin: 28px 0;">
            <a href="${trackingUrl}" target="_blank" style="display: inline-block; background: #281810; color: #ffffff; padding: 14px 28px; font-family: Arial, sans-serif; font-size: 13px; font-weight: bold; text-decoration: none; border-radius: 2px; text-transform: uppercase; letter-spacing: 0.05em;">
              View Pre-order & Live Tracking &rarr;
            </a>
          </div>
        `
        }

        <p style="font-family: Georgia, serif; font-size: 15px; font-style: italic; color: #6B3D24; margin-bottom: 28px; text-align: center;">
          &ldquo;Process over profit. Win in the mind first.&rdquo;
        </p>

        <div style="border-top: 1px solid #ded8cb; padding-top: 18px; font-family: Arial, sans-serif; font-size: 11px; color: #8E8E8E; text-align: center;">
          Serendipity / Elvis Bookstore · Need assistance? <a href="mailto:hello@elvisjusticebooks.com" style="color: #6B3D24;">hello@elvisjusticebooks.com</a>
        </div>
      </div>
    </div>
  `

  try {
    const result = await resend.emails.send({
      from: `Serendipity / Elvis <${resendFromEmail}>`,
      to: [customerEmail],
      subject: `Payment Confirmed: Pre-order #${orderNumber} — ${bookTitle}`,
      html,
    })
    return { success: true, data: result }
  } catch (error) {
    console.error('Failed to send payment confirmed email via Resend:', error)
    return { success: false, error }
  }
}

/**
 * Send Payment Rejection Notice to Customer
 */
export async function sendPaymentRejectedCustomerEmail({
  customerEmail,
  customerName,
  orderNumber,
  rejectionReason,
  trackingUrl,
}: {
  customerEmail: string
  customerName: string
  orderNumber: string
  rejectionReason: string
  trackingUrl: string
}) {
  if (!resend) {
    console.log(`[Resend Mock Payment Rejected] To: ${customerEmail} | Order: ${orderNumber}`)
    return { success: true, mocked: true }
  }

  const html = `
    <div style="font-family: Georgia, 'Times New Roman', serif; background-color: #F7F6F3; padding: 40px 20px; color: #281810;">
      <div style="max-width: 600px; margin: auto; background: #ffffff; border: 1px solid #ded8cb; padding: 40px; border-radius: 4px; box-shadow: 0 10px 30px rgba(40,24,16,0.06);">
        <div style="border-bottom: 1px solid #ded8cb; padding-bottom: 22px; margin-bottom: 24px;">
          <span style="font-size: 11px; letter-spacing: 0.18em; text-transform: uppercase; color: #8E8E8E;">SERENDIPITY / ELVIS · PAYMENT NOTICE</span>
          <h1 style="font-size: 26px; color: #991b1b; margin: 10px 0 0; font-weight: 400;">Payment Verification Issue</h1>
        </div>

        <p style="font-family: Arial, sans-serif; font-size: 15px; color: #4a382c; line-height: 1.6;">
          Hello <strong>${customerName}</strong>,<br/><br/>
          We encountered an issue verifying the payment submission for your pre-order <strong>#${orderNumber}</strong>.
        </p>

        <div style="background: #fff5f5; border-left: 4px solid #dc2626; padding: 18px; margin: 24px 0; font-family: Arial, sans-serif; font-size: 13px; color: #991b1b;">
          <strong>Reason Noted by Finance Team:</strong>
          <p style="margin: 6px 0 0; line-height: 1.5; color: #7f1d1d;">
            ${rejectionReason || 'The payment proof provided could not be matched with incoming deposits or the transaction hash was invalid.'}
          </p>
        </div>

        <p style="font-family: Arial, sans-serif; font-size: 14px; color: #4a382c; line-height: 1.6;">
          Your order has not been cancelled. You can easily re-submit a valid receipt, updated transaction hash, or bank transfer reference using your secure order portal:
        </p>

        <div style="text-align: center; margin: 28px 0;">
          <a href="${trackingUrl}" target="_blank" style="display: inline-block; background: #6B3D24; color: #ffffff; padding: 12px 26px; font-family: Arial, sans-serif; font-size: 13px; font-weight: bold; text-decoration: none; border-radius: 2px; text-transform: uppercase; letter-spacing: 0.05em;">
            Update Payment Evidence &rarr;
          </a>
        </div>

        <div style="border-top: 1px solid #ded8cb; padding-top: 18px; font-family: Arial, sans-serif; font-size: 11px; color: #8E8E8E; text-align: center;">
          Serendipity / Elvis Bookstore · Support: <a href="mailto:hello@elvisjusticebooks.com" style="color: #6B3D24;">hello@elvisjusticebooks.com</a>
        </div>
      </div>
    </div>
  `

  try {
    const result = await resend.emails.send({
      from: `Serendipity / Elvis <${resendFromEmail}>`,
      to: [customerEmail],
      subject: `Action Required: Payment Verification Update for Pre-order #${orderNumber}`,
      html,
    })
    return { success: true, data: result }
  } catch (error) {
    console.error('Failed to send payment rejected email via Resend:', error)
    return { success: false, error }
  }
}

/**
 * Send Single Book Release / Delivery Notification
 */
export async function sendBookReleasedCustomerEmail({
  customerEmail,
  customerName,
  orderNumber,
  bookTitle,
  downloadUrl,
  trackingReference,
  courierName,
}: {
  customerEmail: string
  customerName: string
  orderNumber: string
  bookTitle: string
  downloadUrl?: string
  trackingReference?: string
  courierName?: string
}) {
  if (!resend) {
    console.log(`[Resend Mock Book Released] To: ${customerEmail} | Order: ${orderNumber}`)
    return { success: true, mocked: true }
  }

  const html = `
    <div style="font-family: Georgia, 'Times New Roman', serif; background-color: #F7F6F3; padding: 40px 20px; color: #281810;">
      <div style="max-width: 600px; margin: auto; background: #ffffff; border: 1px solid #ded8cb; padding: 40px; border-radius: 4px; box-shadow: 0 10px 30px rgba(40,24,16,0.06);">
        <div style="border-bottom: 1px solid #ded8cb; padding-bottom: 22px; margin-bottom: 24px;">
          <span style="font-size: 11px; letter-spacing: 0.18em; text-transform: uppercase; color: #8E8E8E;">SERENDIPITY / ELVIS · OFFICIAL RELEASE</span>
          <h1 style="font-size: 28px; color: #281810; margin: 10px 0 0; font-weight: 400;">${bookTitle} Is Here!</h1>
        </div>

        <p style="font-family: Arial, sans-serif; font-size: 15px; color: #4a382c; line-height: 1.6;">
          Hello <strong>${customerName}</strong>,<br/><br/>
          The wait is over. <strong>${bookTitle}</strong> by Dr Elvis Justice Bedi has officially launched!
        </p>

        ${
          downloadUrl
            ? `
          <div style="background: #faf8f5; border: 1px solid #ded8cb; padding: 24px; border-radius: 4px; margin: 24px 0; text-align: center;">
            <p style="font-family: Arial, sans-serif; font-size: 14px; color: #4a382c; margin-bottom: 18px;">
              Your high-definition digital edition is ready for instant download:
            </p>
            <a href="${downloadUrl}" target="_blank" style="display: inline-block; background: #6B3D24; color: #ffffff; padding: 14px 28px; font-family: Arial, sans-serif; font-size: 13px; font-weight: bold; text-decoration: none; border-radius: 2px; text-transform: uppercase; letter-spacing: 0.05em;">
              Download Complete eBook (PDF) &rarr;
            </a>
          </div>
        `
            : ''
        }

        ${
          trackingReference
            ? `
          <div style="background: #faf8f5; border: 1px solid #ded8cb; padding: 20px; border-radius: 4px; margin: 24px 0; font-family: Arial, sans-serif; font-size: 13px;">
            <strong>Physical Delivery Dispatched:</strong>
            <p style="margin: 6px 0 0; color: #4a382c;">
              Courier: <strong>${courierName || 'Standard Express'}</strong><br/>
              Tracking Number: <strong>${trackingReference}</strong>
            </p>
          </div>
        `
            : ''
        }

        <p style="font-family: Georgia, serif; font-size: 15px; font-style: italic; color: #6B3D24; margin: 28px 0; text-align: center;">
          &ldquo;Process over profit. Win in the mind first.&rdquo;
        </p>

        <div style="border-top: 1px solid #ded8cb; padding-top: 18px; font-family: Arial, sans-serif; font-size: 11px; color: #8E8E8E; text-align: center;">
          Serendipity / Elvis Bookstore · <a href="mailto:hello@elvisjusticebooks.com" style="color: #6B3D24;">hello@elvisjusticebooks.com</a>
        </div>
      </div>
    </div>
  `

  try {
    const result = await resend.emails.send({
      from: `Serendipity / Elvis <${resendFromEmail}>`,
      to: [customerEmail],
      subject: `Your Copy Is Ready: ${bookTitle} by Dr Elvis Justice Bedi`,
      html,
    })
    return { success: true, data: result }
  } catch (error) {
    console.error('Failed to send book released email via Resend:', error)
    return { success: false, error }
  }
}

export interface BulkLaunchRecipient {
  email: string
  name?: string
  source?: 'waitlist' | 'newsletter' | 'both'
}

export interface SendBulkLaunchNotificationParams {
  recipients: BulkLaunchRecipient[]
  launchTitle: string
  authorName?: string
  launchDate?: string
  tagline?: string
  customMessage?: string
  storeUrl?: string
  previewUrl?: string
  scheduledAt?: string // ISO 8601 e.g. "2026-11-06T09:00:00.000Z"
}

/**
 * Bulk Launch Notification for deduplicated Waitlist + Newsletter subscribers
 * Supports Resend Scheduled Sending and batching
 */
export async function sendBulkLaunchNotificationEmails({
  recipients,
  launchTitle = 'Practical Trading Psychology',
  authorName = 'Dr Elvis Justice Bedi',
  launchDate,
  tagline = 'Process over profit. Win in the mind first.',
  customMessage,
  storeUrl = process.env.NEXT_PUBLIC_APP_URL || 'http://localhost:3000',
  previewUrl = `${process.env.NEXT_PUBLIC_APP_URL || 'http://localhost:3000'}/preview/practical-trading-psychology`,
  scheduledAt,
}: SendBulkLaunchNotificationParams) {
  if (!recipients || recipients.length === 0) {
    return { success: true, totalSent: 0, scheduled: Boolean(scheduledAt), message: 'No recipients to notify.' }
  }

  const dateStr = launchDate
    ? new Date(launchDate).toLocaleDateString('en-US', { month: 'long', day: 'numeric', year: 'numeric' })
    : 'Today'

  // Helper to build HTML for each recipient
  const buildHtml = (name?: string) => `
    <div style="font-family: Georgia, 'Times New Roman', serif; background-color: #F7F6F3; padding: 40px 20px; color: #281810;">
      <div style="max-width: 620px; margin: auto; background: #ffffff; border: 1px solid #ded8cb; padding: 42px; border-radius: 4px; box-shadow: 0 10px 30px rgba(40,24,16,0.06);">
        <div style="border-bottom: 1px solid #ded8cb; padding-bottom: 22px; margin-bottom: 24px;">
          <span style="font-size: 11px; letter-spacing: 0.18em; text-transform: uppercase; color: #8E8E8E;">SERENDIPITY / ELVIS · OFFICIAL RELEASE</span>
          <h1 style="font-size: 28px; color: #281810; margin: 10px 0 0; font-weight: 400;">${launchTitle} Is Now Live</h1>
        </div>

        <p style="font-family: Arial, sans-serif; font-size: 15px; color: #4a382c; line-height: 1.6;">
          Hello ${name ? `<strong>${name}</strong>` : 'Reader'},<br/><br/>
          The wait is over. <strong>${launchTitle}</strong> by <strong>${authorName}</strong> is now officially released!
        </p>

        ${
          customMessage
            ? `
          <div style="background: #fffdfa; border-left: 4px solid #B57A4B; padding: 16px 20px; margin: 22px 0; font-family: Arial, sans-serif; font-size: 14px; color: #4a382c; line-height: 1.6;">
            ${customMessage}
          </div>
        `
            : ''
        }

        <div style="background: #faf8f5; border: 1px solid #ded8cb; padding: 24px; border-radius: 4px; margin: 26px 0;">
          <p style="margin: 0 0 6px; font-size: 11px; text-transform: uppercase; letter-spacing: 0.12em; color: #B57A4B; font-weight: bold;">New Book Release</p>
          <h2 style="margin: 0 0 10px; font-size: 22px; color: #281810; font-family: Georgia, serif;">${launchTitle}</h2>
          <p style="margin: 0 0 16px; font-family: Arial, sans-serif; font-size: 14px; color: #6B3D24; font-style: italic;">
            &ldquo;${tagline}&rdquo;
          </p>
          <p style="margin: 0; font-family: Arial, sans-serif; font-size: 13px; color: #4a382c; line-height: 1.6;">
            Available formats: <strong>Digital eBook (PDF & EPUB)</strong>, <strong>Audiobook Masterclass</strong>, and <strong>Executive Clothbound Hardcover</strong>.
          </p>
        </div>

        <div style="text-align: center; margin: 32px 0;">
          <a href="${storeUrl}" target="_blank" style="display: inline-block; background: #6B3D24; color: #ffffff; padding: 14px 30px; font-family: Arial, sans-serif; font-size: 13px; font-weight: bold; text-decoration: none; border-radius: 2px; text-transform: uppercase; letter-spacing: 0.06em; margin-right: 10px; margin-bottom: 10px;">
            Order Your Copy Now &rarr;
          </a>
          <a href="${previewUrl}" target="_blank" style="display: inline-block; background: #faf8f5; border: 1px solid #ded8cb; color: #281810; padding: 13px 24px; font-family: Arial, sans-serif; font-size: 13px; font-weight: bold; text-decoration: none; border-radius: 2px; text-transform: uppercase; letter-spacing: 0.05em; margin-bottom: 10px;">
            Read Free Preview Excerpt
          </a>
        </div>

        <div style="border-top: 1px solid #ded8cb; padding-top: 18px; font-family: Arial, sans-serif; font-size: 11px; color: #8E8E8E; text-align: center;">
          Serendipity / Elvis Bookstore · Books for Curious Minds · <a href="mailto:hello@elvisjusticebooks.com" style="color: #6B3D24;">hello@elvisjusticebooks.com</a>
          <br/>You received this email because you registered on our priority waitlist or reading newsletter.
        </div>
      </div>
    </div>
  `

  if (!resend) {
    console.log(`[Resend Mock Bulk Launch Notification] Dispatched to ${recipients.length} recipients (Scheduled: ${scheduledAt || 'Immediate'})`)
    return {
      success: true,
      totalSent: recipients.length,
      scheduled: Boolean(scheduledAt),
      scheduledAt,
      mocked: true,
    }
  }

  try {
    // Process in batches of 100 (Resend batch API limit)
    const BATCH_SIZE = 100
    let totalSuccess = 0
    const errors: any[] = []

    for (let i = 0; i < recipients.length; i += BATCH_SIZE) {
      const batchSlice = recipients.slice(i, i + BATCH_SIZE)
      const batchPayload = batchSlice.map((r) => {
        const item: any = {
          from: `Dr Elvis Justice Bedi <${resendFromEmail}>`,
          to: [r.email],
          subject: `Out Now: ${launchTitle} by ${authorName}`,
          html: buildHtml(r.name),
        }
        if (scheduledAt) {
          item.scheduledAt = new Date(scheduledAt).toISOString()
        }
        return item
      })

      try {
        const res = await resend.batch.send(batchPayload)
        if (res.error) {
          console.error('Resend batch error:', res.error)
          errors.push(res.error)
        } else {
          totalSuccess += batchSlice.length
        }
      } catch (err: any) {
        console.error('Resend batch send exception:', err)
        errors.push(err?.message)
      }
    }

    return {
      success: errors.length === 0,
      totalSent: totalSuccess,
      scheduled: Boolean(scheduledAt),
      scheduledAt,
      errors: errors.length > 0 ? errors : undefined,
    }
  } catch (error: any) {
    console.error('Failed to send bulk launch notification:', error)
    return { success: false, error: error?.message || 'Bulk sending failed' }
  }
}

export interface PresaleDeliveryItem {
  orderNumber: string
  customerEmail: string
  customerName: string
  bookTitle: string
  bookFormat: string
  downloadUrl?: string
  accessToken?: string
  trackingUrl?: string
  trackingReference?: string
  courierName?: string
}

export interface SendBulkPresaleDeliveryParams {
  items: PresaleDeliveryItem[]
  scheduledAt?: string // ISO 8601 string or timestamp
}

/**
 * Bulk Digital Book Delivery for Paid Presale Customers
 * Delivers secure download tokens / shipment notifications with optional Scheduled Sending
 */
export async function sendBulkPresaleBookDeliveryEmails({
  items,
  scheduledAt,
}: SendBulkPresaleDeliveryParams) {
  if (!items || items.length === 0) {
    return { success: true, totalDelivered: 0, scheduled: Boolean(scheduledAt), message: 'No presale orders to fulfill.' }
  }

  const buildHtml = (item: PresaleDeliveryItem) => {
    const isPhysical = item.bookFormat?.includes('printed') || item.bookFormat?.includes('bundle')
    const appUrl = process.env.NEXT_PUBLIC_APP_URL || 'http://localhost:3000'
    const trackingUrl = item.trackingUrl || `${appUrl}/order/${item.accessToken || item.orderNumber}`

    return `
      <div style="font-family: Georgia, 'Times New Roman', serif; background-color: #F7F6F3; padding: 40px 20px; color: #281810;">
        <div style="max-width: 620px; margin: auto; background: #ffffff; border: 1px solid #ded8cb; padding: 42px; border-radius: 4px; box-shadow: 0 10px 30px rgba(40,24,16,0.06);">
          <div style="border-bottom: 1px solid #ded8cb; padding-bottom: 22px; margin-bottom: 24px;">
            <span style="font-size: 11px; letter-spacing: 0.18em; text-transform: uppercase; color: #8E8E8E;">SERENDIPITY / ELVIS · EXCLUSIVE PRESALE FULFILLMENT</span>
            <h1 style="font-size: 28px; color: #281810; margin: 10px 0 0; font-weight: 400;">Your Book Has Arrived!</h1>
          </div>

          <p style="font-family: Arial, sans-serif; font-size: 15px; color: #4a382c; line-height: 1.6;">
            Hello <strong>${item.customerName || 'Reader'}</strong>,<br/><br/>
            Thank you for being an early presale supporter of <strong>${item.bookTitle}</strong> by Dr Elvis Justice Bedi. The launch has arrived, and your official copy is ready!
          </p>

          <div style="background: #faf8f5; border: 1px solid #ded8cb; padding: 20px; border-radius: 4px; margin: 24px 0; font-family: Arial, sans-serif;">
            <p style="margin: 0 0 6px; font-size: 11px; text-transform: uppercase; letter-spacing: 0.1em; color: #8E8E8E;">Order Reference</p>
            <strong style="color: #281810; font-size: 15px;">#${item.orderNumber}</strong> &nbsp;·&nbsp; Edition: <strong>${item.bookFormat.replace(/_/g, ' ')}</strong>
          </div>

          ${
            item.downloadUrl
              ? `
            <div style="background: #f4fbf7; border: 1px solid #c3e6cb; padding: 26px; border-radius: 4px; margin: 26px 0; text-align: center;">
              <h3 style="margin: 0 0 8px; color: #155724; font-size: 18px; font-family: Georgia, serif;">Instant Digital Edition Ready</h3>
              <p style="font-family: Arial, sans-serif; font-size: 13px; color: #2d6a4f; margin-bottom: 20px;">
                Your personal license has been generated for ${item.customerEmail}. Click below to download:
              </p>
              <a href="${item.downloadUrl}" target="_blank" style="display: inline-block; background: #6B3D24; color: #ffffff; padding: 15px 32px; font-family: Arial, sans-serif; font-size: 13px; font-weight: bold; text-decoration: none; border-radius: 2px; text-transform: uppercase; letter-spacing: 0.06em;">
                Download Complete Book (PDF / eBook) &rarr;
              </a>
            </div>
          `
              : ''
          }

          ${
            isPhysical
              ? `
            <div style="background: #faf8f5; border: 1px solid #ded8cb; padding: 20px; border-radius: 4px; margin: 24px 0; font-family: Arial, sans-serif; font-size: 13px;">
              <strong>Physical Edition Priority Dispatch:</strong>
              <p style="margin: 6px 0 0; color: #4a382c; line-height: 1.5;">
                Courier: <strong>${item.courierName || 'Priority Express'}</strong><br/>
                Tracking Reference: <strong>${item.trackingReference || 'Preparing Dispatch'}</strong>
              </p>
            </div>
          `
              : ''
          }

          <div style="text-align: center; margin: 28px 0;">
            <a href="${trackingUrl}" target="_blank" style="display: inline-block; background: #281810; color: #ffffff; padding: 12px 24px; font-family: Arial, sans-serif; font-size: 12px; font-weight: bold; text-decoration: none; border-radius: 2px; text-transform: uppercase; letter-spacing: 0.05em;">
              View Order Details & Reader Portal &rarr;
            </a>
          </div>

          <p style="font-family: Georgia, serif; font-size: 15px; font-style: italic; color: #6B3D24; margin: 28px 0; text-align: center;">
            &ldquo;Process over profit. Win in the mind first.&rdquo;
          </p>

          <div style="border-top: 1px solid #ded8cb; padding-top: 18px; font-family: Arial, sans-serif; font-size: 11px; color: #8E8E8E; text-align: center;">
            Serendipity / Elvis Bookstore · Need support? <a href="mailto:hello@elvisjusticebooks.com" style="color: #6B3D24;">hello@elvisjusticebooks.com</a>
          </div>
        </div>
      </div>
    `
  }

  if (!resend) {
    console.log(`[Resend Mock Bulk Presale Delivery] Delivering books to ${items.length} paid presale orders (Scheduled: ${scheduledAt || 'Immediate'})`)
    return {
      success: true,
      totalDelivered: items.length,
      scheduled: Boolean(scheduledAt),
      scheduledAt,
      mocked: true,
    }
  }

  try {
    const BATCH_SIZE = 100
    let totalSuccess = 0
    const errors: any[] = []

    for (let i = 0; i < items.length; i += BATCH_SIZE) {
      const batchSlice = items.slice(i, i + BATCH_SIZE)
      const batchPayload = batchSlice.map((item) => {
        const emailObj: any = {
          from: `Dr Elvis Justice Bedi <${resendFromEmail}>`,
          to: [item.customerEmail],
          subject: `Your Book Is Ready: ${item.bookTitle} (Pre-order #${item.orderNumber})`,
          html: buildHtml(item),
        }
        if (scheduledAt) {
          emailObj.scheduledAt = new Date(scheduledAt).toISOString()
        }
        return emailObj
      })

      try {
        const res = await resend.batch.send(batchPayload)
        if (res.error) {
          console.error('Resend batch presale delivery error:', res.error)
          errors.push(res.error)
        } else {
          totalSuccess += batchSlice.length
        }
      } catch (err: any) {
        console.error('Resend batch delivery error:', err)
        errors.push(err?.message)
      }
    }

    return {
      success: errors.length === 0,
      totalDelivered: totalSuccess,
      scheduled: Boolean(scheduledAt),
      scheduledAt,
      errors: errors.length > 0 ? errors : undefined,
    }
  } catch (error: any) {
    console.error('Failed to send bulk presale delivery:', error)
    return { success: false, error: error?.message || 'Bulk fulfillment failed' }
  }
}





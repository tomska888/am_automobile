/**
 * AM Automobile – Email Service
 * Uses nodemailer with SMTP (Hostinger / any SMTP provider).
 * Falls back to Ethereal (test account) when MAIL_HOST is not configured,
 * so the server always starts without crashing in development.
 */

const nodemailer = require('nodemailer')

// ─── Transporter ─────────────────────────────────────────────────────────────

let _transporter = null

async function getTransporter() {
  if (_transporter) return _transporter

  // Support both SMTP_* (deployment guide) and MAIL_* (legacy) env var names
  const smtpHost = process.env.SMTP_HOST || process.env.MAIL_HOST
  const smtpPort = process.env.SMTP_PORT || process.env.MAIL_PORT || '587'
  const smtpUser = process.env.SMTP_USER || process.env.MAIL_USER
  const smtpPass = process.env.SMTP_PASS || process.env.MAIL_PASS
  const smtpFrom = process.env.SMTP_FROM || process.env.MAIL_FROM || 'noreply@amautomobile.pl'

  if (smtpHost) {
    // Production / staging: real SMTP credentials from .env
    _transporter = nodemailer.createTransport({
      host:   smtpHost,
      port:   parseInt(smtpPort, 10),
      secure: smtpPort === '465',   // true only for port 465
      auth: {
        user: smtpUser,
        pass: smtpPass
      },
      tls: { rejectUnauthorized: process.env.NODE_ENV === 'production' }
    })
    // Store resolved from address for use in sendMail
    _transporter._amFrom = smtpFrom
  } else if (process.env.NODE_ENV === 'production') {
    // Production with no MAIL_HOST — create a no-op transporter so the
    // server doesn't crash. Emails won't be sent; a warning is logged.
    console.warn('[email] WARNING: MAIL_HOST is not set. Password reset emails will NOT be sent.')
    _transporter = nodemailer.createTransport({ jsonTransport: true })
  } else {
    // Development fallback: Ethereal catches emails without sending them.
    // Preview URL is printed to the console after each send.
    try {
      const testAccount = await nodemailer.createTestAccount()
      _transporter = nodemailer.createTransport({
        host: 'smtp.ethereal.email',
        port: 587,
        secure: false,
        auth: { user: testAccount.user, pass: testAccount.pass }
      })
      console.log('[email] No MAIL_HOST set — using Ethereal test account:', testAccount.user)
    } catch {
      console.warn('[email] Could not create Ethereal test account — falling back to no-op transport.')
      _transporter = nodemailer.createTransport({ jsonTransport: true })
    }
  }

  return _transporter
}

// ─── Branded HTML Email Builder ───────────────────────────────────────────────

/**
 * Returns a complete HTML string for the password-reset email.
 * Design mirrors the AM Automobile brand: dark navy gradient header,
 * accent blue CTA button, clean white card body.
 *
 * @param {object} opts
 * @param {string} opts.userName      – Recipient's display name
 * @param {string} opts.resetUrl      – Full reset link (expires in 1 hour)
 * @param {string} [opts.expiresText] – Human-readable expiry label
 */
function buildResetEmailHtml({ userName, resetUrl, expiresText = '1 hour' }) {
  const year = new Date().getFullYear()

  return /* html */`<!DOCTYPE html>
<html lang="en">
<head>
  <meta charset="UTF-8" />
  <meta name="viewport" content="width=device-width, initial-scale=1.0" />
  <meta http-equiv="X-UA-Compatible" content="IE=edge" />
  <title>Reset your AM Automobile password</title>
  <!--[if mso]>
  <noscript><xml><o:OfficeDocumentSettings><o:PixelsPerInch>96</o:PixelsPerInch></o:OfficeDocumentSettings></xml></noscript>
  <![endif]-->
  <style>
    /* Reset */
    * { margin:0; padding:0; box-sizing:border-box; }
    body, table, td, a { -webkit-text-size-adjust:100%; -ms-text-size-adjust:100%; }
    table, td { mso-table-lspace:0pt; mso-table-rspace:0pt; border-collapse:collapse; }
    img { -ms-interpolation-mode:bicubic; border:0; height:auto; line-height:100%; outline:none; text-decoration:none; }
    /* Base */
    body {
      background-color: #f0f4f8;
      font-family: -apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, 'Helvetica Neue', Arial, sans-serif;
      color: #1a202c;
      margin: 0;
      padding: 0;
    }
    a { color: #007bff; text-decoration: none; }
    a:hover { text-decoration: underline; }
  </style>
</head>
<body style="background-color:#f0f4f8; margin:0; padding:0;">

  <!-- Wrapper -->
  <table role="presentation" width="100%" cellpadding="0" cellspacing="0" style="background-color:#f0f4f8; padding:40px 16px;">
    <tr>
      <td align="center">

        <!-- Card -->
        <table role="presentation" width="100%" style="max-width:560px;" cellpadding="0" cellspacing="0">

          <!-- ── HEADER ── -->
          <tr>
            <td style="background:linear-gradient(145deg,#0A4B8C 0%,#0d1117 55%,#1a1a2e 100%); border-radius:16px 16px 0 0; padding:36px 40px 32px; text-align:center;">
              <!-- Logo row -->
              <table role="presentation" width="100%" cellpadding="0" cellspacing="0">
                <tr>
                  <td align="center" style="padding-bottom:24px;">
                    <!-- Icon badge -->
                    <table role="presentation" cellpadding="0" cellspacing="0" style="display:inline-table;">
                      <tr>
                        <td style="background:rgba(255,255,255,0.15); border-radius:12px; width:48px; height:48px; text-align:center; vertical-align:middle; padding:0 12px; font-size:22px; line-height:48px;">
                          🚗
                        </td>
                        <td style="padding-left:12px; text-align:left; vertical-align:middle;">
                          <div style="font-size:17px; font-weight:800; color:#ffffff; letter-spacing:-0.02em; line-height:1.1;">AM Automobile</div>
                          <div style="font-size:9px; color:rgba(255,255,255,0.55); letter-spacing:0.12em; font-weight:600; margin-top:2px;">PREMIUM DEALERSHIP</div>
                        </td>
                      </tr>
                    </table>
                  </td>
                </tr>
              </table>
              <!-- Key icon -->
              <div style="display:inline-block; background:rgba(255,255,255,0.12); border-radius:50%; width:64px; height:64px; line-height:64px; text-align:center; font-size:28px; margin-bottom:16px;">
                🔑
              </div>
              <h1 style="font-size:24px; font-weight:800; color:#ffffff; margin:0 0 8px; letter-spacing:-0.02em; line-height:1.2;">
                Reset Your Password
              </h1>
              <p style="font-size:15px; color:rgba(255,255,255,0.7); margin:0; line-height:1.5;">
                We received a request to reset your password
              </p>
            </td>
          </tr>

          <!-- ── BODY ── -->
          <tr>
            <td style="background:#ffffff; padding:40px; border-left:1px solid #e2e8f0; border-right:1px solid #e2e8f0;">

              <!-- Greeting -->
              <p style="font-size:16px; color:#374151; line-height:1.6; margin:0 0 20px;">
                Hi <strong style="color:#1a202c;">${escapeHtml(userName)}</strong>,
              </p>
              <p style="font-size:15px; color:#6b7280; line-height:1.65; margin:0 0 32px;">
                Someone requested a password reset for your AM Automobile account. Click the button below to set a new password. This link will expire in <strong style="color:#1a202c;">${expiresText}</strong>.
              </p>

              <!-- CTA Button -->
              <table role="presentation" width="100%" cellpadding="0" cellspacing="0" style="margin-bottom:32px;">
                <tr>
                  <td align="center">
                    <a href="${resetUrl}"
                       target="_blank"
                       style="display:inline-block;
                              background:linear-gradient(135deg,#007bff 0%,#0056b3 100%);
                              color:#ffffff;
                              font-size:16px;
                              font-weight:700;
                              text-decoration:none;
                              padding:14px 40px;
                              border-radius:12px;
                              letter-spacing:-0.01em;
                              box-shadow:0 4px 14px rgba(0,123,255,0.35);">
                      Reset Password
                    </a>
                  </td>
                </tr>
              </table>

              <!-- Divider -->
              <table role="presentation" width="100%" cellpadding="0" cellspacing="0" style="margin-bottom:24px;">
                <tr>
                  <td style="border-top:1px solid #e5e7eb; font-size:0; line-height:0;">&nbsp;</td>
                </tr>
              </table>

              <!-- Fallback URL -->
              <p style="font-size:13px; color:#9ca3af; line-height:1.6; margin:0 0 8px;">
                If the button doesn't work, copy and paste this link into your browser:
              </p>
              <p style="font-size:12px; color:#007bff; word-break:break-all; line-height:1.5; margin:0 0 28px;">
                <a href="${resetUrl}" style="color:#007bff;">${resetUrl}</a>
              </p>

              <!-- Security notice -->
              <table role="presentation" width="100%" cellpadding="0" cellspacing="0">
                <tr>
                  <td style="background:#fefce8; border:1px solid #fde68a; border-radius:10px; padding:16px 20px;">
                    <p style="font-size:13px; color:#92400e; margin:0; line-height:1.55;">
                      ⚠️ &nbsp;<strong>Didn't request this?</strong> If you didn't ask for a password reset, you can safely ignore this email. Your password will remain unchanged.
                    </p>
                  </td>
                </tr>
              </table>

            </td>
          </tr>

          <!-- ── FOOTER ── -->
          <tr>
            <td style="background:#f8fafc; border:1px solid #e2e8f0; border-top:none; border-radius:0 0 16px 16px; padding:24px 40px; text-align:center;">
              <p style="font-size:13px; color:#9ca3af; margin:0 0 6px; line-height:1.5;">
                © ${year} AM Automobile · Premium Car Dealership
              </p>
              <p style="font-size:12px; color:#d1d5db; margin:0; line-height:1.5;">
                This is an automated message — please do not reply to this email.
              </p>
            </td>
          </tr>

        </table>
        <!-- /Card -->

      </td>
    </tr>
  </table>

</body>
</html>`
}

// ─── HTML Escape Utility ──────────────────────────────────────────────────────

function escapeHtml(str) {
  const map = { '&': '&', '<': '<', '>': '>', '"': '"', "'": '&#x27;' }
  return String(str).replace(/[&<>"']/g, (c) => map[c])
}

// ─── Plain-text fallback ──────────────────────────────────────────────────────

function buildResetEmailText({ userName, resetUrl, expiresText = '1 hour' }) {
  return [
    `AM Automobile — Reset Your Password`,
    ``,
    `Hi ${userName},`,
    ``,
    `Someone requested a password reset for your AM Automobile account.`,
    `Click the link below to set a new password (expires in ${expiresText}):`,
    ``,
    resetUrl,
    ``,
    `If you didn't request this, you can safely ignore this email.`,
    `Your password will remain unchanged.`,
    ``,
    `— AM Automobile`
  ].join('\n')
}

// ─── Public API ───────────────────────────────────────────────────────────────

/**
 * Send a password-reset email.
 *
 * @param {object} opts
 * @param {string} opts.to         – Recipient email address
 * @param {string} opts.userName   – Recipient display name
 * @param {string} opts.resetUrl   – Full reset link
 */
async function sendPasswordResetEmail({ to, userName, resetUrl }) {
  const transporter = await getTransporter()
  const expiresText = '1 hour'

  const fromAddress = transporter._amFrom
    || process.env.SMTP_FROM
    || process.env.MAIL_FROM
    || 'noreply@amautomobile.pl'

  const info = await transporter.sendMail({
    from: `"AM Automobile" <${fromAddress}>`,
    to,
    subject: 'Reset your AM Automobile password',
    text: buildResetEmailText({ userName, resetUrl, expiresText }),
    html: buildResetEmailHtml({ userName, resetUrl, expiresText })
  })

  // Log Ethereal preview URL in development
  if (!process.env.MAIL_HOST) {
    console.log('[email] Preview URL:', nodemailer.getTestMessageUrl(info))
  }

  return info
}

module.exports = { sendPasswordResetEmail }

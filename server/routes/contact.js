const router = require('express').Router()
const { body, validationResult } = require('express-validator')
const { pool } = require('../config/db')
const rateLimit = require('express-rate-limit')

// Strict rate limit for contact form to prevent spam
const contactLimiter = rateLimit({
    windowMs: 60 * 60 * 1000, // 1 hour
    max: 5,
    message: { success: false, message: 'Too many messages sent. Please wait before trying again.' }
})

// ─── POST /api/contact ────────────────────────────────────────────────────────

router.post(
    '/',
    contactLimiter,
    [
        body('name').trim().isLength({ min: 2, max: 100 }).withMessage('Name must be 2–100 characters'),
        body('email').isEmail({ allow_utf8_local_part: false }).toLowerCase().withMessage('Valid email required'),
        body('phone')
            .optional({ checkFalsy: true })
            .matches(/^[\d\s\+\-\(\)]{7,20}$/)
            .withMessage('Invalid phone number'),
        body('subject').trim().isLength({ min: 3, max: 200 }).withMessage('Subject must be 3–200 characters'),
        body('message').trim().isLength({ min: 10, max: 3000 }).withMessage('Message must be 10–3000 characters')
    ],
    async (req, res) => {
        const errors = validationResult(req)
        if (!errors.isEmpty()) {
            return res.status(422).json({ success: false, errors: errors.array() })
        }

        const { name, email, phone, subject, message, car_id } = req.body

        try {
            const [result] = await pool.query(
                `INSERT INTO messages (name, email, phone, subject, message, car_id, ip_address)
         VALUES (?, ?, ?, ?, ?, ?, ?)`,
                [
                    name,
                    email,
                    phone || null,
                    subject,
                    message,
                    car_id || null,
                    req.ip
                ]
            )

            // Optional: send notification email to admin
            // If nodemailer is configured, uncomment the block below:
            /*
            if (process.env.MAIL_HOST) {
              const transporter = require('nodemailer').createTransport({
                host: process.env.MAIL_HOST,
                port: process.env.MAIL_PORT || 587,
                auth: { user: process.env.MAIL_USER, pass: process.env.MAIL_PASS }
              })
              await transporter.sendMail({
                from: `"AM Automobile" <${process.env.MAIL_FROM}>`,
                to: process.env.MAIL_TO,
                subject: `[Nowa wiadomość] ${subject}`,
                text: `Od: ${name} <${email}>\n\n${message}`,
                html: `<p><strong>Od:</strong> ${name} <${email}></p><p>${message.replace(/\n/g, '<br>')}</p>`
              })
            }
            */

            res.status(201).json({
                success: true,
                message: 'Your message has been sent successfully',
                id: result.insertId
            })
        } catch (err) {
            console.error('POST /contact error:', err)
            res.status(500).json({ success: false, message: 'Failed to send message' })
        }
    }
)

module.exports = router

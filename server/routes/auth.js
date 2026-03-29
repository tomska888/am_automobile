const router  = require('express').Router()
const bcrypt  = require('bcryptjs')
const crypto  = require('crypto')
const jwt     = require('jsonwebtoken')
const { body, validationResult } = require('express-validator')
const { pool } = require('../config/db')
const auth    = require('../middleware/auth')
const { sendPasswordResetEmail } = require('../config/email')

// ─── Helpers ──────────────────────────────────────────────────────────────────

function signToken(user) {
  return jwt.sign(
    { id: user.id, email: user.email, role: user.role },
    process.env.JWT_SECRET,
    { expiresIn: process.env.JWT_EXPIRES_IN || '7d' }
  )
}

function handleValidation(req, res) {
  const errors = validationResult(req)
  if (!errors.isEmpty()) {
    res.status(422).json({ success: false, errors: errors.array() })
    return false
  }
  return true
}

// ─── POST /api/auth/register ──────────────────────────────────────────────────

router.post(
  '/register',
  [
    body('name').trim().isLength({ min: 2, max: 100 }).withMessage('Name must be 2–100 characters'),
    body('email').isEmail({ allow_utf8_local_part: false }).toLowerCase().withMessage('Valid email required'),
    body('password')
      .isLength({ min: 8 })
      .withMessage('Password must be at least 8 characters')
      .matches(/[A-Z]/)
      .withMessage('Password must contain an uppercase letter')
      .matches(/[0-9]/)
      .withMessage('Password must contain a number')
  ],
  async (req, res) => {
    if (!handleValidation(req, res)) return

    const { name, email, password } = req.body

    try {
      // Check duplicate email
      const [existing] = await pool.query('SELECT id FROM users WHERE email = ?', [email])
      if (existing.length > 0) {
        return res.status(409).json({ success: false, message: 'Email already registered' })
      }

      const passwordHash = await bcrypt.hash(password, 12)

      const [result] = await pool.query(
        'INSERT INTO users (name, email, password_hash, role) VALUES (?, ?, ?, ?)',
        [name, email, passwordHash, 'user']
      )

      const user = { id: result.insertId, email, role: 'user' }
      const token = signToken(user)

      res.status(201).json({
        success: true,
        message: 'Account created successfully',
        token,
        user: { id: user.id, name, email, role: 'user' }
      })
    } catch (err) {
      console.error('Register error:', err)
      res.status(500).json({ success: false, message: 'Registration failed' })
    }
  }
)

// ─── POST /api/auth/login ─────────────────────────────────────────────────────

router.post(
  '/login',
  [
    body('email').isEmail({ allow_utf8_local_part: false }).toLowerCase().withMessage('Valid email required'),
    body('password').notEmpty().withMessage('Password required')
  ],
  async (req, res) => {
    if (!handleValidation(req, res)) return

    const { email, password } = req.body

    try {
      const [rows] = await pool.query(
        'SELECT id, name, email, password_hash, role, is_active FROM users WHERE email = ?',
        [email]
      )

      const user = rows[0]

      if (!user) {
        // Consistent timing to prevent email enumeration
        await bcrypt.compare(password, '$2a$12$invalidhashplaceholderXXXXXXXXXXXXXXXXXXXXXXXX')
        return res.status(401).json({ success: false, message: 'Invalid credentials' })
      }

      if (!user.is_active) {
        return res.status(403).json({ success: false, message: 'Account disabled' })
      }

      const valid = await bcrypt.compare(password, user.password_hash)
      if (!valid) {
        return res.status(401).json({ success: false, message: 'Invalid credentials' })
      }

      // Update last login
      await pool.query('UPDATE users SET last_login = NOW() WHERE id = ?', [user.id])

      const token = signToken(user)

      // Fetch fresh user row so we return theme + locale
      const [freshRows] = await pool.query(
        'SELECT id, name, email, role, theme, locale FROM users WHERE id = ?',
        [user.id]
      )
      const freshUser = freshRows[0] || { id: user.id, name: user.name, email: user.email, role: user.role, theme: 'system', locale: 'en' }

      res.json({
        success: true,
        token,
        user: freshUser
      })
    } catch (err) {
      console.error('Login error:', err)
      res.status(500).json({ success: false, message: 'Login failed' })
    }
  }
)

// ─── POST /api/auth/logout ────────────────────────────────────────────────────
// JWT is stateless — actual invalidation happens client-side by discarding the
// token. This endpoint exists as a clean hook for future server-side token
// blacklisting (e.g. Redis blocklist) without requiring client changes.

router.post('/logout', auth, (req, res) => {
  // TODO: add token to Redis blacklist here when implementing server-side revocation
  res.json({ success: true, message: 'Logged out successfully' })
})

// ─── GET /api/auth/me ─────────────────────────────────────────────────────────

router.get('/me', auth, async (req, res) => {
  try {
    const [rows] = await pool.query(
      'SELECT id, name, email, role, theme, locale, created_at FROM users WHERE id = ? AND is_active = 1',
      [req.user.id]
    )

    if (!rows.length) {
      return res.status(404).json({ success: false, message: 'User not found' })
    }

    res.json({ success: true, user: rows[0] })
  } catch (err) {
    console.error('Me error:', err)
    res.status(500).json({ success: false, message: 'Failed to fetch user' })
  }
})

// ─── PUT /api/auth/me ─────────────────────────────────────────────────────────

const VALID_THEMES  = ['light', 'dark', 'system']
const VALID_LOCALES = ['en', 'pl', 'lt', 'ru', 'de']

router.put(
  '/me',
  auth,
  [
    body('name').optional().trim().isLength({ min: 2, max: 100 }),
    body('email').optional().isEmail({ allow_utf8_local_part: false }).toLowerCase(),
    body('theme').optional().isIn(VALID_THEMES).withMessage('Invalid theme'),
    body('locale').optional().isIn(VALID_LOCALES).withMessage('Invalid locale')
  ],
  async (req, res) => {
    if (!handleValidation(req, res)) return

    const { name, email, theme, locale } = req.body
    const updates = []
    const values = []

    if (name)   { updates.push('name = ?');   values.push(name) }
    if (email)  { updates.push('email = ?');  values.push(email) }
    if (theme)  { updates.push('theme = ?');  values.push(theme) }
    if (locale) { updates.push('locale = ?'); values.push(locale) }

    if (!updates.length) {
      return res.status(400).json({ success: false, message: 'Nothing to update' })
    }

    values.push(req.user.id)

    try {
      if (email) {
        const [dup] = await pool.query(
          'SELECT id FROM users WHERE email = ? AND id != ?',
          [email, req.user.id]
        )
        if (dup.length) {
          return res.status(409).json({ success: false, message: 'Email already in use' })
        }
      }

      await pool.query(`UPDATE users SET ${updates.join(', ')} WHERE id = ?`, values)

      const [rows] = await pool.query(
        'SELECT id, name, email, role, theme, locale, created_at FROM users WHERE id = ?',
        [req.user.id]
      )
      res.json({ success: true, user: rows[0] })
    } catch (err) {
      console.error('Update me error:', err)
      res.status(500).json({ success: false, message: 'Update failed' })
    }
  }
)

// ─── POST /api/auth/change-password ───────────────────────────────────────────

router.post(
  '/change-password',
  auth,
  [
    body('currentPassword').notEmpty().withMessage('Current password required'),
    body('newPassword')
      .isLength({ min: 8 })
      .matches(/[A-Z]/)
      .matches(/[0-9]/)
      .withMessage('New password must be 8+ chars with uppercase and number')
  ],
  async (req, res) => {
    if (!handleValidation(req, res)) return

    const { currentPassword, newPassword } = req.body

    try {
      const [rows] = await pool.query('SELECT password_hash FROM users WHERE id = ?', [req.user.id])
      const valid = await bcrypt.compare(currentPassword, rows[0].password_hash)

      if (!valid) {
        return res.status(401).json({ success: false, message: 'Current password incorrect' })
      }

      const hash = await bcrypt.hash(newPassword, 12)
      await pool.query('UPDATE users SET password_hash = ? WHERE id = ?', [hash, req.user.id])

      res.json({ success: true, message: 'Password updated successfully' })
    } catch (err) {
      console.error('Change password error:', err)
      res.status(500).json({ success: false, message: 'Failed to change password' })
    }
  }
)

// ─── POST /api/auth/forgot-password ──────────────────────────────────────────
// Rate-limited to 5 requests per 15 min by the global authLimiter in app.js.
// Always responds with 200 to prevent email enumeration.

router.post(
  '/forgot-password',
  [ body('email').isEmail({ allow_utf8_local_part: false }).toLowerCase().withMessage('Valid email required') ],
  async (req, res) => {
    if (!handleValidation(req, res)) return

    const { email } = req.body

    try {
      // Look up user — silently succeed even if not found (prevents enumeration)
      const [rows] = await pool.query(
        'SELECT id, name, email FROM users WHERE email = ? AND is_active = 1',
        [email]
      )

      if (rows.length) {
        const user = rows[0]

        // Invalidate any previous unused tokens for this user
        await pool.query(
          'DELETE FROM password_reset_tokens WHERE user_id = ? AND used_at IS NULL',
          [user.id]
        )

        // Generate a cryptographically secure 48-byte token
        const rawToken  = crypto.randomBytes(48).toString('hex')
        const tokenHash = crypto.createHash('sha256').update(rawToken).digest('hex')
        const expiresAt = new Date(Date.now() + 60 * 60 * 1000) // 1 hour

        await pool.query(
          'INSERT INTO password_reset_tokens (user_id, token_hash, expires_at) VALUES (?, ?, ?)',
          [user.id, tokenHash, expiresAt]
        )

        const appUrl   = process.env.APP_URL || 'http://localhost:5173'
        const resetUrl = `${appUrl}/reset-password?token=${rawToken}`

        // Fire-and-forget — never leak email errors to the client
        sendPasswordResetEmail({ to: user.email, userName: user.name, resetUrl })
          .catch((err) => console.error('[email] Failed to send reset email:', err))
      }

      // Always return 200 OK
      res.json({ success: true, message: 'If that email is registered, a reset link has been sent.' })
    } catch (err) {
      console.error('Forgot password error:', err.message || err)
      // Surface DB errors clearly in logs (table missing, connection failed, etc.)
      if (err.code === 'ER_NO_SUCH_TABLE') {
        console.error('[forgot-password] The password_reset_tokens table does not exist. Run: mk/server/database/password-reset-migration.sql')
      }
      res.status(500).json({ success: false, message: 'Request failed' })
    }
  }
)

// ─── POST /api/auth/reset-password ───────────────────────────────────────────

router.post(
  '/reset-password',
  [
    body('token').notEmpty().withMessage('Token required'),
    body('password')
      .isLength({ min: 8 })
      .withMessage('Password must be at least 8 characters')
      .matches(/[A-Z]/)
      .withMessage('Password must contain an uppercase letter')
      .matches(/[0-9]/)
      .withMessage('Password must contain a number')
  ],
  async (req, res) => {
    if (!handleValidation(req, res)) return

    const { token, password } = req.body

    try {
      const tokenHash = crypto.createHash('sha256').update(token).digest('hex')

      const [rows] = await pool.query(
        `SELECT prt.id, prt.user_id, prt.expires_at, prt.used_at
         FROM password_reset_tokens prt
         WHERE prt.token_hash = ?`,
        [tokenHash]
      )

      const record = rows[0]

      if (!record) {
        return res.status(400).json({ success: false, message: 'Invalid or expired reset link.' })
      }

      if (record.used_at) {
        return res.status(400).json({ success: false, message: 'This reset link has already been used.' })
      }

      if (new Date() > new Date(record.expires_at)) {
        return res.status(400).json({ success: false, message: 'This reset link has expired. Please request a new one.' })
      }

      // Hash new password and update user
      const passwordHash = await bcrypt.hash(password, 12)
      await pool.query('UPDATE users SET password_hash = ? WHERE id = ?', [passwordHash, record.user_id])

      // Mark token as used
      await pool.query(
        'UPDATE password_reset_tokens SET used_at = NOW() WHERE id = ?',
        [record.id]
      )

      res.json({ success: true, message: 'Password reset successfully. You can now sign in.' })
    } catch (err) {
      console.error('Reset password error:', err)
      res.status(500).json({ success: false, message: 'Password reset failed' })
    }
  }
)

module.exports = router

const router = require('express').Router()
const bcrypt = require('bcryptjs')
const jwt = require('jsonwebtoken')
const { body, validationResult } = require('express-validator')
const { pool } = require('../config/db')
const auth = require('../middleware/auth')

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
    body('email').isEmail().normalizeEmail().withMessage('Valid email required'),
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
    body('email').isEmail().normalizeEmail().withMessage('Valid email required'),
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

      res.json({
        success: true,
        token,
        user: { id: user.id, name: user.name, email: user.email, role: user.role }
      })
    } catch (err) {
      console.error('Login error:', err)
      res.status(500).json({ success: false, message: 'Login failed' })
    }
  }
)

// ─── GET /api/auth/me ─────────────────────────────────────────────────────────

router.get('/me', auth, async (req, res) => {
  try {
    const [rows] = await pool.query(
      'SELECT id, name, email, role, created_at FROM users WHERE id = ? AND is_active = 1',
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

router.put(
  '/me',
  auth,
  [
    body('name').optional().trim().isLength({ min: 2, max: 100 }),
    body('email').optional().isEmail().normalizeEmail()
  ],
  async (req, res) => {
    if (!handleValidation(req, res)) return

    const { name, email } = req.body
    const updates = []
    const values = []

    if (name) { updates.push('name = ?'); values.push(name) }
    if (email) { updates.push('email = ?'); values.push(email) }

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
        'SELECT id, name, email, role FROM users WHERE id = ?',
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

module.exports = router

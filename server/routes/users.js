const router = require('express').Router()
const { param, body, validationResult } = require('express-validator')
const bcrypt = require('bcryptjs')
const { pool } = require('../config/db')
const auth = require('../middleware/auth')
const adminOnly = require('../middleware/adminOnly')

// All user management routes require admin authentication
router.use(auth, adminOnly)

function validate(req, res) {
  const errors = validationResult(req)
  if (!errors.isEmpty()) {
    res.status(422).json({ success: false, errors: errors.array() })
    return false
  }
  return true
}

// ─── GET /api/users/:id ───────────────────────────────────────────────────────

router.get(
  '/:id',
  [param('id').isInt({ min: 1 })],
  async (req, res) => {
    if (!validate(req, res)) return

    try {
      const [rows] = await pool.query(
        'SELECT id, name, email, role, is_active, last_login, created_at FROM users WHERE id = ?',
        [req.params.id]
      )

      if (!rows.length) {
        return res.status(404).json({ success: false, message: 'User not found' })
      }

      res.json({ success: true, data: rows[0] })
    } catch (err) {
      console.error('GET /users/:id error:', err)
      res.status(500).json({ success: false, message: 'Failed to fetch user' })
    }
  }
)

// ─── PUT /api/users/:id ───────────────────────────────────────────────────────
// Update user name, email, role. Admin cannot demote themselves.

router.put(
  '/:id',
  [
    param('id').isInt({ min: 1 }),
    body('name').optional().trim().isLength({ min: 2, max: 100 }),
    body('email').optional().isEmail({ allow_utf8_local_part: false }).toLowerCase(),
    body('role').optional().isIn(['user', 'admin']).withMessage('Role must be user or admin')
  ],
  async (req, res) => {
    if (!validate(req, res)) return

    const targetId = parseInt(req.params.id)

    // Prevent admin from changing their own role
    if (req.body.role && targetId === req.user.id) {
      return res.status(400).json({ success: false, message: 'You cannot change your own role' })
    }

    const allowed = ['name', 'email', 'role']
    const updates = []
    const values = []

    for (const field of allowed) {
      if (req.body[field] !== undefined) {
        updates.push(`${field} = ?`)
        values.push(req.body[field])
      }
    }

    if (!updates.length) {
      return res.status(400).json({ success: false, message: 'Nothing to update' })
    }

    values.push(targetId)

    try {
      const [check] = await pool.query('SELECT id FROM users WHERE id = ?', [targetId])
      if (!check.length) {
        return res.status(404).json({ success: false, message: 'User not found' })
      }

      if (req.body.email) {
        const [dup] = await pool.query('SELECT id FROM users WHERE email = ? AND id != ?', [req.body.email, targetId])
        if (dup.length) {
          return res.status(409).json({ success: false, message: 'Email already in use' })
        }
      }

      await pool.query(`UPDATE users SET ${updates.join(', ')} WHERE id = ?`, values)

      const [rows] = await pool.query(
        'SELECT id, name, email, role, is_active, created_at FROM users WHERE id = ?',
        [targetId]
      )

      res.json({ success: true, data: rows[0], message: 'User updated successfully' })
    } catch (err) {
      console.error('PUT /users/:id error:', err)
      res.status(500).json({ success: false, message: 'Failed to update user' })
    }
  }
)

// ─── PATCH /api/users/:id/toggle-active ──────────────────────────────────────
// Activate or deactivate a user. Admin cannot deactivate themselves.

router.patch(
  '/:id/toggle-active',
  [param('id').isInt({ min: 1 })],
  async (req, res) => {
    if (!validate(req, res)) return

    const targetId = parseInt(req.params.id)

    if (targetId === req.user.id) {
      return res.status(400).json({ success: false, message: 'You cannot deactivate your own account' })
    }

    try {
      const [rows] = await pool.query('SELECT id, is_active, role FROM users WHERE id = ?', [targetId])
      if (!rows.length) {
        return res.status(404).json({ success: false, message: 'User not found' })
      }

      // Prevent deactivating other admins
      if (rows[0].role === 'admin') {
        return res.status(403).json({ success: false, message: 'Cannot deactivate admin accounts' })
      }

      const newStatus = rows[0].is_active ? 0 : 1
      await pool.query('UPDATE users SET is_active = ? WHERE id = ?', [newStatus, targetId])

      res.json({
        success: true,
        message: newStatus ? 'User activated' : 'User deactivated',
        is_active: !!newStatus
      })
    } catch (err) {
      console.error('PATCH /users/:id/toggle-active error:', err)
      res.status(500).json({ success: false, message: 'Failed to update user status' })
    }
  }
)

// ─── POST /api/users/:id/reset-password ──────────────────────────────────────
// Admin-initiated password reset

router.post(
  '/:id/reset-password',
  [
    param('id').isInt({ min: 1 }),
    body('newPassword')
      .isLength({ min: 8 })
      .matches(/[A-Z]/)
      .matches(/[0-9]/)
      .withMessage('Password must be 8+ chars with uppercase and number')
  ],
  async (req, res) => {
    if (!validate(req, res)) return

    try {
      const [check] = await pool.query('SELECT id FROM users WHERE id = ?', [req.params.id])
      if (!check.length) {
        return res.status(404).json({ success: false, message: 'User not found' })
      }

      const hash = await bcrypt.hash(req.body.newPassword, 12)
      await pool.query('UPDATE users SET password_hash = ? WHERE id = ?', [hash, req.params.id])

      res.json({ success: true, message: 'Password reset successfully' })
    } catch (err) {
      console.error('POST /users/:id/reset-password error:', err)
      res.status(500).json({ success: false, message: 'Failed to reset password' })
    }
  }
)

// ─── DELETE /api/users/:id ────────────────────────────────────────────────────
// Admin cannot delete themselves

router.delete(
  '/:id',
  [param('id').isInt({ min: 1 })],
  async (req, res) => {
    if (!validate(req, res)) return

    const targetId = parseInt(req.params.id)

    if (targetId === req.user.id) {
      return res.status(400).json({ success: false, message: 'You cannot delete your own account' })
    }

    try {
      const [rows] = await pool.query('SELECT id, role FROM users WHERE id = ?', [targetId])
      if (!rows.length) {
        return res.status(404).json({ success: false, message: 'User not found' })
      }

      if (rows[0].role === 'admin') {
        return res.status(403).json({ success: false, message: 'Cannot delete admin accounts' })
      }

      await pool.query('DELETE FROM users WHERE id = ?', [targetId])
      res.json({ success: true, message: 'User deleted successfully' })
    } catch (err) {
      console.error('DELETE /users/:id error:', err)
      res.status(500).json({ success: false, message: 'Failed to delete user' })
    }
  }
)

module.exports = router

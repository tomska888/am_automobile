const router = require('express').Router()
const { param, validationResult } = require('express-validator')
const { pool } = require('../config/db')
const auth = require('../middleware/auth')
const adminOnly = require('../middleware/adminOnly')

// All message routes require admin authentication
router.use(auth, adminOnly)

function validate(req, res) {
    const errors = validationResult(req)
    if (!errors.isEmpty()) {
        res.status(422).json({ success: false, errors: errors.array() })
        return false
    }
    return true
}

// ─── GET /api/messages ────────────────────────────────────────────────────────
// Query params: status (unread|read|all), page, limit

router.get('/', async (req, res) => {
    try {
        const { status, page = 1, limit = 20 } = req.query

        const conditions = []
        const params = []

        if (status === 'unread') { conditions.push('m.is_read = 0') }
        else if (status === 'read') { conditions.push('m.is_read = 1') }

        const where = conditions.length ? `WHERE ${conditions.join(' AND ')}` : ''

        const pageNum = Math.max(1, parseInt(page))
        const limitNum = Math.min(100, Math.max(1, parseInt(limit)))
        const offset = (pageNum - 1) * limitNum

        const [[{ total }]] = await pool.query(
            `SELECT COUNT(*) AS total FROM messages m ${where}`,
            params
        )

        const [messages] = await pool.query(
            `SELECT
        m.id, m.name, m.email, m.phone, m.subject,
        m.message, m.car_id, m.is_read, m.created_at,
        c.make, c.model, c.year
       FROM messages m
       LEFT JOIN cars c ON m.car_id = c.id
       ${where}
       ORDER BY m.created_at DESC
       LIMIT ? OFFSET ?`,
            [...params, limitNum, offset]
        )

        res.json({
            success: true,
            data: messages,
            pagination: {
                total,
                page: pageNum,
                limit: limitNum,
                totalPages: Math.ceil(total / limitNum)
            }
        })
    } catch (err) {
        console.error('GET /messages error:', err)
        res.status(500).json({ success: false, message: 'Failed to fetch messages' })
    }
})

// ─── GET /api/messages/:id ────────────────────────────────────────────────────

router.get(
    '/:id',
    [param('id').isInt({ min: 1 })],
    async (req, res) => {
        if (!validate(req, res)) return

        try {
            const [rows] = await pool.query(
                `SELECT m.*, c.make, c.model, c.year
         FROM messages m
         LEFT JOIN cars c ON m.car_id = c.id
         WHERE m.id = ?`,
                [req.params.id]
            )

            if (!rows.length) {
                return res.status(404).json({ success: false, message: 'Message not found' })
            }

            res.json({ success: true, data: rows[0] })
        } catch (err) {
            console.error('GET /messages/:id error:', err)
            res.status(500).json({ success: false, message: 'Failed to fetch message' })
        }
    }
)

// ─── PATCH /api/messages/:id/read ─────────────────────────────────────────────

router.patch(
    '/:id/read',
    [param('id').isInt({ min: 1 })],
    async (req, res) => {
        if (!validate(req, res)) return

        try {
            const [check] = await pool.query('SELECT id FROM messages WHERE id = ?', [req.params.id])
            if (!check.length) {
                return res.status(404).json({ success: false, message: 'Message not found' })
            }

            await pool.query('UPDATE messages SET is_read = 1 WHERE id = ?', [req.params.id])
            res.json({ success: true, message: 'Message marked as read' })
        } catch (err) {
            console.error('PATCH /messages/:id/read error:', err)
            res.status(500).json({ success: false, message: 'Failed to update message' })
        }
    }
)

// ─── PATCH /api/messages/:id/unread ───────────────────────────────────────────

router.patch(
    '/:id/unread',
    [param('id').isInt({ min: 1 })],
    async (req, res) => {
        if (!validate(req, res)) return

        try {
            await pool.query('UPDATE messages SET is_read = 0 WHERE id = ?', [req.params.id])
            res.json({ success: true, message: 'Message marked as unread' })
        } catch (err) {
            res.status(500).json({ success: false, message: 'Failed to update message' })
        }
    }
)

// ─── DELETE /api/messages/:id ─────────────────────────────────────────────────

router.delete(
    '/:id',
    [param('id').isInt({ min: 1 })],
    async (req, res) => {
        if (!validate(req, res)) return

        try {
            const [check] = await pool.query('SELECT id FROM messages WHERE id = ?', [req.params.id])
            if (!check.length) {
                return res.status(404).json({ success: false, message: 'Message not found' })
            }

            await pool.query('DELETE FROM messages WHERE id = ?', [req.params.id])
            res.json({ success: true, message: 'Message deleted' })
        } catch (err) {
            console.error('DELETE /messages/:id error:', err)
            res.status(500).json({ success: false, message: 'Failed to delete message' })
        }
    }
)

module.exports = router

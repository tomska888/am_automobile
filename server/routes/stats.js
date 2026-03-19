const router = require('express').Router()
const { pool } = require('../config/db')
const auth = require('../middleware/auth')
const adminOnly = require('../middleware/adminOnly')

// All stats routes require admin authentication
router.use(auth, adminOnly)

// ─── GET /api/stats ───────────────────────────────────────────────────────────
// Dashboard summary: car counts, message counts, user counts, recent activity

router.get('/', async (_req, res) => {
    try {
        // Run all count queries in parallel for performance
        const [
            [[carStats]],
            [[messageStats]],
            [[userStats]],
            recentCars,
            recentMessages
        ] = await Promise.all([
            pool.query(`
        SELECT
          COUNT(*) AS total,
          SUM(CASE WHEN status = 'available' THEN 1 ELSE 0 END) AS available,
          SUM(CASE WHEN status = 'reserved' THEN 1 ELSE 0 END) AS reserved,
          SUM(CASE WHEN status = 'sold' THEN 1 ELSE 0 END) AS sold,
          SUM(CASE WHEN featured = 1 THEN 1 ELSE 0 END) AS featured
        FROM cars
      `),

            pool.query(`
        SELECT
          COUNT(*) AS total,
          SUM(CASE WHEN is_read = 0 THEN 1 ELSE 0 END) AS unread,
          SUM(CASE WHEN is_read = 1 THEN 1 ELSE 0 END) AS read_count
        FROM messages
      `),

            pool.query(`
        SELECT
          COUNT(*) AS total,
          SUM(CASE WHEN role = 'admin' THEN 1 ELSE 0 END) AS admins,
          SUM(CASE WHEN is_active = 1 THEN 1 ELSE 0 END) AS active
        FROM users
      `),

            pool.query(`
        SELECT id, make, model, year, price, status, image_url, created_at
        FROM cars
        ORDER BY created_at DESC
        LIMIT 5
      `),

            pool.query(`
        SELECT id, name, email, subject, is_read, created_at
        FROM messages
        ORDER BY created_at DESC
        LIMIT 5
      `)
        ])

        res.json({
            success: true,
            data: {
                cars: carStats,
                messages: messageStats,
                users: userStats,
                recentCars: recentCars[0],
                recentMessages: recentMessages[0]
            }
        })
    } catch (err) {
        console.error('GET /stats error:', err)
        res.status(500).json({ success: false, message: 'Failed to fetch stats' })
    }
})

// ─── GET /api/stats/monthly ───────────────────────────────────────────────────
// Monthly breakdown of cars added + sold for charts (last 12 months)

router.get('/monthly', async (_req, res) => {
    try {
        const [rows] = await pool.query(`
      SELECT
        DATE_FORMAT(created_at, '%Y-%m') AS month,
        COUNT(*) AS added,
        SUM(CASE WHEN status = 'sold' THEN 1 ELSE 0 END) AS sold
      FROM cars
      WHERE created_at >= DATE_SUB(NOW(), INTERVAL 12 MONTH)
      GROUP BY month
      ORDER BY month ASC
    `)

        res.json({ success: true, data: rows })
    } catch (err) {
        console.error('GET /stats/monthly error:', err)
        res.status(500).json({ success: false, message: 'Failed to fetch monthly stats' })
    }
})

// ─── GET /api/stats/popular-makes ────────────────────────────────────────────
// Top makes by inventory count

router.get('/popular-makes', async (_req, res) => {
    try {
        const [rows] = await pool.query(`
      SELECT make, COUNT(*) AS count
      FROM cars
      GROUP BY make
      ORDER BY count DESC
      LIMIT 10
    `)

        res.json({ success: true, data: rows })
    } catch (err) {
        res.status(500).json({ success: false, message: 'Failed to fetch popular makes' })
    }
})

module.exports = router

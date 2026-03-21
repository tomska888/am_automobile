const router = require('express').Router()
const { param, validationResult } = require('express-validator')
const { pool } = require('../config/db')
const auth = require('../middleware/auth')

// All favorites routes require authentication
router.use(auth)

function validate(req, res) {
  const errors = validationResult(req)
  if (!errors.isEmpty()) {
    res.status(422).json({ success: false, errors: errors.array() })
    return false
  }
  return true
}

function parseJson(value, fallback) {
  try { return JSON.parse(value) } catch { return fallback }
}

// ─── GET /api/favorites ───────────────────────────────────────────────────────
// Returns all favorited cars for the authenticated user

router.get('/', async (req, res) => {
  try {
    const [rows] = await pool.query(
      `SELECT
         c.id, c.make, c.model, c.year, c.price, c.mileage,
         c.fuel_type, c.transmission, c.body_type, c.engine_size,
         c.power_hp, c.color, c.status, c.featured,
         c.image_url, c.gallery, c.description, c.features,
         c.vin, c.created_at, c.updated_at,
         uf.created_at AS favorited_at
       FROM user_favorites uf
       JOIN cars c ON c.id = uf.car_id
       WHERE uf.user_id = ?
       ORDER BY uf.created_at DESC`,
      [req.user.id]
    )

    const parsed = rows.map((car) => ({
      ...car,
      gallery:  parseJson(car.gallery, []),
      features: parseJson(car.features, [])
    }))

    res.json({ success: true, data: parsed })
  } catch (err) {
    console.error('GET /favorites error:', err)
    res.status(500).json({ success: false, message: 'Failed to fetch favorites' })
  }
})

// ─── GET /api/favorites/ids ───────────────────────────────────────────────────
// Returns just the car IDs the user has favorited (lightweight)

router.get('/ids', async (req, res) => {
  try {
    const [rows] = await pool.query(
      'SELECT car_id FROM user_favorites WHERE user_id = ?',
      [req.user.id]
    )
    res.json({ success: true, data: rows.map((r) => r.car_id) })
  } catch (err) {
    console.error('GET /favorites/ids error:', err)
    res.status(500).json({ success: false, message: 'Failed to fetch favorite IDs' })
  }
})

// ─── POST /api/favorites/:carId ───────────────────────────────────────────────
// Add a car to favorites

router.post(
  '/:carId',
  [param('carId').isInt({ min: 1 })],
  async (req, res) => {
    if (!validate(req, res)) return

    const carId = parseInt(req.params.carId)

    try {
      // Check car exists
      const [carRows] = await pool.query('SELECT id FROM cars WHERE id = ?', [carId])
      if (!carRows.length) {
        return res.status(404).json({ success: false, message: 'Car not found' })
      }

      // Insert or ignore duplicate
      await pool.query(
        'INSERT IGNORE INTO user_favorites (user_id, car_id) VALUES (?, ?)',
        [req.user.id, carId]
      )

      res.json({ success: true, message: 'Added to favorites', carId })
    } catch (err) {
      console.error('POST /favorites/:carId error:', err)
      res.status(500).json({ success: false, message: 'Failed to add favorite' })
    }
  }
)

// ─── DELETE /api/favorites/:carId ─────────────────────────────────────────────
// Remove a car from favorites

router.delete(
  '/:carId',
  [param('carId').isInt({ min: 1 })],
  async (req, res) => {
    if (!validate(req, res)) return

    const carId = parseInt(req.params.carId)

    try {
      await pool.query(
        'DELETE FROM user_favorites WHERE user_id = ? AND car_id = ?',
        [req.user.id, carId]
      )

      res.json({ success: true, message: 'Removed from favorites', carId })
    } catch (err) {
      console.error('DELETE /favorites/:carId error:', err)
      res.status(500).json({ success: false, message: 'Failed to remove favorite' })
    }
  }
)

module.exports = router

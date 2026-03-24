const router = require('express').Router()
const { body, query, param, validationResult } = require('express-validator')
const { pool } = require('../config/db')
const auth = require('../middleware/auth')
const adminOnly = require('../middleware/adminOnly')

// ─── Helpers ──────────────────────────────────────────────────────────────────

function validate(req, res) {
  const errors = validationResult(req)
  if (!errors.isEmpty()) {
    res.status(422).json({ success: false, errors: errors.array() })
    return false
  }
  return true
}

function parseJson(value, fallback) {
  // mysql2 automatically parses JSON columns into JS objects/arrays.
  // If the value is already an array/object, return it directly.
  if (Array.isArray(value) || (value !== null && typeof value === 'object')) return value
  if (value === null || value === undefined) return fallback
  try { return JSON.parse(value) } catch { return fallback }
}

// ─── GET /api/cars ────────────────────────────────────────────────────────────
// Public. Supports: search, make, model, fuel_type, body_type, transmission,
//   year_min, year_max, price_min, price_max, mileage_max, status,
//   sort, order, page, limit

router.get('/', async (req, res) => {
  try {
    const {
      search,
      make,
      model,
      fuel_type,
      body_type,
      transmission,
      year_min,
      year_max,
      price_min,
      price_max,
      mileage_max,
      status = 'available',
      featured,
      sort = 'created_at',
      order = 'DESC',
      page = 1,
      limit = 12
    } = req.query

    const conditions = []
    const params = []

    // Status filter (public API only shows available by default)
    if (status === 'all') {
      // no filter — admin use only, but still allowed publicly
    } else {
      conditions.push('c.status = ?')
      params.push(status)
    }

    if (featured === 'true') {
      conditions.push('c.featured = 1')
    }

    if (search) {
      conditions.push('(c.make LIKE ? OR c.model LIKE ? OR c.description LIKE ?)')
      const s = `%${search}%`
      params.push(s, s, s)
    }

    if (make) { conditions.push('c.make = ?'); params.push(make) }
    if (model) { conditions.push('c.model = ?'); params.push(model) }
    if (fuel_type) { conditions.push('c.fuel_type = ?'); params.push(fuel_type) }
    if (body_type) { conditions.push('c.body_type = ?'); params.push(body_type) }
    if (transmission) { conditions.push('c.transmission = ?'); params.push(transmission) }

    if (year_min) { conditions.push('c.year >= ?'); params.push(parseInt(year_min)) }
    if (year_max) { conditions.push('c.year <= ?'); params.push(parseInt(year_max)) }
    if (price_min) { conditions.push('c.price >= ?'); params.push(parseFloat(price_min)) }
    if (price_max) { conditions.push('c.price <= ?'); params.push(parseFloat(price_max)) }
    if (mileage_max) { conditions.push('c.mileage <= ?'); params.push(parseInt(mileage_max)) }

    const where = conditions.length ? `WHERE ${conditions.join(' AND ')}` : ''

    // Whitelist sort columns to prevent SQL injection
    const allowedSorts = ['created_at', 'price', 'year', 'mileage', 'make', 'model']
    const safeSort = allowedSorts.includes(sort) ? sort : 'created_at'
    const safeOrder = order.toUpperCase() === 'ASC' ? 'ASC' : 'DESC'

    const pageNum = Math.max(1, parseInt(page))
    // Allow admin to request more (up to 500); public capped at 50
    const maxLimit = (status === 'all') ? 500 : 50
    const limitNum = Math.min(maxLimit, Math.max(1, parseInt(limit)))
    const offset = (pageNum - 1) * limitNum

    // Count query
    const [[{ total }]] = await pool.query(
      `SELECT COUNT(*) AS total FROM cars c ${where}`,
      params
    )

    // Data query
    const [cars] = await pool.query(
      `SELECT
        c.id, c.make, c.model, c.year, c.price, c.mileage,
        c.fuel_type, c.transmission, c.body_type, c.engine_size,
        c.power_hp, c.color, c.owners, c.status, c.featured,
        c.image_url, c.gallery, c.description, c.features,
        c.vin, c.created_at, c.updated_at
       FROM cars c
       ${where}
       ORDER BY c.${safeSort} ${safeOrder}
       LIMIT ? OFFSET ?`,
      [...params, limitNum, offset]
    )

    // Parse JSON fields stored as TEXT
    const parsed = cars.map((car) => ({
      ...car,
      gallery: parseJson(car.gallery, []),
      features: parseJson(car.features, [])
    }))

    res.json({
      success: true,
      data: parsed,
      pagination: {
        total,
        page: pageNum,
        limit: limitNum,
        totalPages: Math.ceil(total / limitNum)
      }
    })
  } catch (err) {
    console.error('GET /cars error:', err)
    res.status(500).json({ success: false, message: 'Failed to fetch cars' })
  }
})

// ─── GET /api/cars/makes ──────────────────────────────────────────────────────
// Returns distinct makes for filter dropdowns

router.get('/makes', async (_req, res) => {
  try {
    const [rows] = await pool.query(
      "SELECT DISTINCT make FROM cars WHERE status != 'archived' ORDER BY make ASC"
    )
    res.json({ success: true, data: rows.map((r) => r.make) })
  } catch (err) {
    res.status(500).json({ success: false, message: 'Failed to fetch makes' })
  }
})

// ─── GET /api/cars/:id ────────────────────────────────────────────────────────

router.get(
  '/:id',
  [param('id').isInt({ min: 1 })],
  async (req, res) => {
    if (!validate(req, res)) return

    try {
      const [rows] = await pool.query(
        `SELECT
          c.id, c.make, c.model, c.year, c.price, c.mileage,
          c.fuel_type, c.transmission, c.body_type, c.engine_size,
          c.power_hp, c.color, c.owners, c.status, c.featured,
          c.image_url, c.gallery, c.description, c.features,
          c.vin, c.created_at, c.updated_at
         FROM cars c WHERE c.id = ?`,
        [req.params.id]
      )

      if (!rows.length) {
        return res.status(404).json({ success: false, message: 'Car not found' })
      }

      const car = {
        ...rows[0],
        gallery: parseJson(rows[0].gallery, []),
        features: parseJson(rows[0].features, [])
      }

      res.json({ success: true, data: car })
    } catch (err) {
      console.error('GET /cars/:id error:', err)
      res.status(500).json({ success: false, message: 'Failed to fetch car' })
    }
  }
)

// ─── POST /api/cars ───────────────────────────────────────────────────────────
// Admin only

router.post(
  '/',
  auth,
  adminOnly,
  [
    body('make').trim().notEmpty().withMessage('Make is required'),
    body('model').trim().notEmpty().withMessage('Model is required'),
    body('year').isInt({ min: 1990, max: new Date().getFullYear() + 1 }).withMessage('Invalid year'),
    body('price').isFloat({ min: 0 }).withMessage('Price must be a positive number'),
    body('fuel_type').notEmpty().withMessage('Fuel type is required')
  ],
  async (req, res) => {
    if (!validate(req, res)) return

    const {
      make, model, year, price, mileage, fuel_type, transmission,
      body_type, engine_size, power_hp, color, vin, owners, status = 'available',
      featured = false, image_url, gallery = [], features = [], description
    } = req.body

    // Helper: coerce empty string / falsy to null for optional fields
    const num = (v) => (v === '' || v === null || v === undefined) ? null : Number(v)
    const str = (v) => (v === '' || v === null || v === undefined) ? null : String(v).trim()

    try {
      const [result] = await pool.query(
        `INSERT INTO cars
          (make, model, year, price, mileage, fuel_type, transmission,
           body_type, engine_size, power_hp, color, vin, owners, status, featured,
           image_url, gallery, features, description)
         VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?)`,
        [
          make.trim(), model.trim(), Number(year), Number(price),
          num(mileage), fuel_type,
          str(transmission), str(body_type), num(engine_size),
          num(power_hp), str(color), str(vin), num(owners), status,
          featured ? 1 : 0, str(image_url),
          JSON.stringify(Array.isArray(gallery) ? gallery : []),
          JSON.stringify(Array.isArray(features) ? features : []),
          str(description)
        ]
      )

      const [rows] = await pool.query('SELECT * FROM cars WHERE id = ?', [result.insertId])
      const car = { ...rows[0], gallery: parseJson(rows[0].gallery, []), features: parseJson(rows[0].features, []) }

      res.status(201).json({ success: true, data: car, message: 'Car created successfully' })
    } catch (err) {
      console.error('POST /cars error:', err)
      res.status(500).json({ success: false, message: 'Failed to create car' })
    }
  }
)

// ─── PUT /api/cars/:id ────────────────────────────────────────────────────────
// Admin only

router.put(
  '/:id',
  auth,
  adminOnly,
  [
    param('id').isInt({ min: 1 }),
    body('make').optional().trim().notEmpty(),
    body('year').optional().isInt({ min: 1990 }),
    body('price').optional().isFloat({ min: 0 })
  ],
  async (req, res) => {
    if (!validate(req, res)) return

    // Fields that must be stored as NULL when empty (not as empty string '')
    const nullableNumbers = new Set(['mileage', 'engine_size', 'power_hp', 'owners'])
    const nullableStrings = new Set(['transmission', 'body_type', 'color', 'vin', 'image_url', 'description'])

    const allowed = [
      'make', 'model', 'year', 'price', 'mileage', 'fuel_type', 'transmission',
      'body_type', 'engine_size', 'power_hp', 'color', 'vin', 'owners', 'status',
      'featured', 'image_url', 'description'
    ]

    const updates = []
    const values = []

    for (const field of allowed) {
      if (req.body[field] !== undefined) {
        updates.push(`${field} = ?`)
        let val = req.body[field]
        if (field === 'featured') {
          val = val ? 1 : 0
        } else if (nullableNumbers.has(field)) {
          // Convert empty string / NaN to NULL for numeric columns
          val = (val === '' || val === null || (typeof val === 'number' && isNaN(val))) ? null : Number(val)
        } else if (nullableStrings.has(field)) {
          // Convert empty string to NULL for optional string columns
          val = (val === '' || val === null) ? null : String(val).trim()
        }
        values.push(val)
      }
    }

    // Handle JSON fields separately
    if (req.body.gallery !== undefined) {
      updates.push('gallery = ?')
      values.push(JSON.stringify(Array.isArray(req.body.gallery) ? req.body.gallery : []))
    }
    if (req.body.features !== undefined) {
      updates.push('features = ?')
      values.push(JSON.stringify(Array.isArray(req.body.features) ? req.body.features : []))
    }

    if (!updates.length) {
      return res.status(400).json({ success: false, message: 'Nothing to update' })
    }

    values.push(req.params.id)

    try {
      const [check] = await pool.query('SELECT id FROM cars WHERE id = ?', [req.params.id])
      if (!check.length) {
        return res.status(404).json({ success: false, message: 'Car not found' })
      }

      await pool.query(`UPDATE cars SET ${updates.join(', ')}, updated_at = NOW() WHERE id = ?`, values)

      const [rows] = await pool.query('SELECT * FROM cars WHERE id = ?', [req.params.id])
      const car = { ...rows[0], gallery: parseJson(rows[0].gallery, []), features: parseJson(rows[0].features, []) }

      res.json({ success: true, data: car, message: 'Car updated successfully' })
    } catch (err) {
      console.error('PUT /cars/:id error:', err)
      res.status(500).json({ success: false, message: 'Failed to update car' })
    }
  }
)

// ─── DELETE /api/cars/:id ─────────────────────────────────────────────────────
// Admin only

router.delete(
  '/:id',
  auth,
  adminOnly,
  [param('id').isInt({ min: 1 })],
  async (req, res) => {
    if (!validate(req, res)) return

    try {
      const [check] = await pool.query('SELECT id FROM cars WHERE id = ?', [req.params.id])
      if (!check.length) {
        return res.status(404).json({ success: false, message: 'Car not found' })
      }

      await pool.query('DELETE FROM cars WHERE id = ?', [req.params.id])
      res.json({ success: true, message: 'Car deleted successfully' })
    } catch (err) {
      console.error('DELETE /cars/:id error:', err)
      res.status(500).json({ success: false, message: 'Failed to delete car' })
    }
  }
)

module.exports = router

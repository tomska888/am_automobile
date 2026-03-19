const express = require('express')
const cors = require('cors')
const helmet = require('helmet')
const morgan = require('morgan')
const path = require('path')
const rateLimit = require('express-rate-limit')

const app = express()

// ─── Trust Proxy (required for Hostinger/reverse-proxy environments) ──────────
app.set('trust proxy', 1)

// ─── Security ────────────────────────────────────────────────────────────────
app.use(
    helmet({
        // Allow inline scripts from our Vue SPA in production
        contentSecurityPolicy: false
    })
)

// ─── CORS ─────────────────────────────────────────────────────────────────────
const allowedOrigins = (process.env.CORS_ORIGIN || 'http://localhost:5173').split(',')

app.use(
    cors({
        origin: (origin, callback) => {
            // Allow requests with no origin (mobile apps, curl, same-origin in prod)
            if (!origin || allowedOrigins.includes(origin)) {
                callback(null, true)
            } else {
                callback(new Error(`CORS blocked for origin: ${origin}`))
            }
        },
        credentials: true,
        methods: ['GET', 'POST', 'PUT', 'PATCH', 'DELETE', 'OPTIONS'],
        allowedHeaders: ['Content-Type', 'Authorization']
    })
)

// ─── Body Parsing ─────────────────────────────────────────────────────────────
app.use(express.json({ limit: '5mb' }))
app.use(express.urlencoded({ extended: true, limit: '5mb' }))

// ─── Logging ──────────────────────────────────────────────────────────────────
if (process.env.NODE_ENV !== 'test') {
    app.use(morgan(process.env.NODE_ENV === 'production' ? 'combined' : 'dev'))
}

// ─── Global Rate Limiting ─────────────────────────────────────────────────────
const globalLimiter = rateLimit({
    windowMs: 15 * 60 * 1000, // 15 minutes
    max: 200,
    standardHeaders: true,
    legacyHeaders: false,
    message: { success: false, message: 'Too many requests, please try again later.' }
})
app.use('/api/', globalLimiter)

// ─── Strict Rate Limiting for Auth Endpoints ──────────────────────────────────
const authLimiter = rateLimit({
    windowMs: 15 * 60 * 1000,
    max: 20,
    standardHeaders: true,
    legacyHeaders: false,
    message: { success: false, message: 'Too many auth attempts, please try again in 15 minutes.' }
})

// ─── API Routes ───────────────────────────────────────────────────────────────
app.use('/api/auth', authLimiter, require('../routes/auth'))
app.use('/api/cars', require('../routes/cars'))
app.use('/api/contact', require('../routes/contact'))
app.use('/api/messages', require('../routes/messages'))
app.use('/api/stats', require('../routes/stats'))
app.use('/api/users', require('../routes/users'))

// ─── Health Check ─────────────────────────────────────────────────────────────
app.get('/api/health', (_req, res) => {
    res.json({
        success: true,
        message: 'AM Automobile API is running',
        timestamp: new Date().toISOString(),
        env: process.env.NODE_ENV || 'development'
    })
})

// ─── Static Files (Production) ────────────────────────────────────────────────
if (process.env.NODE_ENV === 'production') {
    const publicDir = path.join(__dirname, '..', 'public')
    app.use(express.static(publicDir))

    // SPA fallback — serve index.html for all non-API routes
    app.get('*', (req, res) => {
        if (!req.path.startsWith('/api')) {
            res.sendFile(path.join(publicDir, 'index.html'))
        }
    })
}

// ─── 404 for Unknown API Routes ───────────────────────────────────────────────
app.use('/api/*', (_req, res) => {
    res.status(404).json({ success: false, message: 'API endpoint not found' })
})

// ─── Global Error Handler ─────────────────────────────────────────────────────
// eslint-disable-next-line no-unused-vars
app.use((err, _req, res, _next) => {
    console.error('Unhandled error:', err)

    // CORS error
    if (err.message?.includes('CORS blocked')) {
        return res.status(403).json({ success: false, message: err.message })
    }

    // Validation errors from express-validator
    if (err.type === 'validation') {
        return res.status(422).json({ success: false, message: err.message, errors: err.errors })
    }

    const status = err.status || err.statusCode || 500
    const message =
        process.env.NODE_ENV === 'production' ? 'Internal server error' : err.message

    res.status(status).json({ success: false, message })
})

module.exports = app

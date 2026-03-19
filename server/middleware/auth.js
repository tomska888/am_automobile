const jwt = require('jsonwebtoken')

/**
 * Verifies JWT from Authorization: Bearer <token> header.
 * Attaches decoded payload to req.user on success.
 */
function auth(req, res, next) {
    const authHeader = req.headers['authorization']

    if (!authHeader || !authHeader.startsWith('Bearer ')) {
        return res.status(401).json({ success: false, message: 'No token provided' })
    }

    const token = authHeader.slice(7) // strip "Bearer "

    try {
        const decoded = jwt.verify(token, process.env.JWT_SECRET)
        req.user = decoded
        next()
    } catch (err) {
        if (err.name === 'TokenExpiredError') {
            return res.status(401).json({ success: false, message: 'Token expired' })
        }
        return res.status(401).json({ success: false, message: 'Invalid token' })
    }
}

module.exports = auth

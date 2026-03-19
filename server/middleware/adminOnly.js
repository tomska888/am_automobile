/**
 * Must be used AFTER the auth middleware.
 * Rejects requests from non-admin users with 403 Forbidden.
 */
function adminOnly(req, res, next) {
    if (!req.user) {
        return res.status(401).json({ success: false, message: 'Unauthenticated' })
    }

    if (req.user.role !== 'admin') {
        return res.status(403).json({ success: false, message: 'Admin access required' })
    }

    next()
}

module.exports = adminOnly

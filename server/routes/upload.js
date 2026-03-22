const router = require('express').Router()
const multer = require('multer')
const { v2: cloudinary } = require('cloudinary')
const auth = require('../middleware/auth')
const adminOnly = require('../middleware/adminOnly')

// ─── Cloudinary Configuration ────────────────────────────────────────────────
cloudinary.config({
    cloud_name: process.env.CLOUDINARY_CLOUD_NAME,
    api_key:    process.env.CLOUDINARY_API_KEY,
    api_secret: process.env.CLOUDINARY_API_SECRET,
    secure:     true
})

// ─── Multer: memory storage (files go directly to Cloudinary, not disk) ──────
const storage = multer.memoryStorage()

const upload = multer({
    storage,
    limits: {
        fileSize: 15 * 1024 * 1024, // 15 MB per file
        files: 20                    // max 20 files per request
    },
    fileFilter(_req, file, cb) {
        if (file.mimetype.startsWith('image/')) {
            cb(null, true)
        } else {
            cb(new Error('Only image files are allowed'), false)
        }
    }
})

// ─── Helper: upload a single buffer to Cloudinary ────────────────────────────
function uploadToCloudinary(buffer, originalname) {
    return new Promise((resolve, reject) => {
        const publicId = `cars/${Date.now()}-${Math.random().toString(36).slice(2, 8)}`

        const stream = cloudinary.uploader.upload_stream(
            {
                public_id:      publicId,
                folder:         'am-automobile',
                resource_type:  'image',
                // Auto-quality and format (converts to WebP/AVIF automatically)
                quality:        'auto:good',
                fetch_format:   'auto',
                // Resize: fit within 1280×720, never upscale
                transformation: [
                    {
                        width:   1280,
                        height:  720,
                        crop:    'limit',
                        quality: 'auto:good',
                        fetch_format: 'auto'
                    }
                ]
            },
            (error, result) => {
                if (error) return reject(error)
                resolve(result)
            }
        )

        stream.end(buffer)
    })
}

// ─── POST /api/upload ─────────────────────────────────────────────────────────
// Admin only. Accepts up to 20 image files under field name "images".
// Returns array of { url, publicId, width, height, bytes } objects.

router.post(
    '/',
    auth,
    adminOnly,
    upload.array('images', 20),
    async (req, res) => {
        try {
            if (!req.files || req.files.length === 0) {
                return res.status(400).json({ success: false, message: 'No files uploaded' })
            }

            const results = await Promise.all(
                req.files.map(file => uploadToCloudinary(file.buffer, file.originalname))
            )

            const uploaded = results.map(r => ({
                url:      r.secure_url,
                publicId: r.public_id,
                width:    r.width,
                height:   r.height,
                bytes:    r.bytes
            }))

            res.json({ success: true, data: uploaded })
        } catch (err) {
            console.error('POST /upload error:', err)
            res.status(500).json({ success: false, message: err.message || 'Upload failed' })
        }
    }
)

// ─── DELETE /api/upload ───────────────────────────────────────────────────────
// Admin only. Deletes an image from Cloudinary by publicId.
// Body: { publicId: "am-automobile/cars/..." }

router.delete(
    '/',
    auth,
    adminOnly,
    async (req, res) => {
        const { publicId } = req.body
        if (!publicId) {
            return res.status(400).json({ success: false, message: 'publicId is required' })
        }

        try {
            await cloudinary.uploader.destroy(publicId)
            res.json({ success: true, message: 'Image deleted' })
        } catch (err) {
            console.error('DELETE /upload error:', err)
            res.status(500).json({ success: false, message: 'Failed to delete image' })
        }
    }
)

// ─── Multer error handler ─────────────────────────────────────────────────────
router.use((err, _req, res, _next) => {
    if (err instanceof multer.MulterError) {
        if (err.code === 'LIMIT_FILE_SIZE') {
            return res.status(400).json({ success: false, message: 'File too large. Maximum size is 15 MB.' })
        }
        if (err.code === 'LIMIT_FILE_COUNT') {
            return res.status(400).json({ success: false, message: 'Too many files. Maximum is 20 images.' })
        }
    }
    res.status(400).json({ success: false, message: err.message || 'Upload error' })
})

module.exports = router

import express from 'express'
import multer from 'multer'
import path from 'path'
import fs from 'fs'
import { protect, adminOnly } from '../middleware/auth.middleware.js'

const router = express.Router()

const UPLOADS_DIR = path.resolve('uploads')
if (!fs.existsSync(UPLOADS_DIR)) fs.mkdirSync(UPLOADS_DIR, { recursive: true })

const storage = multer.diskStorage({
  destination: (_req, _file, cb) => cb(null, UPLOADS_DIR),
  filename: (_req, file, cb) => {
    const ext = path.extname(file.originalname)
    cb(null, `${Date.now()}-${Math.random().toString(36).slice(2)}${ext}`)
  },
})

const upload = multer({
  storage,
  limits: { fileSize: 5 * 1024 * 1024 },
  fileFilter: (_req, file, cb) => {
    if (file.mimetype.startsWith('image/')) cb(null, true)
    else cb(new Error('Only image files are allowed'))
  },
})

// POST /api/upload  — admin only, returns { url } pointing to the saved file
router.post('/', protect, adminOnly, upload.single('image'), (req, res) => {
  if (!req.file) return res.status(400).json({ message: 'No file uploaded' })
  const url = `${req.protocol}://${req.get('host')}/uploads/${req.file.filename}`
  res.json({ url })
})

// Handle multer errors (file type rejection, size limit exceeded)
router.use((err, _req, res, _next) => {
  if (err && err.code === 'LIMIT_FILE_SIZE')
    return res.status(400).json({ message: 'File too large. Maximum size is 5 MB.' })
  if (err && err.message === 'Only image files are allowed')
    return res.status(400).json({ message: err.message })
  res.status(500).json({ message: err?.message || 'Upload failed' })
})

export default router

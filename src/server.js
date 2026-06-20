import express from 'express'
import cors from 'cors'
import dotenv from 'dotenv'
import path from 'path'
import { connectDB } from './config/db.js'
import authRoutes from './routes/auth.routes.js'
import listingRoutes from './routes/listing.routes.js'
import bookingRoutes from './routes/booking.routes.js'
import attractionRoutes from './routes/attraction.routes.js'
import userRoutes from './routes/user.routes.js'
import uploadRoutes from './routes/upload.routes.js'
import favouritesRoutes from './routes/favourites.routes.js'
import reviewRoutes from './routes/review.routes.js'

dotenv.config()

const app  = express()
const PORT = process.env.PORT || 5000

// Middleware
const allowedOrigins = [
  process.env.CLIENT_URL || 'http://localhost:5173',
  process.env.ADMIN_URL  || 'http://localhost:5174',
].filter(Boolean)

app.use(cors({
  origin: allowedOrigins,
  credentials: true,
}))
app.use(express.json())

// Request logger in dev
app.use((req, _res, next) => {
  console.log(`${req.method} ${req.path}`)
  next()
})

// Serve uploaded images
app.use('/uploads', express.static(path.resolve('uploads')))

// Routes
app.use('/api/auth',        authRoutes)
app.use('/api/listings',    listingRoutes)
app.use('/api/bookings',    bookingRoutes)
app.use('/api/attractions', attractionRoutes)
app.use('/api/users',       userRoutes)
app.use('/api/upload',      uploadRoutes)
app.use('/api/favourites',  favouritesRoutes)
app.use('/api/listings/:listingId/reviews', reviewRoutes)

// Health check
app.get('/api/health', (_req, res) => res.json({ status: 'ok', time: new Date().toISOString() }))

// 404
app.use((_req, res) => res.status(404).json({ message: 'Route not found' }))

// Global error handler
app.use((err, _req, res, _next) => {
  console.error(err.stack)
  res.status(err.status || 500).json({ message: err.message || 'Internal server error' })
})

connectDB().then(() => {
  app.listen(PORT, () => console.log(`🚀 Lanka Explorer API running on http://localhost:${PORT}`))
})

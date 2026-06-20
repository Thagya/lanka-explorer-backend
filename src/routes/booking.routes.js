import { Router } from 'express'
import {
  getMyBookings, getAllBookings, getBooking,
  createBooking, transitionBooking, deleteBooking,
} from '../controllers/booking.controller.js'
import { protect, adminOnly } from '../middleware/auth.middleware.js'

const router = Router()

router.get('/my',       protect, getMyBookings)
router.get('/',         protect, adminOnly, getAllBookings)
router.get('/:id',      protect, getBooking)
router.post('/',        protect, createBooking)
router.patch('/:id',    protect, transitionBooking)  // { action, ...payload }
router.delete('/:id',   protect, adminOnly, deleteBooking)

export default router

import { Router } from 'express'
import { getReviews, createReview, deleteReview } from '../controllers/review.controller.js'
import { protect } from '../middleware/auth.middleware.js'

const router = Router({ mergeParams: true })

router.get('/',     getReviews)
router.post('/',    protect, createReview)
router.delete('/:id', protect, deleteReview)

export default router

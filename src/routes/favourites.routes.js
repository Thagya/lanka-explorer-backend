import { Router } from 'express'
import { getFavourites, addFavourite, removeFavourite } from '../controllers/favourites.controller.js'
import { protect } from '../middleware/auth.middleware.js'

const router = Router()

router.get('/',          protect, getFavourites)
router.post('/',         protect, addFavourite)
router.delete('/:itemId', protect, removeFavourite)

export default router

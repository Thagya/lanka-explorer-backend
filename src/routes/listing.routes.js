import { Router } from 'express'
import {
  getListings, getAllListings, getListing,
  createListing, updateListing, deleteListing,
} from '../controllers/listing.controller.js'
import { protect, adminOnly } from '../middleware/auth.middleware.js'

const router = Router()

router.get('/',         getListings)           // public — active only
router.get('/all',      protect, adminOnly, getAllListings)  // admin
router.get('/:id',      getListing)            // public
router.post('/',        protect, adminOnly, createListing)
router.put('/:id',      protect, adminOnly, updateListing)
router.delete('/:id',   protect, adminOnly, deleteListing)

export default router

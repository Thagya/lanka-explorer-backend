import { Router } from 'express'
import {
  getAttractions, getAttraction,
  createAttraction, updateAttraction, deleteAttraction,
} from '../controllers/attraction.controller.js'
import { protect, adminOnly } from '../middleware/auth.middleware.js'

const router = Router()

router.get('/',       getAttractions)   // public
router.get('/:id',    getAttraction)    // public
router.post('/',      protect, adminOnly, createAttraction)
router.put('/:id',    protect, adminOnly, updateAttraction)
router.delete('/:id', protect, adminOnly, deleteAttraction)

export default router

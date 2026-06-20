import { Router } from 'express'
import {
  getUsers, getUser, updateUser, toggleUserActive, deleteUser,
} from '../controllers/user.controller.js'
import { protect, adminOnly } from '../middleware/auth.middleware.js'

const router = Router()

router.get('/',           protect, adminOnly, getUsers)
router.get('/:id',        protect, adminOnly, getUser)
router.put('/:id',        protect, adminOnly, updateUser)
router.patch('/:id/toggle', protect, adminOnly, toggleUserActive)
router.delete('/:id',     protect, adminOnly, deleteUser)

export default router

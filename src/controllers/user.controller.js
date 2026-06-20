import User from '../models/User.js'
import Booking from '../models/Booking.js'

export async function getUsers(req, res) {
  try {
    const users = await User.find().sort({ createdAt: -1 })
    res.json(users)
  } catch (err) {
    res.status(500).json({ message: err.message })
  }
}

export async function getUser(req, res) {
  try {
    const user = await User.findById(req.params.id)
    if (!user) return res.status(404).json({ message: 'User not found' })
    const bookings = await Booking.find({ userId: req.params.id }).sort({ createdAt: -1 })
    res.json({ ...user.toJSON(), bookings })
  } catch (err) {
    res.status(500).json({ message: err.message })
  }
}

export async function updateUser(req, res) {
  try {
    const { password, role, ...safe } = req.body
    // Only admins can change role; allow role update if requester is admin
    if (req.user.role === 'admin' && role) safe.role = role
    const user = await User.findByIdAndUpdate(req.params.id, safe, { new: true, runValidators: true })
    if (!user) return res.status(404).json({ message: 'User not found' })
    res.json(user)
  } catch (err) {
    res.status(400).json({ message: err.message })
  }
}

export async function toggleUserActive(req, res) {
  try {
    const user = await User.findById(req.params.id)
    if (!user) return res.status(404).json({ message: 'User not found' })
    user.active = !user.active
    await user.save()
    res.json(user)
  } catch (err) {
    res.status(500).json({ message: err.message })
  }
}

export async function deleteUser(req, res) {
  try {
    const user = await User.findByIdAndDelete(req.params.id)
    if (!user) return res.status(404).json({ message: 'User not found' })
    res.json({ message: 'User deleted' })
  } catch (err) {
    res.status(500).json({ message: err.message })
  }
}

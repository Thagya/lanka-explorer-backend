import Booking from '../models/Booking.js'
import Listing from '../models/Listing.js'
import mongoose from 'mongoose'

const isBadId = (id) => !mongoose.Types.ObjectId.isValid(id)

const TRANSITIONS = {
  submit_payment:     { from: ['pending_payment'],                              to: 'under_review',         actor: 'user' },
  resubmit_payment:   { from: ['payment_rejected'],                             to: 'under_review',         actor: 'user' },
  cancel:             { from: ['pending_payment', 'under_review', 'confirmed'], to: 'cancelled',            actor: 'user' },
  request_reschedule: { from: ['confirmed'],                                    to: 'reschedule_requested', actor: 'user' },
  request_amendment:  { from: ['confirmed'],                                    to: 'amendment_requested',  actor: 'user' },
  reject_payment:     { from: ['under_review'],                                 to: 'payment_rejected',     actor: 'admin' },
  confirm:            { from: ['under_review'],                                 to: 'confirmed',            actor: 'admin' },
  complete:           { from: ['confirmed'],                                     to: 'completed',            actor: 'admin' },
  approve_reschedule: { from: ['reschedule_requested'],                         to: 'confirmed',            actor: 'admin' },
  approve_amendment:  { from: ['amendment_requested'],                          to: 'confirmed',            actor: 'admin' },
}

function applyTransition(booking, action, payload, actor) {
  const t = TRANSITIONS[action]
  if (!t || !t.from.includes(booking.status))
    throw new Error(`Cannot perform '${action}' on status '${booking.status}'`)
  if (t.actor !== actor) {
    const err = new Error(`Action '${action}' can only be performed by ${t.actor}`)
    err.status = 403
    throw err
  }

  booking.history.push({ actor, action, note: payload?.note, at: new Date() })
  booking.status = t.to

  if (action === 'submit_payment' && payload?.payment)
    booking.payment = { ...payload.payment, submittedAt: new Date() }
  if (action === 'request_reschedule' && payload?.details)
    booking.pendingChange = payload.details
  if (action === 'approve_reschedule') {
    if (booking.pendingChange) booking.details = { ...booking.details, ...booking.pendingChange }
    booking.pendingChange = null
  }
  if (action === 'request_amendment' && payload?.details)
    booking.pendingChange = payload.details
  if (action === 'approve_amendment') {
    if (booking.pendingChange) booking.details = { ...booking.details, ...booking.pendingChange }
    booking.pendingChange = null
  }
}

export async function getMyBookings(req, res) {
  try {
    const bookings = await Booking.find({ userId: req.user._id }).sort({ createdAt: -1 })
    res.json(bookings)
  } catch (err) {
    res.status(500).json({ message: err.message })
  }
}

export async function getAllBookings(req, res) {
  try {
    const filter = {}
    if (req.query.status) filter.status = req.query.status
    if (req.query.type)   filter.type   = req.query.type
    const bookings = await Booking.find(filter)
      .populate('userId', 'name email')
      .sort({ createdAt: -1 })
    res.json(bookings)
  } catch (err) {
    res.status(500).json({ message: err.message })
  }
}

export async function getBooking(req, res) {
  try {
    if (isBadId(req.params.id)) return res.status(400).json({ message: 'Invalid booking ID' })
    const booking = await Booking.findById(req.params.id).populate('userId', 'name email')
    if (!booking) return res.status(404).json({ message: 'Booking not found' })
    // Guard against deleted user reference
    const ownerId = booking.userId?._id ?? booking.userId
    if (req.user.role !== 'admin' && String(ownerId) !== String(req.user._id))
      return res.status(403).json({ message: 'Forbidden' })
    res.json(booking)
  } catch (err) {
    res.status(500).json({ message: err.message })
  }
}

export async function createBooking(req, res) {
  try {
    const { listingId, customer, details, pricing } = req.body
    if (!listingId) return res.status(400).json({ message: 'listingId is required' })
    if (isBadId(listingId)) return res.status(400).json({ message: 'Invalid listing ID' })

    const listing = await Listing.findById(listingId)
    if (!listing) return res.status(404).json({ message: 'Listing not found' })

    const booking = await Booking.create({
      listingId,
      customer,
      details,
      pricing,
      listingName: listing.name,
      type: listing.listingType,
      userId: req.user._id,
      history: [{ actor: 'user', action: 'created', at: new Date() }],
    })
    res.status(201).json(booking)
  } catch (err) {
    res.status(400).json({ message: err.message })
  }
}

export async function transitionBooking(req, res) {
  try {
    if (isBadId(req.params.id)) return res.status(400).json({ message: 'Invalid booking ID' })
    const booking = await Booking.findById(req.params.id)
    if (!booking) return res.status(404).json({ message: 'Booking not found' })

    const { action, ...payload } = req.body
    if (!action) return res.status(400).json({ message: 'action is required' })

    const actor = req.user.role === 'admin' ? 'admin' : 'user'
    if (actor === 'user' && String(booking.userId) !== String(req.user._id))
      return res.status(403).json({ message: 'Forbidden' })

    applyTransition(booking, action, payload, actor)
    await booking.save()
    res.json(booking)
  } catch (err) {
    res.status(err.status || 400).json({ message: err.message })
  }
}

export async function deleteBooking(req, res) {
  try {
    if (isBadId(req.params.id)) return res.status(400).json({ message: 'Invalid booking ID' })
    const booking = await Booking.findByIdAndDelete(req.params.id)
    if (!booking) return res.status(404).json({ message: 'Booking not found' })
    res.json({ message: 'Booking deleted' })
  } catch (err) {
    res.status(500).json({ message: err.message })
  }
}

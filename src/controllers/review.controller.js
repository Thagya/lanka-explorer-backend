import Review from '../models/Review.js'
import Listing from '../models/Listing.js'

async function updateListingRating(listingId) {
  const reviews = await Review.find({ listingId })
  const count = reviews.length
  const avg = count ? reviews.reduce((s, r) => s + r.rating, 0) / count : 0
  await Listing.findByIdAndUpdate(listingId, {
    rating: Math.round(avg * 10) / 10,
    reviewCount: count,
  })
}

export async function getReviews(req, res) {
  try {
    const reviews = await Review.find({ listingId: req.params.listingId }).sort({ createdAt: -1 })
    res.json(reviews)
  } catch (err) {
    res.status(500).json({ message: err.message })
  }
}

export async function createReview(req, res) {
  try {
    const { rating, comment } = req.body
    if (!rating || !comment) return res.status(400).json({ message: 'Rating and comment are required' })
    if (rating < 1 || rating > 5) return res.status(400).json({ message: 'Rating must be between 1 and 5' })

    const existing = await Review.findOne({ listingId: req.params.listingId, userId: req.user._id })
    if (existing) return res.status(409).json({ message: 'You have already reviewed this listing' })

    const review = await Review.create({
      listingId: req.params.listingId,
      userId: req.user._id,
      userName: req.user.name,
      rating: Number(rating),
      comment,
    })
    await updateListingRating(req.params.listingId)
    res.status(201).json(review)
  } catch (err) {
    res.status(500).json({ message: err.message })
  }
}

export async function deleteReview(req, res) {
  try {
    const review = await Review.findById(req.params.id)
    if (!review) return res.status(404).json({ message: 'Review not found' })
    const isOwner = review.userId.toString() === req.user._id.toString()
    const isAdmin = req.user.role === 'admin'
    if (!isOwner && !isAdmin) return res.status(403).json({ message: 'Not authorized' })
    await review.deleteOne()
    await updateListingRating(review.listingId)
    res.json({ message: 'Review deleted' })
  } catch (err) {
    res.status(500).json({ message: err.message })
  }
}

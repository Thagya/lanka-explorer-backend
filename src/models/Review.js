import mongoose from 'mongoose'

const reviewSchema = new mongoose.Schema({
  listingId: { type: mongoose.Schema.Types.ObjectId, ref: 'Listing', required: true },
  userId:    { type: mongoose.Schema.Types.ObjectId, ref: 'User', required: true },
  userName:  { type: String, required: true },
  rating:    { type: Number, required: true, min: 1, max: 5 },
  comment:   { type: String, required: true, trim: true, maxlength: 1000 },
}, { timestamps: true })

// One review per user per listing
reviewSchema.index({ listingId: 1, userId: 1 }, { unique: true })

export default mongoose.model('Review', reviewSchema)

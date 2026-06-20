import mongoose from 'mongoose'

const priceSchema = new mongoose.Schema({
  amount:   { type: Number, required: true },
  unit:     { type: String, enum: ['per_night', 'per_person', 'per_day'], required: true },
  currency: { type: String, default: 'LKR' },
}, { _id: false })

const listingSchema = new mongoose.Schema({
  listingType: { type: String, enum: ['hotel', 'tour', 'vehicle'], required: true },
  name:        { type: String, required: true, trim: true },
  region:      { type: String, required: true },
  address:     { type: String },
  images:      [{ type: String }],
  description: { type: String, required: true },
  price:       { type: priceSchema, required: true },
  options:     { type: mongoose.Schema.Types.Mixed, default: {} },
  active:      { type: Boolean, default: true },
  rating:      { type: Number, default: 0 },
  reviewCount: { type: Number, default: 0 },
}, { timestamps: true })

export default mongoose.model('Listing', listingSchema)

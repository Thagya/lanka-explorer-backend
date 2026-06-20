import mongoose from 'mongoose'

const attractionSchema = new mongoose.Schema({
  name:             { type: String, required: true, trim: true },
  category:         { type: String, enum: ['Historical','Scenic','Beach','Cultural','Wildlife'], required: true },
  region:           { type: String, required: true },
  address:          { type: String },
  lat:              Number,
  lng:              Number,
  images:           [{ type: String }],
  shortDescription: String,
  description:      String,
  openingHours:     String,
  entryFee:         String,
  rating:           { type: Number, min: 0, max: 5, default: 0 },
  tags:             [String],
}, { timestamps: true })

export default mongoose.model('Attraction', attractionSchema)

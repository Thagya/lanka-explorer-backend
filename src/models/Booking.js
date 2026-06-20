import mongoose from 'mongoose'

const historySchema = new mongoose.Schema({
  at:     { type: Date, default: Date.now },
  actor:  { type: String, enum: ['user', 'admin'] },
  action: String,
  note:   String,
}, { _id: false })

const bookingSchema = new mongoose.Schema({
  listingId:   { type: mongoose.Schema.Types.ObjectId, ref: 'Listing', required: true },
  listingName: String,
  type:        { type: String, enum: ['hotel', 'tour', 'vehicle'], required: true },
  userId:      { type: mongoose.Schema.Types.ObjectId, ref: 'User', required: true },
  customer: {
    name:  { type: String, required: true },
    email: { type: String, required: true },
    phone: String,
  },
  details:     { type: mongoose.Schema.Types.Mixed, default: {} },
  pricing: {
    unitPrice: Number,
    quantity:  Number,
    extras:    { type: Number, default: 0 },
    total:     Number,
    currency:  { type: String, default: 'LKR' },
  },
  status: {
    type: String,
    enum: ['pending_payment','under_review','payment_rejected','confirmed',
           'reschedule_requested','amendment_requested','cancelled','completed'],
    default: 'pending_payment',
  },
  payment: {
    method:      String,
    reference:   String,
    paidAmount:  Number,
    paidDate:    String,
    payerName:   String,
    receiptUrl:  String,
    submittedAt: Date,
  },
  pendingChange: { type: mongoose.Schema.Types.Mixed, default: null },
  history:       [historySchema],
}, { timestamps: true })

export default mongoose.model('Booking', bookingSchema)

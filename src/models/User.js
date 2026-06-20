import mongoose from 'mongoose'
import bcrypt from 'bcryptjs'

const userSchema = new mongoose.Schema({
  name:     { type: String, required: true, trim: true },
  email:    { type: String, required: true, unique: true, lowercase: true, trim: true },
  password: { type: String, required: true, minlength: 6, select: false },
  role:       { type: String, enum: ['user', 'admin'], default: 'user' },
  active:     { type: Boolean, default: true },
  favourites: [{
    itemId:   { type: mongoose.Schema.Types.ObjectId, required: true },
    itemType: { type: String, enum: ['attraction', 'listing'], required: true },
  }],
}, { timestamps: true })

// Hash password before save
userSchema.pre('save', async function () {
  if (!this.isModified('password')) return
  this.password = await bcrypt.hash(this.password, 10)
})

userSchema.methods.matchPassword = function (plain) {
  return bcrypt.compare(plain, this.password)
}

// Never return password in JSON
userSchema.set('toJSON', {
  transform: (_doc, ret) => { delete ret.password; return ret },
})

export default mongoose.model('User', userSchema)

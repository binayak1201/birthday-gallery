import mongoose from 'mongoose'

const wishSchema = new mongoose.Schema({
  name: {
    type: String,
    required: true,
  },
  message: {
    type: String,
    required: true,
  },
  createdAt: {
    type: Date,
    default: Date.now,
  },
})

const Wish = mongoose.models.Wish || mongoose.model('Wish', wishSchema)
export default Wish

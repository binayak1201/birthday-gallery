import mongoose from 'mongoose'

const photoSchema = new mongoose.Schema({
  public_id: {
    type: String,
    required: true,
    unique: true,
  },
  secure_url: {
    type: String,
    required: true,
  },
  caption: {
    type: String,
    default: '',
  },
  story: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'Story',
  },
  tags: [{
    type: String,
  }],
  takenAt: {
    type: Date,
  },
  effects: {
    filter: {
      type: String,
      default: 'none',
    },
    brightness: {
      type: Number,
      default: 100,
    },
    contrast: {
      type: Number,
      default: 100,
    },
  },
  createdAt: {
    type: Date,
    default: Date.now,
  },
})

const storySchema = new mongoose.Schema({
  title: {
    type: String,
    required: true,
  },
  description: {
    type: String,
  },
  date: {
    type: Date,
  },
  createdAt: {
    type: Date,
    default: Date.now,
  },
})

export const Photo = mongoose.models.Photo || mongoose.model('Photo', photoSchema)
export const Story = mongoose.models.Story || mongoose.model('Story', storySchema)

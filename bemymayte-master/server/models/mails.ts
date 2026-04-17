import mongoose from 'mongoose'

const emailSchema = new mongoose.Schema(
  {
    email: {
      type: String,
      unique: true,
      required: true,
    },
  },
  { timestamps: true }
)

export const Email = mongoose.model('Email', emailSchema)

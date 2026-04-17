import mongoose from 'mongoose'

const userSchema = new mongoose.Schema({
  picture: String,
  email: {
    type: String,
    unique: true,
  },
  nickname: {
    type: String,
    unique: true,
  },
  birthdate: String,
  locale: String,
  memberships: [String],
  guid: String,
  given_name: String,
  family_name: String,
  email_verified: Boolean,
  iss: String,
  aud: String,
  access_token: String,
  refresh_token: String,
  // мс с начала эпохи
  token_valid_until: Number,
  reg_completed: Boolean,
  main_role: {
    type: String,
    enum: ['AWP', 'Rifler'],
  },
  secondary_roles: [String],
  gender: {
    type: String,
    enum: ['male', 'female', 'unknown'],
    default: 'unknown',
  },
  city: String,
  avatar: String,
}, {
  timestamps: true,
})

export const User = mongoose.model('User', userSchema)

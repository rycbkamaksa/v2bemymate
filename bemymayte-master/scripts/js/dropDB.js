const mongoose = require('mongoose')

const statSchema = new mongoose.Schema({
  wins: {
    type: Number,
    default: 0,
  },
  loses: {
    type: Number,
    default: 0,
  },
  kda: String,
  rating: {
    type: Number,
    default: 0,
  },
  toxicRate: {
    type: Number,
    default: 5,
  },
}, {
  _id: false,
  id: false,
})

const statsSchema = new mongoose.Schema({
  _id: {
    type: String,
    unique: true,
    required: true,
  },
  IGL:  statSchema,
  Entry: statSchema,
  Support: statSchema,
  Anchor: statSchema,
  Lurker: statSchema,
})

const Stat = mongoose.model('Stat', statsSchema)

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

const User = mongoose.model('User', userSchema)

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

const Email = mongoose.model('Email', emailSchema)

const dropCollections = async () => {
  try {
    await mongoose.connect(process.env.DB_URL)
    await Promise.all([Stat.collection.drop(), User.collection.drop(), Email.collection.drop()])
  } catch (e) {
    throw e
  }
}

dropCollections()
  .then(() => {
    process.exit(0)
  })
  .catch((err) => {
    console.log('Failed to drop collections', err)
    process.exit(1)
  })


import mongoose from 'mongoose'

const statSchema = new mongoose.Schema({
  wins: {
    type: Number,
    default: 0,
  },
  loses: {
    type: Number,
    default: 0,
  },
  kills: {
    type: Number,
    default: 0,
  },
  deaths: {
    type: Number,
    default: 0,
  },
  assists: {
    type: Number,
    default: 0,
  },
  rating: {
    type: Number,
    default: 0,
  },
  toxicRate: {
    type: Number,
    default: 5,
  },
  // средние токсит рейты за последние 5 игр
  lastGames: {
    type: [Number],
    default: [],
  },
  // сколько раз выдавался бан челу
  banCnt: {
    type: Number,
    default: 0,
  },
}, {
  _id: false,
  id: false,
  timestamps: true,
})

const statsSchema = new mongoose.Schema({
  // индексируем статы по guid юзера
  guid: {
    type: String,
    unique: true,
    required: true,
    index: true,
  },
  IGL:  statSchema,
  Entry: statSchema,
  Support: statSchema,
  Anchor: statSchema,
  Lurker: statSchema,
})

export const Stat = mongoose.model('Stat', statsSchema)

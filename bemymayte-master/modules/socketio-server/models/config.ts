import mongoose from 'mongoose'

const configSchema = new mongoose.Schema({
  // mimics matchingConfig file
  eloTolerance: Number,
  ratingTolerance: Number,
  qualificationGames: Number,
  beginnerSearchDuration: Number,
  toxicBanBorder: Number,
  banDuration: Number,
  matchSubmitTimeout: Number,
})

export const Config = mongoose.model('Config', configSchema)

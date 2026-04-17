import { RoleEnum } from '~/types/bemymateAPI/roles'
import mongoose from 'mongoose'

export interface IBemyMateMatchStat {
  winner: boolean,
  role: RoleEnum,
  kills: number
  deaths: number,
  assists: number,
  toxicEvaluations: number[],
  roleEvaluations: number[],
  voted: boolean,
}

const matchSchema = new mongoose.Schema({
  faceitId: {
    type: String,
    required: true,
    unique: true,
    index: true,
  },
  status: {
    type: String,
    enum: ['finished', 'started'],
  },
  map: String,
  players: {
    // keys are automatically registered as strings => so we'll use guids
    type: Map,
    of: new mongoose.Schema({
      winner: Boolean,
      role: {
        type: String,
        enum: Object.values(RoleEnum),
      },
      kills: Number,
      deaths: Number,
      assists: Number,
      toxicEvaluations: [Number],
      roleEvaluations: [Number],
      voted: Boolean,
    }),
  },
}, {
  timestamps: true,
})

export const Match = mongoose.model('Match', matchSchema)

const { Int32 } = require('mongodb')
const mongoose = require('mongoose')

const rString = {
  type: String,
  required: true
}

const schema = new mongoose.Schema({
  userID: rString,
  minecraftName: {
    type: String,
    default: ""
  },
  minecraftUUID: {
    type: String,
    default: ""
  },
  teamID: {
    type: String,
    default: 0,
  },
  warns: {
    type: Array,
    default: undefined
  },
  cash: {
    type: Number,
    default: 0,
  },
  xp: {
    type: Number,
    default: 0,
  },
  lvls: {
    type: Number,
    default: 1,
  },
})
module.exports = mongoose.model('plrdata', schema, 'plrdata')

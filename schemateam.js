const { Int32 } = require('mongodb')
const mongoose = require('mongoose')

const rString = {
  type: String,
  required: true
}

const schema = new mongoose.Schema({
  teamID: rString,
  createTime: {
    type: String,
    default: "0"
  },
  leaderID: {
    type: String,
    default: "0"
  },
  users: {
    type: Array,
    default: undefined
  },
  teamImgId: {
    type: String,
    default: "0"
  },
  teamColour: {
    type: String,
    default: "0xffffff"
  },
  teamName: {
    type: String,
    default: ""
  },
  teamShort: {
    type: String,
    default: ""
  },
  teamDesc: {
    type: String,
    default: "No description."
  },
  allies: {
    type: Array,
    default: undefined
  },
  truces: {
    type: Array,
    default: undefined
  },
  wars: {
    type: Array,
    default: undefined
  },
  blacklist: {
    type: Array,
    default: undefined
  },
})
module.exports = mongoose.model('teamdata', schema, 'teamdata')

const { Int32 } = require('mongodb')
const mongoose = require('mongoose')

const rString = {
  type: String,
  required: true
}

const schema = new mongoose.Schema({
  teamID: rString,
  teamLeaderID: {
    type: String,
    default: 0,
  },
  teamName: {
    type: String,
    default: "RBYGSCRSEFRLGDPPtBWB2W2XYORASSMUSUMLGPLGESwShBDSPPLASV",
    required: true
  },
  teamMembers: {
    type: Array,
    default: undefined
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
})
module.exports = mongoose.model('teamdata', schema, 'teamdata')

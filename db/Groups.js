import mongoose from 'mongoose'
const GroupSchema = new mongoose.Schema({
  group_id: {
    type: String
  },
  group_members: {
    type: [String],
    default: null
  }
})

module.exports = mongoose.models.Group || mongoose.model('Group', GroupSchema)

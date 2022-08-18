import mongoose from 'mongoose'
const MessageSchema = new mongoose.Schema({
  partnerId: {
    type: String,
    required: true
  },
  message: {
    type: String,
    required: true
  }
}, { timestamps: true })

const ChatSchema = new mongoose.Schema({
  uid: {
    type: String,
    required: true,
  },
  chats_list: {
    type: [MessageSchema],
    default: null
  }
})

module.exports = mongoose.models.Chat || mongoose.model('Chat', ChatSchema)

import mongoose from 'mongoose'
const ContactSchema = new mongoose.Schema({
  uid: {
    type: String,
    required: true,
    unique: true
  },
  email: {
    type: String,
    required: true,
  },
  contacts_list: {
    type: [{
    id: String,
    email: String,
    name: String
    }],
    default: null
  }
})
module.exports = mongoose.models.Contact || mongoose.model('Contact', ContactSchema)

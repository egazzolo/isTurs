const { Schema, model } = require('mongoose');

const messageSchema = new Schema({
  chatId: {
    type: Schema.Types.ObjectId,
    required: true,
    ref: 'Chat'
  },
  message: {
    type: String,
    required: true
  },
  createdAt: {
    type: Date,
    default: Date.now
  },
  user_name: {
    type: String,
  }, 
  user_id: {
    type: String,
  },
  user_role: {
    type: String,
  },
  user_img: {
    type: String,
  }
});

module.exports = model('Message', messageSchema);
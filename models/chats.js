const { Schema, model } = require('mongoose');

const chatSchema = new Schema({
  turist_id: {
    type: Schema.Types.ObjectId,
    required: true,
    ref: 'User'
  },
  transfer_id: {
    type: Schema.Types.ObjectId,
    required: true,
    ref: 'User'
  },
  createdAt: {
    type: Date,
    default: Date.now
  }
});

module.exports = model('Chat', chatSchema);
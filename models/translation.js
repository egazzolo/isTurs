const { Schema, model} = require('mongoose')

const TraslationSchema = Schema({
  state: {
    type: String,
    enum: ['PROCESS', 'PENDING', 'RESOLVED'],
    default: "PENDING"
  },
  chart: {
    type: String
  },
  operator_IMG: {
    type: String
  },
  turist_IMG: {
    type: String
  },
  name_translate: {
    type: String
  },
  code: {
    type: String,
    required: [true, 'El campo "code" es obligatorio'],
  },
  chat_Id: {
    type: String
  },
  create_at: {
    type: String
  },
  turist_name: {
    type: String
  },
  origin: {
    type: String
  },
  destination: {
    type: String
  },
  transfer_id: {
    type: String
  },
  turist_id: {
    type: String
  },
  date: {
    type: String
  },
  hour: {
    type: String
  }
})


module.exports = model ( `Traslation`, TraslationSchema )


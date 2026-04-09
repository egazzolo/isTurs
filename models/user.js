const { Schema, model} = require('mongoose')

const UsuarioSchema = Schema({
  name: {
    type: String,
    required: [true, 'El campo "name" es obligatorio']
  },
  email: {
    type: String,
  },
  phone: {
    type: String
  },
  username: {
    type: String,
    required: [true, 'El campo "username" es obligatorio'],
    unique: true
  },
  password: {
    type: String,
    required: [true, 'El campo "password" es obligatorio'],
  },
  ruc: {
    type: String,
    unique: true
  },
  code: {
    type: String,
  },
  type_company: {
    type: String,
  },
  company_name: {
    type: String,
  },
  company: {
    type: String,
  },
  code: {
    type: String,
  },
  role: {
    type: String,
    required: true,
    enum: ['TURIST', 'OPERATOR', 'COMPANY']
  },
  profile_img: {
    type: String,
  }
})

//Funcion que reescribe el metodo toJSON del express validator, esto lo hacemos para excluir el __v y el password, y este no sea visible al hacer consultas

UsuarioSchema.methods.toJSON = function () {
  const { __v, password, _id, ...usuario } = this.toObject();

  usuario.uid = _id



  return usuario;
}

module.exports = model( 'Usuario', UsuarioSchema )
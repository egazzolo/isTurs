const { response, request } = require('express')
const bcryptjs = require('bcryptjs')
const Usuario = require('../models/user')
const { codeGenerate } = require('../helpers/codeGenerate')
const { verificarUnicidad } = require('../helpers/verificarUnicidad')
const { findUser } = require('../helpers/findUser')

 
const userGET = async(req = request, res = response) => {
  const usuarios = await Usuario.find()

  res.json({ usuarios })
}

const getByCode = async(req, res = response) => {
  const code = req.params.code;
  const users = await Usuario.find( {  code: code, role: "COMPANY" } );

  res.json({
    users
  });
};

const getMyTransfers= async(req, res = response) => {
  const JWT = req.headers.access_token
  const user = await findUser(JWT)

  const users = await Usuario.find( {  code: user.code, role: "OPERATOR" } );
  const count = users.length

  res.json({
    users,
    count
  });

};


const getById = async(req = request, res = response) => {
  const id = req.params.id

  console.log(id)

  const usuarios = await Usuario.find({ _id: id });

  res.json({ usuarios });
}

const userPOST = async(req, res = response) => {
  
  const { role } = req.body

  if( role === "TURIST") {

    const { name, email, phone, username, password } = req.body
    
    if( !name || !email || !phone || !username || !password ) {
      res.status(400).json({
        msg: 'Todos los campos son obligatorios.'
      })
    }
    
    try {
      const user = new Usuario( { name, email, password, role, phone, username } )

      const salt = bcryptjs.genSaltSync()
      user.password = bcryptjs.hashSync( password, salt )

      await user.save()

      return res.json(user)
      
    } catch (error) {
      res.status(500).json({
        msg: 'Error de Servidor'
      })
    }
  }

  if( role === "COMPANY") {

    const { name, company_name, phone, username, password, ruc, type_company } = req.body

    if( !name || !company_name || !phone || !username || !password, !ruc, !type_company ) {
      res.status(400).json({
        msg: 'Todos los campos son obligatorios.'
      })
    }

    try {

      const code = codeGenerate(8)
      const user = new Usuario( { name, company_name, phone, username, password, ruc, type_company, code, role } )

      const salt = bcryptjs.genSaltSync()
      user.password = bcryptjs.hashSync( password, salt )

      await user.save()

      return res.json(user)
      
    } catch (error) {
      console.log(error)
      res.status(500).json({
        msg: 'Error de Servidor'
      })
    }
  }

  if( role === "OPERATOR") {

    const { name, email, company, code, type_company, username, password } = req.body

    if( !name || !company || !email || !username || !password, !code, !type_company ) {
      res.status(400).json({
        msg: 'Todos los campos son obligatorios.'
      })
    }

    try {

      const user = new Usuario( { name, email, company, code, type_company, username, password, role } )

      const salt = bcryptjs.genSaltSync()
      user.password = bcryptjs.hashSync( password, salt )

      await user.save()

      return res.json(user)
      
    } catch (error) {
      console.log(error)
      res.status(500).json({
        msg: 'Error de Servidor'
      })
    }
  }

}

const userPUT = async(req, res = response) => {
  const id = req.params.id
  let { _id, password, email, username, phone, ...rest} = req.body

  //Verifica que los Datos no existan ya 

  try {
    const errorMessage = await verificarUnicidad( { email, username, phone, id } );
    if (errorMessage) {
      return res.status(400).json({
        msg: errorMessage
      });
    }
  } catch (error) {
    console.log(error)
    return res.status(500).json({
      msg: 'Error al verificar unicidad de los datos',
      error
    });
  }

  if (password) {
    const salt = bcryptjs.genSaltSync();
    password = bcryptjs.hashSync(password, salt);
  }

  // Preparar el objeto con los datos actualizados, incluyendo correo, username, phone y password si se ha proporcionado
  const datosActualizados = {
    ...rest,
    ...(email && {email}),
    ...(username && {username}),
    ...(phone && {phone}),
    ...(password && {password})
  };

  try {
    const usuario = await Usuario.findByIdAndUpdate(id, datosActualizados, { new: true });
    res.json(usuario);
  } catch (error) {
    res.status(500).json({
      msg: 'Error al actualizar usuario',
      error
    });
  }

}

module.exports = {
  userGET,
  userPOST,
  userPUT,
  getByCode,
  getById,
  getMyTransfers
}
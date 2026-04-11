const { response, request } = require('express')
const bcryptjs = require('bcryptjs')
const supabase = require('../database/config')
const { codeGenerate } = require('../helpers/codeGenerate')
const { verificarUnicidad } = require('../helpers/verificarUnicidad')
const { findUser } = require('../helpers/findUser')

const userGET = async (req = request, res = response) => {
  const { data: usuarios } = await supabase
    .from('profiles')
    .select('id, name, email, phone, username, role, code, company_name, type_company, profile_img, created_at')
  res.json({ usuarios })
}

const getByCode = async (req, res = response) => {
  const code = req.params.code
  const { data: users } = await supabase
    .from('profiles')
    .select('id, name, code, company_name, type_company, profile_img')
    .eq('code', code)
    .eq('role', 'COMPANY')
  res.json({ users })
}

const getMyTransfers = async (req, res = response) => {
  const JWT = req.headers.access_token
  const user = await findUser(JWT)

  const { data: users, count } = await supabase
    .from('profiles')
    .select('*', { count: 'exact' })
    .eq('code', user.code)
    .eq('role', 'OPERATOR')

  res.json({ users, count })
}

const getById = async (req = request, res = response) => {
  const { id } = req.params
  const { data: usuarios } = await supabase
    .from('profiles')
    .select('id, name, email, phone, username, role, code, company_name, type_company, profile_img, created_at')
    .eq('id', id)
  res.json({ usuarios })
}

const userPOST = async (req, res = response) => {
  const { role } = req.body

  if (role === 'TURIST') {
    const { name, email, phone, username, password } = req.body
    if (!name || !email || !phone || !username || !password) {
      return res.status(400).json({ msg: 'Todos los campos son obligatorios.' })
    }
    try {
      const salt = bcryptjs.genSaltSync()
      const hashedPassword = bcryptjs.hashSync(password, salt)
      const { data: user, error } = await supabase
        .from('profiles')
        .insert({ name, email, phone, username, password: hashedPassword, role })
        .select('id, name, email, phone, username, role, profile_img, created_at')
        .single()
      if (error) throw error
      return res.json(user)
    } catch (error) {
      console.log(error)
      return res.status(500).json({ msg: 'Error de Servidor' })
    }
  }

  if (role === 'COMPANY') {
    const { name, company_name, phone, username, password, ruc, type_company } = req.body
    if (!name || !company_name || !phone || !username || !password || !ruc || !type_company) {
      return res.status(400).json({ msg: 'Todos los campos son obligatorios.' })
    }
    try {
      const code = codeGenerate(8)
      const salt = bcryptjs.genSaltSync()
      const hashedPassword = bcryptjs.hashSync(password, salt)
      const { data: user, error } = await supabase
        .from('profiles')
        .insert({ name, company_name, phone, username, password: hashedPassword, ruc, type_company, code, role })
        .select('id, name, phone, username, role, company_name, type_company, ruc, code, created_at')
        .single()
      if (error) throw error
      return res.json(user)
    } catch (error) {
      console.log(error)
      return res.status(500).json({ msg: 'Error de Servidor' })
    }
  }

  if (role === 'OPERATOR') {
    const { name, email, company, code, type_company, username, password } = req.body
    if (!name || !company || !email || !username || !password || !code || !type_company) {
      return res.status(400).json({ msg: 'Todos los campos son obligatorios.' })
    }
    try {
      const salt = bcryptjs.genSaltSync()
      const hashedPassword = bcryptjs.hashSync(password, salt)
      const { data: user, error } = await supabase
        .from('profiles')
        .insert({ name, email, company, code, type_company, username, password: hashedPassword, role })
        .select('id, name, email, username, role, company, code, type_company, created_at')
        .single()
      if (error) throw error
      return res.json(user)
    } catch (error) {
      console.log(error)
      return res.status(500).json({ msg: 'Error de Servidor' })
    }
  }

  return res.status(400).json({ msg: 'Rol no válido' })
}

const userPUT = async (req, res = response) => {
  const { id } = req.params
  let { _id, password, email, username, phone, ...rest } = req.body

  try {
    const errorMessage = await verificarUnicidad({ email, username, phone, id })
    if (errorMessage) {
      return res.status(400).json({ msg: errorMessage })
    }
  } catch (error) {
    return res.status(500).json({ msg: 'Error al verificar unicidad de los datos', error })
  }

  if (password) {
    const salt = bcryptjs.genSaltSync()
    password = bcryptjs.hashSync(password, salt)
  }

  const datosActualizados = {
    ...rest,
    ...(email && { email }),
    ...(username && { username }),
    ...(phone && { phone }),
    ...(password && { password }),
  }

  try {
    const { data: usuario, error } = await supabase
      .from('profiles')
      .update(datosActualizados)
      .eq('id', id)
      .select('id, name, email, phone, username, role, code, company_name, type_company, profile_img, created_at')
      .single()
    if (error) throw error
    res.json(usuario)
  } catch (error) {
    res.status(500).json({ msg: 'Error al actualizar usuario', error })
  }
}

module.exports = { userGET, userPOST, userPUT, getByCode, getById, getMyTransfers }

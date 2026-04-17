const supabase = require('../database/config')

const validateRole = async (role = '') => {
  const validRoles = ['TURIST', 'OPERATOR', 'COMPANY']
  if (!validRoles.includes(role)) {
    throw new Error(`El rol ${role} no está registrado`)
  }
}

const emailExist = async (email) => {
  if (!email || email === null) return true
  const { data } = await supabase.from('profiles').select('id').eq('email', email).single()
  if (data) throw new Error(`El correo ${email} ya está registrado`)
}

const userExist = async (username = '') => {
  const { data } = await supabase.from('profiles').select('id').eq('username', username).single()
  if (data) throw new Error(`El usuario ${username} ya está registrado`)
}

const phoneExist = async (phone = '') => {
  if (!phone || phone === null) return true
  const { data } = await supabase.from('profiles').select('id').eq('phone', phone).single()
  if (data) throw new Error(`El teléfono ${phone} ya está registrado`)
}

const rucExist = async (ruc) => {
  if (!ruc) return true
  const { data } = await supabase.from('profiles').select('id').eq('ruc', ruc).single()
  if (data) throw new Error(`El RUC ${ruc} ya está registrado`)
}

const codeExist = async (code) => {
  if (!code) return true
  const { data } = await supabase.from('profiles').select('id').eq('code', code).single()
  if (!data) throw new Error(`El Codigo ${code} no existe`)
  return true
}

module.exports = { emailExist, validateRole, userExist, phoneExist, rucExist, codeExist }

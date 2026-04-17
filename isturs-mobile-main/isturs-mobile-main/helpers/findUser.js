const jwt = require('jsonwebtoken')
const supabase = require('../database/config')

const findUser = async (token) => {
  try {
    const decoded = jwt.verify(token, process.env.SECRETORPRIVATEKEY)
    const { data: usuario, error } = await supabase
      .from('profiles')
      .select('*')
      .eq('id', decoded.uid)
      .single()
    if (error || !usuario) return null
    return usuario
  } catch (error) {
    console.error(error)
    throw new Error('Error al verificar el token o buscar el usuario.')
  }
}

module.exports = { findUser }

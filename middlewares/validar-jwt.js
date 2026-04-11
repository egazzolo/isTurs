const { response, request } = require('express')
const jwt = require('jsonwebtoken')
const supabase = require('../database/config')

const validarJWT = async (req = request, res = response, next) => {
  const token = req.header('access_token')

  if (!token) {
    return res.status(401).json({ msg: 'No hay token en la petición' })
  }

  try {
    const { uid } = jwt.verify(token, process.env.SECRETORPRIVATEKEY)

    const { data: usuario, error } = await supabase
      .from('profiles')
      .select('*')
      .eq('id', uid)
      .single()

    if (error || !usuario) {
      return res.status(401).json({ msg: 'El Usuario no existe' })
    }

    req.user = usuario
    next()
  } catch (error) {
    console.log(error)
    res.status(401).json({ msg: 'Token no válido' })
  }
}

module.exports = { validarJWT }

const { response } = require('express')
const bcryptjs = require('bcryptjs')
const supabase = require('../database/config')
const { generarJWT, verificarJWT } = require('../helpers/generarJWT')

const login = async (req, res = response) => {
  const { username, password } = req.body
  console.log('Login attempt for username:', username)

  try {
    const { data: usuario, error } = await supabase
      .from('profiles')
      .select('*')
      .eq('username', username)
      .single()

    console.log('Supabase result:', { usuario: usuario ? 'found' : 'not found', error })

    if (error || !usuario) {
      return res.status(400).json({ msg: 'Usuario / Contrase\u00f1a no son correctos - Usuario' })
    }

    const validPassword = bcryptjs.compareSync(password, usuario.password)
    console.log('Password valid:', validPassword)

    if (!validPassword) {
      return res.status(400).json({ msg: 'Usuario / Contrase\u00f1a no son correctos - Password' })
    }

    const token = await generarJWT(usuario.id)
    console.log('Token generated successfully')

    const { password: _, ...usuarioSinPassword } = usuario
    res.json({ usuario: usuarioSinPassword, token })
  } catch (error) {
    console.log('Login error:', error)
    res.status(500).json({ msg: 'Ocurri\u00f3 un error' })
  }
}

const refreshToken = async (req, res = response) => {
  const { token } = req.body

  try {
    const { uid } = await verificarJWT(token)

    const { data: usuario, error } = await supabase
      .from('profiles')
      .select('*')
      .eq('id', uid)
      .single()

    if (error || !usuario) {
      return res.status(404).json({ msg: 'No se encontr\u00f3 el usuario asociado al token' })
    }

    const newToken = await generarJWT(usuario.id)
    const { password: _, ...usuarioSinPassword } = usuario

    res.json({ usuario: usuarioSinPassword, token: newToken })
  } catch (error) {
    console.log(error)
    res.status(401).json({ msg: 'Token no v\u00e1lido o expirado' })
  }
}

module.exports = { login, refreshToken }

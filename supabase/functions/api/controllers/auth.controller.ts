import bcryptjs from 'npm:bcryptjs@2.4.3'
import supabase from '../database/config.ts'
import { generarJWT, verificarJWT } from '../helpers/jwt.ts'

export const login = async (req: any, res: any) => {
  const { username, password } = req.body

  try {
    const { data: usuario, error } = await supabase
      .from('profiles')
      .select('*')
      .eq('username', username)
      .single()

    if (error || !usuario) {
      return res.status(400).json({ msg: 'Usuario / Contraseña no son correctos - Usuario' })
    }

    const validPassword = bcryptjs.compareSync(password, usuario.password)
    if (!validPassword) {
      return res.status(400).json({ msg: 'Usuario / Contraseña no son correctos - Password' })
    }

    const token = await generarJWT(usuario.id)
    const { password: _, ...usuarioSinPassword } = usuario

    res.json({ usuario: usuarioSinPassword, token })
  } catch (error) {
    console.log(error)
    res.status(500).json({ msg: 'Ocurrió un error' })
  }
}

export const refreshToken = async (req: any, res: any) => {
  const { token } = req.body

  try {
    const { uid } = await verificarJWT(token)

    const { data: usuario, error } = await supabase
      .from('profiles')
      .select('*')
      .eq('id', uid)
      .single()

    if (error || !usuario) {
      return res.status(404).json({ msg: 'No se encontró el usuario asociado al token' })
    }

    const newToken = await generarJWT(usuario.id)
    const { password: _, ...usuarioSinPassword } = usuario

    res.json({ usuario: usuarioSinPassword, token: newToken })
  } catch (error) {
    console.log(error)
    res.status(401).json({ msg: 'Token no válido o expirado' })
  }
}

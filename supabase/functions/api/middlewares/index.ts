import { validationResult } from 'npm:express-validator@7.0.1'
import supabase from '../database/config.ts'
import { verifySync } from '../helpers/jwt.ts'

export const validarCampos = (req: any, res: any, next: any) => {
  const errors = validationResult(req)
  if (!errors.isEmpty()) {
    return res.status(400).json(errors)
  }
  next()
}

export const validarJWT = async (req: any, res: any, next: any) => {
  const token = req.header('access_token')

  if (!token) {
    return res.status(401).json({ msg: 'No hay token en la petición' })
  }

  try {
    const { uid } = verifySync(token)

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

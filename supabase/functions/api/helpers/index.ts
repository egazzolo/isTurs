import moment from 'npm:moment-timezone@0.5.45'
import supabase from '../database/config.ts'
import { verifySync } from './jwt.ts'

export function codeGenerate(longitud = 8) {
  const caracteres = 'ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz0123456789'
  let codigo = ''
  for (let i = 0; i < longitud; i++) {
    const indiceAleatorio = Math.floor(Math.random() * caracteres.length)
    codigo += caracteres.charAt(indiceAleatorio)
  }
  return codigo
}

// Current date and time in Lima, Peru
export function hourGenerate() {
  return moment().tz('America/Lima').format('YYYY-MM-DD HH:mm:ss')
}

export const findUser = async (token: string) => {
  try {
    const decoded = verifySync(token)
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

export async function verificarUnicidad({ email, username, phone, id }: any) {
  if (email !== undefined) {
    const { data } = await supabase.from('profiles').select('id').eq('email', email).neq('id', id).single()
    if (data) return 'El email ya está en uso por otro usuario'
  }
  if (username !== undefined) {
    const { data } = await supabase.from('profiles').select('id').eq('username', username).neq('id', id).single()
    if (data) return 'El nombre de usuario ya está en uso por otro usuario'
  }
  if (phone !== undefined) {
    const { data } = await supabase.from('profiles').select('id').eq('phone', phone).neq('id', id).single()
    if (data) return 'El teléfono ya está en uso por otro usuario'
  }
  return null
}

// Decodes a base64 data URL (as sent by the app) into bytes for Storage upload
export function base64ToBytes(image: string) {
  const base64Data = image.replace(/^data:image\/\w+;base64,/, '')
  const binary = atob(base64Data)
  const bytes = new Uint8Array(binary.length)
  for (let i = 0; i < binary.length; i++) bytes[i] = binary.charCodeAt(i)
  return bytes
}

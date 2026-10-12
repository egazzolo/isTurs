import supabase from '../database/config.ts'

export const validateRole = async (role = '') => {
  const validRoles = ['TURIST', 'OPERATOR', 'COMPANY']
  if (!validRoles.includes(role)) {
    throw new Error(`El rol ${role} no está registrado`)
  }
}

export const emailExist = async (email: string) => {
  if (!email) return true
  const { data } = await supabase.from('profiles').select('id').eq('email', email).single()
  if (data) throw new Error(`El correo ${email} ya está registrado`)
}

export const userExist = async (username = '') => {
  const { data } = await supabase.from('profiles').select('id').eq('username', username).single()
  if (data) throw new Error(`El usuario ${username} ya está registrado`)
}

export const phoneExist = async (phone = '') => {
  if (!phone) return true
  const { data } = await supabase.from('profiles').select('id').eq('phone', phone).single()
  if (data) throw new Error(`El teléfono ${phone} ya está registrado`)
}

export const rucExist = async (ruc: string) => {
  if (!ruc) return true
  const { data } = await supabase.from('profiles').select('id').eq('ruc', ruc).single()
  if (data) throw new Error(`El RUC ${ruc} ya está registrado`)
}

export const codeExist = async (code: string) => {
  if (!code) return true
  const { data } = await supabase.from('profiles').select('id').eq('code', code).single()
  if (!data) throw new Error(`El Codigo ${code} no existe`)
  return true
}

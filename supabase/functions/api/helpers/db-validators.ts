import supabase from '../database/config.ts'
import { tr } from './i18n.ts'

export const validateRole = async (role = '', { req }: any) => {
  const validRoles = ['TURIST', 'OPERATOR', 'COMPANY']
  if (!validRoles.includes(role)) {
    throw new Error(tr(req, 'invalidRole'))
  }
}

export const emailExist = async (email: string, { req }: any) => {
  if (!email) return true
  const { data } = await supabase.from('profiles').select('id').eq('email', email).single()
  if (data) throw new Error(tr(req, 'emailTaken', email))
}

export const userExist = async (username = '', { req }: any) => {
  const { data } = await supabase.from('profiles').select('id').eq('username', username).single()
  if (data) throw new Error(tr(req, 'usernameTaken', username))
}

export const phoneExist = async (phone = '', { req }: any) => {
  if (!phone) return true
  const { data } = await supabase.from('profiles').select('id').eq('phone', phone).single()
  if (data) throw new Error(tr(req, 'phoneTaken', phone))
}

export const rucExist = async (ruc: string, { req }: any) => {
  if (!ruc) return true
  const { data } = await supabase.from('profiles').select('id').eq('ruc', ruc).single()
  if (data) throw new Error(tr(req, 'rucTaken', ruc))
}

export const codeExist = async (code: string, { req }: any) => {
  if (!code) return true
  // Operators share their company's code, so match the company row only.
  const { data } = await supabase.from('profiles').select('id').eq('code', code).eq('role', 'COMPANY').maybeSingle()
  if (!data) throw new Error(tr(req, 'companyCodeNotFound', code))
  return true
}

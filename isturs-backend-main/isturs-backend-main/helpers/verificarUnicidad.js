const supabase = require('../database/config')

async function verificarUnicidad({ email, username, phone, id }) {
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

module.exports = { verificarUnicidad }

const { response } = require('express')
const { findUser } = require('../helpers/findUser')
const { hourGenerate } = require('../helpers/hourGenerate')
const supabase = require('../database/config')

const translationPOST = async (req, res = response) => {
  const { code } = req.body
  const JWT = req.headers.access_token
  const user = await findUser(JWT)

  const data = {
    code,
    chart: user.name,
    create_at: hourGenerate(),
    turist_name: user.name,
    turist_id: user.id,
    turist_img: user.profile_img
  }

  try {
    const { data: translation, error } = await supabase
      .from('translations')
      .insert(data)
      .select()
      .single()
    if (error) throw error
    return res.json(translation)
  } catch (error) {
    console.log(error)
    res.status(500).json({ msg: 'Error de Servidor' })
  }
}

const finishTranslate = async (req, res = response) => {
  const { id_translation } = req.body
  try {
    const { data: updatedTranslation, error } = await supabase
      .from('translations')
      .update({ state: 'RESOLVED' })
      .eq('id', id_translation)
      .select()
      .single()
    if (error || !updatedTranslation) {
      return res.status(404).json({ msg: 'Traslado no encontrado' })
    }
    res.json(updatedTranslation)
  } catch (error) {
    res.status(500).json({ msg: 'Error al actualizar el estado del traslado', error })
  }
}

const acceptTourist = async (req, res = response) => {
  const { turist_id, transfer_id, origin, destination, date, hour, id_translation } = req.body

  const { data: turistValidation } = await supabase
    .from('profiles').select('id').eq('id', turist_id).eq('role', 'TURIST').single()
  const { data: transferValidation } = await supabase
    .from('profiles').select('id, profile_img').eq('id', transfer_id).eq('role', 'OPERATOR').single()

  if (!turistValidation || !transferValidation) {
    return res.status(400).json({ msg: 'El Turista o el Trasladista no existen' })
  }

  try {
    const { data: savedChat, error: chatError } = await supabase
      .from('chats')
      .insert({ turist_id, transfer_id })
      .select()
      .single()
    if (chatError) throw chatError

    const updateData = {
      turist_id, transfer_id, origin, destination, date, hour,
      state: 'PROCESS',
      operator_img: transferValidation.profile_img,
      chat_id: savedChat.id
    }

    const { data: translation, error } = await supabase
      .from('translations')
      .update(updateData)
      .eq('id', id_translation)
      .select()
      .single()
    if (error) throw error
    res.json(translation)
  } catch (error) {
    res.status(500).json({ msg: 'Error al procesar la solicitud', error })
  }
}

const getCompanies = async (req, res = response) => {
  const { type } = req.params
  const { data: companies } = await supabase
    .from('profiles')
    .select('id, code, name, type_company')
    .eq('role', 'COMPANY')
    .eq('type_company', type)
  res.json({ companies })
}

const getMyRequest = async (req, res = response) => {
  const JWT = req.headers.access_token
  const user = await findUser(JWT)

  const { data: turistPending, count } = await supabase
    .from('translations')
    .select('*', { count: 'exact' })
    .eq('code', user.code)
    .eq('state', 'PENDING')

  res.json({ turistPending, count })
}

const getMyTranslations = async (req, res = response) => {
  const JWT = req.headers.access_token
  const user = await findUser(JWT)

  if (!user) return res.status(404).send('User not found')

  const query = user.role === 'OPERATOR'
    ? supabase.from('translations').select('*').eq('transfer_id', user.id).eq('state', 'PROCESS')
    : supabase.from('translations').select('*').eq('turist_id', user.id).eq('state', 'PROCESS')

  const { data: translations } = await query

  const now = new Date()
  const parseDate = (dateStr, hourStr) => {
    const [day, month, year] = dateStr.split('/')
    return new Date(`${month}/${day}/${year} ${hourStr}:00`)
  }

  let closestTranslation = null
  let minDiff = Infinity
  translations.forEach(translation => {
    const translationDate = parseDate(translation.date, translation.hour)
    const diff = translationDate - now
    if (diff > 0 && diff < minDiff) {
      closestTranslation = translation
      minDiff = diff
    }
  })

  const updatedTranslations = translations.map(translation => ({
    ...translation,
    enCurso: translation === closestTranslation
  }))

  res.json({ translations: updatedTranslations, count: updatedTranslations.length })
}

const editTranslation = async (req, res = response) => {
  const { id_translation, chart, operator_img, turist_img } = req.body

  const datosActualizados = {
    ...(chart && { chart }),
    ...(operator_img && { operator_img }),
    ...(turist_img && { turist_img }),
  }

  try {
    const { data: translate, error } = await supabase
      .from('translations')
      .update(datosActualizados)
      .eq('id', id_translation)
      .select()
      .single()
    if (error) throw error
    res.json(translate)
  } catch (error) {
    res.status(500).json({ msg: 'Error al actualizar Traslado', error })
  }
}

const getMyHistory = async (req, res = response) => {
  const JWT = req.headers.access_token
  const user = await findUser(JWT)

  const { data: history, count } = await supabase
    .from('translations')
    .select('*', { count: 'exact' })
    .eq('code', user.code)

  res.json({ history, count })
}

const getMyTuristProcess = async (req, res = response) => {
  const JWT = req.headers.access_token
  const user = await findUser(JWT)

  const { data: turistProgress, count } = await supabase
    .from('translations')
    .select('*', { count: 'exact' })
    .eq('code', user.code)
    .eq('state', 'PROCESS')

  res.json({ turistProgress, count })
}

const getMyTranslate = async (req, res = response) => {
  const { id } = req.params
  const { data: turistProgress } = await supabase
    .from('translations')
    .select('*')
    .eq('id', id)
  res.json({ turistProgress })
}

module.exports = {
  translationPOST,
  getCompanies,
  getMyRequest,
  acceptTourist,
  getMyTranslations,
  editTranslation,
  getMyHistory,
  getMyTuristProcess,
  getMyTranslate,
  finishTranslate
}

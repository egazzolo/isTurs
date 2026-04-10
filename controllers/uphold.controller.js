const { response } = require('express')
const { findUser } = require('../helpers/findUser')
const supabase = require('../database/config')

const upholdImage = async (req, res = response) => {
  const JWT = req.headers.access_token
  const user = await findUser(JWT)

  try {
    const { image } = req.body
    const base64Data = image.replace(/^data:image\/\w+;base64,/, '')
    const buffer = Buffer.from(base64Data, 'base64')
    const fileName = `profile/${user.id}_${Date.now()}.jpg`

    const { error: uploadError } = await supabase.storage
      .from('photos')
      .upload(fileName, buffer, { contentType: 'image/jpeg', upsert: true })
    if (uploadError) throw uploadError

    const { data: { publicUrl } } = supabase.storage.from('photos').getPublicUrl(fileName)

    const { data: userImage, error } = await supabase
      .from('profiles')
      .update({ profile_img: publicUrl })
      .eq('id', user.id)
      .select('id, name, email, phone, username, role, profile_img, created_at')
      .single()
    if (error) throw error

    res.json(userImage)
  } catch (error) {
    res.status(500).send({ message: 'Error al subir la imagen', error })
  }
}

const editUpholdImage = async (req, res = response) => {
  const JWT = req.headers.access_token
  const user = await findUser(JWT)

  try {
    const { image, id_translation } = req.body
    const base64Data = image.replace(/^data:image\/\w+;base64,/, '')
    const buffer = Buffer.from(base64Data, 'base64')
    const fileName = `translations/${id_translation}_${user.role}_${Date.now()}.jpg`

    const { error: uploadError } = await supabase.storage
      .from('photos')
      .upload(fileName, buffer, { contentType: 'image/jpeg', upsert: true })
    if (uploadError) throw uploadError

    const { data: { publicUrl } } = supabase.storage.from('photos').getPublicUrl(fileName)

    const field = user.role === 'TURIST' ? 'turist_img' : user.role === 'OPERATOR' ? 'operator_img' : null
    if (!field) return res.status(400).send({ message: 'ROL inválido' })

    const { data: imgTranslate, error } = await supabase
      .from('translations')
      .update({ [field]: publicUrl })
      .eq('id', id_translation)
      .select()
      .single()
    if (error) throw error
    return res.json(imgTranslate)
  } catch (error) {
    console.error(error)
    return res.status(500).send({ message: 'Error al subir la imagen', error: error.toString() })
  }
}

module.exports = { upholdImage, editUpholdImage }

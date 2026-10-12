import supabase from '../database/config.ts'
import { base64ToBytes, findUser } from '../helpers/index.ts'

const uploadPhoto = async (fileName: string, image: string) => {
  const { error: uploadError } = await supabase.storage
    .from('photos')
    .upload(fileName, base64ToBytes(image), { contentType: 'image/jpeg', upsert: true })
  if (uploadError) throw uploadError

  const { data: { publicUrl } } = supabase.storage.from('photos').getPublicUrl(fileName)
  return publicUrl
}

export const upholdImage = async (req: any, res: any) => {
  try {
    const user = await findUser(req.headers.access_token)
    const { image } = req.body
    const publicUrl = await uploadPhoto(`profile/${user.id}_${Date.now()}.jpg`, image)

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

export const editUpholdImage = async (req: any, res: any) => {
  try {
    const user = await findUser(req.headers.access_token)
    const { image, id_translation } = req.body

    const field = user.role === 'TURIST' ? 'turist_img' : user.role === 'OPERATOR' ? 'operator_img' : null
    if (!field) return res.status(400).send({ message: 'ROL inválido' })

    const publicUrl = await uploadPhoto(`translations/${id_translation}_${user.role}_${Date.now()}.jpg`, image)

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
    return res.status(500).send({ message: 'Error al subir la imagen', error: String(error) })
  }
}

export const uploadChatImage = async (req: any, res: any) => {
  try {
    const user = await findUser(req.headers.access_token)
    const { image } = req.body
    const imageUrl = await uploadPhoto(`chat/${user.id}_${Date.now()}.jpg`, image)
    res.json({ imageUrl })
  } catch (error) {
    res.status(500).send({ message: 'Error al subir la imagen', error })
  }
}

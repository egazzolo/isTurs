const { findUser } = require('../helpers/findUser')
const supabase = require('../database/config')
const { sendPushNotification } = require('../helpers/firebase')

const createChat = async (req, res) => {
  const { turist_id, transfer_id } = req.body
  try {
    const { data: chat, error } = await supabase
      .from('chats')
      .insert({ turist_id, transfer_id })
      .select()
      .single()
    if (error) throw error
    res.status(201).json(chat)
  } catch (error) {
    console.error('Error creating chat:', error)
    res.status(500).json({ msg: 'Failed to create chat' })
  }
}

const createMessage = async (req, res) => {
  const { chatId, text, imageUrl } = req.body
  const JWT = req.headers.access_token
  const user = await findUser(JWT)
  try {
    const { data: message, error } = await supabase
      .from('messages')
      .insert({ chat_id: chatId, text, image_url: imageUrl, sender_id: user.id })
      .select('*, profiles(id, name, profile_img, role)')
      .single()
    if (error) throw error

    // Find the other participant in the chat to notify them
    const { data: chat } = await supabase
      .from('chats')
      .select('turist_id, transfer_id')
      .eq('id', chatId)
      .single()

    if (chat) {
      // Get the translation to find the operator
      const { data: translation } = await supabase
        .from('translations')
        .select('transfer_id, turist_id')
        .eq('id', chat.transfer_id)
        .single()

      if (translation) {
        // Notify the other person
        const otherUserId = user.id === chat.turist_id
          ? translation.transfer_id
          : chat.turist_id

        const { data: otherUser } = await supabase
          .from('profiles')
          .select('fcm_token, name')
          .eq('id', otherUserId)
          .single()

        if (otherUser?.fcm_token) {
          await sendPushNotification(
            otherUser.fcm_token,
            user.name,
            text || '📷 Photo'
          )
        }
      }
    }

    res.status(201).json(message)
  } catch (error) {
    console.error('Error creating message:', error)
    res.status(500).json({ msg: 'Failed to send message' })
  }
}

const getMessages = async (req, res) => {
  const { chatId } = req.params
  try {
    const { data: messages, error } = await supabase
      .from('messages')
      .select('*, profiles(id, name, profile_img, role)')
      .eq('chat_id', chatId)
      .order('created_at', { ascending: true })
    if (error) throw error
    res.json(messages)
  } catch (error) {
    console.error('Error retrieving messages:', error)
    res.status(500).json({ msg: 'Failed to retrieve messages' })
  }
}

const saveFcmToken = async (req, res) => {
  const { fcmToken } = req.body
  const JWT = req.headers.access_token
  const user = await findUser(JWT)
  try {
    const { error } = await supabase
      .from('profiles')
      .update({ fcm_token: fcmToken })
      .eq('id', user.id)
    if (error) throw error
    res.json({ msg: 'FCM token saved' })
  } catch (error) {
    console.error('Error saving FCM token:', error)
    res.status(500).json({ msg: 'Failed to save FCM token' })
  }
}

module.exports = { createMessage, getMessages, createChat, saveFcmToken }
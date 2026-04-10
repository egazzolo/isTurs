const { findUser } = require('../helpers/findUser')
const supabase = require('../database/config')

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
  const { chatId, text } = req.body
  const JWT = req.headers.access_token
  const user = await findUser(JWT)

  try {
    const { data: message, error } = await supabase
      .from('messages')
      .insert({ chat_id: chatId, text, sender_id: user.id })
      .select('*, profiles(id, name, profile_img, role)')
      .single()
    if (error) throw error
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

module.exports = { createMessage, getMessages, createChat }

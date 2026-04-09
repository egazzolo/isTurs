
const { findUser } = require('../helpers/findUser');
const Chat = require('../models/chats');
const Message = require('../models/message');

const createChat = async (req, res) => {
  const { turist_id, transfer_id } = req.body;
  
  try {
    const chat = new Chat({
      turist_id,
      transfer_id
    });
    await chat.save();
    res.status(201).json(chat);
  } catch (error) {
    console.error('Error creating chat:', error);
    res.status(500).json({ msg: 'Failed to create chat' });
  }
};

const createMessage = async (req, res) => {
  const { chatId, text } = req.body;
  const JWT = req.headers.access_token
  const user = await findUser(JWT)
  
  try {
    const message = new Message({
      chatId,
      message: text,
      user_id: user._id,
      user_name: user.name,
      user_img: user.profile_img,
      user_role: user.role
    });

    console.log(message)

    await message.save();
    res.status(201).json(message);
  } catch (error) {
    console.error('Error creating message:', error);
    res.status(500).json({ msg: 'Failed to send message' });
  }
};

const getMessages = async (req, res) => {
  const { chatId } = req.params;

  try {
    const messages = await Message.find({ chatId }).sort({ createdAt: 1 });
    res.json(messages);
  } catch (error) {
    console.error('Error retrieving messages:', error);
    res.status(500).json({ msg: 'Failed to retrieve messages' });
  }
};


module.exports = {
  createMessage,
  getMessages,
  createChat
}
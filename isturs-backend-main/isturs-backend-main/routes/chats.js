const { Router } = require('express');
const { check } = require('express-validator');
const { validarCampos } = require('../middlewares/validar-campos');
const { createChat, createMessage, getMessages, saveFcmToken } = require('../controllers/chats.controller');
const router = Router();

router.post('/createChat', [
  check('turist_id', 'El turist_id es obligatorio').not().isEmpty(),
  check('transfer_id', 'El transfer_id es obligatorio').not().isEmpty(),
  validarCampos
], createChat);

router.post('/createMessage', [
  check('chatId', 'El chatId es obligatorio').not().isEmpty(),
  validarCampos
], createMessage);

router.get('/messages/:chatId', [
  check('chatId', 'El chatId es obligatorio').not().isEmpty(),
  validarCampos
], getMessages);

router.post('/saveFcmToken', saveFcmToken);

module.exports = router;
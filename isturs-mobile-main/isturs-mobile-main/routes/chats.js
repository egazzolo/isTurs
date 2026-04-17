const { Router } = require('express');
const { check } = require('express-validator');
const { validarCampos } = require('../middlewares/validar-campos');
const { createChat, createMessage, getMessages } = require('../controllers/chats.controller');

const router = Router();

// Ruta para crear un nuevo chat
router.post('/createChat', [
  check('turist_id', 'El turist_id es obligatorio y debe ser un ID válido de MongoDB').isMongoId(),
  check('transfer_id', 'El transfer_id es obligatorio y debe ser un ID válido de MongoDB').isMongoId(),
  validarCampos
], createChat);

// Ruta para enviar un mensaje a un chat
router.post('/createMessage', [
  check('chatId', 'El chatId es obligatorio y debe ser un ID válido de MongoDB').isMongoId(),
  check('text', 'El texto del mensaje no puede estar vacío').not().isEmpty(),
  validarCampos
], createMessage);

// Ruta para obtener mensajes de un chat
router.get('/messages/:chatId', [
  check('chatId', 'El chatId es obligatorio y debe ser un ID válido de MongoDB').isMongoId(),
  validarCampos
], getMessages);

module.exports = router;

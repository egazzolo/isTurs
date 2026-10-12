import { Router } from 'npm:express@4.19.2'
import { check } from 'npm:express-validator@7.0.1'
import { validarCampos, validarJWT } from '../middlewares/index.ts'
import { createChat, createMessage, getMessages, saveFcmToken } from '../controllers/chats.controller.ts'

const router = Router()

router.post('/createChat', [
  validarJWT,
  check('turist_id', 'El turist_id es obligatorio').not().isEmpty(),
  check('transfer_id', 'El transfer_id es obligatorio').not().isEmpty(),
  validarCampos
], createChat)

router.post('/createMessage', [
  validarJWT,
  check('chatId', 'El chatId es obligatorio').not().isEmpty(),
  validarCampos
], createMessage)

router.get('/messages/:chatId', [
  validarJWT,
  check('chatId', 'El chatId es obligatorio').not().isEmpty(),
  validarCampos
], getMessages)

router.post('/saveFcmToken', [
  validarJWT,
  validarCampos
], saveFcmToken)

export default router

import { Router } from 'npm:express@4.19.2'
import { validarCampos, validarJWT } from '../middlewares/index.ts'
import { upholdImage, editUpholdImage, uploadChatImage } from '../controllers/uphold.controller.ts'

const router = Router()

router.post('/upholdImage', [
  validarJWT,
  validarCampos
], upholdImage)

router.post('/editUpholdImage', [
  validarJWT,
  validarCampos
], editUpholdImage)

router.post('/uploadChatImage', [
  validarJWT,
  validarCampos
], uploadChatImage)

export default router

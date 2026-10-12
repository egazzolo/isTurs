import { Router } from 'npm:express@4.19.2'
import { check } from 'npm:express-validator@7.0.1'
import { login, refreshToken } from '../controllers/auth.controller.ts'
import { validarCampos } from '../middlewares/index.ts'

const router = Router()

router.post('/login', [
  check('username', 'El username es obligatorio').not().isEmpty(),
  check('password', 'La contraseña es obligatoria').not().isEmpty(),
  validarCampos
], login)

router.post('/refreshToken', [
  check('token', 'El token es obligatorio').not().isEmpty(),
  validarCampos
], refreshToken)

export default router

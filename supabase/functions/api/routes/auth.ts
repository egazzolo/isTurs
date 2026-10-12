import { Router } from 'npm:express@4.19.2'
import { check } from 'npm:express-validator@7.0.1'
import { login, refreshToken } from '../controllers/auth.controller.ts'
import { tr } from '../helpers/i18n.ts'
import { validarCampos } from '../middlewares/index.ts'

const router = Router()

router.post('/login', [
  check('username', (_v: any, { req }: any) => tr(req, 'usernameRequired')).not().isEmpty(),
  check('password', (_v: any, { req }: any) => tr(req, 'passwordRequired')).not().isEmpty(),
  validarCampos
], login)

router.post('/refreshToken', [
  check('token', 'El token es obligatorio').not().isEmpty(),
  validarCampos
], refreshToken)

export default router

import { Router } from 'npm:express@4.19.2'
import { check } from 'npm:express-validator@7.0.1'
import { userGET, userPOST, userPUT, getByCode, getById, getMyTransfers } from '../controllers/user.controller.ts'
import { validarCampos, validarJWT } from '../middlewares/index.ts'
import { tr } from '../helpers/i18n.ts'
import { validateRole, emailExist, userExist, phoneExist, rucExist, codeExist } from '../helpers/db-validators.ts'

const router = Router()

router.get('/', [
  validarJWT,
  validarCampos
], userGET)

router.post('/', [
  check('name', (_v: any, { req }: any) => tr(req, 'nameRequired')).not().isEmpty(),
  check('password', (_v: any, { req }: any) => tr(req, 'passwordTooShort')).isLength({ min: 6 }),
  check('email').custom(emailExist),
  check('role', (_v: any, { req }: any) => tr(req, 'invalidRole')).not().isEmpty(),
  check('role').custom(validateRole),
  check('username', (_v: any, { req }: any) => tr(req, 'usernameRequired')).not().isEmpty(),
  check('username').custom(userExist),
  check('phone').custom(phoneExist),
  check('ruc').custom(rucExist),
  check('code').custom(codeExist),
  validarCampos
], userPOST)

router.put('/:id', [
  validarJWT,
  check('id', 'No es un ID válido').isUUID(),
  validarCampos
], userPUT)

router.get('/getByCode/:code', [
  validarJWT,
  check('code', 'El campo "code" es obligatorio').not().isEmpty(),
  validarCampos
], getByCode)

router.get('/getById/:id', [
  validarJWT,
  check('id', 'El campo "id" es obligatorio').not().isEmpty(),
  validarCampos
], getById)

router.get('/getMyTransfers', [
  validarJWT,
  validarCampos
], getMyTransfers)

export default router

import { Router } from 'npm:express@4.19.2'
import { check } from 'npm:express-validator@7.0.1'
import { userGET, userPOST, userPUT, getByCode, getById, getMyTransfers } from '../controllers/user.controller.ts'
import { validarCampos, validarJWT } from '../middlewares/index.ts'
import { validateRole, emailExist, userExist, phoneExist, rucExist, codeExist } from '../helpers/db-validators.ts'

const router = Router()

router.get('/', [
  validarJWT,
  validarCampos
], userGET)

router.post('/', [
  check('name', 'El campo "name" es obligatorio').not().isEmpty(),
  check('password', 'El campo "password" debe ser mayor a 6 caracteres').isLength({ min: 6 }),
  check('email', 'El campo "email" no es válido').custom(emailExist),
  check('role', 'El campo "role" es obligatorio').not().isEmpty(),
  check('role', 'No es un rol permitido').custom(validateRole),
  check('username', 'El campo "username" es obligatorio').not().isEmpty(),
  check('username', 'El username no es válido').custom(userExist),
  check('phone', 'No es un teléfono permitido').custom(phoneExist),
  check('ruc', 'No es un RUC permitido').custom(rucExist),
  check('code', 'No es un Code permitido').custom(codeExist),
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

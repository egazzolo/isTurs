import { Router } from 'npm:express@4.19.2'
import { check } from 'npm:express-validator@7.0.1'
import { validarCampos, validarJWT } from '../middlewares/index.ts'
import {
  translationPOST,
  getCompanies,
  getMyRequest,
  acceptTourist,
  getMyTranslations,
  editTranslation,
  getMyHistory,
  getMyTuristProcess,
  getMyTranslate,
  finishTranslate
} from '../controllers/translation.controller.ts'
import { codeExist } from '../helpers/db-validators.ts'

const router = Router()

router.post('/postTranslation', [
  validarJWT,
  check('code', 'El campo "code" es obligatorio').not().isEmpty(),
  check('code', 'No es un Code permitido').custom(codeExist),
  validarCampos
], translationPOST)

router.get('/getCompanies/:type', [
  validarJWT,
  check('type', 'El parametro "type" es obligatorio').not().isEmpty(),
  validarCampos
], getCompanies)

router.get('/getMyRequest', [
  validarJWT,
  validarCampos
], getMyRequest)

router.get('/getMyHistory', [
  validarJWT,
  validarCampos
], getMyHistory)

router.get('/myTranslations', [
  validarJWT,
  validarCampos
], getMyTranslations)

router.get('/getMyTuristProcess', [
  validarJWT,
  validarCampos
], getMyTuristProcess)

router.get('/getMyTranslate/:id', [
  validarJWT,
  validarCampos
], getMyTranslate)

router.post('/acceptTourist', [
  validarJWT,
  check('id_translation', 'El campo "id_translation" es obligatorio').not().isEmpty(),
  check('id_translation', 'El campo "id_translation" no es un id valido').isUUID(),
  validarCampos
], acceptTourist)

router.put('/editTranslation', [
  validarJWT,
  check('id_translation', 'El campo "id_translation" es obligatorio').not().isEmpty(),
  check('id_translation', 'El campo "id_translation" no es un id valido').isUUID(),
  validarCampos
], editTranslation)

router.post('/finishTranslate', [
  validarJWT,
  check('id_translation', 'El campo "id_translation" es obligatorio').not().isEmpty(),
  check('id_translation', 'El campo "id_translation" no es un id valido').isUUID(),
  validarCampos
], finishTranslate)

export default router

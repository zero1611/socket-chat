const {renovarToken} = require("../controllers/auth");
const {validarJwt} = require("../middlewares/validar-jwt");
const {googleSignin} = require("../controllers/auth");
const {validarCampos} = require("../middlewares/validar-campos");
const {Router} = require('express');
const {check} = require("express-validator");
const {login} = require('../controllers/auth')
const router = Router();

router.post('/login', [
    check('correo', 'El correo es obligatorio').isEmail(),
    check('password', 'La contrasena es obligatoria').not().isEmpty(),
    validarCampos
],login);
router.post('/google', [
    check('id_token', 'El id_token es necesario').not().isEmpty(),
    validarCampos
],googleSignin);

router.get('/', validarJwt, renovarToken);

module.exports = router;
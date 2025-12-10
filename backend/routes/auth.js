const express = require('express');
const router = express.Router();
const authController = require('../controllers/authController');
const { validarRegistro, validarLogin } = require('../middleware/validaciones');
const { verificarToken } = require('../middleware/auth');

// Registro
router.post('/registro', validarRegistro, authController.registrar);

// Login
router.post('/login', validarLogin, authController.login);

// Verificar sesión
router.get('/verificar', verificarToken, authController.verificarSesion);

module.exports = router;
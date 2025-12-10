const express = require('express');
const router = express.Router();
const usuariosController = require('../controllers/usuariosController');
const { verificarToken, verificarAdmin } = require('../middleware/auth');
const { validarFondos } = require('../middleware/validaciones');

// Rutas de usuario autenticado
router.get('/perfil', verificarToken, usuariosController.obtenerPerfil);
router.put('/perfil', verificarToken, usuariosController.actualizarPerfil);
router.post('/fondos', verificarToken, validarFondos, usuariosController.agregarFondos);
router.get('/historial', verificarToken, usuariosController.obtenerHistorial);

// Rutas de administrador
router.get('/', verificarToken, verificarAdmin, usuariosController.obtenerTodosUsuarios);
router.delete('/:id', verificarToken, verificarAdmin, usuariosController.eliminarUsuario);
router.put('/:id/rol', verificarToken, verificarAdmin, usuariosController.cambiarRol);

module.exports = router;
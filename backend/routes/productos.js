const express = require('express');
const router = express.Router();
const productosController = require('../controllers/productosController');
const { verificarToken, verificarAdmin } = require('../middleware/auth');
const { validarProducto } = require('../middleware/validaciones');

// Rutas públicas
router.get('/', productosController.obtenerProductos);
router.get('/disponibles', productosController.obtenerProductosDisponibles);
router.get('/:id', productosController.obtenerProductoPorId);

// Rutas de administrador
router.post('/', verificarToken, verificarAdmin, validarProducto, productosController.crearProducto);
router.put('/:id', verificarToken, verificarAdmin, validarProducto, productosController.actualizarProducto);
router.delete('/:id', verificarToken, verificarAdmin, productosController.eliminarProducto);

module.exports = router;
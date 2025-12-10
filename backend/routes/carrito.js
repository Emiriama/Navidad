const express = require('express');
const router = express.Router();
const carritoController = require('../controllers/carritoController');
const { verificarToken } = require('../middleware/auth');
const { validarCarrito } = require('../middleware/validaciones');

// Todas las rutas requieren autenticación
router.use(verificarToken);

// Obtener carrito
router.get('/', carritoController.obtenerCarrito);

// Agregar al carrito
router.post('/', validarCarrito, carritoController.agregarAlCarrito);

// Actualizar cantidad
router.put('/:id_carrito', carritoController.actualizarCantidad);

// Eliminar del carrito
router.delete('/:id_carrito', carritoController.eliminarDelCarrito);

// Vaciar carrito
router.delete('/', carritoController.vaciarCarrito);

// Procesar compra
router.post('/comprar', carritoController.procesarCompra);

module.exports = router;
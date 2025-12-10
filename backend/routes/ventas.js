const express = require('express');
const router = express.Router();
const ventasController = require('../controllers/ventasController');
const { verificarToken, verificarAdmin } = require('../middleware/auth');

// Ruta de usuario - obtener ticket
router.get('/ticket/:numero_venta', verificarToken, ventasController.obtenerTicket);

// Rutas de administrador
router.get('/', verificarToken, verificarAdmin, ventasController.obtenerTodasVentas);
router.get('/fecha', verificarToken, verificarAdmin, ventasController.obtenerVentasPorFecha);
router.get('/estadisticas', verificarToken, verificarAdmin, ventasController.obtenerEstadisticas);
router.get('/usuario/:id_usuario', verificarToken, verificarAdmin, ventasController.obtenerVentasPorUsuario);

module.exports = router;
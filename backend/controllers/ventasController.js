const db = require('../config/database');

// Obtener ticket de venta
exports.obtenerTicket = async (req, res) => {
  const { numero_venta } = req.params;
  const id_usuario = req.usuario.id;

  try {
    const [ventas] = await db.query(
      'SELECT * FROM ventas WHERE numero_venta = ? AND id_usuario = ?',
      [numero_venta, id_usuario]
    );

    if (ventas.length === 0) {
      return res.status(404).json({ error: 'Venta no encontrada' });
    }

    res.json({
      negocio: '🎄 Panadería Navideña',
      venta: ventas[0]
    });
  } catch (error) {
    console.error('Error al obtener ticket:', error);
    res.status(500).json({ error: 'Error al obtener ticket' });
  }
};

// Admin - Obtener todas las ventas
exports.obtenerTodasVentas = async (req, res) => {
  try {
    const [ventas] = await db.query(`
      SELECT v.*, u.nombre_usuario, u.email
      FROM ventas v
      INNER JOIN usuarios u ON v.id_usuario = u.id_usuario
      ORDER BY v.fecha_compra DESC
    `);

    res.json(ventas);
  } catch (error) {
    console.error('Error al obtener ventas:', error);
    res.status(500).json({ error: 'Error al obtener ventas' });
  }
};

// Admin - Obtener ventas por fecha
exports.obtenerVentasPorFecha = async (req, res) => {
  const { fecha_inicio, fecha_fin } = req.query;

  try {
    let query = `
      SELECT v.*, u.nombre_usuario, u.email
      FROM ventas v
      INNER JOIN usuarios u ON v.id_usuario = u.id_usuario
    `;
    const params = [];

    if (fecha_inicio && fecha_fin) {
      query += ' WHERE DATE(v.fecha_compra) BETWEEN ? AND ?';
      params.push(fecha_inicio, fecha_fin);
    } else if (fecha_inicio) {
      query += ' WHERE DATE(v.fecha_compra) >= ?';
      params.push(fecha_inicio);
    } else if (fecha_fin) {
      query += ' WHERE DATE(v.fecha_compra) <= ?';
      params.push(fecha_fin);
    }

    query += ' ORDER BY v.fecha_compra DESC';

    const [ventas] = await db.query(query, params);
    res.json(ventas);
  } catch (error) {
    console.error('Error al obtener ventas por fecha:', error);
    res.status(500).json({ error: 'Error al obtener ventas por fecha' });
  }
};

// Admin - Obtener estadísticas
exports.obtenerEstadisticas = async (req, res) => {
  try {
    // Total de ventas
    const [totalVentas] = await db.query('SELECT COUNT(*) as total FROM ventas');
    
    // Total de ingresos
    const [totalIngresos] = await db.query('SELECT SUM(total) as ingresos FROM ventas');
    
    // Ventas hoy
    const [ventasHoy] = await db.query(
      'SELECT COUNT(*) as total FROM ventas WHERE DATE(fecha_compra) = CURDATE()'
    );
    
    // Ventas por mes
    const [ventasPorMes] = await db.query(`
      SELECT 
        DATE_FORMAT(fecha_compra, '%Y-%m') as mes,
        COUNT(*) as cantidad,
        SUM(total) as ingresos
      FROM ventas
      GROUP BY mes
      ORDER BY mes DESC
      LIMIT 12
    `);

    // Top productos más vendidos (necesitaría tabla detalle_venta)
    
    res.json({
      total_ventas: totalVentas[0].total,
      total_ingresos: parseFloat(totalIngresos[0].ingresos || 0).toFixed(2),
      ventas_hoy: ventasHoy[0].total,
      ventas_por_mes: ventasPorMes
    });
  } catch (error) {
    console.error('Error al obtener estadísticas:', error);
    res.status(500).json({ error: 'Error al obtener estadísticas' });
  }
};

// Admin - Obtener ventas por usuario
exports.obtenerVentasPorUsuario = async (req, res) => {
  const { id_usuario } = req.params;

  try {
    const [ventas] = await db.query(
      'SELECT * FROM ventas WHERE id_usuario = ? ORDER BY fecha_compra DESC',
      [id_usuario]
    );

    res.json(ventas);
  } catch (error) {
    console.error('Error al obtener ventas del usuario:', error);
    res.status(500).json({ error: 'Error al obtener ventas del usuario' });
  }
};
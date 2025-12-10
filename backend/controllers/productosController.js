const db = require('../config/database');

// Obtener todos los productos
exports.obtenerProductos = async (req, res) => {
  try {
    const [productos] = await db.query('SELECT * FROM productos ORDER BY nombre');
    res.json(productos);
  } catch (error) {
    console.error('Error al obtener productos:', error);
    res.status(500).json({ error: 'Error al obtener productos' });
  }
};

// Obtener producto por ID
exports.obtenerProductoPorId = async (req, res) => {
  const { id } = req.params;

  try {
    const [productos] = await db.query('SELECT * FROM productos WHERE id_producto = ?', [id]);

    if (productos.length === 0) {
      return res.status(404).json({ error: 'Producto no encontrado' });
    }

    res.json(productos[0]);
  } catch (error) {
    console.error('Error al obtener producto:', error);
    res.status(500).json({ error: 'Error al obtener producto' });
  }
};

// Crear producto (Admin)
exports.crearProducto = async (req, res) => {
  const { nombre, descripcion, precio, stock, imagen_url } = req.body;

  try {
    const [resultado] = await db.query(
      'INSERT INTO productos (nombre, descripcion, precio, stock, imagen_url) VALUES (?, ?, ?, ?, ?)',
      [nombre, descripcion, precio, stock, imagen_url || null]
    );

    res.status(201).json({
      mensaje: 'Producto creado exitosamente',
      id_producto: resultado.insertId
    });
  } catch (error) {
    console.error('Error al crear producto:', error);
    res.status(500).json({ error: 'Error al crear producto' });
  }
};

// Actualizar producto (Admin)
exports.actualizarProducto = async (req, res) => {
  const { id } = req.params;
  const { nombre, descripcion, precio, stock, imagen_url } = req.body;

  try {
    const [resultado] = await db.query(
      'UPDATE productos SET nombre = ?, descripcion = ?, precio = ?, stock = ?, imagen_url = ? WHERE id_producto = ?',
      [nombre, descripcion, precio, stock, imagen_url || null, id]
    );

    if (resultado.affectedRows === 0) {
      return res.status(404).json({ error: 'Producto no encontrado' });
    }

    res.json({ mensaje: 'Producto actualizado exitosamente' });
  } catch (error) {
    console.error('Error al actualizar producto:', error);
    res.status(500).json({ error: 'Error al actualizar producto' });
  }
};

// Eliminar producto (Admin)
exports.eliminarProducto = async (req, res) => {
  const { id } = req.params;

  try {
    const [resultado] = await db.query('DELETE FROM productos WHERE id_producto = ?', [id]);

    if (resultado.affectedRows === 0) {
      return res.status(404).json({ error: 'Producto no encontrado' });
    }

    res.json({ mensaje: 'Producto eliminado exitosamente' });
  } catch (error) {
    console.error('Error al eliminar producto:', error);
    res.status(500).json({ error: 'Error al eliminar producto' });
  }
};

// Obtener productos disponibles (stock > 0)
exports.obtenerProductosDisponibles = async (req, res) => {
  try {
    const [productos] = await db.query('SELECT * FROM productos WHERE stock > 0 ORDER BY nombre');
    res.json(productos);
  } catch (error) {
    console.error('Error al obtener productos disponibles:', error);
    res.status(500).json({ error: 'Error al obtener productos disponibles' });
  }
};
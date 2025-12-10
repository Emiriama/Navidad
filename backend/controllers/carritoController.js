const db = require('../config/database');

// Obtener carrito del usuario
exports.obtenerCarrito = async (req, res) => {
  const id_usuario = req.usuario.id;

  try {
    const [items] = await db.query(`
      SELECT c.*, p.nombre, p.descripcion, p.precio, p.imagen_url, p.stock
      FROM carrito c
      INNER JOIN productos p ON c.id_producto = p.id_producto
      WHERE c.id_usuario = ?
    `, [id_usuario]);

    const total = items.reduce((sum, item) => sum + (item.precio * item.cantidad), 0);

    res.json({
      items,
      total: parseFloat(total.toFixed(2))
    });
  } catch (error) {
    console.error('Error al obtener carrito:', error);
    res.status(500).json({ error: 'Error al obtener carrito' });
  }
};

// Agregar producto al carrito
exports.agregarAlCarrito = async (req, res) => {
  const { id_producto, cantidad } = req.body;
  const id_usuario = req.usuario.id;

  try {
    // Verificar que el producto existe y hay stock
    const [productos] = await db.query(
      'SELECT stock FROM productos WHERE id_producto = ?',
      [id_producto]
    );

    if (productos.length === 0) {
      return res.status(404).json({ error: 'Producto no encontrado' });
    }

    if (productos[0].stock < cantidad) {
      return res.status(400).json({ error: 'Stock insuficiente' });
    }

    // Verificar si ya existe en el carrito
    const [itemsExistentes] = await db.query(
      'SELECT * FROM carrito WHERE id_usuario = ? AND id_producto = ?',
      [id_usuario, id_producto]
    );

    if (itemsExistentes.length > 0) {
      // Actualizar cantidad
      const nuevaCantidad = itemsExistentes[0].cantidad + cantidad;

      if (productos[0].stock < nuevaCantidad) {
        return res.status(400).json({ error: 'Stock insuficiente para la cantidad solicitada' });
      }

      await db.query(
        'UPDATE carrito SET cantidad = ? WHERE id_carrito = ?',
        [nuevaCantidad, itemsExistentes[0].id_carrito]
      );
    } else {
      // Insertar nuevo item
      await db.query(
        'INSERT INTO carrito (id_usuario, id_producto, cantidad) VALUES (?, ?, ?)',
        [id_usuario, id_producto, cantidad]
      );
    }

    res.json({ mensaje: 'Producto agregado al carrito' });
  } catch (error) {
    console.error('Error al agregar al carrito:', error);
    res.status(500).json({ error: 'Error al agregar producto al carrito' });
  }
};

// Actualizar cantidad en carrito
exports.actualizarCantidad = async (req, res) => {
  const { id_carrito } = req.params;
  const { cantidad } = req.body;
  const id_usuario = req.usuario.id;

  try {
    // Verificar que el item pertenece al usuario
    const [items] = await db.query(
      'SELECT c.*, p.stock FROM carrito c INNER JOIN productos p ON c.id_producto = p.id_producto WHERE c.id_carrito = ? AND c.id_usuario = ?',
      [id_carrito, id_usuario]
    );

    if (items.length === 0) {
      return res.status(404).json({ error: 'Item no encontrado en el carrito' });
    }

    if (items[0].stock < cantidad) {
      return res.status(400).json({ error: 'Stock insuficiente' });
    }

    await db.query(
      'UPDATE carrito SET cantidad = ? WHERE id_carrito = ?',
      [cantidad, id_carrito]
    );

    res.json({ mensaje: 'Cantidad actualizada' });
  } catch (error) {
    console.error('Error al actualizar cantidad:', error);
    res.status(500).json({ error: 'Error al actualizar cantidad' });
  }
};

// Eliminar item del carrito
exports.eliminarDelCarrito = async (req, res) => {
  const { id_carrito } = req.params;
  const id_usuario = req.usuario.id;

  try {
    const [resultado] = await db.query(
      'DELETE FROM carrito WHERE id_carrito = ? AND id_usuario = ?',
      [id_carrito, id_usuario]
    );

    if (resultado.affectedRows === 0) {
      return res.status(404).json({ error: 'Item no encontrado en el carrito' });
    }

    res.json({ mensaje: 'Producto eliminado del carrito' });
  } catch (error) {
    console.error('Error al eliminar del carrito:', error);
    res.status(500).json({ error: 'Error al eliminar producto del carrito' });
  }
};

// Vaciar carrito
exports.vaciarCarrito = async (req, res) => {
  const id_usuario = req.usuario.id;

  try {
    await db.query('DELETE FROM carrito WHERE id_usuario = ?', [id_usuario]);
    res.json({ mensaje: 'Carrito vaciado' });
  } catch (error) {
    console.error('Error al vaciar carrito:', error);
    res.status(500).json({ error: 'Error al vaciar carrito' });
  }
};

// Procesar compra
exports.procesarCompra = async (req, res) => {
  const id_usuario = req.usuario.id;
  const connection = await db.getConnection();

  try {
    await connection.beginTransaction();

    // Obtener items del carrito
    const [items] = await connection.query(`
      SELECT c.*, p.precio, p.stock, p.nombre
      FROM carrito c
      INNER JOIN productos p ON c.id_producto = p.id_producto
      WHERE c.id_usuario = ?
    `, [id_usuario]);

    if (items.length === 0) {
      await connection.rollback();
      return res.status(400).json({ error: 'El carrito está vacío' });
    }

    // Calcular total
    const total = items.reduce((sum, item) => sum + (item.precio * item.cantidad), 0);

    // Verificar fondos
    const [usuarios] = await connection.query(
      'SELECT fondos FROM usuarios WHERE id_usuario = ?',
      [id_usuario]
    );

    if (usuarios[0].fondos < total) {
      await connection.rollback();
      return res.status(400).json({ error: 'Fondos insuficientes' });
    }

    // Verificar stock de todos los productos
    for (const item of items) {
      if (item.stock < item.cantidad) {
        await connection.rollback();
        return res.status(400).json({ error: `Stock insuficiente para ${item.nombre}` });
      }
    }

    // Generar número de venta único
    const numero_venta = `V${Date.now()}${id_usuario}`;

    // Crear venta
    const [venta] = await connection.query(
      'INSERT INTO ventas (numero_venta, id_usuario, total) VALUES (?, ?, ?)',
      [numero_venta, id_usuario, total]
    );

    // Actualizar stock de productos
    for (const item of items) {
      await connection.query(
        'UPDATE productos SET stock = stock - ? WHERE id_producto = ?',
        [item.cantidad, item.id_producto]
      );
    }

    // Descontar fondos
    await connection.query(
      'UPDATE usuarios SET fondos = fondos - ? WHERE id_usuario = ?',
      [total, id_usuario]
    );

    // Vaciar carrito
    await connection.query('DELETE FROM carrito WHERE id_usuario = ?', [id_usuario]);

    await connection.commit();

    res.json({
      mensaje: 'Compra realizada exitosamente',
      numero_venta,
      id_venta: venta.insertId,
      total
    });

  } catch (error) {
    await connection.rollback();
    console.error('Error al procesar compra:', error);
    res.status(500).json({ error: 'Error al procesar la compra' });
  } finally {
    connection.release();
  }
};
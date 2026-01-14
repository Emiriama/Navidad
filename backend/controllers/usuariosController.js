const db = require('../config/database');
const bcrypt = require('bcryptjs');

// Obtener perfil del usuario
exports.obtenerPerfil = async (req, res) => {
  const id_usuario = req.usuario.id;

  try {
    const [usuarios] = await db.query(
      'SELECT id_usuario, nombre_usuario, email as correo, rol, saldo as fondos, fecha_creacion as fecha_registro FROM usuarios WHERE id_usuario = ?',
      [id_usuario]
    );

    if (usuarios.length === 0) {
      return res.status(404).json({ error: 'Usuario no encontrado' });
    }

    res.json(usuarios[0]);
  } catch (error) {
    console.error('Error al obtener perfil:', error);
    res.status(500).json({ error: 'Error al obtener perfil' });
  }
};

// Agregar fondos
exports.agregarFondos = async (req, res) => {
  const id_usuario = req.usuario.id;
  const { monto } = req.body;

  try {
    // Obtener fondos actuales
    const [usuarios] = await db.query(
      'SELECT saldo FROM usuarios WHERE id_usuario = ?',
      [id_usuario]
    );

    const fondosActuales = parseFloat(usuarios[0].saldo);
    const nuevosFondos = fondosActuales + parseFloat(monto);

    if (nuevosFondos > 999999999999) {
      return res.status(400).json({ error: 'No se pueden agregar más de 999,999,999,999 pesos' });
    }

    await db.query(
      'UPDATE usuarios SET saldo = ? WHERE id_usuario = ?',
      [nuevosFondos, id_usuario]
    );

    res.json({ 
      mensaje: 'Fondos agregados exitosamente',
      fondos: nuevosFondos
    });
  } catch (error) {
    console.error('Error al agregar fondos:', error);
    res.status(500).json({ error: 'Error al agregar fondos' });
  }
};

// Obtener historial de compras
exports.obtenerHistorial = async (req, res) => {
  const id_usuario = req.usuario.id;

  try {
    const [compras] = await db.query(
      'SELECT * FROM ventas WHERE id_usuario = ? ORDER BY fecha_compra DESC',
      [id_usuario]
    );

    res.json(compras);
  } catch (error) {
    console.error('Error al obtener historial:', error);
    res.status(500).json({ error: 'Error al obtener historial de compras' });
  }
};

// Actualizar perfil
exports.actualizarPerfil = async (req, res) => {
  const id_usuario = req.usuario.id;
  const { correo, contrasena } = req.body;

  try {
    let query = 'UPDATE usuarios SET';
    const params = [];

    if (correo) {
      query += ' email = ?';
      params.push(correo);
    }

    if (contrasena) {
      const salt = await bcrypt.genSalt(10);
      const contrasenaHash = await bcrypt.hash(contrasena, salt);
      
      if (params.length > 0) query += ',';
      query += ' password = ?';
      params.push(contrasenaHash);
    }

    if (params.length === 0) {
      return res.status(400).json({ error: 'No hay datos para actualizar' });
    }

    query += ' WHERE id_usuario = ?';
    params.push(id_usuario);

    await db.query(query, params);

    res.json({ mensaje: 'Perfil actualizado exitosamente' });
  } catch (error) {
    console.error('Error al actualizar perfil:', error);
    res.status(500).json({ error: 'Error al actualizar perfil' });
  }
};

// CRUD Admin - Obtener todos los usuarios
exports.obtenerTodosUsuarios = async (req, res) => {
  try {
    const [usuarios] = await db.query(
      'SELECT id_usuario, nombre_usuario, email as correo, rol, saldo as fondos, fecha_creacion as fecha_registro FROM usuarios ORDER BY fecha_creacion DESC'
    );
    res.json(usuarios);
  } catch (error) {
    console.error('Error al obtener usuarios:', error);
    res.status(500).json({ error: 'Error al obtener usuarios' });
  }
};

// CRUD Admin - Eliminar usuario
exports.eliminarUsuario = async (req, res) => {
  const { id } = req.params;

  // No permitir que el admin se elimine a sí mismo
  if (parseInt(id) === req.usuario.id) {
    return res.status(400).json({ error: 'No puedes eliminar tu propia cuenta' });
  }

  try {
    const [resultado] = await db.query('DELETE FROM usuarios WHERE id_usuario = ?', [id]);

    if (resultado.affectedRows === 0) {
      return res.status(404).json({ error: 'Usuario no encontrado' });
    }

    res.json({ mensaje: 'Usuario eliminado exitosamente' });
  } catch (error) {
    console.error('Error al eliminar usuario:', error);
    res.status(500).json({ error: 'Error al eliminar usuario' });
  }
};

// CRUD Admin - Cambiar rol
exports.cambiarRol = async (req, res) => {
  const { id } = req.params;
  const { rol } = req.body;

  if (!['cliente', 'administrador'].includes(rol)) {
    return res.status(400).json({ error: 'Rol inválido' });
  }

  try {
    await db.query('UPDATE usuarios SET rol = ? WHERE id_usuario = ?', [rol, id]);
    res.json({ mensaje: 'Rol actualizado exitosamente' });
  } catch (error) {
    console.error('Error al cambiar rol:', error);
    res.status(500).json({ error: 'Error al cambiar rol' });
  }
};

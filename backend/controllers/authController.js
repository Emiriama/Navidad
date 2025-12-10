const bcrypt = require('bcryptjs');
const jwt = require('jsonwebtoken');
const db = require('../config/database');

// Registrar usuario
exports.registrar = async (req, res) => {
  const { nombre_usuario, correo, contrasena } = req.body;

  try {
    // Verificar si el usuario ya existe
    const [usuarios] = await db.query(
      'SELECT id_usuario FROM usuarios WHERE nombre_usuario = ? OR correo = ?',
      [nombre_usuario, correo]
    );

    if (usuarios.length > 0) {
      return res.status(400).json({ error: 'El usuario o correo ya existe' });
    }

    // Encriptar contraseña
    const salt = await bcrypt.genSalt(10);
    const contrasenaHash = await bcrypt.hash(contrasena, salt);

    // Insertar usuario
    const [resultado] = await db.query(
      'INSERT INTO usuarios (nombre_usuario, correo, contrasena, rol, fondos) VALUES (?, ?, ?, ?, ?)',
      [nombre_usuario, correo, contrasenaHash, 'cliente', 0]
    );

    res.status(201).json({
      mensaje: 'Usuario registrado exitosamente',
      id_usuario: resultado.insertId
    });

  } catch (error) {
    console.error('Error al registrar:', error);
    res.status(500).json({ error: 'Error al registrar usuario' });
  }
};

// Iniciar sesión
exports.login = async (req, res) => {
  const { nombre_usuario, contrasena } = req.body;

  try {
    // Buscar usuario
    const [usuarios] = await db.query(
      'SELECT * FROM usuarios WHERE nombre_usuario = ?',
      [nombre_usuario]
    );

    if (usuarios.length === 0) {
      return res.status(401).json({ error: 'Credenciales inválidas' });
    }

    const usuario = usuarios[0];

    // Verificar contraseña
    const contrasenaValida = await bcrypt.compare(contrasena, usuario.contrasena);

    if (!contrasenaValida) {
      return res.status(401).json({ error: 'Credenciales inválidas' });
    }

    // Generar token JWT
    const token = jwt.sign(
      { 
        id: usuario.id_usuario, 
        nombre_usuario: usuario.nombre_usuario,
        rol: usuario.rol 
      },
      process.env.JWT_SECRET,
      { expiresIn: '24h' }
    );

    res.json({
      mensaje: 'Inicio de sesión exitoso',
      token,
      usuario: {
        id: usuario.id_usuario,
        nombre_usuario: usuario.nombre_usuario,
        correo: usuario.correo,
        rol: usuario.rol,
        fondos: usuario.fondos
      }
    });

  } catch (error) {
    console.error('Error al iniciar sesión:', error);
    res.status(500).json({ error: 'Error al iniciar sesión' });
  }
};

// Verificar sesión
exports.verificarSesion = async (req, res) => {
  try {
    const [usuarios] = await db.query(
      'SELECT id_usuario, nombre_usuario, correo, rol, fondos FROM usuarios WHERE id_usuario = ?',
      [req.usuario.id]
    );

    if (usuarios.length === 0) {
      return res.status(404).json({ error: 'Usuario no encontrado' });
    }

    res.json({ usuario: usuarios[0] });

  } catch (error) {
    console.error('Error al verificar sesión:', error);
    res.status(500).json({ error: 'Error al verificar sesión' });
  }
};
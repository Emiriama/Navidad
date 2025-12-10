const { body, validationResult } = require('express-validator');

// Validar errores
const validarResultado = (req, res, next) => {
  const errores = validationResult(req);
  if (!errores.isEmpty()) {
    return res.status(400).json({ errores: errores.array() });
  }
  next();
};

// Validaciones de registro
const validarRegistro = [
  body('nombre_usuario')
    .trim()
    .isLength({ min: 3, max: 50 })
    .withMessage('El nombre de usuario debe tener entre 3 y 50 caracteres')
    .matches(/^[a-zA-Z0-9_]+$/)
    .withMessage('El nombre de usuario solo puede contener letras, números y guiones bajos'),
  
  body('correo')
    .trim()
    .isEmail()
    .withMessage('Correo electrónico inválido')
    .normalizeEmail(),
  
  body('contrasena')
    .isLength({ min: 6, max: 100 })
    .withMessage('La contraseña debe tener entre 6 y 100 caracteres'),
  
  validarResultado
];

// Validaciones de login
const validarLogin = [
  body('nombre_usuario')
    .trim()
    .notEmpty()
    .withMessage('El nombre de usuario es requerido'),
  
  body('contrasena')
    .notEmpty()
    .withMessage('La contraseña es requerida'),
  
  validarResultado
];

// Validaciones de producto
const validarProducto = [
  body('nombre')
    .trim()
    .isLength({ min: 3, max: 100 })
    .withMessage('El nombre del producto debe tener entre 3 y 100 caracteres'),
  
  body('descripcion')
    .trim()
    .isLength({ max: 500 })
    .withMessage('La descripción no puede exceder 500 caracteres'),
  
  body('precio')
    .isFloat({ min: 0.01, max: 999999 })
    .withMessage('El precio debe estar entre 0.01 y 999,999'),
  
  body('stock')
    .isInt({ min: 0, max: 999999 })
    .withMessage('El stock debe estar entre 0 y 999,999'),
  
  validarResultado
];

// Validaciones de fondos
const validarFondos = [
  body('monto')
    .isFloat({ min: 0.01, max: 999999999999 })
    .withMessage('El monto debe estar entre 0.01 y 999,999,999,999'),
  
  validarResultado
];

// Validaciones de carrito
const validarCarrito = [
  body('id_producto')
    .isInt({ min: 1 })
    .withMessage('ID de producto inválido'),
  
  body('cantidad')
    .isInt({ min: 1, max: 999 })
    .withMessage('La cantidad debe estar entre 1 y 999'),
  
  validarResultado
];

module.exports = {
  validarRegistro,
  validarLogin,
  validarProducto,
  validarFondos,
  validarCarrito
};
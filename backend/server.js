require('dotenv').config(); 
const express = require('express');
const cors = require('cors');
const app = express();

// Middleware
app.use(cors({
    origin: ['http://localhost:8000', 'http://127.0.0.1:8000', process.env.FRONTEND_URL || 'http://localhost:5500'],
    credentials: true
}));
app.use(express.json());
app.use(express.urlencoded({ extended: true }));

// Importar rutas (esto cargará database.js DESPUÉS de que dotenv esté configurado)
const productRoutes = require('./routes/productos');
const authRoutes = require('./routes/auth');
const cartRoutes = require('./routes/carrito');
const userRoutes = require('./routes/usuarios');
const ventasRoutes = require('./routes/ventas');

// Usar rutas
app.use('/api/productos', productRoutes);
app.use('/api/auth', authRoutes);
app.use('/api/carrito', cartRoutes);
app.use('/api/usuarios', userRoutes);
app.use('/api/ventas', ventasRoutes);

// Ruta raíz
app.get('/', (req, res) => {
    res.json({ 
        mensaje: '🎄 API Panadería Navideña funcionando',
        rutas: {
            productos: '/api/productos',
            login: '/api/auth/login',
            registro: '/api/auth/registro',
            carrito: '/api/carrito',
            usuarios: '/api/usuarios',
            ventas: '/api/ventas'
        }
    });
});

// Manejador de errores
app.use((err, req, res, next) => {
    console.error(err.stack);
    res.status(500).json({ 
        error: 'Error en el servidor',
        mensaje: err.message 
    });
});

// Manejador 404
app.use((req, res) => {
    res.status(404).json({ 
        error: 'Ruta no encontrada',
        ruta: req.url 
    });
});

const PORT = process.env.PORT || 3000;
app.listen(PORT, () => {
    // CORREGIDO: Comillas invertidas correctas para template literals
    console.log(`Servidor corriendo en http://localhost:${PORT}`);
});

module.exports = app;
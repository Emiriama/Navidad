require('dotenv').config(); 
const express = require('express');
const cors = require('cors');
const path = require('path');

const app = express();

// Middleware CORS
app.use(cors({
    origin: [
        'http://localhost:8000', 
        'http://127.0.0.1:8000',
        'https://panaderia-backend-b8eu.onrender.com'
    ],
    credentials: true
}));

app.use(express.json());
app.use(express.urlencoded({ extended: true }));

// Servir archivos estáticos del frontend
app.use(express.static(path.join(__dirname, '../frontend')));

// Importar rutas
const productRoutes = require('./routes/productos');
const authRoutes = require('./routes/auth');
const cartRoutes = require('./routes/carrito');
const userRoutes = require('./routes/usuarios');
const ventasRoutes = require('./routes/ventas');

// Rutas API
app.use('/api/productos', productRoutes);
app.use('/api/auth', authRoutes);
app.use('/api/carrito', cartRoutes);
app.use('/api/usuarios', userRoutes);
app.use('/api/ventas', ventasRoutes);

// Ruta raíz API
app.get('/api', (req, res) => {
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

// Catch-all para servir el frontend (DEBE IR AL FINAL)
app.get('*', (req, res) => {
    res.sendFile(path.join(__dirname, '../frontend', 'index.html'));
});

const PORT = process.env.PORT || 3000;
app.listen(PORT, () => {
    console.log(`Servidor corriendo en http://localhost:${PORT}`);
});

module.exports = app;
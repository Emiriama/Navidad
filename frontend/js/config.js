// config.js - Configuración de la aplicación

// URL base de la API
const API_URL = 'http://localhost:3000/api';

// Configuración de la aplicación
const CONFIG = {
    nombre_app: 'Panadería Navideña',
    version: '1.0.0',
    timeout_request: 30000, // 30 segundos
    max_intentos: 3,
    debug: true
};

// Validar que la API esté disponible (opcional)
async function verificarAPI() {
    try {
        const response = await fetch(`${API_URL}/productos`, {
            method: 'GET',
            headers: {
                'Content-Type': 'application/json'
            }
        });
        
        if (response.ok) {
            console.log('✓ Conexión con API establecida');
            return true;
        } else {
            console.warn('⚠ API respondió con error:', response.status);
            return false;
        }
    } catch (error) {
        console.error('✗ Error al conectar con la API:', error);
        return false;
    }
}

// Mostrar estado de la API en consola (solo en desarrollo)
if (window.location.hostname === 'localhost' || window.location.hostname === '127.0.0.1') {
    console.log('==========================================');
    console.log('  PANADERÍA NAVIDEÑA - Admin Panel');
    console.log('==========================================');
    console.log('API URL:', API_URL);
    console.log('Versión:', CONFIG.version);
    console.log('Debug Mode:', CONFIG.debug ? 'ACTIVADO' : 'DESACTIVADO');
    console.log('==========================================');
    
    // Verificar API al cargar
    verificarAPI();
}

// Manejo global de errores de fetch
window.addEventListener('unhandledrejection', function(event) {
    console.error('Error no manejado:', event.reason);
    
    if (CONFIG.debug) {
        // En desarrollo, mostrar el error
        console.error('Detalles del error:', event);
    }
});

console.log('config.js cargado correctamente');
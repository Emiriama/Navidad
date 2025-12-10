// Configuración global de la API
const API_URL = 'http://localhost:3000/api';

// Función para obtener el token
function getToken() {
    return localStorage.getItem('token');
}

// Función para obtener el usuario
function getUsuario() {
    const usuario = localStorage.getItem('usuario');
    return usuario ? JSON.parse(usuario) : null;
}

// Función para hacer peticiones autenticadas
async function fetchAuth(url, options = {}) {
    const token = getToken();
    
    if (!token) {
        throw new Error('No hay sesión activa');
    }

    const headers = {
        'Content-Type': 'application/json',
        'Authorization': `Bearer ${token}`,
        ...options.headers
    };

    const response = await fetch(url, {
        ...options,
        headers
    });

    if (response.status === 401) {
        localStorage.removeItem('token');
        localStorage.removeItem('usuario');
        window.location.href = '/login.html';
        throw new Error('Sesión expirada');
    }

    return response;
}

// Formatear moneda
function formatearMoneda(cantidad) {
    return new Intl.NumberFormat('es-MX', {
        style: 'currency',
        currency: 'MXN'
    }).format(cantidad);
}

// Formatear fecha
function formatearFecha(fecha) {
    return new Date(fecha).toLocaleString('es-MX', {
        year: 'numeric',
        month: 'long',
        day: 'numeric',
        hour: '2-digit',
        minute: '2-digit'
    });
}

// Mostrar mensaje de error
function mostrarError(mensaje, elementoId = 'errorMsg') {
    const elemento = document.getElementById(elementoId);
    if (elemento) {
        elemento.textContent = mensaje;
        elemento.style.display = 'block';
        setTimeout(() => {
            elemento.style.display = 'none';
        }, 5000);
    }
}

// Mostrar mensaje de éxito
function mostrarExito(mensaje, elementoId = 'successMsg') {
    const elemento = document.getElementById(elementoId);
    if (elemento) {
        elemento.textContent = mensaje;
        elemento.style.display = 'block';
        setTimeout(() => {
            elemento.style.display = 'none';
        }, 3000);
    }
}
// auth.js - Sistema de autenticación

// Guardar usuario en localStorage
function guardarUsuario(usuario, token) {
    localStorage.setItem('usuario', JSON.stringify(usuario));
    localStorage.setItem('token', token);
    console.log('Usuario guardado:', usuario);
}

// Obtener usuario del localStorage
function getUsuario() {
    const usuarioStr = localStorage.getItem('usuario');
    if (!usuarioStr) return null;
    
    try {
        return JSON.parse(usuarioStr);
    } catch (error) {
        console.error('Error al parsear usuario:', error);
        return null;
    }
}

// Obtener token del localStorage
function getToken() {
    return localStorage.getItem('token');
}

// Verificar si el usuario está autenticado
function estaAutenticado() {
    const token = getToken();
    const usuario = getUsuario();
    return token !== null && usuario !== null;
}

// Verificar si el usuario es admin
function esAdmin() {
    const usuario = getUsuario();
    if (!usuario) return false;
    return usuario.rol === 'admin' || usuario.rol === 'administrador';
}

// Proteger página de admin - Redirige si no está autenticado o no es admin
function protegerPaginaAdmin() {
    console.log('Verificando autenticación de admin...');
    
    const token = getToken();
    const usuario = getUsuario();
    
    console.log('Token:', token);
    console.log('Usuario:', usuario);
    
    // Si no hay token o usuario, redirigir a login
    if (!token || !usuario) {
        console.log('No hay sesión activa, redirigiendo a login...');
        alert('Debes iniciar sesión para acceder a esta página');
        window.location.href = '../login.html';
        return false;
    }
    
    // Verificar que sea admin
    if (usuario.rol !== 'admin' && usuario.rol !== 'administrador') {
        console.log('Usuario no es administrador:', usuario.rol);
        alert('No tienes permisos de administrador');
        window.location.href = '../index.html';
        return false;
    }
    
    console.log('Autenticación exitosa para admin:', usuario.nombre_usuario);
    return true;
}

// Proteger página de cliente - Redirige si no está autenticado
function protegerPagina() {
    console.log('Verificando autenticación de usuario...');
    
    if (!estaAutenticado()) {
        console.log('No hay sesión activa, redirigiendo a login...');
        alert('Debes iniciar sesión para acceder a esta página');
        window.location.href = 'login.html';
        return false;
    }
    
    console.log('Autenticación exitosa');
    return true;
}

// Cerrar sesión
function cerrarSesion() {
    console.log('Cerrando sesión...');
    localStorage.removeItem('token');
    localStorage.removeItem('usuario');
    window.location.href = '../login.html';
}

// Fetch con autenticación
async function fetchAuth(url, options = {}) {
    const token = getToken();
    
    if (!token) {
        console.error('No hay token disponible');
        throw new Error('No autenticado');
    }
    
    // Configurar headers por defecto
    const headers = {
        'Content-Type': 'application/json',
        'Authorization': `Bearer ${token}`,
        ...(options.headers || {})
    };
    
    // Realizar fetch con autenticación
    const response = await fetch(url, {
        ...options,
        headers
    });
    
    // Si la respuesta es 401 (no autorizado), cerrar sesión
    if (response.status === 401) {
        console.error('Token inválido o expirado');
        alert('Tu sesión ha expirado. Por favor inicia sesión nuevamente.');
        cerrarSesion();
        throw new Error('Token inválido');
    }
    
    return response;
}

// Event listeners para botones de logout
document.addEventListener('DOMContentLoaded', function() {
    // Botón de cerrar sesión en el navbar
    const navLogout = document.getElementById('navLogout');
    if (navLogout) {
        navLogout.addEventListener('click', function(e) {
            e.preventDefault();
            if (confirm('¿Estás seguro de cerrar sesión?')) {
                cerrarSesion();
            }
        });
    }
    
    // Otros botones de logout
    const logoutButtons = document.querySelectorAll('[data-logout]');
    logoutButtons.forEach(btn => {
        btn.addEventListener('click', function(e) {
            e.preventDefault();
            if (confirm('¿Estás seguro de cerrar sesión?')) {
                cerrarSesion();
            }
        });
    });
});
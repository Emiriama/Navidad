// Verificar sesión al cargar la página
document.addEventListener('DOMContentLoaded', () => {
    const token = getToken();
    const usuario = getUsuario();

    const navLogin = document.getElementById('navLogin');
    const navLogout = document.getElementById('navLogout');
    const navCarrito = document.getElementById('navCarrito');
    const navPerfil = document.getElementById('navPerfil');
    const navAdmin = document.getElementById('navAdmin');

    if (token && usuario) {
        // Usuario logueado
        if (navLogin) navLogin.style.display = 'none';
        if (navLogout) navLogout.style.display = 'block';
        if (navCarrito) navCarrito.style.display = 'block';
        if (navPerfil) navPerfil.style.display = 'block';

        // Mostrar opción de admin si es administrador
        if (usuario.rol === 'administrador' && navAdmin) {
            navAdmin.style.display = 'block';
        }

        // Actualizar contador del carrito
        actualizarContadorCarrito();
    } else {
        // Usuario no logueado
        if (navLogin) navLogin.style.display = 'block';
        if (navLogout) navLogout.style.display = 'none';
        if (navCarrito) navCarrito.style.display = 'none';
        if (navPerfil) navPerfil.style.display = 'none';
        if (navAdmin) navAdmin.style.display = 'none';
    }

    // Cerrar sesión
    if (navLogout) {
        navLogout.addEventListener('click', (e) => {
            e.preventDefault();
            localStorage.removeItem('token');
            localStorage.removeItem('usuario');
            window.location.href = '/index.html';
        });
    }
});

// Actualizar contador del carrito
async function actualizarContadorCarrito() {
    try {
        const response = await fetchAuth(`${API_URL}/carrito`);
        if (response.ok) {
            const data = await response.json();
            const contador = document.getElementById('carritoCount');
            if (contador) {
                contador.textContent = data.items.length;
            }
        }
    } catch (error) {
        console.error('Error al actualizar contador:', error);
    }
}

// Proteger páginas que requieren autenticación
function protegerPagina() {
    const token = getToken();
    if (!token) {
        window.location.href = '/login.html';
    }
}

// Proteger páginas de administrador
function protegerPaginaAdmin() {
    const usuario = getUsuario();
    if (!usuario || usuario.rol !== 'administrador') {
        alert('Acceso denegado. Se requieren permisos de administrador.');
        window.location.href = '/index.html';
    }
}
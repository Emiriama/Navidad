document.addEventListener('DOMContentLoaded', () => {
    protegerPagina();
    cargarPerfil();
    cargarHistorial();
});

async function cargarPerfil() {
    try {
        const response = await fetchAuth(`${API_URL}/usuarios/perfil`);
        const data = await response.json();
        
        document.getElementById('userName').textContent = data.nombre_usuario;
        document.getElementById('userEmail').textContent = data.correo;
        document.getElementById('userRole').textContent = data.rol === 'admin' ? 'Administrador' : 'Usuario';
        
    } catch (error) {
        console.error('Error:', error);
        mostrarError('Error al cargar el perfil');
    }
}

async function cargarHistorial() {
    const historialDiv = document.getElementById('historialCompras');
    
    try {
        const response = await fetchAuth(`${API_URL}/usuarios/historial`);
        const compras = await response.json();
        
        if (compras.length === 0) {
            historialDiv.innerHTML = '<p>No tienes compras registradas aún.</p>';
            return;
        }
        
        historialDiv.innerHTML = `
            <table class="tabla-historial">
                <thead>
                    <tr>
                        <th>Número de Venta</th>
                        <th>Fecha</th>
                        <th>Total</th>
                        <th>Estado</th>
                    </tr>
                </thead>
                <tbody>
                    ${compras.map(compra => `
                        <tr>
                            <td>${compra.numero_venta}</td>
                            <td>${formatearFecha(compra.fecha_compra)}</td>
                            <td>${formatearMoneda(compra.total)}</td>
                            <td><span class="badge badge-${compra.estado}">${compra.estado}</span></td>
                        </tr>
                    `).join('')}
                </tbody>
            </table>
        `;
        
    } catch (error) {
        console.error('Error:', error);
        historialDiv.innerHTML = '<p class="error">Error al cargar el historial</p>';
    }
}

function cerrarSesion() {
    localStorage.removeItem('token');
    localStorage.removeItem('usuario');
    window.location.href = 'index.html';
}
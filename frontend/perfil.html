document.addEventListener('DOMContentLoaded', () => {
    protegerPagina();
    cargarPerfil();
    cargarHistorial();

    document.getElementById('fondosForm').addEventListener('submit', agregarFondos);
});

async function cargarPerfil() {
    try {
        const response = await fetchAuth(`${API_URL}/usuarios/perfil`);
        const data = await response.json();

        document.getElementById('userName').textContent = data.nombre_usuario;
        document.getElementById('userEmail').textContent = data.correo;
        document.getElementById('userRole').textContent = data.rol === 'administrador' ? 'Administrador' : 'Cliente';
        document.getElementById('userFecha').textContent = formatearFecha(data.fecha_registro);
        document.getElementById('fondosActuales').textContent = parseFloat(data.fondos).toFixed(2);

    } catch (error) {
        console.error('Error:', error);
        mostrarError('Error al cargar el perfil');
    }
}

async function agregarFondos(e) {
    e.preventDefault();

    const monto = parseFloat(document.getElementById('monto').value);

    if (monto <= 0) {
        mostrarError('El monto debe ser mayor a 0');
        return;
    }

    if (monto > 999999999999) {
        mostrarError('El monto máximo es $999,999,999,999');
        return;
    }

    try {
        const response = await fetchAuth(`${API_URL}/usuarios/fondos`, {
            method: 'POST',
            body: JSON.stringify({ monto })
        });

        const result = await response.json();

        if (response.ok) {
            mostrarExito('Fondos agregados exitosamente');
            document.getElementById('fondosActuales').textContent = parseFloat(result.fondos).toFixed(2);
            document.getElementById('fondosForm').reset();
        } else {
            mostrarError(result.error);
        }
    } catch (error) {
        console.error('Error:', error);
        mostrarError('Error al agregar fondos');
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
document.addEventListener('DOMContentLoaded', () => {
    protegerPagina();
    cargarCarrito();
    cargarFondos();

    document.getElementById('btnComprar').addEventListener('click', procesarCompra);
    document.getElementById('btnVaciar').addEventListener('click', vaciarCarrito);

    // Modal
    const modal = document.getElementById('ticketModal');
    const span = document.getElementsByClassName('close')[0];
    span.onclick = () => modal.style.display = 'none';
    window.onclick = (e) => {
        if (e.target == modal) modal.style.display = 'none';
    };
});

async function cargarCarrito() {
    const carritoItems = document.getElementById('carritoItems');
    const totalCarrito = document.getElementById('totalCarrito');

    try {
        const response = await fetchAuth(`${API_URL}/carrito`);
        const data = await response.json();

        if (data.items.length === 0) {
            carritoItems.innerHTML = '<p class="carrito-vacio">Tu carrito está vacío</p>';
            totalCarrito.textContent = '$0.00';
            return;
        }

        carritoItems.innerHTML = data.items.map(item => `
            <div class="carrito-item">
                <div class="item-imagen">
                    ${item.imagen_url ? 
                        `<img src="${item.imagen_url}" alt="${item.nombre}">` :
                        '<div class="placeholder-imagen-small">🎄</div>'
                    }
                </div>
                <div class="item-info">
                    <h3>${item.nombre}</h3>
                    <p>${item.descripcion || ''}</p>
                    <p class="item-precio">${formatearMoneda(item.precio)}</p>
                </div>
                <div class="item-cantidad">
                    <label>Cantidad:</label>
                    <input type="number" value="${item.cantidad}" min="1" max="${item.stock}" 
                        onchange="actualizarCantidad(${item.id_carrito}, this.value)">
                    <small>Disponible: ${item.stock}</small>
                </div>
                <div class="item-subtotal">
                    <p>Subtotal:</p>
                    <p class="subtotal-valor">${formatearMoneda(item.precio * item.cantidad)}</p>
                </div>
                <button class="btn btn-danger btn-sm" onclick="eliminarItem(${item.id_carrito})">
                    Eliminar
                </button>
            </div>
        `).join('');

        totalCarrito.textContent = formatearMoneda(data.total);

    } catch (error) {
        console.error('Error:', error);
        mostrarError('Error al cargar el carrito');
    }
}

async function cargarFondos() {
    try {
        const response = await fetchAuth(`${API_URL}/usuarios/perfil`);
        const data = await response.json();
        document.getElementById('fondosUsuario').textContent = formatearMoneda(data.fondos);
    } catch (error) {
        console.error('Error al cargar fondos:', error);
    }
}

async function actualizarCantidad(idCarrito, cantidad) {
    cantidad = parseInt(cantidad);
    
    if (cantidad < 1) {
        mostrarError('La cantidad debe ser mayor a 0');
        cargarCarrito();
        return;
    }

    try {
        const response = await fetchAuth(`${API_URL}/carrito/${idCarrito}`, {
            method: 'PUT',
            body: JSON.stringify({ cantidad })
        });

        if (response.ok) {
            cargarCarrito();
            actualizarContadorCarrito();
        } else {
            const result = await response.json();
            mostrarError(result.error);
            cargarCarrito();
        }
    } catch (error) {
        console.error('Error:', error);
        mostrarError('Error al actualizar cantidad');
    }
}

async function eliminarItem(idCarrito) {
    if (!confirm('¿Eliminar este producto del carrito?')) return;

    try {
        const response = await fetchAuth(`${API_URL}/carrito/${idCarrito}`, {
            method: 'DELETE'
        });

        if (response.ok) {
            mostrarExito('Producto eliminado del carrito');
            cargarCarrito();
            actualizarContadorCarrito();
        }
    } catch (error) {
        console.error('Error:', error);
        mostrarError('Error al eliminar producto');
    }
}

async function vaciarCarrito() {
    if (!confirm('¿Vaciar todo el carrito?')) return;

    try {
        const response = await fetchAuth(`${API_URL}/carrito`, {
            method: 'DELETE'
        });

        if (response.ok) {
            mostrarExito('Carrito vaciado');
            cargarCarrito();
            actualizarContadorCarrito();
        }
    } catch (error) {
        console.error('Error:', error);
        mostrarError('Error al vaciar carrito');
    }
}

async function procesarCompra() {
    if (!confirm('¿Confirmar la compra?')) return;

    try {
        const response = await fetchAuth(`${API_URL}/carrito/comprar`, {
            method: 'POST'
        });

        const result = await response.json();

        if (response.ok) {
            mostrarTicket(result);
            cargarCarrito();
            cargarFondos();
            actualizarContadorCarrito();
        } else {
            mostrarError(result.error);
        }
    } catch (error) {
        console.error('Error:', error);
        mostrarError('Error al procesar la compra');
    }
}

function mostrarTicket(data) {
    const modal = document.getElementById('ticketModal');
    const ticketContent = document.getElementById('ticketContent');
    const fechaActual = new Date().toLocaleString('es-MX');

    ticketContent.innerHTML = `
        <div class="ticket">
            <h2>🎄 Panadería Navideña</h2>
            <div class="ticket-divider"></div>
            <p><strong>Número de Venta:</strong> ${data.numero_venta}</p>
            <p><strong>Fecha:</strong> ${fechaActual}</p>
            <div class="ticket-divider"></div>
            <h3>Total Pagado: ${formatearMoneda(data.total)}</h3>
            <div class="ticket-divider"></div>
            <p class="ticket-gracias">¡Gracias por tu compra!</p>
            <button class="btn btn-primary" onclick="window.print()">Imprimir</button>
            <button class="btn btn-secondary" onclick="document.getElementById('ticketModal').style.display='none'">
                Cerrar
            </button>
        </div>
    `;

    modal.style.display = 'block';
}
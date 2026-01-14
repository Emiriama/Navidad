document.addEventListener('DOMContentLoaded', () => {
    cargarProductos();
});

async function cargarProductos() {
    const loading = document.getElementById('loading');
    const productosGrid = document.getElementById('productosGrid');
    const errorMsg = document.getElementById('errorMsg');

    try {
        loading.style.display = 'block';
        
        // CORREGIDO: Cambiadas comillas invertidas por paréntesis
        const response = await fetch(`${API_URL}/productos/disponibles`);
        
        if (!response.ok) {
            throw new Error('Error al cargar productos');
        }

        const productos = await response.json();
        loading.style.display = 'none';

        if (productos.length === 0) {
            productosGrid.innerHTML = '<p class="no-productos">No hay productos disponibles en este momento.</p>';
            return;
        }

        productosGrid.innerHTML = productos.map(producto => `
            <div class="producto-card">
                <div class="producto-imagen">
                    ${producto.imagen_url ? 
                        `<img src="${producto.imagen_url}" alt="${producto.nombre}">` :
                        '<div class="placeholder-imagen">🎄</div>'
                    }
                </div>
                <div class="producto-info">
                    <h3>${producto.nombre}</h3>
                    <p class="producto-descripcion">${producto.descripcion || 'Sin descripción'}</p>
                    <div class="producto-footer">
                        <span class="producto-precio">${formatearMoneda(producto.precio)}</span>
                        <span class="producto-stock">Stock: ${producto.stock}</span>
                    </div>
                    ${getToken() ? `
                        <div class="producto-acciones">
                            <input type="number" class="cantidad-input" id="cantidad-${producto.id_producto}" 
                                min="1" max="${producto.stock}" value="1">
                            <button class="btn btn-primary btn-sm" onclick="agregarAlCarrito(${producto.id_producto})">
                                Agregar al Carrito
                            </button>
                        </div>
                    ` : `
                        <p class="login-requerido">
                            <a href="login.html">Inicia sesión</a> para comprar
                        </p>
                    `}
                </div>
            </div>
        `).join('');
    } catch (error) {
        console.error('Error:', error);
        loading.style.display = 'none';
        errorMsg.textContent = 'Error al cargar los productos';
        errorMsg.style.display = 'block';
    }
}

async function agregarAlCarrito(idProducto) {
    // CORREGIDO: Cambiadas comillas invertidas por paréntesis
    const cantidadInput = document.getElementById(`cantidad-${idProducto}`);
    const cantidad = parseInt(cantidadInput.value);

    if (cantidad < 1) {
        mostrarError('La cantidad debe ser mayor a 0');
        return;
    }

    try {
        // CORREGIDO: Cambiadas comillas invertidas por paréntesis
        const response = await fetchAuth(`${API_URL}/carrito`, {
            method: 'POST',
            body: JSON.stringify({
                id_producto: idProducto,
                cantidad: cantidad
            })
        });

        const result = await response.json();

        if (response.ok) {
            mostrarExito('Producto agregado al carrito');
            actualizarContadorCarrito();
            cantidadInput.value = 1;
        } else {
            mostrarError(result.error || 'Error al agregar al carrito');
        }
    } catch (error) {
        console.error('Error:', error);
        mostrarError('Error de conexión');
    }
}
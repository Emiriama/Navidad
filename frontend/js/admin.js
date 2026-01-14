// admin.js - Funciones auxiliares para el panel de administración

// Formatear moneda
function formatearMoneda(valor) {
    const numero = parseFloat(valor) || 0;
    return '$' + numero.toFixed(2).replace(/\d(?=(\d{3})+\.)/g, '$&,');
}

// Formatear fecha
function formatearFecha(fecha) {
    if (!fecha) return 'N/A';
    
    try {
        const date = new Date(fecha);
        
        // Verificar que la fecha sea válida
        if (isNaN(date.getTime())) {
            return 'Fecha inválida';
        }
        
        const dia = String(date.getDate()).padStart(2, '0');
        const mes = String(date.getMonth() + 1).padStart(2, '0');
        const año = date.getFullYear();
        const hora = String(date.getHours()).padStart(2, '0');
        const minutos = String(date.getMinutes()).padStart(2, '0');
        
        return `${dia}/${mes}/${año} ${hora}:${minutos}`;
    } catch (error) {
        console.error('Error al formatear fecha:', error);
        return 'N/A';
    }
}

// Mostrar mensaje de error
function mostrarError(mensaje) {
    const errorDiv = document.getElementById('errorMsg');
    if (errorDiv) {
        errorDiv.textContent = mensaje;
        errorDiv.style.display = 'block';
        
        // Auto-ocultar después de 5 segundos
        setTimeout(() => {
            errorDiv.style.display = 'none';
        }, 5000);
    } else {
        alert('Error: ' + mensaje);
    }
}

// Mostrar mensaje de éxito
function mostrarExito(mensaje) {
    const successDiv = document.getElementById('successMsg');
    if (successDiv) {
        successDiv.textContent = mensaje;
        successDiv.style.display = 'block';
        
        // Auto-ocultar después de 3 segundos
        setTimeout(() => {
            successDiv.style.display = 'none';
        }, 3000);
    } else {
        alert(mensaje);
    }
}

// Limpiar mensajes
function limpiarMensajes() {
    const errorDiv = document.getElementById('errorMsg');
    const successDiv = document.getElementById('successMsg');
    
    if (errorDiv) errorDiv.style.display = 'none';
    if (successDiv) successDiv.style.display = 'none';
}

// Validar que un campo no esté vacío
function validarCampoRequerido(valor, nombreCampo) {
    if (!valor || valor.trim() === '') {
        mostrarError(`El campo ${nombreCampo} es requerido`);
        return false;
    }
    return true;
}

// Validar email
function validarEmail(email) {
    const regex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    return regex.test(email);
}

// Validar número positivo
function validarNumeroPositivo(valor, nombreCampo) {
    const numero = parseFloat(valor);
    if (isNaN(numero) || numero < 0) {
        mostrarError(`${nombreCampo} debe ser un número positivo`);
        return false;
    }
    return true;
}

// Confirmar acción
function confirmarAccion(mensaje) {
    return confirm(mensaje);
}

// Mostrar loading
function mostrarLoading(elementId) {
    const elemento = document.getElementById(elementId);
    if (elemento) {
        elemento.innerHTML = '<tr><td colspan="10" style="text-align:center; padding: 2rem;">Cargando...</td></tr>';
    }
}

// Mostrar "no hay datos"
function mostrarSinDatos(elementId, mensaje = 'No hay datos disponibles', colspan = 10) {
    const elemento = document.getElementById(elementId);
    if (elemento) {
        elemento.innerHTML = `<tr><td colspan="${colspan}" style="text-align:center; padding: 2rem; color: #666;">${mensaje}</td></tr>`;
    }
}

// Obtener parámetro de URL
function obtenerParametroURL(nombre) {
    const urlParams = new URLSearchParams(window.location.search);
    return urlParams.get(nombre);
}

// Crear badge de estado
function crearBadge(texto, tipo = 'default') {
    const clases = {
        'success': 'badge-success',
        'danger': 'badge-danger',
        'warning': 'badge-warning',
        'info': 'badge-info',
        'default': 'badge-default'
    };
    
    const clase = clases[tipo] || clases['default'];
    return `<span class="badge ${clase}">${texto}</span>`;
}

// Escapar HTML para prevenir XSS
function escaparHTML(texto) {
    const div = document.createElement('div');
    div.textContent = texto;
    return div.innerHTML;
}

// Truncar texto
function truncarTexto(texto, maxLength = 50) {
    if (!texto) return '';
    if (texto.length <= maxLength) return texto;
    return texto.substring(0, maxLength) + '...';
}

// Debounce para búsquedas
function debounce(func, wait) {
    let timeout;
    return function executedFunction(...args) {
        const later = () => {
            clearTimeout(timeout);
            func(...args);
        };
        clearTimeout(timeout);
        timeout = setTimeout(later, wait);
    };
}

// Log de debug (solo en desarrollo)
function debugLog(mensaje, data = null) {
    if (window.location.hostname === 'localhost' || window.location.hostname === '127.0.0.1') {
        console.log('[DEBUG]', mensaje, data || '');
    }
}

// Inicializar tooltips (si se usa alguna librería)
function inicializarTooltips() {
    // Implementar si es necesario
}

// Scroll suave a elemento
function scrollToElement(elementId) {
    const elemento = document.getElementById(elementId);
    if (elemento) {
        elemento.scrollIntoView({ behavior: 'smooth', block: 'start' });
    }
}

console.log('admin.js cargado correctamente');
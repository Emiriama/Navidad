// Funciones comunes para el panel de administración

// Verificar que el usuario es administrador
function verificarAdmin() {
    const usuario = getUsuario();
    if (!usuario || usuario.rol !== 'administrador') {
        alert('Acceso denegado. Se requieren permisos de administrador.');
        window.location.href = '../index.html';
        return false;
    }
    return true;
}

// Formatear datos para gráficos
function prepararDatosGrafico(datos, labelKey, valueKey) {
    return {
        labels: datos.map(item => item[labelKey]),
        values: datos.map(item => item[valueKey])
    };
}

// Exportar tabla a CSV
function exportarCSV(tabla, nombreArchivo) {
    let csv = [];
    const rows = tabla.querySelectorAll('tr');

    for (let row of rows) {
        let cols = row.querySelectorAll('td, th');
        let csvRow = [];
        for (let col of cols) {
            csvRow.push(col.innerText);
        }
        csv.push(csvRow.join(','));
    }

    const csvString = csv.join('\n');
    const blob = new Blob([csvString], { type: 'text/csv' });
    const url = window.URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url;
    a.download = nombreArchivo || 'export.csv';
    a.click();
}

// Confirmar acción peligrosa
function confirmarAccion(mensaje) {
    return confirm(mensaje || '¿Estás seguro de realizar esta acción?');
}

// Validar imagen URL
function validarImagenURL(url) {
    if (!url) return true;
    const patron = /^https?:\/\/.+\.(jpg|jpeg|png|gif|webp)$/i;
    return patron.test(url);
}

// Generar reporte de estadísticas
async function generarReporte() {
    try {
        const response = await fetchAuth(`${API_URL}/ventas/estadisticas`);
        const data = await response.json();

        const reporte = `
REPORTE DE ESTADÍSTICAS
=======================
Fecha: ${new Date().toLocaleString('es-MX')}

VENTAS
------
Total de ventas: ${data.total_ventas}
Ventas hoy: ${data.ventas_hoy}
Total ingresos: ${formatearMoneda(data.total_ingresos)}

VENTAS POR MES
--------------
${data.ventas_por_mes.map(v => 
    `${v.mes}: ${v.cantidad} ventas - ${formatearMoneda(v.ingresos)}`
).join('\n')}
        `;

        return reporte;
    } catch (error) {
        console.error('Error al generar reporte:', error);
        return null;
    }
}

// Descargar reporte
async function descargarReporte() {
    const reporte = await generarReporte();
    if (!reporte) {
        alert('Error al generar el reporte');
        return;
    }

    const blob = new Blob([reporte], { type: 'text/plain' });
    const url = window.URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url;
    a.download = `reporte_${new Date().toISOString().split('T')[0]}.txt`;
    a.click();
}
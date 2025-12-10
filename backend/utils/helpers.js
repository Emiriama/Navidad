const bcrypt = require('bcryptjs');

// Generar hash de contraseña
async function generarHash(password) {
    const salt = await bcrypt.genSalt(10);
    const hash = await bcrypt.hash(password, salt);
    return hash;
}

// Generar número de venta único
function generarNumeroVenta(idUsuario) {
    return `V${Date.now()}${idUsuario}`;
}

// Validar rango numérico
function validarRango(valor, min, max) {
    return valor >= min && valor <= max;
}

// Script para generar hashes desde línea de comandos
if (require.main === module) {
    const password = process.argv[2] || 'admin123';
    
    generarHash(password).then(hash => {
        console.log('=================================');
        console.log('Generador de Hash de Contraseña');
        console.log('=================================');
        console.log(`Contraseña: ${password}`);
        console.log(`Hash: ${hash}`);
        console.log('=================================');
        console.log('\nUsa este hash en tu base de datos:');
        console.log(`\nINSERT INTO usuarios (nombre_usuario, correo, contrasena, rol, fondos) VALUES`);
        console.log(`('admin', 'admin@panaderia.com', '${hash}', 'administrador', 10000.00);\n`);
    }).catch(err => {
        console.error('Error al generar hash:', err);
    });
}

module.exports = {
    generarHash,
    generarNumeroVenta,
    validarRango
};
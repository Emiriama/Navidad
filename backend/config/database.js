const mysql = require('mysql2/promise');

console.log('🔍 Verificando variables de entorno:');
console.log('DB_HOST:', process.env.DB_HOST);
console.log('DB_USER:', process.env.DB_USER);
console.log('DB_PASSWORD:', process.env.DB_PASSWORD ? '***configurada***' : '❌ NO DEFINIDA');

const pool = mysql.createPool({
  host: process.env.DB_HOST,
  port: process.env.DB_PORT || 3306,
  user: process.env.DB_USER,
  password: process.env.DB_PASSWORD,
  database: process.env.DB_NAME,
  waitForConnections: true,
  connectionLimit: 10,
  queueLimit: 0,
  connectTimeout: 60000,
  enableKeepAlive: true,
  keepAliveInitialDelay: 0,
  ssl: {
    rejectUnauthorized: false
  }
});

pool.getConnection()
  .then(connection => {
    console.log('✅ Conexión exitosa a Railway MySQL');
    console.log(`📍 Host: ${process.env.DB_HOST}`);
    console.log(`📦 Base de datos: ${process.env.DB_NAME}`);
    connection.release();
  })
  .catch(err => {
    console.error('❌ Error al conectar a MySQL:', err.message);
    console.error('📋 Detalles:', err);
  });

module.exports = pool;
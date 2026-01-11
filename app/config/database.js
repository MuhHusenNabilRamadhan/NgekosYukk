const mysql = require('mysql2');
require('dotenv').config();

const pool = mysql.createPool({
    host: process.env.DB_HOST,      // Akan berisi: db_service
    user: process.env.DB_USER,      // Akan berisi: kelase
    password: process.env.DB_PASS,  // Akan berisi: TekserE-2025
    database: process.env.DB_NAME,  // Akan berisi: ngekos_db 
    waitForConnections: true,
    connectionLimit: 10
});

// Penting: Mengubah ke promise agar router bisa pakai await
const db = pool.promise();

console.log('Menghubungkan ke database di host: ' + process.env.DB_HOST);

module.exports = db;
// -------------------------------------------------------------
// MySQL connection pool for Campus Circle
// Uses mysql2/promise so every route can `await pool.query(...)`
// -------------------------------------------------------------
require('dotenv').config();
const mysql = require('mysql2/promise');

const pool = mysql.createPool({
    host:     process.env.DB_HOST     || '127.0.0.1',
    port:     process.env.DB_PORT     || 3306,
    user:     process.env.DB_USER     || 'root',
    password: process.env.DB_PASSWORD || '',
    database: process.env.DB_NAME     || 'campus_circle',
    waitForConnections: true,
    connectionLimit: 10,
    multipleStatements: false,
    dateStrings: true
});

// quick startup check
(async () => {
    try {
        const [rows] = await pool.query('SELECT 1 AS ok');
        if (rows[0].ok === 1) {
            console.log('[db] Connected to campus_circle');
        }
    } catch (e) {
        console.error('[db] Connection failed:', e.message);
    }
})();

module.exports = pool;

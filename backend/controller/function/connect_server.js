const mysql = require('mysql2/promise');

async function createConnection() {
    try {
        const connection = await mysql.createConnection({
            host: 'hostelmanagementserver.mysql.database.azure.com',
            user: 'shaan',
            password: 'DBMSproject123',
            database: 'ecomm',
            ssl: { rejectUnauthorized: true }
        });

        console.log("Connected to MySQL successfully!");
        return connection;
    } catch (err) {
        console.error("Connection error:", err.message);
        return null;  // Return null instead of false for better error handling
    }
}


module.exports = { createConnection };

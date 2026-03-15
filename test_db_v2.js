const { Pool } = require('pg');
require('dotenv').config();

const pool = new Pool({
    host: process.env.DB_HOST,
    port: process.env.DB_PORT,
    user: process.env.DB_USER,
    password: process.env.DB_PASSWORD,
    database: process.env.DB_NAME,
});

async function testDB() {
    console.log("Testing DB with Host:", process.env.DB_HOST);
    try {
        const res = await pool.query('SELECT NOW()');
        console.log("DB Connection Success!", res.rows[0]);
        
        const tables = await pool.query(`
            SELECT table_name 
            FROM information_schema.tables 
            WHERE table_schema = 'public'
        `);
        console.log("Tables in DB:");
        tables.rows.forEach(t => console.log(` - ${t.table_name}`));
        
        const users = await pool.query('SELECT id, username, role FROM users');
        console.log("Users in DB:");
        users.rows.forEach(u => console.log(` - ${u.username} (${u.role})`));

    } catch (err) {
        console.error("DB Error:", err.message);
    } finally {
        await pool.end();
    }
}

testDB();

require('dotenv').config();
const { Client } = require('pg');

const client = new Client({
    host: process.env.DB_HOST,
    port: process.env.DB_PORT,
    user: process.env.DB_USER,
    password: process.env.DB_PASSWORD,
    database: process.env.DB_NAME,
});

async function test() {
    console.log('Testing pg connection to:', process.env.DB_HOST, ':', process.env.DB_PORT);
    console.log('User:', process.env.DB_USER);
    console.log('DB:', process.env.DB_NAME);
    try {
        await client.connect();
        console.log('SUCCESS: Connected to PostgreSQL');
        const res = await client.query('SELECT NOW()');
        console.log('Current Time from DB:', res.rows[0]);
        await client.end();
    } catch (err) {
        console.error('ERROR:', err.message);
        console.error('Code:', err.code);
    }
}

test();

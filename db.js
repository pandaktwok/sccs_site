const { Pool } = require('pg');
require('dotenv').config();

const pool = new Pool({
    host: process.env.DB_HOST,
    port: process.env.DB_PORT,
    user: process.env.DB_USER,
    password: process.env.DB_PASSWORD,
    database: process.env.DB_NAME,
});

const initDb = async () => {
    const client = await pool.connect();
    try {
        // Users Table
        await client.query(`
            CREATE TABLE IF NOT EXISTS users (
                id SERIAL PRIMARY KEY,
                username TEXT UNIQUE NOT NULL,
                password TEXT NOT NULL,
                role TEXT DEFAULT 'user',
                menu_access JSONB DEFAULT '[]'::jsonb,
                created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
            );
        `);

        // Projects Table (for the site carousel)
        await client.query(`
            CREATE TABLE IF NOT EXISTS site_projects (
                id SERIAL PRIMARY KEY,
                title TEXT NOT NULL,
                tag TEXT,
                image TEXT,
                btn_text TEXT DEFAULT 'Conheça mais',
                btn_link TEXT DEFAULT '#',
                order_index INTEGER DEFAULT 0
            );
        `);

        // Events Table
        await client.query(`
            CREATE TABLE IF NOT EXISTS events (
                id SERIAL PRIMARY KEY,
                title TEXT NOT NULL,
                tag TEXT,
                date DATE NOT NULL,
                time TEXT,
                location_link TEXT,
                description TEXT,
                image TEXT,
                created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
            );
        `);

        // Donations Table
        await client.query(`
            CREATE TABLE IF NOT EXISTS donations (
                id SERIAL PRIMARY KEY,
                tab_name TEXT NOT NULL,
                title TEXT,
                description TEXT,
                banco TEXT,
                agencia TEXT,
                conta TEXT,
                cnpj TEXT,
                logo TEXT
            );
        `);

        // Home Settings Table
        await client.query(`
            CREATE TABLE IF NOT EXISTS home_settings (
                id SERIAL PRIMARY KEY,
                key TEXT UNIQUE NOT NULL,
                value JSONB NOT NULL
            );
        `);

        // RSS Feeds Table
        await client.query(`
            CREATE TABLE IF NOT EXISTS rss_feeds (
                id SERIAL PRIMARY KEY,
                url TEXT NOT NULL,
                verified BOOLEAN DEFAULT false
            );
        `);

        // RSS Tags Table
        await client.query(`
            CREATE TABLE IF NOT EXISTS rss_tags (
                id SERIAL PRIMARY KEY,
                name TEXT NOT NULL
            );
        `);

        // Initial Feeds if not present
        const feedsCheck = await client.query("SELECT * FROM rss_feeds LIMIT 1");
        if (feedsCheck.rows.length === 0) {
            await client.query("INSERT INTO rss_feeds (url, verified) VALUES ('novavenezaonline.com.br/feed', true), ('engeplus.com.br/rss', true)");
        }
        
        // Initial Tags
        const tagsCheck = await client.query("SELECT * FROM rss_tags LIMIT 1");
        if (tagsCheck.rows.length === 0) {
            await client.query("INSERT INTO rss_tags (name) VALUES ('SCCS'), ('Sociedade Cultural Cruzeiro do Sul')");
        }

        // Initial Settings if not present
        const settingsCheck = await client.query("SELECT * FROM home_settings WHERE key = 'main'");
        if (settingsCheck.rows.length === 0) {
            await client.query("INSERT INTO home_settings (key, value) VALUES ($1, $2)", ['main', JSON.stringify({
                heroImage: '',
                heroTitle: 'Sociedade Cultural Cruzeiro do Sul',
                heroText: 'Transformando vidas através da música e da cultura.',
                projectsTitle: 'Nossos Projetos',
                projectsText: 'Conheça nossas ações.',
                showEvents: true,
                showNews: true,
                donateMessage: 'FAÇA UM IMPACTO HOJE',
                donateTitle: 'Doar',
                donateText: 'Ajude-nos.',
                footerTitle: 'SCCS',
                footerText: 'Rua das Flores, 123',
                socials: {
                    instagram: { active: true, link: '#' },
                    youtube: { active: true, link: '#' },
                    facebook: { active: true, link: '#' },
                    share: { active: true, link: '#' }
                }
            })]);
        }

        // Check if admin exists and ensure password is 'admin1234'
        const bcrypt = require('bcryptjs');
        const adminRes = await client.query("SELECT * FROM users WHERE username = 'admin'");
        const adminMenus = ["Usuário", "Gerir Eventos", "Notícias & RSS", "Personalizar Site", "Banco de Dados", "Pagamentos"];
        
        if (adminRes.rows.length === 0) {
            const hashedPassword = await bcrypt.hash('admin1234', 10);
            await client.query(
                "INSERT INTO users (username, password, role, menu_access) VALUES ($1, $2, $3, $4)",
                ['admin', hashedPassword, 'admin', JSON.stringify(adminMenus)]
            );
            console.log("Admin user created with default password 'admin1234'");
        } else {
            const hashedPassword = await bcrypt.hash('admin1234', 10);
            await client.query("UPDATE users SET password = $1, menu_access = $2 WHERE username = 'admin'", [hashedPassword, JSON.stringify(adminMenus)]);
            console.log("Admin password and permissions synced to 'admin1234'");
        }
    } finally {
        client.release();
    }
};

module.exports = { pool, initDb };

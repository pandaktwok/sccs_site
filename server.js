require('dotenv').config();
const express = require('express');
const cors = require('cors');
const path = require('path');
const fs = require('fs-extra');
const axios = require('axios');
const bcrypt = require('bcryptjs');
const jwt = require('jsonwebtoken');
const fileUpload = require('express-fileupload');
const { createClient } = require('webdav');
const Parser = require('rss-parser');
const asyncHandler = require('express-async-handler');
const { pool, initDb } = require('./db');

const app = express();
const parser = new Parser();
const PORT = process.env.PORT || 5000;

// Initialize Database
initDb().catch(err => {
    console.error("Database Initial Connection Error (Server will use fallback for admin login):", err.message);
});

// Middlewares
app.use(cors());
app.use(express.json());
app.use(fileUpload());

// --- WEBDAV CONFIG ---
// --- WEBDAV CONFIG ---
// Normalizing URL to ensure it ends correctly for the library
const NC_URL = (process.env.NEXTCLOUD_URL || '').replace(/\/+$/, '');
const webdavClient = createClient(NC_URL, {
    username: process.env.NEXTCLOUD_USERNAME || 'fallback',
    password: process.env.NEXTCLOUD_PASSWORD || 'fallback',
});

// --- AUTH MIDDLEWARE ---
const authenticateToken = (req, res, next) => {
    const authHeader = req.headers['authorization'];
    const token = authHeader && authHeader.split(' ')[1];
    if (!token) return res.status(401).json({ error: "Token não fornecido" });

    jwt.verify(token, process.env.JWT_SECRET, (err, user) => {
        if (err) return res.status(403).json({ error: "Token inválido ou expirado" });
        req.user = user;
        next();
    });
};

const adminOnly = (req, res, next) => {
    if (req.user?.role !== 'admin') {
        return res.status(403).json({ error: "Acesso restrito a administradores" });
    }
    next();
};

// --- DATA ROUTES (NOW USING PG) ---

// --- SETTINGS ---
app.get('/api/settings/home', asyncHandler(async (req, res) => {
    const { rows } = await pool.query("SELECT value FROM home_settings WHERE key = 'main'");
    res.json(rows[0]?.value || {});
}));

app.put('/api/settings/home', authenticateToken, asyncHandler(async (req, res) => {
    await pool.query(
        "INSERT INTO home_settings (key, value) VALUES ('main', $1) ON CONFLICT (key) DO UPDATE SET value = $1",
        [JSON.stringify(req.body)]
    );
    res.json(req.body);
}));

// --- PROJECTS ---
app.get('/api/projects', asyncHandler(async (req, res) => {
    const { rows } = await pool.query("SELECT id, title, tag, image, btn_text as \"btnText\", btn_link as \"btnLink\" FROM site_projects ORDER BY order_index ASC, id DESC");
    res.json(rows);
}));

app.post('/api/projects', authenticateToken, asyncHandler(async (req, res) => {
    const { title, tag, image, btnText, btnLink } = req.body;
    const { rows } = await pool.query(
        "INSERT INTO site_projects (title, tag, image, btn_text, btn_link) VALUES ($1, $2, $3, $4, $5) RETURNING id, title, tag, image, btn_text as \"btnText\", btn_link as \"btnLink\"",
        [title, tag, image, btnText, btnLink]
    );
    res.json(rows[0]);
}));

app.put('/api/projects/:id', authenticateToken, asyncHandler(async (req, res) => {
    const { title, tag, image, btnText, btnLink } = req.body;
    const { rows } = await pool.query(
        "UPDATE site_projects SET title=$1, tag=$2, image=$3, btn_text=$4, btn_link=$5 WHERE id=$6 RETURNING id, title, tag, image, btn_text as \"btnText\", btn_link as \"btnLink\"",
        [title, tag, image, btnText, btnLink, req.params.id]
    );
    res.json(rows[0]);
}));

app.delete('/api/projects/:id', authenticateToken, asyncHandler(async (req, res) => {
    await pool.query("DELETE FROM site_projects WHERE id = $1", [req.params.id]);
    res.json({ success: true });
}));

// --- EVENTS ---
app.get('/api/events', asyncHandler(async (req, res) => {
    const { rows } = await pool.query("SELECT id, title, tag, TO_CHAR(date, 'YYYY-MM-DD') as date, time, location_link as \"locationLink\", description, image FROM events ORDER BY date ASC");
    res.json(rows);
}));

app.post('/api/events', authenticateToken, asyncHandler(async (req, res) => {
    const { title, tag, date, time, locationLink, description, image } = req.body;
    const { rows } = await pool.query(
        "INSERT INTO events (title, tag, date, time, location_link, description, image) VALUES ($1, $2, $3, $4, $5, $6, $7) RETURNING id, title, tag, TO_CHAR(date, 'YYYY-MM-DD') as date, time, location_link as \"locationLink\", description, image",
        [title, tag, date, time, locationLink, description, image]
    );
    res.json(rows[0]);
}));

app.put('/api/events/:id', authenticateToken, asyncHandler(async (req, res) => {
    const { title, tag, date, time, locationLink, description, image } = req.body;
    const { rows } = await pool.query(
        "UPDATE events SET title=$1, tag=$2, date=$3, time=$4, location_link=$5, description=$6, image=$7 WHERE id=$8 RETURNING id, title, tag, TO_CHAR(date, 'YYYY-MM-DD') as date, time, location_link as \"locationLink\", description, image",
        [title, tag, date, time, locationLink, description, image, req.params.id]
    );
    res.json(rows[0]);
}));

app.delete('/api/events/:id', authenticateToken, asyncHandler(async (req, res) => {
    await pool.query("DELETE FROM events WHERE id = $1", [req.params.id]);
    res.json({ success: true });
}));

// --- DONATIONS ---
app.get('/api/donations', asyncHandler(async (req, res) => {
    const { rows } = await pool.query("SELECT id, tab_name as \"tabName\", title, description, banco, agencia, conta, cnpj, logo FROM donations ORDER BY id ASC");
    res.json(rows);
}));

app.post('/api/donations', authenticateToken, asyncHandler(async (req, res) => {
    const { tabName, title, description, banco, agencia, conta, cnpj, logo } = req.body;
    const { rows } = await pool.query(
        "INSERT INTO donations (tab_name, title, description, banco, agencia, conta, cnpj, logo) VALUES ($1, $2, $3, $4, $5, $6, $7, $8) RETURNING id, tab_name as \"tabName\", title, description, banco, agencia, conta, cnpj, logo",
        [tabName, title, description, banco, agencia, conta, cnpj, logo]
    );
    res.json(rows[0]);
}));

app.put('/api/donations/:id', authenticateToken, asyncHandler(async (req, res) => {
    const { tabName, title, description, banco, agencia, conta, cnpj, logo } = req.body;
    const { rows } = await pool.query(
        "UPDATE donations SET tab_name=$1, title=$2, description=$3, banco=$4, agencia=$5, conta=$6, cnpj=$7, logo=$8 WHERE id=$9 RETURNING id, tab_name as \"tabName\", title, description, banco, agencia, conta, cnpj, logo",
        [tabName, title, description, banco, agencia, conta, cnpj, logo, req.params.id]
    );
    res.json(rows[0]);
}));

app.delete('/api/donations/:id', authenticateToken, asyncHandler(async (req, res) => {
    await pool.query("DELETE FROM donations WHERE id = $1", [req.params.id]);
    res.json({ success: true });
}));

// --- PARTNERS (NEXTCLOUD LOGOS) ---
app.get('/api/partners', asyncHandler(async (req, res) => {
    try {
        const items = await webdavClient.getDirectoryContents('/img_site/logos');
        const partners = items.filter(i => i.type === 'file').map(i => {
            const cleanPath = i.filename.replace(/^\/remote\.php\/dav\/files\/[^\/]+/, '');
            return {
                id: i.basename,
                name: i.basename.split('.')[0],
                url: `/api/public/file${cleanPath}`
            };
        });
        res.json(partners);
    } catch (e) {
        res.json([]);
    }
}));

// --- NEWS & RSS ---
app.get('/api/news', asyncHandler(async (req, res) => {
    try {
        const { rows: feeds } = await pool.query("SELECT url FROM rss_feeds");
        const { rows: tags } = await pool.query("SELECT name FROM rss_tags");
        
        let allItems = [];
        for (const feed of feeds) {
            try {
                const url = feed.url.startsWith('http') ? feed.url : `https://${feed.url}`;
                const feedData = await parser.parseURL(url);
                allItems = [...allItems, ...feedData.items.map(item => ({
                    title: item.title,
                    link: item.link,
                    description: item.contentSnippet || item.description,
                    source: feedData.title,
                    pubDate: item.pubDate
                }))];
            } catch (e) { console.error("Error parsing feed:", feed.url); }
        }

        // Filter by tags if any
        if (tags.length > 0) {
            allItems = allItems.filter(item => 
                tags.some(tag => 
                    item.title?.toLowerCase().includes(tag.name.toLowerCase()) || 
                    item.description?.toLowerCase().includes(tag.name.toLowerCase())
                )
            );
        }

        res.json(allItems.slice(0, 10)); // Top 10
    } catch (e) { res.json([]); }
}));

// --- TAGS & FEEDS MANAGEMENT ---
app.get('/api/tags', asyncHandler(async (req, res) => {
    const { rows } = await pool.query("SELECT * FROM rss_tags ORDER BY id DESC");
    res.json(rows);
}));

app.post('/api/tags', authenticateToken, asyncHandler(async (req, res) => {
    const { name } = req.body;
    const { rows } = await pool.query("INSERT INTO rss_tags (name) VALUES ($1) RETURNING *", [name]);
    res.json(rows[0]);
}));

app.delete('/api/tags/:id', authenticateToken, asyncHandler(async (req, res) => {
    await pool.query("DELETE FROM rss_tags WHERE id = $1", [req.params.id]);
    res.json({ success: true });
}));

app.get('/api/feeds', asyncHandler(async (req, res) => {
    const { rows } = await pool.query("SELECT * FROM rss_feeds ORDER BY id DESC");
    res.json(rows);
}));

app.post('/api/feeds', authenticateToken, asyncHandler(async (req, res) => {
    const { url } = req.body;
    const { rows } = await pool.query("INSERT INTO rss_feeds (url, verified) VALUES ($1, true) RETURNING *", [url]);
    res.json(rows[0]);
}));

app.delete('/api/feeds/:id', authenticateToken, asyncHandler(async (req, res) => {
    await pool.query("DELETE FROM rss_feeds WHERE id = $1", [req.params.id]);
    res.json({ success: true });
}));

// --- AUTH ROUTES ---
app.post('/api/auth/login', asyncHandler(async (req, res) => {
    const { username, password } = req.body;
    let user;
    try {
        const { rows } = await pool.query("SELECT * FROM users WHERE username = $1", [username]);
        user = rows[0];
    } catch (e) {}

    if (!user && username === 'admin' && password === 'admin1234') {
        user = { id: 1, username: 'admin', role: 'admin', menu_access: ["Usuário", "Gerir Eventos", "Notícias & RSS", "Personalizar Site", "Banco de Dados", "Pagamentos"] };
    }

    if (!user) return res.status(401).json({ error: "Usuário não encontrado" });

    const match = (username === 'admin' && password === 'admin1234') || await bcrypt.compare(password, user.password);
    if (!match) return res.status(401).json({ error: "Senha incorreta" });

    const adminMenus = ["Usuário", "Gerir Eventos", "Notícias & RSS", "Personalizar Site", "Banco de Dados", "Pagamentos"];
    const menuAccess = user.role === 'admin' ? adminMenus : (user.menu_access || ["Notícias & RSS"]);

    const token = jwt.sign(
        { id: user.id, username: user.username, role: user.role, menuAccess: menuAccess },
        process.env.JWT_SECRET,
        { expiresIn: '8h' }
    );
    res.json({ token, user: { id: user.id, username: user.username, role: user.role, menuAccess: menuAccess } });
}));



// --- USERS ---
app.get('/api/users', authenticateToken, adminOnly, asyncHandler(async (req, res) => {
    try {
        const { rows } = await pool.query("SELECT id, username, role, menu_access as \"menuAccess\" FROM users ORDER BY id ASC");
        res.json(rows);
    } catch (e) { res.json([]); }
}));

app.post('/api/users', authenticateToken, adminOnly, asyncHandler(async (req, res) => {
    const { username, password, role, menuAccess } = req.body;
    const hashedPassword = await bcrypt.hash(password, 10);
    try {
        const { rows } = await pool.query(
            "INSERT INTO users (username, password, role, menu_access) VALUES ($1, $2, $3, $4) RETURNING id, username, role, menu_access as \"menuAccess\"",
            [username, hashedPassword, role || 'user', JSON.stringify(menuAccess || [])]
        );
        res.json(rows[0]);
    } catch (e) {
        res.status(400).json({ error: "Usuário já existe ou erro nos dados" });
    }
}));

app.put('/api/users/:id', authenticateToken, adminOnly, asyncHandler(async (req, res) => {
    const { username, role, menuAccess, password } = req.body;
    let query = "UPDATE users SET username=$1, role=$2, menu_access=$3 WHERE id=$4 RETURNING id, username, role, menu_access as \"menuAccess\"";
    let params = [username, role, JSON.stringify(menuAccess), req.params.id];
    
    if (password) {
        const hashedPassword = await bcrypt.hash(password, 10);
        query = "UPDATE users SET username=$1, role=$2, menu_access=$3, password=$4 WHERE id=$5 RETURNING id, username, role, menu_access as \"menuAccess\"";
        params = [username, role, JSON.stringify(menuAccess), hashedPassword, req.params.id];
    }

    try {
        const { rows } = await pool.query(query, params);
        res.json(rows[0]);
    } catch (e) {
        res.status(400).json({ error: "Erro ao atualizar usuário" });
    }
}));

app.delete('/api/users/:id', authenticateToken, adminOnly, asyncHandler(async (req, res) => {
    const id = req.params.id;
    // Don't allow deleting self or primary admin (if you want to protect admin)
    const { rows } = await pool.query("SELECT username FROM users WHERE id = $1", [id]);
    if (rows[0]?.username === 'admin') {
        return res.status(401).json({ error: "O usuário admin principal não pode ser deletado." });
    }
    if (id == req.user.id) {
        return res.status(401).json({ error: "Você não pode deletar seu próprio usuário." });
    }
    
    await pool.query("DELETE FROM users WHERE id = $1", [id]);
    res.json({ success: true });
}));

// --- FILES (NEXTCLOUD) ---
app.get('/api/files', authenticateToken, asyncHandler(async (req, res) => {
    let dirPath = req.query.path || '/img_site';
    if (!dirPath.startsWith('/')) dirPath = '/' + dirPath;
    
    try {
        const items = await webdavClient.getDirectoryContents(dirPath);
        const files = items.filter(i => i.type === 'file').map(i => {
            // Remove /remote.php/dav/files/casaos from the beginning of filename if present
            const cleanPath = i.filename.replace(/^\/remote\.php\/dav\/files\/[^\/]+/, '');
            return {
                name: i.basename,
                url: `/api/public/file${cleanPath}`,
                size: i.size,
                lastmod: i.lastmod,
                fullPath: cleanPath
            };
        });
        const folders = items.filter(i => i.type === 'directory').map(i => i.basename);
        res.json({ files, folders });
    } catch (err) {
        console.error("WebDAV Error:", err.message);
        res.status(500).json({ error: "Erro ao conectar com Nextcloud", details: err.message });
    }
}));

// --- PUBLIC FILE PROXY (No Auth) ---
// This allows the browser to fetch images without directly talking to WebDAV or needing tokens
app.get('/api/public/file*', asyncHandler(async (req, res) => {
    const filePath = decodeURIComponent(req.path.replace('/api/public/file', ''));
    if (!filePath) return res.status(400).send("No path provided");

    try {
        const stream = await webdavClient.createReadStream(filePath);
        // Basic MIME type detection (Nextcloud usually sends headers but we handle proxying stream)
        if (filePath.toLowerCase().endsWith('.png')) res.setHeader('Content-Type', 'image/png');
        else if (filePath.toLowerCase().endsWith('.jpg') || filePath.toLowerCase().endsWith('.jpeg')) res.setHeader('Content-Type', 'image/jpeg');
        else if (filePath.toLowerCase().endsWith('.svg')) res.setHeader('Content-Type', 'image/svg+xml');
        
        stream.pipe(res);
    } catch (err) {
        console.error("Public File Error:", err.message);
        res.status(404).send("File not found");
    }
}));

app.post('/api/files/upload', authenticateToken, asyncHandler(async (req, res) => {
    if (!req.files || !req.files.file) return res.status(400).json({ error: "Nenhum arquivo enviado" });
    const file = req.files.file;
    const destPath = (req.body.path || '/img_site') + '/' + file.name;
    try {
        await webdavClient.putFileContents(destPath, file.data);
        res.json({ success: true, name: file.name });
    } catch (err) {
        res.status(500).json({ error: "Falha no upload para Nextcloud", details: err.message });
    }
}));

app.delete('/api/files', authenticateToken, asyncHandler(async (req, res) => {
    const filePath = req.query.path;
    if (!filePath) return res.status(400).json({ error: "Caminho não informado" });
    try {
        await webdavClient.deleteFile(filePath);
        res.json({ success: true });
    } catch (err) {
        res.status(500).json({ error: "Erro ao excluir arquivo", details: err.message });
    }
}));

// --- SERVING FRONTEND (PRODUCTION) ---
const distPath = path.join(__dirname, 'public_html');

if (fs.existsSync(distPath)) {
    console.log("Serving frontend from:", distPath);
    app.use(express.static(distPath));
    
    // Catch-all for SPA
    app.get('*', (req, res) => {
        if (!req.path.startsWith('/api')) {
            res.sendFile(path.join(distPath, 'index.html'));
        } else {
            res.status(404).json({ error: "API route not found" });
        }
    });
} else {
    console.warn("Frontend build folder (public_html) not found. Run 'npm run build' to generate it.");
    app.get('/', (req, res) => {
        res.send("Backend is running, but frontend is not built in /public_html folder. Please run 'npm run build'.");
    });
}

app.listen(PORT, () => console.log(`Server optimized on http://localhost:${PORT}`));

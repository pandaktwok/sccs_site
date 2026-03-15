const express = require('express');
const cors = require('cors');
const path = require('path');
const Parser = require('rss-parser');
const fs = require('fs-extra');
const fileUpload = require('express-fileupload');
const { createClient } = require('webdav');
require('dotenv').config();

const parser = new Parser();

const app = express();
const PORT = process.env.PORT || 5000;

// Configuração do CORS
app.use(cors());
app.use(express.json());
app.use(fileUpload());

// Servir arquivos estáticos da pasta uploads
app.use('/uploads', express.static(path.join(__dirname, 'uploads')));

// Configuração Nextcloud WebDAV
const nextcloudClient = createClient(
    process.env.NEXTCLOUD_URL || 'https://nextcloud.sccruzeirodosul.org/remote.php/dav/files/USER/',
    {
        username: process.env.NEXTCLOUD_USERNAME || 'USER',
        password: process.env.NEXTCLOUD_PASSWORD || 'PASSWORD'
    }
);
const NEXTCLOUD_ROOT = process.env.NEXTCLOUD_ROOT || '/img_site';

// Rota de Proxy para visualizar imagens do Nextcloud publicamente
app.get('/api/public/file/*', async (req, res) => {
    try {
        const filePath = '/' + req.params[0];
        const stream = nextcloudClient.createReadStream(filePath);

        // Tentar adivinhar content-type básico
        const ext = path.extname(filePath).toLowerCase();
        const mimeTypes = {
            '.jpg': 'image/jpeg',
            '.jpeg': 'image/jpeg',
            '.png': 'image/png',
            '.gif': 'image/gif',
            '.webp': 'image/webp',
            '.svg': 'image/svg+xml',
            '.pdf': 'application/pdf'
        };

        if (mimeTypes[ext]) {
            res.setHeader('Content-Type', mimeTypes[ext]);
        }

        stream.pipe(res);
    } catch (error) {
        res.status(404).send('Arquivo não encontrado no Nextcloud');
    }
});

// --- MOCKS DE DADOS --- (substituir por conexões de banco de dados no futuro)
let mockEvents = [
    {
        id: 1,
        tag: "Orquestra Jovem SCCS",
        title: "Galeria das Artes Locais",
        date: "15 de Ago",
        time: "19:00",
        locationLink: "https://maps.google.com/?q=Teatro+Municipal",
        description: "Participe de um concerto intimista com nossos alunos avançados apresentando peças fundamentais do repertório clássico ao som de acústica especial.",
        image: "https://lh3.googleusercontent.com/aida-public/AB6AXuBxYnSvapkIW1JWkNCj33_wEz4nEQyGes-JuAbS-_SZRAxQDTc8uB6pCb_sGPeACQ0gzCkOzTus7w-N91-HqrGczhh04Mnsi4ym7c-U7WpGXALcjMTkLRyjIoNwT4RLJ32dmQDVUuxf6JC7QROdS5eNxgfYyA98K74q62UqRTnrXhEtPDynPpN5bKCIzhEPPRqSVDXAy278lKf4A1uYpkA_q_KWn3qKqu5LLcF9-1s5bRx5XRp9sToXbmknDa-K1AVc8tQ9iNJALkQ"
    },
    {
        id: 2,
        tag: "Grupo de Madeiras",
        title: "Visita de Luthier Renomado",
        date: "22 de Ago",
        time: "14:30",
        locationLink: "https://maps.google.com/?q=Conservatorio",
        description: "Nesta tarde exclusiva, os membros da orquestra aprenderão com um mestre construtor sobre os segredos de afinação e manutenção.",
        image: "https://images.unsplash.com/photo-1612225330812-01a9c6b355ec?ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D&auto=format&fit=crop&w=800&q=80"
    },
    {
        id: 3,
        tag: "Roda de Choro SCCS",
        title: "Noite de Choro e Tradição",
        date: "05 de Set",
        time: "20:00",
        locationLink: "https://maps.google.com/?q=Praca+Central",
        description: "Celebrando nossa raiz brasileira com uma extensa programação. Partidas musicais com alunos, professores e convidados.",
        image: "https://lh3.googleusercontent.com/aida-public/AB6AXuCn4cnZzpznkgEWNNQsXKZ2B3kNiU7nR1cecUdDAgia05IvZA5QMFlsBo3MTPvUrXSmI-ucaA4Q6FqpqnbQPoMKfQtgFIZHmS6-2rytFeHXIsScPxQV-eBXFjXy-iPQN5AQr-DJKlfcYnzfaZ96TL6pslA6e_w-sEG5NYNPeNhvq9BsL4G3bFhn4uepe5Whe_Ee4G_5LothLewVSXuqsC1bnUyUVLk-1-PMWrIPAubmPLKl-24bKIQMbC4W6FhrPpIJDPS_oZlnGWo"
    },
    {
        id: 4,
        tag: "Coral Cruzeiro do Sul",
        title: "Apresentação de Outono",
        date: "12 de Set",
        time: "18:00",
        locationLink: "https://maps.google.com/?q=Auditorio+Principal",
        description: "O nosso coral se reúne para apresentar um repertório emocionante misturando música popular brasileira e erudita, com participações especiais.",
        image: "https://images.unsplash.com/photo-1514320291840-2e0a9bf2a9ae?ixlib=rb-4.0.3&auto=format&fit=crop&w=800&q=80"
    }
];

const mockProjects = [
    {
        id: 1,
        tag: "Treinamento Orquestral",
        title: "Sopros e Percussão Jovem",
        status: "Início Flexível",
        image: "https://lh3.googleusercontent.com/aida-public/AB6AXuAhysACTL1JzRViWs-2RTPLgrfnC7sahn5s8edpvicLUw5NrU9lKoF8DOGDkpYCC0HZb4-MNlZZ6S8mgyRrrzr1PFu2UlxmmNpZGT4d9VPa3mYAAXzKrwuvvN5qo7OpVge63IscAXHl3I6j9SR8RhgNpfLJ6zArCkVYNkLWvfDFyxMZXf5JU5IZj7mJXk7ncWVNsceDQ09d1_q3NSGcBGzReJnxIry3D7sBfqqa8fze5GcdhfcHdWDQFyu3tBRrqC3K-GN5gsPXL0Y"
    },
    {
        id: 2,
        tag: "Brasileiro Tradicional",
        title: "Conjunto de Choro Sênior",
        status: "Inscrições Abertas",
        image: "https://lh3.googleusercontent.com/aida-public/AB6AXuCn4cnZzpznkgEWNNQsXKZ2B3kNiU7nR1cecUdDAgia05IvZA5QMFlsBo3MTPvUrXSmI-ucaA4Q6FqpqnbQPoMKfQtgFIZHmS6-2rytFeHXIsScPxQV-eBXFjXy-iPQN5AQr-DJKlfcYnzfaZ96TL6pslA6e_w-sEG5NYNPeNhvq9BsL4G3bFhn4uepe5Whe_Ee4G_5LothLewVSXuqsC1bnUyUVLk-1-PMWrIPAubmPLKl-24bKIQMbC4W6FhrPpIJDPS_oZlnGWo"
    },
    {
        id: 3,
        tag: "Grupo de Performance",
        title: "Banda Cruzeiro do Sul",
        status: "Audições em Breve",
        image: "https://lh3.googleusercontent.com/aida-public/AB6AXuD_HxI2JoIyFIZqGtytFQJ4a5tUV9Syb2xb8Ot5kJ3o0j9sCqyVRj70lUte0r2GfSwxMFnx_qtJVndZ5wiWuBap6M25LNGjREWR_nhgMUSaz40_fXVGH3zrr5_xj8uRrnGlSr9rqdyil_sY9lHmZsN4l_m7CMiEhcq43DAp1ETGou_laHXBKQ3C3bYLzXqJbdYYDKYvyY60LREfVnhGDLUhQSdcSvh3xDj1iI-GzuyeaCrSJaHl85u6hwnE7VqDgq-Z5k__Wf83cfY"
    },
    {
        id: 4,
        tag: "Cordas & Iniciação",
        title: "Orquestra de Cordas Sinfônica",
        status: "Vagas Limitadas",
        image: "https://lh3.googleusercontent.com/aida-public/AB6AXuBxYnSvapkIW1JWkNCj33_wEz4nEQyGes-JuAbS-_SZRAxQDTc8uB6pCb_sGPeACQ0gzCkOzTus7w-N91-HqrGczhh04Mnsi4ym7c-U7WpGXALcjMTkLRyjIoNwT4RLJ32dmQDVUuxf6JC7QROdS5eNxgfYyA98K74q62UqRTnrXhEtPDynPpN5bKCIzhEPPRqSVDXAy278lKf4A1uYpkA_q_KWn3qKqu5LLcF9-1s5bRx5XRp9sToXbmknDa-K1AVc8tQ9iNJALkQ"
    },
    {
        id: 5,
        tag: "Canto Coral",
        title: "Coral Vozes da Sociedade",
        status: "Aulas Noturnas",
        image: "https://images.unsplash.com/photo-1549487928-8d9ed90494df?ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D&auto=format&fit=crop&w=800&q=80",
        imageOpacity: "opacity-80"
    }
];

const mockNews = [
    {
        id: 1,
        title: "Abertura das Oficinas de Música de Inverno",
        source: "Gazeta Cultural",
        link: "#",
        imageUrl: "https://lh3.googleusercontent.com/aida-public/AB6AXuAYPok7pFpnOHrYtndOZ8QTmViG3LWAoIXgaCmiDJ_U-qhBgm5mQ5Tyc9WmKI7fgwGMoElZ5JkEsge86klODjQ9Ft4BcVZfp2i0AdjerFTQqlIVZmQxyS7a7plwGv9xzwOxwpciH4As70q7GqWMSjd4cJQo44oXZ8bCNYOY2_PjctMZKr70x4aRpzUVktEgTIImUjHeNnjMwh_DpvCVhu4m9jHsLQ-uu144vD2_Sv_9m2EIIjGp_nTQU_a8q_fq7R-6zaNdk5w7nIw",
        description: "Neste fim de semana, a Sociedade inicia sua nova temporada de audições abertas ao público..."
    },
    {
        id: 2,
        title: "Prefeitura Anuncia Apoio a Bandas Locais",
        source: "Correio do Estado",
        link: "#",
        imageUrl: "https://lh3.googleusercontent.com/aida-public/AB6AXuDSF6nY7c0-_zznYURrVbumtw8bs8WZuR4gFQZdspDUCVAxG_ha8fiE8mPZ2Bpw_7sHlU56kOn5c-mGjQj5VPfiNcWD3CLi1v9O9bZ73JgxJRjN79dyhdT6FS5ue6CRFolXoEn8Rx1EAldCrcdbyYmU3ZOeZxV2rR730mWoyNh2lpVEsN5_782jJIoFksNPIRsWZKBlFOfYbsWk0j7fpjW0uSQLRisAhmvv8H4i468di_2gTO9eaKKzG7M0TBN4UEjJTE_Bhog3YJ4",
        description: "Em evento recente, autoridades garantiram o repasse de fundos para conservação instrumental."
    }
];

let mockUsers = [
    {
        id: 1,
        username: "admin",
        password: "admin", // Em produção use hashing (bcrypt)
        role: "admin",
        menuAccess: ["Usuário", "Gerir Eventos", "Notícias & RSS", "Banco de Dados", "Pagamentos"]
    },
    {
        id: 2,
        username: "editor",
        password: "123",
        role: "user",
        menuAccess: ["Gerir Eventos", "Notícias & RSS"]
    }
];

// --- ROTAS DA API ---

app.get('/api/events', (req, res) => {
    // Simulando delay para mostrar animações de loading no frontend
    setTimeout(() => {
        res.json(mockEvents);
    }, 500);
});

app.post('/api/events', (req, res) => {
    const { title, tag, date, time, image, description } = req.body;

    if (!title || !tag || !date || !time || !image || !description) {
        return res.status(400).json({ error: "Campos obrigatórios ausentes" });
    }

    const newEvent = {
        id: Date.now(),
        title, tag, date, time, image, description,
        locationLink: req.body.locationLink || ""
    };
    mockEvents.push(newEvent);
    res.status(201).json(newEvent);
});

app.put('/api/events/:id', (req, res) => {
    const id = parseInt(req.params.id);
    const { title, tag, date, time, image, description } = req.body;

    if (!title || !tag || !date || !time || !image || !description) {
        return res.status(400).json({ error: "Campos obrigatórios ausentes" });
    }

    const index = mockEvents.findIndex(ev => ev.id === id);
    if (index !== -1) {
        mockEvents[index] = {
            id, title, tag, date, time, image, description,
            locationLink: req.body.locationLink || ""
        };
        res.json(mockEvents[index]);
    } else {
        res.status(404).json({ error: "Evento não encontrado" });
    }
});

app.delete('/api/events/:id', (req, res) => {
    const id = parseInt(req.params.id);
    mockEvents = mockEvents.filter(ev => ev.id !== id);
    res.status(204).send();
});

app.get('/api/partners', async (req, res) => {
    try {
        const logoDir = path.join(NEXTCLOUD_ROOT, 'logos').replace(/\\/g, '/');
        const items = await nextcloudClient.getDirectoryContents(logoDir);

        const logos = items
            .filter(item => item.type === 'file' && item.basename.match(/\.(jpg|jpeg|png|gif|webp|svg)$/i))
            .map(item => ({
                id: item.etag,
                name: item.basename,
                url: `${req.protocol}://${req.get('host')}/api/public/file${item.filename}`
            }));

        res.json(logos);
    } catch (error) {
        // Se a pasta não existir ou erro de conexão, retorna array vazio
        res.json([]);
    }
});

app.get('/api/projects', (req, res) => {
    setTimeout(() => {
        res.json(mockProjects);
    }, 500);
});

// --- RSS CONFIGURATION ---
const rssFeeds = [
    'https://novavenezaonline.com.br/feed',
    'https://engeplus.com.br/rss',
    'https://agorasul.com.br/feed',
    'https://tnsul.com/feed',
    'https://canalicara.com/rss'
];

const rssTags = [
    "SCCS",
    "Sociedade Cultural Cruzeiro do Sul",
    "Chorinho Carvoeiro",
    "Músicos do Futuro",
    "Garantindo o Direito da Pessoa Idosa"
];

const rssFallbackTags = [
    "cultura",
    "FMI",
    "FIA",
    "editais",
    "Criciúma",
    "Criciuma"
];

let cachedNews = [];
let lastFetchTime = 0;

async function fetchAndFilterRSS() {
    const now = Date.now();
    // Cache for 15 minutes to avoid rate limits
    if (cachedNews.length > 0 && (now - lastFetchTime < 15 * 60 * 1000)) {
        return cachedNews;
    }

    const allNews = [];
    const allFallbackNews = [];
    const allFreshNews = [];
    const tagsLower = rssTags.map(t => t.toLowerCase());
    const fallbackTagsLower = rssFallbackTags.map(t => t.toLowerCase());

    await Promise.allSettled(rssFeeds.map(async (feedUrl) => {
        try {
            console.log(`[RSS] Buscando feed: ${feedUrl}`);
            const feed = await parser.parseURL(feedUrl);
            let foundWithTag = 0;
            let foundWithFallbackTag = 0;

            feed.items.forEach(item => {
                const titleLower = (item.title || '').toLowerCase();
                const contentLower = (item.contentSnippet || item.content || '').toLowerCase();

                // Check if any tag is present in title or content
                const matchedTag = tagsLower.find(tag => titleLower.includes(tag) || contentLower.includes(tag));
                const matchedFallbackTag = fallbackTagsLower.find(tag => titleLower.includes(tag) || contentLower.includes(tag));

                const newsItem = {
                    id: Buffer.from(item.link || item.guid || '').toString('base64').substring(0, 10),
                    title: item.title,
                    source: feed.title || new URL(feedUrl).hostname,
                    link: item.link,
                    imageUrl: (item.content?.match(/<img[^>]+src="([^">]+)"/) || [])[1] ||
                        "https://images.unsplash.com/photo-1504711434969-e33886168f5c?ixlib=rb-4.0.3&auto=format&fit=crop&w=800&q=80",
                    description: item.contentSnippet || item.content?.replace(/<[^>]*>?/gm, '').substring(0, 150) + "...",
                    pubDate: item.isoDate || item.pubDate
                };

                if (matchedTag) {
                    console.log(`[RSS] 🎯 MATCH PRINCIPAL ENCONTRADO! Tag: "${matchedTag}" | Notícia: ${item.title}`);
                    allNews.push(newsItem);
                    foundWithTag++;
                } else if (matchedFallbackTag) {
                    console.log(`[RSS] 🔵 MATCH SECUNDÁRIO (Plano B)! Tag: "${matchedFallbackTag}" | Notícia: ${item.title}`);
                    allFallbackNews.push(newsItem);
                    foundWithFallbackTag++;
                }

                allFreshNews.push(newsItem);
            });
            console.log(`[RSS] Concluído ${feedUrl}. Encontradas Principais: ${foundWithTag} | Secundárias: ${foundWithFallbackTag} de ${feed.items.length} totais.`);

        } catch (error) {
            console.error(`[RSS] ❌ Erro ao buscar feed ${feedUrl}:`, error.message);
        }
    }));

    // Sort by most recent
    allNews.sort((a, b) => new Date(b.pubDate) - new Date(a.pubDate));
    allFallbackNews.sort((a, b) => new Date(b.pubDate) - new Date(a.pubDate));
    allFreshNews.sort((a, b) => new Date(b.pubDate) - new Date(a.pubDate));

    console.log(`[RSS] Resumo Final: ${allNews.length} tags principais, ${allFallbackNews.length} tags secundárias (Plano B). Fallback banco de testes (antigas): ${allNews.length === 0 && allFallbackNews.length === 0}`);

    let finalNews;
    if (allNews.length > 0) {
        finalNews = allNews;
    } else if (allFallbackNews.length > 0) {
        console.log(`[RSS] Usando Notícias do Plano B (Secundárias)`);
        finalNews = allFallbackNews;
    } else {
        console.log(`[RSS] Usando Notícias Fictícias de Banco de Testes (Fallback final)`);
        finalNews = mockNews;
    }

    cachedNews = finalNews.slice(0, 1); // keep only 1 news item as requested
    console.log(`[RSS] Salvando cache. Próxima notícia a ser exibida: ${cachedNews[0].title}`);
    lastFetchTime = Date.now();
    return cachedNews;
}

app.get('/api/news', async (req, res) => {
    try {
        const news = await fetchAndFilterRSS();
        res.json(news);
    } catch (error) {
        res.status(500).json({ error: "Failed to fetch RSS feeds" });
    }
});

app.post('/api/rss/refresh', async (req, res) => {
    try {
        console.log('[RSS] Recebida requisição para limpeza de cache e recarregamento dos feeds.');
        cachedNews = [];
        lastFetchTime = 0;
        await fetchAndFilterRSS(); // fetch to populate the cache immediately
        res.json({ message: "RSS Feeds refreshed successfully." });
    } catch (error) {
        res.status(500).json({ error: "Failed to refresh RSS feeds" });
    }
});

// --- AUTHENTICATION ---
app.post('/api/auth/login', (req, res) => {
    const { username, password } = req.body;
    const user = mockUsers.find(u => u.username === username && u.password === password);

    if (user) {
        // Em um app real, retornaríamos um JWT
        const { password, ...userWithoutPassword } = user;
        res.json(userWithoutPassword);
    } else {
        res.status(401).json({ error: "Usuário ou senha inválidos" });
    }
});

// --- USER MANAGEMENT (Admin Only) ---
app.get('/api/users', (req, res) => {
    // Simplificação: retornamos sem senha
    const users = mockUsers.map(({ password, ...u }) => u);
    res.json(users);
});

app.post('/api/users', (req, res) => {
    const { username, password, role, menuAccess } = req.body;
    
    if (!username || !password) {
        return res.status(400).json({ error: "Username e password são obrigatórios" });
    }

    if (mockUsers.some(u => u.username === username)) {
        return res.status(400).json({ error: "Usuário já existe" });
    }

    const newUser = {
        id: Date.now(),
        username,
        password,
        role: role || 'user',
        menuAccess: menuAccess || []
    };

    mockUsers.push(newUser);
    const { password: _, ...userWithoutPassword } = newUser;
    res.status(201).json(userWithoutPassword);
});

app.put('/api/users/:id', (req, res) => {
    const id = parseInt(req.params.id);
    const { password, role, menuAccess } = req.body;
    
    const index = mockUsers.findIndex(u => u.id === id);
    if (index === -1) return res.status(404).json({ error: "Usuário não encontrado" });

    if (password) mockUsers[index].password = password;
    if (role) mockUsers[index].role = role;
    if (menuAccess) mockUsers[index].menuAccess = menuAccess;

    const { password: _, ...userWithoutPassword } = mockUsers[index];
    res.json(userWithoutPassword);
});

app.delete('/api/users/:id', (req, res) => {
    const id = parseInt(req.params.id);
    if (mockUsers.length <= 1) return res.status(400).json({ error: "Não é possível remover o último usuário" });
    
    mockUsers = mockUsers.filter(u => u.id !== id);
    res.status(204).send();
});

app.get('/api/settings', (req, res) => res.status(501).json({ error: "Not Implemented" }));

// --- GERENCIAMENTO DE ARQUIVOS (DATABASE VISUAL) ---
const UPLOADS_DIR = path.join(__dirname, 'uploads');

// Listar arquivos e pastas do Nextcloud
app.get('/api/files', async (req, res) => {
    try {
        const subPath = req.query.path || '';
        const targetDir = path.join(NEXTCLOUD_ROOT, subPath).replace(/\\/g, '/');

        const items = await nextcloudClient.getDirectoryContents(targetDir);

        const folders = items
            .filter(item => item.type === 'directory')
            .map(item => path.relative(NEXTCLOUD_ROOT, item.filename).replace(/\\/g, '/'));

        const files = items
            .filter(item => item.type === 'file')
            .map(item => {
                const relativePath = path.relative(NEXTCLOUD_ROOT, item.filename).replace(/\\/g, '/');
                return {
                    name: item.basename,
                    url: `${req.protocol}://${req.get('host')}/api/public/file${item.filename}`,
                    path: relativePath,
                    fullPath: item.filename
                };
            });

        res.json({ files, folders });
    } catch (error) {
        res.status(500).json({ error: "Erro ao conectar com Nextcloud: " + error.message });
    }
});

// Upload de arquivo para o Nextcloud
app.post('/api/upload', async (req, res) => {
    try {
        if (!req.files || Object.keys(req.files).length === 0) {
            return res.status(400).json({ error: 'Nenhum arquivo enviado.' });
        }

        const file = req.files.file;
        const subPath = req.body.path || '';
        const targetDir = path.join(NEXTCLOUD_ROOT, subPath).replace(/\\/g, '/');

        // Garantir que a pasta existe (WebDAV não tem ensureDir como fs-extra)
        // Simplificação: tentamos criar a pasta se não for a raiz
        if (subPath) {
            try {
                await nextcloudClient.createDirectory(targetDir);
            } catch (e) {
                // Provavelmente já existe
            }
        }

        const uploadPath = path.join(targetDir, file.name).replace(/\\/g, '/');
        await nextcloudClient.putFileContents(uploadPath, file.data);

        res.json({
            message: 'Upload concluído no Nextcloud!',
            url: `${req.protocol}://${req.get('host')}/api/public/file${uploadPath}`
        });
    } catch (error) {
        res.status(500).json({ error: "Erro no upload Nextcloud: " + error.message });
    }
});

// Excluir arquivo do Nextcloud
app.delete('/api/files', async (req, res) => {
    try {
        const filePath = req.query.path;
        if (!filePath) return res.status(400).json({ error: "Caminho não fornecido" });

        const targetPath = path.join(NEXTCLOUD_ROOT, filePath).replace(/\\/g, '/');

        await nextcloudClient.deleteFile(targetPath);
        res.json({ message: "Arquivo excluído do Nextcloud com sucesso" });
    } catch (error) {
        res.status(500).json({ error: "Erro ao excluir no Nextcloud: " + error.message });
    }
});


// Servir a build do frontend
// IMPORTANTE para a Hostinger: Apontar diretório 'public' ou 'frontend/dist' 
const buildPath = path.join(__dirname, 'frontend/dist');
app.use(express.static(buildPath));

app.get('*', (req, res) => {
    res.sendFile(path.join(buildPath, 'index.html'));
});

// Inicialização do Servidor (apenas se executado diretamente)
if (require.main === module) {
    app.listen(PORT, () => {
        console.log(`Backend server running on http://localhost:${PORT}`);
    });
}

module.exports = app;

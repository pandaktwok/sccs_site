const express = require('express');
const cors = require('cors');
const path = require('path');
require('dotenv').config();

const app = express();
const PORT = process.env.PORT || 5000;

// Configuração do CORS
app.use(cors());
app.use(express.json());

// --- MOCKS DE DADOS --- (substituir por conexões de banco de dados no futuro)
const mockEvents = [
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

// --- ROTAS DA API ---

app.get('/api/events', (req, res) => {
    // Simulando delay para mostrar animações de loading no frontend
    setTimeout(() => {
        res.json(mockEvents);
    }, 500);
});

app.get('/api/projects', (req, res) => {
    setTimeout(() => {
        res.json(mockProjects);
    }, 500);
});

app.get('/api/news', (req, res) => {
    setTimeout(() => {
        res.json(mockNews);
    }, 500);
});

// Boilerplates (esqueletos) futuros de backend e integrações DB
app.post('/api/auth/login', (req, res) => res.status(501).json({ error: "Not Implemented" }));
app.get('/api/settings', (req, res) => res.status(501).json({ error: "Not Implemented" }));
app.get('/api/members', (req, res) => res.status(501).json({ error: "Not Implemented" }));
app.get('/api/documents', (req, res) => res.status(501).json({ error: "Not Implemented" }));
app.get('/api/registrations', (req, res) => res.status(501).json({ error: "Not Implemented" }));


// Servir a build do frontend
// IMPORTANTE para a Hostinger: Apontar diretório 'public' ou 'frontend/dist' 
const buildPath = path.join(__dirname, 'frontend/dist');
app.use(express.static(buildPath));

app.get('*', (req, res) => {
    res.sendFile(path.join(buildPath, 'index.html'));
});

// Inicialização do Servidor
app.listen(PORT, () => {
    console.log(`Backend server running on http://localhost:${PORT}`);
});

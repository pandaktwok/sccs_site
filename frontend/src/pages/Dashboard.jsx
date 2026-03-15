import React, { useState, useEffect } from 'react';
import { Link, useNavigate } from 'react-router-dom';

const Icon = ({ name, size = 20, className = "" }) => (
    <span className={`material-symbols-outlined ${className}`} style={{ fontSize: size, verticalAlign: 'middle' }}>
        {name}
    </span>
);

export default function Dashboard() {
    const navigate = useNavigate();
    const [currentUser, setCurrentUser] = useState(null);
    const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);
    const [activeTab, setActiveTab] = useState('Notícias & RSS');
    const [previewImage, setPreviewImage] = useState(null);

    // --- Permissions Logic ---
    const [previewUserId, setPreviewUserId] = useState(null);

    useEffect(() => {
        const savedUser = localStorage.getItem('sccs_user');
        if (!savedUser) {
            navigate('/login');
            return;
        }
        const parsed = JSON.parse(savedUser);
        setCurrentUser(parsed.user); // currentUser is now the nested user object
    }, [navigate]);

    // --- RSS State ---
    const [feeds, setFeeds] = useState([]);
    const [tags, setTags] = useState([]);

    const loadFeeds = async () => {
        try {
            const res = await fetch('/api/feeds');
            if (res.ok) setFeeds(await res.json());
        } catch (e) { console.error(e); }
    };

    const loadTags = async () => {
        try {
            const res = await fetch('/api/tags');
            if (res.ok) setTags(await res.json());
        } catch (e) { console.error(e); }
    };

    // --- SITE SETTINGS ---
    const [homeSettings, setHomeSettings] = useState({
        heroImage: '',
        heroTitle: '',
        heroText: '',
        projectsTitle: '',
        projectsText: '',
        showEvents: true,
        showNews: true,
        donateMessage: '',
        donateTitle: '',
        donateText: '',
        footerTitle: '',
        footerText: '',
        footerEmail: '',
        footerPhone: '',
        footerAddress: '',
        footerMapsUrl: '',
        socials: {
            instagram: { active: false, link: "" },
            youtube: { active: false, link: "" },
            facebook: { active: false, link: "" },
            share: { active: false, link: "" }
        }
    });
    const [projects, setProjects] = useState([]);
    const [donations, setDonations] = useState([]);
    const [isSavingSettings, setIsSavingSettings] = useState(false);
    const [activeSettingsTab, setActiveSettingsTab] = useState('Início');

    // --- USERS State ---
    const [users, setUsers] = useState([]);
    const [newUser, setNewUser] = useState({ id: null, username: '', password: '', confirmPassword: '', role: 'user', menuAccess: [] });
    const [userError, setUserError] = useState('');

    const loadUsers = async () => {
        try {
            const savedUser = JSON.parse(localStorage.getItem('sccs_user'));
            const res = await fetch('/api/users', {
                headers: { 'Authorization': `Bearer ${savedUser.token}` }
            });
            if (res.ok) {
                const data = await res.json();
                setUsers(data);
            }
        } catch (err) {
            console.error("Erro ao carregar usuários:", err);
        }
    };

    const loadDonations = async () => {
        try {
            const res = await fetch('/api/donations');
            if (res.ok) setDonations(await res.json());
        } catch (e) {
            console.error("Erro ao carregar doações:", e);
        }
    };

    const addDonation = async () => {
        try {
            const savedUser = JSON.parse(localStorage.getItem('sccs_user'));
            const res = await fetch('/api/donations', {
                method: 'POST',
                headers: { 
                    'Content-Type': 'application/json',
                    'Authorization': `Bearer ${savedUser.token}`
                },
                body: JSON.stringify({
                    tabName: "Nova Aba",
                    title: "Título da Doação",
                    description: "Descrição da conta",
                    banco: "",
                    agencia: "",
                    conta: "",
                    cnpj: "",
                    logo: ""
                })
            });
            if (res.ok) {
                const created = await res.json();
                setDonations([...donations, created]);
            }
        } catch (e) {
            console.error("Erro ao adicionar doação:", e);
        }
    };

    const deleteDonation = async (id) => {
        if (!window.confirm("Deseja realmente excluir esta aba de doação?")) return;
        try {
            const savedUser = JSON.parse(localStorage.getItem('sccs_user'));
            const res = await fetch(`/api/donations/${id}`, { 
                method: 'DELETE',
                headers: { 'Authorization': `Bearer ${savedUser.token}` }
            });
            if (res.ok) {
                setDonations(prev => prev.filter(d => d.id !== id));
            }
        } catch (e) {
            console.error("Erro ao excluir doação:", e);
        }
    };

    const saveDonation = async (id, updatedData) => {
        try {
            const savedUser = JSON.parse(localStorage.getItem('sccs_user'));
            const res = await fetch(`/api/donations/${id}`, {
                method: 'PUT',
                headers: { 
                    'Content-Type': 'application/json',
                    'Authorization': `Bearer ${savedUser.token}`
                },
                body: JSON.stringify(updatedData)
            });
            if (res.ok) {
                const updated = await res.json();
                setDonations(prev => prev.map(d => d.id === id ? updated : d));
            }
        } catch (e) {
            console.error("Erro ao salvar doação:", e);
        }
    };

    const loadHomeSettings = async () => {
        try {
            const savedUser = JSON.parse(localStorage.getItem('sccs_user'));
            const res = await fetch('/api/settings/home', {
                headers: { 'Authorization': `Bearer ${savedUser.token}` }
            });
            if (res.ok) setHomeSettings(await res.json());
        } catch (e) {
            console.error("Erro ao carregar configurações da home:", e);
        }
    };

    const loadProjects = async () => {
        try {
            const savedUser = JSON.parse(localStorage.getItem('sccs_user'));
            const res = await fetch('/api/projects', {
                headers: { 'Authorization': `Bearer ${savedUser.token}` }
            });
            if (res.ok) setProjects(await res.json());
        } catch (e) {
            console.error("Erro ao carregar projetos:", e);
        }
    };

    const saveProject = async (id, updatedData) => {
        try {
            const savedUser = JSON.parse(localStorage.getItem('sccs_user'));
            const res = await fetch(`/api/projects/${id}`, {
                method: 'PUT',
                headers: { 
                    'Content-Type': 'application/json',
                    'Authorization': `Bearer ${savedUser.token}`
                },
                body: JSON.stringify(updatedData)
            });
            if (res.ok) {
                const updated = await res.json();
                setProjects(prev => prev.map(p => p.id === id ? updated : p));
                alert("Projeto atualizado com sucesso!");
            }
        } catch (e) {
            console.error("Erro ao salvar projeto:", e);
        }
    };

    const addProject = async () => {
        try {
            const savedUser = JSON.parse(localStorage.getItem('sccs_user'));
            const res = await fetch('/api/projects', {
                method: 'POST',
                headers: { 
                    'Content-Type': 'application/json',
                    'Authorization': `Bearer ${savedUser.token}`
                },
                body: JSON.stringify({
                    title: "Novo Projeto",
                    tag: "Categoria",
                    image: "https://images.unsplash.com/photo-1514320291840-2e0a9bf2a9ae?auto=format&fit=crop&w=400&q=80",
                    btnText: "Conheça mais",
                    btnLink: "#"
                })
            });
            if (res.ok) {
                const created = await res.json();
                setProjects([...projects, created]);
            }
        } catch (e) {
            console.error("Erro ao adicionar projeto:", e);
        }
    };

    const deleteProject = async (id) => {
        if (!window.confirm("Deseja realmente excluir este projeto? Esta ação não pode ser desfeita.")) return;
        try {
            const savedUser = JSON.parse(localStorage.getItem('sccs_user'));
            const res = await fetch(`/api/projects/${id}`, { 
                method: 'DELETE',
                headers: { 'Authorization': `Bearer ${savedUser.token}` }
            });
            if (res.ok) {
                setProjects(prev => prev.filter(p => p.id !== id));
            }
        } catch (e) {
            console.error("Erro ao excluir projeto:", e);
        }
    };

    const saveHomeSettings = async () => {
        setIsSavingSettings(true);
        try {
            const savedUser = JSON.parse(localStorage.getItem('sccs_user'));
            const res = await fetch('/api/settings/home', {
                method: 'PUT',
                headers: { 
                    'Content-Type': 'application/json',
                    'Authorization': `Bearer ${savedUser.token}`
                },
                body: JSON.stringify(homeSettings)
            });
            if (res.ok) {
                alert("Configurações salvas com sucesso!");
            }
        } catch (e) {
            console.error("Erro ao salvar configurações:", e);
            alert("Erro ao salvar configurações.");
        } finally {
            setIsSavingSettings(false);
        }
    };

    useEffect(() => {
        if (activeTab === 'Personalizar Site') {
            loadHomeSettings();
            loadProjects();
            loadDonations();
        }
    }, [activeTab]);

    useEffect(() => {
        if (currentUser?.role === 'admin') {
            loadUsers();
        }
    }, [currentUser]);

    const handleAddUser = async (e) => {
        e.preventDefault();
        setUserError('');

        if (!newUser.username.trim() || !newUser.password) {
            setUserError('Preencha os campos obrigatórios.');
            return;
        }

        if (newUser.password !== newUser.confirmPassword) {
            setUserError('As senhas não coincidem.');
            return;
        }

        try {
            const savedUser = JSON.parse(localStorage.getItem('sccs_user'));
            const url = newUser.id ? `/api/users/${newUser.id}` : '/api/users';
            const method = newUser.id ? 'PUT' : 'POST';

            const res = await fetch(url, {
                method,
                headers: { 
                    'Content-Type': 'application/json',
                    'Authorization': `Bearer ${savedUser.token}`
                },
                body: JSON.stringify(newUser)
            });

            if (res.ok) {
                loadUsers();
                setNewUser({ id: null, username: '', password: '', confirmPassword: '', role: 'user', menuAccess: [] });
            } else {
                const data = await res.json();
                setUserError(data.error || 'Erro ao salvar usuário.');
            }
        } catch (error) {
            console.error(error);
            setUserError('Erro de servidor.');
        }
    };

    const handleEditUser = (user) => {
        setNewUser({
            ...user,
            password: '', // Don't show hashed password
            confirmPassword: ''
        });
        // Scroll to form or just let user see it
        const formElement = document.querySelector('form');
        if (formElement) formElement.scrollIntoView({ behavior: 'smooth' });
    };

    const handleToggleUserPermission = async (userId, menuName) => {
        const user = users.find(u => u.id === userId);
        if (!user) return;

        const newAccess = user.menuAccess.includes(menuName)
            ? user.menuAccess.filter(m => m !== menuName)
            : [...user.menuAccess, menuName];

        try {
            const savedUser = JSON.parse(localStorage.getItem('sccs_user'));
            const res = await fetch(`/api/users/${userId}`, {
                method: 'PUT',
                headers: { 
                    'Content-Type': 'application/json',
                    'Authorization': `Bearer ${savedUser.token}`
                },
                body: JSON.stringify({ ...user, menuAccess: newAccess })
            });

            if (res.ok) {
                const updated = await res.json();
                setUsers(prev => prev.map(u => u.id === userId ? updated : u));
            }
        } catch (e) {
            console.error("Erro ao atualizar permissão:", e);
        }
    };

    const togglePermission = (menuName) => {
        const newAccess = newUser.menuAccess.includes(menuName)
            ? newUser.menuAccess.filter(m => m !== menuName)
            : [...newUser.menuAccess, menuName];
        setNewUser({ ...newUser, menuAccess: newAccess });
    };

    const handleRemoveUser = async (id) => {
        if (!window.confirm("Deseja remover este usuário?")) return;
        try {
            const savedUser = JSON.parse(localStorage.getItem('sccs_user'));
            const res = await fetch(`/api/users/${id}`, { 
                method: 'DELETE',
                headers: { 'Authorization': `Bearer ${savedUser.token}` }
            });
            if (res.ok) loadUsers();
        } catch (error) {
            console.error(error);
        }
    };


    // --- EVENTS State ---
    const [events, setEvents] = useState([]);

    useEffect(() => {
        const savedUser = JSON.parse(localStorage.getItem('sccs_user'));
        if (savedUser?.token) {
            fetch('/api/events', {
                headers: { 'Authorization': `Bearer ${savedUser.token}` }
            })
                .then(res => res.json())
                .then(data => setEvents(data))
                .catch(err => console.error("Erro ao carregar eventos:", err));
        }
    }, [currentUser]);

    const [newEvent, setNewEvent] = useState({
        title: '', tag: '', date: '', time: '', locationLink: '', description: '', image: ''
    });

    const handleAddEvent = async (e) => {
        e.preventDefault();
        if (!newEvent.title.trim() || !newEvent.date.trim()) return;

        try {
            const savedUser = JSON.parse(localStorage.getItem('sccs_user'));
            if (newEvent.id) {
                // Edit existing
                const res = await fetch(`/api/events/${newEvent.id}`, {
                    method: 'PUT',
                    headers: { 
                        'Content-Type': 'application/json',
                        'Authorization': `Bearer ${savedUser.token}`
                    },
                    body: JSON.stringify(newEvent)
                });
                if (res.ok) {
                    const updatedEvent = await res.json();
                    setEvents(events.map(ev => ev.id === newEvent.id ? updatedEvent : ev));
                }
            } else {
                // Create new
                const res = await fetch('/api/events', {
                    method: 'POST',
                    headers: { 
                        'Content-Type': 'application/json',
                        'Authorization': `Bearer ${savedUser.token}`
                    },
                    body: JSON.stringify(newEvent)
                });
                if (res.ok) {
                    const createdEvent = await res.json();
                    setEvents([...events, createdEvent]);
                }
            }
            setNewEvent({ title: '', tag: '', date: '', time: '', locationLink: '', description: '', image: '' });
        } catch (error) {
            console.error("Erro ao salvar evento:", error);
            alert("Erro de comunicação com o servidor.");
        }
    };

    const handleRemoveEvent = async (id) => {
        if (!window.confirm("Deseja realmente excluir este evento?")) return;
        try {
            const savedUser = JSON.parse(localStorage.getItem('sccs_user'));
            const res = await fetch(`/api/events/${id}`, {
                method: 'DELETE',
                headers: { 'Authorization': `Bearer ${savedUser.token}` }
            });
            if (res.ok) {
                setEvents(events.filter(ev => ev.id !== id));
            }
        } catch (error) {
            console.error("Erro ao remover evento:", error);
        }
    };

    const handleEditEvent = (event) => {
        setNewEvent({ ...event });
    };

    const [newFeedUrl, setNewFeedUrl] = useState('');
    const [newFeedVerified, setNewFeedVerified] = useState(true);
    const [newTagName, setNewTagName] = useState('');

    const handleAddFeed = async (e) => {
        e.preventDefault();
        if (!newFeedUrl.trim()) return;
        try {
            const savedUser = JSON.parse(localStorage.getItem('sccs_user'));
            const res = await fetch('/api/feeds', {
                method: 'POST',
                headers: { 
                    'Content-Type': 'application/json',
                    'Authorization': `Bearer ${savedUser.token}`
                },
                body: JSON.stringify({ url: newFeedUrl })
            });
            if (res.ok) {
                const created = await res.json();
                setFeeds([...feeds, created]);
                setNewFeedUrl('');
            }
        } catch (e) { console.error(e); }
    };

    const handleRemoveFeed = async (id) => {
        if (!window.confirm("Remover este feed?")) return;
        try {
            const savedUser = JSON.parse(localStorage.getItem('sccs_user'));
            const res = await fetch(`/api/feeds/${id}`, {
                method: 'DELETE',
                headers: { 'Authorization': `Bearer ${savedUser.token}` }
            });
            if (res.ok) setFeeds(feeds.filter(f => f.id !== id));
        } catch (e) { console.error(e); }
    };

    const handleToggleVerification = (id) => {
        // Just visual toggle or implement on backend if needed
        setFeeds(feeds.map(f => f.id === id ? { ...f, verified: !f.verified } : f));
    }

    const handleAddTag = async (e) => {
        e.preventDefault();
        if (!newTagName.trim()) return;
        try {
            const savedUser = JSON.parse(localStorage.getItem('sccs_user'));
            const res = await fetch('/api/tags', {
                method: 'POST',
                headers: { 
                    'Content-Type': 'application/json',
                    'Authorization': `Bearer ${savedUser.token}`
                },
                body: JSON.stringify({ name: newTagName })
            });
            if (res.ok) {
                const created = await res.json();
                setTags([...tags, created]);
                setNewTagName('');
            }
        } catch (e) { console.error(e); }
    };

    const handleRemoveTag = async (id) => {
        try {
            const savedUser = JSON.parse(localStorage.getItem('sccs_user'));
            const res = await fetch(`/api/tags/${id}`, {
                method: 'DELETE',
                headers: { 'Authorization': `Bearer ${savedUser.token}` }
            });
            if (res.ok) setTags(tags.filter(t => t.id !== id));
        } catch (e) { console.error(e); }
    };

    const [isRefreshing, setIsRefreshing] = useState(false);

    const handleRefreshRSS = async () => {
        setIsRefreshing(true);
        try {
            const savedUser = JSON.parse(localStorage.getItem('sccs_user'));
            const res = await fetch('/api/rss/refresh', { 
                method: 'POST',
                headers: { 'Authorization': `Bearer ${savedUser.token}` }
            });
            if (res.ok) {
                alert('Feeds RSS reiniciados e atualizados!');
            } else {
                alert('Erro ao atualizar feeds.');
            }
        } catch (error) {
            console.error(error);
            alert('Falha na comunicação com o servidor. O backend está rodando?');
        } finally {
            setIsRefreshing(false);
        }
    };

    // --- DATABASE State ---
    const [fileItems, setFileItems] = useState({ files: [], folders: [] });
    const [currentPath, setCurrentPath] = useState('');
    const [isUploading, setIsUploading] = useState(false);
    const [uploadProgress, setUploadProgress] = useState(0);

    const loadFiles = async (path = '') => {
        try {
            const savedUser = JSON.parse(localStorage.getItem('sccs_user'));
            const res = await fetch(`/api/files?path=${path}`, {
                headers: { 'Authorization': `Bearer ${savedUser.token}` }
            });
            if (res.ok) {
                const data = await res.json();
                setFileItems(data);
                setCurrentPath(path);
            }
        } catch (error) {
            console.error("Erro ao carregar arquivos:", error);
        }
    };

    useEffect(() => {
        if (activeTab === 'Notícias & RSS') {
            loadFeeds();
            loadTags();
        }
        if (activeTab === 'Banco de Dados') {
            loadFiles();
        }
        if (activeTab === 'Personalizar Site') {
            loadHomeSettings();
            loadProjects();
        }
        if (activeTab === 'Gerir Eventos') {
            loadEvents();
        }
        if (activeTab === 'Pagamentos') {
            loadDonations();
        }
        if (activeTab === 'Usuário') {
            loadUsers();
        }
    }, [activeTab]);

    const handleUpload = async (e) => {
        const file = e.target.files[0];
        if (!file) return;

        setIsUploading(true);
        const formData = new FormData();
        formData.append('file', file);
        formData.append('path', currentPath || '/img_site');

        try {
            const savedUser = JSON.parse(localStorage.getItem('sccs_user'));
            const res = await fetch('/api/files/upload', {
                method: 'POST',
                headers: { 'Authorization': `Bearer ${savedUser.token}` },
                body: formData
            });
            if (res.ok) {
                loadFiles(currentPath);
            } else {
                alert('Erro no upload.');
            }
        } catch (error) {
            console.error("Erro no upload:", error);
        } finally {
            setIsUploading(false);
        }
    };

    const handleDeleteFile = async (filePath) => {
        if (!window.confirm("Excluir este arquivo?")) return;
        try {
            const savedUser = JSON.parse(localStorage.getItem('sccs_user'));
            const res = await fetch(`/api/files?path=${filePath}`, {
                method: 'DELETE',
                headers: { 'Authorization': `Bearer ${savedUser.token}` }
            });
            if (res.ok) {
                loadFiles(currentPath);
            }
        } catch (error) {
            console.error("Erro ao excluir:", error);
        }
    };

    const copyToClipboard = (text) => {
        navigator.clipboard.writeText(text);
        alert("URL copiada!");
    };

    const handleLogout = () => {
        localStorage.removeItem('sccs_user');
        navigate('/login');
    };

    const allNavItems = [
        { name: 'Usuário', icon: <Icon name="person" /> },
        { name: 'Gerir Eventos', icon: <Icon name="calendar_today" /> },
        { name: 'Notícias & RSS', icon: <Icon name="rss_feed" /> },
        { name: 'Personalizar Site', icon: <Icon name="auto_fix_high" /> },
        { name: 'Banco de Dados', icon: <Icon name="database" /> },
        { name: 'Pagamentos', icon: <Icon name="credit_card" />, href: 'https://pagamentos.sccruzeirodosul.org/' },
    ];

    // Filter items based on user permissions or preview
    const activeNavItems = (() => {
        if (previewUserId) {
            const previewedUser = users.find(u => u.id === previewUserId);
            return allNavItems.filter(item => (previewedUser?.menuAccess || []).includes(item.name));
        }
        if (currentUser?.role === 'admin') return allNavItems;
        return allNavItems.filter(item => (currentUser?.menuAccess || []).includes(item.name));
    })();

    return (
        <div className="flex h-screen bg-background-dark font-display text-slate-100 overflow-hidden">
            {/* Sidebar Desktop */}
            <aside className="hidden md:flex flex-col w-72 bg-slate-900 border-r border-slate-800 h-full">
                <div className="p-8 border-b border-slate-800">
                    <h2 className="text-2xl font-extrabold text-white tracking-tight flex items-center gap-2">
                        <Icon name="monitoring" size={28} className="text-primary" />
                        Painel<span className="text-primary">SCCS</span>
                    </h2>
                    {previewUserId ? (
                        <div className="mt-2 flex items-center gap-2 bg-amber-500/10 border border-amber-500/20 px-3 py-1.5 rounded-lg">
                            <Icon name="visibility" size={14} className="text-amber-500" />
                            <span className="text-[10px] font-bold text-amber-500 uppercase tracking-tight">Modo Visualização</span>
                            <button onClick={() => setPreviewUserId(null)} className="ml-auto text-amber-500 hover:text-amber-400">
                                <Icon name="close" size={12} />
                            </button>
                        </div>
                    ) : (
                        <div className="mt-4 flex flex-col gap-1">
                            <div className="flex items-center gap-2">
                                <span className="w-2 h-2 rounded-full bg-emerald-500 animate-pulse"></span>
                                <p className="text-white text-sm font-bold truncate">Olá, {currentUser?.username}</p>
                            </div>
                            <p className="text-slate-500 text-[10px] uppercase font-black tracking-widest">{currentUser?.role === 'admin' ? 'Administrador' : 'Editor'}</p>
                        </div>
                    )}
                </div>

                <nav className="flex-1 overflow-y-auto py-6 px-4 space-y-2">
                    {activeNavItems.map((item) => (
                        item.href ? (
                            <a
                                key={item.name}
                                href={item.href}
                                target="_blank"
                                rel="noopener noreferrer"
                                className="w-full flex items-center gap-4 px-4 py-3 rounded-xl transition-all font-semibold text-sm text-slate-400 hover:bg-slate-800 hover:text-slate-200"
                            >
                                {item.icon}
                                {item.name}
                                <Icon name="open_in_new" size={16} className="ml-auto opacity-50" />
                            </a>
                        ) : (
                            <button
                                key={item.name}
                                onClick={() => setActiveTab(item.name)}
                                className={`w-full flex items-center gap-4 px-4 py-3 rounded-xl transition-all font-semibold text-sm ${activeTab === item.name
                                    ? 'bg-primary/10 text-primary border border-primary/20'
                                    : 'text-slate-400 hover:bg-slate-800 hover:text-slate-200'
                                    }`}
                            >
                                {item.icon}
                                {item.name}
                            </button>
                        )
                    ))}
                    {activeNavItems.length === 0 && (
                        <p className="text-slate-500 text-xs text-center p-4">Sem permissão para nenhum menu.</p>
                    )}
                </nav>

                <div className="p-6 border-t border-slate-800">
                    <button
                        onClick={handleLogout}
                        className="w-full flex items-center justify-center gap-2 px-4 py-3 bg-red-500/10 text-red-400 hover:bg-red-500/20 border border-red-500/20 transition-colors tracking-wide font-bold rounded-xl text-sm"
                    >
                        <Icon name="logout" size={18} />
                        Sair do Sistema
                    </button>
                </div>
            </aside>

            {/* Mobile Header & Overlay */}
            <div className="md:hidden fixed top-0 w-full z-50 bg-slate-900 border-b border-slate-800 p-4 flex items-center justify-between">
                <h2 className="text-xl font-extrabold text-white flex items-center gap-2">
                    <Icon name="monitoring" size={24} className="text-primary" />
                    Painel<span className="text-primary">SCCS</span>
                </h2>
                <button onClick={() => setIsMobileMenuOpen(!isMobileMenuOpen)} className="text-slate-300">
                    {isMobileMenuOpen ? <Icon name="close" size={28} /> : <Icon name="menu" size={28} />}
                </button>
            </div>

            {/* Mobile Sidebar */}
            {isMobileMenuOpen && (
                <div className="md:hidden fixed inset-0 z-40 bg-slate-900 pt-20 flex flex-col h-full">
                    <nav className="flex-1 overflow-y-auto px-6 py-4 space-y-4">
                        {activeNavItems.map((item) => (
                            item.href ? (
                                <a
                                    key={item.name}
                                    href={item.href}
                                    target="_blank"
                                    rel="noopener noreferrer"
                                    className="w-full flex items-center gap-4 px-4 py-4 rounded-xl transition-all font-semibold text-lg text-slate-400 hover:bg-slate-800 hover:text-slate-200"
                                >
                                    {item.icon}
                                    {item.name}
                                    <Icon name="open_in_new" size={18} className="ml-auto opacity-50" />
                                </a>
                            ) : (
                                <button
                                    key={item.name}
                                    onClick={() => { setActiveTab(item.name); setIsMobileMenuOpen(false); }}
                                    className={`w-full flex items-center gap-4 px-4 py-4 rounded-xl transition-all font-semibold text-lg ${activeTab === item.name
                                        ? 'bg-primary/10 text-primary border border-primary/20'
                                        : 'text-slate-400 hover:bg-slate-800 hover:text-slate-200'
                                        }`}
                                >
                                    {item.icon}
                                    {item.name}
                                </button>
                            )
                        ))}
                    </nav>
                    <div className="p-6">
                        <button
                            onClick={handleLogout}
                            className="w-full flex items-center justify-center gap-2 px-4 py-4 bg-red-500/10 text-red-500 hover:bg-red-500/20 font-bold rounded-xl text-lg"
                        >
                            <Icon name="logout" size={24} />
                            Sair do Sistema
                        </button>
                    </div>
                </div>
            )}

            {/* Main Content */}
            <main className="flex-1 bg-background-dark overflow-y-auto pt-20 md:pt-0">
                <div className="p-8 md:p-12 max-w-6xl mx-auto h-full flex flex-col">
                    <header className="mb-10">
                        <span className="text-primary font-bold tracking-widest uppercase text-xs">Visão Geral</span>
                        <h1 className="text-4xl font-extrabold text-white mt-1">Bem-vindo, {currentUser?.username || 'Usuário'}!</h1>
                        <p className="text-slate-400 mt-2 text-lg">Selecione uma opção no menu lateral para visualizar os dados.</p>
                        {previewUserId && (
                            <div className="mt-4 p-3 bg-amber-500/20 border border-amber-500/30 rounded-xl flex items-center justify-between">
                                <span className="text-amber-400 text-sm font-bold flex items-center gap-2">
                                    <Icon name="visibility" size={18} /> MODO VISUALIZAÇÃO DE MENU ATIVO
                                </span>
                                <button onClick={() => setPreviewUserId(null)} className="text-amber-400 hover:text-white underline text-xs font-bold">REAVER MEU MENU</button>
                            </div>
                        )}
                    </header>

                    {/* Conditional Rendering Content */}
                    {activeTab === 'Notícias & RSS' ? (
                        <div className="flex-1 grid grid-cols-1 lg:grid-cols-2 gap-8">

                            {/* --- COLUNA ESQUERDA: FEEDS RSS --- */}
                            <div className="bg-slate-900/50 border border-slate-800 rounded-3xl p-6 flex flex-col h-full">
                                <div className="flex items-center justify-between mb-6">
                                    <div className="flex items-center gap-4">
                                        <h2 className="text-xl font-bold flex items-center gap-2">
                                            <Icon name="rss_feed" size={20} className="text-primary" /> Feeds RSS
                                        </h2>
                                        <span className="bg-slate-800 text-slate-300 px-3 py-1 rounded-full text-xs font-semibold">{feeds.length} cadastrados</span>
                                    </div>
                                    <button
                                        onClick={handleRefreshRSS}
                                        disabled={isRefreshing}
                                        className="flex items-center gap-2 px-3 py-1.5 bg-primary/10 hover:bg-primary/20 text-primary border border-primary/20 rounded-xl text-xs font-bold transition-all disabled:opacity-50 disabled:cursor-not-allowed"
                                        title="Limpar cache e forçar busca de notícias nos jornais locais"
                                    >
                                        <Icon name="refresh" size={14} className={isRefreshing ? "animate-spin" : ""} />
                                        {isRefreshing ? 'Atualizando...' : 'Reiniciar Feeds RSS'}
                                    </button>
                                </div>

                                <form onSubmit={handleAddFeed} className="flex gap-2 mb-6 bg-slate-800/50 p-3 rounded-2xl border border-slate-700/50">
                                    <input
                                        type="text"
                                        placeholder="Ex: site.com/feed"
                                        value={newFeedUrl}
                                        onChange={(e) => setNewFeedUrl(e.target.value)}
                                        className="flex-1 bg-slate-900 border border-slate-700 rounded-xl px-4 py-2 text-sm text-white focus:outline-none focus:border-primary placeholder:text-slate-500"
                                    />
                                    <button
                                        type="button"
                                        onClick={() => setNewFeedVerified(!newFeedVerified)}
                                        className={`px-3 py-2 rounded-xl border text-xs font-bold transition-all flex items-center gap-1 ${newFeedVerified ? 'border-emerald-500/30 bg-emerald-500/10 text-emerald-400' : 'border-slate-600 bg-slate-800 text-slate-400 hover:bg-slate-700'}`}
                                        title={newFeedVerified ? "Marcar como Não Verificado" : "Marcar como Verificado"}
                                    >
                                        {newFeedVerified ? <Icon name="check_circle" size={14} /> : <Icon name="error" size={14} />} {newFeedVerified ? 'Verificado' : 'Não'}
                                    </button>
                                    <button type="submit" className="bg-primary hover:bg-[#D96D3E] text-white px-4 py-2 rounded-xl text-sm font-bold flex items-center gap-1 transition-colors">
                                        <Icon name="add" size={16} /> Adicionar
                                    </button>
                                </form>

                                <div className="flex-1 overflow-y-auto space-y-3 pr-2 [&::-webkit-scrollbar]:w-1.5 [&::-webkit-scrollbar-track]:bg-transparent [&::-webkit-scrollbar-thumb]:bg-slate-700 [&::-webkit-scrollbar-thumb]:rounded-full">
                                    {feeds.map(feed => (
                                        <div key={feed.id} className="group bg-slate-800/30 hover:bg-slate-800/80 border border-slate-800 hover:border-slate-700 transition-all rounded-2xl p-4 flex items-center justify-between">
                                            <div className="flex items-center gap-3 overflow-hidden">
                                                <button onClick={() => handleToggleVerification(feed.id)} className="shrink-0" title="Alternar status">
                                                    {feed.verified
                                                        ? <Icon name="check_circle" size={18} className="text-emerald-500" />
                                                        : <Icon name="error" size={18} className="text-amber-500" />
                                                    }
                                                </button>
                                                <div className="flex flex-col truncate">
                                                    <span className="text-sm font-semibold truncate text-slate-200">{feed.url}</span>
                                                    <span className={`text-[10px] uppercase font-bold tracking-wider mt-0.5 ${feed.verified ? 'text-emerald-500/70' : 'text-amber-500/70'}`}>
                                                        {feed.verified ? 'Verificado' : 'Não Verificado'}
                                                    </span>
                                                </div>
                                            </div>
                                            <button
                                                onClick={() => handleRemoveFeed(feed.id)}
                                                className="opacity-0 group-hover:opacity-100 p-2 text-slate-500 hover:text-red-400 hover:bg-red-400/10 rounded-lg transition-all shrink-0"
                                            >
                                                <Icon name="delete" size={16} />
                                            </button>
                                        </div>
                                    ))}
                                    {feeds.length === 0 && <p className="text-center text-slate-500 text-sm mt-8">Nenhum feed cadastrado.</p>}
                                </div>
                            </div>

                            {/* --- COLUNA DIREITA: TAGS --- */}
                            <div className="bg-slate-900/50 border border-slate-800 rounded-3xl p-6 flex flex-col h-full">
                                <div className="flex items-center justify-between mb-6">
                                    <h2 className="text-xl font-bold flex items-center gap-2">
                                        <Icon name="label" size={20} className="text-primary" /> Tags de Captura
                                    </h2>
                                    <span className="bg-slate-800 text-slate-300 px-3 py-1 rounded-full text-xs font-semibold">{tags.length} ativas</span>
                                </div>

                                <form onSubmit={handleAddTag} className="flex gap-2 mb-6 bg-slate-800/50 p-3 rounded-2xl border border-slate-700/50">
                                    <input
                                        type="text"
                                        placeholder="Nova palavra-chave..."
                                        value={newTagName}
                                        onChange={(e) => setNewTagName(e.target.value)}
                                        className="flex-1 bg-slate-900 border border-slate-700 rounded-xl px-4 py-2 text-sm text-white focus:outline-none focus:border-primary placeholder:text-slate-500"
                                    />
                                    <button type="submit" className="bg-primary hover:bg-[#D96D3E] text-white px-4 py-2 rounded-xl text-sm font-bold flex items-center gap-1 transition-colors">
                                        <Icon name="add" size={16} /> Add
                                    </button>
                                </form>

                                <div className="flex-1 overflow-y-auto pr-2 [&::-webkit-scrollbar]:w-1.5 [&::-webkit-scrollbar-track]:bg-transparent [&::-webkit-scrollbar-thumb]:bg-slate-700 [&::-webkit-scrollbar-thumb]:rounded-full">
                                    <div className="flex flex-wrap gap-2">
                                        {tags.map(tag => (
                                            <div key={tag.id} className="group bg-slate-800 border border-slate-700 pl-3 pr-1 py-1.5 rounded-xl flex items-center gap-2 transition-all hover:bg-slate-700/50 hover:border-primary/50">
                                                <span className="text-sm font-medium text-slate-200">{tag.name}</span>
                                                <button
                                                    onClick={() => handleRemoveTag(tag.id)}
                                                    className="p-1 rounded-md text-slate-400 hover:text-red-400 hover:bg-red-400/10 transition-colors"
                                                >
                                                    <Icon name="close" size={14} />
                                                </button>
                                            </div>
                                        ))}
                                    </div>
                                    {tags.length === 0 && <p className="text-center text-slate-500 text-sm mt-8">Nenhuma tag cadastrada.</p>}
                                </div>
                                <div className="mt-4 pt-4 border-t border-slate-800 text-xs text-slate-500 leading-relaxed text-center">
                                    O sistema varrerá as notícias dos <strong className="text-slate-400">Feeds RSS</strong> procurando pelas <strong className="text-slate-400">Tags</strong> acima para criar as postagens na Home automaticamente.
                                </div>
                            </div>
                        </div>
                    ) : activeTab === 'Gerir Eventos' ? (
                        <div className="flex-1 grid grid-cols-1 lg:grid-cols-2 gap-8">
                            {/* --- COLUNA ESQUERDA: CALENDÁRIO --- */}
                            <div className="bg-slate-900/50 border border-slate-800 rounded-3xl p-6 flex flex-col h-full">
                                <div className="flex items-center justify-between mb-6">
                                    <div className="flex flex-col gap-1">
                                        <h2 className="text-xl font-bold flex items-center gap-2">
                                            <Icon name="calendar_today" size={20} className="text-primary" /> Calendário de Eventos
                                        </h2>
                                        <a href="/#eventos" target="_blank" rel="noopener noreferrer" className="text-xs text-primary hover:text-white flex items-center gap-1 transition-colors w-max">
                                            Ver no Site <Icon name="open_in_new" size={12} />
                                        </a>
                                    </div>
                                    <span className="bg-slate-800 text-slate-300 px-3 py-1 rounded-full text-xs font-semibold shrink-0">{events.length} agendados</span>
                                </div>
                                <div className="flex-1 overflow-y-auto space-y-4 pr-2 [&::-webkit-scrollbar]:w-1.5 [&::-webkit-scrollbar-track]:bg-transparent [&::-webkit-scrollbar-thumb]:bg-slate-700 [&::-webkit-scrollbar-thumb]:rounded-full">
                                    {events.sort((a, b) => new Date(a.date) - new Date(b.date)).map(event => {
                                        const eventDate = new Date(event.date + 'T00:00:00');
                                        const day = eventDate.getDate().toString().padStart(2, '0');
                                        const month = eventDate.toLocaleString('pt-BR', { month: 'short' }).replace('.', '').toUpperCase();

                                        return (
                                            <div key={event.id} className="group flex bg-slate-800/40 hover:bg-slate-800/80 border border-slate-800 hover:border-slate-700 rounded-2xl overflow-hidden transition-all">
                                                {/* Mini Calendar Box */}
                                                <div className="bg-slate-800 flex flex-col items-center justify-center min-w-[80px] p-3 border-r border-slate-700">
                                                    <span className="text-xs font-bold text-slate-400 mb-1">{month}</span>
                                                    <span className="text-2xl font-black text-white">{day}</span>
                                                </div>
                                                {/* Event Info */}
                                                <div className="p-4 flex-1 flex flex-col justify-center">
                                                    <div className="flex justify-between items-start">
                                                        <div>
                                                            <span className="text-[10px] font-bold text-primary tracking-wider uppercase">{event.tag}</span>
                                                            <h4 className="text-sm font-bold text-slate-200 mt-0.5 line-clamp-1" title={event.title}>{event.title}</h4>
                                                        </div>
                                                        <div className="flex gap-1 opacity-0 group-hover:opacity-100 transition-all shrink-0">
                                                            <button
                                                                onClick={() => handleEditEvent(event)}
                                                                className="p-1.5 text-slate-500 hover:text-primary hover:bg-primary/10 rounded-lg transition-all"
                                                                title="Editar Evento"
                                                            >
                                                                <Icon name="edit" size={16} />
                                                            </button>
                                                            <button
                                                                onClick={() => handleRemoveEvent(event.id)}
                                                                className="p-1.5 text-slate-500 hover:text-red-400 hover:bg-red-400/10 rounded-lg transition-all"
                                                                title="Excluir Evento"
                                                            >
                                                                <Icon name="delete" size={16} />
                                                            </button>
                                                        </div>
                                                    </div>
                                                    <div className="flex items-center gap-4 mt-2 text-xs font-medium text-slate-400">
                                                        <span className="flex items-center gap-1"><Icon name="schedule" size={12} /> {event.time}</span>
                                                        {event.locationLink && <span className="flex items-center gap-1 truncate max-w-[120px]"><Icon name="link" size={12} /> Mapa Anexado</span>}
                                                    </div>
                                                </div>
                                            </div>
                                        )
                                    })}
                                    {events.length === 0 && <p className="text-center text-slate-500 text-sm mt-8">Nenhum evento futuro.</p>}
                                </div>
                            </div>

                            {/* --- COLUNA DIREITA: FORMULÁRIO --- */}
                            <div className="bg-slate-900/50 border border-slate-800 rounded-3xl p-6 flex flex-col h-full">
                                <div className="flex items-center mb-6">
                                    <h2 className="text-xl font-bold flex items-center gap-2">
                                        <Icon name="add" size={20} className="text-primary" /> {newEvent.id ? 'Editar Evento' : 'Cadastrar Evento'}
                                    </h2>
                                    {newEvent.id && (
                                        <button
                                            onClick={() => setNewEvent({ title: '', tag: '', date: '', time: '', locationLink: '', description: '', image: '' })}
                                            className="ml-auto text-xs text-slate-400 hover:text-white transition-colors"
                                        >
                                            Cancelar Edição
                                        </button>
                                    )}
                                </div>

                                <form onSubmit={handleAddEvent} className="flex-1 flex flex-col gap-4 overflow-y-auto pr-2 pb-2 [&::-webkit-scrollbar]:w-1.5 [&::-webkit-scrollbar-track]:bg-transparent [&::-webkit-scrollbar-thumb]:bg-slate-700 [&::-webkit-scrollbar-thumb]:rounded-full">

                                    <div className="grid grid-cols-2 gap-4">
                                        <div>
                                            <label className="text-xs font-bold text-slate-400 uppercase tracking-widest mb-1.5 block">Nome do Evento <span className="text-primary">*</span></label>
                                            <div className="relative">
                                                <Icon name="title" size={16} className="absolute left-3 top-2.5 text-slate-500" />
                                                <input type="text" required value={newEvent.title} onChange={e => setNewEvent({ ...newEvent, title: e.target.value })} className="w-full bg-slate-900 border border-slate-700 rounded-xl pl-9 pr-4 py-2 text-sm text-white focus:outline-none focus:border-primary" placeholder="Ex: Roda de Choro..." />
                                            </div>
                                        </div>
                                        <div>
                                            <label className="text-xs font-bold text-slate-400 uppercase tracking-widest mb-1.5 block">Grupo/Tag <span className="text-primary">*</span></label>
                                            <div className="relative">
                                                <Icon name="label" size={16} className="absolute left-3 top-2.5 text-slate-500" />
                                                <input type="text" required value={newEvent.tag} onChange={e => setNewEvent({ ...newEvent, tag: e.target.value })} className="w-full bg-slate-900 border border-slate-700 rounded-xl pl-9 pr-4 py-2 text-sm text-white focus:outline-none focus:border-primary" placeholder="Ex: SCCS Sênior" />
                                            </div>
                                        </div>
                                    </div>

                                    <div className="grid grid-cols-2 gap-4">
                                        <div>
                                            <label className="text-xs font-bold text-slate-400 uppercase tracking-widest mb-1.5 block">Data <span className="text-primary">*</span></label>
                                            <div className="relative">
                                                <Icon name="calendar_today" size={16} className="absolute left-3 top-2.5 text-slate-500 z-10" />
                                                <input type="date" required value={newEvent.date} onChange={e => setNewEvent({ ...newEvent, date: e.target.value })} className="w-full bg-slate-900 border border-slate-700 rounded-xl pl-9 pr-4 py-2 text-sm text-white focus:outline-none focus:border-primary [color-scheme:dark]" />
                                            </div>
                                        </div>
                                        <div>
                                            <label className="text-xs font-bold text-slate-400 uppercase tracking-widest mb-1.5 block">Horário <span className="text-primary">*</span></label>
                                            <div className="relative">
                                                <Icon name="schedule" size={16} className="absolute left-3 top-2.5 text-slate-500 z-10" />
                                                <input type="time" required value={newEvent.time} onChange={e => setNewEvent({ ...newEvent, time: e.target.value })} className="w-full bg-slate-900 border border-slate-700 rounded-xl pl-9 pr-4 py-2 text-sm text-white focus:outline-none focus:border-primary [color-scheme:dark]" />
                                            </div>
                                        </div>
                                    </div>

                                    <div>
                                        <label className="text-xs font-bold text-slate-400 uppercase tracking-widest mb-1.5 block">Link do Google Maps (Opcional)</label>
                                        <div className="relative">
                                            <Icon name="location_on" size={16} className="absolute left-3 top-2.5 text-slate-500" />
                                            <input type="url" value={newEvent.locationLink} onChange={e => setNewEvent({ ...newEvent, locationLink: e.target.value })} className="w-full bg-slate-900 border border-slate-700 rounded-xl pl-9 pr-4 py-2 text-sm text-white focus:outline-none focus:border-primary" placeholder="Obtenha o link 'Compartilhar' no Maps" />
                                        </div>
                                    </div>

                                    <div>
                                        <label className="text-xs font-bold text-slate-400 uppercase tracking-widest mb-1.5 block">URL da Imagem Banner <span className="text-primary">*</span></label>
                                        <div className="relative">
                                            <Icon name="image" size={16} className="absolute left-3 top-2.5 text-slate-500" />
                                            <input type="url" required value={newEvent.image} onChange={e => setNewEvent({ ...newEvent, image: e.target.value })} className="w-full bg-slate-900 border border-slate-700 rounded-xl pl-9 pr-4 py-2 text-sm text-white focus:outline-none focus:border-primary" placeholder="https://..." />
                                        </div>
                                    </div>

                                    <div className="flex-1 min-h-[100px] flex flex-col">
                                        <div className="flex justify-between items-end mb-1.5">
                                            <label className="text-xs font-bold text-slate-400 uppercase tracking-widest block">Breve Descrição <span className="text-primary">*</span></label>
                                            <span className="text-[10px] text-slate-500 font-medium">{newEvent.description.length}/150</span>
                                        </div>
                                        <div className="relative h-full">
                                            <Icon name="notes" size={16} className="absolute left-3 top-3 text-slate-500" />
                                            <textarea required maxLength={150} value={newEvent.description} onChange={e => setNewEvent({ ...newEvent, description: e.target.value })} className="w-full h-full bg-slate-900 border border-slate-700 rounded-xl pl-9 pr-4 py-2 text-sm text-white focus:outline-none focus:border-primary resize-none" placeholder="Detalhes do evento... (Máx 150 caracteres)" />
                                        </div>
                                    </div>

                                    <div className="mt-4">
                                        <button type="submit" className="w-full bg-primary hover:bg-[#D96D3E] text-white py-3 rounded-xl font-bold flex items-center justify-center gap-2 transition-colors">
                                            <Icon name="check_circle" size={18} /> Salvar Evento
                                        </button>
                                    </div>
                                </form>
                            </div>
                        </div>
                    ) : activeTab === 'Usuário' ? (
                        currentUser?.role === 'admin' ? (
                            <div className="flex-1 grid grid-cols-1 lg:grid-cols-2 gap-8">
                                {/* --- COLUNA ESQUERDA: LISTA DE USUÁRIOS --- */}
                                <div className="bg-slate-900/50 border border-slate-800 rounded-3xl p-6 flex flex-col h-full">
                                    <div className="flex items-center justify-between mb-6">
                                        <h2 className="text-xl font-bold flex items-center gap-2">
                                            <Icon name="group" size={20} className="text-primary" /> Usuários do Sistema
                                        </h2>
                                        <span className="bg-slate-800 text-slate-300 px-3 py-1 rounded-full text-xs font-semibold">{users.length} ativos</span>
                                    </div>

                                    <div className="flex-1 overflow-y-auto space-y-3 pr-2 [&::-webkit-scrollbar]:w-1.5 [&::-webkit-scrollbar-track]:bg-transparent [&::-webkit-scrollbar-thumb]:bg-slate-700 [&::-webkit-scrollbar-thumb]:rounded-full">
                                        {users.map(user => (
                                            <div key={user.id} className="group flex flex-col bg-slate-800/30 hover:bg-slate-800/80 border border-slate-800 hover:border-slate-700 transition-all rounded-2xl p-4">
                                                <div className="flex items-center justify-between">
                                                    <div className="flex items-center gap-4 overflow-hidden">
                                                        <div className="w-10 h-10 rounded-full bg-slate-700/50 flex items-center justify-center shrink-0">
                                                            <Icon name="person" size={18} className="text-slate-300" />
                                                        </div>
                                                        <div className="flex flex-col truncate">
                                                            <span className="text-sm font-bold text-slate-200">{user.username}</span>
                                                            <span className="text-[10px] uppercase font-bold tracking-wider mt-0.5 text-slate-500">{user.role === 'admin' ? 'Administrador' : 'Editor'}</span>
                                                        </div>
                                                    </div>
                                                    <div className="flex gap-1 opacity-0 group-hover:opacity-100 transition-all shrink-0">
                                                        {user.username !== 'admin' && (
                                                            <>
                                                                <button
                                                                    onClick={() => handleEditUser(user)}
                                                                    className="p-2 text-slate-500 hover:text-primary hover:bg-primary/10 rounded-lg transition-all"
                                                                    title="Editar Usuário"
                                                                >
                                                                    <Icon name="edit" size={16} />
                                                                </button>
                                                                <button
                                                                    onClick={() => handleRemoveUser(user.id)}
                                                                    className="p-2 text-slate-500 hover:text-red-400 hover:bg-red-400/10 rounded-lg transition-all"
                                                                    title="Remover Usuário"
                                                                >
                                                                    <Icon name="delete" size={16} />
                                                                </button>
                                                            </>
                                                        )}
                                                        {user.username === 'admin' && (
                                                            <div className="p-2 text-slate-600 cursor-default" title="Usuário Sistema Protegido">
                                                                <Icon name="verified_user" size={16} />
                                                            </div>
                                                        )}
                                                    </div>
                                                </div>
                                                
                                                {/* Preview & Permission Management Box */}
                                                <div className="mt-4 pt-3 border-t border-slate-700/50">
                                                    <label className="flex items-center gap-2 cursor-pointer group mb-3">
                                                        <input 
                                                            type="checkbox" 
                                                            checked={previewUserId === user.id}
                                                            onChange={(e) => setPreviewUserId(e.target.checked ? user.id : null)}
                                                            className="w-4 h-4 rounded border-slate-700 bg-slate-900 text-primary focus:ring-primary" 
                                                        />
                                                        <span className={`text-xs font-semibold transition-colors ${previewUserId === user.id ? 'text-primary' : 'text-slate-500 group-hover:text-slate-300'}`}>Visualizar e gerenciar permissões</span>
                                                    </label>

                                                    {previewUserId === user.id && (
                                                        <div className="grid grid-cols-1 gap-2 animate-in fade-in slide-in-from-top-2 duration-300">
                                                            {allNavItems.map(item => (
                                                                <label key={item.name} className="flex items-center gap-3 p-2.5 rounded-xl bg-slate-900/40 border border-slate-700/30 hover:bg-slate-800/80 transition-all cursor-pointer group">
                                                                    <div className={`w-4 h-4 rounded-full border flex items-center justify-center transition-all ${user.menuAccess.includes(item.name) ? 'bg-primary border-primary' : 'border-slate-600 bg-slate-950'}`}>
                                                                        {user.menuAccess.includes(item.name) && <Icon name="check" size={12} className="text-white" />}
                                                                    </div>
                                                                    <input 
                                                                        type="checkbox" 
                                                                        checked={user.menuAccess.includes(item.name)} 
                                                                        onChange={() => handleToggleUserPermission(user.id, item.name)}
                                                                        className="hidden"
                                                                    />
                                                                    <span className="text-[10px] font-bold text-slate-400 group-hover:text-slate-200 flex items-center gap-2">
                                                                        {item.icon} {item.name}
                                                                    </span>
                                                                </label>
                                                            ))}
                                                        </div>
                                                    )}
                                                </div>
                                            </div>
                                        ))}
                                    </div>
                                </div>

                                {/* --- COLUNA DIREITA: FORMULÁRIO --- */}
                                <div className="bg-slate-900/50 border border-slate-800 rounded-3xl p-6 flex flex-col h-full">
                                    <div className="flex items-center mb-6">
                                        <h2 className="text-xl font-bold flex items-center gap-2">
                                            <Icon name="person_add" size={20} className="text-primary" /> {newUser.id ? `Editar Usuário: ${newUser.username}` : 'Novo Usuário'}
                                        </h2>
                                        {newUser.id && (
                                            <button
                                                onClick={() => { setNewUser({ id: null, username: '', password: '', confirmPassword: '', role: 'user', menuAccess: [] }); setUserError(''); }}
                                                className="ml-auto text-xs text-slate-400 hover:text-white transition-colors"
                                            >
                                                Cancelar
                                            </button>
                                        )}
                                    </div>

                                    <form onSubmit={handleAddUser} className="flex flex-col gap-5 overflow-y-auto pr-2 pb-2 [&::-webkit-scrollbar]:w-1.5 [&::-webkit-scrollbar-track]:bg-transparent [&::-webkit-scrollbar-thumb]:bg-slate-700 [&::-webkit-scrollbar-thumb]:rounded-full">
                                        {userError && (
                                            <div className="bg-red-500/10 border border-red-500/20 text-red-400 px-4 py-3 rounded-xl flex items-center gap-2 text-sm font-medium shrink-0">
                                                <Icon name="error" size={16} /> {userError}
                                            </div>
                                        )}

                                        <div>
                                            <label className="text-xs font-bold text-slate-400 uppercase tracking-widest mb-1.5 block">Nome de Usuário</label>
                                            <div className="relative">
                                                <Icon name="person" size={16} className="absolute left-3 top-2.5 text-slate-500" />
                                                <input
                                                    type="text"
                                                    required
                                                    disabled={!!newUser.id}
                                                    value={newUser.username}
                                                    onChange={e => setNewUser({ ...newUser, username: e.target.value })}
                                                    className={`w-full bg-slate-900 border border-slate-700 rounded-xl pl-9 pr-4 py-2 text-sm focus:outline-none focus:border-primary ${newUser.id ? 'text-slate-500 opacity-70 cursor-not-allowed' : 'text-white'}`}
                                                    placeholder="ex: admin"
                                                />
                                            </div>
                                        </div>

                                        <div className="grid grid-cols-2 gap-4">
                                            <div>
                                                <label className="text-xs font-bold text-slate-400 uppercase tracking-widest mb-1.5 block">
                                                    {newUser.id ? 'Nova Senha' : 'Senha'}
                                                </label>
                                                <div className="relative">
                                                    <Icon name="lock" size={16} className="absolute left-3 top-2.5 text-slate-500" />
                                                    <input
                                                        type="password"
                                                        required={!newUser.id}
                                                        value={newUser.password}
                                                        onChange={e => setNewUser({ ...newUser, password: e.target.value })}
                                                        className="w-full bg-slate-900 border border-slate-700 rounded-xl pl-9 pr-4 py-2 text-sm text-white focus:outline-none focus:border-primary"
                                                        placeholder="••••••••"
                                                    />
                                                </div>
                                            </div>

                                            <div>
                                                <label className="text-xs font-bold text-slate-400 uppercase tracking-widest mb-1.5 block">Confirmar Senha</label>
                                                <div className="relative">
                                                    <Icon name="lock" size={16} className="absolute left-3 top-2.5 text-slate-500" />
                                                    <input
                                                        type="password"
                                                        required={!newUser.id}
                                                        value={newUser.confirmPassword}
                                                        onChange={e => setNewUser({ ...newUser, confirmPassword: e.target.value })}
                                                        className="w-full bg-slate-900 border border-slate-700 rounded-xl pl-9 pr-4 py-2 text-sm text-white focus:outline-none focus:border-primary"
                                                        placeholder="••••••••"
                                                    />
                                                </div>
                                            </div>
                                        </div>

                                        <div>
                                            <label className="text-xs font-bold text-slate-400 uppercase tracking-widest mb-1.5 block">Papel do Usuário</label>
                                            <div className="flex gap-4">
                                                <label className="flex items-center gap-2 cursor-pointer">
                                                    <input type="radio" name="role" checked={newUser.role === 'admin'} onChange={() => setNewUser({ ...newUser, role: 'admin' })} className="text-primary bg-slate-900 border-slate-700 focus:ring-primary" />
                                                    <span className="text-sm font-semibold text-slate-200">Admin</span>
                                                </label>
                                                <label className="flex items-center gap-2 cursor-pointer">
                                                    <input type="radio" name="role" checked={newUser.role === 'user'} onChange={() => setNewUser({ ...newUser, role: 'user' })} className="text-primary bg-slate-900 border-slate-700 focus:ring-primary" />
                                                    <span className="text-sm font-semibold text-slate-200">Editor</span>
                                                </label>
                                            </div>
                                        </div>

                                        <div>
                                            <label className="text-xs font-bold text-slate-400 uppercase tracking-widest mb-3 block">Acesso ao Menu</label>
                                            <div className="grid grid-cols-1 gap-3">
                                                {allNavItems.map(item => (
                                                    <label key={item.name} className="flex items-center gap-3 p-3 rounded-xl bg-slate-800/50 border border-slate-700/50 hover:bg-slate-800 transition-colors cursor-pointer group">
                                                        <div className={`w-5 h-5 rounded border flex items-center justify-center transition-all ${newUser.menuAccess.includes(item.name) ? 'bg-primary border-primary' : 'border-slate-600 bg-slate-900'}`}>
                                                            {newUser.menuAccess.includes(item.name) && <Icon name="check" size={14} className="text-white" />}
                                                        </div>
                                                        <input 
                                                            type="checkbox" 
                                                            checked={newUser.menuAccess.includes(item.name)} 
                                                            onChange={() => togglePermission(item.name)}
                                                            className="hidden"
                                                        />
                                                        <span className="text-sm font-semibold text-slate-300 group-hover:text-slate-100 flex items-center gap-2">
                                                            {item.icon} {item.name}
                                                        </span>
                                                    </label>
                                                ))}
                                            </div>
                                        </div>

                                        <div className="mt-4 shrink-0">
                                            <button type="submit" className="w-full bg-primary hover:bg-[#D96D3E] text-white py-3 rounded-xl font-bold flex items-center justify-center gap-2 transition-colors">
                                                <Icon name="check_circle" size={18} /> {newUser.id ? 'Salvar Mudanças' : 'Cadastrar Usuário'}
                                            </button>
                                        </div>
                                    </form>
                                </div>
                            </div>
                        ) : (
                            <div className="flex-1 flex flex-col items-center justify-center text-center p-12">
                                <div className="bg-red-500/10 p-6 rounded-full mb-6">
                                    <Icon name="person_off" size={64} className="text-red-500" />
                                </div>
                                <h2 className="text-2xl font-bold text-white mb-2">Acesso Restrito</h2>
                                <p className="text-slate-400 max-w-md">Apenas o administrador do sistema pode gerenciar usuários e permissões.</p>
                            </div>
                        )
                    ) : activeTab === 'Personalizar Site' ? (
                        <div className="flex-1 flex flex-col gap-6 h-full overflow-hidden">
                            <header className="flex flex-col md:flex-row md:items-center justify-between gap-4 shrink-0">
                                <div className="flex items-center gap-4">
                                    <div className="bg-primary/20 p-3 rounded-2xl">
                                        <Icon name="auto_fix_high" size={24} className="text-primary" />
                                    </div>
                                    <div>
                                        <h2 className="text-2xl font-bold text-white">Personalizar Site</h2>
                                        <p className="text-slate-400 text-sm mt-1">Gerencie o conteúdo visual e textual das páginas do site.</p>
                                    </div>
                                </div>

                                <button
                                    onClick={saveHomeSettings}
                                    disabled={isSavingSettings}
                                    className={`px-8 py-3 rounded-xl font-bold flex items-center gap-2 transition-all shadow-lg ${
                                        isSavingSettings ? 'bg-slate-700 cursor-not-allowed text-slate-400' : 'bg-primary hover:bg-[#D96D3E] text-white shadow-primary/20'
                                    }`}
                                >
                                    {isSavingSettings ? (
                                        <Icon name="sync" size={18} className="animate-spin" />
                                    ) : (
                                        <Icon name="save" size={18} />
                                    )}
                                    {isSavingSettings ? 'Salvando...' : 'Salvar Alterações'}
                                </button>
                            </header>

                            <div className="flex flex-col md:flex-row gap-6 flex-1 min-h-0">
                                {/* Menu Lateral de Abas de Configuração */}
                                <div className="w-full md:w-64 bg-slate-900/50 border border-slate-800 rounded-3xl p-4 flex flex-col gap-2 shrink-0">
                                    <button 
                                        onClick={() => setActiveSettingsTab('Início')}
                                        className={`flex items-center gap-3 p-4 rounded-2xl font-bold transition-all ${
                                            activeSettingsTab === 'Início' ? 'bg-primary/10 text-primary border border-primary/20' : 'text-slate-400 hover:text-slate-200 hover:bg-slate-800/50 border border-transparent'
                                        }`}
                                    >
                                        <Icon name="home" size={20} /> Início
                                    </button>
                                    <button 
                                        onClick={() => setActiveSettingsTab('Projetos')}
                                        className={`flex items-center gap-3 p-4 rounded-2xl font-bold transition-all ${
                                            activeSettingsTab === 'Projetos' ? 'bg-primary/10 text-primary border border-primary/20' : 'text-slate-400 hover:text-slate-200 hover:bg-slate-800/50 border border-transparent'
                                        }`}
                                    >
                                        <Icon name="account_tree" size={20} /> Projetos
                                    </button>
                                    <button 
                                        onClick={() => setActiveSettingsTab('Seções')}
                                        className={`flex items-center gap-3 p-4 rounded-2xl font-bold transition-all ${
                                            activeSettingsTab === 'Seções' ? 'bg-primary/10 text-primary border border-primary/20' : 'text-slate-400 hover:text-slate-200 hover:bg-slate-800/50 border border-transparent'
                                        }`}
                                    >
                                        <Icon name="view_quilt" size={20} /> Exibição
                                    </button>
                                    <button 
                                        onClick={() => setActiveSettingsTab('Doar')}
                                        className={`flex items-center gap-3 p-4 rounded-2xl font-bold transition-all ${
                                            activeSettingsTab === 'Doar' ? 'bg-primary/10 text-primary border border-primary/20' : 'text-slate-400 hover:text-slate-200 hover:bg-slate-800/50 border border-transparent'
                                        }`}
                                    >
                                        <Icon name="volunteer_activism" size={20} /> Doar
                                    </button>
                                    <button 
                                        onClick={() => setActiveSettingsTab('Contato')}
                                        className={`flex items-center gap-3 p-4 rounded-2xl font-bold transition-all ${
                                            activeSettingsTab === 'Contato' ? 'bg-primary/10 text-primary border border-primary/20' : 'text-slate-400 hover:text-slate-200 hover:bg-slate-800/50 border border-transparent'
                                        }`}
                                    >
                                        <Icon name="contact_support" size={20} /> Rodapé
                                    </button>
                                    <div className="mt-auto p-4 bg-slate-800/30 rounded-2xl">
                                        <p className="text-[10px] uppercase tracking-widest font-black text-slate-500 mb-2 text-center">Dica</p>
                                        <p className="text-[11px] text-slate-400 text-center leading-relaxed">
                                            As alterações feitas aqui refletem diretamente na página principal após clicar em salvar.
                                        </p>
                                    </div>
                                </div>

                                {/* Área de Edição */}
                                <div className="flex-1 bg-slate-900/50 border border-slate-800 rounded-3xl p-8 overflow-y-auto [&::-webkit-scrollbar]:w-1.5 [&::-webkit-scrollbar-track]:bg-transparent [&::-webkit-scrollbar-thumb]:bg-slate-700 [&::-webkit-scrollbar-thumb]:rounded-full">
                                    {activeSettingsTab === 'Início' ? (
                                        <div className="max-w-3xl flex flex-col gap-10">
                                            {/* Seção Hero Image */}
                                            <section>
                                                <div className="flex items-center gap-3 mb-6">
                                                    <div className="w-8 h-8 rounded-full bg-primary/20 flex items-center justify-center text-primary font-bold text-xs">01</div>
                                                    <h3 className="text-xl font-bold text-white">Imagem de Destaque (Hero)</h3>
                                                </div>
                                                
                                                <div className="grid grid-cols-1 md:grid-cols-2 gap-8 items-start">
                                                    <div className="space-y-4">
                                                        <label className="text-xs font-black text-slate-500 uppercase tracking-[0.2em] block mb-2">URL da Imagem</label>
                                                        <textarea
                                                            value={homeSettings.heroImage}
                                                            onChange={(e) => setHomeSettings({...homeSettings, heroImage: e.target.value})}
                                                            className="w-full bg-slate-900/80 border border-slate-700 rounded-2xl p-4 text-xs font-mono text-slate-300 focus:outline-none focus:border-primary transition-all min-h-[100px] resize-none"
                                                            placeholder="Cole a URL da imagem aqui..."
                                                        />
                                                        <p className="text-[10px] text-slate-500 italic">Dica: Use a opção 'Copiar URL' no Gestor de Arquivos para colar aqui.</p>
                                                    </div>
                                                    
                                                    <div>
                                                        <label className="text-xs font-black text-slate-500 uppercase tracking-[0.2em] block mb-4 text-center md:text-left">Miniatura Atual</label>
                                                        <div className="aspect-video rounded-2xl overflow-hidden border-2 border-slate-700 bg-slate-800 relative group">
                                                            <img 
                                                                src={homeSettings.heroImage || "https://images.unsplash.com/photo-1514320291840-2e0a9bf2a9ae?auto=format&fit=crop&w=400&q=80"} 
                                                                className="w-full h-full object-cover transition-transform duration-700 group-hover:scale-110" 
                                                                alt="Hero Thumbnail" 
                                                            />
                                                            <div className="absolute inset-0 bg-gradient-to-t from-black/60 to-transparent flex items-end p-4">
                                                                <span className="text-[10px] font-bold text-white/80 flex items-center gap-1.5 uppercase tracking-wider">
                                                                    <Icon name="visibility" size={12} /> Preview da Hero
                                                                </span>
                                                            </div>
                                                        </div>
                                                    </div>
                                                </div>
                                            </section>

                                            <div className="h-px bg-slate-800/50 w-full"></div>

                                            {/* Seção Títulos e Textos */}
                                            <section>
                                                <div className="flex items-center gap-3 mb-8">
                                                    <div className="w-8 h-8 rounded-full bg-primary/20 flex items-center justify-center text-primary font-bold text-xs">02</div>
                                                    <h3 className="text-xl font-bold text-white">Mensagem da Hero</h3>
                                                </div>

                                                <div className="flex flex-col gap-8">
                                                    <div className="space-y-3">
                                                        <div className="flex items-center justify-between">
                                                            <label className="text-xs font-black text-slate-500 uppercase tracking-[0.2em]">Título Principal</label>
                                                            <span className="text-[10px] font-bold text-slate-600">{homeSettings.heroTitle.length}/50</span>
                                                        </div>
                                                        <input
                                                            type="text"
                                                            maxLength={50}
                                                            value={homeSettings.heroTitle}
                                                            onChange={(e) => setHomeSettings({...homeSettings, heroTitle: e.target.value})}
                                                            className="w-full bg-slate-900 border border-slate-700 rounded-2xl p-5 text-xl font-black text-white focus:outline-none focus:border-primary transition-all placeholder:text-slate-800"
                                                            placeholder="Título impactante..."
                                                        />
                                                    </div>

                                                    <div className="space-y-3">
                                                        <div className="flex items-center justify-between">
                                                            <label className="text-xs font-black text-slate-500 uppercase tracking-[0.2em]">Texto de Apoio (Descrição)</label>
                                                            <span className={`text-[10px] font-bold transition-colors ${homeSettings.heroText.length > 180 ? 'text-amber-500' : 'text-slate-600'}`}>
                                                                {homeSettings.heroText.length}/200
                                                            </span>
                                                        </div>
                                                        <textarea
                                                            maxLength={200}
                                                            value={homeSettings.heroText}
                                                            onChange={(e) => setHomeSettings({...homeSettings, heroText: e.target.value})}
                                                            className="w-full bg-slate-900 border border-slate-700 rounded-2xl p-5 text-sm font-medium text-slate-300 focus:outline-none focus:border-primary transition-all min-h-[120px] resize-none leading-relaxed"
                                                            placeholder="Uma breve descrição sobre a missão..."
                                                        />
                                                        <p className="text-[10px] text-slate-500 italic text-right">Recomendado manter entre 120 e 180 caracteres para melhor visualização.</p>
                                                    </div>
                                                </div>
                                            </section>
                                        </div>
                                    ) : activeSettingsTab === 'Projetos' ? (
                                        <div className="max-w-4xl flex flex-col gap-12">
                                            {/* Cabeçalho da Seção Projetos */}
                                            <section>
                                                <div className="flex items-center gap-3 mb-8">
                                                    <div className="w-8 h-8 rounded-full bg-primary/20 flex items-center justify-center text-primary font-bold text-xs">01</div>
                                                    <h3 className="text-xl font-bold text-white">Cabeçalho da Seção Projetos</h3>
                                                </div>
                                                <div className="flex flex-col gap-6">
                                                    <div className="space-y-3">
                                                        <div className="flex items-center justify-between">
                                                            <label className="text-xs font-black text-slate-500 uppercase tracking-[0.2em]">Título da Seção</label>
                                                            <span className="text-[10px] font-bold text-slate-600">{homeSettings.projectsTitle?.length || 0}/50</span>
                                                        </div>
                                                        <input
                                                            type="text"
                                                            maxLength={50}
                                                            value={homeSettings.projectsTitle}
                                                            onChange={(e) => setHomeSettings({...homeSettings, projectsTitle: e.target.value})}
                                                            className="w-full bg-slate-900 border border-slate-700 rounded-2xl p-5 text-xl font-black text-white focus:outline-none focus:border-primary transition-all placeholder:text-slate-800"
                                                            placeholder="Ex: Nossos Projetos em Atividade"
                                                        />
                                                    </div>
                                                    <div className="space-y-3">
                                                        <div className="flex items-center justify-between">
                                                            <label className="text-xs font-black text-slate-500 uppercase tracking-[0.2em]">Texto Introdutório</label>
                                                            <span className="text-[10px] font-bold text-slate-600">{homeSettings.projectsText?.length || 0}/200</span>
                                                        </div>
                                                        <textarea
                                                            maxLength={200}
                                                            value={homeSettings.projectsText}
                                                            onChange={(e) => setHomeSettings({...homeSettings, projectsText: e.target.value})}
                                                            className="w-full bg-slate-900 border border-slate-700 rounded-2xl p-5 text-sm font-medium text-slate-300 focus:outline-none focus:border-primary transition-all min-h-[100px] resize-none"
                                                            placeholder="Breve descrição dos projetos..."
                                                        />
                                                    </div>
                                                </div>
                                            </section>

                                            <div className="h-px bg-slate-800/50 w-full"></div>

                                            {/* Lista de Projetos Individuais */}
                                            <section>
                                                <div className="flex items-center justify-between mb-8">
                                                    <div className="flex items-center gap-3">
                                                        <div className="w-8 h-8 rounded-full bg-primary/20 flex items-center justify-center text-primary font-bold text-xs">02</div>
                                                        <h3 className="text-xl font-bold text-white">Editar Projetos (Carousel)</h3>
                                                    </div>
                                                    <button 
                                                        onClick={addProject}
                                                        className="bg-primary/10 hover:bg-primary text-primary hover:text-white px-5 py-2.5 rounded-xl text-xs font-black transition-all flex items-center gap-2 border border-primary/20"
                                                    >
                                                        <Icon name="add_circle" size={18} /> Adicionar Novo Projeto
                                                    </button>
                                                </div>

                                                <div className="grid grid-cols-1 gap-6">
                                                    {projects.map((project) => (
                                                        <div key={project.id} className="bg-slate-900/80 border border-slate-800 rounded-[2rem] p-6 hover:border-slate-700 transition-all group relative">
                                                            {/* Botão de Excluir Flutuante */}
                                                            <button 
                                                                onClick={() => deleteProject(project.id)}
                                                                className="absolute top-6 right-6 w-10 h-10 rounded-full bg-red-500/10 hover:bg-red-500 text-red-500 hover:text-white transition-all flex items-center justify-center border border-red-500/20 z-10"
                                                                title="Excluir Projeto"
                                                            >
                                                                <Icon name="delete" size={18} />
                                                            </button>
                                                            <div className="flex flex-col lg:flex-row gap-8">
                                                                {/* Miniatura do Projeto */}
                                                                <div className="w-full lg:w-48 shrink-0">
                                                                    <div className="aspect-[4/5] rounded-2xl overflow-hidden bg-slate-800 border-2 border-slate-700 relative group/thumb">
                                                                        <img src={project.image} alt={project.title} className="w-full h-full object-cover transition-transform duration-500 group-hover/thumb:scale-110" />
                                                                        <div className="absolute inset-0 bg-black/40 opacity-0 group-hover/thumb:opacity-100 transition-opacity flex items-center justify-center">
                                                                            <Icon name="image" className="text-white" />
                                                                        </div>
                                                                    </div>
                                                                    <input 
                                                                        type="text" 
                                                                        placeholder="URL da Imagem"
                                                                        value={project.image}
                                                                        onChange={(e) => setProjects(prev => prev.map(p => p.id === project.id ? {...p, image: e.target.value} : p))}
                                                                        className="w-full mt-3 bg-slate-900 border border-slate-800 rounded-lg p-2 text-[10px] text-slate-400 focus:border-primary outline-none"
                                                                    />
                                                                </div>

                                                                {/* Form de Edição Rápida */}
                                                                <div className="flex-1 grid grid-cols-1 md:grid-cols-2 gap-4">
                                                                    <div className="space-y-2">
                                                                        <label className="text-[10px] font-black text-slate-500 uppercase tracking-widest pl-1">Nome/Tag</label>
                                                                        <input 
                                                                            type="text" 
                                                                            value={project.tag}
                                                                            onChange={(e) => setProjects(prev => prev.map(p => p.id === project.id ? {...p, tag: e.target.value} : p))}
                                                                            className="w-full bg-slate-800/50 border border-slate-700 rounded-xl p-3 text-sm text-white focus:border-primary outline-none"
                                                                        />
                                                                    </div>
                                                                    <div className="space-y-2">
                                                                        <label className="text-[10px] font-black text-slate-500 uppercase tracking-widest pl-1">Título do Projeto</label>
                                                                        <input 
                                                                            type="text" 
                                                                            value={project.title}
                                                                            onChange={(e) => setProjects(prev => prev.map(p => p.id === project.id ? {...p, title: e.target.value} : p))}
                                                                            className="w-full bg-slate-800/50 border border-slate-700 rounded-xl p-3 text-sm text-white focus:border-primary outline-none"
                                                                        />
                                                                    </div>
                                                                    <div className="space-y-2">
                                                                        <label className="text-[10px] font-black text-slate-500 uppercase tracking-widest pl-1">Texto do Botão</label>
                                                                        <input 
                                                                            type="text" 
                                                                            value={project.btnText}
                                                                            onChange={(e) => setProjects(prev => prev.map(p => p.id === project.id ? {...p, btnText: e.target.value} : p))}
                                                                            className="w-full bg-slate-800/50 border border-slate-700 rounded-xl p-3 text-sm text-white focus:border-primary outline-none"
                                                                            placeholder="Padrão: Conheça mais"
                                                                        />
                                                                    </div>
                                                                    <div className="space-y-2">
                                                                        <label className="text-[10px] font-black text-slate-500 uppercase tracking-widest pl-1">Link do Botão (URL ou âncora)</label>
                                                                        <input 
                                                                            type="text" 
                                                                            value={project.btnLink}
                                                                            onChange={(e) => setProjects(prev => prev.map(p => p.id === project.id ? {...p, btnLink: e.target.value} : p))}
                                                                            className="w-full bg-slate-800/50 border border-slate-700 rounded-xl p-3 text-sm text-white focus:border-primary outline-none"
                                                                            placeholder="Ex: #contato ou https://..."
                                                                        />
                                                                    </div>
                                                                    <div className="md:col-span-2 flex justify-end mt-4">
                                                                        <button 
                                                                            onClick={() => saveProject(project.id, project)}
                                                                            className="bg-slate-800 hover:bg-primary text-slate-300 hover:text-white px-6 py-2 rounded-xl text-xs font-bold transition-all flex items-center gap-2"
                                                                        >
                                                                            <Icon name="sync" size={14} /> Atualizar este Projeto
                                                                        </button>
                                                                    </div>
                                                                </div>
                                                            </div>
                                                        </div>
                                                    ))}
                                                </div>
                                            </section>
                                        </div>
                                    ) : activeSettingsTab === 'Seções' ? (
                                        <div className="max-w-2xl flex flex-col gap-10">
                                            <section>
                                                <div className="flex items-center gap-3 mb-8">
                                                    <div className="w-8 h-8 rounded-full bg-primary/20 flex items-center justify-center text-primary font-bold text-xs">01</div>
                                                    <h3 className="text-xl font-bold text-white">Visibilidade das Seções</h3>
                                                </div>

                                                <div className="grid grid-cols-1 gap-4">
                                                    {/* Toggle Eventos */}
                                                    <div 
                                                        onClick={() => setHomeSettings({...homeSettings, showEvents: !homeSettings.showEvents})}
                                                        className={`p-6 rounded-[2rem] border transition-all cursor-pointer flex items-center justify-between group ${
                                                            homeSettings.showEvents ? 'bg-primary/5 border-primary/30' : 'bg-slate-900 border-slate-700 opacity-60'
                                                        }`}
                                                    >
                                                        <div className="flex items-center gap-5">
                                                            <div className={`w-14 h-14 rounded-2xl flex items-center justify-center transition-all ${
                                                                homeSettings.showEvents ? 'bg-primary text-white shadow-lg shadow-primary/20' : 'bg-slate-800 text-slate-500'
                                                            }`}>
                                                                <Icon name="calendar_month" size={28} />
                                                            </div>
                                                            <div>
                                                                <h4 className={`font-bold transition-colors ${homeSettings.showEvents ? 'text-white' : 'text-slate-400'}`}>Seção de Eventos</h4>
                                                                <p className="text-xs text-slate-500 mt-1">Ativa ou desativa a exibição dos eventos na Home.</p>
                                                            </div>
                                                        </div>
                                                        <div className={`w-14 h-8 rounded-full relative transition-all duration-300 ${homeSettings.showEvents ? 'bg-primary' : 'bg-slate-700'}`}>
                                                            <div className={`absolute top-1 w-6 h-6 rounded-full bg-white transition-all duration-300 ${homeSettings.showEvents ? 'left-7' : 'left-1'}`}></div>
                                                        </div>
                                                    </div>

                                                    {/* Toggle Notícias */}
                                                    <div 
                                                        onClick={() => setHomeSettings({...homeSettings, showNews: !homeSettings.showNews})}
                                                        className={`p-6 rounded-[2rem] border transition-all cursor-pointer flex items-center justify-between group ${
                                                            homeSettings.showNews ? 'bg-primary/5 border-primary/30' : 'bg-slate-900 border-slate-700 opacity-60'
                                                        }`}
                                                    >
                                                        <div className="flex items-center gap-5">
                                                            <div className={`w-14 h-14 rounded-2xl flex items-center justify-center transition-all ${
                                                                homeSettings.showNews ? 'bg-primary text-white shadow-lg shadow-primary/20' : 'bg-slate-800 text-slate-500'
                                                            }`}>
                                                                <Icon name="newspaper" size={28} />
                                                            </div>
                                                            <div>
                                                                <h4 className={`font-bold transition-colors ${homeSettings.showNews ? 'text-white' : 'text-slate-400'}`}>Seção de Notícias</h4>
                                                                <p className="text-xs text-slate-500 mt-1">Controla a visibilidade das notícias recentes de RSS.</p>
                                                            </div>
                                                        </div>
                                                        <div className={`w-14 h-8 rounded-full relative transition-all duration-300 ${homeSettings.showNews ? 'bg-primary' : 'bg-slate-700'}`}>
                                                            <div className={`absolute top-1 w-6 h-6 rounded-full bg-white transition-all duration-300 ${homeSettings.showNews ? 'left-7' : 'left-1'}`}></div>
                                                        </div>
                                                    </div>
                                                </div>

                                                <div className="mt-8 p-6 bg-amber-500/10 border border-amber-500/20 rounded-2xl flex gap-4">
                                                    <Icon name="info" className="text-amber-500 shrink-0" />
                                                    <p className="text-xs text-amber-200/70 leading-relaxed">
                                                        <strong>Nota:</strong> Desativar a seção de Eventos ocultará apenas os cards de eventos e o slider. O rodapé e as áreas de apoio permanecerão visíveis.
                                                    </p>
                                                </div>
                                            </section>
                                        </div>
                                    ) : activeSettingsTab === 'Doar' ? (
                                        <div className="max-w-4xl flex flex-col gap-10">
                                            {/* Cabeçalho da Seção de Doação */}
                                            <section>
                                                <div className="flex items-center gap-3 mb-6">
                                                    <div className="w-8 h-8 rounded-full bg-primary/20 flex items-center justify-center text-primary font-bold text-xs">01</div>
                                                    <h3 className="text-xl font-bold text-white">Cabeçalho da Seção Doar</h3>
                                                </div>
                                                <div className="grid grid-cols-1 md:grid-cols-2 gap-6 p-6 bg-slate-900/60 border border-slate-700/50 rounded-[2.5rem]">
                                                    <div className="space-y-4">
                                                        <label className="text-[10px] uppercase tracking-widest font-black text-slate-500 ml-2">Mensagem (Chamada)</label>
                                                        <input 
                                                            type="text" 
                                                            value={homeSettings.donateMessage}
                                                            onChange={(e) => setHomeSettings({...homeSettings, donateMessage: e.target.value})}
                                                            placeholder="FAÇA UM IMPACTO HOJE"
                                                            className="w-full bg-slate-900 border border-slate-700 rounded-2xl p-4 text-white focus:border-primary outline-none transition-all"
                                                        />
                                                    </div>
                                                    <div className="space-y-4">
                                                        <label className="text-[10px] uppercase tracking-widest font-black text-slate-500 ml-2">Título Principal</label>
                                                        <input 
                                                            type="text" 
                                                            value={homeSettings.donateTitle}
                                                            onChange={(e) => setHomeSettings({...homeSettings, donateTitle: e.target.value})}
                                                            className="w-full bg-slate-900 border border-slate-700 rounded-2xl p-4 text-white focus:border-primary outline-none transition-all"
                                                        />
                                                    </div>
                                                    <div className="md:col-span-2 space-y-4">
                                                        <label className="text-[10px] uppercase tracking-widest font-black text-slate-500 ml-2">Texto Introdutório</label>
                                                        <textarea 
                                                            value={homeSettings.donateText}
                                                            onChange={(e) => setHomeSettings({...homeSettings, donateText: e.target.value})}
                                                            rows="3"
                                                            maxLength="300"
                                                            className="w-full bg-slate-900 border border-slate-700 rounded-2xl p-4 text-white focus:border-primary outline-none transition-all resize-none"
                                                        />
                                                        <div className="flex justify-end pr-2">
                                                            <span className="text-[10px] text-slate-500">{homeSettings.donateText?.length}/300</span>
                                                        </div>
                                                    </div>
                                                </div>
                                            </section>

                                            {/* Configuração das Abas de Doação */}
                                            <section>
                                                <div className="flex items-center justify-between mb-8">
                                                    <div className="flex items-center gap-3">
                                                        <div className="w-8 h-8 rounded-full bg-primary/20 flex items-center justify-center text-primary font-bold text-xs">02</div>
                                                        <h3 className="text-xl font-bold text-white">Abas de Doação</h3>
                                                    </div>
                                                    <button 
                                                        onClick={addDonation}
                                                        className="flex items-center gap-2 bg-primary/10 hover:bg-primary/20 text-primary px-5 py-2.5 rounded-2xl font-bold transition-all border border-primary/20"
                                                    >
                                                        <Icon name="add" size={18} /> Adicionar Nova Aba
                                                    </button>
                                                </div>

                                                <div className="flex flex-col gap-6">
                                                    {donations.map((account) => (
                                                        <div key={account.id} className="bg-slate-900/40 border border-slate-800 rounded-[3rem] p-8 relative group hover:border-slate-700 transition-all">
                                                            <button 
                                                                onClick={() => deleteDonation(account.id)}
                                                                className="absolute top-6 right-6 w-10 h-10 rounded-full bg-red-500/10 text-red-500 hover:bg-red-500 hover:text-white flex items-center justify-center transition-all opacity-0 group-hover:opacity-100"
                                                            >
                                                                <Icon name="delete" size={20} />
                                                            </button>

                                                            <div className="grid grid-cols-1 md:grid-cols-12 gap-8">
                                                                <div className="md:col-span-3">
                                                                    <label className="text-[10px] uppercase tracking-widest font-black text-slate-500 mb-4 block ml-2">Logo/Imagem</label>
                                                                    <div className="relative aspect-square rounded-3xl overflow-hidden bg-slate-800 border-2 border-dashed border-slate-700 flex items-center justify-center group/img">
                                                                        {account.logo ? (
                                                                            <img src={account.logo} alt="Logo" className="w-full h-full object-contain p-4" />
                                                                        ) : (
                                                                            <Icon name="image" size={32} className="text-slate-600" />
                                                                        )}
                                                                        <div className="absolute inset-0 bg-black/60 opacity-0 group-hover/img:opacity-100 transition-all flex items-center justify-center p-4 text-center">
                                                                            <p className="text-[10px] text-white font-bold leading-tight">Copie uma URL da Gestão de Arquivos</p>
                                                                        </div>
                                                                    </div>
                                                                    <input 
                                                                        type="text" 
                                                                        value={account.logo}
                                                                        onChange={(e) => saveDonation(account.id, { logo: e.target.value })}
                                                                        placeholder="URL da Imagem"
                                                                        className="w-full mt-4 bg-slate-900 border border-slate-700 rounded-xl p-3 text-xs text-white focus:border-primary outline-none"
                                                                    />
                                                                </div>

                                                                <div className="md:col-span-9 grid grid-cols-1 md:grid-cols-2 gap-4">
                                                                    <div className="md:col-span-1 flex flex-col gap-2">
                                                                        <label className="text-[10px] uppercase tracking-widest font-black text-slate-500 ml-2">Nome da Aba</label>
                                                                        <input 
                                                                            type="text" 
                                                                            value={account.tabName}
                                                                            onChange={(e) => setDonations(prev => prev.map(d => d.id === account.id ? {...d, tabName: e.target.value} : d))}
                                                                            className="bg-slate-900 border border-slate-700 rounded-xl p-3 text-sm text-white focus:border-primary outline-none"
                                                                        />
                                                                    </div>
                                                                    <div className="md:col-span-1 flex flex-col gap-2">
                                                                        <label className="text-[10px] uppercase tracking-widest font-black text-slate-500 ml-2">Título da Conta</label>
                                                                        <input 
                                                                            type="text" 
                                                                            value={account.title}
                                                                            onChange={(e) => setDonations(prev => prev.map(d => d.id === account.id ? {...d, title: e.target.value} : d))}
                                                                            className="bg-slate-900 border border-slate-700 rounded-xl p-3 text-sm text-white focus:border-primary outline-none"
                                                                        />
                                                                    </div>
                                                                    <div className="md:col-span-2 flex flex-col gap-2">
                                                                        <div className="flex justify-between items-center px-2">
                                                                            <label className="text-[10px] uppercase tracking-widest font-black text-slate-500">Descrição (Texto)</label>
                                                                            <span className="text-[10px] text-slate-600 font-bold">{account.description?.length}/200</span>
                                                                        </div>
                                                                        <textarea 
                                                                            value={account.description}
                                                                            onChange={(e) => setDonations(prev => prev.map(d => d.id === account.id ? {...d, description: e.target.value} : d))}
                                                                            rows="2"
                                                                            maxLength="200"
                                                                            className="bg-slate-900 border border-slate-700 rounded-xl p-3 text-sm text-white focus:border-primary outline-none resize-none"
                                                                        />
                                                                    </div>
                                                                    
                                                                    {/* Dados Bancários */}
                                                                    <div className="flex flex-col gap-2">
                                                                        <label className="text-[10px] uppercase tracking-widest font-black text-slate-500 ml-2">Banco</label>
                                                                        <input 
                                                                            type="text" 
                                                                            value={account.banco}
                                                                            onChange={(e) => setDonations(prev => prev.map(d => d.id === account.id ? {...d, banco: e.target.value} : d))}
                                                                            className="bg-slate-900 border border-slate-700 rounded-xl p-3 text-xs text-white focus:border-primary outline-none"
                                                                        />
                                                                    </div>
                                                                    <div className="flex flex-col gap-2">
                                                                        <label className="text-[10px] uppercase tracking-widest font-black text-slate-500 ml-2">Agência</label>
                                                                        <input 
                                                                            type="text" 
                                                                            value={account.agencia}
                                                                            onChange={(e) => setDonations(prev => prev.map(d => d.id === account.id ? {...d, agencia: e.target.value} : d))}
                                                                            className="bg-slate-900 border border-slate-700 rounded-xl p-3 text-xs text-white focus:border-primary outline-none"
                                                                        />
                                                                    </div>
                                                                    <div className="flex flex-col gap-2">
                                                                        <label className="text-[10px] uppercase tracking-widest font-black text-slate-500 ml-2">Conta Corrente</label>
                                                                        <input 
                                                                            type="text" 
                                                                            value={account.conta}
                                                                            onChange={(e) => setDonations(prev => prev.map(d => d.id === account.id ? {...d, conta: e.target.value} : d))}
                                                                            className="bg-slate-900 border border-slate-700 rounded-xl p-3 text-xs text-white focus:border-primary outline-none"
                                                                        />
                                                                    </div>
                                                                    <div className="flex flex-col gap-2">
                                                                        <label className="text-[10px] uppercase tracking-widest font-black text-slate-500 ml-2">CNPJ</label>
                                                                        <input 
                                                                            type="text" 
                                                                            value={account.cnpj}
                                                                            onChange={(e) => setDonations(prev => prev.map(d => d.id === account.id ? {...d, cnpj: e.target.value} : d))}
                                                                            className="bg-slate-900 border border-slate-700 rounded-xl p-3 text-xs text-white focus:border-primary outline-none"
                                                                        />
                                                                    </div>
                                                                    <div className="md:col-span-2 flex justify-end mt-4">
                                                                        <button 
                                                                            onClick={() => saveDonation(account.id, account)}
                                                                            className="bg-slate-800 hover:bg-primary text-slate-300 hover:text-white px-6 py-2.5 rounded-xl text-xs font-bold transition-all flex items-center gap-2 border border-slate-700/50"
                                                                        >
                                                                            <Icon name="sync" size={14} /> Atualizar esta Aba
                                                                        </button>
                                                                    </div>
                                                                </div>
                                                            </div>
                                                        </div>
                                                    ))}
                                                </div>
                                            </section>
                                        </div>
                                    ) : activeSettingsTab === 'Contato' ? (
                                        <div className="max-w-4xl flex flex-col gap-10">
                                            {/* Cabeçalho do Rodapé */}
                                            <section>
                                                <div className="flex items-center gap-3 mb-6">
                                                    <div className="w-8 h-8 rounded-full bg-primary/20 flex items-center justify-center text-primary font-bold text-xs">01</div>
                                                    <h3 className="text-xl font-bold text-white">Informações do Rodapé</h3>
                                                </div>
                                                <div className="grid grid-cols-1 gap-6 p-6 bg-slate-900/60 border border-slate-700/50 rounded-[2.5rem]">
                                                    <div className="space-y-4">
                                                        <label className="text-[10px] uppercase tracking-widest font-black text-slate-500 ml-2">Título do Rodapé</label>
                                                        <input 
                                                            type="text" 
                                                            value={homeSettings.footerTitle}
                                                            onChange={(e) => setHomeSettings({...homeSettings, footerTitle: e.target.value})}
                                                            className="w-full bg-slate-900 border border-slate-700 rounded-2xl p-4 text-white focus:border-primary outline-none transition-all"
                                                        />
                                                    </div>
                                                    <div className="space-y-4">
                                                        <div className="flex justify-between items-center px-2">
                                                            <label className="text-[10px] uppercase tracking-widest font-black text-slate-500">Texto de Descrição</label>
                                                            <span className="text-[10px] text-slate-600 font-bold">{homeSettings.footerText?.length}/150</span>
                                                        </div>
                                                        <textarea 
                                                            value={homeSettings.footerText}
                                                            maxLength="150"
                                                            onChange={(e) => setHomeSettings({...homeSettings, footerText: e.target.value})}
                                                            className="w-full bg-slate-900 border border-slate-700 rounded-2xl p-4 text-white focus:border-primary outline-none transition-all resize-none min-h-[80px]"
                                                        />
                                                    </div>
                                                </div>
                                            </section>

                                            {/* Redes Sociais */}
                                            <section>
                                                <div className="flex items-center gap-3 mb-6">
                                                    <div className="w-8 h-8 rounded-full bg-primary/20 flex items-center justify-center text-primary font-bold text-xs">02</div>
                                                    <h3 className="text-xl font-bold text-white">Redes Sociais</h3>
                                                </div>
                                                <div className="grid grid-cols-1 gap-4">
                                                    {Object.keys(homeSettings.socials || {}).map((network) => (
                                                        <div key={network} className="flex flex-col md:flex-row items-center gap-4 p-4 bg-slate-900/40 border border-slate-800 rounded-2xl hover:border-slate-700 transition-all">
                                                            <div className="flex items-center gap-4 w-full md:w-48">
                                                                <button 
                                                                    onClick={() => setHomeSettings({
                                                                        ...homeSettings,
                                                                        socials: {
                                                                            ...homeSettings.socials,
                                                                            [network]: { ...homeSettings.socials[network], active: !homeSettings.socials[network].active }
                                                                        }
                                                                    })}
                                                                    className={`w-12 h-12 rounded-xl flex items-center justify-center transition-all ${
                                                                        homeSettings.socials[network].active ? 'bg-primary text-white shadow-lg' : 'bg-slate-800 text-slate-500'
                                                                    }`}
                                                                >
                                                                    {network === 'facebook' ? (
                                                                        <span className="font-black text-xl">f</span>
                                                                    ) : (
                                                                        <Icon name={network === 'instagram' ? 'photo_camera' : network === 'youtube' ? 'smart_display' : 'share'} size={24} />
                                                                    )}
                                                                </button>
                                                                <span className="font-bold text-white capitalize">{network === 'share' ? 'Compartilhar' : network}</span>
                                                            </div>
                                                            {network !== 'share' && (
                                                                <input 
                                                                    type="text" 
                                                                    placeholder={`Link do ${network}`}
                                                                    value={homeSettings.socials[network].link}
                                                                    onChange={(e) => setHomeSettings({
                                                                        ...homeSettings,
                                                                        socials: {
                                                                            ...homeSettings.socials,
                                                                            [network]: { ...homeSettings.socials[network], link: e.target.value }
                                                                        }
                                                                    })}
                                                                    className="flex-1 bg-slate-900 border border-slate-700 rounded-xl p-3 text-sm text-white focus:border-primary outline-none"
                                                                />
                                                            )}
                                                        </div>
                                                    ))}
                                                </div>
                                            </section>

                                            {/* Contato e Mapas */}
                                            <section>
                                                <div className="flex items-center gap-3 mb-6">
                                                    <div className="w-8 h-8 rounded-full bg-primary/20 flex items-center justify-center text-primary font-bold text-xs">03</div>
                                                    <h3 className="text-xl font-bold text-white">Contato e Localização</h3>
                                                </div>
                                                <div className="grid grid-cols-1 md:grid-cols-2 gap-6 p-6 bg-slate-900/60 border border-slate-700/50 rounded-[2.5rem]">
                                                    <div className="space-y-4">
                                                        <label className="text-[10px] uppercase tracking-widest font-black text-slate-500 ml-2">E-mail</label>
                                                        <input 
                                                            type="text" 
                                                            value={homeSettings.footerEmail}
                                                            onChange={(e) => setHomeSettings({...homeSettings, footerEmail: e.target.value})}
                                                            className="w-full bg-slate-900 border border-slate-700 rounded-2xl p-4 text-white focus:border-primary outline-none"
                                                        />
                                                    </div>
                                                    <div className="space-y-4">
                                                        <label className="text-[10px] uppercase tracking-widest font-black text-slate-500 ml-2">Telefone</label>
                                                        <input 
                                                            type="text" 
                                                            value={homeSettings.footerPhone}
                                                            onChange={(e) => setHomeSettings({...homeSettings, footerPhone: e.target.value})}
                                                            className="w-full bg-slate-900 border border-slate-700 rounded-2xl p-4 text-white focus:border-primary outline-none"
                                                        />
                                                    </div>
                                                    <div className="md:col-span-2 space-y-4">
                                                        <label className="text-[10px] uppercase tracking-widest font-black text-slate-500 ml-2">Endereço Completo</label>
                                                        <input 
                                                            type="text" 
                                                            value={homeSettings.footerAddress}
                                                            onChange={(e) => setHomeSettings({...homeSettings, footerAddress: e.target.value})}
                                                            className="w-full bg-slate-900 border border-slate-700 rounded-2xl p-4 text-white focus:border-primary outline-none"
                                                        />
                                                    </div>
                                                    <div className="md:col-span-2 space-y-4">
                                                        <div className="flex items-center justify-between">
                                                            <label className="text-[10px] uppercase tracking-widest font-black text-slate-500 ml-2">URL de Embed do Google Maps</label>
                                                            <a 
                                                                href="https://www.google.com/maps" 
                                                                target="_blank" 
                                                                rel="noopener noreferrer"
                                                                className="flex items-center gap-1.5 text-[10px] font-bold text-primary hover:text-white transition-colors bg-primary/10 hover:bg-primary px-3 py-1 rounded-full"
                                                            >
                                                                <Icon name="map" size={12} /> Abrir Google Maps
                                                            </a>
                                                        </div>
                                                        <textarea 
                                                            value={homeSettings.footerMapsUrl}
                                                            onChange={(e) => setHomeSettings({...homeSettings, footerMapsUrl: e.target.value})}
                                                            className="w-full bg-slate-900 border border-slate-700 rounded-2xl p-4 text-xs text-white focus:border-primary outline-none min-h-[100px]"
                                                            placeholder="Cole aqui o src do iframe do Google Maps"
                                                        />
                                                        <p className="text-[10px] text-slate-500 italic">Para obter a URL: Google Maps {">"} Compartilhar {">"} Incorporar um mapa {">"} Copie apenas o link dentro do <strong>src="..."</strong></p>
                                                    </div>
                                                </div>
                                            </section>
                                        </div>
                                    ) : (
                                        <div className="h-full flex flex-col items-center justify-center text-slate-600">
                                            <Icon name="construction" size={48} className="mb-4" />
                                            <p className="font-bold">Módulo em Desenvolvimento</p>
                                        </div>
                                    )}
                                </div>
                            </div>
                        </div>
                    ) : activeTab === 'Banco de Dados' ? (
                        <div className="flex-1 flex flex-col gap-6 h-full">
                            <header className="flex flex-col md:flex-row md:items-center justify-between gap-4">
                                <div className="flex items-center gap-4">
                                    <div className="bg-primary/20 p-3 rounded-2xl">
                                        <Icon name="database" size={24} className="text-primary" />
                                    </div>
                                    <div>
                                        <h2 className="text-2xl font-bold text-white">Gestão de Arquivos</h2>
                                        <div className="flex items-center gap-2 text-slate-400 text-sm mt-1">
                                            <span>img_site/</span>
                                            {currentPath && (
                                                <div className="flex items-center gap-2">
                                                    <span className="text-primary font-medium">{currentPath}</span>
                                                </div>
                                            )}
                                        </div>
                                    </div>
                                </div>

                                <div className="flex items-center gap-3">
                                    {currentPath && (
                                        <button
                                            onClick={() => loadFiles('')}
                                            className="px-4 py-2 bg-slate-800 hover:bg-slate-700 text-slate-200 rounded-xl text-sm font-bold flex items-center gap-2 transition-all"
                                        >
                                            <Icon name="chevron_left" size={16} /> Voltar à Raiz
                                        </button>
                                    )}
                                    <label className="cursor-pointer bg-primary hover:bg-[#D96D3E] text-white px-6 py-2.5 rounded-xl text-sm font-bold flex items-center gap-2 transition-colors shadow-lg shadow-primary/20">
                                        <Icon name="add" size={18} /> Novo Upload
                                        <input type="file" className="hidden" onChange={handleUpload} disabled={isUploading} />
                                    </label>
                                </div>
                            </header>

                            {/* Pasta Grid */}
                            <div className="grid grid-cols-2 md:grid-cols-4 lg:grid-cols-6 gap-4 mb-4">
                                {fileItems.folders.map(folder => (
                                    <button
                                        key={folder}
                                        onClick={() => loadFiles(folder)}
                                        className="bg-slate-900/50 border border-slate-800 hover:border-primary/50 p-4 rounded-2xl flex flex-col items-center gap-3 transition-all group"
                                    >
                                        <div className="bg-slate-800 p-3 rounded-xl group-hover:bg-primary/10 transition-colors text-amber-500">
                                            <Icon name="folder" size={28} />
                                        </div>
                                        <span className="text-sm font-bold text-slate-300 group-hover:text-white truncate w-full text-center">{folder}</span>
                                    </button>
                                ))}
                            </div>

                            {/* Arquivos List */}
                            <div className="bg-slate-900/50 border border-slate-800 rounded-3xl overflow-hidden flex-1 flex flex-col min-h-0">
                                <div className="p-4 border-b border-slate-800 bg-slate-900/30 flex items-center justify-between">
                                    <h3 className="text-sm font-bold text-slate-400 uppercase tracking-widest">Geral ({fileItems.files.length})</h3>
                                </div>

                                <div className="flex-1 overflow-y-auto p-4 md:p-6 grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6 content-start [&::-webkit-scrollbar]:w-1.5 [&::-webkit-scrollbar-track]:bg-transparent [&::-webkit-scrollbar-thumb]:bg-slate-700 [&::-webkit-scrollbar-thumb]:rounded-full">
                                    {fileItems.files.map(file => (
                                        <div key={file.name} className="group bg-slate-800/40 border border-slate-700/50 hover:border-primary/40 rounded-3xl overflow-hidden transition-all flex flex-col shadow-sm">
                                            {/* Preview */}
                                            <div className="aspect-square relative overflow-hidden bg-slate-950 flex items-center justify-center">
                                                {file.name.match(/\.(jpg|jpeg|png|gif|webp|svg)$/i) ? (
                                                    <img src={file.url} alt={file.name} className="w-[90%] h-[90%] object-contain transition-transform duration-500 group-hover:scale-105" />
                                                ) : (
                                                    <Icon name="description" size={64} className="text-slate-700" />
                                                )}

                                                <div className="absolute inset-0 bg-slate-900/80 opacity-0 group-hover:opacity-100 transition-all duration-300 flex flex-col items-center justify-center p-4">
                                                    {/* Top Filename */}
                                                    <span className="absolute top-4 left-0 right-0 px-4 text-[10px] font-bold text-slate-300 truncate text-center" title={file.name}>
                                                        {file.name}
                                                    </span>

                                                    {/* Central Actions */}
                                                    <div className="flex items-center justify-center gap-2">
                                                        <button
                                                            onClick={() => setPreviewImage(file.url)}
                                                            className="w-10 h-10 flex items-center justify-center bg-white text-slate-700 rounded-xl hover:bg-primary hover:text-white transition-all shadow-md border border-slate-200"
                                                            title="Visualizar"
                                                        >
                                                            <Icon name="visibility" size={20} />
                                                        </button>
                                                        <a
                                                            href={file.url}
                                                            download
                                                            className="w-10 h-10 flex items-center justify-center bg-white text-slate-700 rounded-xl hover:bg-primary hover:text-white transition-all shadow-md border border-slate-200"
                                                            title="Baixar"
                                                        >
                                                            <Icon name="download" size={20} />
                                                        </a>
                                                        <button
                                                            onClick={() => copyToClipboard(file.url)}
                                                            className="w-10 h-10 flex items-center justify-center bg-white text-slate-700 rounded-xl hover:bg-primary hover:text-white transition-all shadow-md border border-slate-200"
                                                            title="Copiar URL"
                                                        >
                                                            <Icon name="link" size={20} />
                                                        </button>
                                                    </div>
                                                </div>
                                            </div>
                                        </div>
                                    ))}

                                    {fileItems.files.length === 0 && fileItems.folders.length === 0 && (
                                        <div className="col-span-full py-20 flex flex-col items-center justify-center text-slate-600 opacity-50">
                                            <Icon name="image" size={64} className="mb-4" />
                                            <p className="text-lg font-bold">Pasta Vazia</p>
                                            <p className="text-sm">Faça upload de seu primeiro arquivo para começar.</p>
                                        </div>
                                    )}
                                </div>
                            </div>
                        </div>
                    ) : (
                        <div className="flex-1 border-2 border-dashed border-slate-800 rounded-3xl flex flex-col items-center justify-center p-12 text-center bg-slate-900/30">
                            <Icon name="monitoring" size={64} className="text-slate-700 mb-6" />
                            <h2 className="text-2xl font-bold text-slate-300 mb-2">Módulo: {activeTab}</h2>
                            <p className="text-slate-500 max-w-md">
                                O mock para o módulo de <strong className="text-primary">{activeTab}</strong> será construído quando definirmos a estrutura da API do Backend. Use o menu ao lado para explorar.
                            </p>
                        </div>
                    )}
                </div>
            </main>

            {/* Modal de Preview de Imagem */}
            {previewImage && (
                <div
                    className="fixed inset-0 z-[100] flex items-center justify-center p-4 bg-black/90 backdrop-blur-sm animate-in fade-in duration-300"
                    onClick={() => setPreviewImage(null)}
                >
                    <div className="relative max-w-5xl w-full h-full flex flex-col items-center justify-center">
                        <button
                            className="absolute top-0 right-0 m-4 p-2 bg-white/10 hover:bg-white/20 text-white rounded-full transition-colors"
                            onClick={() => setPreviewImage(null)}
                        >
                            <Icon name="close" size={24} />
                        </button>
                        <img
                            src={previewImage}
                            alt="Preview"
                            className="max-w-full max-h-[85vh] object-contain rounded-2xl shadow-2xl"
                            onClick={(e) => e.stopPropagation()}
                        />
                        <div className="mt-6 flex gap-4">
                            <button
                                onClick={(e) => { e.stopPropagation(); copyToClipboard(previewImage); }}
                                className="px-6 py-2.5 bg-primary hover:bg-[#D96D3E] text-white rounded-xl font-bold flex items-center gap-2 transition-colors"
                            >
                                <Icon name="content_copy" size={18} /> Copiar URL
                            </button>
                            <a
                                href={previewImage}
                                download
                                className="px-6 py-2.5 bg-slate-800 hover:bg-slate-700 text-white rounded-xl font-bold flex items-center gap-2 transition-colors"
                                onClick={(e) => e.stopPropagation()}
                            >
                                <Icon name="download" size={18} /> Baixar
                            </a>
                        </div>
                    </div>
                </div>
            )}
        </div>
    );
}

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
        setCurrentUser(JSON.parse(savedUser));
    }, [navigate]);

    // --- RSS State ---
    const [feeds, setFeeds] = useState([
        { id: 1, url: 'novavenezaonline.com.br/feed', verified: true },
        { id: 2, url: 'engeplus.com.br/rss', verified: true },
        { id: 3, url: 'agorasul.com.br/feed', verified: false },
        { id: 4, url: 'tnsul.com/feed', verified: true },
        { id: 5, url: 'canalicara.com/rss', verified: false }
    ]);
    const [tags, setTags] = useState([
        { id: 1, name: 'SCCS' },
        { id: 2, name: 'Sociedade Cultural Cruzeiro do Sul' },
        { id: 3, name: 'Chorinho Carvoeiro' },
        { id: 4, name: 'Músicos do Futuro' },
        { id: 5, name: 'Garantindo o Direito da Pessoa Idosa' }
    ]);

    // --- USERS State ---
    const [users, setUsers] = useState([]);
    const [newUser, setNewUser] = useState({ id: null, username: '', password: '', confirmPassword: '', role: 'user', menuAccess: [] });
    const [userError, setUserError] = useState('');

    const loadUsers = async () => {
        try {
            const res = await fetch('http://localhost:5000/api/users');
            if (res.ok) {
                const data = await res.json();
                setUsers(data);
            }
        } catch (err) {
            console.error("Erro ao carregar usuários:", err);
        }
    };

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
            const url = newUser.id ? `http://localhost:5000/api/users/${newUser.id}` : 'http://localhost:5000/api/users';
            const method = newUser.id ? 'PUT' : 'POST';

            const res = await fetch(url, {
                method,
                headers: { 'Content-Type': 'application/json' },
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

    const handleRemoveUser = async (id) => {
        if (!window.confirm("Deseja remover este usuário?")) return;
        try {
            const res = await fetch(`http://localhost:5000/api/users/${id}`, { method: 'DELETE' });
            if (res.ok) loadUsers();
        } catch (error) {
            console.error(error);
        }
    };

    const handleEditUser = (user) => {
        setNewUser({
            id: user.id,
            username: user.username,
            password: '',
            confirmPassword: '',
            role: user.role,
            menuAccess: user.menuAccess || []
        });
        setUserError('');
    };

    const togglePermission = (perm) => {
        const currentPerms = newUser.menuAccess;
        if (currentPerms.includes(perm)) {
            setNewUser({ ...newUser, menuAccess: currentPerms.filter(p => p !== perm) });
        } else {
            setNewUser({ ...newUser, menuAccess: [...currentPerms, perm] });
        }
    };

    const handleToggleUserPermission = async (userId, perm) => {
        const user = users.find(u => u.id === userId);
        if (!user) return;
        
        const updatedPerms = user.menuAccess.includes(perm)
            ? user.menuAccess.filter(p => p !== perm)
            : [...user.menuAccess, perm];
            
        try {
            const res = await fetch(`http://localhost:5000/api/users/${userId}`, {
                method: 'PUT',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify({ menuAccess: updatedPerms })
            });
            
            if (res.ok) {
                setUsers(prev => prev.map(u => u.id === userId ? { ...u, menuAccess: updatedPerms } : u));
            }
        } catch (err) {
            console.error("Erro ao atualizar permissões do usuário:", err);
        }
    };

    // --- EVENTS State ---
    const [events, setEvents] = useState([]);

    useEffect(() => {
        fetch('http://localhost:5000/api/events')
            .then(res => res.json())
            .then(data => setEvents(data))
            .catch(err => console.error("Erro ao carregar eventos:", err));
    }, []);

    const [newEvent, setNewEvent] = useState({
        title: '', tag: '', date: '', time: '', locationLink: '', description: '', image: ''
    });

    const handleAddEvent = async (e) => {
        e.preventDefault();
        if (!newEvent.title.trim() || !newEvent.date.trim()) return;

        try {
            if (newEvent.id) {
                // Edit existing
                const res = await fetch(`http://localhost:5000/api/events/${newEvent.id}`, {
                    method: 'PUT',
                    headers: { 'Content-Type': 'application/json' },
                    body: JSON.stringify(newEvent)
                });
                if (res.ok) {
                    const updatedEvent = await res.json();
                    setEvents(events.map(ev => ev.id === newEvent.id ? updatedEvent : ev));
                }
            } else {
                // Create new
                const res = await fetch('http://localhost:5000/api/events', {
                    method: 'POST',
                    headers: { 'Content-Type': 'application/json' },
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
            const res = await fetch(`http://localhost:5000/api/events/${id}`, {
                method: 'DELETE'
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

    const handleAddFeed = (e) => {
        e.preventDefault();
        if (!newFeedUrl.trim()) return;
        setFeeds([...feeds, { id: Date.now(), url: newFeedUrl, verified: newFeedVerified }]);
        setNewFeedUrl('');
        setNewFeedVerified(true);
    };

    const handleRemoveFeed = (id) => {
        setFeeds(feeds.filter(f => f.id !== id));
    };

    const handleToggleVerification = (id) => {
        setFeeds(feeds.map(f => f.id === id ? { ...f, verified: !f.verified } : f));
    }

    const handleAddTag = (e) => {
        e.preventDefault();
        if (!newTagName.trim()) return;
        setTags([...tags, { id: Date.now(), name: newTagName }]);
        setNewTagName('');
    };

    const handleRemoveTag = (id) => {
        setTags(tags.filter(t => t.id !== id));
    };

    const [isRefreshing, setIsRefreshing] = useState(false);

    const handleRefreshRSS = async () => {
        setIsRefreshing(true);
        try {
            const res = await fetch('http://localhost:5000/api/rss/refresh', { method: 'POST' });
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
            const res = await fetch(`http://localhost:5000/api/files?path=${path}`);
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
        if (activeTab === 'Banco de Dados') {
            loadFiles();
        }
    }, [activeTab]);

    const handleUpload = async (e) => {
        const file = e.target.files[0];
        if (!file) return;

        setIsUploading(true);
        const formData = new FormData();
        formData.append('file', file);
        formData.append('path', currentPath || 'general');

        try {
            const res = await fetch('http://localhost:5000/api/upload', {
                method: 'POST',
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
            const res = await fetch(`http://localhost:5000/api/files?path=${filePath}`, {
                method: 'DELETE'
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
        { name: 'Banco de Dados', icon: <Icon name="database" /> },
        { name: 'Pagamentos', icon: <Icon name="credit_card" />, href: 'https://pagamentos.sccruzeirodosul.org/' },
    ];

    // Filter items based on user permissions or preview
    const activeNavItems = (() => {
        if (previewUserId) {
            const previewedUser = users.find(u => u.id === previewUserId);
            return allNavItems.filter(item => (previewedUser?.menuAccess || []).includes(item.name));
        }
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
                        <p className="text-slate-500 text-sm mt-2 font-medium">Área Restrita Administrativa</p>
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
                                        <a href="/sccs_site/#eventos" target="_blank" rel="noopener noreferrer" className="text-xs text-primary hover:text-white flex items-center gap-1 transition-colors w-max">
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
                                    <Icon name="lock" size={64} className="text-red-500" />
                                </div>
                                <h2 className="text-2xl font-bold text-white mb-2">Acesso Restrito</h2>
                                <p className="text-slate-400 max-w-md">Apenas administradores podem gerenciar usuários e permissões do sistema.</p>
                            </div>
                        )
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

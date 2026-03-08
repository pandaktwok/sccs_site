import React, { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { Activity, Calendar, Rss, Database, CreditCard, User, LogOut, Menu, X, ExternalLink } from 'lucide-react';

export default function Dashboard() {
    const navigate = useNavigate();
    const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);
    const [activeTab, setActiveTab] = useState('Geral');

    const handleLogout = () => {
        navigate('/login');
    };

    const navItems = [
        { name: 'Usuário', icon: <User size={20} /> },
        { name: 'Gerir Eventos', icon: <Calendar size={20} /> },
        { name: 'Notícias & RSS', icon: <Rss size={20} /> },
        { name: 'Banco de Dados', icon: <Database size={20} /> },
        { name: 'Pagamentos', icon: <CreditCard size={20} />, href: 'https://pagamentos.sccruzeirodosul.org/' },
    ];

    return (
        <div className="flex h-screen bg-background-dark font-display text-slate-100 overflow-hidden">
            {/* Sidebar Desktop */}
            <aside className="hidden md:flex flex-col w-72 bg-slate-900 border-r border-slate-800 h-full">
                <div className="p-8 border-b border-slate-800">
                    <h2 className="text-2xl font-extrabold text-white tracking-tight flex items-center gap-2">
                        <Activity className="text-primary" size={28} />
                        Painel<span className="text-primary">SCCS</span>
                    </h2>
                    <p className="text-slate-500 text-sm mt-2 font-medium">Área Restrita Administrativa</p>
                </div>

                <nav className="flex-1 overflow-y-auto py-6 px-4 space-y-2">
                    {navItems.map((item) => (
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
                                <ExternalLink size={16} className="ml-auto opacity-50" />
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
                </nav>

                <div className="p-6 border-t border-slate-800">
                    <button
                        onClick={handleLogout}
                        className="w-full flex items-center justify-center gap-2 px-4 py-3 bg-red-500/10 text-red-400 hover:bg-red-500/20 border border-red-500/20 transition-colors tracking-wide font-bold rounded-xl text-sm"
                    >
                        <LogOut size={18} />
                        Sair do Sistema
                    </button>
                </div>
            </aside>

            {/* Mobile Header & Overlay */}
            <div className="md:hidden fixed top-0 w-full z-50 bg-slate-900 border-b border-slate-800 p-4 flex items-center justify-between">
                <h2 className="text-xl font-extrabold text-white flex items-center gap-2">
                    <Activity className="text-primary" size={24} />
                    Painel<span className="text-primary">SCCS</span>
                </h2>
                <button onClick={() => setIsMobileMenuOpen(!isMobileMenuOpen)} className="text-slate-300">
                    {isMobileMenuOpen ? <X size={28} /> : <Menu size={28} />}
                </button>
            </div>

            {/* Mobile Sidebar */}
            {isMobileMenuOpen && (
                <div className="md:hidden fixed inset-0 z-40 bg-slate-900 pt-20 flex flex-col h-full">
                    <nav className="flex-1 overflow-y-auto px-6 py-4 space-y-4">
                        {navItems.map((item) => (
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
                                    <ExternalLink size={18} className="ml-auto opacity-50" />
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
                            <LogOut size={24} />
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
                        <h1 className="text-4xl font-extrabold text-white mt-1">Bem-vindo, Admin!</h1>
                        <p className="text-slate-400 mt-2 text-lg">Selecione uma opção no menu lateral para visualizar os dados.</p>
                    </header>

                    {/* Placeholder para o Conteúdo de Cada Tab */}
                    <div className="flex-1 border-2 border-dashed border-slate-800 rounded-3xl flex flex-col items-center justify-center p-12 text-center bg-slate-900/30">
                        <Activity className="text-slate-700 mb-6" size={64} />
                        <h2 className="text-2xl font-bold text-slate-300 mb-2">Módulo: {activeTab}</h2>
                        <p className="text-slate-500 max-w-md">
                            O mock para o módulo de <strong className="text-primary">{activeTab}</strong> será construído quando definirmos a estrutura da API do Backend. Use o menu ao lado para explorar.
                        </p>
                    </div>
                </div>
            </main>
        </div>
    );
}

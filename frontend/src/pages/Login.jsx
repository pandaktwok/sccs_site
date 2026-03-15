import React, { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import Turnstile from 'react-turnstile';
import Header from '../components/Header';

export default function Login() {
    const [showPassword, setShowPassword] = useState(false); // false = senha ocuta
    const [username, setUsername] = useState('');
    const [password, setPassword] = useState('');
    const [turnstileToken, setTurnstileToken] = useState('');
    const [error, setError] = useState('');
    const navigate = useNavigate();

    const handleLogin = async (e) => {
        e.preventDefault();
        setError('');

        try {
            const res = await fetch('/api/auth/login', {
                method: 'POST',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify({ username, password, turnstileToken })
            });

            if (res.ok) {
                const userData = await res.json();
                // Salvar dados do usuário para persistência
                localStorage.setItem('sccs_user', JSON.stringify(userData));
                navigate('/area-restrita');
            } else {
                const data = await res.json();
                setError(data.error || 'Erro ao realizar login.');
            }
        } catch (err) {
            console.error(err);
            setError('Falha na comunicação com o servidor.');
        }
    };

    return (
        <div className="bg-background-light dark:bg-background-dark min-h-screen flex flex-col font-display">
            <Header />

            <main className="flex-grow flex flex-col lg:flex-row pt-20">
                <div className="hidden lg:flex lg:w-1/2 relative overflow-hidden bg-primary/10">
                    <div className="absolute inset-0 bg-cover bg-center" style={{ backgroundImage: "url('https://lh3.googleusercontent.com/aida-public/AB6AXuCAp0tuZKV_C69_MauOfEVxeiSTqcIYOj9whh9qXYkc-fg-dwwaOUArR61fIBKkeQImB3UlfcIw9Q1tQE2nhLpqeoCybxEovl8PCiLu5SQ5cFLrwRKew2c8oZKttIb1Ovwh0OYeILLcTiF3DSzszLvBPwdxF41scUnOyhf07yKqvQUrXqRKLMk6PBuXfFZkeCCSe2UTVcwoLxkzGBqeiue8Ggcltby2ORAzSSC1DTisyaVPai4nMq8MRhQbIjdnf8YfdismR8iKyKU')" }}></div>
                    <div className="absolute inset-0 bg-gradient-to-t from-background-dark/80 to-transparent"></div>
                    <div className="absolute bottom-12 left-12 right-12 text-slate-100">
                        <h1 className="text-4xl font-bold mb-4">Empoderando a Cultura através da Música</h1>
                        <p className="text-lg opacity-90 max-w-md">Junte-se à nossa comunidade de músicos e estudantes dedicados ao desenvolvimento artístico da Sociedade Cultural Cruzeiro do Sul.</p>
                    </div>
                </div>

                <div className="w-full lg:w-1/2 flex flex-col justify-center items-center p-8 md:p-16 bg-white dark:bg-background-dark">
                    <div className="w-full max-w-md">
                        <div className="mb-10">
                            <h3 className="text-slate-900 dark:text-slate-100 text-3xl font-extrabold mb-2">Área Restrita</h3>
                            <p className="text-slate-500 dark:text-slate-400">Bem-vindo de volta. Por favor, acesse sua conta admin.</p>
                        </div>

                        {error && (
                            <div className="mb-6 p-4 bg-red-50 dark:bg-red-900/30 border-l-4 border-red-500 text-red-700 dark:text-red-400 text-sm font-semibold">
                                {error}
                            </div>
                        )}

                        <form className="space-y-6" onSubmit={handleLogin}>
                            <div>
                                <label className="block text-slate-700 dark:text-slate-300 text-sm font-semibold mb-2">E-mail ou Usuário</label>
                                <div className="relative">
                                    <input
                                        className="w-full px-4 py-4 rounded-xl border border-slate-200 dark:border-slate-700 bg-white dark:bg-slate-900 text-slate-900 dark:text-slate-100 focus:ring-2 focus:ring-primary focus:border-transparent transition-all outline-none placeholder:text-slate-400"
                                        placeholder="Digite seu e-mail ou usuário"
                                        type="text"
                                        value={username}
                                        onChange={(e) => setUsername(e.target.value)}
                                        required
                                    />
                                </div>
                            </div>
                            <div>
                                <div className="flex justify-between items-center mb-2">
                                    <label className="block text-slate-700 dark:text-slate-300 text-sm font-semibold">Senha</label>
                                </div>
                                <div className="relative flex items-center">
                                    <input
                                        className="w-full px-4 py-4 rounded-xl border border-slate-200 dark:border-slate-700 bg-white dark:bg-slate-900 text-slate-900 dark:text-slate-100 focus:ring-2 focus:ring-primary focus:border-transparent transition-all outline-none placeholder:text-slate-400 pr-12"
                                        placeholder="Digite sua senha"
                                        type={showPassword ? 'text' : 'password'}
                                        value={password}
                                        onChange={(e) => setPassword(e.target.value)}
                                        required
                                    />
                                    <button
                                        className="absolute right-4 text-slate-400 hover:text-primary transition-colors focus:outline-none"
                                        type="button"
                                        onClick={() => setShowPassword(!showPassword)}
                                        aria-label={showPassword ? 'Ocultar senha' : 'Exibir senha'}
                                    >
                                        <span className="material-symbols-outlined select-none text-2xl">
                                            {showPassword ? 'visibility' : 'visibility_off'}
                                        </span>
                                    </button>
                                </div>
                            </div>

                            {/* Cloudflare Turnstile - Desativado conforme pedido, mantendo código para o futuro
                            <div className="flex justify-center">
                                <Turnstile
                                    sitekey={import.meta.env.VITE_CLOUDFLARE_TURNSTILE_SITE_KEY}
                                    onVerify={(token) => setTurnstileToken(token)}
                                    theme="auto"
                                />
                            </div>
                            */}

                            <div className="flex items-center justify-between">
                                <label className="flex items-center gap-2 cursor-pointer group">
                                    <input className="rounded text-primary focus:ring-primary border-slate-300" type="checkbox" />
                                    <span className="text-sm text-slate-600 dark:text-slate-400 group-hover:text-slate-900 dark:group-hover:text-slate-200">Lembrar de mim</span>
                                </label>
                                <Link className="text-sm font-semibold text-primary hover:underline" to="/login">Esqueceu a senha?</Link>
                            </div>
                            <button 
                                className={`w-full bg-primary hover:bg-[#D96D3E] text-white font-bold py-4 rounded-xl transition-all shadow-lg shadow-primary/20 flex items-center justify-center gap-2 cursor-pointer`} 
                                type="submit"
                            >
                                <span>Entrar</span>
                                <span className="material-symbols-outlined text-lg">login</span>
                            </button>
                        </form>
                    </div>
                </div>
            </main>
        </div>
    );
}

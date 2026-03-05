import React from 'react';
import Header from '../components/Header';

export default function Donation() {
    return (
        <div className="bg-background-light dark:bg-background-dark font-display text-slate-900 dark:text-slate-100 min-h-screen flex flex-col pt-20">
            <Header />

            <main className="flex-1">
                <div className="px-4 md:px-20 lg:px-40 py-8">
                    <div className="relative min-h-[400px] flex flex-col gap-6 bg-cover bg-center bg-no-repeat rounded-xl md:rounded-3xl items-center justify-center p-8 overflow-hidden" style={{ backgroundImage: "linear-gradient(rgba(34, 24, 16, 0.7), rgba(34, 24, 16, 0.7)), url('https://lh3.googleusercontent.com/aida-public/AB6AXuAYPok7pFpnOHrYtndOZ8QTmViG3LWAoIXgaCmiDJ_U-qhBgm5mQ5Tyc9WmKI7fgwGMoElZ5JkEsge86klODjQ9Ft4BcVZfp2i0AdjerFTQqlIVZmQxyS7a7plwGv9xzwOxwpciH4As70q7GqWMSjd4cJQo44oXZ8bCNYOY2_PjctMZKr70x4aRpzUVktEgTIImUjHeNnjMwh_DpvCVhu4m9jHsLQ-uu144vD2_Sv_9m2EIIjGp_nTQU_a8q_fq7R-6zaNdk5w7nIw')" }}>
                        <div className="max-w-3xl flex flex-col gap-4 text-center z-10">
                            <span className="text-primary font-bold tracking-widest uppercase text-xs">Preservando a Arte</span>
                            <h1 className="text-white text-4xl md:text-6xl font-extrabold leading-tight tracking-tighter">
                                Apoie o Som do Nosso Futuro
                            </h1>
                            <p className="text-slate-200 text-lg md:text-xl font-medium max-w-2xl mx-auto leading-relaxed">
                                Sua contribuição financia diretamente a preservação de tradições musicais e capacita a próxima geração de artistas.
                            </p>
                        </div>
                    </div>
                </div>

                <section className="px-4 md:px-20 lg:px-40 py-12">
                    <div className="max-w-4xl mx-auto bg-white dark:bg-slate-900 rounded-3xl p-8 md:p-12 shadow-xl border border-primary/5">
                        <div className="text-center mb-10">
                            <h2 className="text-2xl md:text-3xl font-bold text-slate-900 dark:text-slate-100">Faça um Impacto Hoje</h2>
                            <p className="text-slate-500 dark:text-slate-400 mt-2">Escolha um valor para apoiar nossas iniciativas culturais</p>
                        </div>
                        <div className="grid grid-cols-2 md:grid-cols-4 gap-4 mb-8">
                            <button className="flex flex-col items-center justify-center rounded-2xl h-24 border-2 border-primary/10 bg-background-light dark:bg-slate-800 hover:border-primary hover:bg-primary/5 transition-all group">
                                <span className="text-2xl font-bold text-slate-900 dark:text-slate-100 group-hover:text-primary">R$ 25</span>
                                <span className="text-xs text-slate-500 uppercase tracking-wider mt-1">Apoiador</span>
                            </button>
                            <button className="flex flex-col items-center justify-center rounded-2xl h-24 border-2 border-primary/10 bg-background-light dark:bg-slate-800 hover:border-primary hover:bg-primary/5 transition-all group">
                                <span className="text-2xl font-bold text-slate-900 dark:text-slate-100 group-hover:text-primary">R$ 50</span>
                                <span className="text-xs text-slate-500 uppercase tracking-wider mt-1">Parceiro</span>
                            </button>
                            <button className="flex flex-col items-center justify-center rounded-2xl h-24 border-2 border-primary bg-primary/5 transition-all">
                                <span className="text-2xl font-bold text-primary">R$ 100</span>
                                <span className="text-xs text-primary uppercase tracking-wider mt-1">Campeão</span>
                            </button>
                            <button className="flex flex-col items-center justify-center rounded-2xl h-24 border-2 border-primary/10 bg-background-light dark:bg-slate-800 hover:border-primary hover:bg-primary/5 transition-all group">
                                <span className="text-2xl font-bold text-slate-900 dark:text-slate-100 group-hover:text-primary">R$ 250</span>
                                <span className="text-xs text-slate-500 uppercase tracking-wider mt-1">Patrono</span>
                            </button>
                        </div>
                        <div className="max-w-md mx-auto mb-10">
                            <label className="block text-sm font-semibold text-slate-700 dark:text-slate-300 mb-2 text-center">Ou insira um valor personalizado</label>
                            <div className="relative">
                                <span className="absolute left-4 top-1/2 -translate-y-1/2 text-slate-400 font-bold">R$</span>
                                <input className="w-full bg-background-light dark:bg-slate-800 border-2 border-primary/10 rounded-2xl h-14 pl-12 pr-4 text-lg font-bold focus:border-primary focus:ring-0 transition-all outline-none" placeholder="0,00" type="number" />
                            </div>
                        </div>
                        <div className="flex flex-col items-center gap-4">
                            <button className="w-full max-w-sm bg-primary text-white text-lg font-bold py-4 rounded-2xl shadow-lg shadow-primary/30 hover:scale-[1.02] active:scale-[0.98] transition-all cursor-pointer">
                                Finalizar Doação
                            </button>
                            <p className="text-xs text-slate-400 flex items-center gap-1">
                                <span className="material-symbols-outlined text-sm">lock</span>
                                Transação criptografada e segura
                            </p>
                        </div>
                    </div>
                </section>
            </main>

            <footer className="bg-white dark:bg-slate-950 border-t border-primary/10 px-6 md:px-20 lg:px-40 py-16 text-center text-xs text-slate-400">
                <p>© 2026 ONG Patrimônio Cultural. Todos os direitos reservados. Organização sem fins lucrativos.</p>
            </footer>
        </div>
    );
}

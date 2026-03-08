import React, { useState } from 'react';
import Header from '../components/Header';

export default function Donation() {
    const [activeTab, setActiveTab] = useState('FIA');

    const accountsData = {
        FIA: {
            title: "Fundo da Infância e Adolescência (FIA)",
            description: "Apoie projetos voltados diretamente para nossas crianças e adolescentes.",
            banco: "Banco do Brasil (001)",
            agencia: "1234-5",
            conta: "98765-4",
            cnpj: "00.000.000/0001-00 (Fundo FIA)",
            pix: "fia@sccruzeirodosul.org"
        },
        FMI: {
            title: "Fundo Municipal do Idoso (FMI)",
            description: "Contribua para a inclusão e qualidade de vida da terceira idade através da arte.",
            banco: "Caixa Econômica Federal (104)",
            agencia: "0123",
            conta: "45678-9",
            cnpj: "11.111.111/0001-11 (Fundo FMI)",
            pix: "fmi@sccruzeirodosul.org"
        },
        SCCS: {
            title: "Sociedade Cultura Cruzeiro do Sul",
            description: "Doação direta para a manutenção da nossa orquestra e estrutura cultural.",
            banco: "Banco Itaú (341)",
            agencia: "4321",
            conta: "11223-4",
            cnpj: "22.222.222/0001-22 (SCCS)",
            pix: "00.000.000/0001-00"
        }
    };

    return (
        <div className="bg-background-light dark:bg-background-dark font-display text-slate-900 dark:text-slate-100 min-h-screen flex flex-col pt-20">
            <Header />

            <main className="flex-1 relative flex items-center justify-center py-12 md:py-24 px-4 min-h-[calc(100vh-80px)]">
                {/* Unified Background */}
                <div
                    className="absolute inset-0 bg-cover bg-center bg-no-repeat bg-fixed object-cover"
                    style={{ backgroundImage: "url('https://lh3.googleusercontent.com/aida-public/AB6AXuAYPok7pFpnOHrYtndOZ8QTmViG3LWAoIXgaCmiDJ_U-qhBgm5mQ5Tyc9WmKI7fgwGMoElZ5JkEsge86klODjQ9Ft4BcVZfp2i0AdjerFTQqlIVZmQxyS7a7plwGv9xzwOxwpciH4As70q7GqWMSjd4cJQo44oXZ8bCNYOY2_PjctMZKr70x4aRpzUVktEgTIImUjHeNnjMwh_DpvCVhu4m9jHsLQ-uu144vD2_Sv_9m2EIIjGp_nTQU_a8q_fq7R-6zaNdk5w7nIw')" }}
                />
                <div className="absolute inset-0 bg-slate-900/80 backdrop-blur-sm z-0" />

                <div className="relative z-10 w-full max-w-5xl mx-auto flex flex-col lg:flex-row gap-12 items-center">
                    {/* Texto Principal */}
                    <div className="flex-1 text-center lg:text-left">
                        <span className="text-primary font-bold tracking-widest uppercase text-xs md:text-sm mb-4 block">Faça um Impacto Hoje</span>
                        <h1 className="text-white text-4xl md:text-5xl lg:text-6xl font-extrabold leading-tight tracking-tighter mb-6">
                            Apoie o Som do Nosso Futuro
                        </h1>
                        <p className="text-slate-300 text-lg md:text-xl font-medium max-w-2xl mx-auto lg:mx-0 leading-relaxed mb-8">
                            Sua contribuição financia diretamente a preservação de tradições musicais e capacita a próxima geração de artistas. Escolha a melhor forma de apoiar.
                        </p>
                    </div>

                    {/* Menu de Doação / Contas */}
                    <div className="w-full max-w-md bg-white/10 dark:bg-slate-900/40 backdrop-blur-md border border-white/20 dark:border-slate-700/50 rounded-3xl overflow-hidden shadow-2xl">

                        {/* Tabs */}
                        <div className="flex border-b border-white/10 dark:border-slate-700/50">
                            {['FIA', 'FMI', 'SCCS'].map((tab) => (
                                <button
                                    key={tab}
                                    onClick={() => setActiveTab(tab)}
                                    className={`flex-1 py-4 text-sm font-bold uppercase tracking-wider transition-all duration-300 ${activeTab === tab ? 'bg-primary text-white' : 'text-slate-300 hover:bg-white/5 hover:text-white'}`}
                                >
                                    {tab}
                                </button>
                            ))}
                        </div>

                        {/* Detalhes da Conta */}
                        <div className="p-8 md:p-10 text-center flex flex-col items-center">
                            <div className="w-16 h-16 rounded-full bg-primary/20 flex items-center justify-center text-primary mb-6 animate-[fadeIn_0.5s_ease-out]" key={`icon-${activeTab}`}>
                                <span className="material-symbols-outlined text-3xl">account_balance</span>
                            </div>

                            <h3 className="text-xl md:text-2xl font-bold text-white mb-2 animate-[fadeIn_0.5s_ease-out]" key={`title-${activeTab}`}>
                                {accountsData[activeTab].title}
                            </h3>
                            <p className="text-sm text-slate-300 mb-8 animate-[fadeIn_0.5s_ease-out]" key={`desc-${activeTab}`}>
                                {accountsData[activeTab].description}
                            </p>

                            <div className="w-full space-y-4 text-left border border-white/10 dark:border-slate-700/50 bg-slate-900/50 rounded-2xl p-6 animate-[fadeIn_0.5s_ease-out]" key={`details-${activeTab}`}>
                                <div className="flex justify-between items-center border-b border-white/10 pb-3">
                                    <span className="text-slate-400 text-xs uppercase tracking-wider">Banco</span>
                                    <span className="text-white font-semibold text-sm">{accountsData[activeTab].banco}</span>
                                </div>
                                <div className="flex justify-between items-center border-b border-white/10 pb-3">
                                    <span className="text-slate-400 text-xs uppercase tracking-wider">Agência</span>
                                    <span className="text-white font-semibold text-sm">{accountsData[activeTab].agencia}</span>
                                </div>
                                <div className="flex justify-between items-center border-b border-white/10 pb-3">
                                    <span className="text-slate-400 text-xs uppercase tracking-wider">Conta Corrente</span>
                                    <span className="text-white font-semibold text-sm">{accountsData[activeTab].conta}</span>
                                </div>
                                <div className="flex justify-between items-center border-b border-white/10 pb-3">
                                    <span className="text-slate-400 text-xs uppercase tracking-wider">CNPJ</span>
                                    <span className="text-white font-semibold text-sm text-right max-w-[150px] truncate" title={accountsData[activeTab].cnpj}>{accountsData[activeTab].cnpj}</span>
                                </div>
                                <div className="flex justify-between items-center pt-1">
                                    <span className="text-slate-400 text-xs uppercase tracking-wider">Chave PIX</span>
                                    <span className="text-primary font-bold text-sm tracking-wide">{accountsData[activeTab].pix}</span>
                                </div>
                            </div>
                        </div>
                    </div>
                </div>
            </main>
        </div>
    );
}

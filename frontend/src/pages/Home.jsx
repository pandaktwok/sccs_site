import React, { useEffect, useRef, useState } from 'react';
import { Link, useLocation } from 'react-router-dom';
import Header from '../components/Header';

export default function Home() {
    const location = useLocation();
    const carouselRef = useRef(null);
    const scrollInterval = useRef(null);
    const [isHoveringCarousel, setIsHoveringCarousel] = useState(false);

    // Mock RSS Data para apresentação de Layout (Sem requisições à APIs externas)
    const rssMockData = [
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

    // Auto-Scroll do Carrossel 
    useEffect(() => {
        const carousel = carouselRef.current;
        if (!carousel) return;

        const startAutoScroll = () => {
            scrollInterval.current = setInterval(() => {
                // Rola 1px por frame. Quando atingir o final, volta para o início suavemente
                if (carousel.scrollLeft >= carousel.scrollWidth - carousel.clientWidth - 1) {
                    carousel.scrollTo({ left: 0, behavior: 'smooth' });
                } else {
                    carousel.scrollBy({ left: 1, behavior: 'auto' });
                }
            }, 30); // 30ms para animação fluida
        };

        if (!isHoveringCarousel) {
            startAutoScroll();
            // Esconde a barra de rolagem quando não hover via CSS custom (ver className)
        } else {
            clearInterval(scrollInterval.current);
            // Barra de rolagem nativa fica disponível para controle manual
        }

        return () => {
            if (scrollInterval.current) clearInterval(scrollInterval.current);
        };
    }, [isHoveringCarousel]);


    // Rolar para a seção correta se vier de outra página com hash
    useEffect(() => {
        if (location.hash) {
            const id = location.hash.replace('#', '');
            const element = document.getElementById(id);
            if (element) {
                setTimeout(() => {
                    element.scrollIntoView({ behavior: 'smooth', block: 'start' });
                }, 100);
            }
        }
    }, [location]);

    return (
        <div className="bg-background-light dark:bg-background-dark text-slate-900 dark:text-slate-100 transition-colors duration-300">
            <Header />

            {/* SEÇÃO INÍCIO */}
            <section id="inicio" className="relative h-screen min-h-[850px] flex items-center justify-center p-6 pt-20">
                <div className="absolute inset-0 z-0 overflow-hidden">
                    <img
                        alt="Band Performance"
                        className="w-full h-full object-cover"
                        src="https://lh3.googleusercontent.com/aida-public/AB6AXuDH4pOiw_k0ZhYpYolPQcl9TXg0xvbKldU7l_ciSMenSS_H5WXboQsGWcAnoy0wc-novN1AwEumuOVBYEuqmCiYJwvfqYpescoy3107DONk6HvGxCRdNBIqL7b9FliAIcgshGN6oXDMlQIltlvQlwtJ6xnRKrK7zTku7sSu6VAbjdqAHgkXxYYGSWDP7NJxRsJEcVdpLhTYvrfsLVkhxUPfyr9TjW9iK7KDC3cCFsZ029pPlj_eywVaSOxi9xaCGkHqZAkk2XwFPj8"
                    />
                    <div className="absolute inset-0 bg-gradient-to-b from-black/60 via-black/30 to-black/60"></div>
                </div>
                <div className="relative z-10 text-center max-w-4xl px-6">
                    <span className="inline-block px-4 py-1.5 rounded-full bg-white/10 backdrop-blur-md text-white/90 text-xs font-bold uppercase tracking-[0.2em] mb-6 border border-white/20">Tradição & Cultura</span>
                    <h1 className="text-5xl md:text-7xl font-extrabold text-white mb-8 leading-[1.05] tracking-tight">Cultivando Ritmo e Tradição</h1>
                    <p className="text-lg md:text-xl text-white/90 mb-12 max-w-2xl mx-auto leading-relaxed font-medium">
                        Capacitando a comunidade através do poder transformador da educação musical orquestral e folclórica brasileira.
                    </p>
                </div>
            </section>

            {/* SEÇÃO PROJETOS (CARROSSEL COM 5 CARDS) */}
            <section id="projetos" className="py-20 px-6 max-w-7xl mx-auto scroll-mt-20">
                <div className="flex flex-col md:flex-row md:items-end justify-between mb-16 gap-8">
                    <div className="max-w-xl">
                        <span className="text-primary font-bold uppercase tracking-[0.2em] text-xs">Descubra</span>
                        <h2 className="text-4xl md:text-5xl font-extrabold mt-3 dark:text-white leading-tight">Nossos Principais Programas Culturais</h2>
                    </div>
                    <p className="text-slate-500 dark:text-slate-400 max-w-sm text-lg leading-relaxed">
                        Do treinamento clássico aos conjuntos tradicionais, deslize para conhecer nossos 5 destaques deste semestre.
                    </p>
                </div>

                <div
                    ref={carouselRef}
                    onMouseEnter={() => setIsHoveringCarousel(true)}
                    onMouseLeave={() => setIsHoveringCarousel(false)}
                    onTouchStart={() => setIsHoveringCarousel(true)}
                    onTouchEnd={() => setIsHoveringCarousel(false)}
                    className={`flex overflow-x-auto gap-8 pb-8 ${!isHoveringCarousel ? 'scrollbar-hide' : 'scrollbar-default'} transition-all`}
                    style={{ scrollbarWidth: isHoveringCarousel ? 'auto' : 'none', msOverflowStyle: isHoveringCarousel ? 'auto' : 'none' }}
                >
                    {/* Estilo embutido pro webkit scrollbar esconder quando auto-rolando */}
                    <style>{`
                         .scrollbar-hide::-webkit-scrollbar { display: none; }
                    `}</style>

                    {/* Card 1 */}
                    <div className="group relative h-[550px] w-full min-w-[320px] md:w-[calc(33.333%-1.5rem)] md:min-w-[350px] flex-shrink-0 snap-start rounded-[2rem] overflow-hidden cursor-pointer shadow-2xl">
                        <img alt="Youth Wind Classes" className="absolute inset-0 w-full h-full object-cover transition-transform duration-1000 group-hover:scale-110" src="https://lh3.googleusercontent.com/aida-public/AB6AXuAhysACTL1JzRViWs-2RTPLgrfnC7sahn5s8edpvicLUw5NrU9lKoF8DOGDkpYCC0HZb4-MNlZZ6S8mgyRrrzr1PFu2UlxmmNpZGT4d9VPa3mYAAXzKrwuvvN5qo7OpVge63IscAXHl3I6j9SR8RhgNpfLJ6zArCkVYNkLWvfDFyxMZXf5JU5IZj7mJXk7ncWVNsceDQ09d1_q3NSGcBGzReJnxIry3D7sBfqqa8fze5GcdhfcHdWDQFyu3tBRrqC3K-GN5gsPXL0Y" />
                        <div className="absolute inset-0 bg-gradient-to-t from-black/90 via-black/20 to-transparent"></div>
                        <div className="absolute bottom-0 left-0 p-10 w-full">
                            <p className="text-white/70 text-sm font-semibold mb-2 tracking-wide">Treinamento Orquestral</p>
                            <h3 className="text-3xl font-bold text-white mb-4 group-hover:-translate-y-1 transition-transform">Sopros e Percussão Jovem</h3>
                            <div className="flex items-center gap-2 text-primary group-hover:gap-4 transition-all font-bold">Início Flexível</div>
                        </div>
                    </div>
                    {/* Card 2 */}
                    <div className="group relative h-[550px] w-full min-w-[320px] md:w-[calc(33.333%-1.5rem)] md:min-w-[350px] flex-shrink-0 snap-start rounded-[2rem] overflow-hidden cursor-pointer shadow-2xl">
                        <img alt="Elderly Choro Ensemble" className="absolute inset-0 w-full h-full object-cover transition-transform duration-1000 group-hover:scale-110" src="https://lh3.googleusercontent.com/aida-public/AB6AXuCn4cnZzpznkgEWNNQsXKZ2B3kNiU7nR1cecUdDAgia05IvZA5QMFlsBo3MTPvUrXSmI-ucaA4Q6FqpqnbQPoMKfQtgFIZHmS6-2rytFeHXIsScPxQV-eBXFjXy-iPQN5AQr-DJKlfcYnzfaZ96TL6pslA6e_w-sEG5NYNPeNhvq9BsL4G3bFhn4uepe5Whe_Ee4G_5LothLewVSXuqsC1bnUyUVLk-1-PMWrIPAubmPLKl-24bKIQMbC4W6FhrPpIJDPS_oZlnGWo" />
                        <div className="absolute inset-0 bg-gradient-to-t from-black/90 via-black/20 to-transparent"></div>
                        <div className="absolute bottom-0 left-0 p-10 w-full">
                            <p className="text-white/70 text-sm font-semibold mb-2 tracking-wide">Brasileiro Tradicional</p>
                            <h3 className="text-3xl font-bold text-white mb-4 group-hover:-translate-y-1 transition-transform">Conjunto de Choro Sênior</h3>
                            <div className="flex items-center gap-2 text-primary group-hover:gap-4 transition-all font-bold">Inscrições Abertas</div>
                        </div>
                    </div>
                    {/* Card 3 */}
                    <div className="group relative h-[550px] w-full min-w-[320px] md:w-[calc(33.333%-1.5rem)] md:min-w-[350px] flex-shrink-0 snap-start rounded-[2rem] overflow-hidden cursor-pointer shadow-2xl">
                        <img alt="Cruzeiro do Sul Band" className="absolute inset-0 w-full h-full object-cover transition-transform duration-1000 group-hover:scale-110" src="https://lh3.googleusercontent.com/aida-public/AB6AXuD_HxI2JoIyFIZqGtytFQJ4a5tUV9Syb2xb8Ot5kJ3o0j9sCqyVRj70lUte0r2GfSwxMFnx_qtJVndZ5wiWuBap6M25LNGjREWR_nhgMUSaz40_fXVGH3zrr5_xj8uRrnGlSr9rqdyil_sY9lHmZsN4l_m7CMiEhcq43DAp1ETGou_laHXBKQ3C3bYLzXqJbdYYDKYvyY60LREfVnhGDLUhQSdcSvh3xDj1iI-GzuyeaCrSJaHl85u6hwnE7VqDgq-Z5k__Wf83cfY" />
                        <div className="absolute inset-0 bg-gradient-to-t from-black/90 via-black/20 to-transparent"></div>
                        <div className="absolute bottom-0 left-0 p-10 w-full">
                            <p className="text-white/70 text-sm font-semibold mb-2 tracking-wide">Grupo de Performance</p>
                            <h3 className="text-3xl font-bold text-white mb-4 group-hover:-translate-y-1 transition-transform">Banda Cruzeiro do Sul</h3>
                            <div className="flex items-center gap-2 text-primary group-hover:gap-4 transition-all font-bold">Audições em Breve</div>
                        </div>
                    </div>
                    {/* Card 4 (NOVO) */}
                    <div className="group relative h-[550px] w-full min-w-[320px] md:w-[calc(33.333%-1.5rem)] md:min-w-[350px] flex-shrink-0 snap-start rounded-[2rem] overflow-hidden cursor-pointer shadow-2xl">
                        <img alt="Violin Practice" className="absolute inset-0 w-full h-full object-cover transition-transform duration-1000 group-hover:scale-110" src="https://lh3.googleusercontent.com/aida-public/AB6AXuBxYnSvapkIW1JWkNCj33_wEz4nEQyGes-JuAbS-_SZRAxQDTc8uB6pCb_sGPeACQ0gzCkOzTus7w-N91-HqrGczhh04Mnsi4ym7c-U7WpGXALcjMTkLRyjIoNwT4RLJ32dmQDVUuxf6JC7QROdS5eNxgfYyA98K74q62UqRTnrXhEtPDynPpN5bKCIzhEPPRqSVDXAy278lKf4A1uYpkA_q_KWn3qKqu5LLcF9-1s5bRx5XRp9sToXbmknDa-K1AVc8tQ9iNJALkQ" />
                        <div className="absolute inset-0 bg-gradient-to-t from-black/90 via-black/20 to-transparent"></div>
                        <div className="absolute bottom-0 left-0 p-10 w-full">
                            <p className="text-white/70 text-sm font-semibold mb-2 tracking-wide">Cordas & Iniciação</p>
                            <h3 className="text-3xl font-bold text-white mb-4 group-hover:-translate-y-1 transition-transform">Orquestra de Cordas Sinfônica</h3>
                            <div className="flex items-center gap-2 text-primary group-hover:gap-4 transition-all font-bold">Vagas Limitadas</div>
                        </div>
                    </div>
                    {/* Card 5 (NOVO) */}
                    <div className="group relative h-[550px] w-full min-w-[320px] md:w-[calc(33.333%-1.5rem)] md:min-w-[350px] flex-shrink-0 snap-start rounded-[2rem] overflow-hidden cursor-pointer shadow-2xl">
                        <img alt="Choir Singing" className="absolute inset-0 w-full h-full object-cover transition-transform duration-1000 group-hover:scale-110 opacity-80" src="https://images.unsplash.com/photo-1549487928-8d9ed90494df?ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D&auto=format&fit=crop&w=800&q=80" />
                        <div className="absolute inset-0 bg-gradient-to-t from-black/90 via-black/20 to-transparent"></div>
                        <div className="absolute bottom-0 left-0 p-10 w-full">
                            <p className="text-white/70 text-sm font-semibold mb-2 tracking-wide">Canto Coral</p>
                            <h3 className="text-3xl font-bold text-white mb-4 group-hover:-translate-y-1 transition-transform">Coral Vozes da Sociedade</h3>
                            <div className="flex items-center gap-2 text-primary group-hover:gap-4 transition-all font-bold">Aulas Noturnas</div>
                        </div>
                    </div>

                </div>
            </section>

            {/* SEÇÃO EVENTOS E NOTÍCIAS */}
            <section id="eventos" className="py-20 bg-slate-50 dark:bg-slate-900/50 scroll-mt-20">
                <div className="max-w-7xl mx-auto px-6">
                    {/* PARTE 1 - Eventos da Comunidade (Slider Horizontal) */}
                    <div className="mb-20">
                        <div className="text-center mb-12">
                            <span className="text-primary font-semibold tracking-wider uppercase text-sm mb-4 block">Eventos da Comunidade</span>
                            <h2 className="text-4xl md:text-5xl font-display font-extrabold leading-tight mb-6">
                                Nutrindo a <span className="text-primary">Alma da Música</span>
                            </h2>
                            <p className="text-lg text-slate-500 dark:text-slate-400 max-w-2xl mx-auto">
                                Deslize lateralmente para explorar os recitais e apresentações exclusivas deste mês.
                            </p>
                        </div>

                        <div className="relative group overflow-hidden rounded-[3rem] shadow-2xl bg-slate-900">
                            <div className="flex overflow-x-auto snap-x snap-mandatory hide-scrollbar">
                                {/* Evento 1 */}
                                <div className="flex-shrink-0 w-full snap-center grid grid-cols-1 md:grid-cols-2 flex-col-reverse md:flex-row h-auto min-h-[400px]">
                                    <div className="p-10 md:p-16 flex flex-col justify-center bg-slate-900 text-white z-10 relative order-2 md:order-1">
                                        <p className="text-xs font-semibold uppercase text-primary tracking-widest mb-3">Apresentação Ao Vivo</p>
                                        <h3 className="text-3xl font-bold mb-4">Galeria das Artes Locais</h3>
                                        <p className="text-slate-300 leading-relaxed mb-8">Participe de um concerto intimista com nossos alunos avançados apresentando peças fundamentais do repertório clássico ao som de acústica especial.</p>
                                        <div className="flex items-center gap-3 text-primary font-semibold cursor-pointer hover:underline cursor-pointer group/btn">
                                            <span>Adicionar ao Calendário</span>
                                            <span className="material-symbols-outlined transition-transform group-hover/btn:translate-x-1">arrow_forward</span>
                                        </div>
                                    </div>
                                    <div className="relative order-1 md:order-2 h-64 md:h-auto overflow-hidden">
                                        <img alt="Music Ensemble" className="absolute inset-0 w-full h-full object-cover transition-transform duration-1000 hover:scale-105" src="https://lh3.googleusercontent.com/aida-public/AB6AXuBxYnSvapkIW1JWkNCj33_wEz4nEQyGes-JuAbS-_SZRAxQDTc8uB6pCb_sGPeACQ0gzCkOzTus7w-N91-HqrGczhh04Mnsi4ym7c-U7WpGXALcjMTkLRyjIoNwT4RLJ32dmQDVUuxf6JC7QROdS5eNxgfYyA98K74q62UqRTnrXhEtPDynPpN5bKCIzhEPPRqSVDXAy278lKf4A1uYpkA_q_KWn3qKqu5LLcF9-1s5bRx5XRp9sToXbmknDa-K1AVc8tQ9iNJALkQ" />
                                    </div>
                                </div>
                                {/* Evento 2 */}
                                <div className="flex-shrink-0 w-full snap-center grid grid-cols-1 md:grid-cols-2 flex-col-reverse md:flex-row h-auto min-h-[400px]">
                                    <div className="p-10 md:p-16 flex flex-col justify-center bg-slate-900 text-white z-10 relative order-2 md:order-1">
                                        <p className="text-xs font-semibold uppercase text-primary tracking-widest mb-3">Masterclass Especial</p>
                                        <h3 className="text-3xl font-bold mb-4">Visita de Luthier Renomado</h3>
                                        <p className="text-slate-300 leading-relaxed mb-8">Nesta tarde exclusiva, os membros da orquestra de cordas aprenderão com um mestre construtor sobre os segredos de afinação e manutenção crítica.</p>
                                        <div className="flex items-center gap-3 text-primary font-semibold hover:underline cursor-pointer group/btn">
                                            <span>Garantir Participação</span>
                                            <span className="material-symbols-outlined transition-transform group-hover/btn:translate-x-1">arrow_forward</span>
                                        </div>
                                    </div>
                                    <div className="relative order-1 md:order-2 h-64 md:h-auto overflow-hidden">
                                        <img alt="Luthier Masterclass" className="absolute inset-0 w-full h-full object-cover transition-transform duration-1000 hover:scale-105" src="https://images.unsplash.com/photo-1612225330812-01a9c6b355ec?ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D&auto=format&fit=crop&w=800&q=80" />
                                    </div>
                                </div>
                                {/* Evento 3 */}
                                <div className="flex-shrink-0 w-full snap-center grid grid-cols-1 md:grid-cols-2 flex-col-reverse md:flex-row h-auto min-h-[400px]">
                                    <div className="p-10 md:p-16 flex flex-col justify-center bg-slate-900 text-white z-10 relative order-2 md:order-1">
                                        <p className="text-xs font-semibold uppercase text-primary tracking-widest mb-3">Festival de Inverno</p>
                                        <h3 className="text-3xl font-bold mb-4">Noite de Choro e Tradição</h3>
                                        <p className="text-slate-300 leading-relaxed mb-8">Celebrando nossa raiz brasileira com uma extensa programação aberta. Partidas musicais com alunos, professores e convidados ilustres locais.</p>
                                        <div className="flex items-center gap-3 text-primary font-semibold hover:underline cursor-pointer group/btn">
                                            <span>Comprar Ingressos VIP</span>
                                            <span className="material-symbols-outlined transition-transform group-hover/btn:translate-x-1">arrow_forward</span>
                                        </div>
                                    </div>
                                    <div className="relative order-1 md:order-2 h-64 md:h-auto overflow-hidden">
                                        <img alt="Choro Event" className="absolute inset-0 w-full h-full object-cover transition-transform duration-1000 hover:scale-105" src="https://lh3.googleusercontent.com/aida-public/AB6AXuCn4cnZzpznkgEWNNQsXKZ2B3kNiU7nR1cecUdDAgia05IvZA5QMFlsBo3MTPvUrXSmI-ucaA4Q6FqpqnbQPoMKfQtgFIZHmS6-2rytFeHXIsScPxQV-eBXFjXy-iPQN5AQr-DJKlfcYnzfaZ96TL6pslA6e_w-sEG5NYNPeNhvq9BsL4G3bFhn4uepe5Whe_Ee4G_5LothLewVSXuqsC1bnUyUVLk-1-PMWrIPAubmPLKl-24bKIQMbC4W6FhrPpIJDPS_oZlnGWo" />
                                    </div>
                                </div>

                            </div>
                            {/* CSS para esconder barra horizontal deste slider especificamente preservando snap */}
                            <style>{`
                                 .hide-scrollbar::-webkit-scrollbar { display: none; }
                                 .hide-scrollbar { -ms-overflow-style: none; scrollbar-width: none; }
                             `}</style>
                        </div>
                    </div>

                    {/* PARTE 2 - Widget de RSS (Mockado/Manual conforme diretriz) */}
                    <div className="mb-8">
                        <span className="text-primary font-bold tracking-wider uppercase text-sm mb-4 block text-center md:text-left">Notícias Recentes (RSS Mock)</span>
                    </div>
                    <div className="flex flex-col gap-8">
                        {rssMockData.map((news) => (
                            <div key={news.id} className="bg-white dark:bg-slate-800 rounded-[3rem] overflow-hidden shadow-sm border border-slate-100 dark:border-slate-700/50">
                                <div className="grid grid-cols-1 lg:grid-cols-12">
                                    <div className="lg:col-span-4 lg:h-auto h-64 relative overflow-hidden">
                                        <img alt={news.title} className="absolute inset-0 w-full h-full object-cover transition-transform duration-700 hover:scale-105" src={news.imageUrl} />
                                    </div>
                                    <div className="lg:col-span-8 p-12 flex flex-col justify-center">
                                        <div className="flex items-center gap-2 mb-4">
                                            <span className="w-10 h-10 rounded-full bg-primary/10 flex items-center justify-center text-primary">
                                                <span className="material-symbols-outlined text-xl">rss_feed</span>
                                            </span>
                                            <a href={news.link} className="text-sm font-bold uppercase text-slate-500 hover:text-primary transition-colors cursor-pointer">{news.source}</a>
                                        </div>
                                        <h3 className="text-3xl font-display font-extrabold mb-4 dark:text-white line-clamp-2">{news.title}</h3>
                                        <p className="text-slate-600 dark:text-slate-400 mb-8 leading-relaxed line-clamp-3">
                                            {news.description}
                                        </p>
                                        <div className="flex gap-4">
                                            <a href={news.link} className="text-primary font-bold hover:underline transition-all flex items-center gap-1">
                                                Ler Notícia Completa <span className="material-symbols-outlined text-sm">open_in_new</span>
                                            </a>
                                        </div>
                                    </div>
                                </div>
                            </div>
                        ))}
                    </div>

                </div>
            </section>

            {/* SEÇÃO DOAÇÃO EMBUTIDA (Antes era uma página isolada) */}
            <section id="doacao" className="bg-background-light dark:bg-background-dark py-20 scroll-mt-20 border-t border-slate-200 dark:border-slate-800">
                <div className="px-4 md:px-20 lg:px-40">
                    <div className="relative min-h-[400px] flex flex-col gap-6 bg-cover bg-center bg-no-repeat rounded-xl md:rounded-3xl items-center justify-center p-8 overflow-hidden mb-12" style={{ backgroundImage: "linear-gradient(rgba(34, 24, 16, 0.7), rgba(34, 24, 16, 0.7)), url('https://lh3.googleusercontent.com/aida-public/AB6AXuAYPok7pFpnOHrYtndOZ8QTmViG3LWAoIXgaCmiDJ_U-qhBgm5mQ5Tyc9WmKI7fgwGMoElZ5JkEsge86klODjQ9Ft4BcVZfp2i0AdjerFTQqlIVZmQxyS7a7plwGv9xzwOxwpciH4As70q7GqWMSjd4cJQo44oXZ8bCNYOY2_PjctMZKr70x4aRpzUVktEgTIImUjHeNnjMwh_DpvCVhu4m9jHsLQ-uu144vD2_Sv_9m2EIIjGp_nTQU_a8q_fq7R-6zaNdk5w7nIw')" }}>
                        <div className="max-w-3xl flex flex-col gap-4 text-center z-10">
                            <span className="text-primary font-bold tracking-widest uppercase text-xs">Preservando a Arte</span>
                            <h1 className="text-white text-4xl md:text-5xl font-extrabold leading-tight tracking-tighter">
                                Apoie o Som do Nosso Futuro
                            </h1>
                            <p className="text-slate-200 text-lg md:text-xl font-medium max-w-2xl mx-auto leading-relaxed">
                                Sua contribuição financia diretamente a preservação de tradições musicais e capacita a próxima geração de artistas.
                            </p>
                        </div>
                    </div>

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
                </div>
            </section>

            <footer className="bg-slate-950 text-white pt-24 pb-12 px-6">
                <div className="max-w-7xl mx-auto text-center text-[10px] text-slate-500 uppercase tracking-[0.2em] font-bold">
                    <p>© 2026 Sociedade Cultural Cruzeiro do Sul. Todos os direitos reservados. Organização sem fins lucrativos.</p>
                </div>
            </footer>
        </div>
    );
}

import React, { useEffect, useRef, useState } from 'react';
import { Link, useLocation } from 'react-router-dom';
import Header from '../components/Header';

export default function Home() {
    const location = useLocation();
    const carouselRef = useRef(null);
    const scrollInterval = useRef(null);
    const [isHoveringCarousel, setIsHoveringCarousel] = useState(false);
    const [activeProjectIndex, setActiveProjectIndex] = useState(0);
    const [activeEventIndex, setActiveEventIndex] = useState(0);
    const [activeTab, setActiveTab] = useState('FIA');

    const accountsData = {
        FIA: {
            title: "Fundo da Infância e Adolescência (FIA)",
            description: "Apoie projetos voltados diretamente para nossas crianças e adolescentes.",
            banco: "Banco do Brasil (001)",
            agencia: "1234-5",
            conta: "98765-4",
            cnpj: "00.000.000/0001-00 (Fundo FIA)"
        },
        FMI: {
            title: "Fundo Municipal do Idoso (FMI)",
            description: "Contribua para a inclusão e qualidade de vida da terceira idade através da arte.",
            banco: "Caixa Econômica Federal (104)",
            agencia: "0123",
            conta: "45678-9",
            cnpj: "11.111.111/0001-11 (Fundo FMI)"
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

    const eventsData = [
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

    const projectsData = [
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

    const scrollToProject = (index) => {
        if (!carouselRef.current) return;
        const carousel = carouselRef.current;
        const cards = Array.from(carousel.children).filter(child => child.tagName === 'DIV');
        if (cards && cards[index]) {
            const scrollLeft = cards[index].offsetLeft - carousel.offsetLeft - 24;
            carousel.scrollTo({ left: Math.max(0, scrollLeft), behavior: 'smooth' });
        }
        setActiveProjectIndex(index);
    };

    // Auto-Scroll do Carrossel de Projetos (Paginado)
    useEffect(() => {
        if (!isHoveringCarousel) {
            scrollInterval.current = setInterval(() => {
                setActiveProjectIndex((prev) => {
                    const next = (prev + 1) % projectsData.length;
                    scrollToProject(next);
                    return next;
                });
            }, 4000);
        } else {
            if (scrollInterval.current) clearInterval(scrollInterval.current);
        }

        return () => {
            if (scrollInterval.current) clearInterval(scrollInterval.current);
        };
    }, [isHoveringCarousel]);

    const handleProjectScroll = () => {
        if (!carouselRef.current) return;
        const carousel = carouselRef.current;
        const cards = Array.from(carousel.children).filter(child => child.tagName === 'DIV');
        let closestIndex = 0;
        let minDistance = Infinity;
        const scrollCenter = carousel.scrollLeft + carousel.clientWidth / 2;

        for (let i = 0; i < cards.length; i++) {
            const cardCenter = cards[i].offsetLeft - carousel.offsetLeft + cards[i].clientWidth / 2;
            const distance = Math.abs(scrollCenter - cardCenter);
            if (distance < minDistance) {
                minDistance = distance;
                closestIndex = i;
            }
        }
        if (activeProjectIndex !== closestIndex) {
            setActiveProjectIndex(closestIndex);
        }
    };

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
                    onScroll={handleProjectScroll}
                    className="flex overflow-x-auto gap-8 pb-8 hide-scrollbar snap-x snap-mandatory transition-all scroll-smooth"
                >
                    <style>{`
                         .hide-scrollbar::-webkit-scrollbar { display: none; }
                         .hide-scrollbar { -ms-overflow-style: none; scrollbar-width: none; }
                    `}</style>
                    {projectsData.map((project, index) => (
                        <div key={project.id} onClick={() => scrollToProject(index)} className="group relative h-[550px] w-full min-w-[85vw] md:w-[calc(33.333%-1.5rem)] md:min-w-[350px] flex-shrink-0 snap-center md:snap-start rounded-[2rem] overflow-hidden cursor-pointer shadow-2xl">
                            <img alt={project.title} className={`absolute inset-0 w-full h-full object-cover transition-transform duration-1000 group-hover:scale-110 ${project.imageOpacity || ''}`} src={project.image} />
                            <div className="absolute inset-0 bg-gradient-to-t from-black/90 via-black/20 to-transparent"></div>
                            <div className="absolute bottom-0 left-0 p-10 w-full">
                                <p className="text-white/70 text-sm font-semibold mb-2 tracking-wide">{project.tag}</p>
                                <h3 className="text-3xl font-bold text-white mb-4 group-hover:-translate-y-1 transition-transform">{project.title}</h3>
                                <div className="flex items-center gap-2 text-primary group-hover:gap-4 transition-all font-bold">{project.status}</div>
                            </div>
                        </div>
                    ))}
                </div>

                {/* Dots Pagination */}
                <div className="flex justify-center gap-3 mt-4">
                    {Array.from({ length: 3 }).map((_, idx) => (
                        <button
                            key={idx}
                            onClick={() => {
                                // Mapeia o índice do dot (0,1,2) para o projeto correspondente
                                // Se activeProjectIndex for 0: mostra 0,1,2 (dot 0 ativa 0)
                                // Se activeProjectIndex for 4: mostra 2,3,4 (dot 0 ativa 2)
                                let targetIndex;
                                if (activeProjectIndex === 0) targetIndex = idx;
                                else if (activeProjectIndex === projectsData.length - 1) targetIndex = projectsData.length - 3 + idx;
                                else targetIndex = activeProjectIndex - 1 + idx;
                                scrollToProject(targetIndex);
                            }}
                            className={`h-3 rounded-full transition-all duration-300 ${
                                // Verifica se este dot representa o projeto ativo atual
                                (activeProjectIndex === 0 && idx === 0) ||
                                    (activeProjectIndex === projectsData.length - 1 && idx === 2) ||
                                    (activeProjectIndex > 0 && activeProjectIndex < projectsData.length - 1 && idx === 1)
                                    ? 'w-10 bg-slate-800 dark:bg-white' : 'w-3 bg-slate-300 hover:bg-slate-400 dark:bg-slate-700 dark:hover:bg-slate-500'}`}
                            aria-label={`Ir para projeto relativo`}
                        />
                    ))}
                </div>
            </section>

            {/* SEÇÃO EVENTOS E NOTÍCIAS */}
            <section id="eventos" className="py-20 bg-slate-50 dark:bg-slate-900/50 scroll-mt-20">
                <div className="max-w-7xl mx-auto px-6">
                    {/* PARTE 1 - Eventos da Comunidade (Slider Horizontal) */}
                    <div className="mb-20">
                        <div className="text-center mb-12">
                            <span className="text-primary font-semibold tracking-wider uppercase text-sm mb-4 block">Apoio</span>

                            {/* Infinite Sponsor Logos Carousel */}
                            <div className="relative w-full max-w-5xl mx-auto overflow-hidden h-32 flex items-center before:absolute before:left-0 before:top-0 before:z-10 before:h-full before:w-20 before:bg-gradient-to-r before:from-slate-50 before:to-transparent dark:before:from-slate-900/50 after:absolute after:right-0 after:top-0 after:z-10 after:h-full after:w-20 after:bg-gradient-to-l after:from-slate-50 after:to-transparent dark:after:from-slate-900/50">
                                <style>{`
                                    @keyframes slide-logos {
                                        0% { transform: translateX(0); }
                                        100% { transform: translateX(-50%); }
                                    }
                                    .animate-slide-logos {
                                        animation: slide-logos 25s linear infinite;
                                        width: max-content;
                                    }
                                `}</style>

                                <div className="flex items-center animate-slide-logos hover:[animation-play-state:paused] whitespace-nowrap min-w-max">
                                    {/* Duplicates for infinite scrolling illusion */}
                                    {[...Array(2)].map((_, i) => (
                                        <div key={i} className="flex items-center gap-16 md:gap-24 px-8 md:px-12 flex-shrink-0">
                                            {/* Generic transparent logos */}
                                            <img src="https://upload.wikimedia.org/wikipedia/commons/a/a9/Amazon_logo.svg" alt="Amazon" className="h-8 md:h-12 opacity-40 grayscale hover:grayscale-0 hover:opacity-100 transition-all object-contain mt-2" />
                                            <img src="https://upload.wikimedia.org/wikipedia/commons/2/2f/Google_2015_logo.svg" alt="Google" className="h-8 md:h-10 opacity-40 grayscale hover:grayscale-0 hover:opacity-100 transition-all object-contain" />
                                            <img src="https://upload.wikimedia.org/wikipedia/commons/4/44/Microsoft_logo.svg" alt="Microsoft" className="h-6 md:h-8 opacity-40 grayscale hover:grayscale-0 hover:opacity-100 transition-all object-contain" />
                                            <img src="https://upload.wikimedia.org/wikipedia/commons/b/b9/Slack_Technologies_Logo.svg" alt="Slack" className="h-8 md:h-10 opacity-40 grayscale hover:grayscale-0 hover:opacity-100 transition-all object-contain" />
                                            <img src="https://upload.wikimedia.org/wikipedia/commons/0/08/Netflix_2015_logo.svg" alt="Netflix" className="h-6 md:h-8 opacity-40 grayscale hover:grayscale-0 hover:opacity-100 transition-all object-contain" />
                                            <img src="https://upload.wikimedia.org/wikipedia/commons/5/51/IBM_logo.svg" alt="IBM" className="h-8 md:h-12 opacity-40 grayscale hover:grayscale-0 hover:opacity-100 transition-all object-contain" />
                                        </div>
                                    ))}
                                </div>
                            </div>
                        </div>

                        <div className="grid grid-cols-1 lg:grid-cols-2 gap-8 lg:gap-12 min-h-[450px]">
                            {/* Menu dos Eventos (Lista Rolável) */}
                            <div className="flex flex-col space-y-4 justify-start max-h-[500px] overflow-y-auto pr-2 overflow-x-hidden [&::-webkit-scrollbar]:w-1.5 [&::-webkit-scrollbar-track]:bg-transparent [&::-webkit-scrollbar-thumb]:bg-slate-300 dark:[&::-webkit-scrollbar-thumb]:bg-slate-700 [&::-webkit-scrollbar-thumb]:rounded-full">
                                {eventsData.map((event, index) => (
                                    <div
                                        key={event.id}
                                        onClick={() => setActiveEventIndex(index)}
                                        className={`p-6 md:p-8 rounded-3xl cursor-pointer transition-all duration-300 border-2 flex-shrink-0 ${activeEventIndex === index ? 'bg-slate-900 border-primary shadow-xl shadow-primary/10' : 'bg-white dark:bg-slate-800 border-slate-100 dark:border-slate-700/50 hover:border-primary/50'}`}
                                    >
                                        <div className="flex flex-col md:flex-row justify-between items-start md:items-center gap-2 mb-2">
                                            <h3 className={`text-sm md:text-base font-bold uppercase tracking-widest ${activeEventIndex === index ? 'text-primary' : 'text-primary'}`}>
                                                {event.tag}
                                            </h3>
                                            <a href={event.locationLink || "#"} target="_blank" rel="noopener noreferrer" onClick={(e) => e.stopPropagation()} className={`flex items-center gap-1.5 hover:text-primary transition-colors hover:underline ${activeEventIndex === index ? 'text-slate-300' : 'text-slate-500'}`}>
                                                <span className="material-symbols-outlined text-[1rem]">location_on</span>
                                                <span className="text-sm">Ver no Mapa</span>
                                            </a>
                                        </div>
                                        <div className="flex flex-col md:flex-row justify-between items-start md:items-center gap-2 mb-1">
                                            <h4 className={`text-xl md:text-2xl font-bold ${activeEventIndex === index ? 'text-white' : 'text-slate-900 dark:text-slate-100'}`}>
                                                {event.title}
                                            </h4>
                                            <div className={`flex items-center gap-1.5 text-xs md:text-sm font-semibold whitespace-nowrap ${activeEventIndex === index ? 'text-slate-400' : 'text-slate-500'}`}>
                                                <span className="material-symbols-outlined text-[1rem]">schedule</span>
                                                <span>{event.date} às {event.time}</span>
                                            </div>
                                        </div>
                                        {activeEventIndex === index && (
                                            <p className="text-slate-300 leading-relaxed text-sm animate-[fadeIn_0.5s_ease-out] mt-4 pt-4 border-t border-slate-700/50">
                                                {event.description}
                                            </p>
                                        )}
                                    </div>
                                ))}
                            </div>

                            {/* Imagem do Evento Ativo */}
                            <div className="relative rounded-[3rem] overflow-hidden shadow-2xl h-[400px] lg:h-auto lg:min-h-[500px] group border border-slate-800">
                                <img
                                    src={eventsData[activeEventIndex].image}
                                    alt={eventsData[activeEventIndex].title}
                                    className="absolute inset-0 w-full h-full object-cover transition-all duration-700 group-hover:scale-105"
                                    key={activeEventIndex}
                                />
                                <div className="absolute inset-0 bg-gradient-to-t from-slate-900/40 to-transparent pointer-events-none"></div>
                            </div>
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
                <div className="relative flex items-center justify-center py-12 md:py-24 px-4 min-h-[600px]">
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
                            <h2 className="text-white text-4xl md:text-5xl lg:text-6xl font-extrabold leading-tight tracking-tighter mb-6">
                                Apoie o Som do Nosso Futuro
                            </h2>
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
                                    <div className={`flex justify-between items-center ${accountsData[activeTab].pix ? 'border-b border-white/10 pb-3' : 'pt-1'}`}>
                                        <span className="text-slate-400 text-xs uppercase tracking-wider">CNPJ</span>
                                        <span className="text-white font-semibold text-sm text-right max-w-[150px] truncate" title={accountsData[activeTab].cnpj}>{accountsData[activeTab].cnpj}</span>
                                    </div>
                                    {accountsData[activeTab].pix && (
                                        <div className="flex justify-between items-center pt-1">
                                            <span className="text-slate-400 text-xs uppercase tracking-wider">Chave PIX</span>
                                            <span className="text-primary font-bold text-sm tracking-wide">{accountsData[activeTab].pix}</span>
                                        </div>
                                    )}
                                </div>
                            </div>
                        </div>
                    </div>
                </div>
            </section>

            <footer id="contato" className="bg-[#0b1121] text-white pt-20 pb-8 px-6 border-t-[1px] border-primary/20">
                <div className="max-w-7xl mx-auto grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-12 font-medium">
                    {/* Brand Info & Social */}
                    <div className="flex flex-col">
                        <div className="flex items-center gap-3 mb-6">
                            <span className="material-symbols-outlined text-primary text-xl">sparkles</span>
                            <span className="text-xl font-bold tracking-tight text-slate-100">Cruzeiro do Sul</span>
                        </div>
                        <p className="text-slate-400 text-sm leading-relaxed max-w-xs font-normal mb-8">
                            Transformando vidas através da música e da cultura em nossa comunidade.
                        </p>

                        {/* Social Buttons moved here */}
                        <div className="flex gap-4">
                            <a href="#" className="flex items-center justify-center w-10 h-10 rounded-full bg-slate-800/80 text-slate-300 hover:bg-primary hover:text-white transition-all">
                                <span className="material-symbols-outlined text-sm">share</span>
                            </a>
                            <a href="#" className="flex items-center justify-center w-10 h-10 rounded-full bg-slate-800/80 text-slate-300 hover:bg-primary hover:text-white transition-all">
                                {/* Usando ion-icon ou mdi, mas como o pack atual é material symbols, ajustamos para a câmera que lembra o Insta, e play para YT */}
                                <span className="material-symbols-outlined text-sm">photo_camera</span>
                            </a>
                            <a href="#" className="flex items-center justify-center w-10 h-10 rounded-full bg-slate-800/80 text-slate-300 hover:bg-primary hover:text-white transition-all">
                                <span className="material-symbols-outlined text-sm">smart_display</span>
                            </a>
                        </div>
                    </div>

                    {/* Quick Links */}
                    <div className="flex flex-col gap-4">
                        <h4 className="text-slate-100 font-bold mb-2">Links Rápidos</h4>
                        <a href="#inicio" className="text-slate-400 hover:text-primary transition-colors text-sm font-normal">Home</a>
                        <a href="#projetos" className="text-slate-400 hover:text-primary transition-colors text-sm font-normal">Programas</a>
                        <a href="#eventos" className="text-slate-400 hover:text-primary transition-colors text-sm font-normal">Eventos</a>
                        <a href="#contato" className="text-slate-400 hover:text-primary transition-colors text-sm font-normal">Contato</a>
                        <Link to="/login" className="text-slate-400 hover:text-primary transition-colors text-sm font-normal">Área restrita</Link>
                    </div>

                    {/* Contact */}
                    <div className="flex flex-col gap-4">
                        <h4 className="text-slate-100 font-bold mb-2">Contato</h4>
                        <div className="flex items-center gap-3 text-slate-400 text-sm font-normal">
                            <span className="material-symbols-outlined text-primary text-[1rem]">mail</span>
                            <span>contato@cruzeirodosul.org</span>
                        </div>
                        <div className="flex items-center gap-3 text-slate-400 text-sm font-normal">
                            <span className="material-symbols-outlined text-primary text-[1rem]">call</span>
                            <span>(11) 4002-8922</span>
                        </div>
                        <div className="flex items-center gap-3 text-slate-400 text-sm font-normal">
                            <span className="material-symbols-outlined text-primary text-[1rem]">location_on</span>
                            <span>Av. Paulista, 1000 - SP</span>
                        </div>
                    </div>

                    {/* Google Maps Embed */}
                    <div className="flex flex-col">
                        <div className="w-full h-48 md:h-full min-h-[150px] rounded-xl overflow-hidden shadow-lg border border-slate-800">
                            <iframe
                                src="https://www.google.com/maps/embed?pb=!1m18!1m12!1m3!1d3657.197365672836!2d-46.6564619!3d-23.5613398!2m3!1f0!2f0!3f0!3m2!1i1024!2i768!4f13.1!3m3!1m2!1s0x94ce59c8da0aa315%3A0xd59f9431f2c9776a!2sAv.%20Paulista%2C%201000%20-%20Bela%20Vista%2C%20S%C3%A3o%20Paulo%20-%20SP%2C%2001310-100!5e0!3m2!1sen!2sbr!4v1709400000000!5m2!1sen!2sbr"
                                width="100%"
                                height="100%"
                                style={{ border: 0 }}
                                allowFullScreen=""
                                loading="lazy"
                                referrerPolicy="no-referrer-when-downgrade"
                            ></iframe>
                        </div>
                    </div>
                </div>

                {/* Bottom line */}
                <div className="max-w-7xl mx-auto mt-16 pt-8 border-t border-slate-800 flex flex-col md:flex-row items-center justify-center text-center">
                    <p className="text-xs text-slate-500 font-medium">© 2024 Cruzeiro do Sul. Todos os direitos reservados. CNPJ: 00.000.000/0001-00</p>
                </div>
            </footer>
        </div>
    );
}

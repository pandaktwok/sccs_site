import React, { useState, useEffect } from 'react';
import { Link, useLocation } from 'react-router-dom';

export default function Header() {
    const location = useLocation();
    const [isScrolled, setIsScrolled] = useState(false);
    const [isHovered, setIsHovered] = useState(false);

    useEffect(() => {
        const handleScrollEvent = () => {
            // Se a página for rolada para baixo mais de 50px, ativamos o estado isScrolled
            setIsScrolled(window.scrollY > 50);
        };

        window.addEventListener('scroll', handleScrollEvent);
        return () => window.removeEventListener('scroll', handleScrollEvent);
    }, []);

    const handleScrollToHash = (e, id) => {
        e.preventDefault();
        if (location.pathname !== '/') {
            window.location.href = `/#${id}`;
        } else {
            const element = document.getElementById(id);
            if (element) {
                element.scrollIntoView({ behavior: 'smooth' });
            }
        }
    };

    // Lógica de Classes Dinâmicas
    // Header original: h-20, bg-black/90
    // Header scrolled: h-14, bg-black/50 (fica menor e mais transparente)
    // Se scrolled e hover: Volta ao tamanho/cor original (h-20, bg-black/90)

    const isExpanded = !isScrolled || isHovered;

    const headerHeightClass = isExpanded ? 'h-20' : 'h-14';
    const headerBgClass = isExpanded ? 'bg-black/80' : 'bg-black/50';
    const logoSizeClass = isExpanded ? 'w-8 h-8 text-xl' : 'w-6 h-6 text-sm';
    const textSizeClass = isExpanded ? 'text-xl' : 'text-lg';

    return (
        <header
            className={`fixed top-0 left-0 right-0 z-50 transition-all duration-300 backdrop-blur-md border-b border-white/5 ${headerBgClass}`}
            onMouseEnter={() => setIsHovered(true)}
            onMouseLeave={() => setIsHovered(false)}
        >
            <div className={`max-w-7xl mx-auto px-6 flex items-center justify-between transition-all duration-300 ${headerHeightClass}`}>

                {/* Lado Esquerdo: Nome da Instituição */}
                <Link to="/" className={`text-white font-extrabold tracking-tight hidden md:flex items-center gap-3 transition-all duration-300 ${textSizeClass}`}>
                    <img
                        src="http://localhost:5000/api/public/file/img_site/logo_uteis/LOGO_SCCS.png"
                        alt="SCCS Logo"
                        className={`object-contain transition-all duration-300 ${isExpanded ? 'w-12 h-12' : 'w-8 h-8'}`}
                    />
                    Sociedade Cultural Cruzeiro do Sul
                </Link>

                {/* Apenas ícone no mobile para manter compatibilidade */}
                <Link to="/" className="md:hidden text-white font-extrabold flex items-center gap-3">
                    <img
                        src="http://localhost:5000/api/public/file/img_site/logo_uteis/LOGO_SCCS.png"
                        alt="SCCS Logo"
                        className="w-10 h-10 object-contain"
                    />
                </Link>

                {/* Lado Direito: Links de Navegação e Botão Doar */}
                <div className="flex items-center gap-6">
                    <nav className="hidden lg:flex items-center gap-8 text-sm font-semibold text-white/90">
                        <a href="#inicio" onClick={(e) => handleScrollToHash(e, 'inicio')} className="hover:text-primary transition-colors cursor-pointer">
                            Home
                        </a>
                        <a href="#projetos" onClick={(e) => handleScrollToHash(e, 'projetos')} className="hover:text-primary transition-colors cursor-pointer">
                            Projetos
                        </a>
                        <a href="#eventos" onClick={(e) => handleScrollToHash(e, 'eventos')} className="hover:text-primary transition-colors cursor-pointer">
                            Eventos
                        </a>
                        <a href="#contato" onClick={(e) => handleScrollToHash(e, 'contato')} className="hover:text-primary transition-colors cursor-pointer">
                            Contato
                        </a>
                        <Link to="/login" className="hover:text-primary transition-colors">
                            Área restrita
                        </Link>
                    </nav>

                    <Link
                        to="/#doacao"
                        onClick={(e) => handleScrollToHash(e, 'doacao')}
                        className={`bg-primary hover:bg-[#D96D3E] text-white rounded-full font-bold text-sm transition-all shadow-lg shadow-primary/20 flex items-center gap-2 ${isExpanded ? 'px-6 py-2.5' : 'px-4 py-1.5'}`}
                    >
                        Doar
                    </Link>
                </div>

            </div>
        </header>
    );
}

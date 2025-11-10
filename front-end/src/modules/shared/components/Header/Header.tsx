'use client';
import { useState, useMemo, useCallback } from 'react';
import { useTheme } from '../ThemeProvider/ThemeProvider';
import { Search } from 'lucide-react';
import { useRouter, usePathname } from 'next/navigation';

const ESCOLAS_MOCK = [
  { id: 1, nome: "Colégio São Paulo", municipio: "São Paulo", estado: "SP", tipo: "Estadual" },
  { id: 2, nome: "Escola Técnica Estadual", municipio: "Campinas", estado: "SP", tipo: "Estadual" },
  { id: 3, nome: "Colégio Objetivo", municipio: "São Paulo", estado: "SP", tipo: "Privada" },
  { id: 4, nome: "Colégio Pedro II", municipio: "Rio de Janeiro", estado: "RJ", tipo: "Federal" },
];

export default function Header() {
  const [menuOpen, setMenuOpen] = useState(false);
  const [searchTerm, setSearchTerm] = useState('');
  const [showSuggestions, setShowSuggestions] = useState(false);
  const { theme, toggleTheme } = useTheme();
  const router = useRouter();
  const pathname = usePathname();

  const isHomePage = pathname === '/inicial' || pathname === '/';

  const handleSobreNosClick = useCallback(() => {
    setMenuOpen(false);
    if (isHomePage) {
      const sobreNosSection = document.getElementById('sobre-nos-section');
      sobreNosSection?.scrollIntoView({ behavior: 'smooth' });
    } else {
      window.location.href = '/inicial#sobre-nos-section';
    }
  }, [isHomePage]);

  const escolasFiltradas = useMemo(() => {
    if (!searchTerm.trim()) return [];
    
    const term = searchTerm.toLowerCase();
    return ESCOLAS_MOCK.filter(escola =>
      escola.nome.toLowerCase().includes(term) ||
      escola.municipio.toLowerCase().includes(term) ||
      escola.estado.toLowerCase().includes(term)
    );
  }, [searchTerm]);

  const redirecionarParaEscola = useCallback((escola: typeof ESCOLAS_MOCK[0]) => {
    const escolaSlug = escola.nome
      .normalize('NFD')
      .replace(/[\u0300-\u036f]/g, '')
      .toLowerCase()
      .replace(/\s+/g, '-');
    
    router.push(`/escolas/${escolaSlug}`);
    setShowSuggestions(false);
    setSearchTerm('');
  }, [router]);

  const handleSearchChange = useCallback((e: React.ChangeEvent<HTMLInputElement>) => {
    setSearchTerm(e.target.value);
    setShowSuggestions(true);
  }, []);

  const handleSearchBlur = useCallback(() => {
    setTimeout(() => setShowSuggestions(false), 200);
  }, []);

  const toggleMenu = useCallback(() => {
    setMenuOpen(prev => !prev);
  }, []);

  return (
    <header className="bg-header border-theme border-b sticky top-0 z-50 transition-colors duration-500">
      <div className="max-w-[95%] sm:max-w-[90%] md:max-w-[80%] mx-auto px-3 sm:px-4 py-2 md:py-3">
        <div className="flex justify-between items-center">
          
          <a 
            href="/inicial"
            className="flex items-center gap-1 md:gap-2 hover:scale-110 transition-transform duration-500 active:scale-105 cursor-pointer flex-shrink-0"
          >
            <h1 
              className="font-bold leading-none text-[28px] sm:text-[36px] md:text-[48px] transition-colors duration-500"
              style={{ fontFamily: "'Harys World', Arial, sans-serif" }}
            >
              InfoSchool
            </h1>
            <img 
              src="/images/InfoSchool-logo.svg"
              alt="InfoSchool Logo" 
              width={60}
              height={60}
              className="object-contain w-[60px] h-[60px] md:w-[90px] md:h-[90px] transition-colors duration-500"
            />
          </a>

          {isHomePage && (
            <div className="flex-1 max-w-2xl mx-4 lg:mx-8 relative">
              <div className="relative transition-colors duration-500">
                <Search 
                  className="absolute left-4 top-1/2 -translate-y-1/2 text-gray-theme transition-colors duration-500"
                  size={20}
                />
                <input
                  type="text"
                  placeholder="Pesquisar escolas por nome, cidade ou estado..."
                  className="w-full h-12 rounded-full pl-12 pr-6 focus:outline-none focus:ring-2 focus:ring-primary text-lg bg-card border border-theme text-text transition-colors duration-500"
                  value={searchTerm}
                  onChange={handleSearchChange}
                  onFocus={() => setShowSuggestions(true)}
                  onBlur={handleSearchBlur}
                />
              </div>

              {showSuggestions && (
                <div className="absolute top-full left-0 right-0 mt-2 max-h-60 overflow-y-auto z-50 shadow-theme bg-card border border-theme rounded-lg transition-colors duration-500">
                  {escolasFiltradas.length > 0 ? (
                    escolasFiltradas.map((escola) => (
                      <button
                        key={escola.id}
                        className="w-full text-left px-4 py-3 border-b border-theme last:border-b-0 hover:bg-card-alt text-text transition-colors duration-500 group"
                        onClick={() => redirecionarParaEscola(escola)}
                      >
                        <div className="flex justify-between items-center">
                          <div>
                            <div className="font-semibold group-hover:text-primary transition-colors duration-500">
                              {escola.nome}
                            </div>
                            <div className="text-sm opacity-80 mt-1 transition-colors duration-500">
                              {escola.municipio} - {escola.estado} • {escola.tipo}
                            </div>
                          </div>
                          <Search size={16} className="opacity-0 group-hover:opacity-70 transition-opacity duration-300" />
                        </div>
                      </button>
                    ))
                  ) : searchTerm.trim() ? (
                    <div className="px-4 py-3 text-center text-gray-theme transition-colors duration-500">
                      Nenhuma escola encontrada
                    </div>
                  ) : null}
                </div>
              )}
            </div>
          )}

          <nav className="hidden md:flex items-center gap-10 lg:gap-12">
            <button 
              onClick={handleSobreNosClick}
              className="hover:text-gray-300 transition-all duration-500 text-base lg:text-lg hover:scale-110 active:scale-105 cursor-pointer"
              style={{ fontFamily: "'Rammetto One', cursive" }}
            >
              Sobre nós
            </button>
            <button 
              onClick={() => router.push('/rag')}
              className="bg-primary text-white rounded-[20px] hover:bg-[#1a6fd8] transition-all duration-500 flex items-center justify-center w-[160px] lg:w-[190px] h-[30px] lg:h-[32px] hover:scale-110 active:scale-105 cursor-pointer"
              style={{ fontFamily: "'Rammetto One', cursive" }}
            >
              Usar IA
            </button>
            <button 
              onClick={toggleTheme}
              className="flex items-center justify-center hover:opacity-80 transition-all duration-500 hover:scale-110 active:scale-105 cursor-pointer"
              aria-label={theme === 'light' ? 'Ativar modo escuro' : 'Ativar modo claro'}
            >
              <img 
                src={theme === 'light' ? "/icons/dark-mode.png" : "/icons/light-mode.png"}
                alt={theme === 'light' ? "Modo Escuro" : "Modo Claro"}
                width={32}
                height={32}
                className="w-8 h-8 lg:w-9 lg:h-9 transition-colors duration-500"
              />
            </button>
          </nav>

          <button 
            className="md:hidden p-1 rounded hover:bg-gray-700 transition-all duration-500 hover:scale-110 active:scale-105 cursor-pointer"
            onClick={toggleMenu}
            aria-label="Abrir menu"
          >
            <svg className="w-6 h-6 transition-colors duration-500" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 6h16M4 12h16M4 18h16" />
            </svg>
          </button>
        </div>

        {menuOpen && (
          <div className="md:hidden mt-2 space-y-2 border-t border-theme pt-3 transition-colors duration-500">
            <button 
              onClick={handleSobreNosClick}
              className="block py-2 px-4 hover:bg-gray-800 rounded transition-all duration-500 w-full text-center hover:scale-105 active:scale-100 text-base cursor-pointer"
              style={{ fontFamily: "'Rammetto One', cursive" }}
            >
              Sobre nós
            </button>
            <button 
              onClick={() => router.push('/rag')}
              className="bg-primary text-white rounded-[20px] hover:bg-[#1a6fd8] transition-all duration-500 w-full py-2 hover:scale-105 active:scale-100 text-base cursor-pointer"
              style={{ fontFamily: "'Rammetto One', cursive" }}
            >
              Usar IA
            </button>
            <button 
              onClick={toggleTheme}
              className="flex items-center justify-center w-full py-2 text-gray-400 hover:text-white transition-all duration-500 hover:scale-105 active:scale-100 text-base cursor-pointer"
            >
              {theme === 'light' ? 'Modo Escuro' : 'Modo Claro'}
            </button>
          </div>
        )}
      </div>
    </header>
  );
}
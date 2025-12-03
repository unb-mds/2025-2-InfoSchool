'use client';
import { useState, useMemo, useCallback, useEffect } from 'react';
import { useTheme } from '../ThemeProvider/ThemeProvider';
import { Search, Loader2 } from 'lucide-react';
import { useRouter, usePathname } from 'next/navigation';

const API_BASE_URL = process.env.NEXT_PUBLIC_API_URL || 'http://localhost:3001';

function useDebounce<T>(value: T, delay: number) {
  const [debouncedValue, setDebouncedValue] = useState(value);

  useEffect(() => {
    const handler = setTimeout(() => {
      setDebouncedValue(value);
    }, delay);

    return () => {
      clearTimeout(handler);
    };
  }, [value, delay]);

  return debouncedValue;
}

type Escola = {
  id: string;
  nome: string;
  municipio: string;
  estado: string;
  tipo: string;
};

export default function Header() {
  const [menuOpen, setMenuOpen] = useState(false);
  const [searchTerm, setSearchTerm] = useState('');
  const [escolasBuscadas, setEscolasBuscadas] = useState<Escola[]>([]);
  const [isLoading, setIsLoading] = useState(false);
  const [showSuggestions, setShowSuggestions] = useState(false);

  const { theme, toggleTheme } = useTheme();
  const router = useRouter();
  const pathname = usePathname();

  const isHomePage = pathname === '/inicial' || pathname === '/';

  const debouncedSearchTerm = useDebounce(searchTerm, 500);

  // Função para buscar dados reais no BigQuery via API Route
  const fetchEscolas = useCallback(async (term: string) => {
    if (!term || term.trim().length < 3) {
      setEscolasBuscadas([]);
      setIsLoading(false);
      return;
    }

    setIsLoading(true);

    try {
      // ATUALIZAÇÃO: Usando a URL absoluta para garantir conexão com o Fastify (porta 3001)
      const response = await fetch(`${API_BASE_URL}/api/escolas/search?q=${encodeURIComponent(term)}`);

      if (!response.ok) {
        throw new Error(`HTTP error! status: ${response.status}`);
      }

      const data = await response.json();
      setEscolasBuscadas(data.escolas || []);

    } catch (error) {
      console.error("Erro na busca de escolas:", error);
      setEscolasBuscadas([]);
    } finally {
      setIsLoading(false);
    }
  }, []);

  // useEffect para observar o termo "debounced" e disparar a busca
  useEffect(() => {
    if (debouncedSearchTerm) {
      fetchEscolas(debouncedSearchTerm);
    } else {
      setEscolasBuscadas([]);
    }
  }, [debouncedSearchTerm, fetchEscolas]);

  const escolasFiltradas = escolasBuscadas;

  const handleSobreNosClick = useCallback(() => {
    setMenuOpen(false);
    if (isHomePage) {
      const sobreNosSection = document.getElementById('sobre-nos-section');
      sobreNosSection?.scrollIntoView({ behavior: 'smooth' });
    } else {
      window.location.href = '/inicial#sobre-nos-section';
    }
  }, [isHomePage]);

  // ATUALIZAÇÃO: Função redireciona para o Dashboard usando o ID (Código INEP)
  const redirecionarParaEscola = useCallback((escola: Escola) => {
    router.push(`/dashboard?id=${escola.id}`);
    setShowSuggestions(false);
    setSearchTerm('');
    setEscolasBuscadas([]);
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
                  placeholder="Digite o nome da escola"
                  className="w-full h-12 rounded-full pl-12 pr-10 focus:outline-none focus:ring-2 focus:ring-primary text-lg bg-card border border-theme text-text transition-colors duration-500"
                  value={searchTerm}
                  onChange={handleSearchChange}
                  onFocus={() => setShowSuggestions(true)}
                  onBlur={handleSearchBlur}
                />
                {/* Loader visual dentro do input */}
                {isLoading && (
                  <div className="absolute right-4 top-1/2 -translate-y-1/2">
                    <Loader2 className="animate-spin text-primary" size={20} />
                  </div>
                )}
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
                  ) : searchTerm.trim().length >= 3 ? (
                    <div className="px-4 py-3 text-center text-gray-theme transition-colors duration-500">
                      Nenhuma escola encontrada para "{searchTerm}"
                    </div>
                  ) : (
                    <div className="px-4 py-3 text-center text-gray-theme transition-colors duration-500">
                      Digite pelo menos 3 caracteres para iniciar a busca.
                    </div>
                  )}
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
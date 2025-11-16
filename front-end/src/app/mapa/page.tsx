'use client';
import { Search } from 'lucide-react';
import Image from 'next/image';
import { useState, useEffect } from 'react';
import { useRouter } from 'next/navigation';

export default function MapaPage() {
  const [searchTerm, setSearchTerm] = useState('');
  const [showSuggestions, setShowSuggestions] = useState(false);
  const [isDark, setIsDark] = useState(false);
  const [windowSize, setWindowSize] = useState({
    width: 1200,
    height: 800,
  });
  const router = useRouter();

  const estadosBrasileiros = [
    { nome: "Acre", sigla: "AC" },
    { nome: "Alagoas", sigla: "AL" },
    { nome: "Amapá", sigla: "AP" },
    { nome: "Amazonas", sigla: "AM" },
    { nome: "Bahia", sigla: "BA" },
    { nome: "Ceará", sigla: "CE" },
    { nome: "Distrito Federal", sigla: "DF" },
    { nome: "Espírito Santo", sigla: "ES" },
    { nome: "Goiás", sigla: "GO" },
    { nome: "Maranhão", sigla: "MA" },
    { nome: "Mato Grosso", sigla: "MT" },
    { nome: "Mato Grosso do Sul", sigla: "MS" },
    { nome: "Minas Gerais", sigla: "MG" },
    { nome: "Pará", sigla: "PA" },
    { nome: "Paraíba", sigla: "PB" },
    { nome: "Paraná", sigla: "PR" },
    { nome: "Pernambuco", sigla: "PE" },
    { nome: "Piauí", sigla: "PI" },
    { nome: "Rio de Janeiro", sigla: "RJ" },
    { nome: "Rio Grande do Norte", sigla: "RN" },
    { nome: "Rio Grande do Sul", sigla: "RS" },
    { nome: "Rondônia", sigla: "RO" },
    { nome: "Roraima", sigla: "RR" },
    { nome: "Santa Catarina", sigla: "SC" },
    { nome: "São Paulo", sigla: "SP" },
    { nome: "Sergipe", sigla: "SE" },
    { nome: "Tocantins", sigla: "TO" }
  ];

  // Detecta tamanho da tela
  useEffect(() => {
    const handleResize = () => {
      setWindowSize({
        width: window.innerWidth,
        height: window.innerHeight,
      });
    };

    window.addEventListener('resize', handleResize);
    handleResize();
    
    return () => window.removeEventListener('resize', handleResize);
  }, []);

  // Breakpoints 
  const isSmallMobile = windowSize.width < 480;  
  const isMediumMobile = windowSize.width >= 480 && windowSize.width < 768;
  const isTablet = windowSize.width >= 768 && windowSize.width < 1024;
  const isLaptop = windowSize.width >= 1024 && windowSize.width < 1440;
  const isDesktop = windowSize.width >= 1440;

  const filteredEstados = searchTerm
    ? estadosBrasileiros.filter(estado =>
        estado.nome.toLowerCase().includes(searchTerm.toLowerCase()) ||
        estado.sigla.toLowerCase().includes(searchTerm.toLowerCase())
      )
    : estadosBrasileiros;

  const navegarParaEstado = (sigla: string) => {
    router.push(`/estado/${sigla.toLowerCase()}`);
  };

  useEffect(() => {
    const currentTheme = document.documentElement.getAttribute('data-theme');
    setIsDark(currentTheme === 'dark');
    
    document.documentElement.style.overflowX = 'hidden';
    document.body.style.overflowX = 'hidden';
    
    return () => {
      document.documentElement.style.overflowX = '';
      document.body.style.overflowX = '';
    };
  }, []);

  return (
    <>
      <style jsx global>{`
        html, body {
          overflow-x: hidden !important;
        }
      `}</style>
      
      <main className="min-h-screen bg-background text-text transition-all duration-500 overflow-x-hidden">
        <div className={`max-w-[95%] sm:max-w-[90%] md:max-w-[85%] lg:max-w-[80%] mx-auto px-3 sm:px-4 ${
          isSmallMobile || isMediumMobile ? 'py-4' : 'py-6 md:py-16'
        }`}>
          <div className={`flex flex-col ${
            isSmallMobile || isMediumMobile ? 'gap-4' : 
            isTablet ? 'gap-8' : 
            'lg:grid lg:grid-cols-2 lg:gap-12'
          } min-h-[70vh] items-center justify-center`}>
            
            <div className="flex flex-col items-center lg:items-start justify-center h-full">
              <div className="w-full max-w-md relative">
                
                <div className="relative">
                  <Search 
                    className="absolute left-4 top-1/2 -translate-y-1/2 text-gray-theme transition-colors duration-500"
                    size={20}
                  />
                  <input
                    type="text"
                    placeholder="Digite o nome do estado..."
                    className="w-full h-14 rounded-full pl-12 pr-6 focus:outline-none focus:ring-2 focus:ring-primary text-lg bg-card border border-theme text-text transition-all duration-500"
                    value={searchTerm}
                    onChange={(e) => {
                      setSearchTerm(e.target.value);
                      setShowSuggestions(true);
                    }}
                    onFocus={() => {
                      setShowSuggestions(true);
                    }}
                    onBlur={() => setTimeout(() => setShowSuggestions(false), 200)}
                    onKeyDown={(e) => {
                      if (e.key === 'Enter' && filteredEstados.length > 0) {
                        navegarParaEstado(filteredEstados[0].sigla);
                      }
                    }}
                  />
                </div>

                {showSuggestions && (
                  <div className="absolute top-full left-0 right-0 mt-2 max-h-60 overflow-y-auto overflow-x-hidden z-50 shadow-theme bg-card border border-theme rounded-lg transition-all duration-500">
                    {filteredEstados.length > 0 ? (
                      filteredEstados.map((estado) => (
                        <button
                          key={estado.sigla}
                          className="w-full text-left px-4 py-3 border-b border-theme last:border-b-0 hover:bg-card-alt cursor-pointer transition-colors duration-500"
                          onClick={() => {
                            setSearchTerm(estado.nome);
                            setShowSuggestions(false);
                            navegarParaEstado(estado.sigla);
                          }}
                        >
                          <div className="flex justify-between items-center">
                            <span className="text-text transition-colors duration-500">{estado.nome}</span>
                            <span className="bg-primary text-white px-2 py-1 rounded text-sm transition-colors duration-500">
                              {estado.sigla}
                            </span>
                          </div>
                        </button>
                      ))
                    ) : (
                      <div className="px-4 py-3 text-center text-gray-theme transition-colors duration-500">
                        Nenhum estado encontrado para "{searchTerm}"
                      </div>
                    )}
                  </div>
                )}

              </div>
            </div>
            
            {/* Mapa do Brasil */}
            <div className="flex items-center justify-end h-full w-full overflow-visible">
              <div className={`relative h-full flex items-center justify-center overflow-visible ${
                isSmallMobile 
                  ? 'min-h-[40vh] w-full' 
                  : isMediumMobile 
                  ? 'min-h-[45vh] w-full'  
                  : isTablet 
                  ? 'min-h-[60vh] w-[120%] -mr-32'  
                  : isLaptop
                  ? 'min-h-[75vh] w-[150%] -mr-48'  
                  : 'min-h-[80vh] w-[180%] -mr-96' 
              }`}>
                <Image
                  src="/images/brasil.png"
                  alt="Mapa do Brasil"
                  fill
                  style={{ 
                    objectFit: "contain"
                  }}
                  priority
                  className={`transition-all duration-500 ${
                    isSmallMobile || isMediumMobile ? 'scale-100' : 
                    isTablet ? 'scale-110' : 
                    'scale-133'
                  }`}
                />
              </div>
            </div>

          </div>
        </div>
      </main>
    </>
  );
}
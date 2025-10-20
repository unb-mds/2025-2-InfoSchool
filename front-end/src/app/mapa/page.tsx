'use client';
import { Search } from 'lucide-react';
import Image from 'next/image';
import { useState, useEffect } from 'react';
import { useRouter } from 'next/navigation';

export default function MapaPage() {
  const [searchTerm, setSearchTerm] = useState('');
  const [showSuggestions, setShowSuggestions] = useState(false);
  const [isDark, setIsDark] = useState(false);
  const router = useRouter();

  // Lista de todos os estados brasileiros
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

  // ⚡ **MUDANÇA PRINCIPAL:** Mostrar todos os estados quando clicar, filtrar quando digitar
  const filteredEstados = searchTerm
    ? estadosBrasileiros.filter(estado =>
        estado.nome.toLowerCase().includes(searchTerm.toLowerCase()) ||
        estado.sigla.toLowerCase().includes(searchTerm.toLowerCase())
      )
    : estadosBrasileiros; // ⬅️ MOSTRA TODOS quando searchTerm estiver vazio

  // Função para navegar para a página do estado
  const navegarParaEstado = (sigla: string) => {
    router.push(`/estado/${sigla.toLowerCase()}`);
  };

  // Função para alternar o tema
  const toggleTheme = () => {
    const newTheme = !isDark;
    setIsDark(newTheme);
    
    if (newTheme) {
      document.documentElement.setAttribute('data-theme', 'dark');
    } else {
      document.documentElement.removeAttribute('data-theme');
    }
  };

  // Verifica o tema atual ao carregar a página
  useEffect(() => {
    const currentTheme = document.documentElement.getAttribute('data-theme');
    setIsDark(currentTheme === 'dark');
  }, []);

  return (
    <main className="min-h-screen transition-colors duration-300 bg-background text-text">
      
      {/* ========== CONTEÚDO PRINCIPAL ========== */}
      <div className="max-w-[95%] sm:max-w-[90%] md:max-w-[80%] mx-auto px-3 sm:px-4 py-6 md:py-16">
        
        {/* ========== GRID PRINCIPAL ========== */}
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-8 lg:gap-12 min-h-[70vh] items-center">
          
          {/* ========== LADO ESQUERDO - PESQUISA ========== */}
          <div className="flex flex-col items-center lg:items-start justify-center h-full">
            <div className="w-full max-w-md relative">
              
              {/* Barra de Pesquisa */}
              <div className="relative">
                <Search 
                  className="absolute left-4 top-1/2 -translate-y-1/2 text-gray-theme"
                  size={20}
                />
                <input
                  type="text"
                  placeholder="Digite o nome do estado..."
                  className="w-full h-14 rounded-full pl-12 pr-6 focus:outline-none focus:ring-2 focus:ring-primary text-lg bg-card border border-theme text-text"
                  value={searchTerm}
                  onChange={(e) => {
                    setSearchTerm(e.target.value);
                    setShowSuggestions(true);
                  }}
                  onFocus={() => {
                    setShowSuggestions(true); // ⬅️ MOSTRA SUGESTÕES AO CLICAR
                  }}
                  onBlur={() => setTimeout(() => setShowSuggestions(false), 200)}
                  onKeyDown={(e) => {
                    if (e.key === 'Enter' && filteredEstados.length > 0) {
                      navegarParaEstado(filteredEstados[0].sigla);
                    }
                  }}
                />
              </div>

              {/* Sugestões - Agora mostra TODOS os estados ao clicar */}
              {showSuggestions && (
                <div className="absolute top-full left-0 right-0 mt-2 max-h-60 overflow-y-auto z-50 shadow-theme bg-card border border-theme rounded-lg">
                  {filteredEstados.length > 0 ? (<>
                   
                     
                      
                      
                      {/* Lista de estados */}
                      {filteredEstados.map((estado) => (
                        <button
                          key={estado.sigla}
                          className="w-full text-left px-4 py-3 transition-colors duration-300 border-b border-theme last:border-b-0 hover:bg-card-alt cursor-pointer"
                          onClick={() => {
                            setSearchTerm(estado.nome);
                            setShowSuggestions(false);
                            navegarParaEstado(estado.sigla);
                          }}
                        >
                          <div className="flex justify-between items-center">
                            <span className="text-text">{estado.nome}</span>
                            <span className="bg-primary text-white px-2 py-1 rounded text-sm">
                              {estado.sigla}
                            </span>
                          </div>
                        </button>
                      ))}
                    </>
                  ) : (
                    <div className="px-4 py-3 text-center text-gray-theme">
                      Nenhum estado encontrado para "{searchTerm}"
                    </div>
                  )}
                </div>
              )}

            </div>
          </div>
          
          {/* ========== LADO DIREITO - MAPA ========== */}
          <div className="flex items-center justify-end h-full w-full">
            <div className="relative h-full min-h-[80vh] w-[120%] -mr-32">
              <Image
                src="/images/brasil.png"
                alt="Mapa do Brasil"
                fill
                style={{ 
                  objectFit: "contain"
                }}
                priority
                className="transition-opacity duration-300 scale-133"
              />
            </div>
          </div>

        </div>
      </div>
    </main>
  );
}
'use client';
import { Search } from 'lucide-react';
import Image from 'next/image';
import { useState, useEffect } from 'react';

export default function MapaPage() {
  const [searchTerm, setSearchTerm] = useState('');
  const [showSuggestions, setShowSuggestions] = useState(false);
  const [isDark, setIsDark] = useState(false);

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

  // Filtrar estados baseado no termo de pesquisa
  const filteredEstados = estadosBrasileiros.filter(estado =>
    estado.nome.toLowerCase().includes(searchTerm.toLowerCase()) ||
    estado.sigla.toLowerCase().includes(searchTerm.toLowerCase())
  );

  // Função para alternar o tema
  const toggleTheme = () => {
    const newTheme = !isDark;
    setIsDark(newTheme);
    
    // Aplica o tema no data-theme do html
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
      
      {/* ========== CONTEÚDO PRINCIPAL - MESMA MARGEM DA PÁGINA INICIAL ========== */}
      <div className="max-w-[95%] sm:max-w-[90%] md:max-w-[80%] mx-auto px-3 sm:px-4 py-6 md:py-16">
        
        {/* ========== GRID PRINCIPAL - ALINHAMENTO NO MEIO ========== */}
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-8 lg:gap-12 min-h-[70vh] items-center">
          
          {/* ========== LADO ESQUERDO - PESQUISA NO MEIO ========== */}
          <div className="flex flex-col items-center lg:items-start justify-center h-full">
            <div className="w-full max-w-md relative"> {/* ⬅️ ADICIONEI relative AQUI */}
              
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
                  onFocus={() => setShowSuggestions(true)}
                  onBlur={() => setTimeout(() => setShowSuggestions(false), 200)}
                />
              </div>

              {/* Sugestões - AGORA COM CONTAINER RELATIVE */}
              {showSuggestions && searchTerm && (
                <div className="absolute top-full left-0 right-0 mt-2 max-h-60 overflow-y-auto z-50 shadow-theme bg-card border border-theme rounded-lg">
                  {filteredEstados.length > 0 ? (
                    filteredEstados.map((estado) => (
                      <button
                        key={estado.sigla}
                        className="w-full text-left px-4 py-3 transition-colors duration-300 border-b border-theme last:border-b-0 hover:bg-card-alt"
                        onClick={() => {
                          setSearchTerm(estado.nome);
                          setShowSuggestions(false);
                        }}
                      >
                        <div className="flex justify-between items-center">
                          <span className="text-text">{estado.nome}</span>
                          <span className="bg-primary text-white px-2 py-1 rounded text-sm">
                            {estado.sigla}
                          </span>
                        </div>
                      </button>
                    ))
                  ) : (
                    <div className="px-4 py-3 text-center text-gray-theme">
                      Nenhum estado encontrado
                    </div>
                  )}
                </div>
              )}

              {/* Sugestões Populares quando não há pesquisa */}
              {!searchTerm && (
                <div className="mt-6">
                  <p className="text-sm mb-3 text-gray-theme">
                    Sugestões populares:
                  </p>
                  <div className="flex flex-wrap gap-2">
                    {estadosBrasileiros.slice(0, 6).map((estado) => (
                      <button
                        key={estado.sigla}
                        className="px-3 py-2 rounded-lg text-sm transition-colors duration-300 border border-theme bg-card text-text hover:bg-card-alt"
                        onClick={() => setSearchTerm(estado.nome)}
                      >
                        {estado.nome}
                      </button>
                    ))}
                  </div>
                </div>
              )}
            </div>
          </div>

          {/* ========== LADO DIREITO - MAPA GRANDE ========== */}
          <div className="flex items-center justify-end h-full w-full">
            <div className="relative h-full min-h-[80vh] w-[120%] -mr-32">
              {/* Mapa do Brasil - GRANDE */}
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
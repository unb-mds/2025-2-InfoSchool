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
    <main className="min-h-screen flex flex-col p-4 sm:p-6 lg:p-8 transition-colors duration-300"
          style={{
            backgroundColor: 'var(--background)',
            color: 'var(--text)'
          }}>
      
      {/* ========== CONTEÚDO PRINCIPAL ========== */}
      <div className="flex-1 grid grid-cols-1 lg:grid-cols-2 gap-8 lg:gap-12 items-center">
        
        {/* ========== LADO ESQUERDO - PESQUISA ========== */}
        <div className="flex flex-col items-center lg:items-start justify-center">
          
          {/* Barra de Pesquisa com Sugestões */}
          <div className="relative w-full max-w-md">
            <div className="relative">
              <Search 
                className="absolute left-4 top-1/2 -translate-y-1/2 transition-colors duration-300"
                size={20}
                style={{ color: 'var(--gray-text)' }}
              />
              <input
                type="text"
                placeholder="Digite o nome do estado..."
                className="w-full h-14 rounded-full pl-12 pr-6 focus:outline-none focus:ring-2 focus:ring-blue-500 text-lg transition-colors duration-300"
                style={{
                  backgroundColor: 'var(--card)',
                  border: '1px solid var(--border)',
                  color: 'var(--text)'
                }}
                value={searchTerm}
                onChange={(e) => {
                  setSearchTerm(e.target.value);
                  setShowSuggestions(true);
                }}
                onFocus={() => setShowSuggestions(true)}
                onBlur={() => setTimeout(() => setShowSuggestions(false), 200)}
              />
            </div>

            {/* Lista de Sugestões */}
            {showSuggestions && searchTerm && (
              <div className="absolute top-full left-0 right-0 rounded-lg mt-2 max-h-60 overflow-y-auto z-10 shadow-lg transition-colors duration-300"
                   style={{
                     backgroundColor: 'var(--card)',
                     border: '1px solid var(--border)',
                     boxShadow: 'var(--shadow)'
                   }}>
                {filteredEstados.length > 0 ? (
                  filteredEstados.map((estado) => (
                    <button
                      key={estado.sigla}
                      className="w-full text-left px-4 py-3 transition-colors border-b last:border-b-0 duration-300"
                      style={{
                        borderColor: 'var(--border)'
                      }}
                      onMouseEnter={(e) => {
                        e.currentTarget.style.backgroundColor = 'var(--card-alt)';
                      }}
                      onMouseLeave={(e) => {
                        e.currentTarget.style.backgroundColor = 'transparent';
                      }}
                      onClick={() => {
                        setSearchTerm(estado.nome);
                        setShowSuggestions(false);
                      }}
                    >
                      <div className="flex justify-between items-center">
                        <span style={{ color: 'var(--text)' }}>{estado.nome}</span>
                        <span className="bg-blue-600 text-white px-2 py-1 rounded text-sm">
                          {estado.sigla}
                        </span>
                      </div>
                    </button>
                  ))
                ) : (
                  <div className="px-4 py-3 text-center transition-colors duration-300"
                       style={{ color: 'var(--gray-text)' }}>
                    Nenhum estado encontrado
                  </div>
                )}
              </div>
            )}
          </div>

          {/* Sugestões Populares quando não há pesquisa */}
          {!searchTerm && (
            <div className="mt-6 w-full max-w-md">
              <p className="text-sm mb-3 transition-colors duration-300"
                 style={{ color: 'var(--gray-text)' }}>
                Sugestões populares:
              </p>
              <div className="flex flex-wrap gap-2">
                {estadosBrasileiros.slice(0, 6).map((estado) => (
                  <button
                    key={estado.sigla}
                    className="px-3 py-2 rounded-lg text-sm transition-colors duration-300 border"
                    style={{
                      backgroundColor: 'var(--card)',
                      borderColor: 'var(--border)',
                      color: 'var(--text)'
                    }}
                    onMouseEnter={(e) => {
                      e.currentTarget.style.backgroundColor = 'var(--card-alt)';
                    }}
                    onMouseLeave={(e) => {
                      e.currentTarget.style.backgroundColor = 'var(--card)';
                    }}
                    onClick={() => setSearchTerm(estado.nome)}
                  >
                    {estado.nome}
                  </button>
                ))}
              </div>
            </div>
          )}
        </div>

        {/* ========== LADO DIREITO - MAPA GRANDE ========== */}
        <div className="flex items-center justify-center w-full h-full">
          <div className="relative w-full h-full min-h-[80vh]">
            {/* Mapa do Brasil - GRANDE */}
            <Image
              src="/images/brasil.png"
              alt="Mapa do Brasil"
              fill
              style={{ 
                objectFit: "contain"
              }}
              priority
              className="transition-opacity duration-300 scale-107" 
            />
          </div>
        </div>

      </div>
    </main>
  );
}
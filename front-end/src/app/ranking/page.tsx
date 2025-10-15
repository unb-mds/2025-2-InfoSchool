// src/app/ranking/page.tsx
'use client';

import { useState } from 'react';

// Dados dos estados e municípios
const estados = [
  { sigla: 'SP', nome: 'São Paulo', municipios: ['São Paulo', 'Campinas', 'Ribeirão Preto', 'Santos', 'São José dos Campos'] },
  { sigla: 'MG', nome: 'Minas Gerais', municipios: ['Belo Horizonte', 'Uberlândia', 'Contagem', 'Juiz de Fora', 'Betim'] },
  { sigla: 'RJ', nome: 'Rio de Janeiro', municipios: ['Rio de Janeiro', 'Niterói', 'Duque de Caxias', 'São Gonçalo', 'Nova Iguaçu'] },
  { sigla: 'RS', nome: 'Rio Grande do Sul', municipios: ['Porto Alegre', 'Caxias do Sul', 'Pelotas', 'Canoas', 'Santa Maria'] },
  { sigla: 'DF', nome: 'Distrito Federal', municipios: ['Brasília', 'Ceilândia', 'Taguatinga', 'Planaltina', 'Samambaia'] },
];

// Dados mockados
const escolasMock = [
  // SP
  { id: 1, nome: "Colégio São Paulo", municipio: "São Paulo", estado: "SP", tipo: "Estadual", desempenho: 9.8, infraestrutura: 9.2, aprovacao: 98, portugues: 9.7, matematica: 9.9 },
  { id: 2, nome: "Escola Técnica Estadual", municipio: "Campinas", estado: "SP", tipo: "Estadual", desempenho: 9.5, infraestrutura: 8.8, aprovacao: 96, portugues: 9.4, matematica: 9.6 },
  { id: 3, nome: "Colégio Objetivo", municipio: "São Paulo", estado: "SP", tipo: "Privada", desempenho: 9.6, infraestrutura: 9.4, aprovacao: 97, portugues: 9.5, matematica: 9.7 },
  { id: 4, nome: "Escola Municipal Jardins", municipio: "Ribeirão Preto", estado: "SP", tipo: "Municipal", desempenho: 8.9, infraestrutura: 8.2, aprovacao: 92, portugues: 8.8, matematica: 9.0 },
  { id: 5, nome: "Instituto Federal SP", municipio: "São Paulo", estado: "SP", tipo: "Federal", desempenho: 9.7, infraestrutura: 9.5, aprovacao: 99, portugues: 9.6, matematica: 9.8 },
  
  // MG
  { id: 6, nome: "Colégio Aplicação UFMG", municipio: "Belo Horizonte", estado: "MG", tipo: "Federal", desempenho: 9.8, infraestrutura: 9.2, aprovacao: 98, portugues: 9.7, matematica: 9.9 },
  { id: 7, nome: "Escola Estadual Minas", municipio: "Uberlândia", estado: "MG", tipo: "Estadual", desempenho: 9.2, infraestrutura: 8.5, aprovacao: 94, portugues: 9.1, matematica: 9.3 },
  { id: 8, nome: "Colégio Santo Antônio", municipio: "Belo Horizonte", estado: "MG", tipo: "Privada", desempenho: 9.4, infraestrutura: 9.1, aprovacao: 96, portugues: 9.3, matematica: 9.5 },
  
  // RJ
  { id: 9, nome: "Colégio Pedro II", municipio: "Rio de Janeiro", estado: "RJ", tipo: "Federal", desempenho: 9.6, infraestrutura: 9.0, aprovacao: 97, portugues: 9.5, matematica: 9.7 },
  { id: 10, nome: "Escola Técnica Estadual RJ", municipio: "Niterói", estado: "RJ", tipo: "Estadual", desempenho: 9.1, infraestrutura: 8.4, aprovacao: 93, portugues: 9.0, matematica: 9.2 },
];

// Categorias de ranking
const categorias = [
  { id: 'desempenho', nome: 'Melhor Desempenho Geral', campo: 'desempenho', unidade: 'pontos' },
  { id: 'aprovacao', nome: 'Maior Taxa de Aprovação', campo: 'aprovacao', unidade: '%' },
  { id: 'infraestrutura', nome: 'Melhor Infraestrutura', campo: 'infraestrutura', unidade: 'pontos' },
  { id: 'portugues', nome: 'Melhor em Português', campo: 'portugues', unidade: 'pontos' },
  { id: 'matematica', nome: 'Melhor em Matemática', campo: 'matematica', unidade: 'pontos' },
];

export default function Ranking() {
  const [filtroEstado, setFiltroEstado] = useState('');
  const [filtroMunicipio, setFiltroMunicipio] = useState('');
  const [filtroTipo, setFiltroTipo] = useState('');
  const [mostrarMais, setMostrarMais] = useState(false);

  // Municípios baseados no estado selecionado
  const municipiosDoEstado = estados.find(e => e.sigla === filtroEstado)?.municipios || [];

  // Filtrar escolas
  const escolasFiltradas = escolasMock.filter(escola => {
    const matchEstado = !filtroEstado || escola.estado === filtroEstado;
    const matchMunicipio = !filtroMunicipio || escola.municipio === filtroMunicipio;
    const matchTipo = !filtroTipo || escola.tipo === filtroTipo;
    return matchEstado && matchMunicipio && matchTipo;
  });

  // Limpar município quando mudar estado
  const handleEstadoChange = (estado: string) => {
    setFiltroEstado(estado);
    setFiltroMunicipio('');
  };

  // Número de escolas a mostrar
  const escolasParaMostrar = mostrarMais ? 10 : 5;

  return (
    <div className="min-h-screen bg-background text-text transition-colors duration-500">
      <div className="max-w-4xl mx-auto px-4 py-8">
        
        {/* Título Principal CORRIGIDO */}
        <div className="text-center mb-12">
          <h1 className="text-4xl md:text-5xl font-bold leading-tight transition-colors duration-500 mb-2"
              style={{ fontFamily: "'Rammetto One', cursive" }}>
            Destaque do <span className="text-primary">censo escolar:</span>
          </h1>
          <p className="text-2xl md:text-3xl transition-colors duration-500"
             style={{ fontFamily: "'Rammetto One', cursive" }}>
            encontre as melhores <span className="text-primary">escolas</span> em cada categoria
          </p>
        </div>

        {/* Filtros */}
        <div className="flex flex-col sm:flex-row gap-4 mb-12 justify-center items-center transition-all duration-500">
          
          {/* Filtro por Estado */}
          <div className="bg-card rounded-lg p-3 w-full sm:w-auto transition-all duration-500">
            <select 
              value={filtroEstado}
              onChange={(e) => handleEstadoChange(e.target.value)}
              className="w-full bg-background border border-gray-300 rounded px-3 py-2 text-text min-w-[180px] transition-all duration-500"
            >
              <option value="">Todos os estados</option>
              {estados.map(estado => (
                <option key={estado.sigla} value={estado.sigla}>
                  {estado.nome}
                </option>
              ))}
            </select>
          </div>

          {/* Filtro por Município */}
          <div className="bg-card rounded-lg p-3 w-full sm:w-auto transition-all duration-500">
            <select 
              value={filtroMunicipio}
              onChange={(e) => setFiltroMunicipio(e.target.value)}
              className="w-full bg-background border border-gray-300 rounded px-3 py-2 text-text min-w-[180px] transition-all duration-500"
              disabled={!filtroEstado}
            >
              <option value="">Todos os municípios</option>
              {municipiosDoEstado.map(municipio => (
                <option key={municipio} value={municipio}>
                  {municipio}
                </option>
              ))}
            </select>
          </div>

          {/* Filtro por Tipo de Escola */}
          <div className="bg-card rounded-lg p-3 w-full sm:w-auto transition-all duration-500">
            <select 
              value={filtroTipo}
              onChange={(e) => setFiltroTipo(e.target.value)}
              className="w-full bg-background border border-gray-300 rounded px-3 py-2 text-text min-w-[180px] transition-all duration-500"
            >
              <option value="">Todos os tipos</option>
              <option value="Federal">Federal</option>
              <option value="Estadual">Estadual</option>
              <option value="Municipal">Municipal</option>
              <option value="Privada">Privada</option>
            </select>
          </div>

        </div>

        {/* Ranking - CARDS UM EMBAIXO DO OUTRO */}
        <div className="space-y-6 mb-12 transition-all duration-500">
          {categorias.slice(0, escolasParaMostrar).map((categoria, index) => {
            // Ordenar escolas por esta categoria
            const escolasOrdenadas = [...escolasFiltradas].sort((a, b) => 
              (b as any)[categoria.campo] - (a as any)[categoria.campo]
            );
            
            const escolaTop = escolasOrdenadas[0];

            if (!escolaTop) return null;

            return (
              <div key={categoria.id} className="bg-card rounded-2xl p-8 transition-all duration-500 shadow-2xl hover:shadow-3xl hover:scale-105">
                <div className="flex items-center justify-between">
                  <div className="flex items-center gap-6">
                    <div className="text-6xl font-bold text-primary transition-colors duration-500"
                         style={{ fontFamily: "'Rammetto One', cursive" }}>
                      {index + 1}
                    </div>
                    <div>
                      <h3 className="text-2xl font-bold text-text mb-2 transition-colors duration-500"
                          style={{ fontFamily: "'Rammetto One', cursive" }}>
                        {categoria.nome}
                      </h3>
                      <div className="text-lg font-semibold text-text transition-colors duration-500">
                        {escolaTop.nome}
                      </div>
                      <div className="text-md opacity-80 text-text transition-colors duration-500">
                        {escolaTop.municipio} - {escolaTop.estado}
                      </div>
                    </div>
                  </div>
                  <div className="text-right">
                    <div className="text-3xl font-bold text-primary transition-colors duration-500"
                         style={{ fontFamily: "'Rammetto One', cursive" }}>
                      {(escolaTop as any)[categoria.campo]}{categoria.unidade === 'pontos' ? '' : categoria.unidade}
                    </div>
                    <div className="text-sm opacity-80 mt-1 transition-colors duration-500">
                      {categoria.unidade === 'pontos' ? 'Nota' : categoria.unidade}
                    </div>
                  </div>
                </div>
              </div>
            );
          })}
        </div>

        {/* Botão Ver Mais */}
        {escolasFiltradas.length > 5 && (
          <div className="text-center transition-all duration-500">
            <button 
              onClick={() => setMostrarMais(!mostrarMais)}
              className="bg-primary text-white px-12 py-4 rounded-full hover:bg-[#1a6fd8] transition-all duration-500 font-semibold text-lg transform hover:scale-105 shadow-2xl"
              style={{ fontFamily: "'Rammetto One', cursive" }}
            >
              {mostrarMais ? 'Ver menos' : 'Ver mais'}
            </button>
          </div>
        )}

      </div>
    </div>
  );
}
// src/app/ranking/page.tsx
'use client';

import { useState } from 'react';

const estados = [
  { sigla: 'SP', nome: 'São Paulo', municipios: ['São Paulo', 'Campinas', 'Ribeirão Preto', 'Santos', 'São José dos Campos'] },
  { sigla: 'MG', nome: 'Minas Gerais', municipios: ['Belo Horizonte', 'Uberlândia', 'Contagem', 'Juiz de Fora', 'Betim'] },
  { sigla: 'RJ', nome: 'Rio de Janeiro', municipios: ['Rio de Janeiro', 'Niterói', 'Duque de Caxias', 'São Gonçalo', 'Nova Iguaçu'] },
  { sigla: 'RS', nome: 'Rio Grande do Sul', municipios: ['Porto Alegre', 'Caxias do Sul', 'Pelotas', 'Canoas', 'Santa Maria'] },
  { sigla: 'DF', nome: 'Distrito Federal', municipios: ['Brasília', 'Ceilândia', 'Taguatinga', 'Planaltina', 'Samambaia'] },
];

const tiposEscola = ['Federal', 'Estadual', 'Municipal', 'Privada'];

const escolasMock = [
  { 
    id: 1, 
    nome: "Colégio São Paulo", 
    municipio: "São Paulo", 
    estado: "SP", 
    tipo: "Estadual", 
    ideb: 9.8, 
    infraestrutura: 9.2, 
    aprovacao: 98, 
    reprovacao: 2,
    crescimento_ideb: 0.8,
    formacao_docente: 9.5,
    conectividade: 9.3,
    nota_matematica: 9.9,
    nota_portugues: 9.7,
    inclusao: 9.1
  },
  { 
    id: 2, 
    nome: "Escola Técnica Estadual", 
    municipio: "Campinas", 
    estado: "SP", 
    tipo: "Estadual", 
    ideb: 9.5, 
    infraestrutura: 8.8, 
    aprovacao: 96, 
    reprovacao: 4,
    crescimento_ideb: 0.6,
    formacao_docente: 9.2,
    conectividade: 8.9,
    nota_matematica: 9.6,
    nota_portugues: 9.4,
    inclusao: 8.7
  },
  { 
    id: 3, 
    nome: "Colégio Objetivo", 
    municipio: "São Paulo", 
    estado: "SP", 
    tipo: "Privada", 
    ideb: 9.6, 
    infraestrutura: 9.4, 
    aprovacao: 97, 
    reprovacao: 3,
    crescimento_ideb: 0.5,
    formacao_docente: 9.4,
    conectividade: 9.6,
    nota_matematica: 9.7,
    nota_portugues: 9.5,
    inclusao: 8.9
  },
  { 
    id: 6, 
    nome: "Colégio Aplicação UFMG", 
    municipio: "Belo Horizonte", 
    estado: "MG", 
    tipo: "Federal", 
    ideb: 9.8, 
    infraestrutura: 9.2, 
    aprovacao: 98, 
    reprovacao: 2,
    crescimento_ideb: 0.9,
    formacao_docente: 9.7,
    conectividade: 9.4,
    nota_matematica: 9.9,
    nota_portugues: 9.7,
    inclusao: 9.3
  },
  { 
    id: 7, 
    nome: "Escola Estadual Minas", 
    municipio: "Uberlândia", 
    estado: "MG", 
    tipo: "Estadual", 
    ideb: 9.2, 
    infraestrutura: 8.5, 
    aprovacao: 94, 
    reprovacao: 6,
    crescimento_ideb: 0.7,
    formacao_docente: 8.8,
    conectividade: 8.2,
    nota_matematica: 9.3,
    nota_portugues: 9.1,
    inclusao: 8.4
  },
  { 
    id: 9, 
    nome: "Colégio Pedro II", 
    municipio: "Rio de Janeiro", 
    estado: "RJ", 
    tipo: "Federal", 
    ideb: 9.6, 
    infraestrutura: 9.0, 
    aprovacao: 97, 
    reprovacao: 3,
    crescimento_ideb: 0.6,
    formacao_docente: 9.3,
    conectividade: 9.1,
    nota_matematica: 9.7,
    nota_portugues: 9.5,
    inclusao: 9.0
  },
];

const categorias = [
  { 
    id: 'ideb', 
    nome: 'Melhor Desempenho Geral', 
    campo: 'ideb', 
    unidade: 'pontos',
    descricao: 'Melhores médias gerais (IDEB consolidado)'
  },
  { 
    id: 'reprovacao', 
    nome: 'Menor índice de reprovação', 
    campo: 'reprovacao', 
    unidade: '%',
    descricao: 'Menor taxa de reprovação por escola',
    ordemCrescente: true
  },
  { 
    id: 'infraestrutura', 
    nome: 'Melhor Infraestrutura', 
    campo: 'infraestrutura', 
    unidade: 'pontos',
    descricao: 'Melhores condições físicas e tecnológicas'
  },
  { 
    id: 'aprovacao', 
    nome: 'Maior Taxa de Aprovação', 
    campo: 'aprovacao', 
    unidade: '%',
    descricao: 'Percentual de alunos aprovados'
  },
  { 
    id: 'crescimento_ideb', 
    nome: 'Melhor Evolução no IDEB', 
    campo: 'crescimento_ideb', 
    unidade: 'pontos',
    descricao: 'Crescimento do IDEB entre dois anos'
  },
  { 
    id: 'formacao_docente', 
    nome: 'Melhor Formação Docente', 
    campo: 'formacao_docente', 
    unidade: 'pontos',
    descricao: 'Proporção de professores com formação adequada'
  },
  { 
    id: 'conectividade', 
    nome: 'Melhor Conectividade', 
    campo: 'conectividade', 
    unidade: 'pontos',
    descricao: 'Acesso à internet, laboratório e equipamentos'
  },
  { 
    id: 'nota_matematica', 
    nome: 'Melhor em Matemática', 
    campo: 'nota_matematica', 
    unidade: 'pontos',
    descricao: 'Médias de notas em matemática (Prova Brasil / SAEB)'
  },
  { 
    id: 'nota_portugues', 
    nome: 'Melhor em Português', 
    campo: 'nota_portugues', 
    unidade: 'pontos',
    descricao: 'Médias de notas em português (Prova Brasil / SAEB)'
  },
  { 
    id: 'inclusao', 
    nome: 'Maior Inclusão Escolar', 
    campo: 'inclusao', 
    unidade: 'pontos',
    descricao: 'Estrutura e suporte para alunos com deficiência'
  },
];

export default function Ranking() {
  const [filtroEstado, setFiltroEstado] = useState('');
  const [filtroMunicipio, setFiltroMunicipio] = useState('');
  const [filtroTipo, setFiltroTipo] = useState('');
  const [mostrarTodasCategorias, setMostrarTodasCategorias] = useState(false);
  const [categoriaExpandida, setCategoriaExpandida] = useState<string | null>(null);

  const municipiosDoEstado = estados.find(e => e.sigla === filtroEstado)?.municipios || [];

  const escolasFiltradas = escolasMock.filter(escola => {
    const matchEstado = !filtroEstado || escola.estado === filtroEstado;
    const matchMunicipio = !filtroMunicipio || escola.municipio === filtroMunicipio;
    const matchTipo = !filtroTipo || escola.tipo === filtroTipo;
    return matchEstado && matchMunicipio && matchTipo;
  });

  const handleEstadoChange = (estado: string) => {
    setFiltroEstado(estado);
    setFiltroMunicipio('');
  };

  const categoriasParaMostrar = mostrarTodasCategorias ? categorias : categorias.slice(0, 3);

  const ordenarEscolasPorCategoria = (categoria: typeof categorias[0]) => {
    return [...escolasFiltradas].sort((a, b) => {
      const valorA = (a as any)[categoria.campo];
      const valorB = (b as any)[categoria.campo];
      
      if (categoria.ordemCrescente) {
        return valorA - valorB;
      }
      return valorB - valorA;
    });
  };

  const formatarValor = (valor: number, unidade: string) => {
    if (unidade === '%') {
      return `${valor}%`;
    }
    if (unidade === 'pontos') {
      return valor.toFixed(1);
    }
    return valor.toString();
  };

  return (
    <div className="min-h-screen bg-background text-text transition-colors duration-500">
      <div className="max-w-6xl mx-auto px-4 py-8">
        
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

        <div className="flex flex-col sm:flex-row gap-4 mb-12 justify-center items-center transition-all duration-500">
          
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

          <div className="bg-card rounded-lg p-3 w-full sm:w-auto transition-all duration-500">
            <select 
              value={filtroTipo}
              onChange={(e) => setFiltroTipo(e.target.value)}
              className="w-full bg-background border border-gray-300 rounded px-3 py-2 text-text min-w-[180px] transition-all duration-500"
            >
              <option value="">Todos os tipos</option>
              {tiposEscola.map(tipo => (
                <option key={tipo} value={tipo}>{tipo}</option>
              ))}
            </select>
          </div>

        </div>

        {escolasFiltradas.length === 0 && (
          <div className="text-center py-12">
            <p className="text-xl opacity-80">Nenhuma escola encontrada com os filtros selecionados.</p>
          </div>
        )}

        <div className="space-y-6 mb-12 transition-all duration-500">
          {categoriasParaMostrar.map((categoria) => {
            const escolasOrdenadas = ordenarEscolasPorCategoria(categoria);
            const top3 = escolasOrdenadas.slice(0, 3);

            if (top3.length === 0) return null;

            const isExpanded = categoriaExpandida === categoria.id;

            return (
              <div key={categoria.id} className="bg-card rounded-2xl p-8 transition-all duration-500 shadow-2xl hover:shadow-3xl">
                <div className="flex items-center justify-between mb-6">
                  <div>
                    <h3 className="text-2xl font-bold text-text transition-colors duration-500"
                        style={{ fontFamily: "'Rammetto One', cursive" }}>
                      {categoria.nome}
                    </h3>
                    <p className="text-sm opacity-80 mt-1 max-w-md">
                      {categoria.descricao}
                    </p>
                  </div>
                  
                  <button
                    onClick={() => setCategoriaExpandida(isExpanded ? null : categoria.id)}
                    className="text-primary hover:text-[#1a6fd8] transition-colors duration-500 font-semibold"
                  >
                    {isExpanded ? 'Ver menos' : 'Ver top 3'}
                  </button>
                </div>

                {isExpanded ? (
                  <div className="space-y-4">
                    {top3.map((escola, index) => (
                      <div key={escola.id} className="flex items-center justify-between p-6 bg-background/50 rounded-xl">
                        <div className="flex items-center gap-6">
                          <div className="text-4xl font-bold text-primary transition-colors duration-500"
                               style={{ fontFamily: "'Rammetto One', cursive" }}>
                            {index + 1}
                          </div>
                          <div>
                            <div className="text-xl font-bold text-text transition-colors duration-500">
                              {escola.nome}
                            </div>
                            <div className="text-md opacity-80 text-text transition-colors duration-500">
                              {escola.municipio} - {escola.estado} • {escola.tipo}
                            </div>
                          </div>
                        </div>
                        <div className="text-right">
                          <div className="text-3xl font-bold text-primary transition-colors duration-500"
                               style={{ fontFamily: "'Rammetto One', cursive" }}>
                            {formatarValor((escola as any)[categoria.campo], categoria.unidade)}
                          </div>
                          <div className="text-sm opacity-80 mt-1 transition-colors duration-500">
                            {categoria.unidade === 'pontos' ? 'Nota' : categoria.unidade}
                          </div>
                        </div>
                      </div>
                    ))}
                  </div>
                ) : (
                  <div className="text-center py-8">
                  </div>
                )}
              </div>
            );
          })}
        </div>

        {categorias.length > 3 && (
          <div className="text-center transition-all duration-500">
            <button 
              onClick={() => setMostrarTodasCategorias(!mostrarTodasCategorias)}
              className="bg-primary text-white px-12 py-4 rounded-full hover:bg-[#1a6fd8] transition-all duration-500 font-semibold text-lg transform hover:scale-105 shadow-2xl"
              style={{ fontFamily: "'Rammetto One', cursive" }}
            >
              {mostrarTodasCategorias ? 'Ver menos' : 'Ver mais'}
            </button>
          </div>
        )}

      </div>
    </div>
  );
}
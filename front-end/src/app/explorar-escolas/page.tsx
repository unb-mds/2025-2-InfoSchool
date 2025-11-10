'use client';
import { useState, useEffect, useCallback, useMemo } from 'react';
import { Search, MapPin, Calendar, School, Filter, Building, Loader2 } from 'lucide-react';

interface UseDebounceProps<T> {
  value: T;
  delay: number;
}

function useDebounce<T>(value: T, delay: number): T {
  const [debouncedValue, setDebouncedValue] = useState<T>(value);

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

const PAGE_SIZE = 50; 

const ESTADOS_BRASIL = [
  'AC', 'AL', 'AP', 'AM', 'BA', 'CE', 'DF', 'ES', 'GO', 'MA', 
  'MT', 'MS', 'MG', 'PA', 'PB', 'PR', 'PE', 'PI', 'RJ', 'RN', 
  'RS', 'RO', 'RR', 'SC', 'SP', 'SE', 'TO'
];

const ANOS = Array.from({length: 18}, (_, i) => 2024 - i);
const TIPOS_ESCOLA = ['Municipal', 'Estadual', 'Federal', 'Privada'];


export default function ExplorarEscolas() {
  const [searchTerm, setSearchTerm] = useState('');
  const [filtroEstado, setFiltroEstado] = useState('');
  const [filtroMunicipio, setFiltroMunicipio] = useState('');
  const [filtroAno, setFiltroAno] = useState(2024); 
  const [filtroTipo, setFiltroTipo] = useState('');
  const [showFilters, setShowFilters] = useState(false);
  
  const debouncedSearchTerm = useDebounce(searchTerm, 500); 
  
  const [municipios, setMunicipios] = useState<string[]>([]);
  const [loadingMunicipios, setLoadingMunicipios] = useState(false);

  interface Escola {
    NO_ENTIDADE: string;
    NO_MUNICIPIO: string;
    SG_UF: string;
    TP_DEPENDENCIA: string;
    ano: number;
  }

  const [escolas, setEscolas] = useState<Escola[]>([]); 
  const [loading, setLoading] = useState(false);
  const [totalEscolas, setTotalEscolas] = useState(0); 
  const [error, setError] = useState<string | null>(null);
  const [currentPage, setCurrentPage] = useState(1);

  useEffect(() => {
    const carregarMunicipiosIBGE = async () => {
      if (!filtroEstado) {
        setMunicipios([]);
        return;
      }

      try {
        setLoadingMunicipios(true);
        const response = await fetch(
          `https://servicodados.ibge.gov.br/api/v1/localidades/estados/${filtroEstado}/municipios`
        );
        
        if (!response.ok) throw new Error('Erro ao carregar municípios');
        
        const data = await response.json();
        const nomesMunicipios = data.map((municipio: any) => municipio.nome);
        setMunicipios(nomesMunicipios.sort());
      } catch (error) {
        console.error('Erro ao carregar municípios:', error);
        const municipiosMock: { [key: string]: string[] } = {
          'SP': ["São Paulo", "Campinas", "Santos", "Ribeirão Preto", "Sorocaba", "São José dos Campos"],
          'RJ': ["Rio de Janeiro", "Niterói", "Duque de Caxias", "São Gonçalo", "Nova Iguaçu"],
          'MG': ["Belo Horizonte", "Uberlândia", "Contagem", "Juiz de Fora", "Betim"],
          'RS': ["Porto Alegre", "Caxias do Sul", "Pelotas", "Canoas", "Santa Maria"],
          'DF': ["Brasília"]
        };
        setMunicipios(municipiosMock[filtroEstado] || ["Município Principal"]);
      } finally {
        setLoadingMunicipios(false);
      }
    };

    carregarMunicipiosIBGE();
  }, [filtroEstado]);
  
  const buscarEscolas = useCallback(async () => {
    setLoading(true);
    setError(null);

    const params = new URLSearchParams();
    
    if (debouncedSearchTerm) params.append('termo', debouncedSearchTerm); 
    
    if (filtroEstado) params.append('estado', filtroEstado);
    if (filtroMunicipio) params.append('municipio', filtroMunicipio);
    if (filtroAno) params.append('ano', filtroAno.toString());
    if (filtroTipo) params.append('tipo', filtroTipo);
    
    params.append('pagina', currentPage.toString());
    params.append('limite', PAGE_SIZE.toString());

    try {
      const url = `/api/explorar-escolas?${params.toString()}`; 
      
      const response = await fetch(url);
      const data = await response.json(); 
      
      if (!response.ok) {
           throw new Error(data.error || data.details || 'Erro desconhecido do servidor.');
      }
      
      setEscolas(data.dados || []);      
      setTotalEscolas(Number(data.total) || 0); 
      
    } catch (err: unknown) {
      console.error('Erro ao buscar escolas:', err);
      setError(err instanceof Error ? err.message : 'Falha ao conectar com o servidor. (Verifique o console para o erro JSON)');
      setEscolas([]);
      setTotalEscolas(0);
    } finally {
      setLoading(false);
    }
  }, [filtroEstado, filtroMunicipio, filtroAno, filtroTipo, currentPage, debouncedSearchTerm]); 
  useEffect(() => {
    buscarEscolas();
  }, [buscarEscolas]); 

  useEffect(() => {
    if (currentPage !== 1) {
      setCurrentPage(1);
    }
  }, [filtroEstado, filtroMunicipio, filtroAno, filtroTipo, debouncedSearchTerm]); 


  const limparFiltros = () => {
    setFiltroEstado('');
    setFiltroMunicipio('');
    setFiltroAno(2024);
    setFiltroTipo('');
    setSearchTerm(''); 
    setCurrentPage(1); 
  };

  const temFiltrosAtivos = filtroEstado || filtroMunicipio || filtroAno !== 2024 || filtroTipo || searchTerm;
  const totalPaginas = Math.ceil(totalEscolas / PAGE_SIZE);

  return (
    <div className="min-h-screen bg-background text-text transition-colors duration-500">
      
      <section className="max-w-[95%] sm:max-w-[90%] md:max-w-[80%] mx-auto px-3 sm:px-4 py-8 md:py-16">
        <h1 className="text-3xl sm:text-4xl md:text-5xl lg:text-6xl font-bold text-center mb-4 md:mb-6"
            style={{ fontFamily: "'Rammetto One', cursive" }}>
          Explorar Escolas
        </h1>
        <p className="text-lg sm:text-xl md:text-2xl text-center text-text/80 mb-8 max-w-3xl mx-auto leading-relaxed"
           style={{ fontFamily: "'Sansita', sans-serif" }}>
          Encontre escolas em todo o Brasil com base em localização, ano e tipo
        </p>
      </section>

      <section className="max-w-[95%] sm:max-w-[90%] md:max-w-[80%] mx-auto px-3 sm:px-4 py-6">
        
        <div className="bg-card rounded-2xl p-4 sm:p-6 mb-6 shadow-2xl">
          {/* --- BARRA DE PESQUISA --- */}
          <div className="flex flex-col sm:flex-row gap-4 items-center">
            <div className="flex-1 w-full relative">
              <Search className="absolute left-4 top-1/2 -translate-y-1/2 text-text/60" size={20} />
              <input
                type="text"
                placeholder="Pesquisar escolas..."
                className="w-full h-12 rounded-full pl-12 pr-6 focus:outline-none focus:ring-2 focus:ring-primary bg-card-alt border border-theme text-text"
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
              />
            </div>
            <button
              onClick={() => setShowFilters(!showFilters)}
              className="sm:hidden bg-primary text-white rounded-full px-6 py-3 hover:bg-[#1a6fd8] transition-all duration-500 flex items-center gap-2 hover:scale-105 active:scale-95"
            >
              <Filter size={20} />
              Filtros
            </button>
          </div>

          {/* --- FILTROS AVANÇADOS --- */}
          <div className={`${showFilters ? 'block' : 'hidden'} sm:block mt-6 transition-all duration-500`}>
            <div className="grid grid-cols-1 md:grid-cols-5 gap-4">
              
              {/* FILTRO ESTADO */}
              <div>
                <label className="block text-sm font-medium mb-2 flex items-center gap-2 text-text">
                  <MapPin size={16} className="text-primary" /> Estado
                </label>
                <select
                  className="w-full rounded-lg p-3 bg-card-alt border border-theme text-text focus:outline-none focus:ring-2 focus:ring-primary"
                  value={filtroEstado}
                  onChange={(e) => {
                    setFiltroEstado(e.target.value);
                    setFiltroMunicipio('');
                  }}
                >
                  <option value="">Todos os estados</option>
                  {ESTADOS_BRASIL.map(estado => (
                    <option key={estado} value={estado}>{estado}</option>
                  ))}
                </select>
              </div>

              {/* FILTRO MUNICÍPIO */}
              <div>
                <label className="block text-sm font-medium mb-2 flex items-center gap-2 text-text">
                  <MapPin size={16} className="text-primary" /> Município
                </label>
                <select
                  className="w-full rounded-lg p-3 bg-card-alt border border-theme text-text focus:outline-none focus:ring-2 focus:ring-primary disabled:opacity-50"
                  value={filtroMunicipio}
                  onChange={(e) => setFiltroMunicipio(e.target.value)}
                  disabled={!filtroEstado || loadingMunicipios}
                >
                  <option value="">Todos os municípios</option>
                  {loadingMunicipios ? (
                    <option value="">Carregando...</option>
                  ) : (
                    municipios.map(municipio => (
                      <option key={municipio} value={municipio}>{municipio}</option>
                    ))
                  )}
                </select>
              </div>

              {/* FILTRO ANO */}
              <div>
                <label className="block text-sm font-medium mb-2 flex items-center gap-2 text-text">
                  <Calendar size={16} className="text-primary" /> Ano
                </label>
                <select
                  className="w-full rounded-lg p-3 bg-card-alt border border-theme text-text focus:outline-none focus:ring-2 focus:ring-primary"
                  value={filtroAno}
                  onChange={(e) => setFiltroAno(Number(e.target.value))}
                >
                  {ANOS.map(ano => (
                    <option key={ano} value={ano}>{ano}</option>
                  ))}
                </select>
              </div>

              {/* FILTRO TIPO */}
              <div>
                <label className="block text-sm font-medium mb-2 flex items-center gap-2 text-text">
                  <Building size={16} className="text-primary" /> Tipo
                </label>
                <select
                  className="w-full rounded-lg p-3 bg-card-alt border border-theme text-text focus:outline-none focus:ring-2 focus:ring-primary"
                  value={filtroTipo}
                  onChange={(e) => setFiltroTipo(e.target.value)}
                >
                  <option value="">Todos os tipos</option>
                  {TIPOS_ESCOLA.map(tipo => (
                    <option key={tipo} value={tipo}>{tipo}</option>
                  ))}
                </select>
              </div>

              {/* BOTÃO LIMPAR GERAL */}
              <div className="flex items-end">
                <button
                  onClick={limparFiltros}
                  disabled={!temFiltrosAtivos}
                  className="w-full bg-gray-600 text-white rounded-lg py-3 hover:bg-gray-700 disabled:bg-gray-800 disabled:cursor-not-allowed transition-all duration-500 hover:scale-105 active:scale-95"
                >
                  Limpar Filtros
                </button>
              </div>
            </div>
          </div>
        </div>

        {/* --- CONTAGEM DE RESULTADOS E MENSAGENS --- */}
        <div className="mb-6 flex justify-between items-center">
          <p className="text-text text-lg">
            {loading 
                ? 'Buscando...' 
                : `${totalEscolas} escola${totalEscolas !== 1 ? 's' : ''} encontrada${totalEscolas !== 1 ? 's' : ''}`
            }
          </p>
          {temFiltrosAtivos && !loading && (
            <button
              onClick={limparFiltros}
              className="text-sm text-primary hover:text-[#1a6fd8] transition-colors duration-500"
            >
              Limpar filtros
            </button>
          )}
        </div>

        {/* --- EXIBIÇÃO DE ERRO E LOADING --- */}
        {error && <div className="text-center text-xl text-red-500 py-12 bg-card rounded-2xl my-6">
            <p>Falha ao carregar dados:</p>
            <p className="text-sm mt-2">{error}</p>
        </div>}

        {loading && (
            <div className="text-center py-12 bg-card rounded-2xl my-6 flex flex-col items-center justify-center">
                <Loader2 size={40} className="animate-spin text-primary mb-4" />
                <p className="text-xl text-text/80">Buscando por escolas...</p>
                <p className="text-sm text-text/60 mt-1">Isso pode levar alguns segundos devido ao volume de dados.</p>
            </div>
        )}

        {/* --- LISTA DE ESCOLAS (RENDERIZAÇÃO) --- */}
        {!loading && !error && (
            <div className="space-y-4 md:space-y-6">
              {escolas.map((escola, index) => (
                <div 
                  key={`${escola.NO_ENTIDADE || 'unknown'}-${escola.NO_MUNICIPIO || 'unknown'}-${escola.SG_UF || 'unknown'}-${escola.ano || 'na'}-${index}`}
                  className="bg-card rounded-2xl p-4 sm:p-6 shadow-2xl hover:shadow-3xl transition-all duration-500 hover:scale-[1.02] cursor-pointer border border-theme"
                >
                  <div className="flex flex-col lg:flex-row lg:items-center lg:justify-between gap-4">
                    <div className="flex-1">
                      <div className="flex flex-col sm:flex-row sm:items-start sm:justify-between mb-4 gap-2">
                        <h3 className="text-xl sm:text-2xl font-bold text-primary">
                          {escola.NO_ENTIDADE || 'Nome Indisponível'}
                        </h3>
                        <div className="flex items-center gap-3">
                          <div className="text-sm text-text/70">
                            {escola.ano || filtroAno}
                          </div>
                        </div>
                      </div>
                      
                      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-3 text-sm">
                        <div className="flex items-center gap-2">
                          <MapPin size={16} className="text-text/60" />
                          <span className="text-text">{escola.NO_MUNICIPIO || 'N/A'} - {escola.SG_UF || 'N/A'}</span>
                        </div>
                        <div className="flex items-center gap-2">
                          <Building size={16} className="text-text/60" />
                          <span className="text-text">ID: {escola.TP_DEPENDENCIA || 'N/A'}</span>
                        </div>
                      </div>
                    </div>
                  </div>
                </div>
              ))}

              {/* MENSAGEM DE NENHUMA ESCOLA ENCONTRADA */}
              {escolas.length === 0 && totalEscolas === 0 && !loading && (
                <div className="text-center py-12 bg-card rounded-2xl shadow-2xl">
                  <School size={64} className="mx-auto text-text/40 mb-4" />
                  <h3 className="text-xl sm:text-2xl font-bold text-text/70 mb-2">
                    Nenhuma escola encontrada
                  </h3>
                  <p className="text-text/60 max-w-md mx-auto mb-4">
                    Tente ajustar os filtros ou limpá-los.
                  </p>
                  {temFiltrosAtivos && (
                    <button
                      onClick={limparFiltros}
                      className="bg-primary text-white rounded-full px-6 py-3 hover:bg-[#1a6fd8] transition-all duration-500 hover:scale-105 active:scale-95"
                    >
                      Limpar Filtros
                    </button>
                  )}
                </div>
              )}
            </div>
        )}
        
        {/* --- CONTROLES DE PAGINAÇÃO --- */}
        {!loading && !error && totalPaginas > 1 && (
            <div className="flex justify-center items-center gap-4 mt-8">
                <button
                    onClick={() => setCurrentPage(currentPage - 1)}
                    disabled={currentPage === 1}
                    className="bg-primary text-white rounded-lg px-4 py-2 disabled:opacity-50 transition-colors"
                >
                    ← Anterior
                </button>
                
                <span className="text-text">
                    Página {currentPage} de {totalPaginas}
                </span>

                <button
                    onClick={() => setCurrentPage(currentPage + 1)}
                    disabled={currentPage === totalPaginas}
                    className="bg-primary text-white rounded-lg px-4 py-2 disabled:opacity-50 transition-colors"
                >
                    Próxima →
                </button>
            </div>
        )}
      </section>
    </div>
  );
}
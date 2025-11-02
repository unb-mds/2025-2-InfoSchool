'use client';
import { useState, useEffect, useMemo } from 'react';
import { Search, MapPin, Calendar, School, Filter, Building } from 'lucide-react';

const ESCOLAS_MOCK = [
  {
    id: 1,
    nome: "Colégio Exemplo",
    estado: "DF",
    municipio: "Brasília",
    tipo: "Privada",
    ano: 2023
  },
  {
    id: 2,
    nome: "Escola Municipal Alpha",
    estado: "SP", 
    municipio: "São Paulo",
    tipo: "Municipal",
    ano: 2023
  },
  {
    id: 3,
    nome: "Colégio Estadual Beta",
    estado: "RJ",
    municipio: "Rio de Janeiro",
    tipo: "Estadual",
    ano: 2023
  },
  {
    id: 4,
    nome: "Escola Municipal Gama",
    estado: "MG",
    municipio: "Belo Horizonte", 
    tipo: "Municipal",
    ano: 2023
  },
  {
    id: 5,
    nome: "Colégio Particular Delta",
    estado: "SP",
    municipio: "Campinas",
    tipo: "Privada",
    ano: 2023
  },
  {
    id: 6,
    nome: "Escola Estadual Epsilon",
    estado: "RS",
    municipio: "Porto Alegre",
    tipo: "Estadual", 
    ano: 2023
  },
  {
    id: 7,
    nome: "Instituto Federal Zeta",
    estado: "MG",
    municipio: "Uberlândia",
    tipo: "Federal",
    ano: 2023
  },
  {
    id: 8,
    nome: "Colégio Particular Ômega",
    estado: "RJ",
    municipio: "Niterói",
    tipo: "Privada",
    ano: 2023
  }
];

const ESTADOS_BRASIL = [
  'AC', 'AL', 'AP', 'AM', 'BA', 'CE', 'DF', 'ES', 'GO', 'MA', 
  'MT', 'MS', 'MG', 'PA', 'PB', 'PR', 'PE', 'PI', 'RJ', 'RN', 
  'RS', 'RO', 'RR', 'SC', 'SP', 'SE', 'TO'
];

const ANOS = Array.from({length: 31}, (_, i) => 2025 - i);
const TIPOS_ESCOLA = ['Municipal', 'Estadual', 'Federal', 'Privada'];

export default function ExplorarEscolas() {
  const [searchTerm, setSearchTerm] = useState('');
  const [filtroEstado, setFiltroEstado] = useState('');
  const [filtroMunicipio, setFiltroMunicipio] = useState('');
  const [filtroAno, setFiltroAno] = useState(2023);
  const [filtroTipo, setFiltroTipo] = useState('');
  const [showFilters, setShowFilters] = useState(false);
  const [municipios, setMunicipios] = useState<string[]>([]);
  const [loadingMunicipios, setLoadingMunicipios] = useState(false);

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

  const escolasFiltradas = useMemo(() => {
    return ESCOLAS_MOCK.filter(escola => {
      const matchSearch = searchTerm === '' || 
        escola.nome.toLowerCase().includes(searchTerm.toLowerCase()) ||
        escola.municipio.toLowerCase().includes(searchTerm.toLowerCase());
      
      const matchEstado = !filtroEstado || escola.estado === filtroEstado;
      const matchMunicipio = !filtroMunicipio || escola.municipio === filtroMunicipio;
      const matchAno = escola.ano === filtroAno;
      const matchTipo = !filtroTipo || escola.tipo === filtroTipo;

      return matchSearch && matchEstado && matchMunicipio && matchAno && matchTipo;
    });
  }, [searchTerm, filtroEstado, filtroMunicipio, filtroAno, filtroTipo]);

  const limparFiltros = () => {
    setFiltroEstado('');
    setFiltroMunicipio('');
    setFiltroAno(2023);
    setFiltroTipo('');
    setSearchTerm('');
  };

  const temFiltrosAtivos = filtroEstado || filtroMunicipio || filtroAno !== 2023 || filtroTipo || searchTerm;

  return (
    <div className="min-h-screen bg-background text-text transition-colors duration-500">
      
      <section className="max-w-[95%] sm:max-w-[90%] md:max-w-[80%] mx-auto px-3 sm:px-4 py-8 md:py-16 transition-colors duration-500">
        <h1 className="text-3xl sm:text-4xl md:text-5xl lg:text-6xl font-bold text-center mb-4 md:mb-6 transition-colors duration-500"
            style={{ fontFamily: "'Rammetto One', cursive" }}>
          Explorar Escolas
        </h1>
        <p className="text-lg sm:text-xl md:text-2xl text-center text-text/80 mb-8 max-w-3xl mx-auto leading-relaxed transition-colors duration-500"
           style={{ fontFamily: "'Sansita', sans-serif" }}>
          Encontre escolas em todo o Brasil com base em localização, ano e tipo
        </p>
      </section>

      <section className="max-w-[95%] sm:max-w-[90%] md:max-w-[80%] mx-auto px-3 sm:px-4 py-6 transition-colors duration-500">
        
        <div className="bg-card rounded-2xl p-4 sm:p-6 mb-6 shadow-2xl transition-colors duration-500">
          <div className="flex flex-col sm:flex-row gap-4 items-center transition-colors duration-500">
            <div className="flex-1 w-full relative transition-colors duration-500">
              <Search className="absolute left-4 top-1/2 -translate-y-1/2 text-text/60 transition-colors duration-500" size={20} />
              <input
                type="text"
                placeholder="Pesquisar escolas por nome ou município..."
                className="w-full h-12 rounded-full pl-12 pr-6 focus:outline-none focus:ring-2 focus:ring-primary bg-card-alt border border-theme text-text transition-colors duration-500"
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

          <div className={`${showFilters ? 'block' : 'hidden'} sm:block mt-6 transition-all duration-500`}>
            <div className="grid grid-cols-1 md:grid-cols-5 gap-4 transition-colors duration-500">
              
              <div className="transition-colors duration-500">
                <label className="block text-sm font-medium mb-2 flex items-center gap-2 text-text transition-colors duration-500">
                  <MapPin size={16} className="text-primary transition-colors duration-500" />
                  Estado
                </label>
                <select
                  className="w-full rounded-lg p-3 bg-card-alt border border-theme text-text focus:outline-none focus:ring-2 focus:ring-primary transition-colors duration-500"
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

              <div className="transition-colors duration-500">
                <label className="block text-sm font-medium mb-2 flex items-center gap-2 text-text transition-colors duration-500">
                  <MapPin size={16} className="text-primary transition-colors duration-500" />
                  Município
                </label>
                <select
                  className="w-full rounded-lg p-3 bg-card-alt border border-theme text-text focus:outline-none focus:ring-2 focus:ring-primary transition-colors duration-500 disabled:opacity-50"
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

              <div className="transition-colors duration-500">
                <label className="block text-sm font-medium mb-2 flex items-center gap-2 text-text transition-colors duration-500">
                  <Calendar size={16} className="text-primary transition-colors duration-500" />
                  Ano
                </label>
                <select
                  className="w-full rounded-lg p-3 bg-card-alt border border-theme text-text focus:outline-none focus:ring-2 focus:ring-primary transition-colors duration-500"
                  value={filtroAno}
                  onChange={(e) => setFiltroAno(Number(e.target.value))}
                >
                  {ANOS.map(ano => (
                    <option key={ano} value={ano}>{ano}</option>
                  ))}
                </select>
              </div>

              <div className="transition-colors duration-500">
                <label className="block text-sm font-medium mb-2 flex items-center gap-2 text-text transition-colors duration-500">
                  <Building size={16} className="text-primary transition-colors duration-500" />
                  Tipo
                </label>
                <select
                  className="w-full rounded-lg p-3 bg-card-alt border border-theme text-text focus:outline-none focus:ring-2 focus:ring-primary transition-colors duration-500"
                  value={filtroTipo}
                  onChange={(e) => setFiltroTipo(e.target.value)}
                >
                  <option value="">Todos os tipos</option>
                  {TIPOS_ESCOLA.map(tipo => (
                    <option key={tipo} value={tipo}>{tipo}</option>
                  ))}
                </select>
              </div>

              <div className="flex items-end transition-colors duration-500">
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

        <div className="mb-6 flex justify-between items-center transition-colors duration-500">
          <p className="text-text text-lg transition-colors duration-500">
            {escolasFiltradas.length} escola{escolasFiltradas.length !== 1 ? 's' : ''} encontrada{escolasFiltradas.length !== 1 ? 's' : ''}
          </p>
          {temFiltrosAtivos && (
            <button
              onClick={limparFiltros}
              className="text-sm text-primary hover:text-[#1a6fd8] transition-colors duration-500"
            >
              Limpar filtros
            </button>
          )}
        </div>

        <div className="space-y-4 md:space-y-6 transition-colors duration-500">
          {escolasFiltradas.map((escola, index) => (
            <div
              key={escola.id}
              className="bg-card rounded-2xl p-4 sm:p-6 shadow-2xl hover:shadow-3xl transition-all duration-500 hover:scale-[1.02] cursor-pointer border border-theme"
            >
              <div className="flex flex-col lg:flex-row lg:items-center lg:justify-between gap-4 transition-colors duration-500">
                
                <div className="flex-1 transition-colors duration-500">
                  <div className="flex flex-col sm:flex-row sm:items-start sm:justify-between mb-4 gap-2 transition-colors duration-500">
                    <h3 className="text-xl sm:text-2xl font-bold text-primary transition-colors duration-500">
                      {escola.nome}
                    </h3>
                    <div className="flex items-center gap-3 transition-colors duration-500">
                      <div className="text-sm text-text/70 transition-colors duration-500">
                        {escola.ano}
                      </div>
                    </div>
                  </div>
                  
                  <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-3 text-sm transition-colors duration-500">
                    <div className="flex items-center gap-2 transition-colors duration-500">
                      <MapPin size={16} className="text-text/60 transition-colors duration-500" />
                      <span className="text-text transition-colors duration-500">{escola.municipio} - {escola.estado}</span>
                    </div>
                    <div className="flex items-center gap-2 transition-colors duration-500">
                      <School size={16} className="text-text/60 transition-colors duration-500" />
                      <span className="text-text transition-colors duration-500">{escola.tipo}</span>
                    </div>
                    <div className="flex items-center gap-2 transition-colors duration-500">
                      <Building size={16} className="text-text/60 transition-colors duration-500" />
                      <span className="text-text transition-colors duration-500">{escola.ano}</span>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          ))}

          {escolasFiltradas.length === 0 && (
            <div className="text-center py-12 bg-card rounded-2xl shadow-2xl transition-colors duration-500">
              <School size={64} className="mx-auto text-text/40 mb-4 transition-colors duration-500" />
              <h3 className="text-xl sm:text-2xl font-bold text-text/70 mb-2 transition-colors duration-500">
                Nenhuma escola encontrada
              </h3>
              <p className="text-text/60 max-w-md mx-auto mb-4 transition-colors duration-500">
                {temFiltrosAtivos 
                  ? "Tente ajustar os filtros para encontrar mais escolas."
                  : "Não há escolas cadastradas para os critérios atuais."
                }
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
      </section>
    </div>
  );
}
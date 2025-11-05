'use client';
import { useState, useEffect, useRef, useMemo } from 'react';
import { Search, X, School } from 'lucide-react';
import * as d3 from 'd3';
import { useRouter, useParams } from 'next/navigation';

interface MunicipioData {
  type: string;
  features: Array<{
    type: string;
    properties: {
      codices: string;
      nome: string;
      centroide: { lat: number; lon: number };
    };
    geometry: any;
  }>;
}

interface Escola {
  id: string;
  codigo_inep: string;
  nome: string;
  municipio: string;
  tipo: string;
}

export default function PaginaEstado() {
  const params = useParams();
  const sigla = params.sigla as string;
  const router = useRouter();
  const [geoData, setGeoData] = useState<MunicipioData | null>(null);
  const [loading, setLoading] = useState(true);
  const [searchTerm, setSearchTerm] = useState('');
  const [showSuggestions, setShowSuggestions] = useState(false);
  const [todosMunicipios, setTodosMunicipios] = useState<string[]>([]);
  const svgRef = useRef<SVGSVGElement>(null);
  const [municipioSelecionado, setMunicipioSelecionado] = useState<string | null>(null);
  const [escolasDoMunicipio, setEscolasDoMunicipio] = useState<Escola[]>([]);
  const [showEscolas, setShowEscolas] = useState(false);
  const [loadingEscolas, setLoadingEscolas] = useState(false);

  const getNomeEstado = (sigla: string): string => {
    const estados: { [key: string]: string } = {
      'ac': 'Acre', 'al': 'Alagoas', 'ap': 'Amapá', 'am': 'Amazonas', 'ba': 'Bahia',
      'ce': 'Ceará', 'df': 'Distrito Federal', 'es': 'Espírito Santo', 'go': 'Goiás', 
      'ma': 'Maranhão', 'mt': 'Mato Grosso', 'ms': 'Mato Grosso do Sul', 'mg': 'Minas Gerais',
      'pa': 'Pará', 'pb': 'Paraíba', 'pr': 'Paraná', 'pe': 'Pernambuco', 'pi': 'Piauí',
      'rj': 'Rio de Janeiro', 'rn': 'Rio Grande do Norte', 'rs': 'Rio Grande do Sul', 
      'ro': 'Rondônia', 'rr': 'Roraima', 'sc': 'Santa Catarina', 'sp': 'São Paulo',
      'se': 'Sergipe', 'to': 'Tocantins'
    };
    return estados[sigla.toLowerCase()] || sigla.toUpperCase();
  };

  const nomeEstado = getNomeEstado(sigla);

  const buscarEscolasDoMunicipio = async (municipio: string): Promise<Escola[]> => {
    // Simula uma requisição API
    return new Promise((resolve) => {
      setTimeout(() => {
        const gerarCodigoINEP = (municipio: string, sufixo: number): string => {
          let hash = 0;
          for (let i = 0; i < municipio.length; i++) {
            hash = ((hash << 5) - hash) + municipio.charCodeAt(i);
            hash = hash & hash;
          }
          const codigoBase = Math.abs(hash).toString().padStart(6, '0').slice(0, 6);
          const codigoCompleto = codigoBase + sufixo.toString().padStart(2, '0');
          return codigoCompleto.slice(0, 8);
        };

        const escolas = [
          {
            id: `${municipio}-1`,
            codigo_inep: gerarCodigoINEP(municipio, 1),
            nome: `Escola Estadual ${municipio}`,
            municipio: municipio,
            tipo: 'Estadual'
          },
          {
            id: `${municipio}-2`, 
            codigo_inep: gerarCodigoINEP(municipio, 2),
            nome: `Colégio Municipal ${municipio}`,
            municipio: municipio,
            tipo: 'Municipal'
          },
          {
            id: `${municipio}-3`,
            codigo_inep: gerarCodigoINEP(municipio, 3),
            nome: `Escola Particular ${municipio}`,
            municipio: municipio,
            tipo: 'Privada'
          }
        ];
        resolve(escolas);
      }, 500);
    });
  };

  const handleMunicipioClick = async (municipio: string) => {
    console.log('📍 Município selecionado:', municipio);
    setMunicipioSelecionado(municipio);
    setLoadingEscolas(true);
    setShowEscolas(false);
    
    try {
      const escolas = await buscarEscolasDoMunicipio(municipio);
      console.log('🎓 Escolas carregadas:', escolas);
      setEscolasDoMunicipio(escolas);
      setShowEscolas(true);
    } catch (error) {
      console.error('Erro ao buscar escolas:', error);
    } finally {
      setLoadingEscolas(false);
    }
  };

  const handleEscolaClick = (codigo_inep: string) => {
    console.log('🚀 Navegando para dashboard:', codigo_inep);
    console.log('📋 URL completa:', `/dashboard/${codigo_inep}`);
    router.push(`/dashboard/${codigo_inep}`);
  };

  useEffect(() => {
    const carregarMunicipiosIBGE = async () => {
      try {
        setLoading(true);
        const response = await fetch(
          `https://servicodados.ibge.gov.br/api/v1/localidades/estados/${sigla.toUpperCase()}/municipios`
        );
        const data = await response.json();
        const nomesMunicipios = data.map((municipio: any) => municipio.nome);
        setTodosMunicipios(nomesMunicipios);
      } catch (error) {
        console.error('Erro ao carregar municípios:', error);
        const municipiosManuais: { [key: string]: string[] } = {
          'sp': ["São Paulo", "Campinas", "Santos", "Ribeirão Preto", "Sorocaba"],
          'rj': ["Rio de Janeiro", "Niterói", "Duque de Caxias", "São Gonçalo"],
          'mg': ["Belo Horizonte", "Uberlândia", "Contagem", "Juiz de Fora"]
        };
        setTodosMunicipios(municipiosManuais[sigla.toLowerCase()] || ["Município Principal"]);
      } finally {
        setLoading(false);
      }
    };

    if (sigla) {
      carregarMunicipiosIBGE();
    }
  }, [sigla]);

  const municipiosFiltrados = useMemo(() => {
    if (!searchTerm.trim()) {
      return todosMunicipios;
    }
    return todosMunicipios.filter(municipio =>
      municipio.toLowerCase().includes(searchTerm.toLowerCase())
    );
  }, [searchTerm, todosMunicipios]);

  const redirecionarParaMunicipio = (municipio: string) => {
    const municipioFormatado = municipio
      .normalize('NFD')
      .replace(/[\u0300-\u036f]/g, '')
      .toLowerCase()
      .replace(/\s+/g, '-');
    
    router.push(`/municipios/${sigla.toLowerCase()}-${municipioFormatado}`);
  };

  useEffect(() => {
    async function carregarGeoData() {
      try {
        const codigo = getCodigoEstado(sigla);
        const url = `https://raw.githubusercontent.com/filipemeneses/geojson-brazil/master/meshes/counties/counties-${sigla.toLowerCase()}-${codigo}.json`;
        
        const response = await fetch(url);
        if (!response.ok) throw new Error(`Erro ${response.status}`);
        
        const data = await response.json();
        setGeoData(data);
      } catch (err) {
        console.error('Erro ao carregar mapa:', err);
      }
    }

    if (sigla) {
      carregarGeoData();
    }
  }, [sigla]);

  useEffect(() => {
    if (geoData && svgRef.current) {
      desenharMapa();
    }
  }, [geoData]);

  function desenharMapa() {
    if (!geoData || !svgRef.current) return;

    const svg = d3.select(svgRef.current);
    svg.selectAll("*").remove();

    const width = 1200;
    const height = 900;
    
    svg.attr('width', width)
       .attr('height', height);

    const isDark = document.documentElement.getAttribute('data-theme') === 'dark';

    const projection = d3.geoMercator()
      .center(getCentroEstado(sigla))
      .scale(getEscalaEstado(sigla))
      .translate([width / 2, height / 2]);

    const path = d3.geoPath().projection(projection);

    const fillColor = '#2C80FF';
    const strokeColor = isDark ? '#1e40af' : '#1e40af';
    const hoverColor = '#ef4444';

    svg.append('rect')
      .attr('width', width)
      .attr('height', height)
      .attr('fill', 'transparent');

    svg.selectAll('path.municipio')
      .data(geoData.features)
      .enter()
      .append('path')
      .attr('class', 'municipio')
      .attr('d', (d: any) => path(d))
      .attr('fill', fillColor)
      .attr('stroke', strokeColor)
      .attr('stroke-width', 0.3)
      .on('mouseover', function(event, d: any) {
        d3.select(this)
          .attr('fill', hoverColor)
          .attr('stroke-width', 1);
      })
      .on('mouseout', function(event, d: any) {
        d3.select(this)
          .attr('fill', fillColor)
          .attr('stroke-width', 0.3);
      })
      .on('click', function(event, d: any) {
        if (d.properties.nome) {
          redirecionarParaMunicipio(d.properties.nome);
        }
      });
  }

  function getCodigoEstado(sigla: string): string {
    const codigos: { [key: string]: string } = {
      'ac': '12', 'al': '27', 'ap': '16', 'am': '13', 'ba': '29',
      'ce': '23', 'df': '53', 'es': '32', 'go': '52', 'ma': '21',
      'mt': '51', 'ms': '50', 'mg': '31', 'pa': '15', 'pb': '25',
      'pr': '41', 'pe': '26', 'pi': '22', 'rj': '33', 'rn': '24',
      'rs': '43', 'ro': '11', 'rr': '14', 'sc': '42', 'sp': '35',
      'se': '28', 'to': '17'
    };
    return codigos[sigla.toLowerCase()] || '35';
  }

  function getCentroEstado(sigla: string): [number, number] {
    const centros: { [key: string]: [number, number] } = {
      'sp': [-48.5, -22.0], 'rj': [-42.5, -22.0], 'mg': [-44.5, -18.5],
      'ba': [-41.5, -12.5], 'pr': [-51.0, -24.5], 'rs': [-53.0, -30.0],
      'sc': [-50.5, -27.0], 'go': [-49.0, -15.0], 'mt': [-55.0, -13.0],
      'ms': [-54.5, -20.0], 'es': [-40.5, -19.5], 'pe': [-38.0, -8.5],
      'ce': [-39.5, -5.5], 'pa': [-52.0, -3.0], 'ma': [-45.0, -4.0],
      'pi': [-42.5, -8.0], 'rn': [-36.5, -5.5], 'pb': [-36.5, -7.0],
      'se': [-37.5, -10.5], 'al': [-36.5, -9.5], 'to': [-48.0, -9.0],
      'ro': [-63.5, -11.0], 'ac': [-70.5, -9.0], 'rr': [-61.5, 2.5],
      'ap': [-51.5, 1.5], 'df': [-47.5, -15.5],
    };
    return centros[sigla.toLowerCase()] || [-47.5, -15.5];
  }

  function getEscalaEstado(sigla: string): number {
    const escalas: { [key: string]: number } = {
      'sp': 6500, 'rj': 11000, 'mg': 5000, 'ba': 3800,
      'pr': 6000, 'rs': 4000, 'sc': 7500, 'go': 5200,
      'mt': 3000, 'ms': 4700, 'es': 9500, 'pe': 6000,
      'ce': 5800, 'pa': 2500, 'ma': 4000, 'pi': 4000,
      'rn': 6900, 'pb': 6900, 'se': 8000, 'al': 8000,
      'to': 4000, 'ro': 4000, 'ac': 4700, 'rr': 4700,
      'ap': 5800, 'df': 15000,
    };
    return escalas[sigla.toLowerCase()] || 5000;
  }

  if (loading) {
    return (
      <div className="min-h-screen bg-background text-text flex items-center justify-center transition-colors duration-500">
        <div className="text-xl">Carregando {nomeEstado}...</div>
      </div>
    );
  }

  return (
    <main className="min-h-screen bg-background text-text transition-colors duration-500 overflow-x-hidden">
      <div className="max-w-[95%] sm:max-w-[90%] md:max-w-[85%] mx-auto px-3 sm:px-4 py-6 md:py-16">
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-8 lg:gap-16 min-h-[80vh] items-center">
          
          <div className="flex flex-col items-center lg:items-start justify-center h-full">
            <div className="w-full max-w-lg relative">
              
              <div className="relative transition-colors duration-500">
                <Search 
                  className="absolute left-4 top-1/2 -translate-y-1/2 text-gray-theme transition-colors duration-500"
                  size={20}
                />
                <input
                  type="text"
                  placeholder="Digite o nome do município..."
                  className="w-full h-16 rounded-full pl-12 pr-6 focus:outline-none focus:ring-2 focus:ring-primary text-lg bg-card border border-theme text-text transition-colors duration-500"
                  value={searchTerm}
                  onChange={(e) => {
                    setSearchTerm(e.target.value);
                    setShowSuggestions(true);
                    setShowEscolas(false);
                  }}
                  onFocus={() => setShowSuggestions(true)}
                  onBlur={() => setTimeout(() => setShowSuggestions(false), 200)}
                />
              </div>

              <div className="flex items-center gap-3 mt-6 transition-colors duration-500">
                <div className="bg-primary text-white px-5 py-2 rounded-full text-base font-medium flex items-center gap-2 transition-colors duration-500">
                  {nomeEstado}
                  <button
                    onClick={() => router.push('/mapa')}
                    className="text-white hover:bg-white/20 transition-colors duration-200 w-5 h-5 flex items-center justify-center rounded-full"
                  >
                    <X size={14} />
                  </button>
                </div>
                {municipioSelecionado && (
                  <div className="bg-primary text-white px-5 py-2 rounded-full text-base font-medium flex items-center gap-2 transition-colors duration-500">
                    {municipioSelecionado}
                    <button
                      onClick={() => {
                        setMunicipioSelecionado(null);
                        setShowEscolas(false);
                      }}
                      className="text-white hover:bg-white/20 transition-colors duration-200 w-5 h-5 flex items-center justify-center rounded-full"
                    >
                      <X size={14} />
                    </button>
                  </div>
                )}
              </div>

              {showSuggestions && (
                <div className="absolute top-full left-0 right-0 mt-2 max-h-60 overflow-y-auto z-50 shadow-theme bg-card border border-theme rounded-lg transition-colors duration-500">
                  {municipiosFiltrados.length > 0 ? (
                    municipiosFiltrados.map((municipio, index) => (
                      <button
                        key={index}
                        className="w-full text-left px-4 py-3 border-b border-theme last:border-b-0 hover:bg-card-alt text-text transition-colors duration-500"
                        onClick={() => {
                          handleMunicipioClick(municipio);
                          setShowSuggestions(false);
                          setSearchTerm('');
                        }}
                      >
                        <div className="flex justify-between items-center">
                          <span className="transition-colors duration-500">{municipio}</span>
                          <span className="text-xs text-gray-theme">Ver escolas →</span>
                        </div>
                      </button>
                    ))
                  ) : (
                    <div className="px-4 py-3 text-center text-gray-theme transition-colors duration-500">
                      Nenhum município encontrado
                    </div>
                  )}
                </div>
              )}

              {showEscolas && (
                <div className="mt-6 bg-card rounded-xl p-4 border border-theme animate-fade-in">
                  <div className="flex items-center gap-3 mb-4">
                    <School className="text-primary" size={24} />
                    <div>
                      <h3 className="font-semibold text-lg">Escolas em {municipioSelecionado}</h3>
                      <p className="text-sm text-gray-theme">{escolasDoMunicipio.length} escolas encontradas</p>
                    </div>
                  </div>
                  
                  {loadingEscolas ? (
                    <div className="text-center py-4 text-gray-theme">Carregando escolas...</div>
                  ) : (
                    <div className="space-y-3 max-h-60 overflow-y-auto">
                      {escolasDoMunicipio.map((escola) => (
                        <button
                          key={escola.id}
                          onClick={() => handleEscolaClick(escola.codigo_inep)}
                          className="w-full text-left p-3 border border-theme rounded-lg hover:bg-card-alt transition-colors duration-200 group"
                        >
                          <div className="flex justify-between items-start">
                            <div className="font-medium text-text group-hover:text-primary transition-colors">
                              {escola.nome}
                            </div>
                            <span className={`px-2 py-1 rounded text-xs ${
                              escola.tipo === 'Estadual' ? 'bg-blue-100 text-blue-800' :
                              escola.tipo === 'Municipal' ? 'bg-green-100 text-green-800' :
                              'bg-purple-100 text-purple-800'
                            }`}>
                              {escola.tipo}
                            </span>
                          </div>
                          <div className="text-xs text-gray-theme mt-1">
                            Código INEP: {escola.codigo_inep}
                          </div>
                        </button>
                      ))}
                    </div>
                  )}
                </div>
              )}

            </div>
          </div>

          <div className="flex items-center justify-end h-full w-full transition-colors duration-500">
            <div className="relative h-full min-h-[85vh] w-[150%] -mr-56">
              <svg 
                ref={svgRef}
                className="transition-opacity duration-300"
              />
            </div>
          </div>

        </div>
      </div>
    </main>
  );
}
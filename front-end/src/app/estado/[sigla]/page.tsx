'use client';
import { useState, useEffect, use, useRef, useMemo } from 'react';
import { Search, X } from 'lucide-react';
import * as d3 from 'd3';
import { useRouter } from 'next/navigation';

interface PageProps {
  params: Promise<{ sigla: string }>;
}

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

const geoDataCache = new Map();

function useDebounce<T>(value: T, delay: number): T {
  const [debouncedValue, setDebouncedValue] = useState<T>(value);

  useEffect(() => {
    const timer = setTimeout(() => {
      setDebouncedValue(value);
    }, delay);

    return () => {
      clearTimeout(timer);
    };
  }, [value, delay]);

  return debouncedValue;
}

function useWindowSize() {
  const [windowSize, setWindowSize] = useState({
    width: typeof window !== 'undefined' ? window.innerWidth : 1200,
    height: typeof window !== 'undefined' ? window.innerHeight : 800,
  });

  useEffect(() => {
    const handleResize = () => {
      setWindowSize({
        width: window.innerWidth,
        height: window.innerHeight,
      });
    };

    window.addEventListener('resize', handleResize);
    return () => window.removeEventListener('resize', handleResize);
  }, []);

  return windowSize;
}

export default function PaginaEstado({ params }: PageProps) {
  const { sigla } = use(params);
  const router = useRouter();
  const [geoData, setGeoData] = useState<MunicipioData | null>(null);
  const [loading, setLoading] = useState(true);
  const [searchTerm, setSearchTerm] = useState('');
  const [showSuggestions, setShowSuggestions] = useState(false);
  const [todosMunicipios, setTodosMunicipios] = useState<string[]>([]);
  const [mapError, setMapError] = useState(false);
  const svgRef = useRef<SVGSVGElement>(null);

  const { width: windowWidth } = useWindowSize();
  const isMobile = windowWidth < 768;
  const isTablet = windowWidth >= 768 && windowWidth < 1024;

  const debouncedSearchTerm = useDebounce(searchTerm, 300);

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
          'mg': ["Belo Horizonte", "Uberlândia", "Contagem", "Juiz de Fora"],
          'am': ["Manaus", "Parintins", "Itacoatiara", "Manacapuru", "Coari"]
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
    if (!debouncedSearchTerm.trim()) {
      return todosMunicipios;
    }
    return todosMunicipios.filter(municipio =>
      municipio.toLowerCase().includes(debouncedSearchTerm.toLowerCase())
    );
  }, [debouncedSearchTerm, todosMunicipios]);

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
        const cacheKey = sigla.toLowerCase();
        
        if (geoDataCache.has(cacheKey)) {
          setGeoData(geoDataCache.get(cacheKey));
          setMapError(false);
          return;
        }

        const codigo = getCodigoEstado(sigla);
        const url = `/geojson/counties/counties-${sigla.toLowerCase()}-${codigo}.json`;
        
        console.log('Carregando GeoJSON de:', url);
        const response = await fetch(url);
        if (!response.ok) throw new Error(`Erro ${response.status}`);
        
        const data = await response.json();
        console.log('Dados carregados:', data.features.length, 'municípios');
        
        geoDataCache.set(cacheKey, data);
        setGeoData(data);
        setMapError(false);
      } catch (err) {
        console.error('Erro ao carregar mapa:', err);
        setMapError(true);
      } finally {
        setLoading(false);
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
  }, [geoData, windowWidth]);

  function desenharMapa() {
    if (!geoData || !svgRef.current) return;

    const svg = d3.select(svgRef.current);
    svg.selectAll("*").remove();

    // Dimensões responsivas sem quebrar o mapa
    const width = isMobile ? Math.min(windowWidth - 40, 400) : 
                  isTablet ? 600 : 
                  800;
    
    const height = isMobile ? 350 : 
                   isTablet ? 450 : 
                   600;

    svg.attr('width', width)
       .attr('height', height);

    const isDark = document.documentElement.getAttribute('data-theme') === 'dark';

    // Mantém a mesma lógica de projeção que estava funcionando
    const projection = d3.geoMercator()
      .center(getCentroEstado(sigla))
      .scale(getEscalaEstadoResponsiva(sigla))
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
      .attr('stroke-width', isMobile ? 0.2 : 0.3)
      .style('transition', 'all 500ms ease-in-out')
      .on('mouseover', function(event, d: any) {
        if (!isMobile) {
          d3.select(this)
            .attr('fill', hoverColor)
            .attr('stroke-width', isMobile ? 0.5 : 1);
        }
      })
      .on('mouseout', function(event, d: any) {
        if (!isMobile) {
          d3.select(this)
            .attr('fill', fillColor)
            .attr('stroke-width', isMobile ? 0.2 : 0.3);
        }
      })
      .on('click', function(event, d: any) {
        if (d.properties.nome) {
          redirecionarParaMunicipio(d.properties.nome);
        }
      });

    // Sistema de fallback seguro
    setTimeout(() => {
      const bbox = (svg.node() as SVGSVGElement).getBBox();
      if (bbox.width === 0 || bbox.height === 0) {
        console.log('Mapa vazio, ajustando projeção...');
        ajustarProjecaoAlternativa(sigla, svg, geoData, width, height);
      }
    }, 100);
  }

  function ajustarProjecaoAlternativa(sigla: string, svg: any, geoData: MunicipioData, width: number, height: number) {
    const centroAlternativo = getCentroEstadoAlternativo(sigla);
    const escalaAlternativa = getEscalaEstadoAlternativa(sigla);
    
    const projection = d3.geoMercator()
      .center(centroAlternativo)
      .scale(escalaAlternativa)
      .translate([width / 2, height / 2]);

    const path = d3.geoPath().projection(projection);

    svg.selectAll('path.municipio')
      .attr('d', (d: any) => path(d));
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
      'sp': [-48.0, -22.5], 'rj': [-42.5, -22.0], 'mg': [-44.5, -18.5],
      'ba': [-41.5, -12.5], 'pr': [-51.0, -24.5], 'rs': [-53.0, -30.0],
      'sc': [-50.5, -27.0], 'go': [-49.0, -15.0], 'mt': [-55.0, -13.0],
      'ms': [-54.5, -20.0], 'es': [-40.5, -19.5], 'pe': [-38.0, -8.5],
      'ce': [-39.5, -5.5], 'pa': [-52.0, -3.0], 'ma': [-45.0, -4.0],
      'pi': [-42.5, -8.0], 'rn': [-36.5, -5.5], 'pb': [-36.5, -7.0],
      'se': [-37.5, -10.5], 'al': [-36.5, -9.5], 'to': [-48.0, -9.0],
      'ro': [-63.5, -11.0], 'ac': [-70.5, -9.0], 'rr': [-61.5, 2.5],
      'ap': [-51.5, 1.5], 'df': [-47.5, -15.5], 'am': [-63.0, -4.0]
    };
    return centros[sigla.toLowerCase()] || [-47.5, -15.5];
  }

  function getCentroEstadoAlternativo(sigla: string): [number, number] {
    const centrosAlternativos: { [key: string]: [number, number] } = {
      'am': [-60.0, -5.0], 'pa': [-52.0, -5.0], 'mt': [-55.0, -12.0], 'ro': [-62.5, -11.0],
    };
    return centrosAlternativos[sigla.toLowerCase()] || getCentroEstado(sigla);
  }

  function getEscalaEstadoResponsiva(sigla: string): number {
    const escalasBase: { [key: string]: number } = {
      'sp': 6000, 'rj': 11000, 'mg': 5000, 'ba': 3800, 'pr': 6000, 'rs': 4000,
      'sc': 7500, 'go': 5200, 'mt': 3000, 'ms': 4700, 'es': 9500, 'pe': 6000,
      'ce': 5800, 'pa': 2500, 'ma': 4000, 'pi': 4000, 'rn': 6900, 'pb': 6900,
      'se': 8000, 'al': 8000, 'to': 4000, 'ro': 4000, 'ac': 4700, 'rr': 4700,
      'ap': 5800, 'df': 15000, 'am': 2200
    };
    
    const escalaBase = escalasBase[sigla.toLowerCase()] || 5000;
    
    // Ajuste responsivo simples e seguro
    if (isMobile) return escalaBase * 0.7;
    if (isTablet) return escalaBase * 0.9;
    return escalaBase;
  }

  function getEscalaEstadoAlternativa(sigla: string): number {
    const escalasAlternativas: { [key: string]: number } = {
      'am': 2000, 'pa': 2000, 'mt': 2500,
    };
    const escalaAlt = escalasAlternativas[sigla.toLowerCase()] || getEscalaEstadoResponsiva(sigla);
    
    // Aplica o mesmo ajuste responsivo
    if (isMobile) return escalaAlt * 0.7;
    if (isTablet) return escalaAlt * 0.9;
    return escalaAlt;
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
      <div className="max-w-[95%] sm:max-w-[90%] md:max-w-[85%] mx-auto px-4 sm:px-6 py-8 md:py-12 transition-colors duration-500">
        
        {/* Layout Responsivo com Espaçamento Adequado */}
        <div className={`flex flex-col ${isMobile ? 'gap-12' : 'lg:grid lg:grid-cols-2 lg:gap-16 xl:gap-20'} min-h-[70vh] items-center justify-center transition-colors duration-500`}>
          
          {/* Seção de Pesquisa - Sempre visível */}
          <div className={`flex flex-col items-center ${isMobile ? 'w-full' : 'lg:items-start justify-center'} h-full transition-colors duration-500`}>
            <div className="w-full max-w-lg relative">
              
              {/* Barra de Pesquisa */}
              <div className="relative transition-colors duration-500">
                <Search 
                  className="absolute left-4 top-1/2 -translate-y-1/2 text-gray-theme transition-colors duration-500"
                  size={20}
                />
                <input
                  type="text"
                  placeholder="Digite o nome do município..."
                  className="w-full h-14 sm:h-16 rounded-full pl-12 pr-6 focus:outline-none focus:ring-2 focus:ring-primary text-base sm:text-lg bg-card border border-theme text-text transition-colors duration-500"
                  value={searchTerm}
                  onChange={(e) => {
                    setSearchTerm(e.target.value);
                    setShowSuggestions(true);
                  }}
                  onFocus={() => setShowSuggestions(true)}
                  onBlur={() => setTimeout(() => setShowSuggestions(false), 200)}
                />
              </div>

              {/* Badge do Estado */}
              <div className="flex items-center gap-3 mt-6 transition-colors duration-500">
                <div className="bg-primary text-white px-5 py-2 rounded-full text-base font-medium flex items-center gap-2 transition-colors duration-500">
                  {nomeEstado}
                  <button
                    onClick={() => router.push('/mapa')}
                    className="text-white hover:bg-white/20 transition-colors duration-500 w-5 h-5 flex items-center justify-center rounded-full"
                  >
                    <X size={14} />
                  </button>
                </div>
              </div>

              {/* Sugestões de Pesquisa */}
              {showSuggestions && (
                <div className="absolute top-full left-0 right-0 mt-2 max-h-60 overflow-y-auto z-50 shadow-lg bg-card border border-theme rounded-lg transition-colors duration-500">
                  {municipiosFiltrados.length > 0 ? (
                    municipiosFiltrados.map((municipio, index) => (
                      <button
                        key={index}
                        className="w-full text-left px-4 py-3 border-b border-theme last:border-b-0 hover:bg-card-alt text-text text-sm sm:text-base transition-colors duration-500"
                        onClick={() => {
                          redirecionarParaMunicipio(municipio);
                          setShowSuggestions(false);
                          setSearchTerm('');
                        }}
                      >
                        {municipio}
                      </button>
                    ))
                  ) : (
                    <div className="px-4 py-3 text-center text-gray-theme text-sm sm:text-base transition-colors duration-500">
                      Nenhum município encontrado
                    </div>
                  )}
                </div>
              )}

            </div>
          </div>

          {/* Seção do Mapa - Centralizada e com Espaçamento */}
          <div className={`flex items-center justify-center ${isMobile ? 'w-full mt-8' : 'lg:justify-end'} h-full w-full transition-colors duration-500`}>
            <div className={`relative ${isMobile ? 'w-full h-80' : isTablet ? 'w-full h-96' : 'w-full h-[500px]'} transition-colors duration-500 flex items-center justify-center`}>
              {mapError ? (
                <div className="flex items-center justify-center h-full bg-card border border-theme rounded-lg p-6 sm:p-8 transition-colors duration-500 w-full">
                  <div className="text-center">
                    <p className="text-lg mb-2 transition-colors duration-500">🗺️ Mapa temporariamente indisponível</p>
                    <p className="text-gray-theme text-sm transition-colors duration-500">
                      Não foi possível carregar o mapa de {nomeEstado}
                    </p>
                  </div>
                </div>
              ) : (
                <svg 
                  ref={svgRef}
                  className="w-full h-full transition-all duration-500"
                />
              )}
            </div>
          </div>

        </div>
      </div>
    </main>
  );
}
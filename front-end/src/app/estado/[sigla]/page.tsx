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
    width: 1200,
    height: 800,
  });

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
  const containerRef = useRef<HTMLDivElement>(null);

  const { width: windowWidth, height: windowHeight } = useWindowSize();
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
        
        const response = await fetch(url);
        if (!response.ok) throw new Error(`Erro ${response.status}`);
        
        const data = await response.json();
        
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
    if (geoData && svgRef.current && containerRef.current) {
      desenharMapa();
    }
  }, [geoData, windowWidth, windowHeight]);

  function desenharMapa() {
    if (!geoData || !svgRef.current || !containerRef.current) return;

    const svg = d3.select(svgRef.current);
    svg.selectAll("*").remove();

    const container = containerRef.current;
    const containerWidth = container.clientWidth;
    const containerHeight = container.clientHeight;

    const width = isMobile ? Math.min(containerWidth, 350) : 
                  isTablet ? Math.min(containerWidth, 500) : 
                  Math.min(containerWidth, 650);
    
    const height = isMobile ? Math.min(containerHeight, 320) : 
                   isTablet ? Math.min(containerHeight, 420) : 
                   Math.min(containerHeight, 520);

    svg.attr('width', width)
       .attr('height', height)
       .attr('viewBox', `0 0 ${width} ${height}`)
       .attr('preserveAspectRatio', 'xMidYMid meet');

    const isDark = document.documentElement.getAttribute('data-theme') === 'dark';

    const projection = d3.geoMercator()
      .center(getCentroEstado(sigla))
      .scale(getEscalaEstado(sigla, width, height))
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
      .attr('stroke-width', isMobile ? 0.15 : 0.25)
      .on('mouseover', function(event, d: any) {
        if (!isMobile) {
          d3.select(this)
            .attr('fill', hoverColor)
            .attr('stroke-width', isMobile ? 0.3 : 0.5);
        }
      })
      .on('mouseout', function(event, d: any) {
        if (!isMobile) {
          d3.select(this)
            .attr('fill', fillColor)
            .attr('stroke-width', isMobile ? 0.15 : 0.25);
        }
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
      'ac': [-70.5, -9.0], 
      'al': [-36.3, -9.3],
      'ap': [-51.5, 1.5], 
      'am': [-65.0, -4.0],
      'ba': [-41.5, -12.5], 
      'ce': [-39.5, -5.5], 
      'df': [-47.5, -15.8],
      'es': [-40.5, -19.5],
      'go': [-48.5, -15.2],
      'ma': [-45.0, -4.0], 
      'mt': [-55.0, -13.0], 
      'ms': [-54.5, -20.0],
      'mg': [-45.0, -18.0],
      'pa': [-50.0, -4.5], 
      'pb': [-36.5, -7.0], 
      'pr': [-50.0, -24.0],
      'pe': [-38.0, -8.5], 
      'pi': [-42.5, -8.0], 
      'rj': [-41.8, -22.0],
      'rn': [-36.3, -5.3],
      'rs': [-53.0, -30.0], 
      'ro': [-63.5, -11.0], 
      'rr': [-61.5, 2.5], 
      'sc': [-50.0, -27.0],
      'se': [-37.5, -10.5], 
      'sp': [-48.0, -22.5], 
      'to': [-47.5, -9.5]
    };
    return centros[sigla.toLowerCase()] || [-47.5, -15.5];
  }

  function getEscalaEstado(sigla: string, width: number, height: number): number {
    const escalasBase: { [key: string]: number } = {
      'ac': 4000, 
      'al': 9400,
      'am': 1600,
      'ap': 5000, 
      'ba': 3300,
      'ce': 5000, 
      'df': 16000,
      'es': 8500, 
      'go': 3800,
      'ma': 3400, 
      'mg': 2950,
      'ms': 4200, 
      'mt': 2600, 
      'pa': 1900, 
      'pb': 7000,
      'pe': 5200, 
      'pi': 3400, 
      'pr': 3800,
      'rj': 5800,
      'rn': 6500,
      'ro': 3400, 
      'rr': 4000, 
      'rs': 3600, 
      'sc': 4200,
      'se': 10000, 
      'sp': 5400, 
      'to': 3600
    };
    
    let escalaBase = escalasBase[sigla.toLowerCase()] || 4700;
    
    if (isMobile) escalaBase *= 0.6;
    else if (isTablet) escalaBase *= 0.8;
    
    const fatorTamanho = Math.min(width, height) / 500;
    escalaBase *= Math.max(0.6, Math.min(fatorTamanho, 1.1));
    
    return escalaBase;
  }

  if (loading) {
    return (
      <div className="min-h-screen bg-background text-text flex items-center justify-center transition-colors duration-500">
        <div className="text-xl">Carregando {nomeEstado}...</div>
      </div>
    );
  }

  return (
    <main className="min-h-screen bg-background text-text transition-all duration-500 overflow-x-hidden">
      <div className="max-w-[95%] sm:max-w-[90%] md:max-w-[80%] mx-auto px-3 sm:px-4 py-6 md:py-16">
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-8 lg:gap-12 min-h-[70vh] items-center">
          
          <div className="flex flex-col items-center lg:items-start justify-center h-full">
            <div className="w-full max-w-md relative">
              
              <div className="relative">
                <Search 
                  className="absolute left-4 top-1/2 -translate-y-1/2 text-gray-theme transition-colors duration-500"
                  size={20}
                />
                <input
                  type="text"
                  placeholder="Digite o nome do município..."
                  className="w-full h-14 rounded-full pl-12 pr-6 focus:outline-none focus:ring-2 focus:ring-primary text-lg bg-card border border-theme text-text transition-all duration-500"
                  value={searchTerm}
                  onChange={(e) => {
                    setSearchTerm(e.target.value);
                    setShowSuggestions(true);
                  }}
                  onFocus={() => setShowSuggestions(true)}
                  onBlur={() => setTimeout(() => setShowSuggestions(false), 200)}
                  onKeyDown={(e) => {
                    if (e.key === 'Enter' && municipiosFiltrados.length > 0) {
                      redirecionarParaMunicipio(municipiosFiltrados[0]);
                    }
                  }}
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
              </div>

              {showSuggestions && (
                <div className="absolute top-full left-0 right-0 mt-2 max-h-60 overflow-y-auto z-50 shadow-theme bg-card border border-theme rounded-lg transition-all duration-500">
                  {municipiosFiltrados.length > 0 ? (
                    municipiosFiltrados.map((municipio, index) => (
                      <button
                        key={index}
                        className="w-full text-left px-4 py-3 border-b border-theme last:border-b-0 hover:bg-card-alt cursor-pointer transition-colors duration-500"
                        onClick={() => {
                          setSearchTerm(municipio);
                          setShowSuggestions(false);
                          redirecionarParaMunicipio(municipio);
                        }}
                      >
                        <div className="flex justify-between items-center">
                          <span className="text-text transition-colors duration-500">{municipio}</span>
                        </div>
                      </button>
                    ))
                  ) : (
                    <div className="px-4 py-3 text-center text-gray-theme transition-colors duration-500">
                      Nenhum município encontrado para "{searchTerm}"
                    </div>
                  )}
                </div>
              )}

            </div>
          </div>
          
          <div className={`flex items-center justify-center ${isMobile ? 'w-full order-2 mt-4' : 'lg:justify-end'} h-full w-full transition-colors duration-500`}>
            <div 
              ref={containerRef}
              className="relative w-full h-full flex items-center justify-center overflow-visible"
              style={{
                minHeight: isMobile ? '50vh' : '60vh',
                maxHeight: isMobile ? '50vh' : '70vh'
              }}
            >
              {mapError ? (
                <div className="flex items-center justify-center h-full bg-card border border-theme rounded-lg p-8 transition-colors duration-500 w-full">
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
                  className="w-full h-full transition-opacity duration-500"
                  style={{ 
                    maxWidth: '100%',
                    maxHeight: '100%'
                  }}
                />
              )}
            </div>
          </div>

        </div>
      </div>
    </main>
  );
}
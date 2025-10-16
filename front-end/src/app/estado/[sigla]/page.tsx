'use client';
import { useState, useEffect, use, useRef } from 'react';
import { Search, X } from 'lucide-react';
import * as d3 from 'd3';
import { useRouter } from 'next/navigation';

interface PageProps {
  params: Promise<{
    sigla: string;
  }>;
}

interface MunicipioData {
  type: string;
  features: Array<{
    type: string;
    properties: {
      codices: string;
      centroide: {
        lat: number;
        lon: number;
      };
    };
    geometry: any;
  }>;
}

export default function PaginaEstado({ params }: PageProps) {
  const { sigla } = use(params);
  const [geoData, setGeoData] = useState<MunicipioData | null>(null);
  const [loading, setLoading] = useState(true);
  const [searchTerm, setSearchTerm] = useState('');
  const [showSuggestions, setShowSuggestions] = useState(false);
  const [municipioSelecionado, setMunicipioSelecionado] = useState<string | null>(null);
  const svgRef = useRef<SVGSVGElement>(null);
  const router = useRouter();

  // Nome completo do estado em vez da sigla
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

  // Dados mockados de municípios baseado no estado
  const getMunicipiosPorEstado = (sigla: string) => {
    const municipios: { [key: string]: string[] } = {
      'sp': ["São Paulo", "Campinas", "Santos", "Ribeirão Preto", "Sorocaba", "São José dos Campos"],
      'rj': ["Rio de Janeiro", "Niterói", "Duque de Caxias", "São Gonçalo", "Nova Iguaçu"],
      'mg': ["Belo Horizonte", "Uberlândia", "Contagem", "Juiz de Fora", "Betim"],
      'ba': ["Salvador", "Feira de Santana", "Vitória da Conquista", "Camaçari", "Itabuna"],
      'go': ["Goiânia", "Aparecida de Goiânia", "Anápolis", "Rio Verde", "Luziânia"],
      'rr': ["Boa Vista", "Caracaraí", "Rorainópolis", "Alto Alegre", "Mucajaí"]
    };
    return municipios[sigla.toLowerCase()] || ["São Paulo", "Campinas", "Santos"];
  };

  const municipiosExemplo = getMunicipiosPorEstado(sigla);

  // Filtrar municípios baseado na pesquisa
  const municipiosFiltrados = municipiosExemplo.filter(municipio =>
    municipio.toLowerCase().includes(searchTerm.toLowerCase())
  );

  useEffect(() => {
    async function carregarMunicipios() {
      try {
        setLoading(true);
        
        const codigo = getCodigoEstado(sigla);
        const url = `https://raw.githubusercontent.com/filipemeneses/geojson-brazil/master/meshes/counties/counties-${sigla.toLowerCase()}-${codigo}.json`;
        
        const response = await fetch(url);
        
        if (!response.ok) {
          throw new Error(`Erro ${response.status}`);
        }
        
        const data = await response.json();
        setGeoData(data);
        
      } catch (err) {
        console.error('Erro ao carregar municípios:', err);
      } finally {
        setLoading(false);
      }
    }

    if (sigla) {
      carregarMunicipios();
    }
  }, [sigla]);

  // Efeito para desenhar o mapa quando os dados carregarem
  useEffect(() => {
    if (geoData && svgRef.current) {
      desenharMapa();
    }
  }, [geoData]);

  function desenharMapa() {
    if (!geoData || !svgRef.current) return;

    const svg = d3.select(svgRef.current);
    svg.selectAll("*").remove();

    const width = 900;
    const height = 700;
    
    svg.attr('width', width)
       .attr('height', height);

    // Detecta tema baseado no HTML
    const isDark = document.documentElement.getAttribute('data-theme') === 'dark';

    // Projeção para o estado
    const projection = d3.geoMercator()
      .center(getCentroEstado(sigla))
      .scale(getEscalaEstado(sigla))
      .translate([width / 2, height / 2]);

    const path = d3.geoPath().projection(projection);

    // Cores baseadas no tema
    const fillColor = '#2C80FF'; // Azul primário do seu tema
    const strokeColor = isDark ? '#1e40af' : '#1e40af';
    const hoverColor = '#ef4444';
    const bgColor = 'transparent';

    // Fundo transparente
    svg.append('rect')
      .attr('width', width)
      .attr('height', height)
      .attr('fill', bgColor);

    // Desenha os municípios
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
      'sp': [-48.5, -22.0],
      'rj': [-42.5, -22.0],
      'mg': [-44.5, -18.5],
      'ba': [-41.5, -12.5],
      'pr': [-51.0, -24.5],
      'rs': [-53.0, -30.0],
      'sc': [-50.5, -27.0],
      'go': [-49.0, -15.0],
      'mt': [-55.0, -13.0],
      'ms': [-54.5, -20.0],
      'es': [-40.5, -19.5],
      'pe': [-38.0, -8.5],
      'ce': [-39.5, -5.5],
      'pa': [-52.0, -3.0],
      'ma': [-45.0, -4.0],
      'pi': [-42.5, -8.0],
      'rn': [-36.5, -5.5],
      'pb': [-36.5, -7.0],
      'se': [-37.5, -10.5],
      'al': [-36.5, -9.5],
      'to': [-48.0, -9.0],
      'ro': [-63.5, -11.0],
      'ac': [-70.5, -9.0],
      'rr': [-61.5, 2.5],
      'ap': [-51.5, 1.5],
      'df': [-47.5, -15.5],
    };
    return centros[sigla.toLowerCase()] || [-47.5, -15.5];
  }

  function getEscalaEstado(sigla: string): number {
    const escalas: { [key: string]: number } = {
      'sp': 5500, 'rj': 9000, 'mg': 3800, 'ba': 2800,
      'pr': 5000, 'rs': 3200, 'sc': 6500, 'go': 4200,
      'mt': 2200, 'ms': 3800, 'es': 8000, 'pe': 5000,
      'ce': 4800, 'pa': 1800, 'ma': 3200, 'pi': 3200,
      'rn': 5800, 'pb': 5800, 'se': 6800, 'al': 6800,
      'to': 3200, 'ro': 3200, 'ac': 3800, 'rr': 3800,
      'ap': 4800, 'df': 12000,
    };
    return escalas[sigla.toLowerCase()] || 4000;
  }

  // Função para remover o estado selecionado e voltar para página anterior
  const removerEstado = () => {
    router.back(); // Volta para a página anterior
  };

  // Função para remover o município selecionado
  const removerMunicipio = () => {
    setMunicipioSelecionado(null);
    setSearchTerm('');
  };

  if (loading) {
    return (
      <div className="min-h-screen bg-background text-text flex items-center justify-center transition-colors duration-500">
        <div className="text-xl">Carregando {nomeEstado}...</div>
      </div>
    );
  }

  return (
    <main className="min-h-screen bg-background text-text transition-colors duration-500">
      
      {/* ========== CONTEÚDO PRINCIPAL ========== */}
      <div className="max-w-[95%] sm:max-w-[90%] md:max-w-[80%] mx-auto px-3 sm:px-4 py-6 md:py-16">
        
        {/* ========== GRID PRINCIPAL ========== */}
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-8 lg:gap-12 min-h-[70vh] items-center">
          
          {/* ========== LADO ESQUERDO - PESQUISA ========== */}
          <div className="flex flex-col items-center lg:items-start justify-center h-full">
            <div className="w-full max-w-md relative">
              
              {/* Barra de Pesquisa */}
              <div className="relative transition-colors duration-500">
                <Search 
                  className="absolute left-4 top-1/2 -translate-y-1/2 text-gray-theme transition-colors duration-500"
                  size={20}
                />
                
                <input
                  type="text"
                  placeholder="Digite o nome do município..."
                  className="w-full h-14 rounded-full pl-12 pr-6 focus:outline-none focus:ring-2 focus:ring-primary text-lg bg-card border border-theme text-text transition-colors duration-500"
                  value={searchTerm}
                  onChange={(e) => {
                    setSearchTerm(e.target.value);
                    setShowSuggestions(true);
                  }}
                  onFocus={() => setShowSuggestions(true)}
                  onBlur={() => setTimeout(() => setShowSuggestions(false), 200)}
                />
              </div>

              {/* Estado e Município selecionados EM CIMA - LADO A LADO */}
              <div className="flex flex-wrap items-center gap-3 mt-4 transition-colors duration-500">
                {/* Estado selecionado */}
                <div className="bg-primary text-white px-5 py-3 rounded-full text-base font-medium flex items-center gap-2 transition-colors duration-500">
                  {nomeEstado}
                  <button
                    onClick={removerEstado}
                    className="text-white hover:bg-white/20 transition-colors duration-200 w-5 h-5 flex items-center justify-center rounded-full ml-1"
                    title="Voltar para página anterior"
                  >
                    <X size={14} />
                  </button>
                </div>

                {/* Município selecionado */}
                {municipioSelecionado && (
                  <div className="bg-primary text-white px-5 py-3 rounded-full text-base font-medium flex items-center gap-2 transition-colors duration-500">
                    {municipioSelecionado}
                    <button
                      onClick={removerMunicipio}
                      className="text-white hover:bg-white/20 transition-colors duration-200 w-5 h-5 flex items-center justify-center rounded-full ml-1"
                      title="Remover município"
                    >
                      <X size={14} />
                    </button>
                  </div>
                )}
              </div>

              {/* Sugestões */}
              {showSuggestions && searchTerm && (
                <div className="absolute top-full left-0 right-0 mt-2 max-h-60 overflow-y-auto z-50 shadow-theme bg-card border border-theme rounded-lg transition-colors duration-500">
                  {municipiosFiltrados.length > 0 ? (
                    municipiosFiltrados.map((municipio, index) => (
                      <button
                        key={index}
                        className="w-full text-left px-4 py-3 border-b border-theme last:border-b-0 hover:bg-card-alt text-text transition-colors duration-500"
                        onClick={() => {
                          setMunicipioSelecionado(municipio);
                          setSearchTerm(municipio);
                          setShowSuggestions(false);
                        }}
                      >
                        <div className="flex justify-between items-center">
                          <span className="transition-colors duration-500">{municipio}</span>
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

              {/* Sugestões Populares - AGORA COM MUNICÍPIOS DO ESTADO ATUAL */}
              {!searchTerm && !municipioSelecionado && (
                <div className="mt-6 transition-colors duration-500">
                  <p className="text-sm mb-3 text-gray-theme transition-colors duration-500">
                    Sugestões populares:
                  </p>
                  <div className="space-y-2">
                    {municipiosExemplo.map((municipio, index) => (
                      <button
                        key={index}
                        className="w-full text-left px-4 py-3 rounded-lg border border-theme bg-card text-text hover:bg-card-alt transition-colors duration-500"
                        onClick={() => {
                          setMunicipioSelecionado(municipio);
                          setSearchTerm(municipio);
                        }}
                      >
                        {municipio}
                      </button>
                    ))}
                  </div>
                </div>
              )}
            </div>
          </div>

          {/* ========== LADO DIREITO - MAPA ========== */}
          <div className="flex items-center justify-end h-full w-full transition-colors duration-500">
            <div className="relative h-full min-h-[80vh] w-[140%] -mr-48">
              <svg 
                ref={svgRef}
                className="transition-opacity duration-300"
              ></svg>
            </div>
          </div>

        </div>
      </div>
    </main>
  );
}
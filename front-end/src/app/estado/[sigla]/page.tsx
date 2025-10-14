'use client';
import { useState, useEffect, use, useRef } from 'react';
import { Search } from 'lucide-react';
import * as d3 from 'd3';

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
  const [isDark, setIsDark] = useState(false);
  const svgRef = useRef<SVGSVGElement>(null);

  // Dados mockados de municípios (exemplo SP)
  const municipiosExemplo = [
    "São Paulo", "Adamantina", "Adolfo", "Aguaí", "Águas de Prata", 
    "Águas de Lindóia", "Água de São Pedro", "Agudos", "Alambari", 
    "Alfredo Marcondes", "Campinas"
  ];

  // Filtrar municípios baseado na pesquisa
  const municipiosFiltrados = municipiosExemplo.filter(municipio =>
    municipio.toLowerCase().includes(searchTerm.toLowerCase())
  );

  // Verificar tema atual
  useEffect(() => {
    const currentTheme = document.documentElement.getAttribute('data-theme');
    setIsDark(currentTheme === 'dark');
  }, []);

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
  }, [geoData, isDark]);

  function desenharMapa() {
    if (!geoData || !svgRef.current) return;

    const svg = d3.select(svgRef.current);
    svg.selectAll("*").remove();

    const width = 900;
    const height = 700;
    
    svg.attr('width', width)
       .attr('height', height);

    // Projeção para o estado
    const projection = d3.geoMercator()
      .center(getCentroEstado(sigla))
      .scale(getEscalaEstado(sigla))
      .translate([width / 2, height / 2]);

    const path = d3.geoPath().projection(projection);

    // Cores - Azul do Zaiá
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
      'sp': [-47.5, -22.5], 'rj': [-42.5, -22.0], 'mg': [-44.5, -18.5],
      'ba': [-41.5, -12.5], 'pr': [-51.0, -24.5], 'rs': [-53.0, -30.0],
    };
    return centros[sigla.toLowerCase()] || [-47.5, -22.5];
  }

  function getEscalaEstado(sigla: string): number {
    const escalas: { [key: string]: number } = {
      'sp': 6000, 'rj': 8000, 'mg': 4000, 'ba': 3000,
      'pr': 5000, 'rs': 3500, 'sc': 6000,
    };
    return escalas[sigla.toLowerCase()] || 5000;
  }

  if (loading) {
    return (
      <div className="min-h-screen bg-background text-text flex items-center justify-center">
        <div className="text-xl">Carregando {sigla.toUpperCase()}...</div>
      </div>
    );
  }

  return (
    <main className="min-h-screen transition-colors duration-300 bg-background text-text">
      
      {/* ========== CONTEÚDO PRINCIPAL - MESMA MARGEM DA PÁGINA INICIAL ========== */}
      <div className="max-w-[95%] sm:max-w-[90%] md:max-w-[80%] mx-auto px-3 sm:px-4 py-6 md:py-16">
        
        {/* ========== GRID PRINCIPAL - ALINHAMENTO NO MEIO ========== */}
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-8 lg:gap-12 min-h-[70vh] items-center">
          
          {/* ========== LADO ESQUERDO - PESQUISA NO MEIO ========== */}
          <div className="flex flex-col items-center lg:items-start justify-center h-full">
            <div className="w-full max-w-md relative">
              
              {/* Título */}
              <h1 className="text-2xl font-bold mb-6 text-text">
                {sigla.toUpperCase()}
              </h1>
              
              {/* Barra de Pesquisa */}
              <div className="relative">
                <Search 
                  className="absolute left-4 top-1/2 -translate-y-1/2 text-gray-theme"
                  size={20}
                />
                <input
                  type="text"
                  placeholder="Digite o nome do município..."
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

              {/* Sugestões */}
              {showSuggestions && searchTerm && (
                <div className="absolute top-full left-0 right-0 mt-2 max-h-60 overflow-y-auto z-50 shadow-theme bg-card border border-theme rounded-lg">
                  {municipiosFiltrados.length > 0 ? (
                    municipiosFiltrados.map((municipio, index) => (
                      <button
                        key={index}
                        className="w-full text-left px-4 py-3 transition-colors duration-300 border-b border-theme last:border-b-0 hover:bg-card-alt text-text"
                        onClick={() => {
                          setSearchTerm(municipio);
                          setShowSuggestions(false);
                        }}
                      >
                        {municipio}
                      </button>
                    ))
                  ) : (
                    <div className="px-4 py-3 text-center text-gray-theme">
                      Nenhum município encontrado
                    </div>
                  )}
                </div>
              )}

              {/* Lista de municípios quando não há pesquisa */}
              {!searchTerm && (
                <div className="mt-6 space-y-2">
                  {municipiosExemplo.map((municipio, index) => (
                    <div
                      key={index}
                      className="px-4 py-3 rounded-lg transition-colors duration-300 border border-theme bg-card text-text hover:bg-card-alt cursor-pointer"
                    >
                      {municipio}
                    </div>
                  ))}
                </div>
              )}
            </div>
          </div>

          {/* ========== LADO DIREITO - MAPA GRANDE SEM MARGEM DIREITA ========== */}
          <div className="flex items-center justify-end h-full w-full">
            <div className="relative h-full min-h-[80vh] w-[140%] -mr-48"> {/* Aumentei o width e a margem negativa */}
              {/* Mapa do Estado - GRANDE e saindo da margem */}
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
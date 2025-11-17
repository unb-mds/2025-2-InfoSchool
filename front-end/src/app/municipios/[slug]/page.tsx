'use client';
import { useState, useEffect, useRef, use } from 'react';
import { Search, X, School, MapPin, Phone } from 'lucide-react';
import { useRouter } from 'next/navigation';
import * as d3 from 'd3';

interface Escola {
  id: string;
  nome: string;
  endereco: string;
  telefone: string;
  tipo: string;
  nivel_ensino: string[];
}

const MunicipioService = {
  getSVGMunicipio: async (nome: string, sigla: string): Promise<string> => {
    try {
      const urlMunicipios = `https://servicodados.ibge.gov.br/api/v1/localidades/estados/${sigla}/municipios`;
      const responseMunicipios = await fetch(urlMunicipios);
      if (!responseMunicipios.ok) throw new Error('Falha ao buscar a lista de municípios.');
      const municipios = await responseMunicipios.json();
      
      const nomeSlugNormalizado = nome.normalize('NFD').replace(/[\u0300-\u036f]/g, '').toLowerCase();

      const municipioEncontrado = municipios.find((m: any) => {
          const nomeIBGENormalizado = m.nome
            .normalize('NFD')
            .replace(/[\u0300-\u036f]/g, '')
            .replace(/-/g, ' ')
            .toLowerCase();
          return nomeIBGENormalizado === nomeSlugNormalizado;
        }
      );

      if (!municipioEncontrado) throw new Error(`Município ${nome} não encontrado.`);
      
      const codigoMunicipio = municipioEncontrado.id;
      const urlSVG = `https://servicodados.ibge.gov.br/api/v3/malhas/municipios/${codigoMunicipio}?formato=image/svg+xml`;
      const responseSVG = await fetch(urlSVG);
      if (!responseSVG.ok) throw new Error('Falha ao buscar o mapa SVG.');
      
      return await responseSVG.text();
    } catch (error) {
      console.error("Erro em getSVGMunicipio:", error);
      return `<svg width="400" height="400" viewBox="0 0 100 100" xmlns="http://www.w3.org/2000/svg">
        <rect width="100" height="100" fill="#f0f0f0" stroke="#ccc"/>
        <text x="50" y="50" text-anchor="middle" dominant-baseline="middle" fill="#666" font-size="8">Mapa de ${nome}</text>
      </svg>`;
    }
  },

  getEscolasPorMunicipio: async (nome: string, sigla: string): Promise<Escola[]> => {
    return [
      { id: '1', nome: `Escola Estadual ${nome}`, endereco: `Rua Principal, 123 - Centro, ${nome}`, telefone: '(11) 9999-9999', tipo: 'Estadual', nivel_ensino: ['Fundamental', 'Médio'] },
      { id: '2', nome: `Colégio Municipal ${nome}`, endereco: `Av. Central, 456 - Centro, ${nome}`, telefone: '(11) 8888-8888', tipo: 'Municipal', nivel_ensino: ['Fundamental'] },
      { id: '3', nome: `Escola Particular ${nome}`, endereco: `Rua das Flores, 789 - Jardim, ${nome}`, telefone: '(11) 7777-7777', tipo: 'Privada', nivel_ensino: ['Fundamental', 'Médio'] },
    ];
  }
};

interface PageProps {
  params: Promise<{ slug: string }>;
}

export default function PaginaMunicipio({ params }: PageProps) {
  const { slug } = use(params);
  const router = useRouter();
  const [loading, setLoading] = useState(true);
  const [searchTerm, setSearchTerm] = useState('');
  const [escolas, setEscolas] = useState<Escola[]>([]);
  const [escolasFiltradas, setEscolasFiltradas] = useState<Escola[]>([]);
  const [svgMunicipio, setSvgMunicipio] = useState<string>('');
  const mapContainerRef = useRef<HTMLDivElement>(null);
  const [showSchoolSuggestions, setShowSchoolSuggestions] = useState(false);
  const [escolaSelecionada, setEscolaSelecionada] = useState<Escola | null>(null);
  const [windowSize, setWindowSize] = useState({
    width: 1200,
    height: 800,
  });

  // Detecta tamanho da tela
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

  const isMobile = windowSize.width < 768;
  const isTablet = windowSize.width >= 768 && windowSize.width < 1024;

  const extrairDadosDoSlug = (slug: string) => {
    if (!slug) {
      return { nomeMunicipio: 'Município', siglaEstado: 'SP' };
    }
    
    const partes = slug.split('-');
    const siglaEstado = partes[0]?.toUpperCase() || 'SP';
    const nomeMunicipio = partes
      .slice(1)
      .map(palavra => palavra.charAt(0).toUpperCase() + palavra.slice(1))
      .join(' ')
      .replace(/\bDe\b|\bDo\b|\bDa\b/g, match => match.toLowerCase());
    
    return { 
      nomeMunicipio: nomeMunicipio || 'Município', 
      siglaEstado: siglaEstado || 'SP' 
    };
  };
  
  const getNomeEstado = (sigla: string): string => {
    const estados: { [key: string]: string } = {
      'AC': 'Acre', 'AL': 'Alagoas', 'AP': 'Amapá', 'AM': 'Amazonas', 'BA': 'Bahia',
      'CE': 'Ceará', 'DF': 'Distrito Federal', 'ES': 'Espírito Santo', 'GO': 'Goiás', 
      'MA': 'Maranhão', 'MT': 'Mato Grosso', 'MS': 'Mato Grosso do Sul', 'MG': 'Minas Gerais',
      'PA': 'Pará', 'PB': 'Paraíba', 'PR': 'Paraná', 'PE': 'Pernambuco', 'PI': 'Piauí',
      'RJ': 'Rio de Janeiro', 'RN': 'Rio Grande do Norte', 'RS': 'Rio Grande do Sul', 
      'RO': 'Rondônia', 'RR': 'Roraima', 'SC': 'Santa Catarina', 'SP': 'São Paulo',
      'SE': 'Sergipe', 'TO': 'Tocantins'
    };
    return estados[sigla.toUpperCase()] || sigla;
  };

  const { nomeMunicipio, siglaEstado } = extrairDadosDoSlug(slug);
  const nomeEstadoCompleto = getNomeEstado(siglaEstado);

  // Carregar dados
  useEffect(() => {
    async function carregarDados() {
      try {
        setLoading(true);
        const [svgData, escolasData] = await Promise.all([
          MunicipioService.getSVGMunicipio(nomeMunicipio, siglaEstado),
          MunicipioService.getEscolasPorMunicipio(nomeMunicipio, siglaEstado)
        ]);
        
        // Limpeza conservadora do SVG
        const cleanedSvgData = svgData
          .replace(/<style[^>]*>[\s\S]*?<\/style>/gi, '')
          .replace(/fill="[^"]*"/g, '')
          .replace(/stroke="[^"]*"/g, '');

        setSvgMunicipio(cleanedSvgData);
        setEscolas(escolasData);
      } catch (err) {
        console.error('❌ Erro ao carregar dados:', err);
        setSvgMunicipio(`<svg width="400" height="400" viewBox="0 0 100 100" xmlns="http://www.w3.org/2000/svg">
          <rect width="100" height="100" fill="#f0f0f0" stroke="#ccc"/>
          <text x="50" y="50" text-anchor="middle" dominant-baseline="middle" fill="#666" font-size="8">${nomeMunicipio}</text>
        </svg>`);
      } finally {
        setLoading(false);
      }
    }

    if (nomeMunicipio && siglaEstado) {
      carregarDados();
    }
  }, [slug, nomeMunicipio, siglaEstado]);

  // Aplicar interatividade D3 ao SVG
  useEffect(() => {
    if (svgMunicipio && mapContainerRef.current) {
      const container = mapContainerRef.current;
      
      // Limpa o conteúdo anterior
      container.innerHTML = '';
      
      // Insere o SVG
      container.innerHTML = svgMunicipio;

      const svgElement = container.querySelector('svg');
      if (!svgElement) return;

      // Aplica estilos responsivos baseados no tamanho da tela
      if (isMobile) {
        svgElement.style.width = '100%';
        svgElement.style.height = '40vh';
      } else if (isTablet) {
        svgElement.style.width = '100%';
        svgElement.style.height = '50vh';
      } else {
        svgElement.style.width = '80%';
        svgElement.style.height = '80%';
        svgElement.style.maxHeight = '50vh';
        svgElement.style.marginLeft = 'auto';
        svgElement.style.marginRight = '0';
      }
      
      svgElement.style.display = 'block';

      const svg = d3.select(svgElement);

      const paths = svg.selectAll('path, polygon, rect');

      const fillColor = '#2C80FF';
      const strokeColor = '#1e40af';
      const hoverColor = '#ef4444';

      paths
        .style('fill', fillColor)
        .style('stroke', strokeColor)
        .style('stroke-width', '0.3')
        .style('cursor', 'pointer')
        .on('mouseover', function() {
          d3.select(this)
            .style('fill', hoverColor)
            .style('stroke-width', '1');
        })
        .on('mouseout', function() {
          d3.select(this)
            .style('fill', fillColor)
            .style('stroke-width', '0.3');
        });
    }
  }, [svgMunicipio, isMobile, isTablet]);

  // Filtrar escolas para a barra de sugestões
  useEffect(() => {
    const filtradas = searchTerm
      ? escolas.filter(escola =>
          escola.nome.toLowerCase().includes(searchTerm.toLowerCase())
        )
      : escolas;
    setEscolasFiltradas(filtradas);
  }, [searchTerm, escolas]);

  if (loading) {
    return (
      <div className="min-h-screen bg-background text-text flex items-center justify-center transition-colors duration-500">
        <div className="text-xl">Carregando {nomeMunicipio}...</div>
      </div>
    );
  }

  return (
    <main className="min-h-screen bg-background text-text transition-colors duration-500 overflow-x-hidden">
      <div className={`max-w-[95%] sm:max-w-[90%] md:max-w-[80%] mx-auto px-3 sm:px-4 ${
        isMobile ? 'py-4' : 'py-6 md:py-16'
      }`}>
        <div className={`flex flex-col ${
          isMobile ? 'gap-8' : 'lg:grid lg:grid-cols-2 lg:gap-12'
        } min-h-[70vh] items-center justify-center`}>
          
          {/* COLUNA DA ESQUERDA - EXATAMENTE IGUAL ÀS OUTRAS PÁGINAS */}
          <div className={`flex flex-col items-center ${
            isMobile ? 'w-full order-1' : 'lg:items-start justify-center'
          } h-full transition-colors duration-500`}>
            <div className="w-full max-w-md relative">
              
              {/* BARRA DE PESQUISA - MESMA ESTRUTURA DAS OUTRAS */}
              <div className="relative">
                <Search 
                  className="absolute left-4 top-1/2 -translate-y-1/2 text-gray-theme transition-colors duration-500"
                  size={20}
                />
                <input
                  type="text"
                  placeholder="Pesquisar escolas..."
                  className="w-full h-14 rounded-full pl-12 pr-6 focus:outline-none focus:ring-2 focus:ring-primary text-lg bg-card border border-theme text-text transition-all duration-500"
                  value={searchTerm}
                  onChange={(e) => {
                    setSearchTerm(e.target.value);
                    setShowSchoolSuggestions(true);
                  }}
                  onFocus={() => setShowSchoolSuggestions(true)}
                  onBlur={() => setTimeout(() => setShowSchoolSuggestions(false), 200)}
                  onKeyDown={(e) => {
                    if (e.key === 'Enter' && escolasFiltradas.length > 0) {
                      setEscolaSelecionada(escolasFiltradas[0]);
                      setSearchTerm(escolasFiltradas[0].nome);
                      setShowSchoolSuggestions(false);
                    }
                  }}
                />
              </div>

              {/* BADGES - MESMO ESPAÇAMENTO DAS OUTRAS PÁGINAS */}
              <div className="flex items-center gap-3 mt-6 transition-colors duration-500">
                <div className="bg-primary text-white px-5 py-2 rounded-full text-base font-medium flex items-center gap-2 transition-colors duration-500">
                  {nomeEstadoCompleto}
                  <button
                    onClick={() => router.push('/mapa')}
                    className="text-white hover:bg-white/20 transition-colors duration-200 w-5 h-5 flex items-center justify-center rounded-full"
                  >
                    <X size={14} />
                  </button>
                </div>
                <div className="bg-primary text-white px-5 py-2 rounded-full text-base font-medium flex items-center gap-2 transition-colors duration-500">
                  {nomeMunicipio}
                  <button
                    onClick={() => router.push(`/estado/${siglaEstado.toLowerCase()}`)}
                    className="text-white hover:bg-white/20 transition-colors duration-200 w-5 h-5 flex items-center justify-center rounded-full"
                  >
                    <X size={14} />
                  </button>
                </div>
              </div>

              {/* SUGESTÕES DE ESCOLAS */}
              {showSchoolSuggestions && (
                <div className="absolute top-full left-0 right-0 mt-2 max-h-60 overflow-y-auto z-50 shadow-theme bg-card border border-theme rounded-lg transition-all duration-500">
                  {escolasFiltradas.length > 0 ? (
                    escolasFiltradas.map((escola) => (
                      <button
                        key={escola.id}
                        className="w-full text-left px-4 py-3 border-b border-theme last:border-b-0 hover:bg-card-alt cursor-pointer transition-colors duration-500"
                        onClick={() => {
                          setEscolaSelecionada(escola);
                          setSearchTerm(escola.nome);
                          setShowSchoolSuggestions(false);
                        }}
                      >
                        <div className="flex justify-between items-center">
                          <span className="text-text transition-colors duration-500">{escola.nome}</span>
                          <span className="bg-primary/20 text-primary px-2 py-1 rounded text-sm transition-colors duration-500">
                            {escola.tipo}
                          </span>
                        </div>
                      </button>
                    ))
                  ) : (
                    <div className="px-4 py-3 text-center text-gray-theme transition-colors duration-500">
                      Nenhuma escola encontrada
                    </div>
                  )}
                </div>
              )}

              {/* ESCOLA SELECIONADA */}
              {escolaSelecionada && (
                <div className="mt-6 bg-card rounded-xl p-4 border border-theme animate-fade-in">
                  <div className="flex items-start gap-4">
                    <School className="text-primary mt-1 shrink-0" size={24} />
                    <div className="flex-1">
                      <h4 className="font-semibold text-lg mb-2">{escolaSelecionada.nome}</h4>
                      <div className="space-y-2 text-sm text-gray-theme">
                        <div className="flex items-center gap-2">
                          <MapPin size={14} />
                          <span>{escolaSelecionada.endereco}</span>
                        </div>
                        <div className="flex items-center gap-2">
                          <Phone size={14} />
                          <span>{escolaSelecionada.telefone}</span>
                        </div>
                        <div className="flex flex-wrap gap-2 mt-3">
                          <span className="bg-primary/20 text-primary px-2 py-1 rounded text-xs font-medium">
                            {escolaSelecionada.tipo}
                          </span>
                          {escolaSelecionada.nivel_ensino.map((nivel, index) => (
                            <span
                              key={index}
                              className="bg-card-alt text-text px-2 py-1 rounded text-xs border border-theme"
                            >
                              {nivel}
                            </span>
                          ))}
                        </div>
                      </div>
                      
                      {/* BOTÃO PARA DASHBOARD - COM CURSOR DE MÃO */}
                      <button 
                        className="w-full mt-4 bg-primary text-white py-3 px-4 rounded-lg hover:bg-primary/90 transition-colors duration-200 font-medium flex items-center justify-center gap-2 cursor-pointer"
                        onClick={() => {
                          const codigoINEP = escolaSelecionada.id.padStart(8, '0');
                          router.push(`/dashboard/${codigoINEP}`);
                        }}
                      >
                        <School size={16} />
                        Ver Dashboard da Escola
                      </button>
                    </div>
                  </div>
                </div>
              )}

            </div>
          </div>

          <div className={`flex items-center justify-center ${
            isMobile ? 'w-full order-2' : 'lg:justify-end'
          } h-full w-full transition-colors duration-500`}>
            <div className="relative w-full h-full flex items-center justify-center overflow-visible">
              <div 
                ref={mapContainerRef}
                className={`w-full h-full ${
                  isMobile ? 'min-h-[40vh]' : 
                  isTablet ? 'min-h-[50vh]' : 
                  'min-h-[60vh]'
                }`}
              />
            </div>
          </div>

        </div>
      </div>
    </main>
  );
}
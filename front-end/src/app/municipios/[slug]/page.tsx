// src/app/municipios/[slug]/page.tsx - LAYOUT IDÊNTICO À PÁGINA ESTADO
'use client';
import { useState, useEffect, use, useRef } from 'react';
import { Search, ArrowLeft, School, MapPin, Phone, X } from 'lucide-react';
import { useRouter } from 'next/navigation';
import * as d3 from 'd3';

// A interface 'Escola' define a estrutura de dados para cada escola.
interface Escola {
  id: string;
  nome: string;
  endereco: string;
  telefone: string;
  tipo: string;
  nivel_ensino: string[];
}

// O 'MunicipioService' foi movido para dentro do ficheiro para resolver o erro de importação.
// Este objeto simula a busca de dados de uma API externa.
const MunicipioService = {
  // Busca o mapa SVG de um município específico na API do IBGE.
  getSVGMunicipio: async (nome: string, sigla: string): Promise<string> => {
    try {
      const urlMunicipios = `https://servicodados.ibge.gov.br/api/v1/localidades/estados/${sigla}/municipios`;
      const responseMunicipios = await fetch(urlMunicipios);
      if (!responseMunicipios.ok) throw new Error('Falha ao buscar a lista de municípios.');
      const municipios = await responseMunicipios.json();
      
      const nomeSlugNormalizado = nome.normalize('NFD').replace(/[\u0300-\u036f]/g, '').toLowerCase();

      const municipioEncontrado = municipios.find((m: any) => {
          // Normaliza o nome do IBGE, removendo acentos e hífens para uma comparação mais robusta.
          const nomeIBGENormalizado = m.nome
            .normalize('NFD')
            .replace(/[\u0300-\u036f]/g, '')
            .replace(/-/g, ' ') // Substitui hífens por espaços
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
      return `<svg viewBox="0 0 100 100" xmlns="http://www.w3.org/2000/svg"><text x="10" y="50">Mapa indisponível</text></svg>`;
    }
  },
  // Retorna uma lista de exemplo de escolas, já que não há uma API pública para isso.
  getEscolasPorMunicipio: async (nome: string, sigla: string): Promise<Escola[]> => {
    console.log(`Buscando escolas para ${nome}, ${sigla}`);
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

  const extrairDadosDoSlug = (slug: string) => {
    const partes = slug.split('-');
    const siglaEstado = partes[0]?.toUpperCase() || '';
    const nomeMunicipio = partes
      .slice(1)
      .map(palavra => palavra.charAt(0).toUpperCase() + palavra.slice(1))
      .join(' ')
      .replace(/\bDe\b|\bDo\b|\bDa\b/g, match => match.toLowerCase());
    return { nomeMunicipio, siglaEstado };
  };
  
  // Função para obter o nome completo do estado a partir da sigla
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
        
        // Limpeza agressiva para remover todos os estilos que possam causar conflito.
        const cleanedSvgData = svgData
            .replace(/<style[^>]*>[\s\S]*?<\/style>/gi, '', ) // Remove blocos <style>
            .replace(/<defs>.*?<\/defs>/g, '') 
            .replace(/style="[^"]*"/g, '')    
            .replace(/fill="[^"]*"/g, '')      
            .replace(/stroke="[^"]*"/g, '');   

        setSvgMunicipio(cleanedSvgData);
        setEscolas(escolasData);
      } catch (err) {
        console.error('❌ Erro ao carregar dados:', err);
      } finally {
        setLoading(false);
      }
    }

    if (nomeMunicipio && siglaEstado) {
      carregarDados();
    }
  }, [slug, nomeMunicipio, siglaEstado]);

  // Efeito para aplicar interatividade D3 ao SVG quando ele for carregado
  useEffect(() => {
    if (svgMunicipio && mapContainerRef.current) {
        const container = mapContainerRef.current;
        
        // Limpa o conteúdo anterior para evitar duplicatas ou conflitos
        container.innerHTML = '';
        container.innerHTML = svgMunicipio;

        const svg = d3.select(container).select('svg');

        // Se não encontrar um SVG, não faz nada
        if (svg.empty()) return;

        const paths = svg.selectAll('path, polygon, rect');

        const fillColor = '#2C80FF';
        const hoverColor = '#ef4444';

        paths
            .style('fill', fillColor)
            .style('cursor', 'pointer')
            .on('mouseover', function() {
                d3.select(this)
                    .transition()
                    .duration(200)
                    .style('fill', hoverColor);
            })
            .on('mouseout', function() {
                d3.select(this)
                    .transition()
                    .duration(200)
                    .style('fill', fillColor);
            });
    }
  }, [svgMunicipio]);

  // Filtrar escolas para a barra de sugestões
  useEffect(() => {
    const filtradas = searchTerm
      ? escolas.filter(escola =>
          escola.nome.toLowerCase().includes(searchTerm.toLowerCase())
        )
      : escolas; // Mostra todas as escolas se a busca estiver vazia
    setEscolasFiltradas(filtradas);
  }, [searchTerm, escolas]);

  if (loading) {
    return (
      <div className="min-h-screen bg-background text-text flex items-center justify-center">
        <div className="text-xl">Carregando {nomeMunicipio}...</div>
      </div>
    );
  }

  return (
    <main className="min-h-screen bg-background text-text transition-colors duration-500">
      <style>{`
        .svg-map-container svg {
          width: 100%;
          height: auto;
          max-height: 80vh;
        }
        .svg-map-container path, .svg-map-container polygon, .svg-map-container rect {
          stroke: #1e40af;
          stroke-width: 1px;
        }
      `}</style>
      
      {/* ========== CONTEÚDO PRINCIPAL ========== */}
      <div className="max-w-[95%] sm:max-w-[90%] md:max-w-[85%] mx-auto px-3 sm:px-4 py-6 md:py-16">
        
        {/* ========== GRID PRINCIPAL ========== */}
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-8 lg:gap-16 min-h-[80vh] items-center">
          
          {/* ========== SEÇÃO DE BUSCA ========== */}
          <div className="flex flex-col items-center lg:items-start justify-center h-full">
            <div className="w-full max-w-lg relative">
              
              {/* ========== BARRA DE PESQUISA ========== */}
              <div className="relative transition-colors duration-500">
                <Search 
                  className="absolute left-4 top-1/2 -translate-y-1/2 text-gray-theme transition-colors duration-500"
                  size={20}
                />
                <input
                  type="text"
                  placeholder="Pesquisar escolas..."
                  className="w-full h-16 rounded-full pl-12 pr-6 focus:outline-none focus:ring-2 focus:ring-primary text-lg bg-card border border-theme text-text transition-colors duration-500"
                  value={searchTerm}
                  onChange={(e) => {
                    setSearchTerm(e.target.value);
                    setShowSchoolSuggestions(true);
                  }}
                  onFocus={() => setShowSchoolSuggestions(true)}
                  onBlur={() => setTimeout(() => setShowSchoolSuggestions(false), 200)}
                />
              </div>

              {/* ========== BADGES DO ESTADO E MUNICÍPIO ========== */}
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

              {/* ========== SUGESTÕES DE ESCOLAS ========== */}
              {showSchoolSuggestions && (
                <div className="absolute top-full left-0 right-0 mt-2 max-h-60 overflow-y-auto z-50 shadow-theme bg-card border border-theme rounded-lg transition-colors duration-500">
                  {escolasFiltradas.length > 0 ? (
                    escolasFiltradas.map((escola) => (
                      <button
                        key={escola.id}
                        className="w-full text-left px-4 py-3 border-b border-theme last:border-b-0 hover:bg-card-alt text-text transition-colors duration-500"
                        onClick={() => {
                          setEscolaSelecionada(escola);
                          setSearchTerm(escola.nome);
                          setShowSchoolSuggestions(false);
                        }}
                      >
                        <div className="flex justify-between items-center">
                          <span className="transition-colors duration-500">{escola.nome}</span>
                          <span className="bg-primary/20 text-primary px-2 py-1 rounded text-xs">
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

              {/* ========== ESCOLA SELECIONADA ========== */}
              {escolaSelecionada && (
                <div className="mt-6 bg-card rounded-xl p-4 border border-theme animate-fade-in">
                  <div className="flex items-start gap-4">
                    <School className="text-primary mt-1 flex-shrink-0" size={24} />
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
                    </div>
                  </div>
                </div>
              )}

            </div>
          </div>

          {/* ========== SEÇÃO DO MAPA ========== */}
          <div className="flex items-center justify-end h-full w-full transition-colors duration-500">
            <div className="relative h-full min-h-[85vh] w-[150%] -mr-56">
              {svgMunicipio ? (
                <div
                  ref={mapContainerRef}
                  className="w-full h-full svg-map-container"
                />
              ) : (
                <div className="h-96 flex flex-col items-center justify-center text-gray-theme bg-gray-100 dark:bg-gray-800 rounded-lg w-full">
                  <div className="text-center">
                    <School size={48} className="mx-auto mb-4 opacity-50" />
                    <p>Mapa não disponível</p>
                    <p className="text-sm mt-2">Município não encontrado na base do IBGE</p>
                  </div>
                </div>
              )}
            </div>
          </div>

        </div>
      </div>
    </main>
  );
}
'use client';
import { useState, useEffect, use, useRef } from 'react';
import { Search, X } from 'lucide-react';
import { useRouter } from 'next/navigation';
import * as d3 from 'd3';

interface PageProps {
  params: Promise<{
    slug: string;
  }>;
}

interface MunicipioData {
  type: string;
  features: Array<{
    type: string;
    properties: {
      codarea?: string;
      name?: string;
      nome?: string;
      NM_MUNICIP?: string;
      sigla?: string;
      CD_UF?: string;
      codigo?: string;
      NM_MUN?: string;
      nome_municip?: string;
    };
    geometry: any;
  }>;
}

export default function PaginaMunicipio({ params }: PageProps) {
  const { slug } = use(params);
  const [geoData, setGeoData] = useState<MunicipioData | null>(null);
  const [municipioData, setMunicipioData] = useState<MunicipioData | null>(null);
  const [loading, setLoading] = useState(true);
  const [searchTerm, setSearchTerm] = useState('');
  const [showSuggestions, setShowSuggestions] = useState(false);
  const [municipioSelecionado, setMunicipioSelecionado] = useState<string | null>(null);
  const svgRef = useRef<SVGSVGElement>(null);
  const router = useRouter();

  // Extrair sigla do slug
  const extrairSiglaDoSlug = (slug: string): string => {
    if (!slug) return 'sp';
    const partes = slug.split('-');
    return partes[partes.length - 1]?.toLowerCase() || 'sp';
  };

  // Extrair nome do município do slug
  const extrairNomeMunicipioDoSlug = (slug: string): string => {
    if (!slug) return 'São Paulo';
    const partes = slug.split('-');
    partes.pop(); // remove a sigla
    return partes.join(' ')
      .replace(/\b\w/g, l => l.toUpperCase())
      .replace(/\s+/g, ' ')
      .trim();
  };

  const sigla = extrairSiglaDoSlug(slug);
  const nomeMunicipioInicial = extrairNomeMunicipioDoSlug(slug);

  // Nome completo do estado
  const getNomeEstado = (siglaParam: string): string => {
    const estados: { [key: string]: string } = {
      'ac': 'Acre', 'al': 'Alagoas', 'ap': 'Amapá', 'am': 'Amazonas', 'ba': 'Bahia',
      'ce': 'Ceará', 'df': 'Distrito Federal', 'es': 'Espírito Santo', 'go': 'Goiás', 
      'ma': 'Maranhão', 'mt': 'Mato Grosso', 'ms': 'Mato Grosso do Sul', 'mg': 'Minas Gerais',
      'pa': 'Pará', 'pb': 'Paraíba', 'pr': 'Paraná', 'pe': 'Pernambuco', 'pi': 'Piauí',
      'rj': 'Rio de Janeiro', 'rn': 'Rio Grande do Norte', 'rs': 'Rio Grande do Sul', 
      'ro': 'Rondônia', 'rr': 'Roraima', 'sc': 'Santa Catarina', 'sp': 'São Paulo',
      'se': 'Sergipe', 'to': 'Tocantins'
    };
    return estados[siglaParam.toLowerCase()] || siglaParam.toUpperCase();
  };

  const nomeEstado = getNomeEstado(sigla);

  // Dados mockados de municípios baseado no estado
  const getMunicipiosPorEstado = (siglaParam: string) => {
    const municipios: { [key: string]: string[] } = {
      'sp': ["São Paulo", "Campinas", "Santos", "Ribeirão Preto", "Sorocaba", "São José dos Campos", "Guarulhos", "São Bernardo do Campo"],
      'rj': ["Rio de Janeiro", "Niterói", "Duque de Caxias", "São Gonçalo", "Nova Iguaçu", "Belford Roxo", "São João de Meriti"],
      'mg': ["Belo Horizonte", "Uberlândia", "Contagem", "Juiz de Fora", "Betim", "Montes Claros", "Ribeirão das Neves"],
      'ba': ["Salvador", "Feira de Santana", "Vitória da Conquista", "Camaçari", "Itabuna", "Juazeiro", "Lauro de Freitas"],
      'rs': ["Porto Alegre", "Caxias do Sul", "Pelotas", "Canoas", "Santa Maria", "Novo Hamburgo", "Viamão"],
      'pr': ["Curitiba", "Londrina", "Maringá", "Ponta Grossa", "Cascavel", "São José dos Pinhais", "Foz do Iguaçu"],
      'ce': ["Fortaleza", "Caucaia", "Juazeiro do Norte", "Maracanaú", "Sobral", "Crato", "Itapipoca"],
      'pe': ["Recife", "Jaboatão dos Guararapes", "Olinda", "Caruaru", "Petrolina", "Paulista", "Cabo de Santo Agostinho"],
      'am': ["Manaus", "Parintins", "Itacoatiara", "Manacapuru", "Coari", "Tefé", "Tabatinga"],
      'go': ["Goiânia", "Aparecida de Goiânia", "Anápolis", "Rio Verde", "Luziânia", "Águas Lindas de Goiás", "Valparaíso de Goiás"]
    };
    return municipios[siglaParam.toLowerCase()] || ["Capital", "Cidade 1", "Cidade 2"];
  };

  const municipiosExemplo = getMunicipiosPorEstado(sigla);

  // Filtrar municípios baseado na pesquisa
  const municipiosFiltrados = municipiosExemplo.filter(municipio =>
    municipio.toLowerCase().includes(searchTerm.toLowerCase())
  );

  // FUNÇÃO DE NAVEGAÇÃO
  const navegarParaMunicipio = (nomeMunicipio: string) => {
    const novoSlug = `${nomeMunicipio.toLowerCase().replace(/ /g, '-')}-${sigla.toLowerCase()}`;
    router.push(`/municipios/${novoSlug}`);
  };

  // Buscar dados GEO do estado (mesma fonte que funciona na página de estados)
  const buscarDadosEstado = async (siglaEstado: string) => {
    try {
      const codigo = getCodigoEstado(siglaEstado);
      const url = `https://raw.githubusercontent.com/filipemeneses/geojson-brazil/master/meshes/counties/counties-${siglaEstado.toLowerCase()}-${codigo}.json`;
      
      console.log('🗺️ Buscando dados do estado:', url);
      
      const response = await fetch(url);
      
      if (!response.ok) {
        throw new Error(`Erro ${response.status}`);
      }
      
      const data = await response.json();
      console.log('✅ Dados do estado carregados com sucesso');
      return data;
    } catch (error) {
      console.error('❌ Erro ao buscar dados do estado:', error);
      return null;
    }
  };

  // Função auxiliar para extrair nome do feature - CORRIGIDA
  const extrairNomeDoFeature = (feature: any): string => {
    if (!feature || !feature.properties) return 'Município';
    
    const props = feature.properties;
    
    // Tentar todas as propriedades possíveis de nome
    const propriedadesNome = [
      'name', 'nome', 'NM_MUNICIP', 'nm_municip', 'NM_MUN', 'nome_municip',
      'municipio', 'MUNICIPIO', 'município', 'MUNICÍPIO'
    ];
    
    for (const prop of propriedadesNome) {
      if (props[prop] && typeof props[prop] === 'string') {
        console.log(`📝 Nome encontrado na propriedade ${prop}:`, props[prop]);
        return props[prop];
      }
    }
    
    // Se não encontrou nome, tentar extrair do código de área
    if (props.codarea) {
      const codigo = props.codarea.toString();
      console.log('🔍 Código de área encontrado:', codigo);
      
      // Tentar buscar nome pelo código usando nossa lista de mapeamento
      const nomePorCodigo = getNomePorCodigo(codigo, sigla);
      if (nomePorCodigo) {
        return nomePorCodigo;
      }
      
      return `Município ${codigo.substring(2)}`;
    }
    
    console.log('❌ Nenhum nome encontrado, propriedades:', props);
    return 'Município';
  };

  // Mapeamento de códigos para nomes de municípios
  const getNomePorCodigo = (codigo: string, siglaEstado: string): string | null => {
    const mapeamento: { [key: string]: { [key: string]: string } } = {
      '35': { // SP
        '3550308': 'São Paulo', '3509502': 'Campinas', '3548500': 'Santos', 
        '3543402': 'Ribeirão Preto', '3552205': 'Sorocaba', '3549904': 'São José dos Campos',
        '3518800': 'Guarulhos', '3548708': 'São Bernardo do Campo'
      },
      '33': { // RJ
        '3304557': 'Rio de Janeiro', '3303302': 'Niterói', '3301702': 'Duque de Caxias',
        '3304904': 'São Gonçalo', '3303500': 'Nova Iguaçu', '3300456': 'Belford Roxo',
        '3305109': 'São João de Meriti'
      },
      '31': { // MG
        '3106200': 'Belo Horizonte', '3170206': 'Uberlândia', '3118601': 'Contagem',
        '3136702': 'Juiz de Fora', '3106705': 'Betim', '3143302': 'Montes Claros',
        '3154606': 'Ribeirão das Neves'
      },
      '29': { // BA
        '2927408': 'Salvador', '2910800': 'Feira de Santana', '2933307': 'Vitória da Conquista',
        '2905701': 'Camaçari', '2914802': 'Itabuna', '2918407': 'Juazeiro',
        '2919207': 'Lauro de Freitas'
      },
      '43': { // RS
        '4314902': 'Porto Alegre', '4305108': 'Caxias do Sul', '4314407': 'Pelotas',
        '4304606': 'Canoas', '4316907': 'Santa Maria', '4313409': 'Novo Hamburgo',
        '4323002': 'Viamão'
      }
    };
    
    const codigoEstado = getCodigoEstado(siglaEstado);
    return mapeamento[codigoEstado]?.[codigo] || null;
  };

  useEffect(() => {
    async function carregarMunicipio() {
      try {
        setLoading(true);
        
        console.log('📥 Iniciando carregamento do município:', nomeMunicipioInicial, 'do estado:', sigla);

        // ✅ BUSCAR DADOS DO ESTADO (mesma fonte que funciona)
        const dadosEstado = await buscarDadosEstado(sigla);
        
        if (dadosEstado) {
          setGeoData(dadosEstado);
          console.log('📊 Dados completos do estado carregados, features:', dadosEstado.features?.length);

          // ✅ DEBUG: Mostrar todos os nomes disponíveis
          console.log('🔍 Nomes disponíveis nos features:');
          dadosEstado.features.slice(0, 5).forEach((feature: any, index: number) => {
            const nome = extrairNomeDoFeature(feature);
            console.log(`  ${index + 1}. ${nome} - Props:`, feature.properties);
          });

          // ✅ PROCURAR O MUNICÍPIO ESPECÍFICO NOS DADOS
          let municipioEncontrado = null;

          // Tentativa 1: Buscar por nome exato
          municipioEncontrado = dadosEstado.features.find((feature: any) => {
            const nomeFeature = extrairNomeDoFeature(feature);
            return normalizarParaBusca(nomeFeature) === normalizarParaBusca(nomeMunicipioInicial);
          });

          // Tentativa 2: Buscar por nome parcial (caso haja diferenças)
          if (!municipioEncontrado) {
            municipioEncontrado = dadosEstado.features.find((feature: any) => {
              const nomeFeature = extrairNomeDoFeature(feature);
              return normalizarParaBusca(nomeFeature).includes(normalizarParaBusca(nomeMunicipioInicial)) ||
                     normalizarParaBusca(nomeMunicipioInicial).includes(normalizarParaBusca(nomeFeature));
            });
          }

          // Tentativa 3: Buscar por similaridade (primeiras letras)
          if (!municipioEncontrado) {
            municipioEncontrado = dadosEstado.features.find((feature: any) => {
              const nomeFeature = extrairNomeDoFeature(feature);
              return normalizarParaBusca(nomeFeature).startsWith(normalizarParaBusca(nomeMunicipioInicial).substring(0, 5)) ||
                     normalizarParaBusca(nomeMunicipioInicial).startsWith(normalizarParaBusca(nomeFeature).substring(0, 5));
            });
          }

          if (municipioEncontrado) {
            const nomeEncontrado = extrairNomeDoFeature(municipioEncontrado);
            console.log('🎯 Município encontrado:', nomeEncontrado);
            
            // Criar FeatureCollection apenas com o município específico
            const municipioDataEspecifico = {
              type: "FeatureCollection",
              features: [municipioEncontrado]
            };
            
            setMunicipioData(municipioDataEspecifico);
            setMunicipioSelecionado(nomeEncontrado);
            setSearchTerm(nomeEncontrado);
            
            console.log('✅ Município específico preparado para o SVG');
          } else {
            console.log('⚠️ Município não encontrado, usando primeiro da lista');
            // Usar o primeiro município do estado como fallback
            const primeiroMunicipio = dadosEstado.features[0];
            if (primeiroMunicipio) {
              const nomePrimeiro = extrairNomeDoFeature(primeiroMunicipio);
              setMunicipioData({
                type: "FeatureCollection",
                features: [primeiroMunicipio]
              });
              setMunicipioSelecionado(nomePrimeiro);
              setSearchTerm(nomePrimeiro);
              console.log('🔄 Usando município:', nomePrimeiro);
            }
          }
        } else {
          // Fallback para dados mockados detalhados
          console.log('🔄 Usando dados mockados detalhados');
          const geoDataMock = criarGeoDataMunicipioDetalhado(sigla, nomeMunicipioInicial);
          setMunicipioData(geoDataMock);
          setMunicipioSelecionado(nomeMunicipioInicial);
          setSearchTerm(nomeMunicipioInicial);
        }
        
      } catch (err) {
        console.error('❌ Erro ao carregar município:', err);
        // Fallback para dados mockados
        setMunicipioSelecionado(nomeMunicipioInicial);
        setSearchTerm(nomeMunicipioInicial);
        
        const geoDataMock = criarGeoDataMunicipioDetalhado(sigla, nomeMunicipioInicial);
        setMunicipioData(geoDataMock);
      } finally {
        setLoading(false);
      }
    }

    if (sigla && nomeMunicipioInicial) {
      carregarMunicipio();
    }
  }, [sigla, nomeMunicipioInicial]);

  // Efeito para desenhar o mapa quando os dados carregarem
  useEffect(() => {
    if (municipioData && svgRef.current) {
      desenharMapa();
    }
  }, [municipioData]);

  function desenharMapa() {
    if (!municipioData || !svgRef.current) return;

    const svg = d3.select(svgRef.current);
    svg.selectAll("*").remove();

    const width = 900;
    const height = 700;
    
    svg.attr('width', width)
       .attr('height', height);

    // Detecta tema baseado no HTML
    const isDark = document.documentElement.getAttribute('data-theme') === 'dark';

    try {
      // Projeção para o município - usando fitSize para zoom automático
      const projection = d3.geoMercator();
      const path = d3.geoPath().projection(projection);

      // Configurar a projeção para caber o município
      projection.fitSize([width, height], municipioData as any);

      // Cores baseadas no tema (mesmas da página de estado)
      const fillColor = '#2C80FF'; // Azul primário do seu tema
      const strokeColor = isDark ? '#1e40af' : '#1e3a8a';
      const hoverColor = '#ef4444';
      const bgColor = 'transparent';

      // Fundo transparente
      svg.append('rect')
        .attr('width', width)
        .attr('height', height)
        .attr('fill', bgColor);

      // Desenha o município específico
      svg.selectAll('path.municipio')
        .data(municipioData.features)
        .enter()
        .append('path')
        .attr('class', 'municipio')
        .attr('d', (d: any) => path(d))
        .attr('fill', fillColor)
        .attr('stroke', strokeColor)
        .attr('stroke-width', 2)
        .on('mouseover', function(event, d: any) {
          d3.select(this)
            .attr('fill', hoverColor)
            .attr('stroke-width', 3);
        })
        .on('mouseout', function(event, d: any) {
          d3.select(this)
            .attr('fill', fillColor)
            .attr('stroke-width', 2);
        });

      console.log('🗺️ Mapa do município desenhado com sucesso:', municipioSelecionado);

    } catch (error) {
      console.error('❌ Erro ao desenhar mapa:', error);
      // Fallback simples
      svg.append('text')
        .attr('x', width / 2)
        .attr('y', height / 2)
        .attr('text-anchor', 'middle')
        .attr('fill', '#6B7280')
        .text(`Mapa de ${municipioSelecionado}`);
    }
  }

  // Normalização para busca
  const normalizarParaBusca = (texto: string): string => {
    if (!texto) return '';
    return texto
      .normalize('NFD')
      .replace(/[\u0300-\u036f]/g, '')
      .toUpperCase();
  };

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

  // Criar dados geo mockados detalhados para o município (formas mais realistas)
  const criarGeoDataMunicipioDetalhado = (siglaEstado: string, nomeMunicipio: string): MunicipioData => {
    // Formas mais realistas baseadas no estado
    const formasPorEstado: { [key: string]: any } = {
      'sp': {
        type: "Polygon",
        coordinates: [[
          [-46.8, -23.7], [-46.5, -23.7], [-46.5, -23.4], [-46.8, -23.4], [-46.8, -23.7],
          [-46.75, -23.65], [-46.6, -23.65], [-46.6, -23.55], [-46.75, -23.55], [-46.75, -23.65]
        ]]
      },
      'rj': {
        type: "Polygon", 
        coordinates: [[
          [-43.4, -23.0], [-43.1, -23.0], [-43.1, -22.8], [-43.4, -22.8], [-43.4, -23.0],
          [-43.3, -22.95], [-43.2, -22.95], [-43.2, -22.85], [-43.3, -22.85], [-43.3, -22.95]
        ]]
      },
      'mg': {
        type: "Polygon",
        coordinates: [[
          [-44.1, -20.1], [-43.8, -20.1], [-43.8, -19.8], [-44.1, -19.8], [-44.1, -20.1],
          [-44.0, -20.0], [-43.9, -20.0], [-43.9, -19.9], [-44.0, -19.9], [-44.0, -20.0]
        ]]
      },
      'rs': {
        type: "Polygon",
        coordinates: [[
          [-51.3, -30.2], [-51.0, -30.2], [-51.0, -29.9], [-51.3, -29.9], [-51.3, -30.2],
          [-51.2, -30.1], [-51.1, -30.1], [-51.1, -30.0], [-51.2, -30.0], [-51.2, -30.1]
        ]]
      }
    };

    const forma = formasPorEstado[siglaEstado] || formasPorEstado['sp'];
    
    return {
      type: "FeatureCollection",
      features: [
        {
          type: "Feature",
          properties: { 
            name: nomeMunicipio,
            nome: nomeMunicipio,
            sigla: siglaEstado.toUpperCase()
          },
          geometry: forma
        }
      ]
    };
  };

  if (loading) {
    return (
      <div className="min-h-screen bg-background text-text flex items-center justify-center transition-colors duration-500">
        <div className="text-xl">Carregando {nomeMunicipioInicial}...</div>
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

              {/* Estado selecionado EM CIMA (nome completo) */}
              <div className="flex items-center gap-3 mt-4 transition-colors duration-500">
                <div className="bg-primary text-white px-5 py-3 rounded-full text-base font-medium flex items-center gap-3 transition-colors duration-500">
                  {nomeEstado}
                </div>
              </div>

              {/* Município selecionado*/}
              {municipioSelecionado && (
                <div className="mt-3 flex items-center gap-2 transition-colors duration-500">
                  <span className="bg-primary text-white px-4 py-2 rounded-full text-sm transition-colors duration-500">
                    {municipioSelecionado}
                  </span>
                  <button
                    onClick={() => {
                      setMunicipioSelecionado(null);
                      setSearchTerm('');
                    }}
                    className="text-white hover:bg-white/20 transition-colors duration-200 w-6 h-6 flex items-center justify-center rounded-full"
                  >
                    <X size={16} />
                  </button>
                </div>
              )}

              {/* Sugestões - AGORA COM NAVEGAÇÃO */}
              {showSuggestions && searchTerm && (
                <div className="absolute top-full left-0 right-0 mt-2 max-h-60 overflow-y-auto z-50 shadow-theme bg-card border border-theme rounded-lg transition-colors duration-500">
                  {municipiosFiltrados.length > 0 ? (
                    municipiosFiltrados.map((municipio, index) => (
                      <button
                        key={index}
                        className="w-full text-left px-4 py-3 border-b border-theme last:border-b-0 hover:bg-card-alt text-text transition-colors duration-500 cursor-pointer"
                        onClick={() => {
                          setMunicipioSelecionado(municipio);
                          setSearchTerm(municipio);
                          setShowSuggestions(false);
                          // ⬇️⬇️⬇️ NAVEGAÇÃO AQUI ⬇️⬇️⬇️
                          navegarParaMunicipio(municipio);
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

              {/* Sugestões Populares - AGORA COM NAVEGAÇÃO */}
              {!searchTerm && !municipioSelecionado && (
                <div className="mt-6 transition-colors duration-500">
                  <p className="text-sm mb-3 text-gray-theme transition-colors duration-500">
                    Sugestões populares:
                  </p>
                  <div className="space-y-2">
                    {municipiosExemplo.map((municipio, index) => (
                      <button
                        key={index}
                        className="w-full text-left px-4 py-3 rounded-lg border border-theme bg-card text-text hover:bg-card-alt transition-colors duration-500 cursor-pointer"
                        onClick={() => {
                          setMunicipioSelecionado(municipio);
                          setSearchTerm(municipio);
                          // ⬇️⬇️⬇️ NAVEGAÇÃO AQUI ⬇️⬇️⬇️
                          navegarParaMunicipio(municipio);
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
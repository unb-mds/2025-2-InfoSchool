'use client';
import { useState, useEffect, useRef, use } from 'react';
import { Search, X, School, MapPin, Phone, Loader2 } from 'lucide-react';
import { useRouter } from 'next/navigation';
import * as d3 from 'd3';

// --- INTERFACES ---
interface Escola {
  id: string;
  nome: string;
  endereco: string;
  telefone: string;
  tipo: string;
  nivel_ensino: string[];
  situacao: string;
  bairro?: string;
}

interface MunicipioIBGE {
  id: number;
  nome: string;
}

const API_BASE_URL = process.env.NEXT_PUBLIC_API_URL || 'http://localhost:3001';

// --- HOOK DE DEBOUNCE ---
function useDebounce<T>(value: T, delay: number): T {
  const [debouncedValue, setDebouncedValue] = useState<T>(value);
  useEffect(() => {
    const handler = setTimeout(() => setDebouncedValue(value), delay);
    return () => clearTimeout(handler);
  }, [value, delay]);
  return debouncedValue;
}

const MunicipioService = {
  identificarMunicipio: async (nome: string, sigla: string): Promise<{ id: number | null; nomeOficial: string }> => {
    try {
      const urlMunicipios = `https://servicodados.ibge.gov.br/api/v1/localidades/estados/${sigla}/municipios`;
      const response = await fetch(urlMunicipios);
      if (!response.ok) throw new Error('Falha IBGE');
      const municipios: MunicipioIBGE[] = await response.json();
      
      const nomeSlugNorm = nome.normalize('NFD').replace(/[\u0300-\u036f]/g, '').toLowerCase();
      const encontrado = municipios.find((m) => {
        const mNorm = m.nome.normalize('NFD').replace(/[\u0300-\u036f]/g, '').replace(/-/g, ' ').toLowerCase();
        return mNorm === nomeSlugNorm;
      });

      if (!encontrado) throw new Error('Município não encontrado');
      return { id: encontrado.id, nomeOficial: encontrado.nome };
    } catch (e) {
      return { id: null, nomeOficial: nome };
    }
  },

  getSVGPorId: async (id: number | null, nome: string): Promise<string> => {
    if (!id) return `<svg viewBox="0 0 100 100"><text x="10" y="50">Sem Mapa</text></svg>`;
    try {
      const res = await fetch(`https://servicodados.ibge.gov.br/api/v3/malhas/municipios/${id}?formato=image/svg+xml`);
      if (!res.ok) throw new Error('Erro SVG');
      return await res.text();
    } catch (e) { return `<svg viewBox="0 0 100 100"><text x="10" y="50">Erro Mapa</text></svg>`; }
  },

  getEscolasPorMunicipio: async (nomeOficial: string, sigla: string, termoBusca: string = ''): Promise<Escola[]> => {
    try {
      const nomeParaBusca = nomeOficial.normalize('NFD').replace(/[\u0300-\u036f]/g, '');
      
      let url = `${API_BASE_URL}/api/escolas/location?uf=${sigla}&municipio=${encodeURIComponent(nomeParaBusca)}&limit=100`;
      
      if (termoBusca) {
        url += `&busca=${encodeURIComponent(termoBusca)}`;
      }

      const response = await fetch(url);
      if (!response.ok) throw new Error(`Erro API: ${response.status}`);
      const data = await response.json();
      
      return (data.escolas || []).map((e: any) => ({
        id: e.id,
        nome: e.nome,
        endereco: e.bairro ? `Bairro ${e.bairro}, ${nomeOficial} - ${sigla}` : `Endereço não informado`,
        telefone: 'Ver detalhes no dashboard', 
        tipo: e.tipo, 
        nivel_ensino: ['Ensino Básico'], 
        situacao: e.situacao
      }));
    } catch (error) {
      console.error("Erro API:", error);
      return [];
    }
  }
};

interface PageProps {
  params: Promise<{ slug: string }>;
}

export default function PaginaMunicipio({ params }: PageProps) {
  const { slug } = use(params);
  const router = useRouter();
  
  // Estados
  const [loading, setLoading] = useState<boolean>(true);
  const [buscandoEscola, setBuscandoEscola] = useState<boolean>(false);
  const [searchTerm, setSearchTerm] = useState<string>('');
  
  // REF DE CONTROLE PARA EVITAR BUSCA REDUNDANTE
  const shouldSkipSearch = useRef<boolean>(false);
  
  const debouncedSearchTerm = useDebounce<string>(searchTerm, 600);

  const [escolas, setEscolas] = useState<Escola[]>([]);
  const [escolasFiltradas, setEscolasFiltradas] = useState<Escola[]>([]);
  
  const [svgMunicipio, setSvgMunicipio] = useState<string>('');
  const [nomeOficialMunicipio, setNomeOficialMunicipio] = useState<string>('');
  
  const mapContainerRef = useRef<HTMLDivElement>(null);
  
  const [showSchoolSuggestions, setShowSchoolSuggestions] = useState<boolean>(false);
  const [escolaSelecionada, setEscolaSelecionada] = useState<Escola | null>(null);
  
  const [windowSize, setWindowSize] = useState({ width: 1200, height: 800 });

  useEffect(() => {
    const handleResize = () => {
      setWindowSize({ width: window.innerWidth, height: window.innerHeight });
    };
    if (typeof window !== 'undefined') {
      setWindowSize({ width: window.innerWidth, height: window.innerHeight });
      window.addEventListener('resize', handleResize);
    }
    return () => {
        if (typeof window !== 'undefined') window.removeEventListener('resize', handleResize);
    };
  }, []);

  const isMobile = windowSize.width < 768;
  const isTablet = windowSize.width >= 768 && windowSize.width < 1024;

  const extrairDadosDoSlug = (slug: string) => {
    if (!slug) return { nomeMunicipioSlug: 'Município', siglaEstado: 'SP' };
    const decodedSlug = decodeURIComponent(slug);
    const partes = decodedSlug.split('-');
    const siglaEstado = partes[0]?.toUpperCase() || 'SP';
    const nomeMunicipioSlug = partes.slice(1).map(p => p.charAt(0).toUpperCase() + p.slice(1)).join(' ').replace(/\bDe\b|\bDo\b|\bDa\b/g, m => m.toLowerCase());
    return { nomeMunicipioSlug, siglaEstado };
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

  const { nomeMunicipioSlug, siglaEstado } = extrairDadosDoSlug(slug);
  const nomeEstadoCompleto = getNomeEstado(siglaEstado);

  // 1. Carregamento Inicial
  useEffect(() => {
    async function carregarDados() {
      try {
        setLoading(true);
        const dadosIbge = await MunicipioService.identificarMunicipio(nomeMunicipioSlug, siglaEstado);
        setNomeOficialMunicipio(dadosIbge.nomeOficial);

        const [svgData, escolasData] = await Promise.all([
          MunicipioService.getSVGPorId(dadosIbge.id, dadosIbge.nomeOficial),
          MunicipioService.getEscolasPorMunicipio(dadosIbge.nomeOficial, siglaEstado)
        ]);
        
        const cleanedSvgData = svgData.replace(/<style[^>]*>[\s\S]*?<\/style>/gi, '').replace(/fill="[^"]*"/g, '').replace(/stroke="[^"]*"/g, '');

        setSvgMunicipio(cleanedSvgData);
        setEscolas(escolasData);
        setEscolasFiltradas(escolasData);
      } catch (err) {
        console.error('❌ Erro ao carregar dados:', err);
        setSvgMunicipio(`<svg width="400" height="400" viewBox="0 0 100 100" xmlns="http://www.w3.org/2000/svg"><rect width="100" height="100" fill="#f0f0f0"/><text x="50" y="50" text-anchor="middle" fill="#666">${nomeMunicipioSlug}</text></svg>`);
      } finally {
        setLoading(false);
      }
    }
    if (nomeMunicipioSlug && siglaEstado) carregarDados();
  }, [slug, nomeMunicipioSlug, siglaEstado]);

  // 2. Lógica de Busca no Servidor (CORRIGIDA COM REF)
  useEffect(() => {
    async function realizarBusca() {
      // CORREÇÃO: Verifica a flag. Se for true, foi uma seleção, não uma busca.
      if (shouldSkipSearch.current) {
        shouldSkipSearch.current = false; // Reseta para a próxima vez
        return;
      }

      if (!debouncedSearchTerm || debouncedSearchTerm.trim() === '') {
        setEscolasFiltradas(escolas);
        return;
      }

      setBuscandoEscola(true);
      try {
        const resultados = await MunicipioService.getEscolasPorMunicipio(
          nomeOficialMunicipio, 
          siglaEstado, 
          debouncedSearchTerm
        );
        setEscolasFiltradas(resultados);
        setShowSchoolSuggestions(true);
      } catch (error) {
        console.error("Erro na busca:", error);
      } finally {
        setBuscandoEscola(false);
      }
    }

    if (!loading) {
      realizarBusca();
    }
  }, [debouncedSearchTerm, nomeOficialMunicipio, siglaEstado, loading, escolas]);

  // Mapa D3
  useEffect(() => {
    if (svgMunicipio && mapContainerRef.current) {
      const container = mapContainerRef.current;
      container.innerHTML = svgMunicipio;
      const svgElement = container.querySelector('svg');
      if (!svgElement) return;

      if (isMobile) { svgElement.style.width = '100%'; svgElement.style.height = '40vh'; }
      else if (isTablet) { svgElement.style.width = '100%'; svgElement.style.height = '50vh'; }
      else { svgElement.style.width = '80%'; svgElement.style.height = '80%'; svgElement.style.maxHeight = '50vh'; svgElement.style.marginLeft = 'auto'; svgElement.style.marginRight = '0'; }
      
      svgElement.style.display = 'block';
      const svg = d3.select(svgElement);
      const paths = svg.selectAll('path, polygon, rect');
      const fillColor = '#2C80FF'; const strokeColor = '#1e40af'; const hoverColor = '#ef4444';

      paths.style('fill', fillColor).style('stroke', strokeColor).style('stroke-width', '0.3').style('cursor', 'pointer')
        .on('mouseover', function(this: any) { d3.select(this).style('fill', hoverColor).style('stroke-width', '1'); })
        .on('mouseout', function(this: any) { d3.select(this).style('fill', fillColor).style('stroke-width', '0.3'); });
    }
  }, [svgMunicipio, isMobile, isTablet]);

  if (loading) {
    return (
      <div className="min-h-screen bg-background text-text flex items-center justify-center transition-colors duration-500">
        <div className="flex flex-col items-center gap-4">
             <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-primary"></div>
             <div className="text-xl">Buscando escolas em {nomeOficialMunicipio || nomeMunicipioSlug}...</div>
        </div>
      </div>
    );
  }

  return (
    <main className="min-h-screen bg-background text-text transition-colors duration-500 overflow-x-hidden">
      <div className={`max-w-[95%] sm:max-w-[90%] md:max-w-[80%] mx-auto px-3 sm:px-4 ${isMobile ? 'py-4' : 'py-6 md:py-16'}`}>
        <div className={`flex flex-col ${isMobile ? 'gap-8' : 'lg:grid lg:grid-cols-2 lg:gap-12'} min-h-[70vh] items-center justify-center`}>
          
          {/* ESQUERDA */}
          <div className={`flex flex-col items-center ${isMobile ? 'w-full order-1' : 'lg:items-start justify-center'} h-full transition-colors duration-500`}>
            <div className="w-full max-w-md relative">
              <h2 className="text-2xl font-bold mb-6 text-primary flex items-center gap-2"><School className="text-primary" /> Escolas da Região</h2>

              <div className="relative">
                <Search className="absolute left-4 top-1/2 -translate-y-1/2 text-gray-theme transition-colors duration-500" size={20} />
                <input
                  type="text"
                  placeholder="Pesquisar escolas na lista..."
                  className="w-full h-14 rounded-full pl-12 pr-12 focus:outline-none focus:ring-2 focus:ring-primary text-lg bg-card border border-theme text-text transition-all duration-500"
                  value={searchTerm}
                  onChange={(e) => {
                    const val = e.target.value;
                    setSearchTerm(val);
                    shouldSkipSearch.current = false; // Habilita busca se usuário digitar
                    
                    // Se apagar ou mudar o texto, esconde o card da escola selecionada
                    if (escolaSelecionada && val !== escolaSelecionada.nome) {
                        setEscolaSelecionada(null);
                    }
                    if (val === '') setEscolasFiltradas(escolas);
                  }}
                  onFocus={() => setShowSchoolSuggestions(true)}
                  onBlur={() => setTimeout(() => setShowSchoolSuggestions(false), 200)}
                />
                {buscandoEscola && <div className="absolute right-4 top-1/2 -translate-y-1/2"><Loader2 className="animate-spin text-primary" size={20} /></div>}
              </div>

              {/* BADGES */}
              <div className="flex items-center gap-3 mt-6 transition-colors duration-500">
                <div className="bg-primary text-white px-5 py-2 rounded-full text-base font-medium flex items-center gap-2 transition-colors duration-500">
                  {nomeEstadoCompleto}
                  <button onClick={() => router.push('/mapa')} className="text-white hover:bg-white/20 w-5 h-5 flex items-center justify-center rounded-full"><X size={14} /></button>
                </div>
                <div className="bg-primary text-white px-5 py-2 rounded-full text-base font-medium flex items-center gap-2 transition-colors duration-500">
                  {nomeOficialMunicipio || nomeMunicipioSlug}
                  <button onClick={() => router.push(`/estado/${siglaEstado.toLowerCase()}`)} className="text-white hover:bg-white/20 w-5 h-5 flex items-center justify-center rounded-full"><X size={14} /></button>
                </div>
              </div>

              {/* SUGESTÕES */}
              {showSchoolSuggestions && (
                <div className="absolute top-full left-0 right-0 mt-2 max-h-60 overflow-y-auto z-50 shadow-theme bg-card border border-theme rounded-lg transition-all duration-500">
                  {escolasFiltradas.length > 0 ? (
                    escolasFiltradas.map((escola) => (
                      <button
                        key={escola.id}
                        className="w-full text-left px-4 py-3 border-b border-theme last:border-b-0 hover:bg-card-alt cursor-pointer transition-colors duration-500"
                        onMouseDown={() => {
                          shouldSkipSearch.current = true; // ATIVA A FLAG para impedir nova busca
                          setEscolaSelecionada(escola);
                          setSearchTerm(escola.nome);
                          setShowSchoolSuggestions(false);
                        }}
                      >
                        <div className="flex justify-between items-center">
                          <span className="text-text transition-colors duration-500 text-sm font-medium">{escola.nome}</span>
                          <span className={`px-2 py-1 rounded text-xs transition-colors duration-500 ${escola.tipo === 'Privada' ? 'bg-purple-100 text-purple-700' : 'bg-green-100 text-green-700'}`}>{escola.tipo}</span>
                        </div>
                      </button>
                    ))
                  ) : (
                    <div className="px-4 py-3 text-center text-gray-theme transition-colors duration-500">
                      {buscandoEscola ? 'Pesquisando...' : 'Nenhuma escola encontrada'}
                    </div>
                  )}
                </div>
              )}

              {/* ESCOLA SELECIONADA */}
              {escolaSelecionada && (
                <div className="mt-6 bg-card rounded-xl p-4 border border-theme animate-fade-in shadow-lg">
                  <div className="flex items-start gap-4">
                    <div className="bg-primary/10 p-3 rounded-full"><School className="text-primary mt-1 shrink-0" size={24} /></div>
                    <div className="flex-1">
                      <h4 className="font-semibold text-lg mb-2 leading-tight">{escolaSelecionada.nome}</h4>
                      <div className="space-y-2 text-sm text-gray-theme">
                        <div className="flex items-start gap-2"><MapPin size={14} className="mt-1 shrink-0" /><span>{escolaSelecionada.endereco}</span></div>
                        {escolaSelecionada.telefone && (<div className="flex items-center gap-2"><Phone size={14} /><span>{escolaSelecionada.telefone}</span></div>)}
                        <div className="flex flex-wrap gap-2 mt-3">
                          <span className={`px-2 py-1 rounded text-xs font-medium ${escolaSelecionada.tipo === 'Privada' ? 'bg-purple-100 text-purple-700' : 'bg-green-100 text-green-700'}`}>{escolaSelecionada.tipo}</span>
                          {escolaSelecionada.situacao && (<span className="bg-blue-100 text-blue-700 px-2 py-1 rounded text-xs font-medium">{escolaSelecionada.situacao}</span>)}
                        </div>
                      </div>
                      <button 
                        className="w-full mt-4 bg-primary text-white py-3 px-4 rounded-lg hover:bg-primary/90 transition-colors duration-200 font-medium flex items-center justify-center gap-2 cursor-pointer shadow-md hover:shadow-lg transform active:scale-95"
                        onClick={() => {
                          const codigoINEP = escolaSelecionada.id;
                          router.push(`/dashboard/${codigoINEP}`);
                        }}
                      >
                        <School size={16} /> Ver Dados Completos (Dashboard)
                      </button>
                    </div>
                  </div>
                </div>
              )}
            </div>
          </div>

          {/* DIREITA (MAPA) */}
          <div className={`flex items-center justify-center ${isMobile ? 'w-full order-2' : 'lg:justify-end'} h-full w-full transition-colors duration-500`}>
            <div className="relative w-full h-full flex items-center justify-center overflow-visible">
              <div ref={mapContainerRef} className={`w-full h-full ${isMobile ? 'min-h-[40vh]' : isTablet ? 'min-h-[50vh]' : 'min-h-[60vh]'}`} />
            </div>
          </div>
        </div>
      </div>
    </main>
  );
}
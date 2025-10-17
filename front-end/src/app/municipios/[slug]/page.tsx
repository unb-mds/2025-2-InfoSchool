// src/app/municipios/[slug]/page.tsx 
'use client';
import { useState, useEffect, use } from 'react';
import { Search, ArrowLeft, School, MapPin, Phone } from 'lucide-react';
import { MunicipioService, Escola } from '@/services/municipio-service';

interface PageProps {
  params: Promise<{ slug: string }>;
}

export default function PaginaMunicipio({ params }: PageProps) {
  const { slug } = use(params);
  const [loading, setLoading] = useState(true);
  const [searchTerm, setSearchTerm] = useState('');
  const [escolas, setEscolas] = useState<Escola[]>([]);
  const [escolasFiltradas, setEscolasFiltradas] = useState<Escola[]>([]);
  const [svgMunicipio, setSvgMunicipio] = useState<string>('');

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

  const { nomeMunicipio, siglaEstado } = extrairDadosDoSlug(slug);

  // Carregar dados
  useEffect(() => {
    async function carregarDados() {
      try {
        setLoading(true);
        const [svgData, escolasData] = await Promise.all([
          MunicipioService.getSVGMunicipio(nomeMunicipio, siglaEstado),
          MunicipioService.getEscolasPorMunicipio(nomeMunicipio, siglaEstado)
        ]);

        // Limpa os estilos inline do SVG para garantir que o nosso CSS seja aplicado.
        const cleanedSvgData = svgData
            .replace(/style="[^"]*"/g, '') // Remove o atributo style
            .replace(/fill="[^"]*"/g, '')   // Remove o atributo fill
            .replace(/stroke="[^"]*"/g, ''); // Remove o atributo stroke

        setSvgMunicipio(cleanedSvgData);
        setEscolas(escolasData);
        setEscolasFiltradas(escolasData);
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

  // Filtrar escolas
  useEffect(() => {
    const filtradas = searchTerm
      ? escolas.filter(escola =>
          escola.nome.toLowerCase().includes(searchTerm.toLowerCase()) ||
          escola.tipo.toLowerCase().includes(searchTerm.toLowerCase()) ||
          escola.nivel_ensino.some(nivel =>
            nivel.toLowerCase().includes(searchTerm.toLowerCase())
          )
        )
      : escolas;
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
      {/* Estilos para o SVG injetado */}
      <style>{`
        .svg-map-container svg {
          width: 100%;
          height: auto;
          max-height: 80vh;
        }
        .svg-map-container path {
          fill: #2C80FF;
          stroke: #1e40af;
          stroke-width: 1px;
        }
      `}</style>
      <div className="max-w-[95%] mx-auto px-4 py-8">
        
        {/* CABEÇALHO */}
        <div className="flex items-center gap-4 mb-8">
          <button
            onClick={() => window.location.href = `/estado/${siglaEstado.toLowerCase()}`}
            className="flex items-center gap-2 px-4 py-2 rounded-lg border border-theme bg-card hover:bg-card-alt transition-colors duration-300"
          >
            <ArrowLeft size={20} />
            Voltar para {siglaEstado}
          </button>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-2 gap-8 min-h-[70vh] items-start">
          
          {/* ESCOLAS (LADO ESQUERDO) */}
          <div className="space-y-6">
            <div>
              <h1 className="text-3xl font-bold mb-2">{nomeMunicipio}</h1>
              <div className="bg-primary text-white px-4 py-1 rounded-full text-sm inline-block">
                {siglaEstado}
              </div>
            </div>

            {/* BARRA DE PESQUISA */}
            <div className="relative">
              <Search className="absolute left-4 top-1/2 -translate-y-1/2 text-gray-theme" size={20} />
              <input
                type="text"
                placeholder="Pesquisar escolas..."
                className="w-full h-14 rounded-full pl-12 pr-6 focus:outline-none focus:ring-2 focus:ring-primary text-lg bg-card border border-theme text-text"
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
              />
            </div>

            {/* LISTA DE ESCOLAS */}
            <div className="space-y-3">
              <h3 className="font-semibold text-lg">
                Escolas em {nomeMunicipio}
                {searchTerm && ` (${escolasFiltradas.length} encontradas)`}
              </h3>
              
              <div className="max-h-[500px] overflow-y-auto space-y-3 pr-2">
                {escolasFiltradas.length > 0 ? (
                  escolasFiltradas.map((escola) => (
                    <div
                      key={escola.id}
                      className="bg-card rounded-xl p-4 border border-theme hover:border-primary transition-colors duration-300 cursor-pointer"
                    >
                      <div className="flex items-start gap-3">
                        <School className="text-primary mt-1 flex-shrink-0" size={20} />
                        <div className="flex-1">
                          <h4 className="font-semibold mb-2">{escola.nome}</h4>
                          <div className="space-y-2 text-sm text-gray-theme">
                            <div className="flex items-center gap-2">
                              <MapPin size={14} />
                              <span>{escola.endereco}</span>
                            </div>
                            <div className="flex items-center gap-2">
                              <Phone size={14} />
                              <span>{escola.telefone}</span>
                            </div>
                            <div className="flex flex-wrap gap-2 mt-2">
                              <span className="bg-primary/20 text-primary px-2 py-1 rounded text-xs">
                                {escola.tipo}
                              </span>
                              {escola.nivel_ensino.map((nivel, index) => (
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
                  ))
                ) : (
                  <div className="text-center py-8 text-gray-theme bg-card rounded-xl border border-theme">
                    <School size={48} className="mx-auto mb-4 opacity-50" />
                    <p>Nenhuma escola encontrada</p>
                    {searchTerm && (
                      <p className="text-sm mt-2">Tente buscar com outro termo</p>
                    )}
                  </div>
                )}
              </div>
            </div>
          </div>

          {/* MAPA SVG (LADO DIREITO SIMPLIFICADO) */}
          <div className="w-full h-full flex items-center justify-center sticky top-8">
            {svgMunicipio ? (
              <div
                className="w-full svg-map-container"
                dangerouslySetInnerHTML={{ __html: svgMunicipio }}
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
    </main>
  );
}


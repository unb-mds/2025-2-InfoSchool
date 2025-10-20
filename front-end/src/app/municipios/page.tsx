'use client';
import { useState, useEffect, use } from 'react';
import { Search, X, ArrowLeft } from 'lucide-react';
import { useRouter } from 'next/navigation';

interface PageProps {
  params: Promise<{
    slug: string; // Pode ser o nome ou código do município
  }>;
}

export default function PaginaMunicipio({ params }: PageProps) {
  const { slug } = use(params);
  const router = useRouter();
  const [loading, setLoading] = useState(true);
  const [searchTerm, setSearchTerm] = useState('');
  const [showSuggestions, setShowSuggestions] = useState(false);
  const [dadosMunicipio, setDadosMunicipio] = useState<any>(null);

  // Função para voltar para o estado
  const voltarParaEstado = () => {
    // Extrai a sigla do estado do slug ou usa lógica similar
    const siglaEstado = extrairSiglaEstado(slug);
    router.push(`/estado/${siglaEstado}`);
  };

  // Função para extrair sigla do estado do slug
  const extrairSiglaEstado = (slug: string): string => {
    // Lógica para extrair a sigla do estado do município
    // Exemplo: "sao-paulo-sp" -> "sp"
    return slug.split('-').pop()?.toUpperCase() || '';
  };

  // Função para obter nome do município
  const getNomeMunicipio = (slug: string): string => {
    // Converte slug para nome formatado
    // Exemplo: "sao-paulo-sp" -> "São Paulo"
    return slug.split('-')
      .slice(0, -1)
      .map(palavra => palavra.charAt(0).toUpperCase() + palavra.slice(1))
      .join(' ')
      .replace(/ De | Do | Da /g, match => match.toLowerCase());
  };

  const nomeMunicipio = getNomeMunicipio(slug);
  const siglaEstado = extrairSiglaEstado(slug);

  // Carregar dados do município
  useEffect(() => {
    async function carregarDadosMunicipio() {
      try {
        setLoading(true);
        // Aqui você faria a requisição para API do município
        // const response = await fetch(`/api/municipios/${slug}`);
        // const data = await response.json();
        
        // Dados mockados por enquanto
        const dadosMockados = {
          nome: nomeMunicipio,
          estado: siglaEstado,
          populacao: "2.000.000",
          idh: "0.805",
          escolas: 150,
          // ... outros dados
        };
        
        setDadosMunicipio(dadosMockados);
      } catch (err) {
        console.error('Erro ao carregar dados do município:', err);
      } finally {
        setLoading(false);
      }
    }

    carregarDadosMunicipio();
  }, [slug]);

  if (loading) {
    return (
      <div className="min-h-screen bg-background text-text flex items-center justify-center">
        <div className="text-xl">Carregando {nomeMunicipio}...</div>
      </div>
    );
  }

  return (
    <main className="min-h-screen bg-background text-text transition-colors duration-500">
      <div className="max-w-[95%] sm:max-w-[90%] md:max-w-[80%] mx-auto px-3 sm:px-4 py-6 md:py-16">
        
        {/* CABEÇALHO COM BOTÃO VOLTAR */}
        <div className="flex items-center gap-4 mb-8">
          <button
            onClick={voltarParaEstado}
            className="flex items-center gap-2 px-4 py-2 rounded-lg border border-theme bg-card hover:bg-card-alt transition-colors duration-300"
          >
            <ArrowLeft size={20} />
            Voltar para {siglaEstado}
          </button>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-2 gap-8 lg:gap-12 min-h-[70vh] items-center">
          
          {/* LADO ESQUERDO - INFORMAÇÕES DO MUNICÍPIO */}
          <div className="flex flex-col items-center lg:items-start justify-center h-full">
            <div className="w-full max-w-md">
              
              {/* NOME DO MUNICÍPIO E ESTADO */}
              <div className="mb-6">
                <h1 className="text-3xl sm:text-4xl font-bold mb-2">
                  {nomeMunicipio}
                </h1>
                <div className="bg-primary text-white px-4 py-2 rounded-full text-sm inline-block">
                  {siglaEstado}
                </div>
              </div>

              {/* DADOS DO MUNICÍPIO */}
              <div className="space-y-4">
                <div className="bg-card rounded-2xl p-4 border border-theme">
                  <h3 className="font-semibold mb-2">Informações Gerais</h3>
                  <div className="space-y-2 text-sm">
                    <div className="flex justify-between">
                      <span>População:</span>
                      <span className="font-medium">{dadosMunicipio?.populacao}</span>
                    </div>
                    <div className="flex justify-between">
                      <span>IDH:</span>
                      <span className="font-medium">{dadosMunicipio?.idh}</span>
                    </div>
                    <div className="flex justify-between">
                      <span>Escolas:</span>
                      <span className="font-medium">{dadosMunicipio?.escolas}</span>
                    </div>
                  </div>
                </div>

                {/* AÇÕES RÁPIDAS */}
                <div className="space-y-2">
                  <button className="w-full bg-primary text-white py-3 rounded-lg font-semibold hover:bg-primary/90 transition-colors duration-300">
                    Ver Escolas do Município
                  </button>
                  <button className="w-full border border-primary text-primary py-3 rounded-lg font-semibold hover:bg-primary/10 transition-colors duration-300">
                    Ver Dados Educacionais
                  </button>
                </div>
              </div>
            </div>
          </div>

          {/* LADO DIREITO - VISUALIZAÇÃO DO MUNICÍPIO */}
          <div className="flex items-center justify-end h-full w-full">
            <div className="relative h-full min-h-[60vh] w-full flex items-center justify-center">
              <div className="bg-card rounded-2xl p-8 border border-theme w-full max-w-2xl text-center">
                <h3 className="text-2xl font-bold mb-4">Mapa de {nomeMunicipio}</h3>
                <p className="text-gray-theme">
                  Visualização do município e dados detalhados serão carregados aqui
                </p>
                {/* Aqui você pode adicionar o mapa D3 do município */}
              </div>
            </div>
          </div>

        </div>
      </div>
    </main>
  );
}
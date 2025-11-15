'use client';
import { useState, useEffect } from 'react';
import { useRouter, useParams } from 'next/navigation';
import { 
  School, MapPin, Phone, Mail, Users, UserCheck, BookOpen, 
  TrendingUp, Award, Clock, Building, Wifi, Utensils, Laptop, 
  ArrowLeft, Home, Download, BarChart3, Target, Calendar,
  Lightbulb, Cpu, Library, GraduationCap, PieChart,
  Activity, Shield, Heart, 
} from 'lucide-react';


// Service compatível com os códigos da página do estado
const DashboardService = {
  getDadosEscola: async (codigo_inep: string) => {
    const codigoLimpo = codigo_inep.replace(/\D/g, '').padStart(8, '0').slice(0, 8);
    
    let hash = 0;
    for (let i = 0; i < codigoLimpo.length; i++) {
      hash = ((hash << 5) - hash) + codigoLimpo.charCodeAt(i);
      hash = hash & hash;
    }
    hash = Math.abs(hash);
    
    const municipios = [
      'São Paulo', 'Rio de Janeiro', 'Belo Horizonte', 'Porto Alegre', 'Salvador',
      'Fortaleza', 'Recife', 'Curitiba', 'Goiânia', 'Belém', 'Campinas', 'Santos',
      'Sorocaba', 'Niterói', 'Duque de Caxias', 'São Gonçalo', 'Uberlândia', 'Contagem',
      'Juiz de Fora', 'Ribeirão Preto'
    ];
    
    const municipioIndex = hash % municipios.length;
    const municipio = municipios[municipioIndex];
    
    const ultimoDigito = parseInt(codigoLimpo.slice(-1));
    let tipoEscola = 'Estadual';
    if (ultimoDigito === 2) tipoEscola = 'Municipal';
    if (ultimoDigito === 3) tipoEscola = 'Particular';
    
    return {
      escola: {
        codigo_inep: codigoLimpo,
        nome: `Escola ${tipoEscola} ${municipio}`,
        rede: 'pública' as const,
        localizacao: 'urbana' as const,
        endereco: `Rua ${municipio}, ${hash % 1000} - Centro`,
        telefone: `(${11 + (hash % 89)}) ${9000 + (hash % 1000)}-${8000 + (hash % 1000)}`,
        email: `escola${codigoLimpo}@edu.gov.br`,
        situacao: 'em funcionamento' as const,
        turno: ['diurno', 'integral'] as ('diurno' | 'noturno' | 'integral')[],
        municipio: municipio,
        estado: ['SP', 'RJ', 'MG', 'RS', 'BA', 'CE', 'PE', 'PR', 'GO', 'PA'][hash % 10],
        diretora: `Maria Silva ${municipio.split(' ')[0]}`
      },
      metricas: {
        alunos: 600 + (hash % 400),
        professores: 25 + (hash % 20),
        turmas: 12 + (hash % 10),
        ideb: 5.5 + (hash % 30) / 10,
        salas: 18 + (hash % 15),
        aprovacao: 85 + (hash % 15),
        frequencia: 90 + (hash % 8),
        evasao: 2 + (hash % 5)
      },
      infraestrutura: {
        laboratorios: true,
        biblioteca: true,
        quadra: hash % 3 !== 0,
        computadores: 30 + (hash % 40),
        internet: true,
        alimentacao: true,
        acessibilidade: hash % 2 === 0,
        auditorio: hash % 4 === 0,
        cotas: {
          ppi: true,
          renda: true,
          pcd: hash % 4 === 0
        }
      },
      dadosTemporais: [
        { ano: 2019, alunos: 500 + (hash % 300), ideb: 5.0 + (hash % 30) / 10, professores: 20, aprovacao: 80 },
        { ano: 2020, alunos: 525 + (hash % 300), ideb: 5.2 + (hash % 30) / 10, professores: 22, aprovacao: 82 },
        { ano: 2021, alunos: 550 + (hash % 300), ideb: 5.3 + (hash % 30) / 10, professores: 23, aprovacao: 83 },
        { ano: 2022, alunos: 575 + (hash % 300), ideb: 5.4 + (hash % 30) / 10, professores: 24, aprovacao: 84 },
        { ano: 2023, alunos: 600 + (hash % 300), ideb: 5.5 + (hash % 30) / 10, professores: 25, aprovacao: 85 }
      ],
      destaques: {
        melhor_indicador: "IDEB acima da média estadual",
        evolucao_destaque: "Crescimento de 12% no IDEB desde 2019",
        comparacao_municipal: 10 + (hash % 10),
        comparacao_estadual: 5 + (hash % 8),
        pontos_fortes: [
          "Infraestrutura moderna",
          "Corpo docente qualificado",
          "Projetos inovadores"
        ]
      }
    };
  }
};

// Componente Header com tema correto
function DashboardHeader({ escola, onBack }: { escola: any; onBack: () => void }) {
  return (
    <div className="bg-card border-b border-theme">
      <div className="container-responsive py-4">
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-4">
            <button 
              onClick={onBack}
              className="flex items-center gap-2 text-gray-theme hover:text-text transition-colors duration-200"
            >
              <ArrowLeft size={20} />
              <span>Voltar</span>
            </button>
            <div className="h-6 w-px bg-theme"></div>
            <button 
              onClick={() => window.location.href = '/'}
              className="flex items-center gap-2 text-gray-theme hover:text-text transition-colors duration-200"
            >
              <Home size={20} />
              <span>Início</span>
            </button>
          </div>
          <div className="text-right">
            <div className="text-sm text-gray-theme">{escola.municipio} - {escola.estado}</div>
            <div className="text-xs text-gray-theme">Código INEP: {escola.codigo_inep}</div>
          </div>
        </div>
      </div>
    </div>
  );
}

// Componente de Identificação
function IdentificacaoEscola({ escola }: { escola: any }) {
  return (
    <div className="bg-card rounded-xl p-6 border border-theme shadow-sm">
      <div className="flex items-start gap-4">
        <div className="bg-primary/20 p-3 rounded-lg">
          <School className="text-primary" size={32} />
        </div>
        <div className="flex-1">
          <h1 className="text-2xl font-bold text-text mb-2">{escola.nome}</h1>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4 text-sm">
            <div className="space-y-2">
              <div className="flex items-center gap-2">
                <span className="font-semibold text-text">Código INEP:</span>
                <span className="text-gray-theme">{escola.codigo_inep}</span>
              </div>
              <div className="flex items-center gap-2">
                <span className="font-semibold text-text">Rede:</span>
                <span className="bg-green-100 text-green-800 px-2 py-1 rounded-full text-xs">
                  {escola.rede}
                </span>
              </div>
              <div className="flex items-center gap-2">
                <span className="font-semibold text-text">Localização:</span>
                <span className="text-gray-theme capitalize">{escola.localizacao}</span>
              </div>
            </div>
            <div className="space-y-2">
              <div className="flex items-center gap-2">
                <MapPin size={16} className="text-gray-theme" />
                <span className="text-gray-theme">{escola.endereco}</span>
              </div>
              <div className="flex items-center gap-2">
                <Phone size={16} className="text-gray-theme" />
                <span className="text-gray-theme">{escola.telefone}</span>
              </div>
              <div className="flex items-center gap-2">
                <Mail size={16} className="text-gray-theme" />
                <span className="text-gray-theme">{escola.email}</span>
              </div>
            </div>
          </div>
          <div className="flex flex-wrap gap-2 mt-4">
            <span className="bg-green-100 text-green-800 px-3 py-1 rounded-full text-xs font-medium">
              {escola.situacao}
            </span>
            {escola.turno.map((turno: string, index: number) => (
              <span key={index} className="bg-primary/20 text-primary px-3 py-1 rounded-full text-xs font-medium">
                {turno}
              </span>
            ))}
          </div>
        </div>
      </div>
    </div>
  );
}

// Componente de Métricas 
function MetricasEscola({ metricas }: { metricas: any }) {
  const cards = [
    { icon: Users, label: 'Alunos', value: metricas.alunos, color: 'text-blue-500' },
    { icon: UserCheck, label: 'Professores', value: metricas.professores, color: 'text-green-500' },
    { icon: BookOpen, label: 'Turmas', value: metricas.turmas, color: 'text-purple-500' },
    { icon: TrendingUp, label: 'IDEB', value: metricas.ideb.toFixed(1), color: 'text-orange-500' },
    { icon: Building, label: 'Salas', value: metricas.salas, color: 'text-indigo-500' },
    { icon: Target, label: 'Aprovação', value: `${metricas.aprovacao}%`, color: 'text-emerald-500' }
  ];

  return (
    <div className="bg-card rounded-xl p-6 border border-theme shadow-sm">
      <h2 className="text-lg font-semibold text-text mb-4">Métricas da Escola</h2>
      <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-6 gap-4">
        {cards.map(({ icon: Icon, label, value, color }, index) => (
          <div key={index} className="text-center p-4 bg-card-alt rounded-lg border border-theme">
            <Icon className={`mx-auto mb-2 ${color}`} size={24} />
            <div className="text-2xl font-bold text-text">
              {typeof value === 'number' ? value.toLocaleString('pt-BR') : value}
            </div>
            <div className="text-sm text-gray-theme">{label}</div>
          </div>
        ))}
      </div>
    </div>
  );
}

// Componente de Infraestrutura 
function InfraestruturaEscola({ infraestrutura }: { infraestrutura: any }) {
  const itens = [
    { icon: Laptop, label: 'Laboratórios', disponivel: infraestrutura.laboratorios },
    { icon: BookOpen, label: 'Biblioteca', disponivel: infraestrutura.biblioteca },
    { icon: Building, label: 'Quadra', disponivel: infraestrutura.quadra },
    { icon: Wifi, label: 'Internet', disponivel: infraestrutura.internet },
    { icon: Utensils, label: 'Alimentação', disponivel: infraestrutura.alimentacao }
  ];

  return (
    <div className="bg-card rounded-xl p-6 border border-theme shadow-sm">
      <h2 className="text-lg font-semibold text-text mb-4">Infraestrutura</h2>
      <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-5 gap-4">
        {itens.map(({ icon: Icon, label, disponivel }, index) => (
          <div key={index} className="text-center p-4 bg-card-alt rounded-lg border border-theme">
            <Icon 
              className={`mx-auto mb-2 ${disponivel ? 'text-green-500' : 'text-red-400'}`} 
              size={24} 
            />
            <div className={`text-sm font-medium ${disponivel ? 'text-text' : 'text-gray-theme'}`}>
              {label}
            </div>
            <div className={`text-xs ${disponivel ? 'text-green-500' : 'text-red-400'}`}>
              {disponivel ? 'Disponível' : 'Indisponível'}
            </div>
          </div>
        ))}
      </div>
      
      <div className="mt-4 p-4 bg-card-alt rounded-lg border border-theme">
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-2">
            <Laptop className="text-blue-500" size={20} />
            <span className="text-sm font-medium text-text">Computadores para alunos</span>
          </div>
          <span className="text-lg font-bold text-text">{infraestrutura.computadores.toLocaleString('pt-BR')}</span>
        </div>
      </div>

      <div className="mt-4">
        <h3 className="text-md font-semibold text-text mb-2">Sistema de Cotas</h3>
        <div className="flex flex-wrap gap-2">
          {infraestrutura.cotas.ppi && (
            <span className="bg-purple-100 text-purple-800 px-3 py-1 rounded-full text-xs">
              PPI
            </span>
          )}
          {infraestrutura.cotas.renda && (
            <span className="bg-blue-100 text-blue-800 px-3 py-1 rounded-full text-xs">
              Renda
            </span>
          )}
          {infraestrutura.cotas.pcd && (
            <span className="bg-green-100 text-green-800 px-3 py-1 rounded-full text-xs">
              PCD
            </span>
          )}
        </div>
      </div>
    </div>
  );
}

// Componente de Análise Temporal 
function AnaliseTemporal({ dadosTemporais }: { dadosTemporais: any[] }) {
  const [anoSelecionado, setAnoSelecionado] = useState(2023);
  const anos = dadosTemporais.map(d => d.ano);
  const dadosAnoAtual = dadosTemporais.find(d => d.ano === anoSelecionado);

  // Calcular evolução
  const evolucaoAlunos = dadosAnoAtual ? 
    ((dadosAnoAtual.alunos - dadosTemporais[0].alunos) / dadosTemporais[0].alunos * 100).toFixed(1) : 0;
  
  const evolucaoIDEB = dadosAnoAtual ? 
    (dadosAnoAtual.ideb - dadosTemporais[0].ideb).toFixed(1) : 0;

  return (
    <div className="bg-card rounded-xl p-6 border border-theme shadow-sm">
      <div className="flex items-center justify-between mb-6">
        <div className="flex items-center gap-3">
          <div className="p-2 bg-primary/10 rounded-lg">
            <TrendingUp className="text-primary" size={20} />
          </div>
          <div>
            <h2 className="text-lg font-semibold text-text">Análise Temporal</h2>
            <p className="text-sm text-gray-theme">Evolução dos indicadores 2019-2023</p>
          </div>
        </div>
        
        <select 
          value={anoSelecionado}
          onChange={(e) => setAnoSelecionado(Number(e.target.value))}
          className="bg-card-alt border border-theme rounded-lg px-3 py-2 text-text text-sm focus:outline-none focus:ring-2 focus:ring-primary transition-colors duration-200"
        >
          {anos.map(ano => (
            <option key={ano} value={ano}>{ano}</option>
          ))}
        </select>
      </div>

      {/* Visualização Simples de Evolução */}
      <div className="bg-card-alt rounded-lg p-4 border border-theme mb-6">
        <div className="flex items-center justify-between mb-4">
          <span className="text-sm font-medium text-text">Evolução do IDEB</span>
          <span className={`text-sm font-medium ${Number(evolucaoIDEB) > 0 ? 'text-green-500' : 'text-red-500'}`}>
            {Number(evolucaoIDEB) > 0 ? '+' : ''}{evolucaoIDEB} pontos
          </span>
        </div>
        
        {/* Gráfico simplificado com barras */}
        <div className="space-y-2">
          {dadosTemporais.map((item, index) => (
            <div key={item.ano} className="flex items-center gap-3">
              <span className="text-xs text-gray-theme w-8">{item.ano}</span>
              <div className="flex-1 bg-gray-200 rounded-full h-3">
                <div 
                  className="h-3 rounded-full bg-primary transition-all duration-500"
                  style={{ 
                    width: `${(item.ideb / 10) * 100}%` 
                  }}
                ></div>
              </div>
              <span className="text-xs font-medium text-text w-8">{item.ideb.toFixed(1)}</span>
            </div>
          ))}
        </div>
      </div>

      {/* Métricas do Ano Selecionado */}
      <div className="grid grid-cols-3 gap-4">
        <div className="text-center p-4 bg-gradient-to-br from-blue-50 to-blue-100 rounded-lg border border-blue-200">
          <div className="text-2xl font-bold text-blue-600">
            {dadosAnoAtual?.alunos.toLocaleString('pt-BR')}
          </div>
          <div className="text-sm text-blue-700 font-medium">Alunos</div>
          <div className={`text-xs mt-1 ${Number(evolucaoAlunos) > 0 ? 'text-green-600' : 'text-red-600'}`}>
            {Number(evolucaoAlunos) > 0 ? '+' : ''}{evolucaoAlunos}%
          </div>
        </div>
        
        <div className="text-center p-4 bg-gradient-to-br from-green-50 to-green-100 rounded-lg border border-green-200">
          <div className="text-2xl font-bold text-green-600">
            {dadosAnoAtual?.ideb.toFixed(1)}
          </div>
          <div className="text-sm text-green-700 font-medium">IDEB</div>
          <div className={`text-xs mt-1 ${Number(evolucaoIDEB) > 0 ? 'text-green-600' : 'text-red-600'}`}>
            {Number(evolucaoIDEB) > 0 ? '+' : ''}{evolucaoIDEB} pts
          </div>
        </div>
        
        <div className="text-center p-4 bg-gradient-to-br from-purple-50 to-purple-100 rounded-lg border border-purple-200">
          <div className="text-2xl font-bold text-purple-600">
            {dadosAnoAtual?.professores.toLocaleString('pt-BR')}
          </div>
          <div className="text-sm text-purple-700 font-medium">Professores</div>
          <div className="text-xs text-purple-600 mt-1">
            +{dadosAnoAtual ? dadosAnoAtual.professores - dadosTemporais[0].professores : 0}
          </div>
        </div>
      </div>

      {/* Legenda */}
      <div className="mt-4 p-3 bg-primary/5 rounded-lg border border-primary/20">
        <div className="flex items-center gap-2 text-sm">
          <TrendingUp size={16} className="text-primary" />
          <span className="text-text font-medium">Tendência:</span>
          <span className="text-gray-theme">
            {Number(evolucaoIDEB) > 0 ? 'Crescimento positivo' : 'Estabilidade'} nos indicadores
          </span>
        </div>
      </div>
    </div>
  );
}

// Componente de Destaques 
function DestaquesEscola({ destaques }: { destaques: any }) {
  return (
    <div className="bg-card rounded-xl p-6 border border-theme shadow-sm">
      <h2 className="text-lg font-semibold text-text mb-4 flex items-center gap-2">
        <Award className="text-yellow-500" size={20} />
        Destaques da Escola
      </h2>
      
      <div className="space-y-4">
        <div className="bg-green-50 border border-green-200 rounded-lg p-4">
          <div className="flex items-center gap-2 mb-1">
            <TrendingUp className="text-green-600" size={18} />
            <span className="font-semibold text-green-800">Melhor Indicador</span>
          </div>
          <p className="text-green-700 text-sm">{destaques.melhor_indicador}</p>
        </div>
        
        <div className="bg-blue-50 border border-blue-200 rounded-lg p-4">
          <div className="flex items-center gap-2 mb-1">
            <Clock className="text-blue-600" size={18} />
            <span className="font-semibold text-blue-800">Evolução</span>
          </div>
          <p className="text-blue-700 text-sm">{destaques.evolucao_destaque}</p>
        </div>
        
        <div className="grid grid-cols-2 gap-4">
          <div className="bg-purple-50 border border-purple-200 rounded-lg p-3 text-center">
            <div className="text-lg font-bold text-purple-800">+{destaques.comparacao_municipal}%</div>
            <div className="text-xs text-purple-600">Acima da média municipal</div>
          </div>
          <div className="bg-indigo-50 border border-indigo-200 rounded-lg p-3 text-center">
            <div className="text-lg font-bold text-indigo-800">+{destaques.comparacao_estadual}%</div>
            <div className="text-xs text-indigo-600">Acima da média estadual</div>
          </div>
        </div>
      </div>
    </div>
  );
}

// Componente Principal
export default function DashboardEscola() {
  const params = useParams();
  const codigo_inep = params.codigo_inep as string;
  const router = useRouter();
  const [loading, setLoading] = useState(true);
  const [dados, setDados] = useState<any>(null);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    async function carregarDados() {
      try {
        setLoading(true);
        setError(null);
        
        const codigoLimpo = codigo_inep.replace(/\D/g, '');
        if (codigoLimpo.length !== 8) {
          throw new Error(`Código INEP inválido: ${codigo_inep}`);
        }
        
        const dadosEscola = await DashboardService.getDadosEscola(codigoLimpo);
        setDados(dadosEscola);
      } catch (error) {
        setError(error instanceof Error ? error.message : 'Erro desconhecido');
      } finally {
        setLoading(false);
      }
    }

    if (codigo_inep) {
      carregarDados();
    } else {
      setError('Código INEP não fornecido');
      setLoading(false);
    }
  }, [codigo_inep]);

  if (loading) {
    return (
      <div className="min-h-screen bg-background text-text flex items-center justify-center">
        <div className="text-xl">Carregando dashboard da escola {codigo_inep}...</div>
      </div>
    );
  }

  if (error || !dados) {
    return (
      <div className="min-h-screen bg-background text-text flex items-center justify-center">
        <div className="text-center max-w-md">
          <div className="text-xl text-red-500 mb-4">Erro ao carregar dados da escola</div>
          <div className="text-gray-theme mb-6">{error}</div>
          <button 
            onClick={() => router.back()}
            className="bg-primary text-white px-6 py-2 rounded-lg hover:bg-primary/80 transition-colors"
          >
            Voltar
          </button>
        </div>
      </div>
    );
  }

  return (
    <main className="min-h-screen bg-background text-text overflow-x-hidden">
      <DashboardHeader escola={dados.escola} onBack={() => router.back()} />
      
      <div className="container-responsive py-8">
        <div className="mb-8">
          <IdentificacaoEscola escola={dados.escola} />
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
          <div className="lg:col-span-2 space-y-8">
            <MetricasEscola metricas={dados.metricas} />
            <InfraestruturaEscola infraestrutura={dados.infraestrutura} />
            <AnaliseTemporal dadosTemporais={dados.dadosTemporais} />
          </div>

          <div className="space-y-8">
            <DestaquesEscola destaques={dados.destaques} />

            <div className="bg-card rounded-xl p-6 border border-theme shadow-sm">
              <div className="flex items-center gap-3 mb-6">
                <div className="p-2 bg-primary/10 rounded-lg">
                  <TrendingUp className="text-primary" size={20} />
                </div>
                <div>
                  <h3 className="text-lg font-semibold text-text">Ações Rápidas</h3>
                  <p className="text-sm text-gray-theme">Acesse funcionalidades principais</p>
                </div>
              </div>
              
              <div className="space-y-3">
                {/* Comparar Escolas */}
                <button className="w-full flex items-center gap-4 p-4 hover:bg-card-alt rounded-xl border border-theme transition-all duration-200 group hover:border-primary/30">
                  <div className="p-2 bg-blue-100 rounded-lg group-hover:scale-110 transition-transform">
                    <BarChart3 className="text-blue-500" size={20} />
                  </div>
                  <div className="flex-1 text-left">
                    <div className="font-semibold text-text group-hover:text-primary transition-colors">
                      Comparar com outras escolas
                    </div>
                    <div className="text-sm text-gray-theme mt-1">
                      Análise de indicadores comparativos
                    </div>
                  </div>
                  <div className="text-blue-500 opacity-0 group-hover:opacity-100 transition-opacity">
                    →
                  </div>
                </button>

                {/* Baixar Relatório */}
                <button className="w-full flex items-center gap-4 p-4 hover:bg-card-alt rounded-xl border border-theme transition-all duration-200 group hover:border-primary/30">
                  <div className="p-2 bg-green-100 rounded-lg group-hover:scale-110 transition-transform">
                    <Download className="text-green-500" size={20} />
                  </div>
                  <div className="flex-1 text-left">
                    <div className="font-semibold text-text group-hover:text-primary transition-colors">
                      Baixar relatório
                    </div>
                    <div className="text-sm text-gray-theme mt-1">
                      Exportar dados em PDF e Excel
                    </div>
                  </div>
                  <div className="text-green-500 opacity-0 group-hover:opacity-100 transition-opacity">
                    →
                  </div>
                </button>

                {/* Histórico Completo */}
                <button className="w-full flex items-center gap-4 p-4 hover:bg-card-alt rounded-xl border border-theme transition-all duration-200 group hover:border-primary/30">
                  <div className="p-2 bg-purple-100 rounded-lg group-hover:scale-110 transition-transform">
                    <TrendingUp className="text-purple-500" size={20} />
                  </div>
                  <div className="flex-1 text-left">
                    <div className="font-semibold text-text group-hover:text-primary transition-colors">
                      Ver histórico completo
                    </div>
                    <div className="text-sm text-gray-theme mt-1">
                      Séries históricas desde 1995
                    </div>
                  </div>
                  <div className="text-purple-500 opacity-0 group-hover:opacity-100 transition-opacity">
                    →
                  </div>
                </button>
              </div>
            </div>
          </div>
        </div>
      </div>
    </main>
  );
}
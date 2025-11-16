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

// Componente Header responsivo
function DashboardHeader({ escola, onBack }: { escola: any; onBack: () => void }) {
  return (
    <div className="bg-card border-b border-theme">
      <div className="max-w-[95%] sm:max-w-[90%] md:max-w-[80%] mx-auto px-3 sm:px-4 py-2 md:py-3">
        <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-3">
          <div className="flex items-center gap-4">
            <button 
              onClick={onBack}
              className="flex items-center gap-2 text-gray-theme hover:text-text transition-colors duration-200 text-sm sm:text-base"
            >
              <ArrowLeft size={18} />
              <span>Voltar</span>
            </button>
            <div className="h-4 sm:h-6 w-px bg-theme"></div>
            <button 
              onClick={() => window.location.href = '/'}
              className="flex items-center gap-2 text-gray-theme hover:text-text transition-colors duration-200 text-sm sm:text-base"
            >
              <Home size={18} />
              <span>Início</span>
            </button>
          </div>
          <div className="text-right">
            <div className="text-xs sm:text-sm text-gray-theme">{escola.municipio} - {escola.estado}</div>
            <div className="text-xs text-gray-theme">INEP: {escola.codigo_inep}</div>
          </div>
        </div>
      </div>
    </div>
  );
}

// Componente de Identificação - MANTIDO
function IdentificacaoEscola({ escola }: { escola: any }) {
  return (
    <div
      className="
        bg-card 
        rounded-2xl 
        p-7 
        border border-white/10 
        shadow-[0_0_25px_-5px_rgba(0,0,0,0.35)]
        backdrop-blur-sm
        transition-all duration-300
        hover:shadow-[0_0_35px_-5px_rgba(0,0,0,0.45)]
      "
    >
      <div className="flex flex-col sm:flex-row sm:items-start gap-7">
        {/* Ícone sem aura */}
        <div className="p-0 rounded-none bg-transparent shadow-none border-none">
          <School className="text-primary w-9 h-9" />
        </div>

        {/* Conteúdo */}
        <div className="flex-1 min-w-0 space-y-5">
          {/* Título */}
          <div className="space-y-1">
            <h1 className="text-2xl font-extrabold tracking-tight text-white break-words">
              {escola.nome}
            </h1>
            <div className="w-16 h-[3px] bg-primary/60 rounded-full"></div>
          </div>

          {/* GRID ajustado */}
          <div
            className="
              grid grid-cols-1 md:grid-cols-2 items-start
              gap-6
              text-sm
            "
          >
            {/* COLUNA ESQUERDA */}
            <div className="space-y-3">
              <div className="flex flex-col xs:flex-row xs:items-center gap-1.5">
                <span className="font-semibold text-text">Código INEP:</span>
                <span className="text-gray-theme">{escola.codigo_inep}</span>
              </div>

              <div className="flex flex-col xs:flex-row xs:items-center gap-1.5">
                <span className="font-semibold text-text">Rede:</span>
                <span
                  className="
                    px-3 py-1 
                    rounded-full 
                    bg-gradient-to-r from-green-100 to-green-200 max-w-fit
                    text-green-900 
                    text-xs font-semibold
                    shadow-sm
                  "
                >
                  {escola.rede}
                </span>
              </div>

              <div className="flex flex-col xs:flex-row xs:items-center gap-1.5">
                <span className="font-semibold text-text">Localização:</span>
                <span className="text-gray-theme capitalize">{escola.localizacao}</span>
              </div>
            </div>

            {/* COLUNA DIREITA */}
            <div className="space-y-3">
              <div className="flex items-start gap-2">
                <MapPin className="text-gray-theme w-4 h-4 mt-0.5" />
                <span className="text-gray-theme leading-tight break-words">
                  {escola.endereco}
                </span>
              </div>

              <div className="flex items-center gap-2">
                <Phone className="text-gray-theme w-4 h-4" />
                <span className="text-gray-theme">{escola.telefone}</span>
              </div>

              <div className="flex items-center gap-2">
                <Mail className="text-gray-theme w-4 h-4" />
                <span className="text-gray-theme break-words">{escola.email}</span>
              </div>
            </div>
          </div>

          {/* TAGS */}
          <div className="flex flex-wrap gap-3 pt-2">
            <span
              className="
                px-3 py-1 
                bg-gradient-to-r from-green-100 to-green-200
                text-green-900 
                rounded-full 
                text-xs font-bold 
                tracking-wide
                shadow-sm
              "
            >
              {escola.situacao}
            </span>

            {escola.turno.map((turno: string, index: number) => (
              <span
                key={index}
                className="
                  px-3 py-1 
                  rounded-full 
                  text-xs font-semibold tracking-wide
                  bg-primary/15 text-primary
                  shadow-sm
                  border border-primary/20
                "
              >
                {turno}
              </span>
            ))}
          </div>
        </div>
      </div>
    </div>
  );
}


// Componente de Métricas - MANTIDO
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
            <div
          className="
            bg-card 
            rounded-2xl 
            p-4 sm:p-6 
            border border-white/10 
            shadow-[0_0_20px_-5px_rgba(0,0,0,0.35)]
            backdrop-blur-sm
            transition-all duration-300
            hover:shadow-[0_0_35px_-5px_rgba(0,0,0,0.55)]
            hover:bg-card/80 
          "
        >


      <h2 className="text-lg font-semibold text-text mb-4">Métricas da Escola</h2>

      <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-6 gap-3 sm:gap-4">
        {cards.map(({ icon: Icon, label, value, color }, index) => (
          <div
            key={index}
            className="
              text-center p-3 sm:p-4 rounded-lg border border-theme bg-card-alt
              transition-all duration-300 
              hover:scale-[1.05] 
              hover:bg-card 
              hover:shadow-lg
            "
          >
            <Icon className={`mx-auto mb-1 sm:mb-2 ${color} w-5 h-5 sm:w-6 sm:h-6`} />

            <div className="text-lg sm:text-xl lg:text-2xl font-bold text-text">
              {typeof value === 'number' ? value.toLocaleString('pt-BR') : value}
            </div>

            <div className="text-xs sm:text-sm text-gray-theme mt-1">{label}</div>
          </div>
        ))}
      </div>
    </div>
  );
}



// Componente de Infraestrutura - MANTIDO
function InfraestruturaEscola({ infraestrutura }: { infraestrutura: any }) {
  const itens = [
    { icon: Laptop, label: "Laboratórios", disponivel: infraestrutura.laboratorios },
    { icon: BookOpen, label: "Biblioteca", disponivel: infraestrutura.biblioteca },
    { icon: Building, label: "Quadra", disponivel: infraestrutura.quadra },
    { icon: Wifi, label: "Internet", disponivel: infraestrutura.internet },
    { icon: Utensils, label: "Alimentação", disponivel: infraestrutura.alimentacao }
  ];

  return (
    <div
      className="
        bg-card 
        rounded-2xl 
        p-4 sm:p-6 
        border border-white/10 
        shadow-[0_0_20px_-5px_rgba(0,0,0,0.35)]
        backdrop-blur-sm
        transition-all duration-300
        hover:shadow-[0_0_35px_-5px_rgba(0,0,0,0.55)]
        hover:bg-card/80
      "
    >
      <h2 className="text-lg font-semibold text-text mb-4">Infraestrutura</h2>

      <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-5 gap-3 sm:gap-4">
        {itens.map(({ icon: Icon, label, disponivel }, index) => (
          <div
            key={index}
            className="
              text-center p-3 sm:p-4 bg-card-alt rounded-lg border border-theme
              transition-all duration-300
              hover:bg-card 
              hover:shadow-md
            "
          >
            <Icon
              className={`mx-auto mb-1 sm:mb-2 ${
                disponivel ? "text-green-500" : "text-red-400"
              } w-5 h-5 sm:w-6 sm:h-6`}
            />

            <div
              className={`text-xs sm:text-sm font-medium ${
                disponivel ? "text-text" : "text-gray-theme"
              }`}
            >
              {label}
            </div>

            <div className={`text-xs ${disponivel ? "text-green-500" : "text-red-400"}`}>
              {disponivel ? "Disponível" : "Indisponível"}
            </div>
          </div>
        ))}
      </div>

      <div
        className="
          mt-4 p-3 sm:p-4 bg-card-alt rounded-lg border border-theme
          transition-all duration-300
          hover:bg-card 
          hover:shadow-md
        "
      >
        <div className="flex flex-col xs:flex-row xs:items-center xs:justify-between gap-2">
          <div className="flex items-center gap-2">
            <Laptop className="text-blue-500 w-5 h-5" />
            <span className="text-sm font-medium text-text">Computadores para alunos</span>
          </div>

          <span className="text-lg font-bold text-text">
            {infraestrutura.computadores.toLocaleString("pt-BR")}
          </span>
        </div>
      </div>

      <div className="mt-4 p-4 bg-card-alt rounded-lg border border-theme shadow-sm 
                hover:bg-black/5 dark:hover:bg-white/5 transition-all">
        <div className="flex items-center gap-2 mb-3">
          <Target className="text-purple-500 w-5 h-5" />
          <h3 className="text-md font-semibold text-text">Sistema de Cotas</h3>
        </div>

        <div className="flex flex-wrap gap-2">
          {infraestrutura.cotas.ppi && (
            <span className="px-3 py-1 rounded-full text-xs font-medium
                            bg-purple-500/10 text-purple-400 border border-purple-500/20">
              PPI
            </span>
          )}

          {infraestrutura.cotas.renda && (
            <span className="px-3 py-1 rounded-full text-xs font-medium
                            bg-blue-500/10 text-blue-400 border border-blue-500/20">
              Renda
            </span>
          )}

          {infraestrutura.cotas.pcd && (
            <span className="px-3 py-1 rounded-full text-xs font-medium
                            bg-green-500/10 text-green-400 border border-green-500/20">
              PCD
            </span>
          )}
        </div>
      </div>
    </div>
  );
}


// Componente de Análise Temporal - MELHORADO COM CARDS LADO A LADO
function AnaliseTemporal({ dadosTemporais }: { dadosTemporais: any[] }) {
  const [anoSelecionado, setAnoSelecionado] = useState(2023);
  const anos = dadosTemporais.map(d => d.ano);
  const dadosAnoAtual = dadosTemporais.find(d => d.ano === anoSelecionado);

  const evolucaoAlunos = dadosAnoAtual ? 
    ((dadosAnoAtual.alunos - dadosTemporais[0].alunos) / dadosTemporais[0].alunos * 100).toFixed(1) : 0;
  
  const evolucaoIDEB = dadosAnoAtual ? 
    (dadosAnoAtual.ideb - dadosTemporais[0].ideb).toFixed(1) : 0;

  const evolucaoProfessores = dadosAnoAtual ? 
    ((dadosAnoAtual.professores - dadosTemporais[0].professores) / dadosTemporais[0].professores * 100).toFixed(1) : 0;

  return (
    <div
      id="analise-temporal"
      className="bg-card rounded-xl p-4 sm:p-6 border border-theme shadow-[0_0_25px_-6px_rgba(0,0,0,0.45)] transition-all"
    >
      <div className="flex flex-col sm:flex-row sm:items-center justify-between mb-4 sm:mb-6 gap-3">
        <div className="flex items-center gap-3">
          <TrendingUp className="text-primary w-5 h-5 sm:w-6 sm:h-6" />

          <div>
            <h2 className="text-lg font-semibold text-text">Análise Temporal</h2>
            <p className="text-sm text-gray-theme">Evolução dos indicadores 2019-2023</p>
          </div>
        </div>
        <select 
          value={anoSelecionado}
          onChange={(e) => setAnoSelecionado(Number(e.target.value))}
          className="bg-card-alt border border-theme rounded-lg px-3 py-2 text-text text-sm focus:outline-none focus:ring-2 focus:ring-primary transition-colors duration-200 w-full sm:w-auto"
        >
          {anos.map(ano => (
            <option key={ano} value={ano}>{ano}</option>
          ))}
        </select>
      </div>

      {/* Gráfico de Evolução */}
      <div className="bg-card-alt rounded-lg p-4 border border-theme shadow-inner hover:bg-black/5 dark:hover:bg-white/5 transition-all mb-6">
        <div className="flex items-center justify-between mb-4">
          <span className="text-sm font-medium text-text">Evolução do IDEB (2019-2023)</span>
          <span className={`text-sm font-medium ${Number(evolucaoIDEB) > 0 ? 'text-green-500' : 'text-red-500'}`}>
            {Number(evolucaoIDEB) > 0 ? '+' : ''}{evolucaoIDEB} pontos
          </span>
        </div>

        <div className="flex items-end justify-between gap-2 h-32">
          {dadosTemporais.map((item) => (
            <div key={item.ano} className="flex flex-col items-center flex-1">
              <div 
                className="w-full bg-primary rounded-t-lg transition-all duration-500 hover:bg-primary/80 cursor-pointer"
                style={{ height: `${(item.ideb / 10) * 100}%` }}
                title={`${item.ano}: IDEB ${item.ideb.toFixed(1)}`}
              ></div>
              <span className="text-xs text-gray-theme mt-2">{item.ano}</span>
              <span className="text-xs font-medium text-text">{item.ideb.toFixed(1)}</span>
            </div>
          ))}
        </div>
      </div>

      {/* Cards de Métricas – Com o Tema Antigo */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
        
        {/* Alunos */}
        <div className="bg-card-alt rounded-xl p-4 border border-theme shadow-[0_0_20px_-5px_rgba(0,0,0,0.45)] transition-all">
          <div className="flex items-center justify-between mb-2">
            <div className="flex items-center gap-2">
              <Users className="text-blue-500 w-5 h-5" />
              <span className="font-semibold text-text">Alunos</span>
            </div>
            <span className={`text-sm font-medium ${Number(evolucaoAlunos) > 0 ? 'text-green-500' : 'text-red-500'}`}>
              {Number(evolucaoAlunos) > 0 ? '+' : ''}{evolucaoAlunos}%
            </span>
          </div>
          <div className="text-2xl font-bold text-text mb-1">
            {dadosAnoAtual?.alunos.toLocaleString('pt-BR')}
          </div>
          <div className="text-xs text-gray-theme">
            vs 2019: {dadosTemporais[0]?.alunos.toLocaleString('pt-BR')}
          </div>
        </div>

        {/* IDEB */}
        <div className="bg-card-alt rounded-xl p-4 border border-theme shadow-[0_0_20px_-5px_rgba(0,0,0,0.45)] transition-all">
          <div className="flex items-center justify-between mb-2">
            <div className="flex items-center gap-2">
              <TrendingUp className="text-green-500 w-5 h-5" />
              <span className="font-semibold text-text">IDEB</span>
            </div>
            <span className={`text-sm font-medium ${Number(evolucaoIDEB) > 0 ? 'text-green-500' : 'text-red-500'}`}>
              {Number(evolucaoIDEB) > 0 ? '+' : ''}{evolucaoIDEB} pts
            </span>
          </div>
          <div className="text-2xl font-bold text-text mb-1">
            {dadosAnoAtual?.ideb.toFixed(1)}
          </div>
          <div className="text-xs text-gray-theme">
            vs 2019: {dadosTemporais[0]?.ideb.toFixed(1)}
          </div>
        </div>

        {/* Professores */}
        <div className="bg-card-alt rounded-xl p-4 border border-theme shadow-[0_0_20px_-5px_rgba(0,0,0,0.45)] transition-all">
          <div className="flex items-center justify-between mb-2">
            <div className="flex items-center gap-2">
              <UserCheck className="text-purple-500 w-5 h-5" />
              <span className="font-semibold text-text">Professores</span>
            </div>
            <span className={`text-sm font-medium ${Number(evolucaoProfessores) > 0 ? 'text-green-500' : 'text-red-500'}`}>
              {Number(evolucaoProfessores) > 0 ? '+' : ''}{evolucaoProfessores}%
            </span>
          </div>
          <div className="text-2xl font-bold text-text mb-1">
            {dadosAnoAtual?.professores.toLocaleString('pt-BR')}
          </div>
          <div className="text-xs text-gray-theme">
            vs 2019: {dadosTemporais[0]?.professores.toLocaleString('pt-BR')}
          </div>
        </div>
      </div>

      {/* Tendência */}
      <div className="mt-4 p-3 bg-primary/5 rounded-lg border border-primary/20">
        <div className="flex items-center gap-2 text-sm">
          <TrendingUp className="text-primary w-4 h-4" />
          <span className="text-text font-medium">Tendência:</span>
          <span className="text-gray-theme text-xs sm:text-sm">
            {Number(evolucaoIDEB) > 0 ? 'Crescimento positivo' : 'Estabilidade'} nos indicadores desde 2019
          </span>
        </div>
      </div>
    </div>
  );
}


// Componente de Destaques - MANTIDO
function DestaquesEscola({ destaques }: { destaques: any }) {
  return (
    <div
  className="
    bg-card
    rounded-2xl
    p-4 sm:p-6
    border border-white/10
    shadow-[0_0_20px_-5px_rgba(0,0,0,0.35)]
    backdrop-blur-sm
    transition-all duration-300
    hover:shadow-[0_0_35px_-5px_rgba(0,0,0,0.55)]
    hover:bg-card/80
  "
>

      <h2 className="text-lg font-semibold text-text mb-4 flex items-center gap-2">
        <Award className="text-yellow-500 w-5 h-5 sm:w-6 sm:h-6" />
        Destaques da Escola
      </h2>

      <div className="space-y-3 sm:space-y-4">

        {/* Melhor Indicador */}
        <div
          className="
            bg-card-alt border border-theme rounded-lg
            p-3 sm:p-4 transition-all duration-200 hover:shadow-md
            hover:bg-black/5 dark:hover:bg-white/5
          "
        >
          <div className="flex items-center gap-2 mb-1">
            <TrendingUp className="text-green-500 w-4 h-4 sm:w-5 sm:h-5" />
            <span className="font-semibold text-text text-sm sm:text-base">
              Melhor Indicador
            </span>
          </div>
          <p className="text-gray-theme text-xs sm:text-sm">
            {destaques.melhor_indicador}
          </p>
        </div>

        {/* Evolução */}
        <div
          className="
            bg-card-alt border border-theme rounded-lg
            p-3 sm:p-4 transition-all duration-200 hover:shadow-md
            hover:bg-black/5 dark:hover:bg-white/5
          "
        >
          <div className="flex items-center gap-2 mb-1">
            <Clock className="text-blue-500 w-4 h-4 sm:w-5 sm:h-5" />
            <span className="font-semibold text-text text-sm sm:text-base">
              Evolução
            </span>
          </div>
          <p className="text-gray-theme text-xs sm:text-sm">
            {destaques.evolucao_destaque}
          </p>
        </div>

        {/* Comparações */}
        <div className="grid grid-cols-2 gap-3 sm:gap-4">

          <div
            className="
              bg-card-alt border border-theme rounded-lg
              p-2 sm:p-3 text-center transition-all duration-200 hover:shadow-md
              hover:bg-black/5 dark:hover:bg-white/5
            "
          >
            <div className="text-base sm:text-lg font-bold text-green-500">
              +{destaques.comparacao_municipal}%
            </div>
            <div className="text-xs text-gray-theme">
              Acima da média municipal
            </div>
          </div>
          <div
            className="
              bg-card-alt border border-theme rounded-lg
              p-2 sm:p-3 text-center transition-all duration-200 hover:shadow-md
              hover:bg-black/5 dark:hover:bg-white/5
            "
          >
            <div className="text-base sm:text-lg font-bold text-green-500">
              +{destaques.comparacao_estadual}%
            </div>
            <div className="text-xs text-gray-theme">
              Acima da média estadual
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}


// Componente Principal - AJUSTADO COM O MESMO LAYOUT DO HEADER
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
      <div className="min-h-screen bg-background text-text flex items-center justify-center p-4">
        <div className="text-lg sm:text-xl text-center">Carregando dashboard da escola {codigo_inep}...</div>
      </div>
    );
  }

  if (error || !dados) {
    return (
      <div className="min-h-screen bg-background text-text flex items-center justify-center p-4">
        <div className="text-center max-w-md w-full">
          <div className="text-lg sm:text-xl text-red-500 mb-4">Erro ao carregar dados da escola</div>
          <div className="text-gray-theme mb-6 text-sm sm:text-base">{error}</div>
          <button 
            onClick={() => router.back()}
            className="bg-primary text-white px-6 py-2 rounded-lg hover:bg-primary/80 transition-colors w-full sm:w-auto"
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
      
      {/* CONTAINER ALINHADO COM O HEADER */}
      <div className="max-w-[95%] sm:max-w-[90%] md:max-w-[80%] mx-auto px-3 sm:px-4 py-6 sm:py-8">
        <div className="mb-6 sm:mb-8">
          <IdentificacaoEscola escola={dados.escola} />
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-3 gap-6 sm:gap-8">
          <div className="lg:col-span-2 space-y-6 sm:space-y-8">
            <MetricasEscola metricas={dados.metricas} />
            <InfraestruturaEscola infraestrutura={dados.infraestrutura} />
            <AnaliseTemporal dadosTemporais={dados.dadosTemporais} />
          </div>

          <div className="space-y-6 sm:space-y-8">
            <DestaquesEscola destaques={dados.destaques} />

           {/* AÇÕES RÁPIDAS */}
            <div 
              className="
                bg-card 
                rounded-2xl 
                p-4 sm:p-6 
                border border-white/10 
                shadow-[0_0_20px_-5px_rgba(0,0,0,0.35)]
                backdrop-blur-sm
                transition-all duration-300
                hover:shadow-[0_0_35px_-5px_rgba(0,0,0,0.55)]
                hover:bg-card/80
              "
            >

              {/* Header */}
              <div className="flex items-center gap-3 mb-4 sm:mb-6">
                <div className="p-2 bg-primary/10 rounded-lg">
                  <TrendingUp className="text-primary w-5 h-5 sm:w-6 sm:h-6" />
                </div>
                <div>
                  <h3 className="text-lg font-semibold text-text">Ações Rápidas</h3>
                  <p className="text-sm text-gray-theme">Acesse funcionalidades principais</p>
                </div>
              </div>

              <div className="space-y-3">

                {/* COMPARAR ESCOLAS */}
                <a
                  href="/explorar"
                  className="
                    w-full flex items-center gap-3 sm:gap-4 
                    p-3 sm:p-4 cursor-pointer
                    bg-card-alt 
                    rounded-xl 
                    border border-theme
                    transition-all duration-200 
                    hover:bg-black/10 dark:hover:bg-white/10
                    hover:shadow-md 
                    group
                  "
                >
                  <div className="p-2 bg-blue-100 rounded-lg group-hover:scale-110 transition-transform duration-200 flex-shrink-0">
                    <BarChart3 className="text-blue-500 w-5 h-5 sm:w-6 sm:h-6" />
                  </div>

                  <div className="flex-1 text-left min-w-0">
                    <div className="font-semibold text-text text-sm sm:text-base group-hover:text-blue-500 transition-colors">
                      Comparar escolas
                    </div>
                    <div className="text-gray-theme mt-1 text-xs sm:text-sm">
                      Use a ferramenta de exploração
                    </div>
                  </div>

                  <div className="text-blue-500 opacity-0 group-hover:opacity-100 transition-opacity duration-200 flex-shrink-0">
                    →
                  </div>
                </a>

                {/* EXPORTAR RELATORIO */}
                <button
                  onClick={() => {
                    if (confirm("Deseja baixar o relatório completo em PDF?")) {
                      console.log("Baixando relatório...");
                    }
                  }}
                  className="
                    w-full flex items-center gap-3 sm:gap-4 
                    p-3 sm:p-4 cursor-pointer
                    bg-card-alt 
                    rounded-xl 
                    border border-theme
                    transition-all duration-200 
                    hover:bg-black/10 dark:hover:bg-white/10
                    hover:shadow-md 
                    group
                  "
                >
                  <div className="p-2 bg-green-100 rounded-lg group-hover:scale-110 transition-transform duration-200 flex-shrink-0">
                    <Download className="text-green-500 w-5 h-5 sm:w-6 sm:h-6" />
                  </div>

                  <div className="flex-1 text-left min-w-0">
                    <div className="font-semibold text-text text-sm sm:text-base group-hover:text-green-500 transition-colors">
                      Exportar relatório
                    </div>
                    <div className="text-gray-theme mt-1 text-xs sm:text-sm">
                      PDF e Excel com dados completos
                    </div>
                  </div>

                  <div className="text-green-500 opacity-0 group-hover:opacity-100 transition-opacity duration-200 flex-shrink-0">
                    ↓
                  </div>
                </button>

                {/* HISTÓRICO COMPLETO */}
                <button
                  onClick={() => {
                    document.getElementById("analise-temporal")?.scrollIntoView({ behavior: "smooth" });
                  }}
                  className="
                    w-full flex items-center gap-3 sm:gap-4 
                    p-3 sm:p-4 cursor-pointer
                    bg-card-alt 
                    rounded-xl 
                    border border-theme
                    transition-all duration-200 
                    hover:bg-black/10 dark:hover:bg-white/10
                    hover:shadow-md 
                    group
                  "
                >
                  <div className="p-2 bg-purple-100 rounded-lg group-hover:scale-110 transition-transform duration-200 flex-shrink-0">
                    <Calendar className="text-purple-500 w-5 h-5 sm:w-6 sm:h-6" />
                  </div>

                  <div className="flex-1 text-left min-w-0">
                    <div className="font-semibold text-text text-sm sm:text-base group-hover:text-purple-500 transition-colors">
                      Histórico completo
                    </div>
                    <div className="text-gray-theme mt-1 text-xs sm:text-sm">
                      Análise temporal desde 2019
                    </div>
                  </div>

                  <div className="text-purple-500 opacity-0 group-hover:opacity-100 transition-opacity duration-200 flex-shrink-0">
                    📊
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
'use client';
import { useState, useRef, useEffect } from 'react';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faSearch, faDownload, faChevronDown } from '@fortawesome/free-solid-svg-icons';

interface Message {
  id: string;
  content: string;
  isUser: boolean;
  timestamp: Date;
  hasMainButton?: boolean;
  hasOptions?: boolean;
  hasDownload?: boolean;
  hasContinue?: boolean;
  options?: string[];
  consultType?: string;
  schoolData?: SchoolData;
}

interface SchoolData {
  nome: string;
  municipio: string;
  estado: string;
  endereco: string;
  zona: string;
  regiao: string;
  etapas_ensino: string[];
  total_matriculas: number;
  total_salas: number;
  acesso_internet: boolean;
  total_professores: number;
  total_funcionarios: number;
  taxa_aprovacao: number;
  taxa_reprovacao: number;
  taxa_abandono: number;
}

interface SchoolsData {
  [municipio: string]: {
    [escolaKey: string]: SchoolData;
  };
}

export default function RAGPage() {
  const [messages, setMessages] = useState<Message[]>([
    {
      id: '1',
      content: "Olá! Sou o Aluno, sua assistente de IA para informações do Censo Escolar. Como posso ajudá-lo hoje?",
      isUser: false,
      timestamp: new Date(),
      hasMainButton: true
    }
  ]);
  const [inputMessage, setInputMessage] = useState('');
  const [currentContext, setCurrentContext] = useState<{
    consultType?: string;
    awaitingSchoolInput?: boolean;
  }>({});
  const messagesEndRef = useRef<HTMLDivElement>(null);

  const scrollToBottom = () => {
    messagesEndRef.current?.scrollIntoView({ behavior: "smooth" });
  };

  useEffect(() => {
    scrollToBottom();
  }, [messages]);

  // Base de dados mockada - será substituída pela integração com RAG/backend
  const SCHOOLS_DATA: SchoolsData = {
    "campinas": {
      "escola notre dame": {
        nome: "Escola Notre Dame",
        municipio: "Campinas",
        estado: "SP",
        endereco: "Rua das Flores, 123 - Centro",
        zona: "Urbana",
        regiao: "Sudeste",
        etapas_ensino: ["Educação Infantil", "Ensino Fundamental", "Ensino Médio"],
        total_matriculas: 850,
        total_salas: 25,
        acesso_internet: true,
        total_professores: 45,
        total_funcionarios: 28,
        taxa_aprovacao: 92.5,
        taxa_reprovacao: 4.2,
        taxa_abandono: 3.3
      }
    },
    
    "são paulo": {
      "escola estadual sao paulo": {
        nome: "Escola Estadual São Paulo",
        municipio: "São Paulo", 
        estado: "SP",
        endereco: "Avenida Paulista, 1000 - Bela Vista",
        zona: "Urbana",
        regiao: "Sudeste",
        etapas_ensino: ["Ensino Fundamental", "Ensino Médio"],
        total_matriculas: 1200,
        total_salas: 35,
        acesso_internet: false,
        total_professores: 68,
        total_funcionarios: 42,
        taxa_aprovacao: 85.3,
        taxa_reprovacao: 9.8,
        taxa_abandono: 4.9
      }
    }
  };

  // Geração de relatório PDF - Estrutura pronta para integração
  const generatePDF = (escola: SchoolData, consultType: string) => {
    const baseUrl = window.location.origin;
    const now = new Date();
    const dataHora = now.toLocaleDateString('pt-BR') + ' às ' + now.toLocaleTimeString('pt-BR');
    
    // Define o título baseado no tipo de consulta
    let tituloRelatorio = '';
    switch(consultType) {
      case 'Localização da escola':
        tituloRelatorio = 'Relatório de Localização';
        break;
      case 'Etapas de ensino oferecidas':
        tituloRelatorio = 'Relatório de Etapas de Ensino';
        break;
      case 'Número de matrículas':
        tituloRelatorio = 'Relatório de Matrículas';
        break;
      case 'Infraestrutura disponível':
        tituloRelatorio = 'Relatório de Infraestrutura';
        break;
      case 'Corpo docente e funcionários':
        tituloRelatorio = 'Relatório de Corpo Docente';
        break;
      case 'Indicadores de desempenho':
        tituloRelatorio = 'Relatório de Indicadores Educacionais';
        break;
      default:
        tituloRelatorio = 'Relatório Completo';
    }

    // Template HTML do PDF com estilos otimizados para impressão
    const content = `
      <!DOCTYPE html>
      <html>
      <head>
        <meta charset="UTF-8">
        <title>${tituloRelatorio} - ${escola.nome}</title>
        <style>
          body { 
            font-family: Arial, sans-serif; 
            margin: 40px; 
            color: #333;
          }
          .header { 
            display: flex;
            align-items: center;
            justify-content: space-between;
            border-bottom: 2px solid #2C80FF; 
            padding-bottom: 20px; 
            margin-bottom: 30px;
          }
          .logo-container {
            display: flex;
            align-items: center;
            gap: 15px;
          }
          .logo-image {
            width: 80px;
            height: 80px;
          }
          .logo-text { 
            font-size: 24px; 
            font-weight: bold; 
            color: #2C80FF; 
          }
          .school-info {
            text-align: right;
          }
          .school-name { 
            font-size: 20px; 
            font-weight: bold; 
            margin: 5px 0; 
          }
          .report-title {
            font-size: 18px;
            font-weight: bold;
            color: #2C80FF;
            margin: 10px 0;
          }
          .section { 
            margin: 25px 0; 
          }
          .section-title { 
            font-size: 16px; 
            font-weight: bold; 
            color: #2C80FF; 
            margin-bottom: 10px;
            border-bottom: 1px solid #2C80FF;
            padding-bottom: 5px;
          }
          .info-grid { 
            display: grid; 
            grid-template-columns: 1fr 1fr; 
            gap: 15px; 
            margin-top: 10px;
          }
          .info-item { 
            margin: 5px 0; 
          }
          .info-item .label { 
            font-weight: bold; 
            color: #2C80FF !important;
          }
          .footer { 
            margin-top: 40px; 
            text-align: center; 
            font-size: 12px; 
            color: #666; 
            border-top: 1px solid #2C80FF;
            padding-top: 20px;
          }
          table { 
            width: 100%; 
            border-collapse: collapse; 
            margin: 10px 0; 
          }
          th, td { 
            border: 1px solid #2C80FF; 
            padding: 8px; 
            text-align: left; 
          }
          th { 
            background-color: #2C80FF; 
            color: white;
            font-weight: bold;
          }
          td:first-child {
            font-weight: bold;
            color: #2C80FF !important;
            background-color: #f8fafc;
          }
          @media print {
            body { 
              margin: 20px; 
            }
            .header {
              page-break-after: avoid;
            }
            .section {
              page-break-inside: avoid;
            }
            td:first-child {
              color: #2C80FF !important;
              -webkit-print-color-adjust: exact;
              print-color-adjust: exact;
            }
            th {
              -webkit-print-color-adjust: exact;
              print-color-adjust: exact;
            }
          }
        </style>
      </head>
      <body>
        <div class="header">
          <div class="logo-container">
            <img src="${baseUrl}/images/InfoSchool-logo.svg" alt="InfoSchool Logo" class="logo-image" onerror="this.style.display='none'">
            <div class="logo-text">InfoSchool</div>
          </div>
          <div class="school-info">
            <div class="school-name">${escola.nome}</div>
            <div class="report-title">${tituloRelatorio}</div>
            <div>Gerado em: ${dataHora}</div>
          </div>
        </div>
    `;

    // Conteúdo dinâmico baseado no tipo de consulta
    let specificContent = '';

    if (consultType === 'Localização da escola' || consultType === 'Todas as informações') {
      specificContent += `
        <div class="section">
          <div class="section-title">Dados Gerais</div>
          <div class="info-grid">
            <div class="info-item"><span class="label">Município:</span> ${escola.municipio}</div>
            <div class="info-item"><span class="label">Estado:</span> ${escola.estado}</div>
            <div class="info-item"><span class="label">Endereço:</span> ${escola.endereco}</div>
            <div class="info-item"><span class="label">Zona:</span> ${escola.zona}</div>
            <div class="info-item"><span class="label">Região:</span> ${escola.regiao}</div>
          </div>
        </div>
      `;
    }

    if (consultType === 'Etapas de ensino oferecidas' || consultType === 'Todas as informações') {
      specificContent += `
        <div class="section">
          <div class="section-title">Etapas de Ensino</div>
          <div>${escola.etapas_ensino.join(', ')}</div>
        </div>
      `;
    }

    if (consultType === 'Número de matrículas' || consultType === 'Todas as informações') {
      specificContent += `
        <div class="section">
          <div class="section-title">Dados de Matrícula</div>
          <table>
            <tr>
              <th>Categoria</th>
              <th>Valor</th>
            </tr>
            <tr>
              <td>Total de Matrículas</td>
              <td>${escola.total_matriculas} alunos</td>
            </tr>
          </table>
        </div>
      `;
    }

    if (consultType === 'Infraestrutura disponível' || consultType === 'Todas as informações') {
      specificContent += `
        <div class="section">
          <div class="section-title">Infraestrutura</div>
          <table>
            <tr>
              <th>Categoria</th>
              <th>Valor</th>
            </tr>
            <tr>
              <td>Total de Salas</td>
              <td>${escola.total_salas}</td>
            </tr>
            <tr>
              <td>Acesso à Internet</td>
              <td>${escola.acesso_internet ? 'Sim' : 'Não'}</td>
            </tr>
          </table>
        </div>
      `;
    }

    if (consultType === 'Corpo docente e funcionários' || consultType === 'Todas as informações') {
      specificContent += `
        <div class="section">
          <div class="section-title">Corpo Docente e Funcionários</div>
          <table>
            <tr>
              <th>Categoria</th>
              <th>Quantidade</th>
            </tr>
            <tr>
              <td>Professores</td>
              <td>${escola.total_professores}</td>
            </tr>
            <tr>
              <td>Funcionários</td>
              <td>${escola.total_funcionarios}</td>
            </tr>
            <tr>
              <td>Total de Pessoal</td>
              <td>${escola.total_professores + escola.total_funcionarios}</td>
            </tr>
          </table>
        </div>
      `;
    }

    if (consultType === 'Indicadores de desempenho' || consultType === 'Todas as informações') {
      specificContent += `
        <div class="section">
          <div class="section-title">Indicadores Educacionais</div>
          <table>
            <tr>
              <th>Indicador</th>
              <th>Valor</th>
            </tr>
            <tr>
              <td>Taxa de Aprovação</td>
              <td>${escola.taxa_aprovacao}%</td>
            </tr>
            <tr>
              <td>Taxa de Reprovação</td>
              <td>${escola.taxa_reprovacao}%</td>
            </tr>
            <tr>
              <td>Taxa de Abandono</td>
              <td>${escola.taxa_abandono}%</td>
            </tr>
          </table>
        </div>
      `;
    }

    const footer = `
        <div class="footer">
          <div>Fonte: Censo Escolar 2023 - INEP</div>
          <div>InfoSchool - Plataforma de Consulta Educacional</div>
          <div>Relatório gerado automaticamente pelo sistema</div>
        </div>
      </body>
      </html>
    `;

    const fullContent = content + specificContent + footer;

    // Abre janela para impressão/PDF
    const printWindow = window.open('', '_blank');
    if (printWindow) {
      printWindow.document.write(fullContent);
      printWindow.document.close();
      
      printWindow.onload = () => {
        printWindow.focus();
        printWindow.print();
        
        setTimeout(() => {
          printWindow.close();
        }, 3000);
      };
    }
  };

  // Fluxo principal da conversa
  const handleMainButtonClick = () => {
    const userMsg: Message = {
      id: Date.now().toString(),
      content: "Quero consultar informações sobre uma escola",
      isUser: true,
      timestamp: new Date()
    };

    const iaMsg: Message = {
      id: (Date.now() + 1).toString(),
      content: "Perfeito! Sobre qual informação específica você gostaria de saber?",
      isUser: false,
      timestamp: new Date(),
      hasOptions: true,
      options: [
        "Localização da escola",
        "Etapas de ensino oferecidas", 
        "Número de matrículas",
        "Infraestrutura disponível",
        "Corpo docente e funcionários",
        "Indicadores de desempenho",
        "Todas as informações"
      ]
    };

    setMessages(prev => [...prev, userMsg, iaMsg]);
  };

  // Seleção de tipo de consulta
  const handleOptionSelect = (option: string) => {
    const userMsg: Message = {
      id: Date.now().toString(),
      content: option,
      isUser: true,
      timestamp: new Date(),
      consultType: option
    };

    setMessages(prev => [...prev, userMsg]);

    // Mantém contexto da consulta atual
    setCurrentContext({
      consultType: option,
      awaitingSchoolInput: true
    });

    setTimeout(() => {
      let response = "";

      switch(option) {
        case "Localização da escola":
          response = "Entendi! Para consultar a localização, me informe o nome da escola e a cidade onde ela se encontra.";
          break;
        case "Etapas de ensino oferecidas":
          response = "Certo! Posso verificar quais etapas de ensino a escola oferece. Qual é o nome da escola e município?";
          break;
        case "Número de matrículas":
          response = "Posso consultar o total de alunos matriculados. De qual escola você gostaria de saber?";
          break;
        case "Infraestrutura disponível":
          response = "Posso verificar a infraestrutura da escola, como número de salas e acesso à internet. Qual escola você quer consultar?";
          break;
        case "Corpo docente e funcionários":
          response = "Tenho informações sobre a equipe da escola. Me informe o nome da escola e a cidade, por favor.";
          break;
        case "Indicadores de desempenho":
          response = "Posso fornecer os indicadores educacionais da escola. Qual escola você gostaria de ver?";
          break;
        case "Todas as informações":
          response = "Excelente! Vou buscar todas as informações disponíveis. Qual escola você quer consultar?";
          break;
      }

      const iaMsg: Message = {
        id: (Date.now() + 1).toString(),
        content: response,
        isUser: false,
        timestamp: new Date()
      };

      setMessages(prev => [...prev, iaMsg]);
    }, 500);
  };

  // Busca escola na base de dados - Ponto de integração com RAG/Backend
  const findSchool = (input: string): { escola: SchoolData; municipio: string } | null => {
    const inputLower = input.toLowerCase();
    
    // Busca por município primeiro
    for (const municipio in SCHOOLS_DATA) {
      if (inputLower.includes(municipio.toLowerCase())) {
        const escolasNoMunicipio = SCHOOLS_DATA[municipio];
        for (const escolaKey in escolasNoMunicipio) {
          const escola = escolasNoMunicipio[escolaKey];
          if (inputLower.includes(escola.nome.toLowerCase()) || inputLower.includes(escolaKey)) {
            return { escola, municipio };
          }
        }
        // Retorna primeira escola do município se não encontrar nome específico
        const primeiraEscola = Object.values(escolasNoMunicipio)[0];
        return { escola: primeiraEscola, municipio };
      }
    }
    
    // Busca por nome da escola em qualquer município
    for (const municipio in SCHOOLS_DATA) {
      const escolasNoMunicipio = SCHOOLS_DATA[municipio];
      for (const escolaKey in escolasNoMunicipio) {
        const escola = escolasNoMunicipio[escolaKey];
        if (inputLower.includes(escola.nome.toLowerCase()) || inputLower.includes(escolaKey)) {
          return { escola, municipio };
        }
      }
    }
    
    return null;
  };

  // Processa resposta do usuário - Aqui será integrado com RAG
  const handleUserResponse = (userInput: string) => {
    if (!userInput.trim()) return;

    const userMsg: Message = {
      id: Date.now().toString(),
      content: userInput,
      isUser: true,
      timestamp: new Date()
    };

    setMessages(prev => [...prev, userMsg]);
    setInputMessage('');

    setTimeout(() => {
      const schoolInfo = findSchool(userInput);
      let response = "";
      let hasDownload = false;
      let hasContinue = false;
      let consultType = "";
      let schoolData: SchoolData | undefined = undefined;

      // Usa contexto atual mantendo o tipo de consulta
      consultType = currentContext.consultType || "";

      if (schoolInfo) {
        const { escola } = schoolInfo;
        schoolData = escola;
        
        // Gera resposta baseada no tipo de consulta do contexto
        if (consultType.includes("Localização") || consultType === "Localização da escola") {
          response = `A ${escola.nome} está localizada na ${escola.endereco}, em ${escola.municipio} - ${escola.estado}. A escola fica na zona ${escola.zona.toLowerCase()} da região ${escola.regiao}.`;
        } else if (consultType.includes("Etapas") || consultType === "Etapas de ensino oferecidas") {
          response = `A ${escola.nome} oferece ${escola.etapas_ensino.join(" e ")}.`;
        } else if (consultType.includes("matrículas") || consultType === "Número de matrículas") {
          response = `A ${escola.nome} possui ${escola.total_matriculas} alunos matriculados no ano de 2023.`;
        } else if (consultType.includes("Infraestrutura") || consultType === "Infraestrutura disponível") {
          response = `A infraestrutura da ${escola.nome} conta com ${escola.total_salas} salas de aula e ${escola.acesso_internet ? "possui acesso à internet" : "não possui acesso à internet"}.`;
        } else if (consultType.includes("docente") || consultType === "Corpo docente e funcionários") {
          response = `O corpo da ${escola.nome} é composto por ${escola.total_professores} professores e ${escola.total_funcionarios} funcionários.`;
        } else if (consultType.includes("Indicadores") || consultType === "Indicadores de desempenho") {
          response = `Os indicadores da ${escola.nome} mostram uma taxa de aprovação de ${escola.taxa_aprovacao}%, reprovação de ${escola.taxa_reprovacao}% e abandono de ${escola.taxa_abandono}%.`;
        } else {
          response = `Aqui estão todas as informações da ${escola.nome} em ${escola.municipio}:\n\nLocalizada na ${escola.endereco}, oferece ${escola.etapas_ensino.join(" e ")}.\n\nPossui ${escola.total_matriculas} alunos matriculados, ${escola.total_salas} salas de aula e ${escola.acesso_internet ? "acesso à internet" : "sem acesso à internet"}.\n\nConta com ${escola.total_professores} professores e ${escola.total_funcionarios} funcionários.\n\nSeus indicadores: ${escola.taxa_aprovacao}% de aprovação, ${escola.taxa_reprovacao}% de reprovação e ${escola.taxa_abandono}% de abandono.\n\nDados do Censo Escolar 2023.`;
        }
        
        hasDownload = true;
        hasContinue = true;

      } else {
        response = "Não encontrei essa escola em nossa base de dados. Você pode tentar consultar a Escola Notre Dame em Campinas ou a Escola Estadual São Paulo em São Paulo. Verifique se digitou o nome e cidade corretamente.";
        
        // Mantém contexto para nova tentativa
        if (currentContext.consultType) {
          response += ` Continuo aguardando informações sobre ${currentContext.consultType.toLowerCase()}.`;
        }
      }

      const iaMsg: Message = {
        id: (Date.now() + 1).toString(),
        content: response,
        isUser: false,
        timestamp: new Date(),
        hasDownload: hasDownload,
        hasContinue: hasContinue,
        consultType: consultType,
        schoolData: schoolData
      };

      setMessages(prev => [...prev, iaMsg]);
      
      // Atualiza contexto após processamento
      if (schoolInfo) {
        setCurrentContext(prev => ({
          ...prev,
          awaitingSchoolInput: false
        }));
      }
    }, 800);
  };

  const handleSendMessage = () => {
    handleUserResponse(inputMessage);
  };

  const handleDownload = () => {
    const lastMessage = messages[messages.length - 1];
    if (lastMessage.schoolData && lastMessage.consultType) {
      generatePDF(lastMessage.schoolData, lastMessage.consultType);
    }
  };

  const handleContinue = () => {
    const iaMsg: Message = {
      id: Date.now().toString(),
      content: "Posso ajudar com mais alguma coisa?",
      isUser: false,
      timestamp: new Date(),
      hasOptions: true,
      options: ["Fazer outra consulta", "Encerrar conversa"]
    };

    setMessages(prev => [...prev, iaMsg]);
    
    // Limpa contexto para nova conversa
    setCurrentContext({});
  };

  const handleContinueOption = (option: string) => {
    const userMsg: Message = {
      id: Date.now().toString(),
      content: option,
      isUser: true,
      timestamp: new Date()
    };

    setMessages(prev => [...prev, userMsg]);

    setTimeout(() => {
      if (option === "Fazer outra consulta") {
        const iaMsg: Message = {
          id: (Date.now() + 1).toString(),
          content: "Sobre qual informação você gostaria de saber agora?",
          isUser: false,
          timestamp: new Date(),
          hasOptions: true,
          options: [
            "Localização da escola",
            "Etapas de ensino oferecidas", 
            "Número de matrículas",
            "Infraestrutura disponível",
            "Corpo docente e funcionários",
            "Indicadores de desempenho",
            "Todas as informações"
          ]
        };
        setMessages(prev => [...prev, iaMsg]);
      } else {
        const iaMsg: Message = {
          id: (Date.now() + 1).toString(),
          content: "Obrigado por usar nosso serviço! Estarei aqui quando precisar de mais informações sobre o Censo Escolar.",
          isUser: false,
          timestamp: new Date()
        };
        setMessages(prev => [...prev, iaMsg]);
      }
    }, 500);
  };

  const handleKeyPress = (e: React.KeyboardEvent<HTMLInputElement>) => {
    if (e.key === 'Enter' && !e.shiftKey) {
      e.preventDefault();
      handleSendMessage();
    }
  };

  return (
    <div className="min-h-screen bg-background text-text transition-colors duration-500">
      
      <div className="max-w-[95%] sm:max-w-[90%] md:max-w-[80%] mx-auto px-3 sm:px-4 py-8">
        
        <div className="bg-card-alt rounded-2xl transition-all duration-500 w-full h-[75vh] min-h-[600px] max-h-[800px] flex flex-col shadow-2xl hover:shadow-3xl"
             style={{ boxShadow: '20px 20px 50px rgba(0, 0, 0, 0.6)' }}>
          
          <div className="flex-1 overflow-y-auto p-4 sm:p-6 space-y-4 bg-card-alt rounded-t-2xl transition-colors duration-500">
            {messages.map((message) => (
              <div
                key={message.id}
                className={`flex ${message.isUser ? 'justify-end' : 'justify-start'} items-start gap-3 transition-all duration-500`}
              >
                
                {!message.isUser && (
                  <div className="w-8 h-8 sm:w-10 sm:h-10 rounded-full flex items-center justify-center flex-shrink-0 transition-colors duration-500">
                    <img 
                      src="/RAG/Aluno-IA.png" 
                      alt="Aluno IA"
                      className="w-8 h-8 sm:w-10 sm:h-10 rounded-full object-cover transition-colors duration-500"
                    />
                  </div>
                )}
                
                <div
                  className={`max-w-[75%] rounded-[25px] p-3 sm:p-4 transition-all duration-500 ${
                    message.isUser
                      ? 'bg-[#2C80FF] text-white' 
                      : 'bg-[#2C80FF] bg-opacity-50 text-white'
                  }`}
                >
                  <div 
                    className="whitespace-pre-wrap text-white leading-relaxed transition-colors duration-500"
                    style={{ 
                      fontFamily: "'Sansita', sans-serif",
                      fontSize: '14px sm:text-base',
                      lineHeight: '1.5'
                    }}
                  >
                    {message.content}
                  </div>

                  {message.hasMainButton && (
                    <button
                      onClick={handleMainButtonClick}
                      className="mt-4 bg-[#2C80FF] text-white rounded-[20px] px-6 py-3 hover:bg-[#1a6fd8] transition-all duration-500 flex items-center gap-2 hover:scale-105 active:scale-95 font-semibold"
                      style={{ fontFamily: "'Sansita', sans-serif" }}
                    >
                      Consultar informações
                      <FontAwesomeIcon icon={faChevronDown} />
                    </button>
                  )}

                  {message.hasOptions && message.options && (
                    <div className="mt-4 flex flex-col gap-2 transition-colors duration-500">
                      {message.options.map((option, index) => (
                        <button
                          key={index}
                          onClick={() => option === "Fazer outra consulta" || option === "Encerrar conversa" ? handleContinueOption(option) : handleOptionSelect(option)}
                          className="bg-[#2C80FF] text-white rounded-[20px] px-4 py-2 text-sm hover:bg-[#1a6fd8] transition-all duration-500 hover:scale-105 active:scale-95 text-left"
                          style={{ fontFamily: "'Sansita', sans-serif" }}
                        >
                          {option}
                        </button>
                      ))}
                    </div>
                  )}

                  {message.hasDownload && (
                    <button
                      onClick={handleDownload}
                      className="mt-4 bg-[#2C80FF] bg-opacity-50 text-white rounded-[25px] px-6 py-3 hover:bg-[#1a6fd8] transition-all duration-500 flex items-center gap-2 hover:scale-105 active:scale-95 font-semibold"
                      style={{ fontFamily: "'Sansita', sans-serif" }}
                    >
                      <FontAwesomeIcon icon={faDownload} />
                      Baixar Relatório PDF
                    </button>
                  )}

                  {message.hasContinue && (
                    <button
                      onClick={handleContinue}
                      className="mt-4 bg-[#2C80FF] text-white rounded-[20px] px-6 py-3 hover:bg-[#1a6fd8] transition-all duration-500 hover:scale-105 active:scale-95 font-semibold"
                      style={{ fontFamily: "'Sansita', sans-serif" }}
                    >
                      Continuar
                    </button>
                  )}
                </div>

                {message.isUser && (
                  <div className="w-8 h-8 sm:w-10 sm:h-10 rounded-full flex items-center justify-center flex-shrink-0 transition-colors duration-500">
                    <img 
                      src="/RAG/Usuário.png" 
                      alt="Usuário"
                      className="w-8 h-8 sm:w-10 sm-h-10 rounded-full object-cover transition-colors duration-500"
                    />
                  </div>
                )}
              </div>
            ))}
            <div ref={messagesEndRef} />
          </div>

          <div className="border-t border-theme p-4 sm:p-5 bg-card-alt rounded-b-2xl transition-colors duration-500">
            <div className="flex gap-3 items-center transition-colors duration-500">
              <div className="text-gray-400 transition-colors duration-500">
                <FontAwesomeIcon icon={faSearch} />
              </div>
              
              <div className="flex-1 relative transition-colors duration-500">
                <input
                  type="text"
                  value={inputMessage}
                  onChange={(e) => setInputMessage(e.target.value)}
                  onKeyDown={handleKeyPress}
                  placeholder="Digite o nome da escola e a cidade..."
                  className="w-full bg-transparent border border-theme rounded-2xl px-4 py-2 sm:py-3 text-text placeholder-gray-400 focus:outline-none focus:border-primary transition-all duration-500 text-sm sm:text-base"
                  style={{ fontFamily: "'Sansita', sans-serif" }}
                />
              </div>
              
              <button
                onClick={handleSendMessage}
                disabled={!inputMessage.trim()}
                className="bg-primary text-white rounded-2xl px-4 py-2 sm:px-6 sm:py-3 hover:bg-[#1a6fd8] disabled:bg-gray-600 disabled:cursor-not-allowed transition-all duration-500 hover:scale-105 active:scale-95 font-semibold text-sm sm:text-base"
                style={{ fontFamily: "'Sansita', sans-serif" }}
              >
                Enviar
              </button>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
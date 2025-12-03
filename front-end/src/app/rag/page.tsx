'use client';
import { useState, useRef, useEffect } from 'react';
import Link from 'next/link';
import {
  Send,
  Loader2,
  Download,
  Search,
  ChevronRight,
  MessageSquare,
  Sparkles
} from 'lucide-react';
import { sendMessageToRAG } from '../../services/chat-service';

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
  structuredData?: any[];
  nextPage?: number;
  originalQuery?: string;
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

export default function RAGPage() {
  const [messages, setMessages] = useState<Message[]>([
    {
      id: '1',
      content: "Olá! Sou o Aluno, sua assistente de IA para informações do Censo Escolar. Como posso te ajudar hoje?",
      isUser: false,
      timestamp: new Date()
    }
  ]);
  const [inputMessage, setInputMessage] = useState('');
  const [isLoading, setIsLoading] = useState(false);
  const chatContainerRef = useRef<HTMLDivElement>(null);

  const scrollToBottom = () => {
    if (chatContainerRef.current) {
      chatContainerRef.current.scrollTop = chatContainerRef.current.scrollHeight;
    }
  };

  useEffect(() => {
    scrollToBottom();
  }, [messages, isLoading]);

  const suggestions = [
    { icon: <Search size={20} />, text: "Qual a melhor escola de Brasília?" },
    { icon: <img src="/images/ai-avatar.png" alt="AI" className="w-5 h-5 object-contain" />, text: "Mostre dados do Rio de Janeiro" },
    { icon: <Sparkles size={20} />, text: "Compare escolas públicas e privadas" },
    { icon: <MessageSquare size={20} />, text: "Quais escolas têm laboratório?" },
  ];


  const generatePDF = (escola: SchoolData, consultType: string) => {
    const baseUrl = window.location.origin;
    const now = new Date();
    const dataHora = now.toLocaleDateString('pt-BR') + ' às ' + now.toLocaleTimeString('pt-BR');

    // Define o título baseado no tipo de consulta
    let tituloRelatorio = '';
    switch (consultType) {
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

  const handleUserResponse = async (userInput: string) => {
    if (!userInput.trim()) return;

    const userMsg: Message = {
      id: Date.now().toString(),
      content: userInput,
      isUser: true,
      timestamp: new Date()
    };

    setMessages(prev => [...prev, userMsg]);
    setInputMessage('');
    setIsLoading(true);

    try {
      const response = await sendMessageToRAG(userInput, 1);

      const iaMsg: Message = {
        id: (Date.now() + 1).toString(),
        content: response.resposta || "Desculpe, não consegui obter uma resposta.",
        isUser: false,
        timestamp: new Date(),
        structuredData: response.structuredData,
        nextPage: response.structuredData && response.structuredData.length >= 15 ? 2 : undefined,
        originalQuery: userInput
      };

      setMessages(prev => [...prev, iaMsg]);
    } catch (error) {
      console.error("Erro ao enviar mensagem:", error);
      const errorMsg: Message = {
        id: (Date.now() + 1).toString(),
        content: "Desculpe, ocorreu um erro ao processar sua mensagem.",
        isUser: false,
        timestamp: new Date()
      };
      setMessages(prev => [...prev, errorMsg]);
    } finally {
      setIsLoading(false);
    }
  };

  const handleLoadMore = async (originalQuery: string, page: number) => {
    setIsLoading(true);
    try {
      const response = await sendMessageToRAG(originalQuery, page);
      const iaMsg: Message = {
        id: Date.now().toString(),
        content: `Carregando mais resultados (página ${page})...`,
        isUser: false,
        timestamp: new Date(),
        structuredData: response.structuredData,
        nextPage: response.structuredData && response.structuredData.length >= 15 ? page + 1 : undefined,
        originalQuery: originalQuery
      };
      setMessages(prev => [...prev, iaMsg]);
    } catch (error) {
      console.error("Erro ao carregar mais:", error);
    } finally {
      setIsLoading(false);
    }
  };

  const handleSendMessage = () => {
    handleUserResponse(inputMessage);
  };

  const handleKeyPress = (e: React.KeyboardEvent<HTMLInputElement>) => {
    if (e.key === 'Enter' && !e.shiftKey) {
      e.preventDefault();
      handleSendMessage();
    }
  };

  return (
    <div className="flex flex-col h-[calc(100vh-80px)] bg-background text-text transition-colors duration-500 font-sans">

      {/* Área de Chat */}
      <div
        ref={chatContainerRef}
        className="flex-1 overflow-y-auto p-4 sm:p-6 space-y-6 scroll-smooth"
      >
        {messages.length === 0 ? (
          // Empty State
          <div className="h-full flex flex-col items-center justify-center space-y-8 opacity-0 animate-fade-in" style={{ animationFillMode: 'forwards' }}>
            <div className="text-center space-y-4">
              <div className="w-20 h-20 bg-transparent rounded-full flex items-center justify-center mx-auto mb-6">
                <img src="/images/ai-avatar.png" alt="AI Avatar" className="w-full h-full object-cover rounded-full" />
              </div>
              <h2 className="text-3xl font-bold font-display" style={{ fontFamily: "'Sansita', sans-serif" }}>
                Como posso ajudar hoje?
              </h2>
              <p className="text-gray-500 dark:text-gray-400 max-w-md mx-auto">
                Explore dados do Censo Escolar, compare escolas e descubra estatísticas educacionais.
              </p>
            </div>

            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 w-full max-w-2xl px-4">
              {suggestions.map((suggestion, idx) => (
                <button
                  key={idx}
                  onClick={() => handleUserResponse(suggestion.text)}
                  className="flex items-center gap-3 p-4 bg-card hover:bg-card-alt border border-theme rounded-xl text-left transition-all hover:scale-[1.02] hover:shadow-lg group"
                >
                  <div className="p-2 bg-background rounded-lg text-primary group-hover:bg-primary group-hover:text-white transition-colors">
                    {suggestion.icon}
                  </div>
                  <span className="font-medium text-sm sm:text-base">{suggestion.text}</span>
                </button>
              ))}
            </div>
          </div>
        ) : (
          // Lista de Mensagens
          <div className="max-w-4xl mx-auto w-full space-y-6 pb-4">
            {messages.map((message) => (
              <div
                key={message.id}
                className={`flex items-start gap-4 ${message.isUser ? 'flex-row-reverse' : 'flex-row'} animate-slide-up`}
              >
                {/* Avatar */}
                <div className={`w-10 h-10 rounded-full flex items-center justify-center flex-shrink-0 shadow-sm ${message.isUser ? 'bg-transparent' : 'bg-transparent border border-theme text-primary'
                  }`}>
                  {message.isUser ? <img src="/RAG/Usuário.png" alt="User" className="w-full h-full object-cover rounded-full" /> : <img src="/images/ai-avatar.png" alt="AI" className="w-full h-full object-cover rounded-full" />}
                </div>

                {/* Bolha de Mensagem */}
                <div className={`flex flex-col max-w-[85%] sm:max-w-[75%] space-y-2 ${message.isUser ? 'items-end' : 'items-start'}`}>
                  <div
                    className={`p-4 shadow-sm relative text-sm sm:text-base leading-relaxed ${message.isUser
                      ? 'bg-primary text-white rounded-2xl rounded-tr-sm'
                      : 'bg-card text-text border border-theme rounded-2xl rounded-tl-sm'
                      }`}
                    style={{ fontFamily: "'Sansita', sans-serif" }}
                  >
                    <div className="whitespace-pre-wrap">{message.content}</div>
                  </div>

                  {/* Dados Estruturados (Escolas) */}
                  {message.structuredData && message.structuredData.length > 0 && (
                    <div className="w-full grid gap-3 mt-2">
                      <div className="text-xs font-bold text-gray-500 uppercase tracking-wider ml-1">
                        Escolas Encontradas
                      </div>
                      {message.structuredData.map((school: any, idx: number) => (
                        <Link
                          href={`/dashboard/${school.identificacao.id_escola}`}
                          key={idx}
                          className="block group"
                        >
                          <div className="bg-card hover:bg-card-alt border border-theme p-4 rounded-xl transition-all duration-300 hover:shadow-lg hover:border-primary/50 hover:scale-[1.02] flex justify-between items-center">
                            <div>
                              <div className="font-bold text-primary group-hover:text-primary/80 transition-colors" style={{ fontFamily: "'Sansita', sans-serif" }}>
                                {school.identificacao.nome_escola}
                              </div>
                              <div className="text-xs text-gray-500 mt-1 flex items-center gap-2">
                                <span>{school.localizacao.geografia.municipio} - {school.localizacao.geografia.uf}</span>
                                <span className="w-1 h-1 bg-gray-400 rounded-full"></span>
                                <span>{school.identificacao.dependencia}</span>
                              </div>
                            </div>
                            <ChevronRight size={16} className="text-gray-400 group-hover:text-primary transition-colors" />
                          </div>
                        </Link>
                      ))}

                      {message.nextPage && message.originalQuery && (
                        <button
                          onClick={() => handleLoadMore(message.originalQuery!, message.nextPage!)}
                          className="mt-2 text-primary text-sm font-bold hover:underline self-start flex items-center gap-1 cursor-pointer"
                        >
                          Carregar mais resultados <ChevronRight size={14} />
                        </button>
                      )}
                    </div>
                  )}

                  {/* Botão de Download PDF */}
                  {message.hasDownload && message.schoolData && (
                    <button
                      onClick={() => generatePDF(message.schoolData!, message.consultType || 'Relatório')}
                      className="flex items-center gap-2 bg-card hover:bg-card-alt border border-theme px-4 py-2 rounded-lg text-sm font-medium transition-colors text-primary"
                    >
                      <Download size={16} />
                      Baixar Relatório PDF
                    </button>
                  )}
                </div>
              </div>
            ))}

            {/* Loading Indicator */}
            {isLoading && (
              <div className="flex items-start gap-4">
                <div className="w-10 h-10 rounded-full bg-transparent border border-theme flex items-center justify-center text-primary">
                  <img src="/images/ai-avatar.png" alt="AI" className="w-full h-full object-cover rounded-full" />
                </div>
                <div className="bg-card border border-theme px-4 py-3 rounded-2xl rounded-tl-sm flex items-center gap-2">
                  <Loader2 size={18} className="animate-spin text-primary" />
                  <span className="text-sm text-gray-500">Processando...</span>
                </div>
              </div>
            )}
          </div>
        )}
      </div>

      {/* Input Area */}
      <div className="p-4 bg-background/80 backdrop-blur-md border-t border-theme sticky bottom-0 z-10">
        <div className="max-w-4xl mx-auto relative flex items-center gap-3">
          <div className="relative flex-1">
            <input
              type="text"
              value={inputMessage}
              onChange={(e) => setInputMessage(e.target.value)}
              onKeyDown={handleKeyPress}
              placeholder="Digite sua pergunta sobre escolas..."
              className="w-full bg-card border border-theme rounded-full pl-6 pr-12 py-4 text-text placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-primary/50 focus:border-primary transition-all shadow-sm"
              style={{ fontFamily: "'Sansita', sans-serif" }}
            />
            <button
              onClick={handleSendMessage}
              disabled={!inputMessage.trim() || isLoading}
              className="absolute right-2 top-1/2 -translate-y-1/2 p-2 bg-primary text-white rounded-full hover:bg-primary/90 disabled:opacity-50 disabled:cursor-not-allowed transition-all hover:scale-105 active:scale-95 shadow-md"
            >
              <Send size={20} />
            </button>
          </div>
        </div>
        <div className="text-center mt-2">
          <p className="text-[10px] text-gray-400">
            A IA pode cometer erros. Verifique as informações importantes.
          </p>
        </div>
      </div>
    </div>
  );
}
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
}

export default function RAGPage() {
  const [messages, setMessages] = useState<Message[]>([
    {
      id: '1',
      content: "Olá, sou o Aluno, a IA que ajudará você com informações do Censo Escolar. Em que posso ajudá-lo hoje?",
      isUser: false,
      timestamp: new Date(),
      hasMainButton: true
    }
  ]);
  const [inputMessage, setInputMessage] = useState('');
  const messagesEndRef = useRef<HTMLDivElement>(null);

  const scrollToBottom = () => {
    messagesEndRef.current?.scrollIntoView({ behavior: "smooth" });
  };

  useEffect(() => {
    scrollToBottom();
  }, [messages]);

  // DADOS MOCKADOS BASEADOS NO CENSO ESCOLAR
  const SCHOOLS_DATA = {
    "escola notre dame campinas": {
      nome: "Escola Notre Dame - Campinas/SP",
      acesso_internet: true,
      localizacao: {
        endereco: "Rua das Flores, 123 - Centro",
        municipio: "Campinas",
        estado: "SP",
        zona: "Urbana"
      },
      matriculas: {
        total: 850,
        fundamental: 520,
        medio: 330
      },
      contato: {
        telefone: "(19) 1234-5678",
        email: "contato@notredamecampinas.edu.br"
      }
    },
    "escola estadual sao paulo": {
      nome: "Escola Estadual São Paulo - São Paulo/SP", 
      acesso_internet: false,
      localizacao: {
        endereco: "Av. Paulista, 1000 - Bela Vista",
        municipio: "São Paulo", 
        estado: "SP",
        zona: "Urbana"
      },
      matriculas: {
        total: 1200,
        fundamental: 800,
        medio: 400
      }
    }
  };

  const handleMainButtonClick = () => {
    const userMsg: Message = {
      id: Date.now().toString(),
      content: "Gostaria de consultar informações sobre uma escola",
      isUser: true,
      timestamp: new Date()
    };

    const iaMsg: Message = {
      id: (Date.now() + 1).toString(),
      content: "Sobre qual aspecto você gostaria de informações?",
      isUser: false,
      timestamp: new Date(),
      hasOptions: true,
      options: ["Acesso à Internet", "Localização", "Número de Matrículas", "Informações Completas"]
    };

    setMessages(prev => [...prev, userMsg, iaMsg]);
  };

  const handleOptionSelect = (option: string) => {
    const userMsg: Message = {
      id: Date.now().toString(),
      content: option,
      isUser: true,
      timestamp: new Date()
    };

    setMessages(prev => [...prev, userMsg]);

    setTimeout(() => {
      let response = "";

      switch(option) {
        case "Acesso à Internet":
          response = "Posso verificar se a escola possui acesso à internet. Qual o nome e município da escola?";
          break;
        case "Localização":
          response = "Posso fornecer a localização completa da escola. De qual escola você precisa?";
          break;
        case "Número de Matrículas":
          response = "Tenho dados sobre o número de matrículas. Informe o nome e município da escola:";
          break;
        case "Informações Completas":
          response = "Posso fornecer todas as informações disponíveis sobre a escola. Qual escola você gostaria de consultar?";
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
      const inputLower = userInput.toLowerCase();
      let response = "";
      let hasDownload = false;
      let hasContinue = false;

      // Detecta escola específica
      if (inputLower.includes("notre dame") && inputLower.includes("campinas")) {
        const escola = SCHOOLS_DATA["escola notre dame campinas"];
        
        if (inputLower.includes("internet")) {
          response = `Sobre o acesso à internet da Escola Notre Dame - Campinas/SP:\n\nA escola possui acesso à internet: Sim\n\nEsta informação é baseada no Censo Escolar 2023.`;
          hasDownload = true;
        } else if (inputLower.includes("localização") || inputLower.includes("localizacao") || inputLower.includes("onde fica")) {
          response = `Localização da Escola Notre Dame - Campinas/SP:\n\nEndereço: Rua das Flores, 123 - Centro\nMunicípio: Campinas\nEstado: SP\nZona: Urbana\n\nTelefone: (19) 1234-5678\nEmail: contato@notredamecampinas.edu.br`;
          hasDownload = true;
        } else if (inputLower.includes("matrícula") || inputLower.includes("matricula") || inputLower.includes("aluno")) {
          response = `Número de matrículas - Escola Notre Dame - Campinas/SP (2023):\n\nTotal de alunos: 850\nEnsino Fundamental: 520\nEnsino Médio: 330\n\nFonte: Censo Escolar 2023 - INEP`;
          hasDownload = true;
        } else {
          response = `Informações completas - Escola Notre Dame - Campinas/SP:\n\n• Acesso à internet: Sim\n• Total de matrículas: 850 alunos\n• Localização: Campinas - SP (Zona Urbana)\n• Endereço: Rua das Flores, 123 - Centro\n\nDados do Censo Escolar 2023 - INEP`;
          hasDownload = true;
        }
        
        hasContinue = true;

      } else if (inputLower.includes("escola estadual") && inputLower.includes("são paulo")) {
        const escola = SCHOOLS_DATA["escola estadual sao paulo"];
        
        if (inputLower.includes("internet")) {
          response = `Sobre o acesso à internet da Escola Estadual São Paulo - São Paulo/SP:\n\nA escola possui acesso à internet: Não\n\nSegundo o Censo Escolar 2023, esta escola não possui infraestrutura de internet.`;
          hasDownload = true;
        } else if (inputLower.includes("localização") || inputLower.includes("localizacao")) {
          response = `Localização da Escola Estadual São Paulo - São Paulo/SP:\n\nEndereço: Av. Paulista, 1000 - Bela Vista\nMunicípio: São Paulo\nEstado: SP\nZona: Urbana`;
          hasDownload = true;
        } else if (inputLower.includes("matrícula") || inputLower.includes("matricula")) {
          response = `Número de matrículas - Escola Estadual São Paulo - São Paulo/SP (2023):\n\nTotal de alunos: 1.200\nEnsino Fundamental: 800\nEnsino Médio: 400\n\nFonte: Censo Escolar 2023 - INEP`;
          hasDownload = true;
        } else {
          response = `Informações completas - Escola Estadual São Paulo - São Paulo/SP:\n\n• Acesso à internet: Não\n• Total de matrículas: 1.200 alunos\n• Localização: São Paulo - SP (Zona Urbana)\n• Endereço: Av. Paulista, 1000 - Bela Vista\n\nDados do Censo Escolar 2023 - INEP`;
          hasDownload = true;
        }
        
        hasContinue = true;

      } else {
        response = "Não localizei essa escola nos dados atuais. Você pode tentar consultar:\n\n• Escola Notre Dame Campinas\n• Escola Estadual São Paulo\n\nVerifique se o nome e município estão corretos.";
      }

      const iaMsg: Message = {
        id: (Date.now() + 1).toString(),
        content: response,
        isUser: false,
        timestamp: new Date(),
        hasDownload: hasDownload,
        hasContinue: hasContinue
      };

      setMessages(prev => [...prev, iaMsg]);
    }, 800);
  };

  const handleSendMessage = () => {
    handleUserResponse(inputMessage);
  };

  const handleDownload = () => {
    const lastMessage = messages[messages.length - 1];
    const escolaMatch = lastMessage.content.match(/Escola (.+?) -/);
    const escolaNome = escolaMatch ? escolaMatch[1] : 'Escola Consultada';
    
    alert(`Relatório baixado com sucesso!\n\nEscola: ${escolaNome}\nDados: Censo Escolar 2023 - INEP\nFormato: PDF\n\nO relatório foi salvo em sua pasta de Downloads.`);
  };

  const handleContinue = () => {
    const iaMsg: Message = {
      id: Date.now().toString(),
      content: "Posso ajudá-lo com algo mais?",
      isUser: false,
      timestamp: new Date(),
      hasOptions: true,
      options: ["Nova Consulta", "Encerrar Atendimento"]
    };

    setMessages(prev => [...prev, iaMsg]);
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
      if (option === "Nova Consulta") {
        const iaMsg: Message = {
          id: (Date.now() + 1).toString(),
          content: "Sobre qual aspecto você gostaria de informações?",
          isUser: false,
          timestamp: new Date(),
          hasOptions: true,
          options: ["Acesso à Internet", "Localização", "Número de Matrículas", "Informações Completas"]
        };
        setMessages(prev => [...prev, iaMsg]);
      } else {
        const iaMsg: Message = {
          id: (Date.now() + 1).toString(),
          content: "Obrigado por utilizar nosso serviço. Estarei à disposição para futuras consultas.",
          isUser: false,
          timestamp: new Date()
        };
        setMessages(prev => [...prev, iaMsg]);
      }
    }, 500);
  };

  const handleKeyPress = (e: React.KeyboardEvent) => {
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
                          onClick={() => option === "Nova Consulta" || option === "Encerrar Atendimento" ? handleContinueOption(option) : handleOptionSelect(option)}
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
                      className="mt-4 bg-[#2C80FF] text-white rounded-[20px] px-6 py-3 hover:bg-[#1a6fd8] transition-all duration-500 flex items-center gap-2 hover:scale-105 active:scale-95 font-semibold"
                      style={{ fontFamily: "'Sansita', sans-serif" }}
                    >
                      <FontAwesomeIcon icon={faDownload} />
                      Baixar Relatório
                    </button>
                  )}

                  {message.hasContinue && (
                    <button
                      onClick={handleContinue}
                      className="mt-4 bg-[#2C80FF] text-white rounded-[20px] px-6 py-3 hover:bg-[#1a6fd8] transition-all duration-500 hover:scale-105 active:scale-95 font-semibold"
                      style={{ fontFamily: "'Sansita', sans-serif" }}
                    >
                      Continuar Consulta
                    </button>
                  )}
                </div>

                {message.isUser && (
                  <div className="w-8 h-8 sm:w-10 sm:h-10 rounded-full flex items-center justify-center flex-shrink-0 transition-colors duration-500">
                    <img 
                      src="/RAG/Usuário.png" 
                      alt="Usuário"
                      className="w-8 h-8 sm:w-10 sm:h-10 rounded-full object-cover transition-colors duration-500"
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
                  onKeyPress={handleKeyPress}
                  placeholder="Digite o nome da escola e município..."
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
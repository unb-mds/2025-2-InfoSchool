'use client';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faLocationDot, faRobot } from '@fortawesome/free-solid-svg-icons';
import { ScrollAnimation } from '@/modules/shared/components';

const DEVELOPERS = [
  { photo: "/photos/dev1.jpg", name: "Leonardo da Silva", borderColor: "border-blue-500" },
  { photo: "/photos/dev2.jpg", name: "João Leles", borderColor: "border-green-500" },
  { photo: "/photos/dev3.jpg", name: "Fábio Alessandro", borderColor: "border-purple-500" },
  { photo: "/photos/dev4.jpg", name: "Davi Ursulino", borderColor: "border-yellow-500" },
  { photo: "/photos/dev5.jpg", name: "Pedro Gomes", borderColor: "border-red-500" },
  { photo: "/photos/dev6.jpg", name: "Pedro Augusto", borderColor: "border-pink-500" },
];

export default function Inicial() {
  const handleExplorarEscolas = () => {
    window.location.href = '/explorar-escolas';
  };

  return (
    <div className="min-h-screen bg-background text-text transition-colors duration-500">
      
      {/* ========== SEÇÃO HERO - TÍTULO E IMAGEM ========== */}
      <section className="max-w-[95%] sm:max-w-[90%] md:max-w-[80%] mx-auto px-3 sm:px-4 py-6 md:py-16"> 
        <div className="flex flex-col lg:flex-row items-center lg:items-start gap-8 lg:gap-12">
          
          {/* CONTEÚDO DE TEXTO */}
          <div className="flex-1 lg:flex-[0.6] pt-4 lg:pt-8 w-full">
            <ScrollAnimation direction="up" duration={500} delay={100}>
              <h1 className="text-3xl sm:text-4xl md:text-5xl lg:text-6xl font-bold mb-4 md:mb-6 leading-tight text-center lg:text-left"
                  style={{ fontFamily: "'Rammetto One', cursive" }}>
                Conheça a educação<br />
                do <span className="text-primary">Brasil</span><br />
                em cada <span className="text-primary">detalhe</span>
              </h1>
            </ScrollAnimation>
            
            <ScrollAnimation direction="up" duration={500} delay={200}>
              <p className="text-lg sm:text-xl md:text-2xl text-text mb-6 md:mb-10 leading-relaxed text-center lg:text-left max-w-2xl mx-auto lg:mx-0"
                 style={{ fontFamily: "'Sansita', sans-serif" }}>
                Nosso site tem o objetivo de informar sobre as principais informações 
                escolares em todo o Brasil, utilizando o censo escolar
              </p>
            </ScrollAnimation>
            
            <ScrollAnimation direction="up" duration={500} delay={300}>
              <div className="text-center lg:text-left">
                  <button 
                    onClick={handleExplorarEscolas}
                    className="bg-primary text-white rounded-[25px] hover:bg-[#1a6fd8] transition-all duration-500 px-6 sm:px-8 md:px-10 py-3 md:py-4 text-lg sm:text-xl font-semibold hover:scale-105 active:scale-100 w-full sm:w-auto cursor-pointer"
                    style={{ fontFamily: "'Rammetto One', cursive"}}>
                    Explorar escolas
                  </button>
              </div>
            </ScrollAnimation>
          </div>
          
          {/* IMAGEM TV - CORREÇÃO: centralizar em mobile */}
          <div className="flex-1 lg:flex-[0.4] flex justify-center w-full">
            <ScrollAnimation direction="up" duration={600} delay={400}>
              <div className="w-full max-w-[300px] sm:max-w-[400px] lg:max-w-[550px] mx-auto flex justify-center">
                <img 
                  src="/images/Tv.svg"
                  alt="Ilustração educação" 
                  className="w-full h-auto object-contain transition-colors duration-500"
                />
              </div>
            </ScrollAnimation>
          </div>
        </div>
      </section>

      {/* ========== SEÇÃO COMO FUNCIONA - 2 CARDS ========== */}
      <section className="max-w-[95%] sm:max-w-[90%] md:max-w-[85%] lg:max-w-[80%] mx-auto px-3 sm:px-4 py-6 md:py-16">
        <ScrollAnimation direction="up" duration={500} delay={100}>
          <h2 className="text-3xl sm:text-4xl md:text-5xl font-bold text-center mb-8 md:mb-12 transition-colors duration-500"
              style={{ fontFamily: "'Rammetto One', cursive" }}>
            Como funciona
          </h2>
        </ScrollAnimation>
        
        {/* GRID DE CARDS - AGORA SÓ 2 CARDS */}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-5 md:gap-6 lg:gap-8 justify-items-center max-w-4xl mx-auto">
          
          {/* CARD 1 - CAMINHO NORMAL */}
          <ScrollAnimation direction="up" duration={500} delay={150}>
            <a href="/mapa" className="w-full flex justify-center">
              <div className="bg-card-alt rounded-2xl p-5 sm:p-6 text-center transition-all duration-500 w-full max-w-[320px] sm:max-w-[340px] h-[280px] sm:h-[300px] flex flex-col justify-center items-center cursor-pointer transform hover:scale-105 active:scale-95 shadow-2xl hover:shadow-3xl"
                   style={{ boxShadow: '20px 20px 50px rgba(0, 0, 0, 0.6)' }}>
                <span className="mb-4 transition-colors duration-500">
                  <FontAwesomeIcon 
                    icon={faLocationDot} 
                    className="text-primary"
                    style={{ width: "36px", height: "36px" }} 
                  />
                </span>
                <h3 className="mb-3 text-xl sm:text-2xl text-text transition-colors duration-500 font-bold"
                    style={{ 
                      fontFamily: "'Rammetto One', cursive",
                      textShadow: '0 0 40px currentColor'
                    }}>
                  Caminho normal
                </h3>
                <p className="text-text text-sm sm:text-base transition-colors duration-500 px-3 leading-relaxed"
                   style={{ fontFamily: "'Sansita', sans-serif" }}>
                  Você pode navegar manualmente com as nossas páginas interativas 
                </p>
              </div>
            </a>
          </ScrollAnimation>

          {/* CARD 2 - CAMINHO DA IA */}
          <ScrollAnimation direction="up" duration={500} delay={200}>
            <a href="/rag" className="w-full flex justify-center">
              <div className="bg-card-alt rounded-2xl p-5 sm:p-6 text-center transition-all duration-500 w-full max-w-[320px] sm:max-w-[340px] h-[280px] sm:h-[300px] flex flex-col justify-center items-center cursor-pointer transform hover:scale-105 active:scale-95 shadow-2xl hover:shadow-3xl"
                   style={{ boxShadow: '20px 20px 50px rgba(0, 0, 0, 0.6)' }}>
                <span className="mb-4 transition-colors duration-500">
                  <FontAwesomeIcon 
                    icon={faRobot} 
                    className="text-primary"
                    style={{ width: "36px", height: "36px" }} 
                  />
                </span>
                <h3 className="mb-3 text-xl sm:text-2xl text-text transition-colors duration-500 font-bold"
                    style={{ 
                      fontFamily: "'Rammetto One', cursive",
                      textShadow: '0 0 40px currentColor'
                    }}>
                  Caminho da IA
                </h3>
                <p className="text-text text-sm sm:text-base transition-colors duration-500 px-3 leading-relaxed"
                   style={{ fontFamily: "'Sansita', sans-serif" }}>
                  Você pode digitar ou falar o que deseja e ir direto ao dashboard com as informações.
                </p>
              </div>
            </a>
          </ScrollAnimation>
        </div>
      </section>

      {/* ========== SEÇÃO SOBRE NÓS - DESCRIÇÃO E DESENVOLVEDORES ========== */}
      <section id="sobre-nos-section" className="max-w-[95%] sm:max-w-[90%] md:max-w-[80%] mx-auto px-3 sm:px-4 py-8 md:py-12 lg:py-20">
        <ScrollAnimation direction="up" duration={500} delay={100}>
          <h2 className="text-3xl sm:text-4xl md:text-5xl font-bold text-center mb-12 md:mb-16 transition-colors duration-500"
              style={{ fontFamily: "'Rammetto One', cursive" }}>
            Sobre nós
          </h2>
        </ScrollAnimation>
        
        {/* DESCRIÇÃO DO PROJETO */}
        <ScrollAnimation direction="up" duration={500} delay={150}>
          <div className="flex flex-col lg:flex-row gap-8 md:gap-12 items-start mb-12 md:mb-16">
            <div className="lg:flex-1 w-full">
              <div className="bg-card rounded-2xl p-6 md:p-8 transition-colors duration-500 shadow-2xl"
                   style={{ boxShadow: '30px 30px 70px rgba(0, 0, 0, 0.5)' }}>
                <p className="text-base md:text-lg lg:text-xl leading-relaxed text-justify md:text-left text-text transition-colors duration-500"
                   style={{ fontFamily: "'Sansita', sans-serif" }}>
                  O InfoSchool é uma plataforma criada com o objetivo de aproximar a comunidade acadêmica e a sociedade dos dados do Censo Escolar, a maior pesquisa estatística sobre educação básica no Brasil. Nosso propósito é tornar essas informações mais acessíveis, visuais e compreensíveis para estudantes, professores e gestores. Aqui você encontra dados organizados de forma clara e interativa, permitindo compreender melhor os desafios e avanços da educação no país. Acreditamos que, ao transformar números em conhecimento, é possível promover reflexões e ações que impactem positivamente o futuro da educação.
                </p>
              </div>
            </div>
          </div>
        </ScrollAnimation>

        {/* LINHA DIVISÓRIA */}
        <div className="border-t border-theme my-12 md:my-16 transition-colors duration-500"></div>

        {/* GRID DE DESENVOLVEDORES*/}
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4 md:gap-6 lg:gap-8 justify-items-center w-full">
          
          {/* DESENVOLVEDOR 1 - Leonardo - AZUL */}
          <ScrollAnimation direction="up" duration={500} delay={200}>
            <DeveloperCard 
              photo="/photos/dev1.jpg" 
              name="Leonardo da Silva" 
              role="developer"
              borderColor="border-blue-500"
            />
          </ScrollAnimation>
          
          {/* DESENVOLVEDOR 2 - João - VERDE */}
          <ScrollAnimation direction="up" duration={500} delay={250}>
            <DeveloperCard 
              photo="/photos/dev2.jpg" 
              name="João Leles" 
              role="developer"
              borderColor="border-green-500"
            />
          </ScrollAnimation>
          
          {/* DESENVOLVEDOR 3 - Fábio - ROXO */}
          <ScrollAnimation direction="up" duration={500} delay={300}>
            <DeveloperCard 
              photo="/photos/dev3.jpg" 
              name="Fábio Alessandro" 
              role="developer"
              borderColor="border-purple-500"
            />
          </ScrollAnimation>
          
          {/* DESENVOLVEDOR 4 - Davi - AMARELO */}
          <ScrollAnimation direction="up" duration={500} delay={350}>
            <DeveloperCard 
              photo="/photos/dev4.jpg" 
              name="Davi Ursulino" 
              role="developer"
              borderColor="border-yellow-500"
            />
          </ScrollAnimation>
          
          {/* DESENVOLVEDOR 5 - Pedro Gomes - VERMELHO */}
          <ScrollAnimation direction="up" duration={500} delay={400}>
            <DeveloperCard 
              photo="/photos/dev5.jpg" 
              name="Pedro Gomes" 
              role="developer"
              borderColor="border-red-500"
            />
          </ScrollAnimation>
          
          {/* DESENVOLVEDOR 6 - Pedro Augusto - ROSA */}
          <ScrollAnimation direction="up" duration={500} delay={450}>
            <DeveloperCard 
              photo="/photos/dev6.jpg" 
              name="Pedro Augusto" 
              role="developer"
              borderColor="border-pink-500"
            />
          </ScrollAnimation>
        </div>
      </section>
    </div>
  );
}

// ========== COMPONENTE REUTILIZÁVEL PARA CARDS DE DESENVOLVEDOR ==========
interface DeveloperCardProps {
  photo: string;
  name: string;
  role: string;
  borderColor: string;
}

function DeveloperCard({ photo, name, role, borderColor }: DeveloperCardProps) {
  return (
    <div className="text-center w-full">
      <div className="bg-card rounded-2xl p-6 md:p-8 w-full h-64 md:h-72 flex flex-col items-center justify-center transform hover:scale-105 transition-all duration-500"
           style={{ boxShadow: '30px 30px 70px rgba(0, 0, 0, 0.5)' }}>
        <div className="mb-4">
          <img 
            src={photo} 
            alt={name} 
            className={`w-36 h-36 rounded-full object-cover border-2 ${borderColor} transition-colors duration-500`}
          />
        </div>
        <div className="space-y-2">
          <span className="text-xl md:text-2xl font-bold text-text block transition-colors duration-500"
                style={{ fontFamily: "'Rammetto One', cursive" }}>
            {name}
          </span>
          <span className="text-text text-base md:text-lg transition-colors duration-500">{role}</span>
        </div>
      </div>
    </div>
  );
}
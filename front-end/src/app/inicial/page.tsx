// src/app/inicial/page.tsx
'use client';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faTrophy, faLocationDot, faRobot } from '@fortawesome/free-solid-svg-icons';
import { ScrollAnimation } from '@/modules/shared/components';

export default function Inicial() {
  return (
    <div className="min-h-screen bg-background text-text transition-colors duration-500">
      
      {/* ========== SEÇÃO HERO - TÍTULO E IMAGEM ========== */}
      <section className="max-w-[95%] sm:max-w-[90%] md:max-w-[80%] mx-auto px-3 sm:px-4 py-6 md:py-16"> 
        <div className="flex flex-col lg:flex-row items-start gap-8 lg:gap-12">
          
          {/* CONTEÚDO DE TEXTO */}
          <div className="flex-1 lg:flex-[0.6] pt-8">
            <ScrollAnimation direction="up" duration={500} delay={100}>
              <h1 className="text-3xl sm:text-4xl md:text-5xl lg:text-6xl font-bold mb-4 md:mb-6 leading-tight text-left"
                  style={{ fontFamily: "'Rammetto One', cursive" }}>
                Conheça a educação<br />
                do <span className="text-primary">Brasil</span><br />
                em cada <span className="text-primary">detalhe</span>
              </h1>
            </ScrollAnimation>
            
            <ScrollAnimation direction="up" duration={500} delay={200}>
              <p className="text-lg sm:text-xl md:text-2xl text-text mb-6 md:mb-10 leading-relaxed text-left max-w-2xl"
                 style={{ fontFamily: "'Sansita', sans-serif" }}>
                Nosso site tem o objetivo de informar sobre as principais informações 
                escolares em todo o Brasil, utilizando o censo escolar
              </p>
            </ScrollAnimation>
            
            <ScrollAnimation direction="up" duration={500} delay={300}>
              <button className="bg-primary text-white rounded-[25px] hover:bg-[#1a6fd8] transition-all duration-500 px-6 sm:px-8 md:px-10 py-3 md:py-4 text-lg sm:text-xl font-semibold hover:scale-105 active:scale-100 sm:min-w-[200px] cursor-pointer text-center"
                style={{ fontFamily: "'Rammetto One', cursive"}}>
                Explorar escolas
              </button>
            </ScrollAnimation>
          </div>
          
          {/* IMAGEM TV */}
          <div className="flex-1 lg:flex-[0.4] flex justify-center lg:justify-end">
            <ScrollAnimation direction="up" duration={600} delay={400}>
              <div className="w-full max-w-[400px] lg:max-w-[550px]">
                <img 
                  src="/images/Tv.svg"
                  alt="Ilustração educação" 
                  width={637}
                  height={637}
                  className="w-full h-auto object-contain transition-colors duration-500"
                />
              </div>
            </ScrollAnimation>
          </div>
        </div>
      </section>

      {/* ========== SEÇÃO COMO FUNCIONA - 3 CARDS ========== */}
      <section className="max-w-[95%] sm:max-w-[90%] md:max-w-[80%] mx-auto px-3 sm:px-4 py-6 md:py-16">
        <ScrollAnimation direction="up" duration={500} delay={100}>
          <h2 className="text-3xl sm:text-4xl md:text-5xl font-bold text-center mb-8 md:mb-12 transition-colors duration-500"
              style={{ fontFamily: "'Rammetto One', cursive" }}>
            Como funciona
          </h2>
        </ScrollAnimation>
        
        {/* GRID DE CARDS */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4 md:gap-5 lg:gap-6 justify-items-center">
          
          {/* CARD 1 - CAMINHO NORMAL */}
          <ScrollAnimation direction="up" duration={500} delay={150}>
            <a href="/mapa">
              <div className="bg-card-alt rounded-2xl p-4 sm:p-5 md:p-6 text-center transition-all duration-500 w-full max-w-[280px] sm:max-w-[300px] md:max-w-[330px] min-h-[260px] sm:min-h-[280px] md:min-h-[300px] flex flex-col justify-start items-center cursor-pointer transform sm:hover:scale-105"
                   style={{ boxShadow: '20px 20px 50px rgba(0, 0, 0, 0.6)' }}>
                <span className="mt-3 sm:mt-4 mb-3 sm:mb-4 transition-colors duration-500">
                  <FontAwesomeIcon icon={faLocationDot} style={{ color: "#2C80FF", width: "32px", height: "32px" }} />
                </span>
                <h3 className="mb-4 sm:mb-5 text-2xl sm:text-[26px] md:text-[28px] text-text transition-colors duration-500"
                    style={{ 
                      fontFamily: "'Rammetto One', cursive",
                      textShadow: '0 0 40px currentColor'
                    }}>
                  Caminho normal
                </h3>
                <p className="text-text text-base sm:text-[17px] md:text-[18px] transition-colors duration-500"
                   style={{ fontFamily: "'Sansita', sans-serif" }}>
                  Você pode navegar manualmente com as nossas páginas interativas 
                </p>
              </div>
            </a>
          </ScrollAnimation>

          {/* CARD 2 - VER RANKING */}
          <ScrollAnimation direction="up" duration={500} delay={200}>
            <div className="bg-card-alt rounded-2xl p-4 sm:p-5 md:p-6 text-center transition-all duration-500 w-full max-w-[280px] sm:max-w-[300px] md:max-w-[330px] min-h-[260px] sm:min-h-[280px] md:min-h-[300px] flex flex-col justify-start items-center cursor-pointer transform sm:hover:scale-105"
                 style={{ boxShadow: '20px 20px 50px rgba(0, 0, 0, 0.6)' }}>
              <span className="mt-3 sm:mt-4 mb-3 sm:mb-4 transition-colors duration-500">
                <FontAwesomeIcon icon={faTrophy} style={{ color: "#2C80FF", width: "32px", height: "32px" }} />
              </span>
              <h3 className="mb-4 sm:mb-5 text-2xl sm:text-[26px] md:text-[28px] text-text transition-colors duration-500"
                  style={{ 
                    fontFamily: "'Rammetto One', cursive",
                    textShadow: '0 0 40px currentColor'
                  }}>
                Veja o ranking
              </h3>
              <p className="text-text text-base sm:text-[17px] md:text-[18px] transition-colors duration-500"
                 style={{ fontFamily: "'Sansita', sans-serif" }}>
                Você pode ver quais escolas estão no topo de cada categoria
              </p>
            </div>
          </ScrollAnimation>

          {/* CARD 3 - CAMINHO DA IA */}
          <ScrollAnimation direction="up" duration={500} delay={250}>
            <div className="bg-card-alt rounded-2xl p-4 sm:p-5 md:p-6 text-center transition-all duration-500 w-full max-w-[280px] sm:max-w-[300px] md:max-w-[330px] min-h-[260px] sm:min-h-[280px] md:min-h-[300px] flex flex-col justify-start items-center cursor-pointer transform sm:hover:scale-105"
                 style={{ boxShadow: '20px 20px 50px rgba(0, 0, 0, 0.6)' }}>
              <span className="mt-3 sm:mt-4 mb-3 sm:mb-4 transition-colors duration-500">
                <FontAwesomeIcon icon={faRobot} style={{ color: "#2C80FF", width: "32px", height: "32px" }} />
              </span>
              <h3 className="mb-4 sm:mb-5 text-2xl sm:text-[26px] md:text-[28px] text-text transition-colors duration-500"
                  style={{ 
                    fontFamily: "'Rammetto One', cursive",
                    textShadow: '0 0 40px currentColor'
                  }}>
                Caminho da IA
              </h3>
              <p className="text-text text-base sm:text-[17px] md:text-[18px] transition-colors duration-500"
                 style={{ fontFamily: "'Sansita', sans-serif" }}>
                Você pode digitar ou falar o que deseja e ir direto ao dashboard com as informações.
              </p>
            </div>
          </ScrollAnimation>
        </div>
      </section>

      {/* ========== SEÇÃO SOBRE NÓS - DESCRIÇÃO E DESENVOLVEDORES ========== */}
      <section className="max-w-[95%] sm:max-w-[90%] md:max-w-[85%] mx-auto px-3 sm:px-4 py-8 md:py-12 lg:py-20">
        <ScrollAnimation direction="up" duration={500} delay={100}>
          <h2 className="text-3xl sm:text-4xl md:text-5xl font-bold text-center mb-12 md:mb-16 transition-colors duration-500"
              style={{ fontFamily: "'Rammetto One', cursive" }}>
            Sobre nós
          </h2>
        </ScrollAnimation>
        
        {/* DESCRIÇÃO DO PROJETO */}
        <ScrollAnimation direction="up" duration={500} delay={150}>
          <div className="flex flex-col lg:flex-row gap-8 md:gap-12 items-start mb-12 md:mb-16">
            <div className="lg:flex-1">
              <div className="bg-card rounded-2xl p-6 md:p-8 transition-colors duration-500"
                   style={{ boxShadow: '30px 30px 70px rgba(0, 0, 0, 0.5)' }}>
                <p className="text-base md:text-lg lg:text-xl leading-relaxed text-justify text-text transition-colors duration-500"
                   style={{ fontFamily: "'Sansita', sans-serif" }}>
                  O InfoSchool é uma plataforma criada com o objetivo de aproximar a comunidade acadêmica e a sociedade dos dados do Censo Escolar, a maior pesquisa estatística sobre educação básica no Brasil. Nosso propósito é tornar essas informações mais acessíveis, visuais e compreensíveis para estudantes, professores e gestores. Aqui você encontra dados organizados de forma clara e interativa, permitindo compreender melhor os desafios e avanços da educação no país. Acreditamos que, ao transformar números em conhecimento, é possível promover reflexões e ações que impactem positivamente o futuro da educação.
                </p>
              </div>
            </div>
          </div>
        </ScrollAnimation>

        {/* LINHA DIVISÓRIA */}
        <div className="border-t border-theme my-12 md:my-16 transition-colors duration-500"></div>

        {/* GRID DE DESENVOLVEDORES */}
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-3 md:gap-4 justify-items-center w-full">
          
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
    <div className="text-center w-full px-1 sm:px-0">
      <div className="bg-card rounded-2xl p-4 sm:p-5 w-full max-w-[280px] sm:max-w-full h-56 sm:h-64 flex flex-col items-center justify-center transform sm:hover:scale-105 transition-all duration-500"
           style={{ boxShadow: '30px 30px 70px rgba(0, 0, 0, 0.5)' }}>
        <div className="mb-3 sm:mb-4">
          <img 
            src={photo} 
            alt={name} 
            className={`w-32 h-32 rounded-full object-cover border-2 ${borderColor} transition-colors duration-500`}
          />
        </div>
        <div className="space-y-2">
          <span className="text-lg sm:text-xl font-bold text-text block transition-colors duration-500"
                style={{ fontFamily: "'Rammetto One', cursive" }}>
            {name}
          </span>
          <span className="text-text text-sm sm:text-base transition-colors duration-500">{role}</span>
        </div>
      </div>
    </div>
  );
}
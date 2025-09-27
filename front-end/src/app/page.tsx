import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faTrophy, faLocationDot, faRobot } from '@fortawesome/free-solid-svg-icons';

export default function Sobre() {
  return (
    <div className="min-h-screen bg-[#2D2D2D]">
      
      {/* Container principal com mesma margem do header */}
      <div className="max-w-[80%] mx-auto px-4 py-8 md:py-16"> 
        <div className="flex flex-col lg:flex-row items-start gap-8 lg:gap-12">
          
          {/* Caixa de texto - 60% da largura */}
          <div className="flex-1 lg:flex-[0.6] pt-8">
            
            {/* Título com quebras de linha específicas */}
            <h1 className="text-4xl md:text-5xl lg:text-6xl font-bold text-white mb-6 leading-tight text-left"
                style={{ fontFamily: "'Rammetto One', cursive" }}>
              Conheça a educação<br />
              do <span className="text-[#2C80FF]">Brasil</span><br />
              em cada <span className="text-[#2C80FF]">detalhe</span>
            </h1>
            
            {/* Descrição com fonte Sansita */}
            <p className="text-xl md:text-2xl text-gray-300 mb-10 leading-relaxed text-left max-w-2xl"
               style={{ fontFamily: "'Sansita', sans-serif" }}>
              Nosso site tem o objetivo de informar sobre as principais informações 
              escolares em todo o Brasil, utilizando o censo escolar
            </p>
            
            {/* Botão Explorar Escolas */}
            <button className="bg-[#2C80FF] text-white rounded-[25px] hover:bg-[#1a6fd8] transition-all duration-200 px-10 py-4 text-xl font-semibold hover:scale-105 active:scale-100 min-w-[220px] cursor-pointer"
              style={{ 
                fontFamily: "'Rammetto One', cursive"
              }}>
              Explorar escolas
            </button>
          </div>
          
          {/* Imagem TV.svg - 40% da largura */}
          <div className="flex-1 lg:flex-[0.4] flex justify-center lg:justify-end">
            <div className="w-full max-w-[400px] lg:max-w-[550px]">
              <img 
                src="/images/Tv.svg"
                alt="Ilustração educação" 
                width={637}
                height={637}
                className="w-full h-auto object-contain lg:mt-0"
              />
            </div>
          </div>
        </div>
      </div>

      {/* Seção Como Funciona - RESPONSIVA */}
      <section className="max-w-[80%] mx-auto px-4 py-8 md:py-16">
        <h2
          className="text-4xl md:text-5xl font-bold text-white text-center mb-12"
          style={{ fontFamily: "'Rammetto One', cursive" }}
        >
          Como funciona
        </h2>
        
        {/* Grid responsivo com breakpoints */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6 lg:gap-8 justify-items-center">
          
          {/* Caminho Normal - CARD RESPONSIVO */}
          <div 
            className="bg-[#3A3A3A] rounded-2xl p-6 text-center hover:scale-105 transition-all duration-300 w-full max-w-[350px] min-h-[320px] flex flex-col justify-start items-center cursor-pointer"
            style={{ 
              boxShadow: '30px 30px 70px rgba(0, 0, 0, 0.5)' 
            }}
          >
            <span className="mt-4 mb-4">
              <FontAwesomeIcon
                icon={faLocationDot}
                style={{ color: "#2C80FF", width: "38px", height: "38px" }}
              />
            </span>
            <h3
              className="mb-6"
              style={{
                fontFamily: "'Rammetto One', cursive",
                fontSize: "32px",
                color: "#fff",
                textShadow: "0px 0px 50px #fff"
              }}
            >
              Caminho normal
            </h3>
            <p
              style={{
                fontFamily: "'Sansita', sans-serif",
                fontSize: "20px"
              }}
              className="text-gray-300"
            >
              Você pode navegar manualmente com as nossas palavras interativas
            </p>
          </div>

          {/* Ver Ranking - CARD RESPONSIVO */}
          <div 
            className="bg-[#3A3A3A] rounded-2xl p-6 text-center hover:scale-105 transition-all duration-300 w-full max-w-[350px] min-h-[320px] flex flex-col justify-start items-center cursor-pointer"
            style={{ 
              boxShadow: '30px 30px 70px rgba(0, 0, 0, 0.5)' 
            }}
          >
            <span className="mt-4 mb-4">
              <FontAwesomeIcon
                icon={faTrophy}
                style={{ color: "#2C80FF", width: "38px", height: "38px" }}
              />
            </span>
            <h3
              className="mb-6"
              style={{
                fontFamily: "'Rammetto One', cursive",
                fontSize: "32px",
                color: "#fff",
                textShadow: "0px 0px 50px #fff"
              }}
            >
              Veja o ranking
            </h3>
            <p
              style={{
                fontFamily: "'Sansita', sans-serif",
                fontSize: "20px"
              }}
              className="text-gray-300"
            >
              Você pode ver quais escolas estão íntegras de cada categoria
            </p>
          </div>

          {/* Caminho da IA - CARD RESPONSIVO */}
          <div 
            className="bg-[#3A3A3A] rounded-2xl p-6 text-center hover:scale-105 transition-all duration-300 w-full max-w-[350px] min-h-[320px] flex flex-col justify-start items-center cursor-pointer"
            style={{ 
              boxShadow: '30px 30px 70px rgba(0, 0, 0, 0.5)' 
            }}
          >
            <span className="mt-4 mb-4">
              <FontAwesomeIcon
                icon={faRobot}
                style={{ color: "#2C80FF", width: "38px", height: "38px" }}
              />
            </span>
            <h3
              className="mb-6"
              style={{
                fontFamily: "'Rammetto One', cursive",
                fontSize: "32px",
                color: "#fff",
                textShadow: "0px 0px 50px #fff"
              }}
            >
              Caminho da IA
            </h3>
            <p
              style={{
                fontFamily: "'Sansita', sans-serif",
                fontSize: "20px"
              }}
              className="text-gray-300"
            >
              Você pode digitar ou falar o que deseja e ir direto aos dashboards com as informações
            </p>
          </div>
        </div>
      </section>
      
      {/* Seção Mapa com cabeçalho */}
      <section className="max-w-[80%] mx-auto px-4 py-8 md:py-16">
        {/* Cabeçalho Mapa - mesma fonte e tamanho de "Como funciona" */}
        <h2
          className="text-4xl md:text-5xl font-bold text-white text-center mb-12"
          style={{ fontFamily: "'Rammetto One', cursive" }}
        >
          Mapa
        </h2>
        
        {/* Container do Mapa */}
        <div 
          className="w-full h-96 bg-gray-800/40 backdrop-blur-md rounded-2xl flex items-center justify-center p-4"
          style={{ 
            boxShadow: '30px 30px 70px rgba(0, 0, 0, 0.5)' 
          }}
        >
          <button 
            className="bg-blue-600 hover:bg-blue-700 text-white font-bold py-3 px-6 rounded-lg transition-colors duration-300 hover:scale-110 transition-transform duration-200 cursor-pointer"
            style={{ fontFamily: "'Rammetto One', cursive" }}
          >
            Permitir localização
          </button>
        </div>
      </section>
    

      {/* Seção Sobre Nós */}
      <section className="max-w-[80%] mx-auto px-4 py-8 md:py-16">
        {/* Título Sobre Nós */}
        <h2
          className="text-4xl md:text-5xl font-bold text-white text-center mb-12"
          style={{ fontFamily: "'Rammetto One', cursive" }}
        >
          Sobre nós
        </h2>
        
        {/* Texto descritivo */}
        <div className="bg-[#3A3A3A] rounded-2xl p-8 mb-12"
             style={{ boxShadow: '30px 30px 70px rgba(0, 0, 0, 0.5)' }}>
          <p 
            className="text-lg md:text-xl text-gray-300 leading-relaxed text-justify"
            style={{ fontFamily: "'Sansita', sans-serif" }}
          >
            O InfoSchool é uma plataforma criada com o objetivo de aproximar a comunidade acadêmica e a sociedade dos dados do Censo Escolar, a maior pesquisa estatística sobre educação básica no Brasil. Nosso propósito é tornar essas informações mais acessíveis, visuais e compreensíveis para estudantes, professores e gestores. Aqui você encontra dados organizados de forma clara e interativa, permitindo compreender melhor os desafios e avanços da educação no país. Acreditamos que, ao transformar números em conhecimento, é possível promover reflexões e ações que impactem positivamente o futuro da educação.
          </p>
        </div>

        {/* Linha divisória */}
        <div className="border-t border-gray-600 my-12"></div>

        {/* Seção Developer */}
        <div className="text-center mb-8">
          <h3 
            className="text-3xl md:text-4xl font-bold text-white mb-6"
            style={{ fontFamily: "'Rammetto One', cursive" }}
          >
            Developer
          </h3>
        </div>

        {/* Grid de Developers */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6 lg:gap-8 justify-items-center">
          
          {/* Development */}
          <div 
            className="bg-[#3A3A3A] rounded-2xl p-6 text-center w-full max-w-[300px] min-h-[120px] flex items-center justify-center cursor-pointer hover:scale-105 transition-all duration-300"
            style={{ boxShadow: '30px 30px 70px rgba(0, 0, 0, 0.5)' }}
          >
            <span 
              className="text-xl font-bold text-white"
              style={{ fontFamily: "'Rammetto One', cursive" }}
            >
              Development
            </span>
          </div>

          {/* Distribuinte Development */}
          <div 
            className="bg-[#3A3A3A] rounded-2xl p-6 text-center w-full max-w-[300px] min-h-[120px] flex items-center justify-center cursor-pointer hover:scale-105 transition-all duration-300"
            style={{ boxShadow: '30px 30px 70px rgba(0, 0, 0, 0.5)' }}
          >
            <span 
              className="text-xl font-bold text-white"
              style={{ fontFamily: "'Rammetto One', cursive" }}
            >
              Distribuinte Development
            </span>
          </div>

          {/* Developer vazio */}
          <div 
            className="bg-[#3A3A3A] rounded-2xl p-6 text-center w-full max-w-[300px] min-h-[120px] flex items-center justify-center cursor-pointer hover:scale-105 transition-all duration-300"
            style={{ boxShadow: '30px 30px 70px rgba(0, 0, 0, 0.5)' }}
          >
            <span 
              className="text-xl font-bold text-white"
              style={{ fontFamily: "'Rammetto One', cursive" }}
            >
              Developer
            </span>
          </div>

          {/* Developer */}
          <div 
            className="bg-[#3A3A3A] rounded-2xl p-6 text-center w-full max-w-[300px] min-h-[120px] flex items-center justify-center cursor-pointer hover:scale-105 transition-all duration-300"
            style={{ boxShadow: '30px 30px 70px rgba(0, 0, 0, 0.5)' }}
          >
            <span 
              className="text-xl font-bold text-white"
              style={{ fontFamily: "'Rammetto One', cursive" }}
            >
              Developer
            </span>
          </div>

          {/* Developer */}
          <div 
            className="bg-[#3A3A3A] rounded-2xl p-6 text-center w-full max-w-[300px] min-h-[120px] flex items-center justify-center cursor-pointer hover:scale-105 transition-all duration-300"
            style={{ boxShadow: '30px 30px 70px rgba(0, 0, 0, 0.5)' }}
          >
            <span 
              className="text-xl font-bold text-white"
              style={{ fontFamily: "'Rammetto One', cursive" }}
            >
              Developer
            </span>
          </div>

          {/* Developer */}
          <div 
            className="bg-[#3A3A3A] rounded-2xl p-6 text-center w-full max-w-[300px] min-h-[120px] flex items-center justify-center cursor-pointer hover:scale-105 transition-all duration-300"
            style={{ boxShadow: '30px 30px 70px rgba(0, 0, 0, 0.5)' }}
          >
            <span 
              className="text-xl font-bold text-white"
              style={{ fontFamily: "'Rammetto One', cursive" }}
            >
              Developer
            </span>
          </div>

        </div>
      </section>
    </div>
  );
}
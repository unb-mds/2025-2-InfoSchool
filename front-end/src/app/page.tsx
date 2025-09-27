export default function Sobre() {
  return (
    <div className="min-h-screen bg-[#2D2D2D]">
      
      {/* Container principal com mesma margem do header */}
      <div className="max-w-[80%] mx-auto px-4 py-8 md:py-16"> 
        <div className="flex flex-col lg:flex-row items-start gap-8 lg:gap-12">
          
          <div className="flex-1 lg:flex-[0.6] pt-8">
            
            {/* Título com quebras de linha específicas */}
            <h1 className="text-4xl md:text-5xl lg:text-6xl font-bold text-white mb-6 leading-tight text-left"
                style={{ fontFamily: "'Rammetto One', cursive" }}>
              Conheça a educação<br />
              do <span className="text-[#2C80FF]">Brasil</span><br />
              em cada <span className="text-[#2C80FF]">detalhe</span>
            </h1>
            
            <p className="text-xl md:text-2xl text-gray-300 mb-10 leading-relaxed text-left max-w-2xl"
               style={{ fontFamily: "'Sansita', sans-serif" }}>
              Nosso site tem o objetivo de informar sobre as principais informações 
              escolares em todo o Brasil, utilizando o censo escolar
            </p>
            
            <button className="bg-[#2C80FF] text-white rounded-[25px] hover:bg-[#1a6fd8] transition-all duration-200 px-10 py-4 text-xl font-semibold hover:scale-105 active:scale-100 min-w-[220px] cursor-pointer"
              style={{ 
                fontFamily: "'Rammetto One', cursive"
              }}>
              Explorar escolas
            </button>
          </div>
          
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
    </div>
  );
}
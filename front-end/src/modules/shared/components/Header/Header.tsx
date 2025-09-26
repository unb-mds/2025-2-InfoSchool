'use client';
import { useState } from 'react';

export default function Header() {
  const [menuOpen, setMenuOpen] = useState(false);

  const handleButtonClick = (action: string) => {
    console.log(`Botão clicado: ${action}`);
    setMenuOpen(false);
  };

  const toggleTheme = () => {
    console.log('Alternando tema claro/escuro');
  };

  return (
    <header className="bg-[#2D2D2D] border-b border-[#444444] sticky top-0 z-50">
      
      {/* Container com 90% da largura da tela */}
      <div className="max-w-[80%] mx-auto px-4 py-1 md:py-2"> 
        
        <div className="flex justify-between items-center">
          
          <button 
            onClick={() => handleButtonClick('InfoSchool Logo + Texto')}
            className="flex items-center gap-1 md:gap-2 hover:scale-110 transition-transform duration-200 active:scale-105 cursor-pointer"
          >
            <h1 
              className="text-white font-bold leading-none text-[28px] sm:text-[36px] md:text-[48px]"
              style={{ 
                fontFamily: "'Harys World', Arial, sans-serif",
              }}
            >
              InfoSchool
            </h1>
            
            <img 
              src="/images/InfoSchool-logo.svg"
              alt="InfoSchool Logo" 
              width={60}
              height={60}
              className="object-contain w-[60px] h-[60px] md:w-[90px] md:h-[90px]"
            />
          </button>

          <nav className="hidden md:flex items-center gap-10 lg:gap-12">
            
            <button 
              onClick={() => handleButtonClick('Sobre nós')}
              className="text-white hover:text-gray-300 transition-all duration-200 text-base lg:text-lg hover:scale-110 active:scale-105 cursor-pointer"
              style={{ fontFamily: "'Rammetto One', cursive" }}
            >
              Sobre nós
            </button>
            
            <button 
              onClick={() => handleButtonClick('Usar IA')}
              className="bg-[#2C80FF] text-white rounded-[20px] hover:bg-[#1a6fd8] transition-all duration-200 flex items-center justify-center w-[160px] lg:w-[190px] h-[30px] lg:h-[32px] hover:scale-110 active:scale-105 cursor-pointer"
              style={{ 
                fontFamily: "'Rammetto One', cursive",
                fontSize: '14px lg:text-base'
              }}
            >
              Usar IA
            </button>

            <button 
              onClick={toggleTheme}
              className="flex items-center justify-center hover:opacity-80 transition-all duration-200 hover:scale-110 active:scale-105 cursor-pointer"
            >
              <img 
                src="/icons/light-mode.png"
                alt="Modo Claro" 
                width={24}
                height={24}
                className="filter brightness-0 invert w-6 h-6 lg:w-[30px] lg:h-[30px]"
              />
            </button>
          </nav>

          <button 
            className="md:hidden text-white p-1 rounded hover:bg-gray-700 transition-all duration-200 hover:scale-110 active:scale-105 cursor-pointer"
            onClick={() => setMenuOpen(!menuOpen)}
            aria-label="Abrir menu"
          >
            <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 6h16M4 12h16M4 18h16" />
            </svg>
          </button>
        </div>

        {menuOpen && (
          <div className="md:hidden mt-2 space-y-2 border-t border-[#444444] pt-3">
            
            <button 
              onClick={() => handleButtonClick('Sobre nós (mobile)')}
              className="block text-white py-2 px-4 hover:bg-gray-800 rounded transition-all duration-200 w-full text-center hover:scale-105 active:scale-100 text-base cursor-pointer"
              style={{ fontFamily: "'Rammetto One', cursive" }}
            >
              Sobre nós
            </button>
            
            <button 
              onClick={() => handleButtonClick('Usar IA (mobile)')}
              className="bg-[#2C80FF] text-white rounded-[20px] hover:bg-[#1a6fd8] transition-all duration-200 w-full py-2 hover:scale-105 active:scale-100 text-base cursor-pointer"
              style={{ 
                fontFamily: "'Rammetto One', cursive"
              }}
            >
              Usar IA
            </button>

            <button 
              onClick={toggleTheme}
              className="flex items-center justify-center w-full py-2 text-gray-400 hover:text-white transition-all duration-200 hover:scale-105 active:scale-100 text-base cursor-pointer"
            >
              <img 
                src="/icons/light-mode.png" 
                alt="Modo Claro"
                width={20}
                height={20}
                className="filter brightness-0 invert mr-3"
              />
              Alternar Tema
            </button>
          </div>
        )}
      </div>
    </header>
  );
}
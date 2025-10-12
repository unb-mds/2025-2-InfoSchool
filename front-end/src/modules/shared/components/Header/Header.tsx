'use client';
import { useState } from 'react';
import { useTheme } from '../ThemeProvider/ThemeProvider';

export default function Header() {
  const [menuOpen, setMenuOpen] = useState(false);
  const { theme, toggleTheme } = useTheme();

  const handleButtonClick = (action: string) => {
    console.log(`Botão clicado: ${action}`);
    setMenuOpen(false);
  };

  return (
    <header className="bg-header border-theme border-b sticky top-0 z-50 transition-colors duration-500">
      
      <div className="max-w-[80%] mx-auto px-4 py-1 md:py-2"> 
        
        <div className="flex justify-between items-center">
          
          <button 
            onClick={() => handleButtonClick('InfoSchool Logo + Texto')}
            className="flex items-center gap-1 md:gap-2 hover:scale-110 transition-transform duration-500 active:scale-105 cursor-pointer"
          >
            <h1 
              className="font-bold leading-none text-[28px] sm:text-[36px] md:text-[48px] transition-colors duration-500"
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
              className="object-contain w-[60px] h-[60px] md:w-[90px] md:h-[90px] transition-colors duration-500"
            />
          </button>

          <nav className="hidden md:flex items-center gap-10 lg:gap-12">
            
            <button 
              onClick={() => handleButtonClick('Sobre nós')}
              className="hover:text-gray-300 transition-all duration-500 text-base lg:text-lg hover:scale-110 active:scale-105 cursor-pointer"
              style={{ fontFamily: "'Rammetto One', cursive" }}
            >
              Sobre nós
            </button>
            
            <button 
              onClick={() => handleButtonClick('Usar IA')}
              className="bg-primary text-white rounded-[20px] hover:bg-[#1a6fd8] transition-all duration-500 flex items-center justify-center w-[160px] lg:w-[190px] h-[30px] lg:h-[32px] hover:scale-110 active:scale-105 cursor-pointer"
              style={{ 
                fontFamily: "'Rammetto One', cursive",
                fontSize: '14px lg:text-base'
              }}
            >
              Usar IA
            </button>

            <button 
              onClick={toggleTheme}
              className="flex items-center justify-center hover:opacity-80 transition-all duration-500 hover:scale-110 active:scale-105 cursor-pointer"
              aria-label={theme === 'light' ? 'Ativar modo escuro' : 'Ativar modo claro'}
            >
              {theme === 'light' ? (
                <img 
                  src="/icons/dark-mode.png"
                  alt="Modo Escuro" 
                  width={32}
                  height={32}
                  className="w-8 h-8 lg:w-9 lg:h-9 transition-colors duration-500"
                />
              ) : (
                <img 
                  src="/icons/light-mode.png"
                  alt="Modo Claro" 
                  width={32}
                  height={32}
                  className="w-8 h-8 lg:w-9 lg:h-9 transition-colors duration-500"
                />
              )}
            </button>
          </nav>

          <button 
            className="md:hidden p-1 rounded hover:bg-gray-700 transition-all duration-500 hover:scale-110 active:scale-105 cursor-pointer"
            onClick={() => setMenuOpen(!menuOpen)}
            aria-label="Abrir menu"
          >
            <svg className="w-6 h-6 transition-colors duration-500" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 6h16M4 12h16M4 18h16" />
            </svg>
          </button>
        </div>

        {menuOpen && (
          <div className="md:hidden mt-2 space-y-2 border-t border-theme pt-3 transition-colors duration-500">
            
            <button 
              onClick={() => handleButtonClick('Sobre nós (mobile)')}
              className="block py-2 px-4 hover:bg-gray-800 rounded transition-all duration-500 w-full text-center hover:scale-105 active:scale-100 text-base cursor-pointer"
              style={{ fontFamily: "'Rammetto One', cursive" }}
            >
              Sobre nós
            </button>
            
            <button 
              onClick={() => handleButtonClick('Usar IA (mobile)')}
              className="bg-primary text-white rounded-[20px] hover:bg-[#1a6fd8] transition-all duration-500 w-full py-2 hover:scale-105 active:scale-100 text-base cursor-pointer"
              style={{ 
                fontFamily: "'Rammetto One', cursive"
              }}
            >
              Usar IA
            </button>

            <button 
              onClick={toggleTheme}
              className="flex items-center justify-center w-full py-2 text-gray-400 hover:text-white transition-all duration-500 hover:scale-105 active:scale-100 text-base cursor-pointer"
            >
              {theme === 'light' ? (
                <>
                  <img 
                    src="/icons/dark-mode.png" 
                    alt="Modo Escuro"
                    width={26}
                    height={26}
                    className="mr-3 w-7 h-7 transition-colors duration-500"
                  />
                  Modo Escuro
                </>
              ) : (
                <>
                  <img 
                    src="/icons/light-mode.png" 
                    alt="Modo Claro"
                    width={26}
                    height={26}
                    className="mr-3 w-7 h-7 transition-colors duration-500"
                  />
                  Modo Claro
                </>
              )}
            </button>
          </div>
        )}
      </div>
    </header>
  );
}
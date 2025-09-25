'use client';
import { useState } from 'react';
import Image from 'next/image';

export default function Header() {
  const [menuOpen, setMenuOpen] = useState(false);

  return (
    <header className="bg-[#2D2D2D] border-b border-[#444444] sticky top-0 z-50">
      <div className="max-w-7xl mx-auto px-4 py-4">
        
        <div className="flex justify-between items-center">
          
          {/* Logo InfoSchool - TEXTO E IMAGEM JUNTOS */}
          <div className="flex items-center gap-11"> {/* 11cm ≈ 44px ≈ gap-11 */}
            
            {/* Texto InfoSchool */}
            <h1 
              className="text-white font-bold leading-none text-[32px]"
              style={{ 
                fontFamily: "'Harys World', Arial, sans-serif",
              }}
            >
              InfoSchool
            </h1>
            
            {/* Imagem do logo em SVG - 90x90 pixels */}
            <img 
              src="/images/InfoSchool-logo.svg" 
              alt="InfoSchool Logo"
              width={90}
              height={90}
              className="object-contain"
            />
          </div>

          {/* Menu desktop - lado DIREITO */}
          <nav className="hidden md:flex items-center gap-20">
            
            <a href="#sobre" className="text-white hover:text-gray-300 transition-colors duration-200 text-lg">
              Sobre nós
            </a>
            
            <button 
              className="bg-[#2C80FF] text-white rounded-[20px] hover:bg-[#1a6fd8] transition-colors duration-200 flex items-center justify-center w-[190px] h-[36px]"
              style={{ 
                fontFamily: "'Rammetto One', cursive",
                fontSize: '16px'
              }}
            >
              Usar IA
            </button>

            {/* Ícone Light Mode */}
            <button className="flex items-center justify-center hover:opacity-80 transition-opacity duration-200">
              <Image 
                src="/icons/light-mode.png" 
                alt="Modo Claro"
                width={30}
                height={30}
                className="filter brightness-0 invert"
              />
            </button>
          </nav>

          {/* Botão menu hamburger - mobile */}
          <button 
            className="md:hidden text-white p-2 rounded hover:bg-gray-700 transition-colors duration-200"
            onClick={() => setMenuOpen(!menuOpen)}
          >
            <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 6h16M4 12h16M4 18h16" />
            </svg>
          </button>
        </div>

        {/* Menu mobile expandido */}
        {menuOpen && (
          <div className="md:hidden mt-4 space-y-3 border-t border-[#444444] pt-4">
            
            <a 
              href="#sobre" 
              className="block text-white py-3 px-2 hover:bg-gray-800 rounded transition-colors duration-200 w-full text-center"
              onClick={() => setMenuOpen(false)}
            >
              Sobre nós
            </a>
            
            <button 
              className="bg-[#2C80FF] text-white rounded-[20px] hover:bg-[#1a6fd8] transition-colors duration-200 w-full py-3"
              style={{ 
                fontFamily: "'Rammetto One', cursive",
                fontSize: '16px'
              }}
              onClick={() => setMenuOpen(false)}
            >
              Usar IA
            </button>
          </div>
        )}
      </div>
    </header>
  );
}
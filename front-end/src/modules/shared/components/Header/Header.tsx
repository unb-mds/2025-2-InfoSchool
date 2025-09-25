'use client';
import { useState } from 'react';
import Image from 'next/image';

export default function Header() {
  const [menuOpen, setMenuOpen] = useState(false);

  // Função para lidar com cliques nos botões
  const handleButtonClick = (action: string) => {
    console.log(`✅ Botão clicado: ${action}`);
    setMenuOpen(false); // Fecha o menu mobile após clique
  };

  // Função para alternar tema (placeholder)
  const toggleTheme = () => {
    console.log('🎨 Alternando tema claro/escuro');
  };

  return (
    <header className="bg-[#2D2D2D] border-b border-[#444444] sticky top-0 z-50">
      <div className="max-w-7xl mx-auto px-4 py-4">
        
        {/* CONTAINER PRINCIPAL */}
        <div className="flex justify-between items-center">
          
          {/* === LOGO INFOSCHOOL === */}
          {/* Container da logo + texto com espaçamento ajustado */}
          <div className="flex items-center gap-4"> 
            {/* Gap-4 = 16px (espaçamento confortável) */}
            
            {/* TEXTO "INFOSCHOOL" */}
            {/* Dimensões: 58px de altura (aproximado pela fonte de 32px) */}
            <button 
              onClick={() => handleButtonClick('Texto InfoSchool')}
              className="hover:scale-110 transition-transform duration-200 active:scale-105"
            >
              <h1 
                className="text-white font-bold leading-none text-[32px]" // 32px de fonte
                style={{ 
                  fontFamily: "'Harys World', Arial, sans-serif", // Fonte customizada
                }}
              >
                InfoSchool
              </h1>
            </button>
            
            {/* IMAGEM DA LOGO */}
            {/* Dimensões: 90x90 pixels */}
            <button 
              onClick={() => handleButtonClick('Logo InfoSchool')}
              className="hover:scale-110 transition-transform duration-200 active:scale-105"
            >
              <img 
                src="/images/InfoSchool-logo.svg" // Caminho correto da imagem
                alt="InfoSchool Logo" 
                width={90} // Largura exata: 90px
                height={90} // Altura exata: 90px
                className="object-contain" // Mantém proporções
              />
            </button>
          </div>

          {/* === MENU DESKTOP === */}
          <nav className="hidden md:flex items-center gap-16"> {/* Gap-16 = 64px entre itens */}
            
            {/* BOTÃO "SOBRE NÓS" */}
            <button 
              onClick={() => handleButtonClick('Sobre nós')}
              className="text-white hover:text-gray-300 transition-all duration-200 text-lg hover:scale-110 active:scale-105"
            >
              Sobre nós
            </button>
            
            {/* BOTÃO "USAR IA" */}
            <button 
              onClick={() => handleButtonClick('Usar IA')}
              className="bg-[#2C80FF] text-white rounded-[20px] hover:bg-[#1a6fd8] transition-all duration-200 flex items-center justify-center w-[190px] h-[36px] hover:scale-110 active:scale-105"
              style={{ 
                fontFamily: "'Rammetto One', cursive", // Fonte especial do botão
                fontSize: '16px' // Tamanho da fonte
              }}
            >
              Usar IA
            </button>

            {/* ÍCONE DE MODO CLARO/ESCURO */}
            {/* Dimensões: 30x30 pixels */}
            <button 
              onClick={toggleTheme}
              className="flex items-center justify-center hover:opacity-80 transition-all duration-200 hover:scale-110 active:scale-105"
            >
              <img 
                src="/icons/light-mode.png" // Caminho correto do ícone
                alt="Modo Claro" 
                width={30} // Largura exata: 30px
                height={30} // Altura exata: 30px
                className="filter brightness-0 invert" // Estilo do ícone
              />
            </button>
          </nav>

          {/* === BOTÃO MENU HAMBURGUER (MOBILE) === */}
          <button 
            className="md:hidden text-white p-2 rounded hover:bg-gray-700 transition-all duration-200 hover:scale-110 active:scale-105"
            onClick={() => setMenuOpen(!menuOpen)}
            aria-label="Abrir menu"
          >
            {/* Ícone de hamburger */}
            <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 6h16M4 12h16M4 18h16" />
            </svg>
          </button>
        </div>

        {/* === MENU MOBILE EXPANDIDO === */}
        {menuOpen && (
          <div className="md:hidden mt-4 space-y-3 border-t border-[#444444] pt-4">
            
            {/* BOTÃO "SOBRE NÓS" MOBILE */}
            <button 
              onClick={() => handleButtonClick('Sobre nós (mobile)')}
              className="block text-white py-3 px-2 hover:bg-gray-800 rounded transition-all duration-200 w-full text-center hover:scale-105 active:scale-100"
            >
              Sobre nós
            </button>
            
            {/* BOTÃO "USAR IA" MOBILE */}
            <button 
              onClick={() => handleButtonClick('Usar IA (mobile)')}
              className="bg-[#2C80FF] text-white rounded-[20px] hover:bg-[#1a6fd8] transition-all duration-200 w-full py-3 hover:scale-105 active:scale-100"
              style={{ 
                fontFamily: "'Rammetto One', cursive",
                fontSize: '16px'
              }}
            >
              Usar IA
            </button>

            {/* BOTÃO "MODO CLARO" MOBILE */}
            <button 
              onClick={toggleTheme}
              className="flex items-center justify-center w-full py-3 text-gray-400 hover:text-white transition-all duration-200 hover:scale-105 active:scale-100"
            >
              <img 
                src="/icons/light-mode.png" 
                alt="Modo Claro"
                width={24}
                height={24}
                className="filter brightness-0 invert mr-2"
              />
              Alternar Tema
            </button>
          </div>
        )}
      </div>
    </header>
  );
}
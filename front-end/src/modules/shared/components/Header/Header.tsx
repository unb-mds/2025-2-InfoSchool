'use client';
import { useState } from 'react';
import Image from 'next/image';
import { useRouter } from 'next/navigation';

export default function Header() {
  const [menuOpen, setMenuOpen] = useState(false);
  const router = useRouter();

  // Função para navegação suave
  const handleNavigation = (path: string) => {
    if (path === '/sobre') {
      // Navegação para a página Sobre
      router.push('/sobre');
    } else if (path === '/') {
      // Navegação para a página inicial
      router.push('/');
    }
    setMenuOpen(false);
  };

  // Função para alternar modo claro/escuro (placeholder)
  const toggleTheme = () => {
    console.log('Alternar tema - funcionalidade em desenvolvimento');
    // Implementação do toggle de tema virá depois
  };

  return (
    <header className="bg-[#2D2D2D] border-b border-[#444444] sticky top-0 z-50">
      <div className="max-w-7xl mx-auto px-4 py-4">
        
        <div className="flex justify-between items-center">
          
          {/* Logo InfoSchool - CLICÁVEL COM ANIMAÇÃO */}
          <button 
            onClick={() => handleNavigation('/')}
            className="flex items-center gap-3 hover:scale-110 transition-transform duration-200 active:scale-105" // Reduzi o gap para 12px
          >
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
          </button>

          {/* Menu desktop - lado DIREITO */}
          <nav className="hidden md:flex items-center gap-16"> {/* Reduzi o gap geral para 64px */}
            
            {/* Botão Sobre Nós - CLICÁVEL COM ANIMAÇÃO */}
            <button 
              onClick={() => handleNavigation('/sobre')}
              className="text-white hover:text-gray-300 transition-all duration-200 text-lg hover:scale-110 active:scale-105"
            >
              Sobre nós
            </button>
            
            {/* Botão Usar IA - JÁ TEM ANIMAÇÃO */}
            <button 
              className="bg-[#2C80FF] text-white rounded-[20px] hover:bg-[#1a6fd8] transition-all duration-200 flex items-center justify-center w-[190px] h-[36px] hover:scale-110 active:scale-105"
              style={{ 
                fontFamily: "'Rammetto One', cursive",
                fontSize: '16px'
              }}
            >
              Usar IA
            </button>

            {/* Ícone Light Mode - CLICÁVEL COM ANIMAÇÃO */}
            <button 
              onClick={toggleTheme}
              className="flex items-center justify-center hover:opacity-80 transition-all duration-200 hover:scale-110 active:scale-105"
            >
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
            className="md:hidden text-white p-2 rounded hover:bg-gray-700 transition-all duration-200 hover:scale-110 active:scale-105"
            onClick={() => setMenuOpen(!menuOpen)}
          >
            <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 6h16M4 12h16M4 18h16" />
            </svg>
          </button>
        </div>

        {/* Menu mobile expandido - COM ANIMAÇÕES */}
        {menuOpen && (
          <div className="md:hidden mt-4 space-y-3 border-t border-[#444444] pt-4">
            
            <button 
              onClick={() => handleNavigation('/sobre')}
              className="block text-white py-3 px-2 hover:bg-gray-800 rounded transition-all duration-200 w-full text-center hover:scale-105 active:scale-100"
            >
              Sobre nós
            </button>
            
            <button 
              className="bg-[#2C80FF] text-white rounded-[20px] hover:bg-[#1a6fd8] transition-all duration-200 w-full py-3 hover:scale-105 active:scale-100"
              style={{ 
                fontFamily: "'Rammetto One', cursive",
                fontSize: '16px'
              }}
            >
              Usar IA
            </button>

            <button 
              onClick={toggleTheme}
              className="flex items-center justify-center w-full py-3 text-gray-400 hover:text-white transition-all duration-200 hover:scale-105 active:scale-100"
            >
              <Image 
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
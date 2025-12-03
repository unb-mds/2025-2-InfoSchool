// src/app/gitpages/page.tsx 
'use client';
import { useState, useEffect } from 'react';
import Image from 'next/image';
import { ScrollAnimation } from '@/modules/shared/components';

export default function GitPages() {
  const [isDark, setIsDark] = useState(false);

  useEffect(() => {
    const currentTheme = document.documentElement.getAttribute('data-theme');
    setIsDark(currentTheme === 'dark');
  }, []);

  const scrollToTop = () => {
    window.scrollTo({ top: 0, behavior: 'smooth' });
  };

  return (
    <main className="min-h-screen bg-background text-text transition-all duration-500">
      
      {/* Botão Voltar ao Topo */}
      <button
        onClick={scrollToTop}
        className="fixed bottom-8 right-8 bg-primary text-white p-3 rounded-full shadow-2xl hover:bg-primary/90 transition-all duration-500 z-50"
        style={{ fontFamily: "'Sansita', sans-serif" }}
      >
        ↑ Topo
      </button>

      {/* Container Principal */}
      <div className="max-w-[85%] sm:max-w-[80%] md:max-w-[80%] mx-auto px-3 sm:px-4">
        
        {/* Hero Section */}
        <section className="py-20 text-center transition-all duration-500">
          <ScrollAnimation direction="up" duration={500} delay={100}>
            <div className="flex justify-center mb-8 transition-all duration-500">
              <div className="w-48 h-48 relative transition-all duration-500">
                <Image
                  src="/images/InfoSchool-logo.svg"
                  alt="InfoSchool Logo"
                  fill
                  className="object-contain transition-all duration-500"
                  priority
                />
              </div>
            </div>
          </ScrollAnimation>

          <ScrollAnimation direction="up" duration={500} delay={150}>
            <h1 className="text-5xl md:text-7xl font-bold mb-6 transition-all duration-500" style={{ fontFamily: "'Harys World', sans-serif" }}>
              InfoSchool
            </h1>
          </ScrollAnimation>

          <ScrollAnimation direction="up" duration={500} delay={200}>
            <p className="text-xl md:text-2xl text-gray-theme mb-8 max-w-3xl mx-auto transition-all duration-500" style={{ fontFamily: "'Sansita', sans-serif" }}>
              Revolucionando o acesso aos dados educacionais brasileiros através de tecnologia inteligente
            </p>
          </ScrollAnimation>

          <ScrollAnimation direction="up" duration={500} delay={250}>
            <div className="flex gap-4 justify-center flex-wrap transition-all duration-500">
              <button 
                onClick={() => document.getElementById('demonstracao')?.scrollIntoView({ behavior: 'smooth' })}
                className="bg-primary text-white px-8 sm:px-16 py-4 rounded-full font-semibold hover:bg-primary/90 active:scale-95 transition-all duration-300 text-lg w-full sm:w-auto min-w-[280px] cursor-pointer transform hover:scale-105"
                style={{ fontFamily: "'Sansita', sans-serif" }}
              >
                Ver Demonstração
              </button>
              <button 
                onClick={() => document.getElementById('acesso')?.scrollIntoView({ behavior: 'smooth' })}
                className="border border-primary text-primary px-8 sm:px-16 py-4 rounded-full font-semibold hover:bg-primary/10 active:scale-95 transition-all duration-300 text-lg w-full sm:w-auto min-w-[280px] cursor-pointer transform hover:scale-105"
                style={{ fontFamily: "'Sansita', sans-serif" }}
              >
                Como Acessar
              </button>
            </div>
          </ScrollAnimation>
        </section>

        {/* Seção: Demonstração com GIFs */}
        <section id="demonstracao" className="py-20 transition-all duration-500">
          <ScrollAnimation direction="up" duration={500} delay={100}>
            <h2 className="text-3xl md:text-4xl font-bold text-center mb-6 transition-all duration-500" style={{ fontFamily: "'Rammetto One', sans-serif" }}>Veja a Plataforma em Ação</h2>
          </ScrollAnimation>

          <ScrollAnimation direction="up" duration={500} delay={150}>
            <p className="text-xl text-gray-theme text-center mb-16 max-w-3xl mx-auto px-4 transition-all duration-500" style={{ fontFamily: "'Sansita', sans-serif" }}>
              Confira como é fácil explorar dados educacionais com nossa plataforma
            </p>
          </ScrollAnimation>

          <div className="grid grid-cols-1 lg:grid-cols-2 gap-y-20 gap-x-12 md:gap-y-24 md:gap-x-16 transition-all duration-500">
            
            {/* Card: Página Inicial */}
            <ScrollAnimation direction="up" duration={500} delay={200}>
              <div className="text-center p-6 rounded-2xl bg-card border border-theme transition-all duration-500 hover:scale-105 flex flex-col">
                <div className="w-16 h-16 md:w-20 md:h-20 bg-primary/20 rounded-full flex items-center justify-center mx-auto mb-6 transition-all duration-500">
                  <div className="w-10 h-10 md:w-12 md:h-12 relative transition-all duration-500">
                    <Image
                      src="/icons/home.png"
                      alt="Ícone home"
                      fill
                      className="object-contain transition-all duration-500"
                      style={{ filter: 'brightness(0) saturate(100%) invert(39%) sepia(77%) saturate(1498%) hue-rotate(194deg) brightness(93%) contrast(101%)' }}
                    />
                  </div>
                </div>
                <h3 className="text-xl md:text-2xl font-semibold mb-4 transition-all duration-500" style={{ fontFamily: "'Rammetto One', sans-serif" }}>Página Inicial</h3>
                <p className="text-gray-theme mb-6 transition-all duration-500" style={{ fontFamily: "'Sansita', sans-serif" }}>
                  Interface moderna e intuitiva com acesso rápido a todas as funcionalidades
                </p>
                <div className="bg-background rounded-lg p-4 transition-all duration-500 flex-1 min-h-0">
                  <video 
                    autoPlay 
                    loop 
                    muted 
                    playsInline
                    className="w-full h-full rounded-lg object-cover"
                  >
                    <source src="/gifs/home.webm" type="video/webm" />
                  </video>
                </div>
              </div>
            </ScrollAnimation>

            {/* Card: Explorar Escolas */}
            <ScrollAnimation direction="up" duration={500} delay={250}>
              <div className="text-center p-6 rounded-2xl bg-card border border-theme transition-all duration-500 hover:scale-105 flex flex-col">
                <div className="w-16 h-16 md:w-20 md:h-20 bg-primary/20 rounded-full flex items-center justify-center mx-auto mb-6 transition-all duration-500">
                  <div className="w-10 h-10 md:w-12 md:h-12 relative transition-all duration-500">
                    <Image
                      src="/icons/mapa.png"
                      alt="Ícone mapa"
                      fill
                      className="object-contain transition-all duration-500"
                      style={{ filter: 'brightness(0) saturate(100%) invert(39%) sepia(77%) saturate(1498%) hue-rotate(194deg) brightness(93%) contrast(101%)' }}
                    />
                  </div>
                </div>
                <h3 className="text-xl md:text-2xl font-semibold mb-4 transition-all duration-500" style={{ fontFamily: "'Rammetto One', sans-serif" }}>Explorar Escolas</h3>
                <p className="text-gray-theme mb-6 transition-all duration-500" style={{ fontFamily: "'Sansita', sans-serif" }}>
                  Navegue pelo mapa interativo e descubra escolas em qualquer região do Brasil
                </p>
                <div className="bg-background rounded-lg p-4 transition-all duration-500 flex-1 min-h-0">
                  <video 
                    autoPlay 
                    loop 
                    muted 
                    playsInline
                    className="w-full h-full rounded-lg object-cover"
                  >
                    <source src="/gifs/explorarescolas.webm" type="video/webm" />
                  </video>
                </div>
              </div>
            </ScrollAnimation>

            {/* Card: Busca e Dashboard */}
            <ScrollAnimation direction="up" duration={500} delay={300}>
              <div className="text-center p-6 rounded-2xl bg-card border border-theme transition-all duration-500 hover:scale-105 flex flex-col">
                <div className="w-16 h-16 md:w-20 md:h-20 bg-primary/20 rounded-full flex items-center justify-center mx-auto mb-6 transition-all duration-500">
                  <div className="w-10 h-10 md:w-12 md:h-12 relative transition-all duration-500">
                    <Image
                      src="/icons/lupa.png"
                      alt="Ícone busca"
                      fill
                      className="object-contain transition-all duration-500"
                      style={{ filter: 'brightness(0) saturate(100%) invert(39%) sepia(77%) saturate(1498%) hue-rotate(194deg) brightness(93%) contrast(101%)' }}
                    />
                  </div>
                </div>
                <h3 className="text-xl md:text-2xl font-semibold mb-4 transition-all duration-500" style={{ fontFamily: "'Rammetto One', sans-serif" }}>Busca e Dashboard</h3>
                <p className="text-gray-theme mb-6 transition-all duration-500" style={{ fontFamily: "'Sansita', sans-serif" }}>
                  Busque escolas específicas e visualize dashboards completos com todos os dados
                </p>
                <div className="bg-background rounded-lg p-4 transition-all duration-500 flex-1 min-h-0">
                  <video 
                    autoPlay 
                    loop 
                    muted 
                    playsInline
                    className="w-full h-full rounded-lg object-cover"
                  >
                    <source src="/gifs/dashboard.webm" type="video/webm" />
                  </video>
                </div>
              </div>
            </ScrollAnimation>

            {/* Card: Chat com IA */}
            <ScrollAnimation direction="up" duration={500} delay={250}>
              <div className="text-center p-6 rounded-2xl bg-card border border-theme transition-all duration-500 hover:scale-105 flex flex-col">
                <div className="w-16 h-16 md:w-20 md:h-20 bg-primary/20 rounded-full flex items-center justify-center mx-auto mb-6 transition-all duration-500">
                  <div className="w-10 h-10 md:w-12 md:h-12 relative transition-all duration-500">
                    <Image
                      src="/icons/robo.png"
                      alt="Ícone IA"
                      fill
                      className="object-contain transition-all duration-500"
                      style={{ filter: 'brightness(0) saturate(100%) invert(39%) sepia(77%) saturate(1498%) hue-rotate(194deg) brightness(93%) contrast(101%)' }}
                    />
                  </div>
                </div>
                <h3 className="text-xl md:text-2xl font-semibold mb-4 transition-all duration-500" style={{ fontFamily: "'Rammetto One', sans-serif" }}>Chat com IA em Ação</h3>
                <p className="text-gray-theme mb-6 transition-all duration-500" style={{ fontFamily: "'Sansita', sans-serif" }}>
                  Converse naturalmente com nossa IA e veja a geração de relatórios em PDF
                </p>
                <div className="bg-background rounded-lg p-4 transition-all duration-500 flex-1 min-h-0">
                  <video 
                    autoPlay 
                    loop 
                    muted 
                    playsInline
                    className="w-full h-full rounded-lg object-cover"
                  >
                    <source src="/gifs/rag.webm" type="video/webm" />
                  </video>
                </div>
              </div>
            </ScrollAnimation>
          </div>
        </section>

        {/* Seção: Evolução do Produto */}
        <section className="py-20 bg-card rounded-2xl px-6 md:px-8 transition-all duration-500 mt-16">
          <ScrollAnimation direction="up" duration={500} delay={100}>
            <h2 className="text-3xl md:text-4xl font-bold text-center mb-12 transition-all duration-500" style={{ fontFamily: "'Rammetto One', sans-serif" }}>Evolução do Produto</h2>
          </ScrollAnimation>
          
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-10 md:gap-14 transition-all duration-500">
            {/* Release 1 */}
            <ScrollAnimation direction="up" duration={500} delay={150}>
              <div className="bg-background border border-theme rounded-2xl p-6 transition-all duration-500 hover:scale-105 h-[380px] flex flex-col">
                <div className="flex items-center mb-6">
                  <div className="w-12 h-12 bg-primary text-white rounded-full flex items-center justify-center text-lg font-bold mr-4">
                    1.0
                  </div>
                  <div>
                    <h3 className="text-xl font-semibold transition-all duration-500" style={{ fontFamily: "'Rammetto One', sans-serif" }}>Release 1 - Fundação</h3>
                    <p className="text-gray-theme text-sm" style={{ fontFamily: "'Sansita', sans-serif" }}>Base Sólida do Projeto</p>
                  </div>
                </div>
                <ul className="space-y-3 text-text transition-all duration-500 flex-grow" style={{ fontFamily: "'Sansita', sans-serif" }}>
                  <li className="flex items-start">
                    <span className="text-primary mr-3">•</span>
                    <span>Story Map completo com épicos e features</span>
                  </li>
                  <li className="flex items-start">
                    <span className="text-primary mr-3">•</span>
                    <span>Protótipos de baixa e alta fidelidade</span>
                  </li>
                  <li className="flex items-start">
                    <span className="text-primary mr-3">•</span>
                    <span>Arquitetura definida e documentada (ADRs)</span>
                  </li>
                  <li className="flex items-start">
                    <span className="text-primary mr-3">•</span>
                    <span>Configuração completa do ambiente</span>
                  </li>
                  <li className="flex items-start">
                    <span className="text-primary mr-3">•</span>
                    <span>Padrões de software livre implementados</span>
                  </li>
                </ul>
              </div>
            </ScrollAnimation>

            {/* Release 2 */}
            <ScrollAnimation direction="up" duration={500} delay={200}>
              <div className="bg-background border border-theme rounded-2xl p-6 transition-all duration-500 hover:scale-105 h-[380px] flex flex-col">
                <div className="flex items-center mb-6">
                  <div className="w-12 h-12 bg-primary text-white rounded-full flex items-center justify-center text-lg font-bold mr-4">
                    2.0
                  </div>
                  <div>
                    <h3 className="text-xl font-semibold transition-all duration-500" style={{ fontFamily: "'Rammetto One', sans-serif" }}>Release 2 - Funcionalidades</h3>
                    <p className="text-gray-theme text-sm" style={{ fontFamily: "'Sansita', sans-serif" }}>Sistema Completo</p>
                  </div>
                </div>
                <ul className="space-y-3 text-text transition-all duration-500 flex-grow" style={{ fontFamily: "'Sansita', sans-serif" }}>
                  <li className="flex items-start">
                    <span className="text-primary mr-3">•</span>
                    <span>Mapa interativo de escolas brasileiras</span>
                  </li>
                  <li className="flex items-start">
                    <span className="text-primary mr-3">•</span>
                    <span>Chat com IA educacional (RAG)</span>
                  </li>
                  <li className="flex items-start">
                    <span className="text-primary mr-3">•</span>
                    <span>Sistema de geração de PDFs inteligente</span>
                  </li>
                  <li className="flex items-start">
                    <span className="text-primary mr-3">•</span>
                    <span>Dashboard completo das escolas</span>
                  </li>
                  <li className="flex items-start">
                    <span className="text-primary mr-3">•</span>
                    <span>Busca avançada e filtros</span>
                  </li>
                  <li className="flex items-start">
                    <span className="text-primary mr-3">•</span>
                    <span>Testes de integração e cobertura</span>
                  </li>
                </ul>
              </div>
            </ScrollAnimation>
          </div>
        </section>

        {/* Seção: Problema */}
        <section className="py-20 transition-all duration-500">
          <ScrollAnimation direction="up" duration={500} delay={100}>
            <h2 className="text-3xl md:text-4xl font-bold text-center mb-12 transition-all duration-500" style={{ fontFamily: "'Rammetto One', sans-serif" }}>O Desafio dos Dados Educacionais</h2>
          </ScrollAnimation>
          
          <ScrollAnimation direction="up" duration={500} delay={150}>
            <div className="bg-card border border-theme rounded-2xl p-6 md:p-8 transition-all duration-500">
              <p className="text-lg text-text mb-6 transition-all duration-500" style={{ fontFamily: "'Sansita', sans-serif" }}>
                Os dados do Censo Escolar brasileiro representam um tesouro de informações sobre a educação nacional. No entanto:
              </p>
              <ul className="space-y-4 text-text transition-all duration-500" style={{ fontFamily: "'Sansita', sans-serif" }}>
                <li className="flex items-start transition-all duration-500">
                  <span className="text-primary mr-3">•</span>
                  <span>Dados complexos e dispersos em múltiplas planilhas</span>
                </li>
                <li className="flex items-start transition-all duration-500">
                  <span className="text-primary mr-3">•</span>
                  <span>Filtragem e análise técnica exigem conhecimento especializado</span>
                </li>
                <li className="flex items-start transition-all duration-500">
                  <span className="text-primary mr-3">•</span>
                  <span>Dificuldade em visualizar tendências e comparar indicadores</span>
                </li>
                <li className="flex items-start transition-all duration-500">
                  <span className="text-primary mr-3">•</span>
                  <span>Acesso limitado a informações consolidadas sobre infraestrutura</span>
                </li>
              </ul>
            </div>
          </ScrollAnimation>
        </section>

        {/* Seção: Por que escolher o InfoSchool? */}
        <section className="py-20 bg-card rounded-2xl px-6 md:px-8 transition-all duration-500">
          <ScrollAnimation direction="up" duration={500} delay={100}>
            <h2 className="text-3xl md:text-4xl font-bold text-center mb-12 transition-all duration-500" style={{ fontFamily: "'Rammetto One', sans-serif" }}>Por que escolher o InfoSchool?</h2>
          </ScrollAnimation>
          
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 md:gap-8 transition-all duration-500">
            <ScrollAnimation direction="up" duration={500} delay={150}>
              <div className="bg-background border border-theme rounded-2xl p-6 text-center transition-all duration-500 hover:scale-105 h-[240px] flex flex-col justify-center">
                <h3 className="text-xl font-semibold mb-4 text-primary transition-all duration-500" style={{ fontFamily: "'Rammetto One', sans-serif" }}>Dados Completos</h3>
                <p className="text-text transition-all duration-500" style={{ fontFamily: "'Sansita', sans-serif" }}>
                  Acesso a dados educacionais de 2011 até 2024
                </p>
              </div>
            </ScrollAnimation>

            <ScrollAnimation direction="up" duration={500} delay={200}>
              <div className="bg-background border border-theme rounded-2xl p-6 text-center transition-all duration-500 hover:scale-105 h-[240px] flex flex-col justify-center">
                <h3 className="text-xl font-semibold mb-4 text-primary transition-all duration-500" style={{ fontFamily: "'Rammetto One', sans-serif" }}>Interface Intuitiva</h3>
                <p className="text-text transition-all duration-500" style={{ fontFamily: "'Sansita', sans-serif" }}>
                  Navegação simples mesmo para usuários sem experiência técnica
                </p>
              </div>
            </ScrollAnimation>

            <ScrollAnimation direction="up" duration={500} delay={250}>
              <div className="bg-background border border-theme rounded-2xl p-6 text-center transition-all duration-500 hover:scale-105 h-[240px] flex flex-col justify-center">
                <h3 className="text-xl font-semibold mb-4 text-primary transition-all duration-500" style={{ fontFamily: "'Rammetto One', sans-serif" }}>Relatórios Personalizados</h3>
                <p className="text-text transition-all duration-500" style={{ fontFamily: "'Sansita', sans-serif" }}>
                  Geração de PDFs com informações específicas para suas necessidades
                </p>
              </div>
            </ScrollAnimation>

            <ScrollAnimation direction="up" duration={500} delay={300}>
              <div className="bg-background border border-theme rounded-2xl p-6 text-center transition-all duration-500 hover:scale-105 h-[240px] flex flex-col justify-center">
                <h3 className="text-xl font-semibold mb-4 text-primary transition-all duration-500" style={{ fontFamily: "'Rammetto One', sans-serif" }}>Comparações Detalhadas</h3>
                <p className="text-text transition-all duration-500" style={{ fontFamily: "'Sansita', sans-serif" }}>
                  Analise e compare escolas, municípios e estados brasileiros
                </p>
              </div>
            </ScrollAnimation>
          </div>
        </section>

        {/* Seção: Nossos Números */}
        <section className="py-16 transition-all duration-500">
          <ScrollAnimation direction="up" duration={500} delay={100}>
            <h2 className="text-3xl md:text-4xl font-bold text-center mb-12 transition-all duration-500" style={{ fontFamily: "'Rammetto One', sans-serif" }}>Nossos Números</h2>
          </ScrollAnimation>
          
          <div className="grid grid-cols-2 md:grid-cols-3 gap-4 md:gap-6 transition-all duration-500">
            <ScrollAnimation direction="up" duration={500} delay={150}>
              <div className="bg-card border border-theme rounded-2xl p-4 md:p-6 text-center transition-all duration-500 hover:scale-105">
                <div className="text-2xl md:text-3xl lg:text-4xl font-bold text-primary mb-2 transition-all duration-500">200K+</div>
                <div className="text-text text-sm md:text-base transition-all duration-500" style={{ fontFamily: "'Sansita', sans-serif" }}>Escolas Mapeadas por Ano</div>
              </div>
            </ScrollAnimation>

            <ScrollAnimation direction="up" duration={500} delay={200}>
              <div className="bg-card border border-theme rounded-2xl p-4 md:p-6 text-center transition-all duration-500 hover:scale-105">
                <div className="text-2xl md:text-3xl lg:text-4xl font-bold text-primary mb-2 transition-all duration-500">13</div>
                <div className="text-text text-sm md:text-base transition-all duration-500" style={{ fontFamily: "'Sansita', sans-serif" }}>Anos de Dados</div>
              </div>
            </ScrollAnimation>

            <ScrollAnimation direction="up" duration={500} delay={250}>
              <div className="bg-card border border-theme rounded-2xl p-4 md:p-6 text-center transition-all duration-500 hover:scale-105 col-span-2 md:col-span-1">
                <div className="text-2xl md:text-3xl lg:text-4xl font-bold text-primary mb-2 transition-all duration-500">5.570</div>
                <div className="text-text text-sm md:text-base transition-all duration-500" style={{ fontFamily: "'Sansita', sans-serif" }}>Municípios</div>
              </div>
            </ScrollAnimation>
          </div>
        </section>

        {/* Seção: Solução */}
        <section id="solucao" className="py-16 transition-all duration-500">
          <ScrollAnimation direction="up" duration={500} delay={100}>
            <h2 className="text-3xl md:text-4xl font-bold text-center mb-4 transition-all duration-500" style={{ fontFamily: "'Rammetto One', sans-serif" }}>A Solução InfoSchool</h2>
          </ScrollAnimation>

          <ScrollAnimation direction="up" duration={500} delay={150}>
            <p className="text-xl text-gray-theme text-center mb-12 max-w-3xl mx-auto px-4 transition-all duration-500" style={{ fontFamily: "'Sansita', sans-serif" }}>
              Três caminhos intuitivos para explorar dados educacionais
            </p>
          </ScrollAnimation>

          <div className="grid grid-cols-1 lg:grid-cols-3 gap-6 md:gap-8 transition-all duration-500">
            {/* Caminho 1 - Busca */}
            <ScrollAnimation direction="up" duration={500} delay={200}>
              <div className="text-center p-6 rounded-2xl bg-card border border-theme transition-all duration-500 hover:scale-105 h-[480px] flex flex-col">
                <div className="w-16 h-16 md:w-20 md:h-20 bg-primary/20 rounded-full flex items-center justify-center mx-auto mb-6 transition-all duration-500">
                  <div className="w-10 h-10 md:w-12 md:h-12 relative transition-all duration-500">
                    <Image
                      src="/icons/lupa.png"
                      alt="Ícone de busca"
                      fill
                      className="object-contain transition-all duration-500"
                      style={{ filter: 'brightness(0) saturate(100%) invert(39%) sepia(77%) saturate(1498%) hue-rotate(194deg) brightness(93%) contrast(101%)' }}
                    />
                  </div>
                </div>
                <h3 className="text-xl md:text-2xl font-semibold mb-4 transition-all duration-500" style={{ fontFamily: "'Rammetto One', sans-serif" }}>Busca Rápida</h3>
                <p className="text-gray-theme mb-4 transition-all duration-500 flex-grow" style={{ fontFamily: "'Sansita', sans-serif" }}>
                  Como um Google educacional. Digite o nome da escola e encontre instantaneamente.
                </p>
                <div className="bg-background rounded-lg p-4 text-sm transition-all duration-500">
                  <code className="text-primary transition-all duration-500" style={{ fontFamily: "'Sansita', sans-serif" }}>"Colégio São Paulo" → São Paulo/SP - Estadual</code>
                </div>
              </div>
            </ScrollAnimation>

            {/* Caminho 2 - Mapa */}
            <ScrollAnimation direction="up" duration={500} delay={250}>
              <div className="text-center p-6 rounded-2xl bg-card border border-theme transition-all duration-500 hover:scale-105 h-[480px] flex flex-col">
                <div className="w-16 h-16 md:w-20 md:h-20 bg-primary/20 rounded-full flex items-center justify-center mx-auto mb-6 transition-all duration-500">
                  <div className="w-10 h-10 md:w-12 md:h-12 relative transition-all duration-500">
                    <Image
                      src="/icons/mapa.png"
                      alt="Ícone de mapa"
                      fill
                      className="object-contain transition-all duration-500"
                      style={{ filter: 'brightness(0) saturate(100%) invert(39%) sepia(77%) saturate(1498%) hue-rotate(194deg) brightness(93%) contrast(101%)' }}
                    />
                  </div>
                </div>
                <h3 className="text-xl md:text-2xl font-semibold mb-4 transition-all duration-500" style={{ fontFamily: "'Rammetto One', sans-serif" }}>Mapa Interativo</h3>
                <p className="text-gray-theme mb-4 transition-all duration-500 flex-grow" style={{ fontFamily: "'Sansita', sans-serif" }}>
                  Navegue visualmente: Brasil → Estado → Município → Escola. Perfeito para exploração geográfica.
                </p>
                <div className="bg-background rounded-lg p-4 text-sm transition-all duration-500">
                  <code className="text-primary transition-all duration-500" style={{ fontFamily: "'Sansita', sans-serif" }}>Navegação visual e intuitiva</code>
                </div>
              </div>
            </ScrollAnimation>

            {/* Caminho 3 - IA */}
            <ScrollAnimation direction="up" duration={500} delay={300}>
              <div className="text-center p-6 rounded-2xl bg-card border border-theme transition-all duration-500 hover:scale-105 h-[480px] flex flex-col">
                <div className="w-16 h-16 md:w-20 md:h-20 bg-primary/20 rounded-full flex items-center justify-center mx-auto mb-6 transition-all duration-500">
                  <div className="w-10 h-10 md:w-12 md:h-12 relative transition-all duration-500">
                    <Image
                      src="/icons/robo.png"
                      alt="Ícone de robô"
                      fill
                      className="object-contain transition-all duration-500"
                      style={{ filter: 'brightness(0) saturate(100%) invert(39%) sepia(77%) saturate(1498%) hue-rotate(194deg) brightness(93%) contrast(101%)' }}
                    />
                  </div>
                </div>
                <h3 className="text-xl md:text-2xl font-semibold mb-4 transition-all duration-500" style={{ fontFamily: "'Rammetto One', sans-serif" }}>Chat com IA</h3>
                <p className="text-gray-theme mb-4 transition-all duration-500 flex-grow" style={{ fontFamily: "'Sansita', sans-serif" }}>
                  Pergunte em linguagem natural. Nossa IA "Aluno" encontra as respostas e gera PDFs personalizados.
                </p>
                <div className="bg-background rounded-lg p-4 text-sm transition-all duration-500">
                  <code className="text-primary transition-all duration-500" style={{ fontFamily: "'Sansita', sans-serif" }}>"Mostre escolas com acesso à internet"</code>
                </div>
              </div>
            </ScrollAnimation>
          </div>
        </section>

        {/* Seção: Como Começar */}
        <section className="py-16 bg-card rounded-2xl px-6 md:px-8 transition-all duration-500">
          <ScrollAnimation direction="up" duration={500} delay={100}>
            <h2 className="text-3xl md:text-4xl font-bold text-center mb-12 transition-all duration-500" style={{ fontFamily: "'Rammetto One', sans-serif" }}>Como Começar</h2>
          </ScrollAnimation>
          
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 transition-all duration-500">
            <ScrollAnimation direction="up" duration={500} delay={150}>
              <div className="text-center transition-all duration-500">
                <div className="w-16 h-16 bg-primary text-white rounded-full flex items-center justify-center mx-auto mb-4 text-xl font-bold transition-all duration-500">1</div>
                <h3 className="text-lg font-semibold mb-2 transition-all duration-500" style={{ fontFamily: "'Rammetto One', sans-serif" }}>Escolha o Método</h3>
                <p className="text-text text-sm transition-all duration-500" style={{ fontFamily: "'Sansita', sans-serif" }}>
                  Selecione entre busca rápida, mapa interativo, explorar escolas e chat com IA
                </p>
              </div>
            </ScrollAnimation>

            <ScrollAnimation direction="up" duration={500} delay={200}>
              <div className="text-center transition-all duration-500">
                <div className="w-16 h-16 bg-primary text-white rounded-full flex items-center justify-center mx-auto mb-4 text-xl font-bold transition-all duration-500">2</div>
                <h3 className="text-lg font-semibold mb-2 transition-all duration-500" style={{ fontFamily: "'Rammetto One', sans-serif" }}>Explore os Dados</h3>
                <p className="text-text text-sm transition-all duration-500" style={{ fontFamily: "'Sansita', sans-serif" }}>
                  Navegue pelas informações de forma visual e intuitiva
                </p>
              </div>
            </ScrollAnimation>

            <ScrollAnimation direction="up" duration={500} delay={250}>
              <div className="text-center transition-all duration-500">
                <div className="w-16 h-16 bg-primary text-white rounded-full flex items-center justify-center mx-auto mb-4 text-xl font-bold transition-all duration-500">3</div>
                <h3 className="text-lg font-semibold mb-2 transition-all duration-500" style={{ fontFamily: "'Rammetto One', sans-serif" }}>Gere Relatórios</h3>
                <p className="text-text text-sm transition-all duration-500" style={{ fontFamily: "'Sansita', sans-serif" }}>
                  Crie PDFs personalizados com as informações que precisa
                </p>
              </div>
            </ScrollAnimation>

            <ScrollAnimation direction="up" duration={500} delay={300}>
              <div className="text-center transition-all duration-500">
                <div className="w-16 h-16 bg-primary text-white rounded-full flex items-center justify-center mx-auto mb-4 text-xl font-bold transition-all duration-500">4</div>
                <h3 className="text-lg font-semibold mb-2 transition-all duration-500" style={{ fontFamily: "'Rammetto One', sans-serif" }}>Tome Decisões</h3>
                <p className="text-text text-sm transition-all duration-500" style={{ fontFamily: "'Sansita', sans-serif" }}>
                  Use os insights para tomar decisões educacionais informadas
                </p>
              </div>
            </ScrollAnimation>
          </div>
        </section>

        {/* Seção: Casos de Uso */}
        <section className="py-16 transition-all duration-500">
          <ScrollAnimation direction="up" duration={500} delay={100}>
            <h2 className="text-3xl md:text-4xl font-bold text-center mb-12 transition-all duration-500" style={{ fontFamily: "'Rammetto One', sans-serif" }}>Transformando Decisões Educacionais</h2>
          </ScrollAnimation>
          
          <div className="grid grid-cols-1 lg:grid-cols-3 gap-6 md:gap-8 transition-all duration-500">
            {/* Caso 1 */}
            <ScrollAnimation direction="up" duration={500} delay={150}>
              <div className="bg-card border border-theme rounded-2xl p-6 transition-all duration-500 hover:scale-105 h-[380px] flex flex-col">
                <h3 className="text-xl font-semibold mb-3 transition-all duration-500" style={{ fontFamily: "'Rammetto One', sans-serif" }}>Para Pais</h3>
                <p className="text-text mb-4 transition-all duration-500 flex-grow" style={{ fontFamily: "'Sansita', sans-serif" }}>
                  <strong>Escolha a melhor escola para seu filho</strong> com base em infraestrutura, localização e indicadores reais.
                </p>
                <ul className="text-sm text-gray-theme space-y-1 transition-all duration-500" style={{ fontFamily: "'Sansita', sans-serif" }}>
                  <li>• Compare infraestrutura entre escolas</li>
                  <li>• Verifique localização e acessibilidade</li>
                  <li>• Analise dados de matrícula e corpo docente</li>
                </ul>
              </div>
            </ScrollAnimation>

            {/* Caso 2 */}
            <ScrollAnimation direction="up" duration={500} delay={200}>
              <div className="bg-card border border-theme rounded-2xl p-6 transition-all duration-500 hover:scale-105 h-[380px] flex flex-col">
                <h3 className="text-xl font-semibold mb-3 transition-all duration-500" style={{ fontFamily: "'Rammetto One', sans-serif" }}>Para Pesquisadores</h3>
                <p className="text-text mb-4 transition-all duration-500 flex-grow" style={{ fontFamily: "'Sansita', sans-serif" }}>
                  <strong>Analise a evolução educacional desde 2011</strong> com dados consolidados e ferramentas de análise temporal.
                </p>
                <ul className="text-sm text-gray-theme space-y-1 transition-all duration-500" style={{ fontFamily: "'Sansita', sans-serif" }}>
                  <li>• Dados históricos de 2011-2024</li>
                  <li>• Análise de tendências e correlações</li>
                  <li>• Exportação de dados para pesquisa</li>
                </ul>
              </div>
            </ScrollAnimation>

            {/* Caso 3 */}
            <ScrollAnimation direction="up" duration={500} delay={250}>
              <div className="bg-card border border-theme rounded-2xl p-6 transition-all duration-500 hover:scale-105 h-[380px] flex flex-col">
                <h3 className="text-xl font-semibold mb-3 transition-all duration-500" style={{ fontFamily: "'Rammetto One', sans-serif" }}>Para Gestores Públicos</h3>
                <p className="text-text mb-4 transition-all duration-500 flex-grow" style={{ fontFamily: "'Sansita', sans-serif" }}>
                  <strong>Planeje investimentos com base em dados reais</strong> e identifique prioridades regionais.
                </p>
                <ul className="text-sm text-gray-theme space-y-1 transition-all duration-500" style={{ fontFamily: "'Sansita', sans-serif" }}>
                  <li>• Identifique carências de infraestrutura</li>
                  <li>• Compare desempenho municipal/estadual</li>
                  <li>• Planeje alocação de recursos</li>
                </ul>
              </div>
            </ScrollAnimation>
          </div>
        </section>

        {/* Seção: Dashboard */}
        <section className="py-16 transition-all duration-500">
          <ScrollAnimation direction="up" duration={500} delay={100}>
            <h2 className="text-3xl md:text-4xl font-bold text-center mb-4 transition-all duration-500" style={{ fontFamily: "'Rammetto One', sans-serif" }}>Dashboard Completo</h2>
          </ScrollAnimation>

          <ScrollAnimation direction="up" duration={500} delay={150}>
            <p className="text-xl text-gray-theme text-center mb-12 px-4 transition-all duration-500" style={{ fontFamily: "'Sansita', sans-serif" }}>
              Informações detalhadas sobre cada escola brasileira
            </p>
          </ScrollAnimation>

          <div className="grid grid-cols-1 lg:grid-cols-3 gap-6 md:gap-8 transition-all duration-500">
            {/* Seção 1 */}
            <ScrollAnimation direction="up" duration={500} delay={200}>
              <div className="bg-card border border-theme rounded-2xl p-6 transition-all duration-500 hover:scale-105 h-[380px] flex flex-col">
                <h3 className="text-xl font-semibold mb-4 text-primary transition-all duration-500" style={{ fontFamily: "'Rammetto One', sans-serif" }}>Identificação da Escola</h3>
                <ul className="space-y-2 text-text transition-all duration-500 flex-grow" style={{ fontFamily: "'Sansita', sans-serif" }}>
                  <li>• Nome e Código INEP</li>
                  <li>• Rede: Pública/Privada</li>
                  <li>• Localização: Urbana/Rural</li>
                  <li>• Endereço completo</li>
                  <li>• Telefone e E-mail</li>
                  <li>• Situação e Turnos</li>
                </ul>
              </div>
            </ScrollAnimation>

            {/* Seção 2 */}
            <ScrollAnimation direction="up" duration={500} delay={250}>
              <div className="bg-card border border-theme rounded-2xl p-6 transition-all duration-500 hover:scale-105 h-[380px] flex flex-col">
                <h3 className="text-xl font-semibold mb-4 text-primary transition-all duration-500" style={{ fontFamily: "'Rammetto One', sans-serif" }}>Métricas & Infraestrutura</h3>
                <ul className="space-y-2 text-text transition-all duration-500 flex-grow" style={{ fontFamily: "'Sansita', sans-serif" }}>
                  <li>• Número de Alunos, Professores, Turmas</li>
                  <li>• Salas de aula disponíveis</li>
                  <li>• Laboratórios, Biblioteca, Quadra</li>
                  <li>• Computadores e Internet</li>
                  <li>• Alimentação escolar</li>
                  <li>• Sistema de cotas</li>
                </ul>
              </div>
            </ScrollAnimation>

            {/* Seção 3 */}
            <ScrollAnimation direction="up" duration={500} delay={300}>
              <div className="bg-card border border-theme rounded-2xl p-6 transition-all duration-500 hover:scale-105 h-[380px] flex flex-col">
                <h3 className="text-xl font-semibold mb-4 text-primary transition-all duration-500" style={{ fontFamily: "'Rammetto One', sans-serif" }}>Análise Temporal</h3>
                <ul className="space-y-2 text-text transition-all duration-500 flex-grow" style={{ fontFamily: "'Sansita', sans-serif" }}>
                  <li>• Dados de 2011 até 2024</li>
                  <li>• Evolução de matrículas</li>
                  <li>• Comparativo entre anos</li>
                  <li>• Destaques e indicadores</li>
                  <li>• Comparação com médias</li>
                  <li>• Gráficos interativos</li>
                </ul>
              </div>
            </ScrollAnimation>
          </div>
        </section>

        {/* Seção: Responsividade */}
        <section className="py-16 bg-card rounded-2xl px-6 md:px-8 transition-all duration-500">
          <ScrollAnimation direction="up" duration={500} delay={100}>
            <h2 className="text-3xl md:text-4xl font-bold text-center mb-12 transition-all duration-500" style={{ fontFamily: "'Rammetto One', sans-serif" }}>Responsividade</h2>
          </ScrollAnimation>
          
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4 lg:gap-6 transition-all duration-500">
            <ScrollAnimation direction="up" duration={500} delay={150}>
              <div className="bg-background border border-theme rounded-2xl p-4 lg:p-6 text-center transition-all duration-500 hover:scale-105 h-[200px] flex flex-col justify-center">
                <h3 className="text-lg lg:text-xl font-semibold mb-3 text-primary transition-all duration-500 leading-tight" style={{ fontFamily: "'Rammetto One', sans-serif" }}>Acesso Universal</h3>
                <p className="text-text text-sm lg:text-base transition-all duration-500" style={{ fontFamily: "'Sansita', sans-serif" }}>
                  Funciona em qualquer dispositivo: computador, tablet ou smartphone
                </p>
              </div>
            </ScrollAnimation>

            <ScrollAnimation direction="up" duration={500} delay={200}>
              <div className="bg-background border border-theme rounded-2xl p-4 lg:p-6 text-center transition-all duration-500 hover:scale-105 h-[200px] flex flex-col justify-center">
                <h3 className="text-lg lg:text-xl font-semibold mb-3 text-primary transition-all duration-500 leading-tight" style={{ fontFamily: "'Rammetto One', sans-serif" }}>Interface Adaptável</h3>
                <p className="text-text text-sm lg:text-base transition-all duration-500" style={{ fontFamily: "'Sansita', sans-serif" }}>
                  Layout que se ajusta automaticamente ao tamanho da tela
                </p>
              </div>
            </ScrollAnimation>

            <ScrollAnimation direction="up" duration={500} delay={250}>
              <div className="bg-background border border-theme rounded-2xl p-4 lg:p-6 text-center transition-all duration-500 hover:scale-105 h-[200px] flex flex-col justify-center">
                <h3 className="text-lg lg:text-xl font-semibold mb-3 text-primary transition-all duration-500 leading-tight" style={{ fontFamily: "'Rammetto One', sans-serif" }}>Performance Otimizada</h3>
                <p className="text-text text-sm lg:text-base transition-all duration-500" style={{ fontFamily: "'Sansita', sans-serif" }}>
                  Carregamento rápido mesmo em conexões mais lentas
                </p>
              </div>
            </ScrollAnimation>

            <ScrollAnimation direction="up" duration={500} delay={300}>
              <div className="bg-background border border-theme rounded-2xl p-4 lg:p-6 text-center transition-all duration-500 hover:scale-105 h-[200px] flex flex-col justify-center">
                <h3 className="text-lg lg:text-xl font-semibold mb-3 text-primary transition-all duration-500 leading-tight" style={{ fontFamily: "'Rammetto One', sans-serif" }}>Design Acessível</h3>
                <p className="text-text text-sm lg:text-base transition-all duration-500" style={{ fontFamily: "'Sansita', sans-serif" }}>
                  Interface limpa e intuitiva para todos os usuários
                </p>
              </div>
            </ScrollAnimation>
          </div>
        </section>

        {/* Seção: Inteligência Artificial */}
        <section className="py-16 transition-all duration-500">
          <ScrollAnimation direction="up" duration={500} delay={100}>
            <h2 className="text-3xl md:text-4xl font-bold text-center mb-4 transition-all duration-500" style={{ fontFamily: "'Rammetto One', sans-serif" }}>
              Inteligência Artificial Educacional (RAG)
            </h2>
          </ScrollAnimation>

          <ScrollAnimation direction="up" duration={500} delay={150}>
            <p className="text-xl text-gray-theme text-center mb-12 px-4 transition-all duration-500" style={{ fontFamily: "'Sansita', sans-serif" }}>
              Converse naturalmente com nossa IA "Aluno"
            </p>
          </ScrollAnimation>

          <ScrollAnimation direction="up" duration={500} delay={200}>
            <div className="bg-card border border-theme rounded-2xl p-6 md:p-8 transition-all duration-500">
              <div className="grid grid-cols-1 md:grid-cols-2 gap-6 md:gap-8 transition-all duration-500">
                <div>
                  <h3 className="text-xl font-semibold mb-4 text-primary transition-all duration-500" style={{ fontFamily: "'Rammetto One', sans-serif" }}>O que você pode perguntar:</h3>
                  <ul className="space-y-3 text-text transition-all duration-500" style={{ fontFamily: "'Sansita', sans-serif" }}>
                    <li className="flex items-start transition-all duration-500">
                      <span className="text-primary mr-2">•</span>
                      <span>"Mostre escolas com acesso à internet em Brasília"</span>
                    </li>
                    <li className="flex items-start transition-all duration-500">
                      <span className="text-primary mr-2">•</span>
                      <span>"Compare infraestrutura entre escolas rurais e urbanas"</span>
                    </li>
                    <li className="flex items-start transition-all duration-500">
                      <span className="text-primary mr-2">•</span>
                      <span>"Quais escolas têm biblioteca no Paraná?"</span>
                    </li>
                    <li className="flex items-start transition-all duration-500">
                      <span className="text-primary mr-2">•</span>
                      <span>"Evolução das matrículas em São Paulo desde 2011"</span>
                    </li>
                  </ul>
                </div>
                
                <div>
                  <h3 className="text-xl font-semibold mb-4 text-primary transition-all duration-500" style={{ fontFamily: "'Rammetto One', sans-serif" }}>Sistema de PDFs Inteligente</h3>
                  <ul className="space-y-3 text-text transition-all duration-500" style={{ fontFamily: "'Sansita', sans-serif" }}>
                    <li className="flex items-start transition-all duration-500">
                      <span className="text-primary mr-2">•</span>
                      <span><strong>PDF por categoria:</strong> Cada pergunta gera um PDF específico</span>
                    </li>
                    <li className="flex items-start transition-all duration-500">
                      <span className="text-primary mr-2">•</span>
                      <span><strong>PDF completo:</strong> Todas as informações consolidadas</span>
                    </li>
                    <li className="flex items-start transition-all duration-500">
                      <span className="text-primary mr-2">•</span>
                      <span><strong>Fluxo contínuo:</strong> Pergunte → PDF → Continue conversando</span>
                    </li>
                  </ul>
                </div>
              </div>
            </div>
          </ScrollAnimation>
        </section>

        {/* Seção: Acesso */}
        <section id="acesso" className="py-16 transition-all duration-500">
          <div className="text-center transition-all duration-500">
            <ScrollAnimation direction="up" duration={500} delay={100}>
              <h2 className="text-3xl md:text-4xl font-bold mb-6 transition-all duration-500" style={{ fontFamily: "'Rammetto One', sans-serif" }}>Comece a Explorar Agora</h2>
            </ScrollAnimation>

            <ScrollAnimation direction="up" duration={500} delay={150}>
              <p className="text-xl text-gray-theme mb-8 px-4 transition-all duration-500" style={{ fontFamily: "'Sansita', sans-serif" }}>
                Acesse dados educacionais brasileiros de forma simples e intuitiva
              </p>
            </ScrollAnimation>
            
            <ScrollAnimation direction="up" duration={500} delay={200}>
              <div className="bg-card border border-theme rounded-2xl p-6 md:p-8 max-w-2xl mx-auto transition-all duration-500">
                <h3 className="text-2xl font-semibold mb-4 transition-all duration-500" style={{ fontFamily: "'Rammetto One', sans-serif" }}>Como Acessar</h3>
                <p className="text-lg text-text mb-6 transition-all duration-500" style={{ fontFamily: "'Sansita', sans-serif" }}>
                  Navegue até nossa plataforma e escolha seu caminho de exploração
                </p>
                
                <div className="bg-primary/10 rounded-lg p-4 mb-6 transition-all duration-500">
                  <code className="text-primary text-lg transition-all duration-500" style={{ fontFamily: "'Sansita', sans-serif" }}>http://localhost:3000</code>
                </div>

                <div className="border-t border-theme pt-6 transition-all duration-500">
                  <h4 className="text-lg font-semibold mb-3 transition-all duration-500" style={{ fontFamily: "'Rammetto One', sans-serif" }}>Contato & Suporte</h4>
                  <p className="text-gray-theme transition-all duration-500" style={{ fontFamily: "'Sansita', sans-serif" }}>
                    Dúvidas ou sugestões? Entre em contato conosco:
                  </p>
                  <a 
                    href="mailto:infoschoolunb@gmail.com" 
                    className="text-primary hover:underline font-semibold text-lg transition-all duration-500"
                    style={{ fontFamily: "'Sansita', sans-serif" }}
                  >
                    infoschoolunb@gmail.com
                  </a>
                </div>
              </div>
            </ScrollAnimation>
          </div>
        </section>

      </div>
    </main>
  );
}
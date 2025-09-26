import type { Metadata } from 'next';
import { Inter } from 'next/font/google';
import './globals.css';
import { Header, Footer } from '@/modules/shared/components';

const inter = Inter({ 
  subsets: ['latin'],
});

export const metadata: Metadata = {
  title: 'InfoSchool - Censo Escolar',
  description: 'Plataforma de análise do censo escolar brasileiro',
};

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <html lang="pt-BR">
      <head>
        {/* === FAVICON ATUALIZADO PARA PASTA FAVICON === */}
        <link rel="icon" href="/Favicon/favicon.ico" />
        
        {/* Google Fonts - adicionar Sansita e Harys World */}
        <link
          href="https://fonts.googleapis.com/css2?family=Rammetto+One&display=swap"
          rel="stylesheet"
        />
        <link
          href="https://fonts.googleapis.com/css2?family=Sansita&display=swap"
          rel="stylesheet"
        />
        {/* Fonte Harys World (se for local) */}
        <link
          href="/fonts/Harys-World.ttf"
          rel="stylesheet"
        />
      </head>
      <body className={`${inter.className} bg-[#2D2D2D] text-white min-h-screen flex flex-col`}>
        <Header />
        <main className="flex-1">
          {children}
        </main>
        <Footer />
      </body>
    </html>
  );
}
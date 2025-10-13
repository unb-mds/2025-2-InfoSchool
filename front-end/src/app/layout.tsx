// src/app/layout.tsx
import type { Metadata } from 'next';
import { Inter } from 'next/font/google';
import './globals.css';
import { Header, Footer, ThemeProvider } from '@/modules/shared/components';

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
    <html lang="pt-BR" suppressHydrationWarning>
      <head>
        <script
          dangerouslySetInnerHTML={{
            __html: `
              (function() {
                try {
                  var theme = localStorage.getItem('theme') || 'dark';
                  document.documentElement.classList.toggle('dark', theme === 'dark');
                  document.documentElement.setAttribute('data-theme', theme);
                } catch (e) {}
              })();
            `,
          }}
        />
        <link rel="icon" href="/Favicon/favicon.ico" />
        <link
          href="https://fonts.googleapis.com/css2?family=Rammetto+One&display=swap"
          rel="stylesheet"
        />
        <link
          href="https://fonts.googleapis.com/css2?family=Sansita&display=swap"
          rel="stylesheet"
        />
        <link
          href="/fonts/Harys-World.ttf"
          rel="stylesheet"
        />
      </head>
      <body className={`${inter.className} min-h-screen flex flex-col`}>
        <ThemeProvider>
          <Header />
          <main className="flex-1">
            {children}
          </main>
          <Footer />
        </ThemeProvider>
      </body>
    </html>
  );
}
// Esta é a página índice de municípios - lista ou busca de municípios
'use client';
import { Search } from 'lucide-react';
import { useState } from 'react';
import { useRouter } from 'next/navigation';

export default function MunicipiosIndexPage() {
  const [searchTerm, setSearchTerm] = useState('');
  const router = useRouter();

  // Esta página pode mostrar uma lista de municípios ou um mapa para seleção
  const handleMunicipioSelect = (municipioSlug: string) => {
    router.push(`/municipios/${municipioSlug}`);
  };

  return (
    <main className="min-h-screen bg-background text-text p-8">
      <div className="max-w-2xl mx-auto text-center">
        <h1 className="text-3xl font-bold mb-8">Selecione um Município</h1>
        
        <div className="relative mb-8">
          <Search className="absolute left-4 top-1/2 -translate-y-1/2 text-gray-theme" size={20} />
          <input
            type="text"
            placeholder="Buscar município..."
            className="w-full h-14 rounded-full pl-12 pr-6 focus:outline-none focus:ring-2 focus:ring-primary text-lg bg-card border border-theme text-text"
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
          />
        </div>

        <div className="bg-card rounded-lg p-6 border border-theme">
          <p className="text-text-secondary mb-4">
            Use a barra de pesquisa acima ou navegue pelo mapa para selecionar um município.
          </p>
          <button
            onClick={() => router.push('/mapa')}
            className="bg-primary text-white px-6 py-3 rounded-full hover:bg-primary/90 transition-colors"
          >
            Voltar para o Mapa
          </button>
        </div>
      </div>
    </main>
  );
}
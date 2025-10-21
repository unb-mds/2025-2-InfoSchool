// src/app/municipios/page.tsx - PÁGINA ÍNDICE SIMPLES
'use client';
import { useRouter } from 'next/navigation';

export default function MunicipiosIndexPage() {
  const router = useRouter();

  return (
    <div className="min-h-screen bg-background text-text flex items-center justify-center">
      <div className="text-center max-w-2xl mx-auto p-8">
        <h1 className="text-3xl font-bold mb-6">Municípios</h1>
        <p className="text-lg text-text-secondary mb-8">
          Selecione um município através do mapa ou use a busca para encontrar escolas.
        </p>
        
        <div className="space-y-4">
          <button
            onClick={() => router.push('/mapa')}
            className="w-full bg-primary text-white py-3 px-6 rounded-lg hover:bg-primary/90 transition-colors"
          >
            Voltar para o Mapa
          </button>
          
          <button
            onClick={() => router.push('/estado/sp')}
            className="w-full bg-card border border-theme py-3 px-6 rounded-lg hover:bg-card-alt transition-colors"
          >
            Exemplo: Ver escolas de São Paulo
          </button>
        </div>
      </div>
    </div>
  );
}
'use client';
import { useState, useEffect } from 'react';

interface MapaMunicipiosProps {
  siglaEstado: string;
  searchTerm: string;
}

interface MunicipioData {
  type: string;
  features: Array<{
    type: string;
    properties: {
      name: string;
      code: string;
    };
    geometry: any;
  }>;
}

export default function MapaMunicipios({ siglaEstado, searchTerm }: MapaMunicipiosProps) {
  const [geoData, setGeoData] = useState<MunicipioData | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    async function carregarMunicipios() {
      try {
        setLoading(true);
        setError(null);
        
        const url = `https://raw.githubusercontent.com/filipemeneses/geojson-brazil/master/geojson/counties/counties-${siglaEstado.toLowerCase()}-${getCodigoEstado(siglaEstado)}.json`;
        
        console.log('📡 Carregando municípios de:', url);
        
        const response = await fetch(url);
        
        if (!response.ok) {
          throw new Error(`Erro ao carregar dados: ${response.status}`);
        }
        
        const data = await response.json();
        console.log('✅ Dados carregados:', data.features.length, 'municípios');
        setGeoData(data);
        
      } catch (err) {
        console.error('❌ Erro ao carregar municípios:', err);
        setError(err instanceof Error ? err.message : 'Erro desconhecido');
      } finally {
        setLoading(false);
      }
    }

    carregarMunicipios();
  }, [siglaEstado]);

  function getCodigoEstado(sigla: string): string {
    const codigos: { [key: string]: string } = {
      'ac': '12', 'al': '27', 'ap': '16', 'am': '13', 'ba': '29',
      'ce': '23', 'df': '53', 'es': '32', 'go': '52', 'ma': '21',
      'mt': '51', 'ms': '50', 'mg': '31', 'pa': '15', 'pb': '25',
      'pr': '41', 'pe': '26', 'pi': '22', 'rj': '33', 'rn': '24',
      'rs': '43', 'ro': '11', 'rr': '14', 'sc': '42', 'sp': '35',
      'se': '28', 'to': '17'
    };
    return codigos[sigla.toLowerCase()] || '35';
  }

  // Filtrar municípios baseado na pesquisa
  const municipiosFiltrados = geoData?.features.filter(municipio =>
    municipio.properties.name.toLowerCase().includes(searchTerm.toLowerCase())
  ) || [];

  if (loading) {
    return (
      <div className="flex items-center justify-center h-64">
        <div className="text-lg">🔄 Carregando municípios de {siglaEstado.toUpperCase()}...</div>
      </div>
    );
  }

  if (error) {
    return (
      <div className="flex items-center justify-center h-64">
        <div className="text-red-500 text-center">
          <p className="text-lg">❌ Erro ao carregar municípios</p>
          <p className="text-sm mt-2">{error}</p>
        </div>
      </div>
    );
  }

  return (
    <div className="w-full">
      {/* Lista de Municípios */}
      <div className="max-h-96 overflow-y-auto">
        <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
          {municipiosFiltrados.map((municipio) => (
            <div
              key={municipio.properties.code}
              className="p-4 bg-gray-50 dark:bg-gray-700 rounded-lg border border-gray-200 dark:border-gray-600 hover:bg-blue-50 dark:hover:bg-blue-900 cursor-pointer transition-colors"
            >
              <h3 className="font-medium text-gray-900 dark:text-white">
                {municipio.properties.name}
              </h3>
              <p className="text-sm text-gray-500 dark:text-gray-400 mt-1">
                Código: {municipio.properties.code}
              </p>
            </div>
          ))}
        </div>

        {municipiosFiltrados.length === 0 && searchTerm && (
          <div className="text-center py-8 text-gray-500 dark:text-gray-400">
            Nenhum município encontrado para "{searchTerm}"
          </div>
        )}

        {municipiosFiltrados.length === 0 && !searchTerm && (
          <div className="text-center py-8 text-gray-500 dark:text-gray-400">
            Nenhum município encontrado
          </div>
        )}
      </div>
    </div>
  );
}
// src/services/municipio-service.ts
export interface Escola {
  id: string;
  nome: string;
  municipio: string;
  estado: string;
  codigo_inep: string;
  endereco: string;
  telefone: string;
  email: string;
  tipo: string;
  nivel_ensino: string[];
  latitude?: number;
  longitude?: number;
}

export class MunicipioService {
  private static readonly BASE_URL = 'https://servicodados.ibge.gov.br/api/v3';
  private static municipiosCache: Map<string, any[]> = new Map();

  /**
   * Busca SVG do município
   */
  static async getSVGMunicipio(nomeMunicipio: string, siglaEstado: string): Promise<string> {
    try {
      console.log(`🎯 INICIANDO BUSCA SVG: "${nomeMunicipio}", ${siglaEstado}`);
      
      const codigoIBGE = await this.getCodigoIBGEPorNome(nomeMunicipio, siglaEstado);
      
      if (!codigoIBGE) {
        console.warn('🚨 CÓDIGO IBGE NÃO ENCONTRADO!');
        return this.getSVGFallback(nomeMunicipio);
      }

      console.log(`✅ CÓDIGO ENCONTRADO: ${codigoIBGE}`);

      const url = `https://servicodados.ibge.gov.br/api/v3/malhas/municipios/${codigoIBGE}?formato=image/svg+xml`;
      
      console.log(`🌐 URL: ${url}`);
      
      const response = await fetch(url);
      
      console.log(`📡 STATUS: ${response.status} ${response.statusText}`);

      if (!response.ok) {
        throw new Error(`HTTP ${response.status}: ${response.statusText}`);
      }
      
      const svgContent = await response.text();
      
      console.log(`📦 SVG RECEBIDO: ${svgContent.length} caracteres`);
      
      return svgContent;
      
    } catch (error) {
      console.error('💥 ERRO GRAVE:', error);
      return this.getSVGFallback(nomeMunicipio);
    }
  }

  /**
   * Busca código IBGE pelo nome do município
   */
  private static async getCodigoIBGEPorNome(nomeMunicipio: string, siglaEstado: string): Promise<string | null> {
    try {
      const municipios = await this.getMunicipiosPorEstado(siglaEstado);
      
      const nomeNormalizado = nomeMunicipio
        .normalize('NFD')
        .replace(/[\u0300-\u036f]/g, '')
        .toLowerCase()
        .trim();

      console.log(`🔍 Procurando: "${nomeMunicipio}" -> "${nomeNormalizado}"`);
      
      const municipioEncontrado = municipios.find(m => {
        const nomeIBGE = m.nome
          .normalize('NFD')
          .replace(/[\u0300-\u036f]/g, '')
          .toLowerCase()
          .trim();
        
        return nomeIBGE === nomeNormalizado;
      });

      if (municipioEncontrado) {
        console.log(`✅ Encontrado: ${municipioEncontrado.nome} (${municipioEncontrado.id})`);
        return municipioEncontrado.id;
      } else {
        console.warn(`❌ Não encontrado: ${nomeMunicipio}`);
        console.log('📋 Municípios disponíveis:', municipios.slice(0, 5).map(m => m.nome));
        return null;
      }
      
    } catch (error) {
      console.error('❌ Erro ao buscar código IBGE:', error);
      return null;
    }
  }

  /**
   * Busca TODOS os municípios do estado
   */
  static async getMunicipiosPorEstado(siglaEstado: string): Promise<any[]> {
    const cacheKey = siglaEstado.toUpperCase();
    if (this.municipiosCache.has(cacheKey)) {
      console.log(`📦 Retornando ${this.municipiosCache.get(cacheKey)?.length} municípios do cache`);
      return this.municipiosCache.get(cacheKey)!;
    }

    try {
      const url = `https://servicodados.ibge.gov.br/api/v1/localidades/estados/${siglaEstado}/municipios`;
      
      console.log(`🌐 Buscando TODOS os municípios para: ${siglaEstado}`);
      
      const response = await fetch(url);
      
      if (!response.ok) {
        throw new Error(`HTTP ${response.status}: ${response.statusText}`);
      }
      
      const data = await response.json();
      data.sort((a: any, b: any) => a.nome.localeCompare(b.nome));
      
      console.log(`✅ ${data.length} municípios carregados para ${siglaEstado}`);
      
      this.municipiosCache.set(cacheKey, data);
      return data;
      
    } catch (error) {
      console.error('❌ Erro ao buscar municípios:', error);
      const fallback = this.getMunicipiosFallback(siglaEstado);
      this.municipiosCache.set(cacheKey, fallback);
      return fallback;
    }
  }

  /**
   * Busca escolas do município
   */
  static async getEscolasPorMunicipio(municipio: string, estado: string): Promise<Escola[]> {
    try {
      // Simular delay de rede
      await new Promise(resolve => setTimeout(resolve, 500));
      
      // Dados mockados
      const escolasMock: Escola[] = [
        {
          id: '1',
          nome: `Escola Estadual ${municipio}`,
          municipio: municipio,
          estado: estado,
          codigo_inep: '12345678',
          endereco: `Rua Principal, 123 - Centro, ${municipio}`,
          telefone: '(11) 9999-9999',
          email: `contato@ee${municipio.toLowerCase().replace(/\s/g, '')}.edu.br`,
          tipo: 'Estadual',
          nivel_ensino: ['Fundamental', 'Médio'],
          latitude: -23.5505,
          longitude: -46.6333
        },
        {
          id: '2',
          nome: `Colégio Municipal ${municipio}`,
          municipio: municipio,
          estado: estado,
          codigo_inep: '87654321',
          endereco: `Av. Central, 456 - Centro, ${municipio}`,
          telefone: '(11) 8888-8888',
          email: `contato@cm${municipio.toLowerCase().replace(/\s/g, '')}.edu.br`,
          tipo: 'Municipal',
          nivel_ensino: ['Fundamental'],
          latitude: -23.5515,
          longitude: -46.6343
        },
        {
          id: '3',
          nome: `Escola Particular ${municipio}`,
          municipio: municipio,
          estado: estado,
          codigo_inep: '11223344',
          endereco: `Rua das Flores, 789 - Jardim, ${municipio}`,
          telefone: '(11) 7777-7777',
          email: `contato@ep${municipio.toLowerCase().replace(/\s/g, '')}.edu.br`,
          tipo: 'Privada',
          nivel_ensino: ['Fundamental', 'Médio'],
          latitude: -23.5525,
          longitude: -46.6353
        }
      ];

      console.log(`🎓 Retornando ${escolasMock.length} escolas para ${municipio}`);
      return escolasMock;
      
    } catch (error) {
      console.error('❌ Erro ao buscar escolas:', error);
      return [];
    }
  }

  /**
   * SVG de fallback
   */
  private static getSVGFallback(nomeMunicipio: string): string {
    return `
      <svg width="400" height="400" viewBox="0 0 400 400" xmlns="http://www.w3.org/2000/svg">
        <rect width="400" height="400" fill="#f0f9ff"/>
        <rect x="50" y="50" width="300" height="300" fill="#2C80FF" fill-opacity="0.2" stroke="#1e40af" stroke-width="2"/>
        <circle cx="200" cy="200" r="80" fill="#2C80FF" fill-opacity="0.4" stroke="#1e40af" stroke-width="1.5"/>
        <text x="200" y="190" text-anchor="middle" fill="#1e40af" font-family="Arial" font-size="16" font-weight="bold">
          ${nomeMunicipio}
        </text>
        <text x="200" y="220" text-anchor="middle" fill="#666" font-family="Arial" font-size="12">
          Mapa do Município
        </text>
      </svg>
    `;
  }

  /**
   * Dados de fallback
   */
  private static getMunicipiosFallback(siglaEstado: string): any[] {
    const municipiosFallback: { [key: string]: any[] } = {
      'SP': [
        { id: '3550308', nome: 'São Paulo' }, { id: '3509502', nome: 'Campinas' }, { id: '3548500', nome: 'Santos' },
        { id: '3534401', nome: 'Osasco' }, { id: '3518800', nome: 'Guarulhos' }, { id: '3525904', nome: 'Jundiaí' },
        { id: '3543303', nome: 'Ribeirão Preto' }, { id: '3552205', nome: 'Sorocaba' }
      ],
      'RJ': [
        { id: '3304557', nome: 'Rio de Janeiro' }, { id: '3303302', nome: 'Niterói' }, { id: '3305109', nome: 'São Gonçalo' }
      ],
      'MG': [
        { id: '3106200', nome: 'Belo Horizonte' }, { id: '3170206', nome: 'Uberlândia' }
      ]
    };
    return municipiosFallback[siglaEstado] || [];
  }
}
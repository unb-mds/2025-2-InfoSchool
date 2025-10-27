const EmbeddingService = require("./embeddingService");
const VectorStoreService = require("./vectorStoreService");
const BigQueryService = require("../integrations/bigQueryService");

class RAGService {
  constructor() {
    this.embeddingService = new EmbeddingService();
    this.vectorStore = new VectorStoreService();
    this.bigQuery = new BigQueryService();
  }

  async processQuestion(question, contextSchoolId = null) {
    try {
      // 1. Análise da pergunta para determinar intenção
      const intent = await this.analyzeIntent(question);

      // 2. Buscar dados relevantes do BigQuery baseado na intenção
      const contextData = await this.getRelevantData(
        question,
        intent,
        contextSchoolId
      );

      // 3. Construir contexto para o LLM
      const context = this.buildContext(contextData, question, intent);

      // 4. Gerar resposta
      const answer = await this.generateAnswer(question, context);

      return {
        answer,
        sources: contextData.sources,
        statistics: contextData.statistics,
        intent,
      };
    } catch (error) {
      console.error("Erro no processamento RAG:", error);
      throw error;
    }
  }

  async analyzeIntent(question) {
    const prompt = `
        Analise a pergunta sobre educação e classifique a intenção:
        
        Pergunta: "${question}"
        
        Possíveis categorias:
        - "school_info": Informações específicas de uma escola
        - "comparison": Comparação entre escolas
        - "statistics": Dados estatísticos e métricas
        - "location": Busca por localização
        - "trends": Tendências e evolução temporal
        - "general": Informações gerais sobre educação
        
        Responda APENAS com a categoria mais apropriada.
        `;

    // Usar LLM para classificação simples
    const response = await this.generateAnswer(prompt, "", {
      temperature: 0.1,
    });
    return response.trim().toLowerCase();
  }

  async getRelevantData(question, intent, schoolId) {
    switch (intent) {
      case "school_info":
        return await this.getSchoolInfoData(question, schoolId);

      case "comparison":
        return await this.getComparisonData(question, schoolId);

      case "statistics":
        return await this.getStatisticsData(question);

      case "location":
        return await this.getLocationData(question);

      default:
        return await this.getGeneralData(question);
    }
  }

  async getSchoolInfoData(question, schoolId) {
    let targetSchoolId = schoolId;

    // Extrair código da escola da pergunta se não fornecido
    if (!targetSchoolId) {
      const schoolCodeMatch = question.match(/\b\d{8}\b/); // Código INEP tem 8 dígitos
      if (schoolCodeMatch) {
        targetSchoolId = schoolCodeMatch[0];
      }
    }

    if (targetSchoolId) {
      const schoolData = await this.bigQuery.getSchoolData(targetSchoolId);
      const statistics = await this.bigQuery.getSchoolStatistics(
        targetSchoolId
      );
      const similarSchools = await this.bigQuery.getComparativeData(
        targetSchoolId,
        3
      );

      return {
        school: schoolData,
        statistics,
        similarSchools,
        sources: [schoolData].filter(Boolean),
      };
    }

    // Buscar escola por nome se código não encontrado
    const schoolNameMatch = question.match(/escola\s+([^,.!?]+)/i);
    if (schoolNameMatch) {
      const schoolName = schoolNameMatch[1].trim();
      const schools = await this.bigQuery.searchSchools({ name: schoolName });
      return {
        schools,
        sources: schools,
      };
    }

    return { sources: [] };
  }

  async getComparisonData(question, schoolId) {
    if (schoolId) {
      const similarSchools = await this.bigQuery.getComparativeData(
        schoolId,
        5
      );
      const statistics = await this.bigQuery.getSchoolStatistics(schoolId);

      return {
        similarSchools,
        statistics,
        sources: similarSchools,
      };
    }

    return { sources: [] };
  }

  async getStatisticsData(question) {
    const statistics = await this.bigQuery.getSchoolStatistics();

    // Detectar filtros específicos na pergunta
    if (
      question.toLowerCase().includes("município") ||
      question.toLowerCase().includes("cidade")
    ) {
      // Buscar estatísticas por município
    }

    return {
      statistics,
      sources: [statistics],
    };
  }

  async getLocationData(question) {
    // Extrair localização da pergunta
    const cityMatch = question.match(/(?:em|no|na)\s+([^,.!?]+)/i);
    const stateMatch = question.match(/(?:em|do|de)\s+([A-Z]{2})/i);

    const filters = {};
    if (cityMatch) filters.city = cityMatch[1];
    if (stateMatch) filters.state = stateMatch[1];

    const schools = await this.bigQuery.searchSchools(filters);

    return {
      schools,
      filters,
      sources: schools,
    };
  }

  buildContext(data, question, intent) {
    let context = "Dados do Censo Escolar (BigQuery):\n\n";

    switch (intent) {
      case "school_info":
        if (data.school) {
          context += `--- ESCOLA PRINCIPAL ---\n`;
          context += this.formatSchoolDocument(data.school);
          context += `\n\nEstatísticas da Região:\n`;
          context += `- Média de matrículas na região: ${
            data.statistics?.regional_avg_enrollment?.toFixed(0) || "N/A"
          }\n`;
          context += `- Escolas na região: ${
            data.statistics?.regional_schools || "N/A"
          }\n`;
        }
        if (data.similarSchools?.length > 0) {
          context += `\n--- ESCOLAS SIMILARES ---\n`;
          data.similarSchools.forEach((school, index) => {
            context += `Escola ${index + 1}:\n${this.formatSchoolDocument(
              school
            )}\n`;
          });
        }
        break;

      case "statistics":
        if (data.statistics) {
          context += `Estatísticas Gerais:\n`;
          context += `- Total de escolas: ${data.statistics.total_schools}\n`;
          context += `- Média de matrículas: ${data.statistics.avg_enrollment?.toFixed(
            1
          )}\n`;
          context += `- Total de matrículas: ${data.statistics.total_enrollments?.toLocaleString()}\n`;
          context += `- Escolas com internet: ${data.statistics.internet_percentage?.toFixed(
            1
          )}%\n`;
          context += `- Escolas com biblioteca: ${data.statistics.library_percentage?.toFixed(
            1
          )}%\n`;
        }
        break;

      case "location":
        if (data.schools?.length > 0) {
          context += `Escolas encontradas (${data.schools.length}):\n`;
          data.schools.forEach((school, index) => {
            context += `${index + 1}. ${school.name} - ${school.city}/${
              school.state
            } (${school.total_enrollment} matrículas)\n`;
          });
        }
        break;
    }

    context += `\nPergunta: ${question}`;
    context += `\n\nBaseado nos dados acima, responda de forma precisa e objetiva.`;

    return context;
  }

  formatSchoolDocument(school) {
    if (!school) return "";

    return `
        Nome: ${school.name}
        Código INEP: ${school.id}
        Localização: ${school.city} - ${school.state}
        Tipo: ${this.getAdminType(school.admin_type)}
        
        Matrículas:
        - Total: ${school.total_enrollment || 0}
        - Fundamental: ${school.elementary_enrollment || 0}
        - Médio: ${school.high_school_enrollment || 0}
        
        Infraestrutura:
        - Computadores: ${school.computers || 0}
        - Internet: ${school.internet === "1" ? "Sim" : "Não"}
        - Biblioteca: ${school.library === "1" ? "Sim" : "Não"}
        
        Contato: ${school.address || "N/A"} - Tel: ${school.phone || "N/A"}
        `.trim();
  }

  getAdminType(code) {
    const types = {
      1: "Federal",
      2: "Estadual",
      3: "Municipal",
      4: "Privada",
    };
    return types[code] || "Desconhecida";
  }

  // ... (generateAnswer mantido igual) ...
}

module.exports = RAGService;

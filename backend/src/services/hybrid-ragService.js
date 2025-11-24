const { ChatOpenAI } = require("@langchain/openai");
const { HumanMessage, SystemMessage } = require("@langchain/core/messages");
const { BigQueryService } = require("./bigQueryServices"); 
const vectorStoreService = require("./vectorStoreServices");
const { ENV } = require("../config/environment");

class HybridRAGService {
  constructor() {
    this.llm = new ChatOpenAI({
      openAIApiKey: ENV.OPENAI_API_KEY,
      modelName: "gpt-3.5-turbo",
      temperature: 0.1,
    });
    this.isInitialized = false;
    this.bm25Index = null;
    this.bm25Documents = [];
    this.initializationPromise = null;
    this.bigQueryService = new BigQueryService();
  }

  async initialize() {
    if (this.initializationPromise) {
      return this.initializationPromise;
    }

    this.initializationPromise = (async () => {
      if (this.isInitialized) return;

      console.log("🚀 Inicializando RAG Híbrido...");

      try {
        const dados = await this.bigQueryService.getDadosEscolas();
        console.log(`📊 ${dados.length} registros carregados do BigQuery`);

        const documents = vectorStoreService.createDocumentsFromData(dados);
        console.log(`📄 ${documents.length} documentos criados`);

        // Inicializar Vector Store
        await vectorStoreService.initialize(documents);

        // Inicializar BM25 se tiver documentos
        if (documents.length > 0) {
          await this.initializeBM25(documents);
        } else {
          console.warn("⚠️  Nenhum documento para inicializar BM25");
        }

        this.isInitialized = true;
        console.log("✅ RAG Híbrido inicializado com sucesso");
      } catch (error) {
        console.error("❌ Erro na inicialização do RAG:", error);
        this.initializationPromise = null;
        throw error;
      }
    })();

    return this.initializationPromise;
  }

  async initializeBM25(documents) {
    console.log("🔄 Inicializando BM25...");
    const elasticlunr = require("elasticlunr");

    this.bm25Index = elasticlunr(function () {
      this.addField("nome_escola");
      this.addField("municipio");
      this.addField("uf");
      this.addField("etapa_ensino");
      this.setRef("id_escola");
      this.saveDocument(false);
    });

    documents.forEach((doc) => {
      this.bm25Index.addDoc({
        id_escola: doc.metadata.id_escola,
        nome_escola: doc.metadata.nome_escola,
        municipio: doc.metadata.municipio,
        uf: doc.metadata.uf,
        etapa_ensino: doc.metadata.etapa_ensino,
      });
    });

    this.bm25Documents = documents;
    console.log(`✅ BM25 inicializado com ${documents.length} documentos`);
  }

  async processQuery(pergunta, filtros = {}) {
    if (!this.isInitialized) {
      await this.initialize();
    }

    console.log(`🤖 Processando pergunta: "${pergunta}"`);

    // 1. Análise de intenção
    const intent = await this.analyzeIntent(pergunta);
    console.log(`🎯 Intenção detectada: ${intent}`);

    // 2. Extrair filtros da pergunta e combinar com filtros fornecidos
    const extractedFilters = await this.extractFilters(pergunta);
    const combinedFilters = { ...extractedFilters, ...filtros };
    console.log(`🔍 Filtros:`, combinedFilters);

    // 3. Busca híbrida em paralelo
    const [resultadosVetoriais, resultadosSparsos, resultadosEstruturados] =
      await Promise.all([
        this.safeVectorSearch(pergunta, 5),
        this.safeSparseSearch(pergunta, 5),
        this.getStructuredData(intent, combinedFilters, pergunta),
      ]);

    console.log(
      `📊 Resultados - Vetorial: ${resultadosVetoriais.length}, Esparsa: ${resultadosSparsos.length}, Estruturada: ${resultadosEstruturados.length}`
    );

    // 4. Fusão híbrida com RRF
    const contexto = this.combineResultsRRF(
      resultadosVetoriais,
      resultadosSparsos,
      resultadosEstruturados
    );

    console.log(`🎯 Contexto final: ${contexto.length} itens`);

    // 5. Gerar resposta
    const resposta = await this.generateAnswer(pergunta, contexto, intent);

    return {
      pergunta,
      resposta,
      intent,
      filtros: combinedFilters,
      sources: contexto.slice(0, 3),
      statistics: {
        totalResultados: contexto.length,
        vetorial: resultadosVetoriais.length,
        esparso: resultadosSparsos.length,
        estruturado: resultadosEstruturados.length,
      },
      timestamp: new Date().toISOString(),
    };
  }

  async safeVectorSearch(query, topK) {
    try {
      return await vectorStoreService.search(query, topK);
    } catch (error) {
      console.error("❌ Erro na busca vetorial:", error.message);
      return [];
    }
  }

  async safeSparseSearch(query, topK) {
    try {
      if (!this.bm25Index || this.bm25Documents.length === 0) {
        console.warn("⚠️  BM25 não disponível para busca esparsa");
        return [];
      }
      return await this.sparseSearch(query, topK);
    } catch (error) {
      console.error("❌ Erro na busca esparsa:", error.message);
      return [];
    }
  }

  async sparseSearch(query, topK = 5) {
    const results = this.bm25Index.search(query, {
      fields: {
        nome_escola: { boost: 2 },
        municipio: { boost: 1.5 },
        uf: { boost: 1 },
        etapa_ensino: { boost: 1 },
      },
    });

    return results
      .slice(0, topK)
      .map((result) => {
        const originalDoc = this.bm25Documents.find(
          (doc) => doc.metadata.id_escola === result.ref
        );
        if (!originalDoc) return null;

        return {
          ...originalDoc,
          bm25Score: result.score,
          fonte: "sparse",
        };
      })
      .filter(Boolean);
  }

  async analyzeIntent(question) {
    const prompt = `Analise a pergunta sobre educação e classifique a intenção:

Pergunta: "${question}"

Possíveis categorias:
- "school_info": Informações específicas de uma escola
- "comparison": Comparação entre escolas  
- "statistics": Dados estatísticos e métricas
- "location": Busca por localização
- "general": Informações gerais sobre educação

Responda APENAS com a categoria mais apropriada.`;

    try {
      const response = await this.llm.invoke([new HumanMessage(prompt)]);
      return response.content.trim().toLowerCase();
    } catch (error) {
      console.error("❌ Erro na análise de intenção:", error);
      return "general";
    }
  }

  async getStructuredData(intent, filtros, pergunta) {
    try {
      let queryFiltros = { ...filtros };

      // Ajustar filtros baseado na intenção
      switch (intent) {
        case "school_info":
          const schoolCodeMatch = pergunta.match(/\b\d{8}\b/);
          if (schoolCodeMatch) {
            queryFiltros.id_escola = schoolCodeMatch[0];
          }
          break;

        case "comparison":
          queryFiltros.limit = 10;
          break;

        case "location":
          queryFiltros.limit = 15;
          break;
      }

      return await this.bigQueryService.getDadosEscolas(queryFiltros);
    } catch (error) {
      console.error("❌ Erro na busca estruturada:", error);
      return [];
    }
  }

  combineResultsRRF(vetorial, esparso, estruturado, k = 60) {
    const fusedScores = new Map();

    const addToRRF = (results, source, isStructured = false) => {
      results.forEach((item, rank) => {
        if (!item) return;

        const id = isStructured ? item.id_escola : item.metadata?.id_escola;
        if (!id) return;

        const score = 1 / (rank + k + 1);

        if (fusedScores.has(id)) {
          const existing = fusedScores.get(id);
          existing.score += score;
          existing.sources.add(source);
        } else {
          fusedScores.set(id, {
            item: item,
            score: score,
            sources: new Set([source]),
          });
        }
      });
    };

    // Aplicar RRF para cada fonte
    addToRRF(vetorial, "vector");
    addToRRF(esparso, "sparse");
    addToRRF(estruturado, "structured", true);

    // Ordenar e retornar
    return Array.from(fusedScores.values())
      .sort((a, b) => b.score - a.score)
      .slice(0, 10)
      .map((entry) => {
        const itemData = entry.item.metadata || entry.item;
        return {
          ...itemData,
          hybridScore: entry.score.toFixed(4),
          sources: Array.from(entry.sources),
        };
      });
  }

  async extractFilters(pergunta) {
    const ufMatch = pergunta.match(/\b([A-Z]{2})\b/);

    // Lista mais completa de municípios
    const municipios = [
      "São Paulo",
      "Rio de Janeiro",
      "Belo Horizonte",
      "Brasília",
      "Salvador",
      "Fortaleza",
      "Manaus",
      "Curitiba",
      "Recife",
      "Porto Alegre",
      "Goiânia",
      "Belém",
      "São Luís",
      "Maceió",
      "Campinas",
      "São Gonçalo",
      "Duque de Caxias",
    ];

    const municipioMatch = municipios.find((m) =>
      pergunta.toLowerCase().includes(m.toLowerCase())
    );

    // Extrair etapa de ensino
    let etapa_ensino = null;
    if (pergunta.toLowerCase().includes("fundamental")) {
      etapa_ensino = "Fundamental";
    } else if (
      pergunta.toLowerCase().includes("médio") ||
      pergunta.toLowerCase().includes("medio")
    ) {
      etapa_ensino = "Médio";
    }

    return {
      uf: ufMatch ? ufMatch[1] : null,
      municipio: municipioMatch || null,
      etapa_ensino: etapa_ensino,
    };
  }

  async generateAnswer(pergunta, contexto, intent) {
    if (contexto.length === 0) {
      return "Não encontrei informações suficientes no banco de dados para responder sua pergunta. Tente reformular ou ser mais específico sobre a escola, município ou estado.";
    }

    const contextoTexto = contexto
      .map(
        (item, index) =>
          `${index + 1}. ${item.nome_escola} - ${item.municipio}/${item.uf}\n` +
          `   IDEB: ${item.ideb || "N/A"} | Matrículas: ${
            item.num_matriculas || "N/A"
          }`
      )
      .join("\n\n");

    const systemMessage =
      new SystemMessage(`Você é um assistente especializado em dados educacionais do Censo Escolar. 
Sua função é responder perguntas baseando-se exclusivamente nos dados fornecidos.
Seja direto, informativo e baseie-se apenas nas informações disponíveis.`);

    const humanMessage =
      new HumanMessage(`Com base nos dados do Censo Escolar abaixo, responda a pergunta de forma precisa.

INTENÇÃO: ${intent}
DADOS RELEVANTES:
${contextoTexto}

PERGUNTA: ${pergunta}

INSTRUÇÕES:
- Baseie-se apenas nos dados fornecidos
- Seja direto e informativo
- Se não houver dados suficientes, informe isso
- Destaque informações importantes baseado na intenção`);

    try {
      const response = await this.llm.invoke([systemMessage, humanMessage]);
      return response.content;
    } catch (error) {
      console.error("❌ Erro ao gerar resposta:", error);
      return "Desculpe, não consegui processar sua pergunta no momento. Tente novamente em alguns instantes.";
    }
  }
}

module.exports = new HybridRAGService();

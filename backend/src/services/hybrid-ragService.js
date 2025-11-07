// src/rag/hybrid-rag.service.js
const { OpenAI } = require("@langchain/openai");
const bigQueryService = require("../services/bigQueryServices");
const vectorStoreService = require("../services/vectorStoreServices");
const { ENV } = require("../config/environment");

class HybridRAGService {
  constructor() {
    this.llm = new OpenAI({
      openAIApiKey: ENV.OPENAI_API_KEY,
      modelName: "gpt-3.5-turbo",
      temperature: 0.1,
    });
    this.isInitialized = false;
  }

  async initialize() {
    if (this.isInitialized) return;

    console.log("🚀 Inicializando RAG Híbrido...");

    // Carregar dados iniciais do BigQuery
    const dados = await bigQueryService.getDadosEscolas();
    const documents = vectorStoreService.createDocumentsFromData(dados);

    // Inicializar vector store
    await vectorStoreService.initialize(documents);

    this.isInitialized = true;
    console.log("✅ RAG Híbrido inicializado");
  }

  async processQuery(pergunta) {
    if (!this.isInitialized) {
      await this.initialize();
    }

    // 1. Extrair filtros da pergunta
    const filtros = await this.extractFilters(pergunta);

    // 2. Busca vetorial (semântica)
    const resultadosVetoriais = await vectorStoreService.search(pergunta, 5);

    // 3. Busca estruturada (BigQuery)
    const resultadosEstruturados = await bigQueryService.getDadosEscolas(
      filtros
    );

    // 4. Combinar resultados
    const contexto = this.combineResults(
      resultadosVetoriais,
      resultadosEstruturados
    );

    // 5. Gerar resposta
    const resposta = await this.generateAnswer(pergunta, contexto);

    return {
      pergunta,
      resposta,
      filtros,
      totalResultados: contexto.length,
      exemplos: contexto.slice(0, 3),
    };
  }

  async extractFilters(pergunta) {
    // Extrair UF, município, etc da pergunta
    const ufMatch = pergunta.match(/([A-Z]{2})/);
    const municipios = ["São Paulo", "Rio de Janeiro", "Belo Horizonte"]; // Expandir lista

    const municipioMatch = municipios.find((m) =>
      pergunta.toLowerCase().includes(m.toLowerCase())
    );

    return {
      uf: ufMatch ? ufMatch[1] : null,
      municipio: municipioMatch || null,
    };
  }

  combineResults(vetorial, estruturado) {
    // Estratégia simples: priorizar resultados estruturados
    const combinados = [...estruturado];

    // Adicionar resultados vetoriais únicos
    vetorial.forEach((itemVetorial) => {
      const existe = estruturado.some(
        (itemEstr) => itemEstr.id_escola === itemVetorial.metadata.id_escola
      );

      if (!existe) {
        combinados.push({
          ...itemVetorial.metadata,
          fonte: "vetorial",
        });
      }
    });

    return combinados.slice(0, 10); // Limitar a 10 resultados
  }

  async generateAnswer(pergunta, contexto) {
    const contextoTexto = contexto
      .map(
        (item) =>
          `Escola: ${item.nome_escola}\nLocal: ${item.municipio} - ${item.uf}\nIDEB: ${item.ideb}`
      )
      .join("\n\n");

    const prompt = `
Com base nos dados do Censo Escolar abaixo, responda a pergunta de forma precisa.

DADOS:
${contextoTexto}

PERGUNTA: ${pergunta}

INSTRUÇÕES:
- Responda em português
- Baseie-se apenas nos dados fornecidos
- Seja direto e informativo
- Se não houver dados suficientes, informe isso

RESPOSTA:
    `.trim();

    try {
      const resposta = await this.llm.invoke(prompt);
      return resposta;
    } catch (error) {
      console.error("Erro ao gerar resposta:", error);
      return "Desculpe, não consegui processar sua pergunta no momento.";
    }
  }
}

module.exports = new HybridRAGService();

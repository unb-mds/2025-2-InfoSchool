import { GoogleGenerativeAI } from "@google/generative-ai";
import { BigQueryService } from "./bigQueryServices.js";
import vectorStoreService from "./vectorStoreServices.js";
import { ENV } from "../config/environment.js";

class HybridRAGService {
  constructor() {
    this.genAI = new GoogleGenerativeAI(ENV.GOOGLE_API_KEY);
    this.model = this.genAI.getGenerativeModel({
      model: "gemini-2.0-flash",
      generationConfig: {
        temperature: 0.1,
        topP: 0.8,
        topK: 40,
      }
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
    const elasticlunr = await import("elasticlunr");

    this.bm25Index = elasticlunr.default(function () {
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

    // 1. Obter resumo do Schema
    const schemaSummary = this.bigQueryService.getSchemaSummary();

    // 2. Gerar SQL via LLM
    const sqlQuery = await this.generateSQL(pergunta, schemaSummary);

    let resultados = [];
    let erroSQL = null;

    // 3. Executar SQL
    if (sqlQuery) {
      try {
        const rawResults = await this.bigQueryService.runCustomQuery(sqlQuery);
        // Mapear resultados brutos para o formato estruturado que o frontend espera
        resultados = rawResults.map(row => this.bigQueryService.processarEscolaCompleta(row, '2024'));
      } catch (error) {
        console.error("❌ Falha na execução do SQL gerado:", error.message);
        erroSQL = error.message;
        // Fallback: Poderíamos tentar a busca vetorial aqui se o SQL falhar
      }
    }

    // 4. Gerar Resposta Final
    const resposta = await this.generateAnswer(pergunta, resultados, erroSQL);

    return {
      pergunta,
      resposta,
      intent: "text-to-sql",
      sql: sqlQuery, // Útil para debug
      structuredData: resultados,
      timestamp: new Date().toISOString(),
    };
  }

  async generateSQL(pergunta, schemaSummary) {
    const prompt = `Você é um Engenheiro de Dados Expert em BigQuery.
Sua tarefa é converter a pergunta do usuário em uma consulta SQL válida para o BigQuery.

SCHEMA DO BANCO DE DADOS:
${schemaSummary}

TABELA ALVO: \`${ENV.GOOGLE_CLOUD_PROJECT}.${ENV.BIGQUERY_DATASET}.${ENV.BIGQUERY_TABLE_2024 || '2024'}\`

PERGUNTA DO USUÁRIO: "${pergunta}"

REGRAS:
1. Retorne APENAS o código SQL. Sem markdown, sem explicações.
2. Use \`UPPER()\` para comparar strings (ex: \`UPPER(NO_MUNICIPIO) = UPPER('Brasília')\`).
3. Limite os resultados a 50 linhas (LIMIT 50) se não houver outro limite implícito.
4. Selecione colunas relevantes para responder a pergunta. Se for uma busca geral, selecione NO_ENTIDADE, NO_MUNICIPIO, SG_UF e outras colunas úteis.
5. NÃO use comandos de modificação (DROP, UPDATE, DELETE). Apenas SELECT.
6. Se a pergunta for sobre uma escola específica, tente filtrar por NO_ENTIDADE usando LIKE (ex: \`NO_ENTIDADE LIKE '%NOME%'\`).

SQL:`;

    try {
      const result = await this.model.generateContent(prompt);
      const response = await result.response;
      let sql = response.text().trim();

      // Remove markdown formatting if present
      sql = sql.replace(/```sql/g, '').replace(/```/g, '').trim();

      return sql;
    } catch (error) {
      console.error("❌ Erro ao gerar SQL:", error);
      return null;
    }
  }

  async generateAnswer(pergunta, resultados, erroSQL) {
    if (erroSQL) {
      return "Desculpe, tive um problema técnico ao consultar os dados. Tente reformular sua pergunta.";
    }

    if (!resultados || resultados.length === 0) {
      return "Não encontrei nenhum resultado no banco de dados que corresponda à sua pesquisa.";
    }

    // Formatar resultados para o prompt (JSON stringificado identado)
    const dadosFormatados = JSON.stringify(resultados, null, 2);

    const prompt = `Você é um assistente educacional útil.
Responda à pergunta do usuário com base nos DADOS REAIS retornados do banco de dados.

PERGUNTA: "${pergunta}"

DADOS ENCONTRADOS (${resultados.length} registros):
${dadosFormatados}

INSTRUÇÕES:
1. Use os dados acima para responder.
2. Se for uma lista de escolas, cite algumas e suas características.
3. Se for uma contagem ou estatística, apresente o número.
4. Seja cordial e direto.
5. Se os dados não responderem a pergunta, diga isso claramente.

RESPOSTA:`;

    try {
      const result = await this.model.generateContent(prompt);
      const response = await result.response;
      return response.text();
    } catch (error) {
      console.error("❌ Erro ao gerar resposta final:", error);
      return "Desculpe, não consegui processar a resposta final.";
    }
  }

  // Métodos antigos (Vector/Sparse/RRF) removidos ou comentados para focar no Text-to-SQL
  // Se necessário, podem ser reintroduzidos como fallback.
}

// Exportação usando ES modules
const hybridRAGService = new HybridRAGService();
export default hybridRAGService;
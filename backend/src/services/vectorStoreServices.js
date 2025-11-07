// src/services/vector-store.service.js
const { MemoryVectorStore } = require("langchain/vectorstores/memory");
const { OpenAIEmbeddings } = require("@langchain/openai-embeddings");
const { Document } = require("langchain/document");
const { ENV } = require("../config/environment");

class VectorStoreService {
  constructor() {
    this.embeddings = new OpenAIEmbeddings({
      openAIApiKey: ENV.OPENAI_API_KEY,
    });
    this.vectorStore = null;
  }

  async initialize(documents) {
    console.log("🔄 Inicializando Vector Store...");
    this.vectorStore = await MemoryVectorStore.fromDocuments(
      documents,
      this.embeddings
    );
    console.log("✅ Vector Store inicializado");
    return this.vectorStore;
  }

  async search(query, k = 5) {
    if (!this.vectorStore) {
      throw new Error("Vector Store não inicializado");
    }

    const results = await this.vectorStore.similaritySearch(query, k);
    return results;
  }

  // Converter dados estruturados para documentos
  createDocumentsFromData(dados) {
    return dados.map((escola) => {
      const content = this.formatEscolaContent(escola);

      return new Document({
        pageContent: content,
        metadata: {
          id_escola: escola.id_escola,
          nome_escola: escola.nome_escola,
          municipio: escola.municipio,
          uf: escola.uf,
          etapa_ensino: escola.etapa_ensino,
          ideb: escola.ideb,
        },
      });
    });
  }

  formatEscolaContent(escola) {
    return `
      Escola: ${escola.nome_escola}
      Localização: ${escola.municipio} - ${escola.uf}
      Etapa de Ensino: ${escola.etapa_ensino}
      Número de Matrículas: ${escola.num_matriculas}
      IDEB: ${escola.ideb || "Não informado"}
      Laboratório de Informática: ${
        escola.possui_laboratorio_informatica ? "Sim" : "Não"
      }
      Internet: ${escola.possui_internet ? "Sim" : "Não"}
      Número de Docentes: ${escola.num_docentes}
    `.trim();
  }
}

module.exports = new VectorStoreService();

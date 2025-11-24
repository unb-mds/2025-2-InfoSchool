// src/services/vectorStoreServices.js - VERSÃO SUPER SIMPLIFICADA
class VectorStoreService {
  constructor() {
    this.documents = [];
    this.isInitialized = false;
  }

  async initialize(documents) {
    console.log("🔄 Inicializando Vector Store Simplificado...");
    this.documents = documents;
    this.isInitialized = true;
    console.log(`✅ Vector Store com ${documents.length} documentos`);
    return this;
  }

  async search(query, k = 5) {
    if (!this.isInitialized) {
      throw new Error("Vector Store não inicializado");
    }

    // Busca simples por palavras-chave - FUNCIONA SEM VECTOR STORE COMPLEXO
    const queryLower = query.toLowerCase();
    const scoredDocs = this.documents.map((doc) => {
      const content = doc.pageContent.toLowerCase();
      let score = 0;

      // Contagem simples de palavras em comum
      const queryWords = queryLower.split(/\s+/);
      queryWords.forEach((word) => {
        if (word.length > 2 && content.includes(word)) {
          score += 1;
        }
      });

      return {
        ...doc,
        score,
      };
    });

    const results = scoredDocs
      .filter((doc) => doc.score > 0)
      .sort((a, b) => b.score - a.score)
      .slice(0, k);

    console.log(`🔍 Busca: "${query}" → ${results.length} resultados`);
    return results;
  }

  createDocumentsFromData(dados) {
    return dados.map((escola) => {
      const content = `
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

      return {
        pageContent: content,
        metadata: {
          id_escola: escola.id_escola,
          nome_escola: escola.nome_escola,
          municipio: escola.municipio,
          uf: escola.uf,
          etapa_ensino: escola.etapa_ensino,
          ideb: escola.ideb,
          num_matriculas: escola.num_matriculas,
          possui_laboratorio_informatica: escola.possui_laboratorio_informatica,
          possui_internet: escola.possui_internet,
          num_docentes: escola.num_docentes,
        },
      };
    });
  }
}

module.exports = new VectorStoreService();

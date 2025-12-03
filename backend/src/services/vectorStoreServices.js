import { HNSWLib } from "@langchain/community/vectorstores/hnswlib";
import { GoogleGenerativeAIEmbeddings } from "@langchain/google-genai";
import { ENV } from "../config/environment.js";

class VectorStoreService {
  constructor() {
    this.vectorStore = null;
    this.embeddings = new GoogleGenerativeAIEmbeddings({
      apiKey: ENV.GOOGLE_API_KEY,
      modelName: "text-embedding-004", // Modelo de embeddings do Google
    });
  }

  createDocumentsFromData(dados) {
    console.log(`📄 Criando documentos a partir de ${dados.length} escolas`);

    return dados.map(escola => {
      // Criar texto rico com TODAS as informações para o embedding
      const texto = this.criarTextoParaEmbedding(escola);

      return {
        pageContent: texto,
        metadata: {
          id_escola: escola.identificacao.id_escola,
          nome_escola: escola.identificacao.nome_escola,
          municipio: escola.localizacao.geografia.municipio,
          uf: escola.localizacao.geografia.uf,
          ano_censo: escola.identificacao.ano_censo,
          dependencia: escola.identificacao.dependencia,
          localizacao_tipo: escola.identificacao.localizacao_tipo,

          // Incluir informações quantitativas importantes
          total_matriculas: escola.matriculas.total,
          total_docentes: escola.docentes.total,
          total_turmas: escola.turmas.total,

          // Infraestrutura
          tem_laboratorio_informatica: escola.infraestrutura.dependencias.laboratorio_informatica,
          tem_biblioteca: escola.infraestrutura.dependencias.biblioteca,
          tem_internet: escola.tecnologia.internet.acesso,
          tem_quadra_esportes: escola.infraestrutura.dependencias.quadra_esportes,

          // Etapas ofertadas
          oferta_infantil: escola.oferta_educacional.etapas.infantil,
          oferta_fundamental: escola.oferta_educacional.etapas.fundamental,
          oferta_medio: escola.oferta_educacional.etapas.medio,
          oferta_eja: escola.oferta_educacional.etapas.eja,

          // Características especiais
          caracteristicas: escola.resumo.caracteristicas.join(', '),

          // Dados completos para referência
          dados_completos: escola
        }
      };
    });
  }

  criarTextoParaEmbedding(escola) {
    const partes = [];

    // Identificação básica
    partes.push(`Escola: ${escola.identificacao.nome_escola}`);
    partes.push(`Localização: ${escola.localizacao.geografia.municipio} - ${escola.localizacao.geografia.uf}`);
    partes.push(`Ano: ${escola.identificacao.ano_censo}`);
    partes.push(`Dependência: ${escola.identificacao.dependencia}`);
    partes.push(`Localização: ${escola.identificacao.localizacao_tipo}`);

    // Dados quantitativos
    partes.push(`Matrículas: ${escola.matriculas.total}`);
    partes.push(`Docentes: ${escola.docentes.total}`);
    partes.push(`Turmas: ${escola.turmas.total}`);
    partes.push(`Salas de aula: ${escola.infraestrutura.salas_aula.total}`);

    // Infraestrutura
    if (escola.infraestrutura.dependencias.laboratorio_informatica) partes.push("Possui laboratório de informática");
    if (escola.infraestrutura.dependencias.biblioteca) partes.push("Possui biblioteca");
    if (escola.tecnologia.internet.acesso) partes.push("Possui acesso à internet");
    if (escola.infraestrutura.dependencias.quadra_esportes) partes.push("Possui quadra de esportes");

    // Etapas ofertadas
    const etapas = [];
    if (escola.oferta_educacional.etapas.infantil) etapas.push("Educação Infantil");
    if (escola.oferta_educacional.etapas.fundamental) etapas.push("Ensino Fundamental");
    if (escola.oferta_educacional.etapas.medio) etapas.push("Ensino Médio");
    if (escola.oferta_educacional.etapas.eja) etapas.push("EJA");
    if (etapas.length > 0) partes.push(`Oferta: ${etapas.join(', ')}`);

    // Características especiais
    if (escola.resumo.caracteristicas.length > 0) {
      partes.push(`Características: ${escola.resumo.caracteristicas.join(', ')}`);
    }

    // Recursos tecnológicos
    const recursos = [];
    if (escola.tecnologia.equipamentos.computadores_alunos > 0) recursos.push(`${escola.tecnologia.equipamentos.computadores_alunos} computadores`);
    if (escola.tecnologia.equipamentos.lousa_digital) recursos.push("lousa digital");
    if (recursos.length > 0) partes.push(`Recursos tecnológicos: ${recursos.join(', ')}`);

    return partes.join('. ');
  }

  async initialize(documents) {
    console.log("🚀 Inicializando Vector Store...");
    this.vectorStore = await HNSWLib.fromDocuments(documents, this.embeddings);
    console.log("✅ Vector Store inicializada com sucesso");
  }

  async search(query, topK = 5) {
    if (!this.vectorStore) {
      throw new Error("Vector Store não inicializada");
    }

    const results = await this.vectorStore.similaritySearch(query, topK);
    return results.map(result => ({
      ...result,
      fonte: "vector"
    }));
  }

  async save(path = "./vector-store") {
    if (this.vectorStore) {
      await this.vectorStore.save(path);
      console.log("💾 Vector Store salva em", path);
    }
  }

  async load(path = "./vector-store") {
    this.vectorStore = await HNSWLib.load(path, this.embeddings);
    console.log("📂 Vector Store carregada de", path);
  }
}

// Exportação usando ES modules
const vectorStoreService = new VectorStoreService();
export default vectorStoreService;
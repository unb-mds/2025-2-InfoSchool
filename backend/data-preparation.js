// scripts/data-preparation.js
require("dotenv").config();
const bigQueryService = require("../src/services/bigquery.service");
const vectorStoreService = require("../src/services/vector-store.service");

async function prepareData() {
  try {
    console.log("📥 Preparando dados do Censo Escolar...");

    // Buscar dados do BigQuery
    const dados = await bigQueryService.getDadosEscolas();
    console.log(`✅ ${dados.length} escolas carregadas`);

    // Criar documentos para vector store
    const documents = vectorStoreService.createDocumentsFromData(dados);

    // Inicializar vector store
    await vectorStoreService.initialize(documents);

    console.log("🎉 Dados preparados com sucesso!");
    console.log(`📚 ${documents.length} documentos no vector store`);
  } catch (error) {
    console.error("❌ Erro ao preparar dados:", error);
    process.exit(1);
  }
}

prepareData();

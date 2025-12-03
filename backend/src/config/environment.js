// src/config/environment.js
import dotenv from "dotenv";
import CredentialsManager from "../utils/credentialsManager.js";

// Configurar dotenv PRIMEIRO
dotenv.config();

// Inicializar credenciais ANTES de tudo
const credentialsPath = CredentialsManager.initialize();

const ENV = {
  GOOGLE_CLOUD_PROJECT: process.env.GOOGLE_CLOUD_PROJECT,
  GOOGLE_API_KEY: process.env.GOOGLE_API_KEY,
  GOOGLE_APPLICATION_CREDENTIALS: credentialsPath,
  BIGQUERY_DATASET: process.env.BIGQUERY_DATASET || "censo_escolar",
  BIGQUERY_TABLE: process.env.BIGQUERY_TABLE,

  // Server
  PORT: parseInt(process.env.PORT || "3000"),
  NODE_ENV: process.env.NODE_ENV || "development",
};

// Validação - só exige GOOGLE_API_KEY e GOOGLE_CLOUD_PROJECT
const required = ["GOOGLE_API_KEY", "GOOGLE_CLOUD_PROJECT"];
const missing = required.filter((key) => !ENV[key]);

if (missing.length > 0) {
  console.error("❌ Variáveis de ambiente faltando:", missing.join(", "));
  process.exit(1);
}

if (credentialsPath) {
  console.log("✅ Ambiente configurado com Google AI e BigQuery");
} else {
  console.log("⚠️  Ambiente configurado sem BigQuery (somente API Gemini)");
}

export { ENV };

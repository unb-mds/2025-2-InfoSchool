// src/config/environment.js
import dotenv from "dotenv";
import CredentialsManager from "../utils/credentialsManager.js";

// Configurar dotenv PRIMEIRO
dotenv.config();

// Inicializar credenciais ANTES de tudo
let credentialsPath = null;
try {
  credentialsPath = CredentialsManager.initialize();
} catch (error) {
  console.error("⚠️  Credenciais não disponíveis, BigQuery desabilitado");
}

const ENV = {
  GOOGLE_CLOUD_PROJECT: process.env.GOOGLE_CLOUD_PROJECT,
  GOOGLE_API_KEY: process.env.GOOGLE_API_KEY,
  GOOGLE_APPLICATION_CREDENTIALS: credentialsPath, // Agora é CAMINHO, não JSON
  BIGQUERY_DATASET: process.env.BIGQUERY_DATASET || "censo_escolar",
  BIGQUERY_TABLE: process.env.BIGQUERY_TABLE,

  // Server
  PORT: parseInt(process.env.PORT || "3000"),
  NODE_ENV: process.env.NODE_ENV || "development",
};

// Validação - removemos OPENAI_API_KEY e adicionamos GOOGLE_API_KEY
const required = ["GOOGLE_API_KEY", "GOOGLE_CLOUD_PROJECT"];
const missing = required.filter((key) => !ENV[key]);

if (missing.length > 0) {
  console.error("❌ Variáveis de ambiente faltando:", missing.join(", "));
  console.error("💡 Certifique-se de configurar o arquivo .env corretamente");
  process.exit(1);
}

console.log("✅ Ambiente configurado com Google AI");
export { ENV };

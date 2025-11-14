// src/config/environment.js
require("dotenv").config();

const ENV = {
  // OpenAI
  OPENAI_API_KEY: process.env.OPENAI_API_KEY,

  // Google Cloud
  GOOGLE_CLOUD_PROJECT: process.env.GOOGLE_CLOUD_PROJECT,
  GOOGLE_APPLICATION_CREDENTIALS: process.env.GOOGLE_APPLICATION_CREDENTIALS,
  BIGQUERY_DATASET: process.env.BIGQUERY_DATASET,
  BIGQUERY_TABLE: process.env.BIGQUERY_TABLE,

  // Server
  PORT: parseInt(process.env.PORT || "3000"),
  NODE_ENV: process.env.NODE_ENV || "development",
};

// Validação
const required = ["OPENAI_API_KEY", "GOOGLE_CLOUD_PROJECT"];
const missing = required.filter((key) => !ENV[key]);

if (missing.length > 0) {
  console.error("❌ Variáveis de ambiente faltando:", missing.join(", "));
  process.exit(1);
}

console.log("✅ Ambiente configurado");
module.exports = { ENV };

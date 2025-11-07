// src/config/environment.js
require("dotenv").config();

const ENV = {
  // Google Cloud
  GOOGLE_CLOUD_PROJECT: process.env.GOOGLE_CLOUD_PROJECT,
  GOOGLE_APPLICATION_CREDENTIALS: process.env.GOOGLE_APPLICATION_CREDENTIALS,

  // OpenAI
  OPENAI_API_KEY: process.env.OPENAI_API_KEY,

  // BigQuery
  BIGQUERY_DATASET: process.env.BIGQUERY_DATASET,
  BIGQUERY_TABLE: process.env.BIGQUERY_TABLE,

  // Server
  PORT: parseInt(process.env.PORT || "3000"),
  NODE_ENV: process.env.NODE_ENV || "development",
};

// Validação básica
const required = ["GOOGLE_CLOUD_PROJECT", "OPENAI_API_KEY"];
const missing = required.filter((key) => !ENV[key]);

if (missing.length > 0) {
  console.error("❌ Variáveis de ambiente faltando:", missing.join(", "));
  process.exit(1);
}

console.log("✅ Ambiente configurado");
module.exports = { ENV };

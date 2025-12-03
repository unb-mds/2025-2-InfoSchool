// environment.js - VERSÃO SIMPLIFICADA
import dotenv from "dotenv";

dotenv.config();

export const ENV = {
  // Google APIs
  GOOGLE_CLOUD_PROJECT: process.env.GOOGLE_CLOUD_PROJECT,
  GOOGLE_API_KEY: process.env.GOOGLE_API_KEY,

  // BigQuery - Vamos lidar com credenciais de forma diferente
  BIGQUERY_DATASET: process.env.BIGQUERY_DATASET || "censo_escolar",
  BIGQUERY_TABLE: process.env.BIGQUERY_TABLE || "2024",

  // Server
  PORT: parseInt(process.env.PORT || "3001"),
  NODE_ENV: process.env.NODE_ENV || "production",

  // Apenas validação básica
  validate() {
    if (!this.GOOGLE_API_KEY) {
      console.error("❌ GOOGLE_API_KEY não configurada");
      process.exit(1);
    }
    console.log("✅ Ambiente configurado");
  },
};

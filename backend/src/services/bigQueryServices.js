// src/services/bigquery.service.js
const { BigQuery } = require("@google-cloud/bigquery");
const { ENV } = require("../config/environment");

class BigQueryService {
  constructor() {
    this.bigQuery = new BigQuery({
      projectId: ENV.GOOGLE_CLOUD_PROJECT,
      keyFilename: ENV.GOOGLE_APPLICATION_CREDENTIALS,
    });
  }

  async query(sql) {
    try {
      console.log(
        "📊 Executando query BigQuery:",
        sql.substring(0, 100) + "..."
      );

      const [job] = await this.bigQuery.createQueryJob({
        query: sql,
        location: "US",
      });

      const [rows] = await job.getQueryResults();
      console.log(`✅ ${rows.length} linhas retornadas`);
      return rows;
    } catch (error) {
      console.error("❌ Erro no BigQuery:", error);
      throw error;
    }
  }

  // Método específico para dados do censo
  async getDadosEscolas(filtros = {}) {
    let whereConditions = [];

    if (filtros.uf) {
      whereConditions.push(`uf = '${filtros.uf}'`);
    }

    if (filtros.municipio) {
      whereConditions.push(`municipio = '${filtros.municipio}'`);
    }

    if (filtros.etapa_ensino) {
      whereConditions.push(`etapa_ensino = '${filtros.etapa_ensino}'`);
    }

    const whereClause =
      whereConditions.length > 0
        ? `WHERE ${whereConditions.join(" AND ")}`
        : "";

    const query = `
      SELECT 
        id_escola,
        nome_escola,
        municipio,
        uf,
        etapa_ensino,
        num_matriculas,
        ideb,
        possui_laboratorio_informatica,
        possui_internet,
        num_docentes
      FROM \`${ENV.GOOGLE_CLOUD_PROJECT}.${ENV.BIGQUERY_DATASET}.${ENV.BIGQUERY_TABLE}\`
      ${whereClause}
      LIMIT 1000
    `;

    return await this.query(query);
  }
}

module.exports = new BigQueryService();

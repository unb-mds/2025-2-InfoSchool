const { BigQuery } = require("@google-cloud/bigquery");

class BigQueryService {
  constructor() {
    this.bigquery = new BigQuery({
      projectId: process.env.GCP_PROJECT_ID,
      keyFilename: process.env.GCP_KEY_FILE,
    });
  }

  /**
   * Busca dados básicos de uma escola específica
   */
  async getSchoolData(schoolId) {
    const query = `
            SELECT 
                CO_ENTIDADE as id,
                NO_ENTIDADE as name,
                NO_MUNICIPIO as city,
                SG_UF as state,
                TP_DEPENDENCIA as admin_type,
                QT_MAT_BAS as total_enrollment,
                QT_MAT_FUND as elementary_enrollment,
                QT_MAT_MED as high_school_enrollment,
                QT_COMP_ALUNO as computers,
                IN_INTERNET as internet,
                IN_BIBLIOTECA as library,
                DS_ENDERECO as address,
                NU_DDD, 
                NU_TELEFONE as phone
            FROM \`${process.env.BIGQUERY_DATASET}.${process.env.BIGQUERY_TABLE}\`
            WHERE CO_ENTIDADE = @schoolId
        `;

    const options = {
      query: query,
      params: { schoolId: schoolId },
    };

    const [rows] = await this.bigquery.query(options);
    return rows[0] || null;
  }

  /**
   * Busca escolas por filtros (município, estado, etc)
   */
  async searchSchools(filters = {}) {
    let whereConditions = [];
    let queryParams = {};

    if (filters.city) {
      whereConditions.push("NO_MUNICIPIO LIKE @city");
      queryParams.city = `%${filters.city}%`;
    }

    if (filters.state) {
      whereConditions.push("SG_UF = @state");
      queryParams.state = filters.state;
    }

    if (filters.adminType) {
      whereConditions.push("TP_DEPENDENCIA = @adminType");
      queryParams.adminType = filters.adminType;
    }

    const whereClause =
      whereConditions.length > 0
        ? `WHERE ${whereConditions.join(" AND ")}`
        : "";

    const query = `
            SELECT 
                CO_ENTIDADE as id,
                NO_ENTIDADE as name,
                NO_MUNICIPIO as city,
                SG_UF as state,
                TP_DEPENDENCIA as admin_type,
                QT_MAT_BAS as total_enrollment
            FROM \`${process.env.BIGQUERY_DATASET}.${process.env.BIGQUERY_TABLE}\`
            ${whereClause}
            LIMIT 50
        `;

    const options = {
      query: query,
      params: queryParams,
    };

    const [rows] = await this.bigquery.query(options);
    return rows;
  }

  /**
   * Busca estatísticas agregadas para contexto
   */
  async getSchoolStatistics(schoolId = null) {
    const baseQuery = `
            SELECT 
                COUNT(*) as total_schools,
                AVG(QT_MAT_BAS) as avg_enrollment,
                SUM(QT_MAT_BAS) as total_enrollments,
                AVG(CAST(IN_INTERNET AS INT64)) * 100 as internet_percentage,
                AVG(CAST(IN_BIBLIOTECA AS INT64)) * 100 as library_percentage
            FROM \`${process.env.BIGQUERY_DATASET}.${process.env.BIGQUERY_TABLE}\`
        `;

    let query = baseQuery;
    let params = {};

    if (schoolId) {
      // Estatísticas da região para comparação
      const regionQuery = `
                WITH target_school AS (
                    SELECT SG_UF, NO_MUNICIPIO 
                    FROM \`${process.env.BIGQUERY_DATASET}.${process.env.BIGQUERY_TABLE}\`
                    WHERE CO_ENTIDADE = @schoolId
                )
                SELECT 
                    COUNT(*) as regional_schools,
                    AVG(QT_MAT_BAS) as regional_avg_enrollment,
                    AVG(CAST(IN_INTERNET AS INT64)) * 100 as regional_internet_percentage
                FROM \`${process.env.BIGQUERY_DATASET}.${process.env.BIGQUERY_TABLE}\` s
                JOIN target_school t ON s.SG_UF = t.SG_UF
                WHERE s.NO_MUNICIPIO = t.NO_MUNICIPIO
            `;
      query = regionQuery;
      params = { schoolId };
    }

    const options = { query, params };
    const [rows] = await this.bigquery.query(options);
    return rows[0];
  }

  /**
   * Busca dados comparativos para embedding
   */
  async getComparativeData(schoolId, similarSchoolsCount = 5) {
    const query = `
            WITH target_school AS (
                SELECT SG_UF, NO_MUNICIPIO, QT_MAT_BAS, TP_DEPENDENCIA
                FROM \`${process.env.BIGQUERY_DATASET}.${process.env.BIGQUERY_TABLE}\`
                WHERE CO_ENTIDADE = @schoolId
            )
            SELECT 
                s.CO_ENTIDADE as id,
                s.NO_ENTIDADE as name,
                s.NO_MUNICIPIO as city,
                s.SG_UF as state,
                s.TP_DEPENDENCIA as admin_type,
                s.QT_MAT_BAS as total_enrollment,
                s.QT_MAT_FUND as elementary_enrollment,
                s.QT_MAT_MED as high_school_enrollment,
                s.QT_COMP_ALUNO as computers,
                s.IN_INTERNET as internet,
                s.IN_BIBLIOTECA as library,
                ABS(s.QT_MAT_BAS - t.QT_MAT_BAS) as enrollment_difference
            FROM \`${process.env.BIGQUERY_DATASET}.${process.env.BIGQUERY_TABLE}\` s
            JOIN target_school t ON s.SG_UF = t.SG_UF
            WHERE s.CO_ENTIDADE != @schoolId
            ORDER BY enrollment_difference ASC
            LIMIT @limit
        `;

    const options = {
      query: query,
      params: {
        schoolId: schoolId,
        limit: similarSchoolsCount,
      },
    };

    const [rows] = await this.bigquery.query(options);
    return rows;
  }
}

module.exports = BigQueryService;

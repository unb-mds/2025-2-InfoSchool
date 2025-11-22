const { BigQuery } = require('@google-cloud/bigquery');
const PROJECT_ID = 'infoschool-475602';

const bigquery = new BigQuery({ projectId: PROJECT_ID });

module.exports = async function (fastify, opts) {

  fastify.get('/', async (request, reply) => {
    
    const term = request.query.q;

    if (!term || term.trim() === '') {
      return { escolas: [] };
    }
    
    if (term.trim().length < 3) {
        return { escolas: [] };
    }

    const searchTermForQuery = `%${term.toLowerCase()}%`;

    const query = `
      SELECT
          CAST(CO_ENTIDADE AS STRING) AS id,
          NO_ENTIDADE AS nome,
          NO_MUNICIPIO AS municipio,
          SG_UF AS estado,
          CASE TP_DEPENDENCIA
            WHEN 1 THEN 'Federal'
            WHEN 2 THEN 'Estadual'
            WHEN 3 THEN 'Municipal'
            WHEN 4 THEN 'Privada'
            ELSE 'Não Informado'
          END AS tipo
      FROM
          \`infoschool-475602.escolas.2024\` 
      WHERE
          LOWER(NO_ENTIDADE) LIKE @searchTerm OR
          LOWER(NO_MUNICIPIO) LIKE @searchTerm OR
          LOWER(SG_UF) LIKE @searchTerm
      LIMIT 15;
    `;

    const options = {
      query: query,
      params: { searchTerm: searchTermForQuery },
    };

    try {
      const [rows] = await bigquery.query(options);

      return { escolas: rows };
      
    } catch (error) {
      fastify.log.error(`Erro ao consultar BigQuery: ${error.message}`);
      
      const httpError = new Error('Falha na busca de escolas');
      httpError.statusCode = 500;
      throw httpError;
    }
  });
};
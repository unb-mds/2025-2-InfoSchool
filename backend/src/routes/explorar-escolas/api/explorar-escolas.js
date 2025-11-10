const { BigQuery } = require('@google-cloud/bigquery');

const BIGQUERY_PROJECT_ID = 'infoschool-475602';
const bigquery = new BigQuery({ projectId: BIGQUERY_PROJECT_ID });

const getEscolas = async (fastify, options) => {

  fastify.get('/', async (request, reply) => {

    const { termo, estado, municipio, ano, tipo, pagina, limite } = request.query;

    const pageSize = parseInt(limite) || 50;
    const page = parseInt(pagina) || 1;
    const offset = (page - 1) * pageSize;

    let params = {};
    let whereClauses = [];

    const anoBusca = ano || 2024;
    const tabelaCenso = `\`${BIGQUERY_PROJECT_ID}.escolas.${anoBusca}\``;

    if (termo) {
      whereClauses.push(`(
            UPPER(NO_ENTIDADE) LIKE @termo 
            OR UPPER(NO_MUNICIPIO) LIKE @termo
        )`);
      params.termo = `%${termo.toUpperCase()}%`;
    }
    if (estado) {
      whereClauses.push(`SG_UF = @estado`);
      params.estado = estado;
    }
    if (municipio) {
      whereClauses.push(`NO_MUNICIPIO = @municipio`);
      params.municipio = municipio;
    }
    if (tipo) {
      let codigoDependencia;
      switch (tipo.toLowerCase()) {
        case 'federal': codigoDependencia = 1; break;
        case 'estadual': codigoDependencia = 2; break;
        case 'municipal': codigoDependencia = 3; break;
        case 'privada': codigoDependencia = 4; break;
        default: codigoDependencia = null;
      }
      if (codigoDependencia !== null) {
        whereClauses.push(`TP_DEPENDENCIA = @tipoDependencia`);
        params.tipoDependencia = codigoDependencia;
      }
    }

    const whereCondition = whereClauses.length > 0 ? `WHERE ${whereClauses.join(' AND ')}` : '';

    params.limite = pageSize;
    params.offset = offset;

    try {
      const countQuery = `SELECT COUNT(*) as total FROM ${tabelaCenso} ${whereCondition}`;

      const countParams = { ...params };

      const [countRows] = await bigquery.query({
        query: countQuery,
        params: countParams,
        location: 'US'
      });
      const total = countRows[0].total;

      const dataQuery = `
                SELECT 
                    NO_ENTIDADE, 
                    NO_MUNICIPIO, 
                    SG_UF, 
                    ${anoBusca} AS ano,
                    CASE TP_DEPENDENCIA
                      WHEN 1 THEN 'Federal'
                      WHEN 2 THEN 'Estadual'
                      WHEN 3 THEN 'Municipal'
                      WHEN 4 THEN 'Privada'
                    ELSE 'Não Informado'
                    END AS TP_DEPENDENCIA
                FROM
                    ${tabelaCenso} 
                ${whereCondition}
                ORDER BY 
                    NO_ENTIDADE ASC 
                LIMIT @limite OFFSET @offset
            `;

      const [dataRows] = await bigquery.query({
        query: dataQuery,
        params: params,
        location: 'US'
      });

      reply.send({
        dados: dataRows,
        total: total.toString(),
        paginaAtual: page,
        limite: pageSize
      });

    } catch (error) {
      fastify.log.error(`BigQuery Error: ${error.message}`);

      reply.code(500)
        .header('Content-Type', 'application/json')
        .send({
          error: 'Falha na comunicação com o BigQuery. Verifique a tabela ou o formato da coluna.',
          details: error.message
        });
    }
  });
};

module.exports = getEscolas;
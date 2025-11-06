const { BigQuery } = require('@google-cloud/bigquery');

// Configure o cliente BigQuery com o seu Project ID
// O cliente será reutilizado em todas as requisições, o que é eficiente.
const BIGQUERY_PROJECT_ID = 'infoschool-475602';
const bigquery = new BigQuery({ projectId: BIGQUERY_PROJECT_ID });

const getEscolas = async (fastify, options) => {

  fastify.get('/', async (request, reply) => {

    // 1. RECEBE E TRATA OS PARÂMETROS DA QUERY
    const { termo, estado, municipio, ano, tipo, pagina, limite } = request.query;

    const pageSize = parseInt(limite) || 50;
    const page = parseInt(pagina) || 1;
    const offset = (page - 1) * pageSize;

    // Parâmetros para a consulta BigQuery (Usamos um objeto para segurança)
    let params = {};
    let whereClauses = [];

    // Define a tabela a ser consultada. O nome deve ser em minúsculas
    const anoBusca = ano || 2024; // Assumindo 2023 como ano padrão
    const tabelaCenso = `\`${BIGQUERY_PROJECT_ID}.escolas.${anoBusca}\``;

    // 2. CONSTRUÇÃO DINÂMICA DA CLÁUSULA WHERE

    // A) Busca Parcial (nome ou município) - Usa LIKE e UPPER()
    if (termo) {
      whereClauses.push(`(UPPER(nome_escola) LIKE @termo OR UPPER(nome_municipio) LIKE @termo)`);
      params.termo = `%${termo.toUpperCase()}%`;
    }

    // B) Filtros Exatos (Estado, Município, Tipo)
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

    // Adiciona os parâmetros de paginação (LIMIT/OFFSET)
    params.limite = pageSize;
    params.offset = offset;

    try {
      const countQuery = `SELECT COUNT(*) as total FROM ${tabelaCenso} ${whereCondition}`;

      // Usamos um objeto de parâmetros separado para a contagem, para maior segurança
      const countParams = { ...params };

      const [countRows] = await bigquery.query({
        query: countQuery,
        params: countParams, // Usa os parâmetros de filtro (sem limite/offset)
        location: 'US'
      });
      const total = countRows[0].total;

      // 4. CONSULTA DE DADOS (para trazer a página atual)
      const dataQuery = `
                SELECT 
                    NO_ENTIDADE, 
                    NO_MUNICIPIO, 
                    SG_UF, 
                    ${anoBusca} AS ano, -- Inclui o ano no retorno para o frontend
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

      // 5. RETORNA O RESULTADO FORMATADO
      reply.send({
        dados: dataRows,
        total: total.toString(), // Converte para string para garantir o JSON
        paginaAtual: page,
        limite: pageSize
      });

    } catch (error) {
      // TRATAMENTO DE ERRO CLARO NO FASTIFY
      fastify.log.error(`BigQuery Error: ${error.message}`);

      // Retorna um JSON de erro CLARO com status 500
      reply.code(500)
        .header('Content-Type', 'application/json') // GARANTIA
        .send({
          error: 'Falha na comunicação com o BigQuery. Verifique a tabela ou o formato da coluna.',
          details: error.message
        });
    }
  });
};

module.exports = getEscolas;



/*

        

        const whereCondition = whereClauses.length > 0 ? `WHERE ${whereClauses.join(' AND ')}` : '';
        
        // Adiciona os parâmetros de paginação (LIMIT/OFFSET)
        params.limite = pageSize;
        params.offset = offset;

        try {
            // 3. CONSULTA DE CONTAGEM (para calcular o total de páginas)
            const countQuery = `SELECT COUNT(*) as total FROM ${tabelaCenso} ${whereCondition}`;
            
            const [countRows] = await bigquery.query({ 
                query: countQuery, 
                params: params, // Usa os mesmos parâmetros de filtro
                location: 'US' 
            });
            const total = countRows[0].total;

            // 4. CONSULTA DE DADOS (para trazer a página atual)
            const dataQuery = `
                SELECT 
                    nome_escola, 
                    nome_municipio, 
                    sg_uf, 
                    co_entidade,
                    ${anoBusca} AS ano, -- Inclui o ano no retorno
                    
                    -- ********************************************************
                    -- *** CONVERSÃO DE TP_DEPENDENCIA PARA tipo_escola (Texto) ***
                    -- ********************************************************
                    CASE TP_DEPENDENCIA
                        WHEN 1 THEN 'Federal'
                        WHEN 2 THEN 'Estadual'
                        WHEN 3 THEN 'Municipal'
                        WHEN 4 THEN 'Privada'
                        ELSE 'Não Informado'
                    END AS tipo_escola
                    
                FROM 
                    ${tabelaCenso} 
                ${whereCondition}
                ORDER BY 
                    nome_escola ASC 
                LIMIT @limite OFFSET @offset
            `;

            const [dataRows] = await bigquery.query({ 
                query: dataQuery, 
                params: params, 
                location: 'US' 
            });

            // 5. RETORNA O RESULTADO FORMATADO
            reply.send({
                dados: dataRows,
                total: total.toString(), // Converte para string para garantir o JSON
                paginaAtual: page,
                limite: pageSize
            });

        } catch (error) {
            fastify.log.error(`Erro ao consultar BigQuery na tabela ${tabelaCenso}:`, error);
            // Retorna um erro JSON claro para o frontend
            reply.code(500).send({ 
                error: 'Falha na comunicação com o BigQuery. Verifique o nome da tabela/colunas.',
                details: error.message 
            });
        }
    });
};

module.exports = getEscolas;
*/

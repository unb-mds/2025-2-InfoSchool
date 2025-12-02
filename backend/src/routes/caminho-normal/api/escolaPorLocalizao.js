import { BigQuery } from '@google-cloud/bigquery';

const PROJECT_ID = 'infoschool-475602';
const bigquery = new BigQuery({ projectId: PROJECT_ID });

export default async function (fastify, opts) {
  fastify.get('/', async (request, reply) => {
    // Adicionamos 'busca' aos parâmetros recebidos
    const { uf, municipio, page = 1, limit = 20, busca } = request.query;

    console.log(`🔍 Buscando escolas: UF=${uf}, Cidade=${municipio}, Termo='${busca || ''}'`);

    if (!uf || !municipio) {
      return reply.status(400).send({ error: 'UF e Município são obrigatórios.' });
    }

    const limitNum = parseInt(limit);
    const offset = (parseInt(page) - 1) * limitNum;

    // Tratamento para busca de cidade (Sem acentos, Maiúsculo)
    const municipioNormalizado = municipio
      .normalize('NFD')
      .replace(/[\u0300-\u036f]/g, '')
      .toUpperCase()
      .trim();

    // Objeto base de parâmetros
    const queryParams = {
      uf: uf.toUpperCase().trim(),
      municipio: `%${municipioNormalizado}%`,
      limit: limitNum,
      offset: offset
    };

    // Construção dinâmica do WHERE
    // Nota: Usamos REGEXP_REPLACE para garantir que acentos no banco sejam ignorados
    let sqlWhere = `
      WHERE
          TRIM(SG_UF) = @uf 
          AND UPPER(REGEXP_REPLACE(NORMALIZE(NO_MUNICIPIO, NFD), r'\\pM', '')) LIKE @municipio
    `;

    // LÓGICA NOVA: Se houver termo de busca, filtra também pelo nome da escola
    if (busca && busca.trim()) {
      // CORREÇÃO: Normaliza o termo de busca da escola (Remove acentos)
      // Antes estava apenas uppercase, o que falhava se o usuário digitasse acentos (ex: "São")
      const buscaEscolaNorm = busca
        .normalize('NFD')
        .replace(/[\u0300-\u036f]/g, '')
        .toUpperCase()
        .trim();

      queryParams.buscaEscola = `%${buscaEscolaNorm}%`;

      console.log(`   > Filtro Escola: Original='${busca}' -> Normalizado='${buscaEscolaNorm}'`);

      // Aplica a mesma lógica de ignorar acentos para o nome da escola no banco
      sqlWhere += ` AND UPPER(REGEXP_REPLACE(NORMALIZE(NO_ENTIDADE, NFD), r'\\pM', '')) LIKE @buscaEscola`;
    }

    const query = `
      SELECT
          CAST(CO_ENTIDADE AS STRING) AS id,
          NO_ENTIDADE AS nome,
          NO_BAIRRO AS bairro,
          CASE TP_DEPENDENCIA
            WHEN 1 THEN 'Federal'
            WHEN 2 THEN 'Estadual'
            WHEN 3 THEN 'Municipal'
            WHEN 4 THEN 'Privada'
            ELSE 'Outros'
          END AS tipo
      FROM
          \`infoschool-475602.escolas.2024\`
      ${sqlWhere}
      ORDER BY
          NO_ENTIDADE ASC
      LIMIT @limit OFFSET @offset
    `;

    try {
      const [rows] = await bigquery.query({ query, params: queryParams });

      console.log(`✅ Escolas encontradas: ${rows.length}`);

      // --- MODO DETETIVE: SE NÃO ACHOU NADA E NÃO TEM BUSCA ESPECÍFICA ---
      if (rows.length === 0 && !busca) {
        console.log("⚠️ Nenhuma escola encontrada na cidade. Investigando nomes reais no banco...");

        const debugQuery = `
          SELECT DISTINCT NO_MUNICIPIO 
          FROM \`infoschool-475602.escolas.2024\` 
          WHERE SG_UF = @uf 
          LIMIT 10
        `;

        const [debugRows] = await bigquery.query({
          query: debugQuery,
          params: { uf: queryParams.uf }
        });

        console.log(`\n🔎 CIDADES REAIS NO BANCO PARA UF='${queryParams.uf}':`);
        debugRows.forEach(r => console.log(`   - "${r.NO_MUNICIPIO}"`));
      } else if (rows.length === 0 && busca) {
        console.log(`⚠️ Nenhuma escola encontrada para o termo '${busca}' nesta cidade.`);
      }
      // ------------------------------------------------------------

      // Contagem para paginação usando o mesmo WHERE
      const countQuery = `
        SELECT count(*) as total 
        FROM \`infoschool-475602.escolas.2024\` 
        ${sqlWhere}
      `;
      const [countRows] = await bigquery.query({ query: countQuery, params: queryParams });

      return {
        escolas: rows,
        pagination: {
          page: parseInt(page),
          limit: limitNum,
          totalItems: countRows[0].total,
          totalPages: Math.ceil(countRows[0].total / limitNum)
        }
      };

    } catch (error) {
      console.error(`❌ Erro BigQuery Location:`, error);
      return reply.status(500).send({
        error: 'Erro interno ao buscar escolas.',
        details: error.message
      });
    }
  });
};
import { BigQuery } from '@google-cloud/bigquery';

const PROJECT_ID = process.env.GOOGLE_CLOUD_PROJECT || 'infoschool-475602';
const bigquery = new BigQuery({ projectId: PROJECT_ID });

export default async function (fastify, opts) {

    // Rota GET: /api/escola/historical?id=53018877
    // Retorna dados históricos de matrículas da escola de 2007 até 2024
    fastify.get('/', async (request, reply) => {
        const { id } = request.query;

        if (!id) {
            return reply.status(400).send({ error: 'ID da escola é obrigatório.' });
        }

        const escolaId = id.trim();
        console.log(`📊 Buscando dados históricos para escola ID: ${escolaId}`);

        // Anos com estrutura de dados compatível (2011-2024)
        // Anos 2007-2010 têm CSV com delimitador diferente (;) e colunas incompatíveis
        const anos = [2024, 2023, 2022, 2021, 2020, 2019, 2018, 2017, 2016, 2015, 2014, 2013, 2012, 2011];
        const dadosHistoricos = [];

        try {
            // Busca dados de cada ano em paralelo
            const promises = anos.map(async (ano) => {
                const query = `
          SELECT 
            ${ano} AS ano,
            QT_MAT_BAS AS alunos,
            QT_DOC_BAS AS professores,
            QT_TUR_BAS AS turmas
          FROM \`infoschool-475602.escolas.${ano}\`
          WHERE CAST(CO_ENTIDADE AS INT64) = SAFE_CAST(@id AS INT64)
          LIMIT 1
        `;

                try {
                    const [rows] = await bigquery.query({
                        query: query,
                        params: { id: escolaId }
                    });

                    if (rows.length > 0) {
                        return {
                            ano: ano,
                            alunos: rows[0].alunos || 0,
                            professores: rows[0].professores || 0,
                            turmas: rows[0].turmas || 0
                        };
                    }
                    return null;
                } catch (error) {
                    // Se a tabela não existir ou der erro, retorna null
                    console.warn(`⚠️ Erro ao buscar dados de ${ano}: ${error.message}`);
                    return null;
                }
            });

            const resultados = await Promise.all(promises);

            // Filtra os resultados válidos e ordena por ano
            const dadosValidos = resultados
                .filter(item => item !== null)
                .sort((a, b) => a.ano - b.ano);

            console.log(`✅ Dados históricos encontrados para ${dadosValidos.length} anos`);

            return {
                codigo_inep: escolaId,
                dadosTemporais: dadosValidos
            };

        } catch (error) {
            console.error(`❌ Erro ao buscar dados históricos:`, error);
            return reply.status(500).send({
                error: 'Erro ao buscar dados históricos.',
                details: error.message
            });
        }
    });
};

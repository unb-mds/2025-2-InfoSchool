import { BigQuery } from '@google-cloud/bigquery';

const PROJECT_ID = process.env.GOOGLE_CLOUD_PROJECT || 'infoschool-475602';
const bigquery = new BigQuery({ projectId: PROJECT_ID });

export default async function (fastify, opts) {

  // Rota GET: /api/escola/details?id=...&full=true
  fastify.get('/', async (request, reply) => {
    const { id, full } = request.query;

    if (!id) {
      return reply.status(400).send({ error: 'ID da escola é obrigatório.' });
    }

    const escolaId = id.trim();
    const isFullReport = full === 'true';

    console.log(`🔍 Buscando escola ID: ${escolaId} | Modo: ${isFullReport ? 'RELATÓRIO COMPLETO (*)' : 'DASHBOARD (LEVE)'}`);

    // 1. CAMPOS CALCULADOS (Essenciais para o seu Frontend funcionar)
    // Estes campos são gerados dinamicamente para alimentar a UI (Cards, Header)
    const calculatedFields = `
      -- Identificação Formatada
      CAST(CO_ENTIDADE AS STRING) AS codigo_inep_str,
      
      -- Endereço Completo (Tratamento de Nulos)
      CONCAT(
        IFNULL(DS_ENDERECO, ''), 
        ', ', 
        IFNULL(SAFE_CAST(NU_ENDERECO AS STRING), 'S/N'), 
        IF(DS_COMPLEMENTO IS NOT NULL AND DS_COMPLEMENTO != '', CONCAT(' - ', SAFE_CAST(DS_COMPLEMENTO AS STRING)), '')
      ) AS endereco_formatado,

      -- Telefone (DDD + Número)
      IF(NU_DDD IS NOT NULL AND NU_TELEFONE IS NOT NULL, 
         CONCAT('(', SAFE_CAST(NU_DDD AS STRING), ') ', SAFE_CAST(NU_TELEFONE AS STRING)), 
         'Não informado'
      ) AS telefone_formatado,

      -- Traduções de Códigos (Para exibir "Federal" em vez de "1")
      CASE TP_DEPENDENCIA 
        WHEN 1 THEN 'Federal' WHEN 2 THEN 'Estadual' WHEN 3 THEN 'Municipal' WHEN 4 THEN 'Privada' ELSE 'Outros' 
      END AS rede_txt,
      
      CASE TP_LOCALIZACAO 
        WHEN 1 THEN 'Urbana' WHEN 2 THEN 'Rural' ELSE 'Não Informado' 
      END AS localizacao_txt,
      
      CASE TP_SITUACAO_FUNCIONAMENTO 
        WHEN 1 THEN 'Em Atividade' WHEN 2 THEN 'Paralisada' WHEN 3 THEN 'Extinta' ELSE 'Desconhecido' 
      END AS situacao_txt,
      
      -- Quantidades Seguras (Evita erro se coluna for nula)
      IFNULL(QT_DESKTOP_ALUNO, 0) as qtd_computadores_alunos,
      IFNULL(QT_DESKTOP_ALUNO, 0) as qtd_computadores_total -- Usando Desktop como proxy do total para evitar erro de coluna inexistente
    `;

    // 2. COLUNAS LEVES (Só o que a tela precisa para carregar rápido)
    // Removemos QT_COMPUTADOR que dava erro e mantemos QT_DESKTOP_ALUNO que você confirmou existir
    const lightColumns = `
      NO_ENTIDADE, CO_ENTIDADE, NO_MUNICIPIO, SG_UF, NO_BAIRRO, CO_CEP, NU_TELEFONE, NU_DDD, 
      TP_DEPENDENCIA, TP_LOCALIZACAO, TP_SITUACAO_FUNCIONAMENTO, 
      IN_DIURNO, IN_NOTURNO, IN_EJA,
      IN_AGUA_POTAVEL, IN_ENERGIA_REDE_PUBLICA, IN_ESGOTO_REDE_PUBLICA, IN_LIXO_SERVICO_COLETA,
      IN_INTERNET, IN_BANDA_LARGA, 
      QT_DESKTOP_ALUNO, 
      IN_LABORATORIO_INFORMATICA, IN_LABORATORIO_CIENCIAS, IN_QUADRA_ESPORTES, IN_BIBLIOTECA, IN_SALA_LEITURA, 
      IN_COZINHA, IN_REFEITORIO, IN_AUDITORIO, IN_ALIMENTACAO, 
      IN_ACESSIBILIDADE_INEXISTENTE,
      IN_RESERVA_PPI, IN_RESERVA_RENDA, IN_RESERVA_PCD,
      QT_MAT_BAS, QT_DOC_BAS, QT_TUR_BAS, QT_SALAS_UTILIZADAS
    `;

    // 3. MONTAGEM DA QUERY
    // Se for PDF (full), seleciona TUDO (*) + os calculados.
    // Se for Tela, seleciona só LEVES + calculados.
    const selection = isFullReport ? `*, ${calculatedFields}` : `${lightColumns}, ${calculatedFields}`;

    const query = `
      SELECT 
        ${selection}
      FROM \`infoschool-475602.escolas.2024\`
      -- CORREÇÃO DE OURO: Compara como INTEIRO para ignorar zeros à esquerda (ex: "0123" == 123)
      WHERE CAST(CO_ENTIDADE AS INT64) = SAFE_CAST(@id AS INT64)
      LIMIT 1
    `;

    try {
      const [rows] = await bigquery.query({
        query: query,
        params: { id: escolaId }
      });

      if (rows.length === 0) {
        console.warn(`⚠️ Escola não encontrada para ID: ${escolaId}`);
        return reply.status(404).send({ error: 'Escola não encontrada.' });
      }

      const dados = rows[0];

      // 4. PÓS-PROCESSAMENTO (Lógica de UI que o SQL não faz bem)

      // Cria o array de turnos para as etiquetas coloridas
      const turnos = [];
      if (dados.IN_DIURNO === 1) turnos.push('Diurno');
      if (dados.IN_NOTURNO === 1) turnos.push('Noturno');
      if (dados.IN_EJA === 1) turnos.push('EJA');
      dados.turnos_ui = turnos.length > 0 ? turnos : ['Integral/Outro'];

      // Booleanos prontos para o frontend
      dados.tem_acessibilidade_ui = (dados.IN_ACESSIBILIDADE_INEXISTENTE === 0);
      dados.tem_biblioteca_ui = (dados.IN_BIBLIOTECA === 1 || dados.IN_SALA_LEITURA === 1);

      return dados;

    } catch (error) {
      console.error(`❌ Erro BigQuery Dashboard:`, error);
      // Retorna JSON de erro para o frontend tratar elegantemente
      return reply.status(500).send({
        error: 'Erro interno ao buscar dados.',
        details: error.message
      });
    }
  });
};
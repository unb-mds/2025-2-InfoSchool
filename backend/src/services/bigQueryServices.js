// src/services/bigQueryServices.js - VERSÃO PARA CENSO ESCOLAR
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

  async getDadosEscolas(filtros = {}) {
    let whereConditions = ["NU_ANO_CENSO = 2024"]; // Filtro para ano mais recente

    if (filtros.uf) {
      whereConditions.push(`SG_UF = '${filtros.uf}'`);
    }

    if (filtros.municipio) {
      whereConditions.push(`NO_MUNICIPIO = '${filtros.municipio}'`);
    }

    // Para etapa_ensino, vamos inferir baseado no nome da escola ou outras colunas
    if (filtros.etapa_ensino) {
      if (filtros.etapa_ensino === "Fundamental") {
        whereConditions.push(
          `(NO_ENTIDADE LIKE '%FUNDAMENTAL%' OR NO_ENTIDADE LIKE '%EMEF%' OR NO_ENTIDADE LIKE '%EM%')`
        );
      } else if (filtros.etapa_ensino === "Médio") {
        whereConditions.push(
          `(NO_ENTIDADE LIKE '%MÉDIO%' OR NO_ENTIDADE LIKE '%EM%' OR NO_ENTIDADE LIKE '%COLEGIO%')`
        );
      }
    }

    const whereClause =
      whereConditions.length > 0
        ? `WHERE ${whereConditions.join(" AND ")}`
        : "";

    const query = `
      SELECT 
        CO_ENTIDADE as id_escola,
        NO_ENTIDADE as nome_escola,
        NO_MUNICIPIO as municipio,
        SG_UF as uf,
        TP_DEPENDENCIA as tipo_dependencia,
        TP_LOCALIZACAO as localizacao,
        TP_SITUACAO_FUNCIONAMENTO as situacao_funcionamento,
        -- Colunas de infraestrutura (vamos buscar algumas que existem)
        IN_LABORATORIO_INFORMATICA as possui_laboratorio_informatica,
        IN_INTERNET as possui_internet,
        IN_BIBLIOTECA as possui_biblioteca,
        IN_ENERGIA_REDE_PUBLICA as possui_energia,
        IN_AGUA_REDE_PUBLICA as possui_agua,
        IN_ESGOTO_REDE_PUBLICA as possui_esgoto,
        -- Colunas de matriculas e docentes (buscar as disponíveis)
        QT_MATRICULAS as num_matriculas,
        QT_DOCENTES as num_docentes,
        QT_DOCENTES_FUNDAMENTAL as num_docentes_fundamental,
        QT_DOCENTES_MEDIO as num_docentes_medio
      FROM \`${ENV.GOOGLE_CLOUD_PROJECT}.${ENV.BIGQUERY_DATASET}.${ENV.BIGQUERY_TABLE}\`
      ${whereClause}
      LIMIT 1000
    `;

    console.log(
      "🔍 Query para Censo Escolar:",
      query.substring(0, 200) + "..."
    );

    try {
      const resultados = await this.query(query);

      // Processar resultados para padronizar
      return resultados.map((escola) => ({
        id_escola: escola.id_escola,
        nome_escola: escola.nome_escola,
        municipio: escola.municipio,
        uf: escola.uf,
        etapa_ensino: this.inferirEtapaEnsino(escola.nome_escola),
        num_matriculas: escola.num_matriculas || 0,
        ideb: null, // IDEB geralmente está em tabela separada
        possui_laboratorio_informatica:
          escola.possui_laboratorio_informatica === 1,
        possui_internet: escola.possui_internet === 1,
        num_docentes: escola.num_docentes || 0,
        tipo_dependencia: this.mapearTipoDependencia(escola.tipo_dependencia),
        localizacao: this.mapearLocalizacao(escola.localizacao),
        situacao_funcionamento: this.mapearSituacaoFuncionamento(
          escola.situacao_funcionamento
        ),
      }));
    } catch (error) {
      console.error("❌ Erro ao processar dados do Censo:", error);
      // Se a query falhar por colunas inexistentes, vamos tentar uma versão mais simples
      return await this.getDadosEscolasBasico(filtros);
    }
  }

  async getDadosEscolasBasico(filtros = {}) {
    console.log("🔄 Tentando query básica...");

    let whereConditions = ["NU_ANO_CENSO = 2024"];

    if (filtros.uf) {
      whereConditions.push(`SG_UF = '${filtros.uf}'`);
    }

    if (filtros.municipio) {
      whereConditions.push(`NO_MUNICIPIO = '${filtros.municipio}'`);
    }

    const whereClause =
      whereConditions.length > 0
        ? `WHERE ${whereConditions.join(" AND ")}`
        : "";

    // Query mais básica apenas com colunas que sabemos que existem
    const query = `
      SELECT 
        CO_ENTIDADE as id_escola,
        NO_ENTIDADE as nome_escola,
        NO_MUNICIPIO as municipio,
        SG_UF as uf,
        TP_DEPENDENCIA as tipo_dependencia,
        TP_LOCALIZACAO as localizacao
      FROM \`${ENV.GOOGLE_CLOUD_PROJECT}.${ENV.BIGQUERY_DATASET}.${ENV.BIGQUERY_TABLE}\`
      ${whereClause}
      LIMIT 500
    `;

    const resultados = await this.query(query);

    return resultados.map((escola) => ({
      id_escola: escola.id_escola,
      nome_escola: escola.nome_escola,
      municipio: escola.municipio,
      uf: escola.uf,
      etapa_ensino: this.inferirEtapaEnsino(escola.nome_escola),
      num_matriculas: null,
      ideb: null,
      possui_laboratorio_informatica: null,
      possui_internet: null,
      num_docentes: null,
      tipo_dependencia: this.mapearTipoDependencia(escola.tipo_dependencia),
      localizacao: this.mapearLocalizacao(escola.localizacao),
    }));
  }

  inferirEtapaEnsino(nomeEscola) {
    const nome = nomeEscola.toUpperCase();
    if (
      nome.includes("INFANTIL") ||
      nome.includes("CRECHE") ||
      nome.includes("PRÉ-ESCOLA")
    ) {
      return "Infantil";
    } else if (nome.includes("FUNDAMENTAL")) {
      return "Fundamental";
    } else if (nome.includes("MÉDIO") || nome.includes("MEDIO")) {
      return "Médio";
    } else if (nome.includes("EMEF") || nome.includes("EMEI")) {
      return "Fundamental";
    } else if (nome.includes("EE") || nome.includes("COLEGIO")) {
      return "Médio";
    }
    return "Não especificado";
  }

  mapearTipoDependencia(codigo) {
    const tipos = {
      1: "Federal",
      2: "Estadual",
      3: "Municipal",
      4: "Privada",
    };
    return tipos[codigo] || "Desconhecido";
  }

  mapearLocalizacao(codigo) {
    const localizacoes = {
      1: "Urbana",
      2: "Rural",
    };
    return localizacoes[codigo] || "Desconhecida";
  }

  mapearSituacaoFuncionamento(codigo) {
    const situacoes = {
      1: "Em atividade",
      2: "Paralisada",
      3: "Extinta",
    };
    return situacoes[codigo] || "Desconhecida";
  }
}

module.exports = new BigQueryService();

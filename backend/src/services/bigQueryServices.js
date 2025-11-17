// src/services/bigQueryServices.js - VERSÃO COM TODAS AS 426 COLUNAS
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
      console.log("📊 Executando query BigQuery:", sql.substring(0, 100) + "...");

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
    let whereConditions = ["NU_ANO_CENSO = 2024"];

    if (filtros.uf) {
      whereConditions.push(`SG_UF = '${filtros.uf}'`);
    }

    if (filtros.municipio) {
      whereConditions.push(`NO_MUNICIPIO = '${filtros.municipio}'`);
    }

    if (filtros.etapa_ensino) {
      if (filtros.etapa_ensino === 'Fundamental') {
        whereConditions.push(`IN_FUND = 1`);
      } else if (filtros.etapa_ensino === 'Médio') {
        whereConditions.push(`IN_MED = 1`);
      } else if (filtros.etapa_ensino === 'Infantil') {
        whereConditions.push(`IN_INF = 1`);
      } else if (filtros.etapa_ensino === 'EJA') {
        whereConditions.push(`IN_EJA = 1`);
      }
    }

    const whereClause = whereConditions.length > 0 ? `WHERE ${whereConditions.join(" AND ")}` : "";

    // QUERY COM TODAS AS 426 COLUNAS
    const query = `
      SELECT 
        -- IDENTIFICAÇÃO E LOCALIZAÇÃO (1-67)
        NU_ANO_CENSO,
        NO_REGIAO,
        CO_REGIAO,
        NO_UF,
        SG_UF,
        CO_UF,
        NO_MUNICIPIO,
        CO_MUNICIPIO,
        NO_REGIAO_GEOG_INTERM,
        CO_REGIAO_GEOG_INTERM,
        NO_REGIAO_GEOG_IMED,
        CO_REGIAO_GEOG_IMED,
        NO_MESORREGIAO,
        CO_MESORREGIAO,
        NO_MICRORREGIAO,
        CO_MICRORREGIAO,
        NO_DISTRITO,
        CO_DISTRITO,
        NO_ENTIDADE,
        CO_ENTIDADE,
        TP_DEPENDENCIA,
        TP_CATEGORIA_ESCOLA_PRIVADA,
        TP_LOCALIZACAO,
        TP_LOCALIZACAO_DIFERENCIADA,
        DS_ENDERECO,
        NU_ENDERECO,
        DS_COMPLEMENTO,
        NO_BAIRRO,
        CO_CEP,
        NU_DDD,
        NU_TELEFONE,
        TP_SITUACAO_FUNCIONAMENTO,
        CO_ORGAO_REGIONAL,
        DT_ANO_LETIVO_INICIO,
        DT_ANO_LETIVO_TERMINO,
        IN_VINCULO_SECRETARIA_EDUCACAO,
        IN_VINCULO_SEGURANCA_PUBLICA,
        IN_VINCULO_SECRETARIA_SAUDE,
        IN_VINCULO_OUTRO_ORGAO,
        IN_PODER_PUBLICO_PARCERIA,
        TP_PODER_PUBLICO_PARCERIA,
        IN_FORMA_CONT_TERMO_COLABORA,
        IN_FORMA_CONT_TERMO_FOMENTO,
        IN_FORMA_CONT_ACORDO_COOP,
        IN_FORMA_CONT_PRESTACAO_SERV,
        IN_FORMA_CONT_COOP_TEC_FIN,
        IN_FORMA_CONT_CONSORCIO_PUB,
        IN_FORMA_CONT_MU_TERMO_COLAB,
        IN_FORMA_CONT_MU_TERMO_FOMENTO,
        IN_FORMA_CONT_MU_ACORDO_COOP,
        IN_FORMA_CONT_MU_PREST_SERV,
        IN_FORMA_CONT_MU_COOP_TEC_FIN,
        IN_FORMA_CONT_MU_CONSORCIO_PUB,
        IN_FORMA_CONT_ES_TERMO_COLAB,
        IN_FORMA_CONT_ES_TERMO_FOMENTO,
        IN_FORMA_CONT_ES_ACORDO_COOP,
        IN_FORMA_CONT_ES_PREST_SERV,
        IN_FORMA_CONT_ES_COOP_TEC_FIN,
        IN_FORMA_CONT_ES_CONSORCIO_PUB,
        IN_MANT_ESCOLA_PRIVADA_EMP,
        IN_MANT_ESCOLA_PRIVADA_ONG,
        IN_MANT_ESCOLA_PRIVADA_OSCIP,
        IN_MANT_ESCOLA_PRIV_ONG_OSCIP,
        IN_MANT_ESCOLA_PRIVADA_SIND,
        IN_MANT_ESCOLA_PRIVADA_SIST_S,
        IN_MANT_ESCOLA_PRIVADA_S_FINS,
        NU_CNPJ_ESCOLA_PRIVADA,
        NU_CNPJ_MANTENEDORA,
        TP_REGULAMENTACAO,
        TP_RESPONSAVEL_REGULAMENTACAO,
        CO_ESCOLA_SEDE_VINCULADA,
        CO_IES_OFERTANTE,

        -- INFRAESTRUTURA - LOCAL DE FUNCIONAMENTO (68-81)
        IN_LOCAL_FUNC_PREDIO_ESCOLAR,
        TP_OCUPACAO_PREDIO_ESCOLAR,
        IN_LOCAL_FUNC_SOCIOEDUCATIVO,
        IN_LOCAL_FUNC_UNID_PRISIONAL,
        IN_LOCAL_FUNC_PRISIONAL_SOCIO,
        IN_LOCAL_FUNC_GALPAO,
        TP_OCUPACAO_GALPAO,
        IN_LOCAL_FUNC_SALAS_OUTRA_ESC,
        IN_LOCAL_FUNC_OUTROS,
        IN_PREDIO_COMPARTILHADO,

        -- SANEAMENTO BÁSICO (82-107)
        IN_AGUA_POTAVEL,
        IN_AGUA_REDE_PUBLICA,
        IN_AGUA_POCO_ARTESIANO,
        IN_AGUA_CACIMBA,
        IN_AGUA_FONTE_RIO,
        IN_AGUA_INEXISTENTE,
        IN_AGUA_CARRO_PIPA,
        IN_ENERGIA_REDE_PUBLICA,
        IN_ENERGIA_GERADOR_FOSSIL,
        IN_ENERGIA_RENOVAVEL,
        IN_ENERGIA_INEXISTENTE,
        IN_ESGOTO_REDE_PUBLICA,
        IN_ESGOTO_FOSSA_SEPTICA,
        IN_ESGOTO_FOSSA_COMUM,
        IN_ESGOTO_FOSSA,
        IN_ESGOTO_INEXISTENTE,
        IN_LIXO_SERVICO_COLETA,
        IN_LIXO_QUEIMA,
        IN_LIXO_ENTERRA,
        IN_LIXO_DESTINO_FINAL_PUBLICO,
        IN_LIXO_DESCARTA_OUTRA_AREA,
        IN_TRATAMENTO_LIXO_SEPARACAO,
        IN_TRATAMENTO_LIXO_REUTILIZA,
        IN_TRATAMENTO_LIXO_RECICLAGEM,
        IN_TRATAMENTO_LIXO_INEXISTENTE,

        -- DEPENDÊNCIAS (108-148)
        IN_ALMOXARIFADO,
        IN_AREA_VERDE,
        IN_AREA_PLANTIO,
        IN_AUDITORIO,
        IN_BANHEIRO,
        IN_BANHEIRO_EI,
        IN_BANHEIRO_PNE,
        IN_BANHEIRO_FUNCIONARIOS,
        IN_BANHEIRO_CHUVEIRO,
        IN_BIBLIOTECA,
        IN_BIBLIOTECA_SALA_LEITURA,
        IN_COZINHA,
        IN_DESPENSA,
        IN_DORMITORIO_ALUNO,
        IN_DORMITORIO_PROFESSOR,
        IN_LABORATORIO_CIENCIAS,
        IN_LABORATORIO_INFORMATICA,
        IN_LABORATORIO_EDUC_PROF,
        IN_PATIO_COBERTO,
        IN_PATIO_DESCOBERTO,
        IN_PARQUE_INFANTIL,
        IN_PISCINA,
        IN_QUADRA_ESPORTES,
        IN_QUADRA_ESPORTES_COBERTA,
        IN_QUADRA_ESPORTES_DESCOBERTA,
        IN_REFEITORIO,
        IN_SALA_ATELIE_ARTES,
        IN_SALA_MUSICA_CORAL,
        IN_SALA_ESTUDIO_DANCA,
        IN_SALA_MULTIUSO,
        IN_SALA_ESTUDIO_GRAVACAO,
        IN_SALA_OFICINAS_EDUC_PROF,
        IN_SALA_DIRETORIA,
        IN_SALA_LEITURA,
        IN_SALA_PROFESSOR,
        IN_SALA_REPOUSO_ALUNO,
        IN_SECRETARIA,
        IN_SALA_ATENDIMENTO_ESPECIAL,
        IN_TERREIRAO,
        IN_VIVEIRO,
        IN_DEPENDENCIAS_OUTRAS,

        -- ACESSIBILIDADE (149-158)
        IN_ACESSIBILIDADE_CORRIMAO,
        IN_ACESSIBILIDADE_ELEVADOR,
        IN_ACESSIBILIDADE_PISOS_TATEIS,
        IN_ACESSIBILIDADE_VAO_LIVRE,
        IN_ACESSIBILIDADE_RAMPAS,
        IN_ACESSIBILIDADE_SINAL_SONORO,
        IN_ACESSIBILIDADE_SINAL_TATIL,
        IN_ACESSIBILIDADE_SINAL_VISUAL,
        IN_ACESSIBILIDADE_INEXISTENTE,
        IN_ACESSIBILIDADE_SINALIZACAO,

        -- SALAS DE AULA (159-163)
        QT_SALAS_UTILIZADAS_DENTRO,
        QT_SALAS_UTILIZADAS_FORA,
        QT_SALAS_UTILIZADAS,
        QT_SALAS_UTILIZA_CLIMATIZADAS,
        QT_SALAS_UTILIZADAS_ACESSIVEIS,

        -- EQUIPAMENTOS (164-186)
        IN_EQUIP_PARABOLICA,
        IN_COMPUTADOR,
        IN_EQUIP_COPIADORA,
        IN_EQUIP_IMPRESSORA,
        IN_EQUIP_IMPRESSORA_MULT,
        IN_EQUIP_SCANNER,
        IN_EQUIP_NENHUM,
        IN_EQUIP_DVD,
        QT_EQUIP_DVD,
        IN_EQUIP_SOM,
        QT_EQUIP_SOM,
        IN_EQUIP_TV,
        QT_EQUIP_TV,
        IN_EQUIP_LOUSA_DIGITAL,
        QT_EQUIP_LOUSA_DIGITAL,
        IN_EQUIP_MULTIMIDIA,
        QT_EQUIP_MULTIMIDIA,
        IN_DESKTOP_ALUNO,
        QT_DESKTOP_ALUNO,
        IN_COMP_PORTATIL_ALUNO,
        QT_COMP_PORTATIL_ALUNO,
        IN_TABLET_ALUNO,
        QT_TABLET_ALUNO,

        -- INTERNET E TECNOLOGIA (187-195)
        IN_INTERNET,
        IN_INTERNET_ALUNOS,
        IN_INTERNET_ADMINISTRATIVO,
        IN_INTERNET_APRENDIZAGEM,
        IN_INTERNET_COMUNIDADE,
        IN_ACESSO_INTERNET_COMPUTADOR,
        IN_ACES_INTERNET_DISP_PESSOAIS,
        TP_REDE_LOCAL,
        IN_BANDA_LARGA,

        -- PROFISSIONAIS (196-231)
        IN_PROF_ADMINISTRATIVOS,
        QT_PROF_ADMINISTRATIVOS,
        IN_PROF_SERVICOS_GERAIS,
        QT_PROF_SERVICOS_GERAIS,
        IN_PROF_BIBLIOTECARIO,
        QT_PROF_BIBLIOTECARIO,
        IN_PROF_SAUDE,
        QT_PROF_SAUDE,
        IN_PROF_COORDENADOR,
        QT_PROF_COORDENADOR,
        IN_PROF_FONAUDIOLOGO,
        QT_PROF_FONAUDIOLOGO,
        IN_PROF_NUTRICIONISTA,
        QT_PROF_NUTRICIONISTA,
        IN_PROF_PSICOLOGO,
        QT_PROF_PSICOLOGO,
        IN_PROF_ALIMENTACAO,
        QT_PROF_ALIMENTACAO,
        IN_PROF_PEDAGOGIA,
        QT_PROF_PEDAGOGIA,
        IN_PROF_SECRETARIO,
        QT_PROF_SECRETARIO,
        IN_PROF_SEGURANCA,
        QT_PROF_SEGURANCA,
        IN_PROF_MONITORES,
        QT_PROF_MONITORES,
        IN_PROF_GESTAO,
        QT_PROF_GESTAO,
        IN_PROF_ASSIST_SOCIAL,
        QT_PROF_ASSIST_SOCIAL,
        IN_PROF_TRAD_LIBRAS,
        QT_PROF_TRAD_LIBRAS,
        IN_PROF_AGRICOLA,
        QT_PROF_AGRICOLA,
        IN_PROF_REVISOR_BRAILLE,
        QT_PROF_REVISOR_BRAILLE,

        -- RECURSOS PEDAGÓGICOS (232-249)
        IN_ALIMENTACAO,
        IN_MATERIAL_PED_MULTIMIDIA,
        IN_MATERIAL_PED_INFANTIL,
        IN_MATERIAL_PED_CIENTIFICO,
        IN_MATERIAL_PED_DIFUSAO,
        IN_MATERIAL_PED_MUSICAL,
        IN_MATERIAL_PED_JOGOS,
        IN_MATERIAL_PED_ARTISTICAS,
        IN_MATERIAL_PED_PROFISSIONAL,
        IN_MATERIAL_PED_DESPORTIVA,
        IN_MATERIAL_PED_INDIGENA,
        IN_MATERIAL_PED_ETNICO,
        IN_MATERIAL_PED_CAMPO,
        IN_MATERIAL_PED_BIL_SURDOS,
        IN_MATERIAL_PED_AGRICOLA,
        IN_MATERIAL_PED_QUILOMBOLA,
        IN_MATERIAL_PED_EDU_ESP,
        IN_MATERIAL_PED_NENHUM,

        -- EDUCAÇÃO INDÍGENA (250-254)
        IN_EDUCACAO_INDIGENA,
        TP_INDIGENA_LINGUA,
        CO_LINGUA_INDIGENA_1,
        CO_LINGUA_INDIGENA_2,
        CO_LINGUA_INDIGENA_3,

        -- PROCESSOS SELETIVOS (255-261)
        IN_EXAME_SELECAO,
        IN_RESERVA_PPI,
        IN_RESERVA_RENDA,
        IN_RESERVA_PUBLICA,
        IN_RESERVA_PCD,
        IN_RESERVA_OUTROS,
        IN_RESERVA_NENHUMA,

        -- PARTICIPAÇÃO E GESTÃO (262-270)
        IN_REDES_SOCIAIS,
        IN_ESPACO_ATIVIDADE,
        IN_ESPACO_EQUIPAMENTO,
        IN_ORGAO_ASS_PAIS,
        IN_ORGAO_ASS_PAIS_MESTRES,
        IN_ORGAO_CONSELHO_ESCOLAR,
        IN_ORGAO_GREMIO_ESTUDANTIL,
        IN_ORGAO_OUTROS,
        IN_ORGAO_NENHUM,

        -- PROPOSTA PEDAGÓGICA (271-278)
        TP_PROPOSTA_PEDAGOGICA,
        IN_EDUC_AMBIENTAL,
        IN_EDUC_AMB_CONTEUDO,
        IN_EDUC_AMB_CURRICULAR,
        IN_EDUC_AMB_EIXO,
        IN_EDUC_AMB_EVENTOS,
        IN_EDUC_AMB_PROJETOS,
        IN_EDUC_AMB_NENHUMA,

        -- MODALIDADES DE ENSINO (279-303)
        TP_AEE,
        TP_ATIVIDADE_COMPLEMENTAR,
        IN_MEDIACAO_PRESENCIAL,
        IN_MEDIACAO_SEMIPRESENCIAL,
        IN_MEDIACAO_EAD,
        IN_REGULAR,
        IN_DIURNO,
        IN_NOTURNO,
        IN_EAD,
        IN_ESCOLARIZACAO,
        IN_INF,
        IN_INF_CRE,
        IN_INF_PRE,
        IN_FUND,
        IN_FUND_AI,
        IN_FUND_AF,
        IN_MED,
        IN_PROF,
        IN_PROF_TEC,
        IN_EJA,
        IN_EJA_FUND,
        IN_EJA_MED,
        IN_ESP,
        IN_ESP_CC,
        IN_ESP_CE,

        -- MATRÍCULAS (304-426)
        QT_MAT_BAS,
        QT_MAT_INF,
        QT_MAT_INF_CRE,
        QT_MAT_INF_PRE,
        QT_MAT_FUND,
        QT_MAT_FUND_AI,
        QT_MAT_FUND_AI_1,
        QT_MAT_FUND_AI_2,
        QT_MAT_FUND_AI_3,
        QT_MAT_FUND_AI_4,
        QT_MAT_FUND_AI_5,
        QT_MAT_FUND_AF,
        QT_MAT_FUND_AF_6,
        QT_MAT_FUND_AF_7,
        QT_MAT_FUND_AF_8,
        QT_MAT_FUND_AF_9,
        QT_MAT_MED,
        QT_MAT_MED_PROP,
        QT_MAT_MED_PROP_1,
        QT_MAT_MED_PROP_2,
        QT_MAT_MED_PROP_3,
        QT_MAT_MED_PROP_4,
        QT_MAT_MED_PROP_NS,
        QT_MAT_MED_CT,
        QT_MAT_MED_CT_1,
        QT_MAT_MED_CT_2,
        QT_MAT_MED_CT_3,
        QT_MAT_MED_CT_4,
        QT_MAT_MED_CT_NS,
        QT_MAT_MED_NM,
        QT_MAT_MED_NM_1,
        QT_MAT_MED_NM_2,
        QT_MAT_MED_NM_3,
        QT_MAT_MED_NM_4,
        QT_MAT_PROF,
        QT_MAT_PROF_TEC,
        QT_MAT_PROF_TEC_CONC,
        QT_MAT_PROF_TEC_SUBS,
        QT_MAT_PROF_FIC_CONC,
        QT_MAT_EJA,
        QT_MAT_EJA_FUND,
        QT_MAT_EJA_FUND_AI,
        QT_MAT_EJA_FUND_AF,
        QT_MAT_EJA_FUND_FIC,
        QT_MAT_EJA_MED,
        QT_MAT_EJA_MED_NPROF,
        QT_MAT_EJA_MED_FIC,
        QT_MAT_EJA_MED_TEC,
        QT_MAT_ESP,
        QT_MAT_ESP_CC,
        QT_MAT_ESP_CE,
        QT_MAT_BAS_FEM,
        QT_MAT_BAS_MASC,
        QT_MAT_BAS_ND,
        QT_MAT_BAS_BRANCA,
        QT_MAT_BAS_PRETA,
        QT_MAT_BAS_PARDA,
        QT_MAT_BAS_AMARELA,
        QT_MAT_BAS_INDIGENA,
        QT_MAT_BAS_0_3,
        QT_MAT_BAS_4_5,
        QT_MAT_BAS_6_10,
        QT_MAT_BAS_11_14,
        QT_MAT_BAS_15_17,
        QT_MAT_BAS_18_MAIS,
        QT_MAT_BAS_D,
        QT_MAT_BAS_N,
        QT_MAT_BAS_EAD,
        QT_MAT_INF_INT,
        QT_MAT_INF_CRE_INT,
        QT_MAT_INF_PRE_INT,
        QT_MAT_FUND_INT,
        QT_MAT_FUND_AI_INT,
        QT_MAT_FUND_AF_INT,
        QT_MAT_MED_INT,
        QT_MAT_ZR_URB,
        QT_MAT_ZR_RUR,
        QT_MAT_ZR_NA,
        QT_TRANSP_PUBLICO,
        QT_TRANSP_RESP_EST,
        QT_TRANSP_RESP_MUN,
        QT_DOC_BAS,
        QT_DOC_INF,
        QT_DOC_INF_CRE,
        QT_DOC_INF_PRE,
        QT_DOC_FUND,
        QT_DOC_FUND_AI,
        QT_DOC_FUND_AF,
        QT_DOC_MED,
        QT_DOC_PROF,
        QT_DOC_PROF_TEC,
        QT_DOC_EJA,
        QT_DOC_EJA_FUND,
        QT_DOC_EJA_MED,
        QT_DOC_ESP,
        QT_DOC_ESP_CC,
        QT_DOC_ESP_CE,
        QT_TUR_BAS,
        QT_TUR_INF,
        QT_TUR_INF_CRE,
        QT_TUR_INF_PRE,
        QT_TUR_FUND,
        QT_TUR_FUND_AI,
        QT_TUR_FUND_AF,
        QT_TUR_MED,
        QT_TUR_PROF,
        QT_TUR_PROF_TEC,
        QT_TUR_EJA,
        QT_TUR_EJA_FUND,
        QT_TUR_EJA_MED,
        QT_TUR_ESP,
        QT_TUR_ESP_CC,
        QT_TUR_ESP_CE,
        QT_TUR_BAS_D,
        QT_TUR_BAS_N,
        QT_TUR_BAS_EAD,
        QT_TUR_INF_INT,
        QT_TUR_INF_CRE_INT,
        QT_TUR_INF_PRE_INT,
        QT_TUR_FUND_INT,
        QT_TUR_FUND_AI_INT,
        QT_TUR_FUND_AF_INT,
        QT_TUR_MED_INT

      FROM \`${ENV.GOOGLE_CLOUD_PROJECT}.${ENV.BIGQUERY_DATASET}.${ENV.BIGQUERY_TABLE}\`
      ${whereClause}
      LIMIT 500
    `;

    console.log("🔍 Query COMPLETA com TODAS as 426 colunas do Censo Escolar");
    
    try {
      const resultados = await this.query(query);
      
      // Processar resultados mantendo TODOS os dados originais
      return resultados.map(escola => this.processarEscolaCompleta(escola));
      
    } catch (error) {
      console.error("❌ Erro ao processar dados completos:", error);
      // Fallback para query básica
      return await this.getDadosEscolasBasico(filtros);
    }
  }

  // Método fallback simplificado
  async getDadosEscolasBasico(filtros = {}) {
    let whereConditions = ["NU_ANO_CENSO = 2024"];

    if (filtros.uf) {
      whereConditions.push(`SG_UF = '${filtros.uf}'`);
    }

    const whereClause = whereConditions.length > 0 ? `WHERE ${whereConditions.join(" AND ")}` : "";

    const queryBasica = `
      SELECT 
        CO_ENTIDADE,
        NO_ENTIDADE,
        NO_MUNICIPIO,
        SG_UF,
        TP_DEPENDENCIA,
        TP_LOCALIZACAO,
        IN_LABORATORIO_INFORMATICA,
        IN_BIBLIOTECA,
        IN_INTERNET,
        IN_QUADRA_ESPORTES,
        QT_MAT_BAS,
        QT_DOC_BAS,
        QT_TUR_BAS,
        IN_INF,
        IN_FUND,
        IN_MED,
        IN_EJA
      FROM \`${ENV.GOOGLE_CLOUD_PROJECT}.${ENV.BIGQUERY_DATASET}.${ENV.BIGQUERY_TABLE}\`
      ${whereClause}
      LIMIT 500
    `;

    console.log("🔄 Usando query básica como fallback");
    const resultados = await this.query(queryBasica);
    
    return resultados.map(escola => ({
      identificacao: {
        id_escola: escola.CO_ENTIDADE,
        nome_escola: escola.NO_ENTIDADE,
        municipio: escola.NO_MUNICIPIO,
        uf: escola.SG_UF,
        dependencia: this.mapearTipoDependencia(escola.TP_DEPENDENCIA),
        localizacao_tipo: this.mapearLocalizacao(escola.TP_LOCALIZACAO)
      },
      resumo: {
        nome: escola.NO_ENTIDADE,
        localizacao: `${escola.NO_MUNICIPIO} - ${escola.SG_UF}`,
        tem_laboratorio_informatica: escola.IN_LABORATORIO_INFORMATICA === 1,
        tem_biblioteca: escola.IN_BIBLIOTECA === 1,
        tem_internet: escola.IN_INTERNET === 1,
        tem_quadra_esportes: escola.IN_QUADRA_ESPORTES === 1,
        total_matriculas: escola.QT_MAT_BAS || 0,
        total_docentes: escola.QT_DOC_BAS || 0,
        total_turmas: escola.QT_TUR_BAS || 0,
        oferta_infantil: escola.IN_INF === 1,
        oferta_fundamental: escola.IN_FUND === 1,
        oferta_medio: escola.IN_MED === 1,
        oferta_eja: escola.IN_EJA === 1
      }
    }));
  }

  processarEscolaCompleta(escola) {
    // Criar um objeto com TODOS os dados originais
    const escolaProcessada = {
      // Manter todos os dados brutos
      dados_brutos: escola,
      
      // Campos principais para fácil acesso
      identificacao: {
        id_escola: escola.CO_ENTIDADE,
        nome_escola: escola.NO_ENTIDADE,
        municipio: escola.NO_MUNICIPIO,
        uf: escola.SG_UF,
        regiao: escola.NO_REGIAO,
        ano_censo: escola.NU_ANO_CENSO,
        dependencia: this.mapearTipoDependencia(escola.TP_DEPENDENCIA),
        categoria_privada: this.mapearCategoriaPrivada(escola.TP_CATEGORIA_ESCOLA_PRIVADA),
        localizacao_tipo: this.mapearLocalizacao(escola.TP_LOCALIZACAO),
        situacao: this.mapearSituacaoFuncionamento(escola.TP_SITUACAO_FUNCIONAMENTO)
      },
      
      // Resumo para o RAG
      resumo: this.criarResumoParaRAG(escola),
      
      // Grupos de dados para organização
      localizacao: this.extrairLocalizacao(escola),
      infraestrutura: this.extrairInfraestrutura(escola),
      tecnologia: this.extrairTecnologia(escola),
      oferta_educacional: this.extrairOfertaEducacional(escola),
      matriculas: this.extrairMatriculas(escola),
      docentes: this.extrairDocentes(escola),
      profissionais: this.extrairProfissionais(escola),
      acessibilidade: this.extrairAcessibilidade(escola),
      saneamento: this.extrairSaneamento(escola),
      recursos_pedagogicos: this.extrairRecursosPedagogicos(escola)
    };

    return escolaProcessada;
  }

  criarResumoParaRAG(escola) {
    const caracteristicas = this.extrairCaracteristicasPrincipais(escola);
    
    return {
      nome: escola.NO_ENTIDADE,
      localizacao: `${escola.NO_MUNICIPIO} - ${escola.SG_UF}`,
      dependencia: this.mapearTipoDependencia(escola.TP_DEPENDENCIA),
      localizacao_tipo: this.mapearLocalizacao(escola.TP_LOCALIZACAO),
      situacao: this.mapearSituacaoFuncionamento(escola.TP_SITUACAO_FUNCIONAMENTO),
      
      // Infraestrutura resumida
      tem_laboratorio_informatica: escola.IN_LABORATORIO_INFORMATICA === 1,
      tem_biblioteca: escola.IN_BIBLIOTECA === 1,
      tem_internet: escola.IN_INTERNET === 1,
      tem_quadra_esportes: escola.IN_QUADRA_ESPORTES === 1,
      tem_refeitorio: escola.IN_REFEITORIO === 1,
      tem_cozinha: escola.IN_COZINHA === 1,
      
      // Matrículas e docentes
      total_matriculas: escola.QT_MAT_BAS || 0,
      total_docentes: escola.QT_DOC_BAS || 0,
      total_turmas: escola.QT_TUR_BAS || 0,
      
      // Etapas ofertadas
      oferta_infantil: escola.IN_INF === 1,
      oferta_fundamental: escola.IN_FUND === 1,
      oferta_medio: escola.IN_MED === 1,
      oferta_eja: escola.IN_EJA === 1,
      oferta_profissional: escola.IN_PROF === 1,
      
      // Principais características
      caracteristicas: caracteristicas,
      
      // Recursos tecnológicos
      recursos_tecnologicos: {
        computadores_alunos: (escola.QT_DESKTOP_ALUNO || 0) + (escola.QT_COMP_PORTATIL_ALUNO || 0),
        tablets_alunos: escola.QT_TABLET_ALUNO || 0,
        lousa_digital: escola.IN_EQUIP_LOUSA_DIGITAL === 1,
        equip_multimidia: escola.IN_EQUIP_MULTIMIDIA === 1
      },
      
      // Acessibilidade
      acessibilidade: {
        rampas: escola.IN_ACESSIBILIDADE_RAMPAS === 1,
        banheiro_pne: escola.IN_BANHEIRO_PNE === 1,
        salas_acessiveis: escola.QT_SALAS_UTILIZADAS_ACESSIVEIS || 0
      }
    };
  }

  extrairLocalizacao(escola) {
    return {
      endereco: escola.DS_ENDERECO,
      numero: escola.NU_ENDERECO,
      complemento: escola.DS_COMPLEMENTO,
      bairro: escola.NO_BAIRRO,
      cep: escola.CO_CEP,
      telefone: escola.NU_TELEFONE ? `(${escola.NU_DDD}) ${escola.NU_TELEFONE}` : null,
      municipio: escola.NO_MUNICIPIO,
      uf: escola.SG_UF,
      regiao: escola.NO_REGIAO,
      mesorregiao: escola.NO_MESORREGIAO,
      microrregiao: escola.NO_MICRORREGIAO,
      distrito: escola.NO_DISTRITO,
      local_funcionamento: {
        predio_escolar: escola.IN_LOCAL_FUNC_PREDIO_ESCOLAR === 1,
        socioeducativo: escola.IN_LOCAL_FUNC_SOCIOEDUCATIVO === 1,
        prisional: escola.IN_LOCAL_FUNC_UNID_PRISIONAL === 1,
        galpao: escola.IN_LOCAL_FUNC_GALPAO === 1,
        salas_outra_escola: escola.IN_LOCAL_FUNC_SALAS_OUTRA_ESC === 1
      }
    };
  }

  extrairInfraestrutura(escola) {
    return {
      // Saneamento (será detalhado em método separado)
      agua_potavel: escola.IN_AGUA_POTAVEL === 1,
      
      // Dependências
      laboratorios: {
        informatica: escola.IN_LABORATORIO_INFORMATICA === 1,
        ciencias: escola.IN_LABORATORIO_CIENCIAS === 1,
        educ_profissional: escola.IN_LABORATORIO_EDUC_PROF === 1
      },
      biblioteca: escola.IN_BIBLIOTECA === 1,
      biblioteca_sala_leitura: escola.IN_BIBLIOTECA_SALA_LEITURA === 1,
      quadra_esportes: escola.IN_QUADRA_ESPORTES === 1,
      quadra_coberta: escola.IN_QUADRA_ESPORTES_COBERTA === 1,
      patio_coberto: escola.IN_PATIO_COBERTO === 1,
      patio_descoberto: escola.IN_PATIO_DESCOBERTO === 1,
      auditorio: escola.IN_AUDITORIO === 1,
      cozinha: escola.IN_COZINHA === 1,
      refeitorio: escola.IN_REFEITORIO === 1,
      parque_infantil: escola.IN_PARQUE_INFANTIL === 1,
      sala_musica: escola.IN_SALA_MUSICA_CORAL === 1,
      sala_danca: escola.IN_SALA_ESTUDIO_DANCA === 1,
      sala_atelie: escola.IN_SALA_ATELIE_ARTES === 1,
      piscina: escola.IN_PISCINA === 1,
      area_verde: escola.IN_AREA_VERDE === 1,
      
      // Salas de aula
      salas_utilizadas: escola.QT_SALAS_UTILIZADAS || 0,
      salas_dentro_predio: escola.QT_SALAS_UTILIZADAS_DENTRO || 0,
      salas_fora_predio: escola.QT_SALAS_UTILIZADAS_FORA || 0,
      salas_climatizadas: escola.QT_SALAS_UTILIZA_CLIMATIZADAS || 0,
      salas_acessiveis: escola.QT_SALAS_UTILIZADAS_ACESSIVEIS || 0
    };
  }

  extrairTecnologia(escola) {
    return {
      internet: escola.IN_INTERNET === 1,
      internet_alunos: escola.IN_INTERNET_ALUNOS === 1,
      internet_administrativo: escola.IN_INTERNET_ADMINISTRATIVO === 1,
      internet_aprendizagem: escola.IN_INTERNET_APRENDIZAGEM === 1,
      internet_comunidade: escola.IN_INTERNET_COMUNIDADE === 1,
      banda_larga: escola.IN_BANDA_LARGA === 1,
      
      computadores: {
        total_desktop: escola.QT_DESKTOP_ALUNO || 0,
        total_portateis: escola.QT_COMP_PORTATIL_ALUNO || 0,
        total_tablets: escola.QT_TABLET_ALUNO || 0,
        total_geral: (escola.QT_DESKTOP_ALUNO || 0) + (escola.QT_COMP_PORTATIL_ALUNO || 0) + (escola.QT_TABLET_ALUNO || 0)
      },
      
      equipamentos: {
        tv: escola.IN_EQUIP_TV === 1,
        quantidade_tv: escola.QT_EQUIP_TV || 0,
        multimidia: escola.IN_EQUIP_MULTIMIDIA === 1,
        quantidade_multimidia: escola.QT_EQUIP_MULTIMIDIA || 0,
        lousa_digital: escola.IN_EQUIP_LOUSA_DIGITAL === 1,
        quantidade_lousa_digital: escola.QT_EQUIP_LOUSA_DIGITAL || 0,
        impressora: escola.IN_EQUIP_IMPRESSORA === 1,
        impressora_multifuncional: escola.IN_EQUIP_IMPRESSORA_MULT === 1,
        scanner: escola.IN_EQUIP_SCANNER === 1,
        copiadora: escola.IN_EQUIP_COPIADORA === 1,
        som: escola.IN_EQUIP_SOM === 1,
        quantidade_som: escola.QT_EQUIP_SOM || 0,
        dvd: escola.IN_EQUIP_DVD === 1,
        quantidade_dvd: escola.QT_EQUIP_DVD || 0,
        parabólica: escola.IN_EQUIP_PARABOLICA === 1
      }
    };
  }

  extrairOfertaEducacional(escola) {
    return {
      infantil: escola.IN_INF === 1,
      creche: escola.IN_INF_CRE === 1,
      pre_escola: escola.IN_INF_PRE === 1,
      fundamental: escola.IN_FUND === 1,
      fundamental_anos_iniciais: escola.IN_FUND_AI === 1,
      fundamental_anos_finais: escola.IN_FUND_AF === 1,
      medio: escola.IN_MED === 1,
      profissional: escola.IN_PROF === 1,
      profissional_tecnico: escola.IN_PROF_TEC === 1,
      eja: escola.IN_EJA === 1,
      eja_fundamental: escola.IN_EJA_FUND === 1,
      eja_medio: escola.IN_EJA_MED === 1,
      especial: escola.IN_ESP === 1,
      especial_cc: escola.IN_ESP_CC === 1,
      especial_ce: escola.IN_ESP_CE === 1,
      
      // Modalidades
      regular: escola.IN_REGULAR === 1,
      diurno: escola.IN_DIURNO === 1,
      noturno: escola.IN_NOTURNO === 1,
      ead: escola.IN_EAD === 1
    };
  }

  extrairMatriculas(escola) {
    return {
      total: escola.QT_MAT_BAS || 0,
      infantil: escola.QT_MAT_INF || 0,
      creche: escola.QT_MAT_INF_CRE || 0,
      pre_escola: escola.QT_MAT_INF_PRE || 0,
      fundamental: escola.QT_MAT_FUND || 0,
      fundamental_anos_iniciais: escola.QT_MAT_FUND_AI || 0,
      fundamental_anos_finais: escola.QT_MAT_FUND_AF || 0,
      medio: escola.QT_MAT_MED || 0,
      profissional: escola.QT_MAT_PROF || 0,
      profissional_tecnico: escola.QT_MAT_PROF_TEC || 0,
      eja: escola.QT_MAT_EJA || 0,
      eja_fundamental: escola.QT_MAT_EJA_FUND || 0,
      eja_medio: escola.QT_MAT_EJA_MED || 0,
      especial: escola.QT_MAT_ESP || 0,
      
      por_sexo: {
        feminino: escola.QT_MAT_BAS_FEM || 0,
        masculino: escola.QT_MAT_BAS_MASC || 0,
        nao_declarado: escola.QT_MAT_BAS_ND || 0
      },
      
      por_cor_raca: {
        branca: escola.QT_MAT_BAS_BRANCA || 0,
        preta: escola.QT_MAT_BAS_PRETA || 0,
        parda: escola.QT_MAT_BAS_PARDA || 0,
        amarela: escola.QT_MAT_BAS_AMARELA || 0,
        indigena: escola.QT_MAT_BAS_INDIGENA || 0
      },
      
      por_idade: {
        "0_3": escola.QT_MAT_BAS_0_3 || 0,
        "4_5": escola.QT_MAT_BAS_4_5 || 0,
        "6_10": escola.QT_MAT_BAS_6_10 || 0,
        "11_14": escola.QT_MAT_BAS_11_14 || 0,
        "15_17": escola.QT_MAT_BAS_15_17 || 0,
        "18_mais": escola.QT_MAT_BAS_18_MAIS || 0
      },
      
      // Modalidades
      diurna: escola.QT_MAT_BAS_D || 0,
      noturna: escola.QT_MAT_BAS_N || 0,
      ead: escola.QT_MAT_BAS_EAD || 0,
      integral: {
        infantil: escola.QT_MAT_INF_INT || 0,
        creche: escola.QT_MAT_INF_CRE_INT || 0,
        pre_escola: escola.QT_MAT_INF_PRE_INT || 0,
        fundamental: escola.QT_MAT_FUND_INT || 0,
        fundamental_ai: escola.QT_MAT_FUND_AI_INT || 0,
        fundamental_af: escola.QT_MAT_FUND_AF_INT || 0,
        medio: escola.QT_MAT_MED_INT || 0
      }
    };
  }

  extrairDocentes(escola) {
    return {
      total: escola.QT_DOC_BAS || 0,
      infantil: escola.QT_DOC_INF || 0,
      creche: escola.QT_DOC_INF_CRE || 0,
      pre_escola: escola.QT_DOC_INF_PRE || 0,
      fundamental: escola.QT_DOC_FUND || 0,
      fundamental_anos_iniciais: escola.QT_DOC_FUND_AI || 0,
      fundamental_anos_finais: escola.QT_DOC_FUND_AF || 0,
      medio: escola.QT_DOC_MED || 0,
      profissional: escola.QT_DOC_PROF || 0,
      profissional_tecnico: escola.QT_DOC_PROF_TEC || 0,
      eja: escola.QT_DOC_EJA || 0,
      eja_fundamental: escola.QT_DOC_EJA_FUND || 0,
      eja_medio: escola.QT_DOC_EJA_MED || 0,
      especial: escola.QT_DOC_ESP || 0,
      especial_cc: escola.QT_DOC_ESP_CC || 0,
      especial_ce: escola.QT_DOC_ESP_CE || 0
    };
  }

  extrairProfissionais(escola) {
    return {
      administrativos: {
        existe: escola.IN_PROF_ADMINISTRATIVOS === 1,
        quantidade: escola.QT_PROF_ADMINISTRATIVOS || 0
      },
      servicos_gerais: {
        existe: escola.IN_PROF_SERVICOS_GERAIS === 1,
        quantidade: escola.QT_PROF_SERVICOS_GERAIS || 0
      },
      bibliotecario: {
        existe: escola.IN_PROF_BIBLIOTECARIO === 1,
        quantidade: escola.QT_PROF_BIBLIOTECARIO || 0
      },
      coordenador: {
        existe: escola.IN_PROF_COORDENADOR === 1,
        quantidade: escola.QT_PROF_COORDENADOR || 0
      },
      psicologo: {
        existe: escola.IN_PROF_PSICOLOGO === 1,
        quantidade: escola.QT_PROF_PSICOLOGO || 0
      },
      nutricionista: {
        existe: escola.IN_PROF_NUTRICIONISTA === 1,
        quantidade: escola.QT_PROF_NUTRICIONISTA || 0
      },
      fonaudiologo: {
        existe: escola.IN_PROF_FONAUDIOLOGO === 1,
        quantidade: escola.QT_PROF_FONAUDIOLOGO || 0
      },
      monitores: {
        existe: escola.IN_PROF_MONITORES === 1,
        quantidade: escola.QT_PROF_MONITORES || 0
      },
      assistente_social: {
        existe: escola.IN_PROF_ASSIST_SOCIAL === 1,
        quantidade: escola.QT_PROF_ASSIST_SOCIAL || 0
      },
      tradutor_libras: {
        existe: escola.IN_PROF_TRAD_LIBRAS === 1,
        quantidade: escola.QT_PROF_TRAD_LIBRAS || 0
      },
      revisor_braille: {
        existe: escola.IN_PROF_REVISOR_BRAILLE === 1,
        quantidade: escola.QT_PROF_REVISOR_BRAILLE || 0
      }
    };
  }

  extrairAcessibilidade(escola) {
    return {
      rampas: escola.IN_ACESSIBILIDADE_RAMPAS === 1,
      corrimao: escola.IN_ACESSIBILIDADE_CORRIMAO === 1,
      elevador: escola.IN_ACESSIBILIDADE_ELEVADOR === 1,
      pisos_tateis: escola.IN_ACESSIBILIDADE_PISOS_TATEIS === 1,
      vao_livre: escola.IN_ACESSIBILIDADE_VAO_LIVRE === 1,
      sinal_sonoro: escola.IN_ACESSIBILIDADE_SINAL_SONORO === 1,
      sinal_tatil: escola.IN_ACESSIBILIDADE_SINAL_TATIL === 1,
      sinal_visual: escola.IN_ACESSIBILIDADE_SINAL_VISUAL === 1,
      sinalizacao: escola.IN_ACESSIBILIDADE_SINALIZACAO === 1,
      inexistente: escola.IN_ACESSIBILIDADE_INEXISTENTE === 1,
      
      // Infraestrutura específica
      banheiro_pne: escola.IN_BANHEIRO_PNE === 1,
      banheiro_ei: escola.IN_BANHEIRO_EI === 1,
      banheiro_funcionarios: escola.IN_BANHEIRO_FUNCIONARIOS === 1,
      banheiro_chuveiro: escola.IN_BANHEIRO_CHUVEIRO === 1,
      salas_acessiveis: escola.QT_SALAS_UTILIZADAS_ACESSIVEIS || 0
    };
  }

  extrairSaneamento(escola) {
    return {
      agua: {
        potavel: escola.IN_AGUA_POTAVEL === 1,
        rede_publica: escola.IN_AGUA_REDE_PUBLICA === 1,
        poco_artesiano: escola.IN_AGUA_POCO_ARTESIANO === 1,
        cacimba: escola.IN_AGUA_CACIMBA === 1,
        fonte_rio: escola.IN_AGUA_FONTE_RIO === 1,
        inexistente: escola.IN_AGUA_INEXISTENTE === 1,
        carro_pipa: escola.IN_AGUA_CARRO_PIPA === 1
      },
      energia: {
        rede_publica: escola.IN_ENERGIA_REDE_PUBLICA === 1,
        gerador_fossil: escola.IN_ENERGIA_GERADOR_FOSSIL === 1,
        renovavel: escola.IN_ENERGIA_RENOVAVEL === 1,
        inexistente: escola.IN_ENERGIA_INEXISTENTE === 1
      },
      esgoto: {
        rede_publica: escola.IN_ESGOTO_REDE_PUBLICA === 1,
        fossa_septica: escola.IN_ESGOTO_FOSSA_SEPTICA === 1,
        fossa_comum: escola.IN_ESGOTO_FOSSA_COMUM === 1,
        inexistente: escola.IN_ESGOTO_INEXISTENTE === 1
      },
      lixo: {
        coleta: escola.IN_LIXO_SERVICO_COLETA === 1,
        queima: escola.IN_LIXO_QUEIMA === 1,
        enterra: escola.IN_LIXO_ENTERRA === 1,
        destino_publico: escola.IN_LIXO_DESTINO_FINAL_PUBLICO === 1,
        descarta_outra_area: escola.IN_LIXO_DESCARTA_OUTRA_AREA === 1
      },
      tratamento_lixo: {
        separacao: escola.IN_TRATAMENTO_LIXO_SEPARACAO === 1,
        reutilizacao: escola.IN_TRATAMENTO_LIXO_REUTILIZA === 1,
        reciclagem: escola.IN_TRATAMENTO_LIXO_RECICLAGEM === 1,
        inexistente: escola.IN_TRATAMENTO_LIXO_INEXISTENTE === 1
      }
    };
  }

  extrairRecursosPedagogicos(escola) {
    return {
      alimentacao: escola.IN_ALIMENTACAO === 1,
      materiais: {
        multimidia: escola.IN_MATERIAL_PED_MULTIMIDIA === 1,
        infantil: escola.IN_MATERIAL_PED_INFANTIL === 1,
        cientifico: escola.IN_MATERIAL_PED_CIENTIFICO === 1,
        difusao: escola.IN_MATERIAL_PED_DIFUSAO === 1,
        musical: escola.IN_MATERIAL_PED_MUSICAL === 1,
        jogos: escola.IN_MATERIAL_PED_JOGOS === 1,
        artisticas: escola.IN_MATERIAL_PED_ARTISTICAS === 1,
        profissional: escola.IN_MATERIAL_PED_PROFISSIONAL === 1,
        desportiva: escola.IN_MATERIAL_PED_DESPORTIVA === 1,
        indigena: escola.IN_MATERIAL_PED_INDIGENA === 1,
        etnico: escola.IN_MATERIAL_PED_ETNICO === 1,
        campo: escola.IN_MATERIAL_PED_CAMPO === 1,
        bil_surdos: escola.IN_MATERIAL_PED_BIL_SURDOS === 1,
        agricola: escola.IN_MATERIAL_PED_AGRICOLA === 1,
        quilombola: escola.IN_MATERIAL_PED_QUILOMBOLA === 1,
        edu_esp: escola.IN_MATERIAL_PED_EDU_ESP === 1,
        nenhum: escola.IN_MATERIAL_PED_NENHUM === 1
      }
    };
  }

  extrairCaracteristicasPrincipais(escola) {
    const caracteristicas = [];
    
    // Infraestrutura
    if (escola.IN_LABORATORIO_INFORMATICA === 1) caracteristicas.push("Laboratório de Informática");
    if (escola.IN_BIBLIOTECA === 1) caracteristicas.push("Biblioteca");
    if (escola.IN_QUADRA_ESPORTES === 1) caracteristicas.push("Quadra de Esportes");
    if (escola.IN_INTERNET === 1) caracteristicas.push("Acesso à Internet");
    if (escola.IN_REFEITORIO === 1) caracteristicas.push("Refeitório");
    
    // Recursos especiais
    if (escola.IN_EDUCACAO_INDIGENA === 1) caracteristicas.push("Educação Indígena");
    if (escola.IN_ACESSIBILIDADE_RAMPAS === 1) caracteristicas.push("Acessibilidade (Rampas)");
    if (escola.IN_BANHEIRO_PNE === 1) caracteristicas.push("Banheiro Acessível");
    if (escola.IN_ALIMENTACAO === 1) caracteristicas.push("Alimentação Escolar");
    
    // Modalidades
    if (escola.IN_EJA === 1) caracteristicas.push("EJA");
    if (escola.IN_PROF_TEC === 1) caracteristicas.push("Ensino Profissional Técnico");
    if (escola.IN_ESP === 1) caracteristicas.push("Educação Especial");
    
    return caracteristicas;
  }

  // Métodos auxiliares para mapeamento de códigos
  mapearTipoDependencia(codigo) {
    const tipos = {
      1: "Federal",
      2: "Estadual",
      3: "Municipal",
      4: "Privada"
    };
    return tipos[codigo] || "Não informado";
  }

  mapearCategoriaPrivada(codigo) {
    const categorias = {
      1: "Particular",
      2: "Comunitária",
      3: "Confessional",
      4: "Filantrópica"
    };
    return categorias[codigo] || null;
  }

  mapearLocalizacao(codigo) {
    const localizacoes = {
      1: "Urbana",
      2: "Rural"
    };
    return localizacoes[codigo] || "Não informado";
  }

  mapearSituacaoFuncionamento(codigo) {
    const situacoes = {
      1: "Em atividade",
      2: "Paralisada",
      3: "Extinta",
      4: "Escola extinta em anos anteriores"
    };
    return situacoes[codigo] || "Não informado";
  }
}

module.exports = { BigQueryService };
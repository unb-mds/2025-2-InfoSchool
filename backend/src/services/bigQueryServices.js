const { BigQuery } = require("@google-cloud/bigquery");
const { ENV } = require("../config/environment");
const { completeColumnMappings, essentialColumns, columnCategories } = require("../config/completeColumnMappings");

class BigQueryService {
  constructor() {
    this.bigQuery = new BigQuery({
      projectId: ENV.GOOGLE_CLOUD_PROJECT,
      keyFilename: ENV.GOOGLE_APPLICATION_CREDENTIALS,
    });
  }

  async getDadosEscolas(filtros = {}) {
    const ano = filtros.ano || '2024';
    
    try {
      if (!completeColumnMappings[ano]) {
        throw new Error(`Mapeamento não encontrado para o ano ${ano}`);
      }

      const mapping = completeColumnMappings[ano];
      const query = this.buildCompleteQuery(ano, mapping, filtros);
      
      console.log(`🔍 Executando query completa para ${ano} com ${Object.keys(mapping).length} colunas`);
      const resultados = await this.query(query);
      
      return resultados.map(escola => this.processarEscolaCompleta(escola, ano));
      
    } catch (error) {
      console.error(`❌ Erro ao carregar dados de ${ano}:`, error);
      return await this.getDadosEscolasFallback(ano, filtros);
    }
  }

  buildCompleteQuery(ano, mapping, filtros) {
    const whereConditions = this.buildWhereConditions(mapping, filtros);
    const whereClause = whereConditions.length > 0 ? `WHERE ${whereConditions.join(" AND ")}` : "";
    
    // Selecionar TODAS as colunas mapeadas
    const selectedColumns = Object.values(mapping)
      .filter((value, index, self) => self.indexOf(value) === index)
      .map(col => `\`${col}\``)
      .join(", ");

    const tableName = this.getTableName(ano);
    
    return `
      SELECT 
        ${selectedColumns}
      FROM \`${ENV.GOOGLE_CLOUD_PROJECT}.${ENV.BIGQUERY_DATASET}.${tableName}\`
      ${whereClause}
      LIMIT ${filtros.limit || 500}
    `;
  }

  buildWhereConditions(mapping, filtros) {
    const conditions = [];
    
    // Ano
    if (mapping.NU_ANO_CENSO && filtros.ano && filtros.ano !== 'todos') {
      conditions.push(`\`${mapping.NU_ANO_CENSO}\` = ${filtros.ano}`);
    }

    // UF
    if (mapping.SG_UF && filtros.uf) {
      conditions.push(`\`${mapping.SG_UF}\` = '${filtros.uf}'`);
    }

    // Município
    if (mapping.NO_MUNICIPIO && filtros.municipio) {
      conditions.push(`\`${mapping.NO_MUNICIPIO}\` = '${filtros.municipio}'`);
    }

    // ID da escola
    if (mapping.CO_ENTIDADE && filtros.id_escola) {
      conditions.push(`\`${mapping.CO_ENTIDADE}\` = '${filtros.id_escola}'`);
    }

    // Etapas de ensino
    if (filtros.etapa_ensino) {
      const etapaMapping = {
        'Fundamental': mapping.IN_FUND,
        'Médio': mapping.IN_MED,
        'Infantil': mapping.IN_INF,
        'EJA': mapping.IN_EJA
      };
      
      const colunaEtapa = etapaMapping[filtros.etapa_ensino];
      if (colunaEtapa) {
        conditions.push(`\`${colunaEtapa}\` = 1`);
      }
    }

    return conditions;
  }

  getTableName(ano) {
    const tableMap = {
      '2024': ENV.BIGQUERY_TABLE_2024 || '2024',
      '2023': ENV.BIGQUERY_TABLE_2023 || '2023',
      '2022': ENV.BIGQUERY_TABLE_2022 || '2022',
      '2021': ENV.BIGQUERY_TABLE_2021 || '2021',
      '2020': ENV.BIGQUERY_TABLE_2020 || '2020',
      '2019': ENV.BIGQUERY_TABLE_2019 || '2019',
      '2018': ENV.BIGQUERY_TABLE_2018 || '2018',
      '2017': ENV.BIGQUERY_TABLE_2017 || '2017',
      '2016': ENV.BIGQUERY_TABLE_2016 || '2016',
      '2015': ENV.BIGQUERY_TABLE_2015 || '2015',
      '2014': ENV.BIGQUERY_TABLE_2014 || '2014',
      '2013': ENV.BIGQUERY_TABLE_2013 || '2013',
      '2012': ENV.BIGQUERY_TABLE_2012 || '2012',
      '2011': ENV.BIGQUERY_TABLE_2011 || '2011',
      '2007': ENV.BIGQUERY_TABLE_2007 || '2007'
    };
    
    return tableMap[ano] || ENV.BIGQUERY_TABLE;
  }

  // Processamento completo com TODAS as colunas
  processarEscolaCompleta(escola, ano = '2024') {
    const mapping = completeColumnMappings[ano] || completeColumnMappings['2024'];
    
    return {
      dados_brutos: escola,
      identificacao: this.extrairIdentificacao(escola, mapping),
      localizacao: this.extrairLocalizacaoCompleta(escola, mapping),
      infraestrutura: this.extrairInfraestruturaCompleta(escola, mapping),
      tecnologia: this.extrairTecnologiaCompleta(escola, mapping),
      recursos_humanos: this.extrairRecursosHumanosCompleto(escola, mapping),
      oferta_educacional: this.extrairOfertaEducacionalCompleta(escola, mapping),
      matriculas: this.extrairMatriculasCompletas(escola, mapping),
      docentes: this.extrairDocentesCompletos(escola, mapping),
      turmas: this.extrairTurmasCompletas(escola, mapping),
      recursos_pedagogicos: this.extrairRecursosPedagogicosCompleto(escola, mapping),
      acessibilidade: this.extrairAcessibilidadeCompleta(escola, mapping),
      saneamento: this.extrairSaneamentoCompleto(escola, mapping),
      gestao: this.extrairGestaoCompleta(escola, mapping),
      
      // Resumo para RAG com informações completas
      resumo: this.criarResumoCompletoParaRAG(escola, mapping, ano)
    };
  }

  extrairIdentificacao(escola, mapping) {
    return {
      id_escola: escola[mapping.CO_ENTIDADE],
      nome_escola: escola[mapping.NO_ENTIDADE],
      ano_censo: escola[mapping.NU_ANO_CENSO],
      dependencia: this.mapearTipoDependencia(escola[mapping.TP_DEPENDENCIA]),
      categoria_privada: this.mapearCategoriaPrivada(escola[mapping.TP_CATEGORIA_ESCOLA_PRIVADA]),
      localizacao_tipo: this.mapearLocalizacao(escola[mapping.TP_LOCALIZACAO]),
      localizacao_diferenciada: this.mapearLocalizacaoDiferenciada(escola[mapping.TP_LOCALIZACAO_DIFERENCIADA]),
      situacao: this.mapearSituacaoFuncionamento(escola[mapping.TP_SITUACAO_FUNCIONAMENTO]),
      orgao_regional: escola[mapping.CO_ORGAO_REGIONAL],
      data_inicio_ano_letivo: escola[mapping.DT_ANO_LETIVO_INICIO],
      data_termino_ano_letivo: escola[mapping.DT_ANO_LETIVO_TERMINO]
    };
  }

  extrairLocalizacaoCompleta(escola, mapping) {
    return {
      endereco: {
        logradouro: escola[mapping.DS_ENDERECO],
        numero: escola[mapping.NU_ENDERECO],
        complemento: escola[mapping.DS_COMPLEMENTO],
        bairro: escola[mapping.NO_BAIRRO],
        cep: escola[mapping.CO_CEP]
      },
      contato: {
        ddd: escola[mapping.NU_DDD],
        telefone: escola[mapping.NU_TELEFONE]
      },
      geografia: {
        regiao: escola[mapping.NO_REGIAO],
        uf: escola[mapping.SG_UF],
        municipio: escola[mapping.NO_MUNICIPIO],
        mesorregiao: escola[mapping.NO_MESORREGIAO],
        microrregiao: escola[mapping.NO_MICRORREGIAO],
        distrito: escola[mapping.NO_DISTRITO]
      },
      local_funcionamento: {
        predio_escolar: escola[mapping.IN_LOCAL_FUNC_PREDIO_ESCOLAR] === 1,
        socioeducativo: escola[mapping.IN_LOCAL_FUNC_SOCIOEDUCATIVO] === 1,
        prisional: escola[mapping.IN_LOCAL_FUNC_UNID_PRISIONAL] === 1,
        galpao: escola[mapping.IN_LOCAL_FUNC_GALPAO] === 1,
        salas_outra_escola: escola[mapping.IN_LOCAL_FUNC_SALAS_OUTRA_ESC] === 1,
        predio_compartilhado: escola[mapping.IN_PREDIO_COMPARTILHADO] === 1
      }
    };
  }

  extrairInfraestruturaCompleta(escola, mapping) {
    return {
      dependencias: {
        laboratorio_informatica: escola[mapping.IN_LABORATORIO_INFORMATICA] === 1,
        laboratorio_ciencias: escola[mapping.IN_LABORATORIO_CIENCIAS] === 1,
        biblioteca: escola[mapping.IN_BIBLIOTECA] === 1,
        biblioteca_sala_leitura: escola[mapping.IN_BIBLIOTECA_SALA_LEITURA] === 1,
        quadra_esportes: escola[mapping.IN_QUADRA_ESPORTES] === 1,
        quadra_coberta: escola[mapping.IN_QUADRA_ESPORTES_COBERTA] === 1,
        auditorio: escola[mapping.IN_AUDITORIO] === 1,
        cozinha: escola[mapping.IN_COZINHA] === 1,
        refeitorio: escola[mapping.IN_REFEITORIO] === 1,
        parque_infantil: escola[mapping.IN_PARQUE_INFANTIL] === 1,
        piscina: escola[mapping.IN_PISCINA] === 1,
        area_verde: escola[mapping.IN_AREA_VERDE] === 1
      },
      salas_aula: {
        total: escola[mapping.QT_SALAS_UTILIZADAS] || 0,
        dentro_predio: escola[mapping.QT_SALAS_UTILIZADAS_DENTRO] || 0,
        fora_predio: escola[mapping.QT_SALAS_UTILIZADAS_FORA] || 0,
        climatizadas: escola[mapping.QT_SALAS_UTILIZA_CLIMATIZADAS] || 0,
        acessiveis: escola[mapping.QT_SALAS_UTILIZADAS_ACESSIVEIS] || 0
      }
    };
  }

  extrairTecnologiaCompleta(escola, mapping) {
    return {
      internet: {
        acesso: escola[mapping.IN_INTERNET] === 1,
        alunos: escola[mapping.IN_INTERNET_ALUNOS] === 1,
        administrativo: escola[mapping.IN_INTERNET_ADMINISTRATIVO] === 1,
        aprendizagem: escola[mapping.IN_INTERNET_APRENDIZAGEM] === 1,
        comunidade: escola[mapping.IN_INTERNET_COMUNIDADE] === 1,
        banda_larga: escola[mapping.IN_BANDA_LARGA] === 1
      },
      equipamentos: {
        computadores_alunos: (escola[mapping.QT_DESKTOP_ALUNO] || 0) + (escola[mapping.QT_COMP_PORTATIL_ALUNO] || 0),
        tablets_alunos: escola[mapping.QT_TABLET_ALUNO] || 0,
        lousa_digital: escola[mapping.IN_EQUIP_LOUSA_DIGITAL] === 1,
        equip_multimidia: escola[mapping.IN_EQUIP_MULTIMIDIA] === 1,
        tv: escola[mapping.IN_EQUIP_TV] === 1,
        impressora: escola[mapping.IN_EQUIP_IMPRESSORA] === 1
      }
    };
  }

  extrairRecursosHumanosCompleto(escola, mapping) {
    return {
      administrativos: {
        existe: escola[mapping.IN_PROF_ADMINISTRATIVOS] === 1,
        quantidade: escola[mapping.QT_PROF_ADMINISTRATIVOS] || 0
      },
      servicos_gerais: {
        existe: escola[mapping.IN_PROF_SERVICOS_GERAIS] === 1,
        quantidade: escola[mapping.QT_PROF_SERVICOS_GERAIS] || 0
      },
      bibliotecario: {
        existe: escola[mapping.IN_PROF_BIBLIOTECARIO] === 1,
        quantidade: escola[mapping.QT_PROF_BIBLIOTECARIO] || 0
      },
      coordenador: {
        existe: escola[mapping.IN_PROF_COORDENADOR] === 1,
        quantidade: escola[mapping.QT_PROF_COORDENADOR] || 0
      },
      psicologo: {
        existe: escola[mapping.IN_PROF_PSICOLOGO] === 1,
        quantidade: escola[mapping.QT_PROF_PSICOLOGO] || 0
      },
      nutricionista: {
        existe: escola[mapping.IN_PROF_NUTRICIONISTA] === 1,
        quantidade: escola[mapping.QT_PROF_NUTRICIONISTA] || 0
      }
    };
  }

  extrairOfertaEducacionalCompleta(escola, mapping) {
    return {
      etapas: {
        infantil: escola[mapping.IN_INF] === 1,
        creche: escola[mapping.IN_INF_CRE] === 1,
        pre_escola: escola[mapping.IN_INF_PRE] === 1,
        fundamental: escola[mapping.IN_FUND] === 1,
        fundamental_anos_iniciais: escola[mapping.IN_FUND_AI] === 1,
        fundamental_anos_finais: escola[mapping.IN_FUND_AF] === 1,
        medio: escola[mapping.IN_MED] === 1,
        profissional: escola[mapping.IN_PROF] === 1,
        profissional_tecnico: escola[mapping.IN_PROF_TEC] === 1,
        eja: escola[mapping.IN_EJA] === 1,
        eja_fundamental: escola[mapping.IN_EJA_FUND] === 1,
        eja_medio: escola[mapping.IN_EJA_MED] === 1,
        especial: escola[mapping.IN_ESP] === 1
      },
      modalidades: {
        regular: escola[mapping.IN_REGULAR] === 1,
        diurno: escola[mapping.IN_DIURNO] === 1,
        noturno: escola[mapping.IN_NOTURNO] === 1,
        ead: escola[mapping.IN_EAD] === 1
      }
    };
  }

  extrairMatriculasCompletas(escola, mapping) {
    return {
      total: escola[mapping.QT_MAT_BAS] || 0,
      por_etapa: {
        infantil: escola[mapping.QT_MAT_INF] || 0,
        fundamental: escola[mapping.QT_MAT_FUND] || 0,
        medio: escola[mapping.QT_MAT_MED] || 0,
        eja: escola[mapping.QT_MAT_EJA] || 0,
        profissional: escola[mapping.QT_MAT_PROF] || 0
      },
      por_sexo: {
        feminino: escola[mapping.QT_MAT_BAS_FEM] || 0,
        masculino: escola[mapping.QT_MAT_BAS_MASC] || 0
      },
      por_idade: {
        "0_3": escola[mapping.QT_MAT_BAS_0_3] || 0,
        "4_5": escola[mapping.QT_MAT_BAS_4_5] || 0,
        "6_10": escola[mapping.QT_MAT_BAS_6_10] || 0,
        "11_14": escola[mapping.QT_MAT_BAS_11_14] || 0,
        "15_17": escola[mapping.QT_MAT_BAS_15_17] || 0,
        "18_mais": escola[mapping.QT_MAT_BAS_18_MAIS] || 0
      }
    };
  }

  extrairDocentesCompletos(escola, mapping) {
    return {
      total: escola[mapping.QT_DOC_BAS] || 0,
      por_etapa: {
        infantil: escola[mapping.QT_DOC_INF] || 0,
        fundamental: escola[mapping.QT_DOC_FUND] || 0,
        medio: escola[mapping.QT_DOC_MED] || 0,
        eja: escola[mapping.QT_DOC_EJA] || 0
      }
    };
  }

  extrairTurmasCompletas(escola, mapping) {
    return {
      total: escola[mapping.QT_TUR_BAS] || 0,
      por_etapa: {
        infantil: escola[mapping.QT_TUR_INF] || 0,
        fundamental: escola[mapping.QT_TUR_FUND] || 0,
        medio: escola[mapping.QT_TUR_MED] || 0,
        eja: escola[mapping.QT_TUR_EJA] || 0
      }
    };
  }

  criarResumoCompletoParaRAG(escola, mapping, ano) {
    const caracteristicas = this.extrairCaracteristicasPrincipais(escola, mapping);
    
    return {
      nome: escola[mapping.NO_ENTIDADE],
      localizacao: `${escola[mapping.NO_MUNICIPIO]} - ${escola[mapping.SG_UF]}`,
      ano: ano,
      dependencia: this.mapearTipoDependencia(escola[mapping.TP_DEPENDENCIA]),
      localizacao_tipo: this.mapearLocalizacao(escola[mapping.TP_LOCALIZACAO]),
      situacao: this.mapearSituacaoFuncionamento(escola[mapping.TP_SITUACAO_FUNCIONAMENTO]),
      
      // Infraestrutura
      tem_laboratorio_informatica: escola[mapping.IN_LABORATORIO_INFORMATICA] === 1,
      tem_biblioteca: escola[mapping.IN_BIBLIOTECA] === 1,
      tem_internet: escola[mapping.IN_INTERNET] === 1,
      tem_quadra_esportes: escola[mapping.IN_QUADRA_ESPORTES] === 1,
      
      // Dados quantitativos
      total_matriculas: escola[mapping.QT_MAT_BAS] || 0,
      total_docentes: escola[mapping.QT_DOC_BAS] || 0,
      total_turmas: escola[mapping.QT_TUR_BAS] || 0,
      salas_aula: escola[mapping.QT_SALAS_UTILIZADAS] || 0,
      
      // Etapas ofertadas
      oferta_infantil: escola[mapping.IN_INF] === 1,
      oferta_fundamental: escola[mapping.IN_FUND] === 1,
      oferta_medio: escola[mapping.IN_MED] === 1,
      oferta_eja: escola[mapping.IN_EJA] === 1,
      oferta_profissional: escola[mapping.IN_PROF] === 1,
      
      // Características principais
      caracteristicas: caracteristicas,
      
      // Recursos tecnológicos
      recursos_tecnologicos: {
        computadores_alunos: (escola[mapping.QT_DESKTOP_ALUNO] || 0) + (escola[mapping.QT_COMP_PORTATIL_ALUNO] || 0),
        tablets_alunos: escola[mapping.QT_TABLET_ALUNO] || 0,
        lousa_digital: escola[mapping.IN_EQUIP_LOUSA_DIGITAL] === 1,
        equip_multimidia: escola[mapping.IN_EQUIP_MULTIMIDIA] === 1
      },
      
      // Acessibilidade
      acessibilidade: {
        rampas: escola[mapping.IN_ACESSIBILIDADE_RAMPAS] === 1,
        banheiro_pne: escola[mapping.IN_BANHEIRO_PNE] === 1,
        salas_acessiveis: escola[mapping.QT_SALAS_UTILIZADAS_ACESSIVEIS] || 0
      },
      
      // Saneamento básico
      saneamento: {
        agua_potavel: escola[mapping.IN_AGUA_POTAVEL] === 1,
        energia_rede_publica: escola[mapping.IN_ENERGIA_REDE_PUBLICA] === 1,
        esgoto_rede_publica: escola[mapping.IN_ESGOTO_REDE_PUBLICA] === 1
      }
    };
  }

  // Métodos auxiliares de mapeamento (mantenha os existentes)
  mapearTipoDependencia(codigo) {
    const tipos = {
      1: "Federal", 2: "Estadual", 3: "Municipal", 4: "Privada"
    };
    return tipos[codigo] || "Não informado";
  }

  mapearCategoriaPrivada(codigo) {
    const categorias = {
      1: "Particular", 2: "Comunitária", 3: "Confessional", 4: "Filantrópica"
    };
    return categorias[codigo] || null;
  }

  mapearLocalizacao(codigo) {
    const localizacoes = {
      1: "Urbana", 2: "Rural"
    };
    return localizacoes[codigo] || "Não informado";
  }

  mapearLocalizacaoDiferenciada(codigo) {
    const tipos = {
      1: "Área de assentamento", 2: "Terra indígena", 3: "Área quilombola"
    };
    return tipos[codigo] || null;
  }

  mapearSituacaoFuncionamento(codigo) {
    const situacoes = {
      1: "Em atividade", 2: "Paralisada", 3: "Extinta"
    };
    return situacoes[codigo] || "Não informado";
  }

  extrairCaracteristicasPrincipais(escola, mapping) {
    const caracteristicas = [];
    
    // Infraestrutura
    if (escola[mapping.IN_LABORATORIO_INFORMATICA] === 1) caracteristicas.push("Laboratório de Informática");
    if (escola[mapping.IN_BIBLIOTECA] === 1) caracteristicas.push("Biblioteca");
    if (escola[mapping.IN_QUADRA_ESPORTES] === 1) caracteristicas.push("Quadra de Esportes");
    if (escola[mapping.IN_INTERNET] === 1) caracteristicas.push("Acesso à Internet");
    if (escola[mapping.IN_REFEITORIO] === 1) caracteristicas.push("Refeitório");
    
    // Recursos especiais
    if (escola[mapping.IN_EDUCACAO_INDIGENA] === 1) caracteristicas.push("Educação Indígena");
    if (escola[mapping.IN_ACESSIBILIDADE_RAMPAS] === 1) caracteristicas.push("Acessibilidade (Rampas)");
    if (escola[mapping.IN_BANHEIRO_PNE] === 1) caracteristicas.push("Banheiro Acessível");
    if (escola[mapping.IN_ALIMENTACAO] === 1) caracteristicas.push("Alimentação Escolar");
    
    // Modalidades
    if (escola[mapping.IN_EJA] === 1) caracteristicas.push("EJA");
    if (escola[mapping.IN_PROF_TEC] === 1) caracteristicas.push("Ensino Profissional Técnico");
    if (escola[mapping.IN_ESP] === 1) caracteristicas.push("Educação Especial");
    
    return caracteristicas;
  }


  extrairRecursosPedagogicosCompleto(escola, mapping) {
    return {
        materiais_didaticos: {
            acervo_multimidia: escola[mapping.IN_ACERVO_MULTIMIDIA] === 1,
            brinquedos_educacao_infantil: escola[mapping.IN_BRINQUEDOS_ED_INFANTIL] === 1,
            materiais_cientificos: escola[mapping.IN_MATERIAL_CIENTIFICO] === 1,
            materiais_educacao_indigena: escola[mapping.IN_MATERIAL_ED_INDIGENA] === 1,
            materiais_educacao_etnicorracial: escola[mapping.IN_MATERIAL_ED_ETNICORRACIAL] === 1,
            materiais_educacao_campo: escola[mapping.IN_MATERIAL_ED_CAMPO] === 1,
            jogos_educativos: escola[mapping.IN_JOGOS_EDUCATIVOS] === 1
        },
        equipamentos: {
            televisao: escola[mapping.IN_EQUIP_TV] === 1,
            videocassete: escola[mapping.IN_EQUIP_VIDEOCASSETE] === 1,
            dvd: escola[mapping.IN_EQUIP_DVD] === 1,
            antena_parabolica: escola[mapping.IN_EQUIP_PARABOLICA] === 1,
            copiadora: escola[mapping.IN_EQUIP_COPIADORA] === 1,
            impressora: escola[mapping.IN_EQUIP_IMPRESSORA] === 1,
            aparelho_som: escola[mapping.IN_EQUIP_SOM] === 1,
            projetor_multimidia: escola[mapping.IN_EQUIP_MULTIMIDIA] === 1,
            lousa_digital: escola[mapping.IN_EQUIP_LOUSA_DIGITAL] === 1
        },
        acervos: {
            livros_infantis: escola[mapping.IN_ACERVO_LIVROS_INF] === 1,
            livros_fundamental: escola[mapping.IN_ACERVO_LIVROS_FUND] === 1,
            livros_medio: escola[mapping.IN_ACERVO_LIVROS_MED] === 1,
            livros_geral: escola[mapping.IN_ACERVO_LIVROS_GERAL] === 1,
            quantidade_livros: escola[mapping.QT_LIVROS] || 0,
            quantidade_livros_didaticos: escola[mapping.QT_LIVROS_DIDATICOS] || 0,
            quantidade_livros_literatura: escola[mapping.QT_LIVROS_LITERATURA] || 0,
            quantidade_livros_referencia: escola[mapping.QT_LIVROS_REFERENCIA] || 0
        }
    };
}

extrairAcessibilidadeCompleta(escola, mapping) {
    return {
        estrutural: {
            rampas: escola[mapping.IN_ACESSIBILIDADE_RAMPAS] === 1,
            corrimao: escola[mapping.IN_ACESSIBILIDADE_CORRIMAO] === 1,
            sinalizacao_sonora: escola[mapping.IN_ACESSIBILIDADE_SINAL_SONORO] === 1,
            sinalizacao_tatil: escola[mapping.IN_ACESSIBILIDADE_SINAL_TATIL] === 1,
            sinalizacao_visual: escola[mapping.IN_ACESSIBILIDADE_SINAL_VISUAL] === 1,
            vao_livre: escola[mapping.IN_ACESSIBILIDADE_VAO_LIVRE] === 1,
            portas_automaticas: escola[mapping.IN_ACESSIBILIDADE_PORTAS_AUTOMATICAS] === 1
        },
        sanitarios: {
            banheiro_pne: escola[mapping.IN_BANHEIRO_PNE] === 1,
            banheiro_adaptado: escola[mapping.IN_BANHEIRO_ADAPTADO] === 1,
            quantidade_banheiros_pne: escola[mapping.QT_BANHEIROS_PNE] || 0
        },
        dependencias_acessiveis: {
            sala_diretoria: escola[mapping.IN_SALA_DIRETORIA_ACESSIVEL] === 1,
            sala_professores: escola[mapping.IN_SALA_PROFESSORES_ACESSIVEL] === 1,
            biblioteca: escola[mapping.IN_BIBLIOTECA_ACESSIVEL] === 1,
            laboratorio_informatica: escola[mapping.IN_LAB_INFO_ACESSIVEL] === 1,
            laboratorio_ciencias: escola[mapping.IN_LAB_CIENCIAS_ACESSIVEL] === 1,
            refeitorio: escola[mapping.IN_REFEITORIO_ACESSIVEL] === 1,
            cozinha: escola[mapping.IN_COZINHA_ACESSIVEL] === 1,
            quadra_esportes: escola[mapping.IN_QUADRA_ESPORTES_ACESSIVEL] === 1,
            parque_infantil: escola[mapping.IN_PARQUE_INFANTIL_ACESSIVEL] === 1
        },
        recursos_especializados: {
            sala_atendimento_especial: escola[mapping.IN_SALA_ATENDIMENTO_ESPECIAL] === 1,
            recursos_educacao_especial: escola[mapping.IN_RECURSOS_EDUCACAO_ESPECIAL] === 1
        }
    };
}

extrairSaneamentoCompleto(escola, mapping) {
    return {
        abastecimento_agua: {
            fonte: this.mapearFonteAgua(escola[mapping.TP_ABASTECIMENTO_AGUA]),
            agua_potavel: escola[mapping.IN_AGUA_POTAVEL] === 1,
            agua_rede_publica: escola[mapping.IN_AGUA_REDE_PUBLICA] === 1,
            agua_poco_artesiano: escola[mapping.IN_AGUA_POCO_ARTESIANO] === 1,
            agua_cacimba: escola[mapping.IN_AGUA_CACIMBA] === 1,
            agua_fonte_rio: escola[mapping.IN_AGUA_FONTE_RIO] === 1,
            agua_inexistente: escola[mapping.IN_AGUA_INEXISTENTE] === 1
        },
        energia_eletrica: {
            fonte: this.mapearFonteEnergia(escola[mapping.TP_ENERGIA_ELETRICA]),
            energia_rede_publica: escola[mapping.IN_ENERGIA_REDE_PUBLICA] === 1,
            energia_gerador: escola[mapping.IN_ENERGIA_GERADOR] === 1,
            energia_outros: escola[mapping.IN_ENERGIA_OUTROS] === 1,
            energia_inexistente: escola[mapping.IN_ENERGIA_INEXISTENTE] === 1
        },
        esgoto_sanitario: {
            destino: this.mapearDestinoEsgoto(escola[mapping.TP_ESGOTO_SANITARIO]),
            esgoto_rede_publica: escola[mapping.IN_ESGOTO_REDE_PUBLICA] === 1,
            esgoto_fossa_septica: escola[mapping.IN_ESGOTO_FOSSA_SEPTICA] === 1,
            esgoto_fossa_rudimentar: escola[mapping.IN_ESGOTO_FOSSA_RUDIMENTAR] === 1,
            esgoto_inexistente: escola[mapping.IN_ESGOTO_INEXISTENTE] === 1
        },
        lixo: {
            destino: this.mapearDestinoLixo(escola[mapping.TP_DESTINO_LIXO]),
            lixo_servico_publico: escola[mapping.IN_LIXO_SERVICO_PUBLICO] === 1,
            lixo_queima: escola[mapping.IN_LIXO_QUEIMA] === 1,
            lixo_enterra: escola[mapping.IN_LIXO_ENTERRA] === 1,
            lixo_destino_final_publico: escola[mapping.IN_LIXO_DESTINO_FINAL_PUBLICO] === 1,
            lixo_outros: escola[mapping.IN_LIXO_OUTROS] === 1
        },
        tratamento_agua: {
            tratamento: this.mapearTratamentoAgua(escola[mapping.TP_TRATAMENTO_AGUA]),
            agua_tratada: escola[mapping.IN_AGUA_TRATADA] === 1,
            agua_filtrada: escola[mapping.IN_AGUA_FILTRADA] === 1,
            agua_clorada: escola[mapping.IN_AGUA_CLORADA] === 1,
            agua_sem_tratamento: escola[mapping.IN_AGUA_SEM_TRATAMENTO] === 1
        }
    };
}

extrairGestaoCompleta(escola, mapping) {
    return {
        informacoes_basicas: {
            cnpj: escola[mapping.CO_CNPJ_ESCOLA],
            codigo_inep: escola[mapping.CO_ENTIDADE],
            codigo_orgao_regional: escola[mapping.CO_ORGAO_REGIONAL],
            data_inicio_ano_letivo: escola[mapping.DT_ANO_LETIVO_INICIO],
            data_termino_ano_letivo: escola[mapping.DT_ANO_LETIVO_TERMINO]
        },
        estrutura_gestao: {
            conselho_escolar: escola[mapping.IN_CONSELHO_ESCOLAR] === 1,
            composicao_conselho: this.mapearComposicaoConselho(escola[mapping.TP_COMPOSICAO_CONSELHO]),
            diretor_gestao: this.mapearTipoGestao(escola[mapping.TP_GESTAO]),
            existe_diretor: escola[mapping.IN_EXISTE_DIRETOR] === 1
        },
        financiamento: {
            recursos_pnae: escola[mapping.IN_RECURSOS_PNAE] === 1,
            recursos_pde: escola[mapping.IN_RECURSOS_PDE] === 1,
            recursos_outros: escola[mapping.IN_RECURSOS_OUTROS] === 1
        },
        alimentacao: {
            merenda_escolar: escola[mapping.IN_ALIMENTACAO] === 1,
            tipo_alimentacao: this.mapearTipoAlimentacao(escola[mapping.TP_ALIMENTACAO])
        },
        transporte_escolar: {
            oferta_transporte: escola[mapping.IN_TRANSPORTE] === 1,
            tipo_transporte: this.mapearTipoTransporte(escola[mapping.TP_TRANSPORTE])
        }
    };
}

// Métodos auxiliares de mapeamento para as novas funções
mapearFonteAgua(codigo) {
    const fontes = {
        1: "Rede pública",
        2: "Poço artesiano",
        3: "Cacimba/ cisterna/ poço",
        4: "Fonte/ rio/ igarapé/ riacho/ corrego",
        5: "Inexistente"
    };
    return fontes[codigo] || "Não informado";
}

mapearFonteEnergia(codigo) {
    const fontes = {
        1: "Rede pública",
        2: "Gerador movido a combustível fóssil",
        3: "Fontes renováveis (eólica, solar, etc)",
        4: "Inexistente"
    };
    return fontes[codigo] || "Não informado";
}

mapearDestinoEsgoto(codigo) {
    const destinos = {
        1: "Rede pública",
        2: "Fossa séptica",
        3: "Fossa rudimentar",
        4: "Inexistente"
    };
    return destinos[codigo] || "Não informado";
}

mapearDestinoLixo(codigo) {
    const destinos = {
        1: "Serviço de coleta",
        2: "Queima",
        3: "Enterra",
        4: "Destinação final pública",
        5: "Outros"
    };
    return destinos[codigo] || "Não informado";
}

mapearTratamentoAgua(codigo) {
    const tratamentos = {
        1: "Filtração",
        2: "Cloração",
        3: "Sem tratamento"
    };
    return tratamentos[codigo] || "Não informado";
}

mapearComposicaoConselho(codigo) {
    const composicoes = {
        1: "Pais, alunos, professores, funcionários, comunidade",
        2: "Pais, alunos, professores, funcionários",
        3: "Pais, alunos, professores",
        4: "Pais e professores",
        5: "Outros"
    };
    return composicoes[codigo] || "Não informado";
}

mapearTipoGestao(codigo) {
    const tipos = {
        1: "Estatutário",
        2: "Contrato temporário",
        3: "Contrato CLT",
        4: "Outros"
    };
    return tipos[codigo] || "Não informado";
}

mapearTipoAlimentacao(codigo) {
    const tipos = {
        1: "Merenda escolar",
        2: "Alimentação fornecida pelos pais",
        3: "Alimentação fornecida pela escola",
        4: "Outros"
    };
    return tipos[codigo] || "Não informado";
}

mapearTipoTransporte(codigo) {
    const tipos = {
        1: "Transporte público",
        2: "Transporte escolar",
        3: "Transporte próprio",
        4: "Outros"
    };
    return tipos[codigo] || "Não informado";
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

  // Fallback simplificado
  async getDadosEscolasFallback(ano, filtros) {
    console.log(`🔄 Usando fallback para ${ano}`);
    // Implementação do fallback...
  }
}

module.exports = { BigQueryService };
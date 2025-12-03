import { jest } from '@jest/globals';

// Mocks devem ser definidos ANTES dos imports dinâmicos
jest.unstable_mockModule('@google-cloud/bigquery', () => ({
    BigQuery: jest.fn()
}));

jest.unstable_mockModule('../../src/config/environment.js', () => ({
    ENV: {
        GOOGLE_CLOUD_PROJECT: 'test-project',
        GOOGLE_APPLICATION_CREDENTIALS: 'test-key.json',
        BIGQUERY_DATASET: 'test_dataset',
        BIGQUERY_TABLE: 'test_table',
        BIGQUERY_TABLE_2024: 'table_2024'
    }
}));

const mockMappings = {
    '2024': {
        NU_ANO_CENSO: 'NU_ANO_CENSO',
        SG_UF: 'SG_UF',
        NO_MUNICIPIO: 'NO_MUNICIPIO',
        CO_ENTIDADE: 'CO_ENTIDADE',
        TP_DEPENDENCIA: 'TP_DEPENDENCIA',
        NO_ENTIDADE: 'NO_ENTIDADE',
        IN_FUND: 'IN_FUND',
        IN_MED: 'IN_MED',
        IN_INF: 'IN_INF',
        IN_EJA: 'IN_EJA',
        // Adicionando campos necessários para os extratores
        TP_CATEGORIA_ESCOLA_PRIVADA: 'TP_CATEGORIA_ESCOLA_PRIVADA',
        TP_LOCALIZACAO: 'TP_LOCALIZACAO',
        TP_LOCALIZACAO_DIFERENCIADA: 'TP_LOCALIZACAO_DIFERENCIADA',
        TP_SITUACAO_FUNCIONAMENTO: 'TP_SITUACAO_FUNCIONAMENTO',
        CO_ORGAO_REGIONAL: 'CO_ORGAO_REGIONAL',
        DT_ANO_LETIVO_INICIO: 'DT_ANO_LETIVO_INICIO',
        DT_ANO_LETIVO_TERMINO: 'DT_ANO_LETIVO_TERMINO',
        DS_ENDERECO: 'DS_ENDERECO',
        NU_ENDERECO: 'NU_ENDERECO',
        DS_COMPLEMENTO: 'DS_COMPLEMENTO',
        NO_BAIRRO: 'NO_BAIRRO',
        CO_CEP: 'CO_CEP',
        NU_DDD: 'NU_DDD',
        NU_TELEFONE: 'NU_TELEFONE',
        NO_REGIAO: 'NO_REGIAO',
        NO_MESORREGIAO: 'NO_MESORREGIAO',
        NO_MICRORREGIAO: 'NO_MICRORREGIAO',
        NO_DISTRITO: 'NO_DISTRITO',
        IN_LOCAL_FUNC_PREDIO_ESCOLAR: 'IN_LOCAL_FUNC_PREDIO_ESCOLAR',
        IN_LOCAL_FUNC_SOCIOEDUCATIVO: 'IN_LOCAL_FUNC_SOCIOEDUCATIVO',
        IN_LOCAL_FUNC_UNID_PRISIONAL: 'IN_LOCAL_FUNC_UNID_PRISIONAL',
        IN_LOCAL_FUNC_GALPAO: 'IN_LOCAL_FUNC_GALPAO',
        IN_LOCAL_FUNC_SALAS_OUTRA_ESC: 'IN_LOCAL_FUNC_SALAS_OUTRA_ESC',
        IN_PREDIO_COMPARTILHADO: 'IN_PREDIO_COMPARTILHADO',
        IN_LABORATORIO_INFORMATICA: 'IN_LABORATORIO_INFORMATICA',
        IN_LABORATORIO_CIENCIAS: 'IN_LABORATORIO_CIENCIAS',
        IN_BIBLIOTECA: 'IN_BIBLIOTECA',
        IN_BIBLIOTECA_SALA_LEITURA: 'IN_BIBLIOTECA_SALA_LEITURA',
        IN_QUADRA_ESPORTES: 'IN_QUADRA_ESPORTES',
        IN_QUADRA_ESPORTES_COBERTA: 'IN_QUADRA_ESPORTES_COBERTA',
        IN_AUDITORIO: 'IN_AUDITORIO',
        IN_COZINHA: 'IN_COZINHA',
        IN_REFEITORIO: 'IN_REFEITORIO',
        IN_PARQUE_INFANTIL: 'IN_PARQUE_INFANTIL',
        IN_PISCINA: 'IN_PISCINA',
        IN_AREA_VERDE: 'IN_AREA_VERDE',
        QT_SALAS_UTILIZADAS: 'QT_SALAS_UTILIZADAS',
        QT_SALAS_UTILIZADAS_DENTRO: 'QT_SALAS_UTILIZADAS_DENTRO',
        QT_SALAS_UTILIZADAS_FORA: 'QT_SALAS_UTILIZADAS_FORA',
        QT_SALAS_UTILIZA_CLIMATIZADAS: 'QT_SALAS_UTILIZA_CLIMATIZADAS',
        QT_SALAS_UTILIZADAS_ACESSIVEIS: 'QT_SALAS_UTILIZADAS_ACESSIVEIS',
        IN_INTERNET: 'IN_INTERNET',
        IN_INTERNET_ALUNOS: 'IN_INTERNET_ALUNOS',
        IN_INTERNET_ADMINISTRATIVO: 'IN_INTERNET_ADMINISTRATIVO',
        IN_INTERNET_APRENDIZAGEM: 'IN_INTERNET_APRENDIZAGEM',
        IN_INTERNET_COMUNIDADE: 'IN_INTERNET_COMUNIDADE',
        IN_BANDA_LARGA: 'IN_BANDA_LARGA',
        QT_DESKTOP_ALUNO: 'QT_DESKTOP_ALUNO',
        QT_COMP_PORTATIL_ALUNO: 'QT_COMP_PORTATIL_ALUNO',
        QT_TABLET_ALUNO: 'QT_TABLET_ALUNO',
        IN_EQUIP_LOUSA_DIGITAL: 'IN_EQUIP_LOUSA_DIGITAL',
        IN_EQUIP_MULTIMIDIA: 'IN_EQUIP_MULTIMIDIA',
        IN_EQUIP_TV: 'IN_EQUIP_TV',
        IN_EQUIP_IMPRESSORA: 'IN_EQUIP_IMPRESSORA',
        IN_PROF_ADMINISTRATIVOS: 'IN_PROF_ADMINISTRATIVOS',
        QT_PROF_ADMINISTRATIVOS: 'QT_PROF_ADMINISTRATIVOS',
        IN_PROF_SERVICOS_GERAIS: 'IN_PROF_SERVICOS_GERAIS',
        QT_PROF_SERVICOS_GERAIS: 'QT_PROF_SERVICOS_GERAIS',
        IN_PROF_BIBLIOTECARIO: 'IN_PROF_BIBLIOTECARIO',
        QT_PROF_BIBLIOTECARIO: 'QT_PROF_BIBLIOTECARIO',
        IN_PROF_COORDENADOR: 'IN_PROF_COORDENADOR',
        QT_PROF_COORDENADOR: 'QT_PROF_COORDENADOR',
        IN_PROF_PSICOLOGO: 'IN_PROF_PSICOLOGO',
        QT_PROF_PSICOLOGO: 'QT_PROF_PSICOLOGO',
        IN_PROF_NUTRICIONISTA: 'IN_PROF_NUTRICIONISTA',
        QT_PROF_NUTRICIONISTA: 'QT_PROF_NUTRICIONISTA',
        IN_INF_CRE: 'IN_INF_CRE',
        IN_INF_PRE: 'IN_INF_PRE',
        IN_FUND_AI: 'IN_FUND_AI',
        IN_FUND_AF: 'IN_FUND_AF',
        IN_PROF: 'IN_PROF',
        IN_PROF_TEC: 'IN_PROF_TEC',
        IN_EJA_FUND: 'IN_EJA_FUND',
        IN_EJA_MED: 'IN_EJA_MED',
        IN_ESP: 'IN_ESP',
        IN_REGULAR: 'IN_REGULAR',
        IN_DIURNO: 'IN_DIURNO',
        IN_NOTURNO: 'IN_NOTURNO',
        IN_EAD: 'IN_EAD',
        QT_MAT_BAS: 'QT_MAT_BAS',
        QT_MAT_INF: 'QT_MAT_INF',
        QT_MAT_FUND: 'QT_MAT_FUND',
        QT_MAT_MED: 'QT_MAT_MED',
        QT_MAT_EJA: 'QT_MAT_EJA',
        QT_MAT_PROF: 'QT_MAT_PROF',
        QT_MAT_BAS_FEM: 'QT_MAT_BAS_FEM',
        QT_MAT_BAS_MASC: 'QT_MAT_BAS_MASC',
        QT_MAT_BAS_0_3: 'QT_MAT_BAS_0_3',
        QT_MAT_BAS_4_5: 'QT_MAT_BAS_4_5',
        QT_MAT_BAS_6_10: 'QT_MAT_BAS_6_10',
        QT_MAT_BAS_11_14: 'QT_MAT_BAS_11_14',
        QT_MAT_BAS_15_17: 'QT_MAT_BAS_15_17',
        QT_MAT_BAS_18_MAIS: 'QT_MAT_BAS_18_MAIS',
        QT_DOC_BAS: 'QT_DOC_BAS',
        QT_DOC_INF: 'QT_DOC_INF',
        QT_DOC_FUND: 'QT_DOC_FUND',
        QT_DOC_MED: 'QT_DOC_MED',
        QT_DOC_EJA: 'QT_DOC_EJA',
        QT_TUR_BAS: 'QT_TUR_BAS',
        QT_TUR_INF: 'QT_TUR_INF',
        QT_TUR_FUND: 'QT_TUR_FUND',
        QT_TUR_MED: 'QT_TUR_MED',
        QT_TUR_EJA: 'QT_TUR_EJA',
        IN_EDUCACAO_INDIGENA: 'IN_EDUCACAO_INDIGENA',
        IN_ACESSIBILIDADE_RAMPAS: 'IN_ACESSIBILIDADE_RAMPAS',
        IN_BANHEIRO_PNE: 'IN_BANHEIRO_PNE',
        IN_ALIMENTACAO: 'IN_ALIMENTACAO',
        IN_ACERVO_MULTIMIDIA: 'IN_ACERVO_MULTIMIDIA',
        IN_BRINQUEDOS_ED_INFANTIL: 'IN_BRINQUEDOS_ED_INFANTIL',
        IN_MATERIAL_CIENTIFICO: 'IN_MATERIAL_CIENTIFICO',
        IN_MATERIAL_ED_INDIGENA: 'IN_MATERIAL_ED_INDIGENA',
        IN_MATERIAL_ED_ETNICORRACIAL: 'IN_MATERIAL_ED_ETNICORRACIAL',
        IN_MATERIAL_ED_CAMPO: 'IN_MATERIAL_ED_CAMPO',
        IN_JOGOS_EDUCATIVOS: 'IN_JOGOS_EDUCATIVOS',
        IN_EQUIP_VIDEOCASSETE: 'IN_EQUIP_VIDEOCASSETE',
        IN_EQUIP_DVD: 'IN_EQUIP_DVD',
        IN_EQUIP_PARABOLICA: 'IN_EQUIP_PARABOLICA',
        IN_EQUIP_COPIADORA: 'IN_EQUIP_COPIADORA',
        IN_EQUIP_SOM: 'IN_EQUIP_SOM',
        IN_ACERVO_LIVROS_INF: 'IN_ACERVO_LIVROS_INF',
        IN_ACERVO_LIVROS_FUND: 'IN_ACERVO_LIVROS_FUND',
        IN_ACERVO_LIVROS_MED: 'IN_ACERVO_LIVROS_MED',
        IN_ACERVO_LIVROS_GERAL: 'IN_ACERVO_LIVROS_GERAL',
        QT_LIVROS: 'QT_LIVROS',
        QT_LIVROS_DIDATICOS: 'QT_LIVROS_DIDATICOS',
        QT_LIVROS_LITERATURA: 'QT_LIVROS_LITERATURA',
        QT_LIVROS_REFERENCIA: 'QT_LIVROS_REFERENCIA',
        IN_ACESSIBILIDADE_CORRIMAO: 'IN_ACESSIBILIDADE_CORRIMAO',
        IN_ACESSIBILIDADE_SINAL_SONORO: 'IN_ACESSIBILIDADE_SINAL_SONORO',
        IN_ACESSIBILIDADE_SINAL_TATIL: 'IN_ACESSIBILIDADE_SINAL_TATIL',
        IN_ACESSIBILIDADE_SINAL_VISUAL: 'IN_ACESSIBILIDADE_SINAL_VISUAL',
        IN_ACESSIBILIDADE_VAO_LIVRE: 'IN_ACESSIBILIDADE_VAO_LIVRE',
        IN_ACESSIBILIDADE_PORTAS_AUTOMATICAS: 'IN_ACESSIBILIDADE_PORTAS_AUTOMATICAS',
        IN_BANHEIRO_ADAPTADO: 'IN_BANHEIRO_ADAPTADO',
        QT_BANHEIROS_PNE: 'QT_BANHEIROS_PNE',
        IN_SALA_DIRETORIA_ACESSIVEL: 'IN_SALA_DIRETORIA_ACESSIVEL',
        IN_SALA_PROFESSORES_ACESSIVEL: 'IN_SALA_PROFESSORES_ACESSIVEL',
        IN_BIBLIOTECA_ACESSIVEL: 'IN_BIBLIOTECA_ACESSIVEL',
        IN_LAB_INFO_ACESSIVEL: 'IN_LAB_INFO_ACESSIVEL',
        IN_LAB_CIENCIAS_ACESSIVEL: 'IN_LAB_CIENCIAS_ACESSIVEL',
        IN_REFEITORIO_ACESSIVEL: 'IN_REFEITORIO_ACESSIVEL',
        IN_COZINHA_ACESSIVEL: 'IN_COZINHA_ACESSIVEL',
        IN_QUADRA_ESPORTES_ACESSIVEL: 'IN_QUADRA_ESPORTES_ACESSIVEL',
        IN_PARQUE_INFANTIL_ACESSIVEL: 'IN_PARQUE_INFANTIL_ACESSIVEL',
        IN_SALA_ATENDIMENTO_ESPECIAL: 'IN_SALA_ATENDIMENTO_ESPECIAL',
        IN_RECURSOS_EDUCACAO_ESPECIAL: 'IN_RECURSOS_EDUCACAO_ESPECIAL',
        TP_ABASTECIMENTO_AGUA: 'TP_ABASTECIMENTO_AGUA',
        IN_AGUA_POTAVEL: 'IN_AGUA_POTAVEL',
        IN_AGUA_REDE_PUBLICA: 'IN_AGUA_REDE_PUBLICA',
        IN_AGUA_POCO_ARTESIANO: 'IN_AGUA_POCO_ARTESIANO',
        IN_AGUA_CACIMBA: 'IN_AGUA_CACIMBA',
        IN_AGUA_FONTE_RIO: 'IN_AGUA_FONTE_RIO',
        IN_AGUA_INEXISTENTE: 'IN_AGUA_INEXISTENTE',
        TP_ENERGIA_ELETRICA: 'TP_ENERGIA_ELETRICA',
        IN_ENERGIA_REDE_PUBLICA: 'IN_ENERGIA_REDE_PUBLICA',
        IN_ENERGIA_GERADOR: 'IN_ENERGIA_GERADOR',
        IN_ENERGIA_OUTROS: 'IN_ENERGIA_OUTROS',
        IN_ENERGIA_INEXISTENTE: 'IN_ENERGIA_INEXISTENTE',
        TP_ESGOTO_SANITARIO: 'TP_ESGOTO_SANITARIO',
        IN_ESGOTO_REDE_PUBLICA: 'IN_ESGOTO_REDE_PUBLICA',
        IN_ESGOTO_FOSSA_SEPTICA: 'IN_ESGOTO_FOSSA_SEPTICA',
        IN_ESGOTO_FOSSA_RUDIMENTAR: 'IN_ESGOTO_FOSSA_RUDIMENTAR',
        IN_ESGOTO_INEXISTENTE: 'IN_ESGOTO_INEXISTENTE',
        TP_DESTINO_LIXO: 'TP_DESTINO_LIXO',
        IN_LIXO_SERVICO_PUBLICO: 'IN_LIXO_SERVICO_PUBLICO',
        IN_LIXO_QUEIMA: 'IN_LIXO_QUEIMA',
        IN_LIXO_ENTERRA: 'IN_LIXO_ENTERRA',
        IN_LIXO_DESTINO_FINAL_PUBLICO: 'IN_LIXO_DESTINO_FINAL_PUBLICO',
        IN_LIXO_OUTROS: 'IN_LIXO_OUTROS',
        TP_TRATAMENTO_AGUA: 'TP_TRATAMENTO_AGUA',
        IN_AGUA_TRATADA: 'IN_AGUA_TRATADA',
        IN_AGUA_FILTRADA: 'IN_AGUA_FILTRADA',
        IN_AGUA_CLORADA: 'IN_AGUA_CLORADA',
        IN_AGUA_SEM_TRATamento: 'IN_AGUA_SEM_TRATamento',
        CO_CNPJ_ESCOLA: 'CO_CNPJ_ESCOLA',
        IN_CONSELHO_ESCOLAR: 'IN_CONSELHO_ESCOLAR',
        TP_COMPOSICAO_CONSELHO: 'TP_COMPOSICAO_CONSELHO',
        TP_GESTAO: 'TP_GESTAO',
        IN_EXISTE_DIRETOR: 'IN_EXISTE_DIRETOR',
        IN_RECURSOS_PNAE: 'IN_RECURSOS_PNAE',
        IN_RECURSOS_PDE: 'IN_RECURSOS_PDE',
        IN_RECURSOS_OUTROS: 'IN_RECURSOS_OUTROS',
        TP_ALIMENTACAO: 'TP_ALIMENTACAO',
        IN_TRANSPORTE: 'IN_TRANSPORTE',
        TP_TRANSPORTE: 'TP_TRANSPORTE'
    }
};

jest.unstable_mockModule('../../src/config/completeColumnMappings.js', () => ({
    completeColumnMappings: mockMappings,
    essentialColumns: [],
    columnCategories: {}
}));

// Import dinâmico da classe a ser testada
const { BigQueryService } = await import('../../src/services/bigQueryServices.js');
const { BigQuery } = await import('@google-cloud/bigquery');

describe('Testes Unitários: BigQueryService', () => {
    let service;
    let mockBigQueryInstance;
    let mockJob;

    beforeEach(() => {
        jest.clearAllMocks();

        // Setup do mock do BigQuery
        mockJob = {
            getQueryResults: jest.fn().mockResolvedValue([[]]) // Retorna array de linhas vazio por padrão
        };

        mockBigQueryInstance = {
            createQueryJob: jest.fn().mockResolvedValue([mockJob])
        };

        BigQuery.mockImplementation(() => mockBigQueryInstance);

        service = new BigQueryService();
    });

    describe('constructor', () => {
        it('deve inicializar o BigQuery com a configuração correta', () => {
            expect(BigQuery).toHaveBeenCalledWith({
                projectId: 'test-project',
                keyFilename: 'test-key.json'
            });
        });
    });

    describe('getDadosEscolas', () => {
        it('deve retornar dados processados para ano e filtros válidos', async () => {
            const mockRow = {
                CO_ENTIDADE: 123,
                NO_ENTIDADE: 'Escola Teste',
                TP_DEPENDENCIA: 1, // Federal
                IN_LABORATORIO_INFORMATICA: 1
            };

            mockJob.getQueryResults.mockResolvedValue([[mockRow]]);

            const result = await service.getDadosEscolas({ ano: '2024', uf: 'SP' });

            expect(mockBigQueryInstance.createQueryJob).toHaveBeenCalled();
            expect(result).toHaveLength(1);
            expect(result[0].identificacao.nome_escola).toBe('Escola Teste');
            expect(result[0].identificacao.dependencia).toBe('Federal');
        });

        it('deve usar o ano padrão 2024 se não for fornecido', async () => {
            mockJob.getQueryResults.mockResolvedValue([]);
            await service.getDadosEscolas({}); // filtros.ano undefined
            // Verifica se chamou com 2024
            expect(mockBigQueryInstance.createQueryJob).toHaveBeenCalledWith(
                expect.objectContaining({
                    query: expect.stringContaining('table_2024')
                })
            );
        });

        it('deve lançar erro para ano inválido (mapeamento ausente)', async () => {
            // Mock console.error to avoid noise
            const consoleSpy = jest.spyOn(console, 'error').mockImplementation(() => { });

            // Mock fallback to return empty array or something predictable
            service.getDadosEscolasFallback = jest.fn().mockResolvedValue([]);

            const result = await service.getDadosEscolas({ ano: '2099' });

            expect(consoleSpy).toHaveBeenCalledWith(expect.stringContaining('Erro ao carregar dados de 2099'), expect.any(Error));
            expect(service.getDadosEscolasFallback).toHaveBeenCalledWith('2099', { ano: '2099' });
        });

        it('deve lidar com erros do BigQuery chamando o fallback', async () => {
            const consoleSpy = jest.spyOn(console, 'error').mockImplementation(() => { });
            mockBigQueryInstance.createQueryJob.mockRejectedValue(new Error('BQ Error'));
            service.getDadosEscolasFallback = jest.fn().mockResolvedValue(['fallback']);

            const result = await service.getDadosEscolas({ ano: '2024' });

            expect(consoleSpy).toHaveBeenCalled();
            expect(service.getDadosEscolasFallback).toHaveBeenCalled();
            expect(result).toEqual(['fallback']);
        });
    });

    describe('buildCompleteQuery', () => {
        it('deve construir a query com todos os filtros', () => {
            const filtros = {
                ano: '2024',
                uf: 'SP',
                municipio: 'Sao Paulo',
                id_escola: '123',
                etapa_ensino: 'Fundamental',
                limit: 10
            };

            const query = service.buildCompleteQuery('2024', mockMappings['2024'], filtros);

            expect(query).toContain('WHERE');
            expect(query).toContain("UPPER(`SG_UF`) = UPPER('SP')");
            expect(query).toContain("UPPER(`NO_MUNICIPIO`) = UPPER('Sao Paulo')");
            expect(query).toContain("`CO_ENTIDADE` = '123'");
            expect(query).toContain("`IN_FUND` = 1");
            expect(query).toContain("LIMIT 10");
        });

        it('deve construir a query sem filtros', () => {
            const query = service.buildCompleteQuery('2024', mockMappings['2024'], {});
            // Pode ter WHERE se tiver ano no mapping e filtro ano != todos (default é 2024)
            // O default de ano é 2024 no getDadosEscolas, mas aqui chamamos direto.
            // Se passarmos filtro vazio, 'ano' não está lá.
            // Mas buildWhereConditions verifica filtros.ano.

            // Se chamarmos via getDadosEscolas, filtros.ano é setado.
            // Vamos testar buildWhereConditions diretamente ou via buildCompleteQuery com filtros vazios.

            expect(query).not.toContain('WHERE'); // Se filtros.ano for undefined
        });
    });

    describe('buildWhereConditions', () => {
        it('deve lidar com todos os tipos de etapa_ensino', () => {
            const mapping = mockMappings['2024'];

            let conditions = service.buildWhereConditions(mapping, { etapa_ensino: 'Médio' });
            expect(conditions[0]).toBe("`IN_MED` = 1");

            conditions = service.buildWhereConditions(mapping, { etapa_ensino: 'Infantil' });
            expect(conditions[0]).toBe("`IN_INF` = 1");

            conditions = service.buildWhereConditions(mapping, { etapa_ensino: 'EJA' });
            expect(conditions[0]).toBe("`IN_EJA` = 1");
        });
    });

    describe('getTableName', () => {
        it('deve retornar a tabela correta para anos conhecidos', () => {
            expect(service.getTableName('2024')).toBe('table_2024');
            expect(service.getTableName('2023')).toBe('2023'); // Default from code
        });

        it('deve retornar a tabela padrão para ano desconhecido', () => {
            expect(service.getTableName('1990')).toBe('test_table');
        });
    });

    describe('processarEscolaCompleta', () => {
        it('deve processar todos os campos corretamente', () => {
            const mockEscola = {
                CO_ENTIDADE: 1,
                NO_ENTIDADE: 'Escola X',
                TP_DEPENDENCIA: 1,
                IN_INTERNET: 1,
                QT_MAT_BAS: 100,
                IN_LABORATORIO_INFORMATICA: 1
            };

            const result = service.processarEscolaCompleta(mockEscola, '2024');

            expect(result.identificacao.nome_escola).toBe('Escola X');
            expect(result.infraestrutura.dependencias.laboratorio_informatica).toBe(true);
            expect(result.matriculas.total).toBe(100);
            expect(result.resumo.tem_internet).toBe(true);
        });

        it('deve processar todos os campos corretamente com TODAS as features habilitadas', () => {
            const mockEscola = {
                CO_ENTIDADE: 1,
                NO_ENTIDADE: 'Escola Cheia',
                TP_DEPENDENCIA: 1,
                // Infraestrutura
                IN_LABORATORIO_INFORMATICA: 1,
                IN_BIBLIOTECA: 1,
                IN_QUADRA_ESPORTES: 1,
                IN_INTERNET: 1,
                IN_REFEITORIO: 1,
                // Recursos especiais
                IN_EDUCACAO_INDIGENA: 1,
                IN_ACESSIBILIDADE_RAMPAS: 1,
                IN_BANHEIRO_PNE: 1,
                IN_ALIMENTACAO: 1,
                // Modalidades
                IN_EJA: 1,
                IN_PROF_TEC: 1,
                IN_ESP: 1,

                QT_MAT_BAS: 100
            };

            const result = service.processarEscolaCompleta(mockEscola, '2024');

            expect(result.resumo.caracteristicas).toContain("Laboratório de Informática");
            expect(result.resumo.caracteristicas).toContain("Biblioteca");
            expect(result.resumo.caracteristicas).toContain("Quadra de Esportes");
            expect(result.resumo.caracteristicas).toContain("Acesso à Internet");
            expect(result.resumo.caracteristicas).toContain("Refeitório");
            expect(result.resumo.caracteristicas).toContain("Educação Indígena");
            expect(result.resumo.caracteristicas).toContain("Acessibilidade (Rampas)");
            expect(result.resumo.caracteristicas).toContain("Banheiro Acessível");
            expect(result.resumo.caracteristicas).toContain("Alimentação Escolar");
            expect(result.resumo.caracteristicas).toContain("EJA");
            expect(result.resumo.caracteristicas).toContain("Ensino Profissional Técnico");
            expect(result.resumo.caracteristicas).toContain("Educação Especial");
        });

        it('deve processar todos os campos corretamente com NENHUMA feature habilitada', () => {
            const mockEscola = {
                CO_ENTIDADE: 2,
                NO_ENTIDADE: 'Escola Vazia',
                TP_DEPENDENCIA: 1,
                QT_MAT_BAS: 0
            };

            const result = service.processarEscolaCompleta(mockEscola, '2024');
            expect(result.resumo.caracteristicas).toHaveLength(0);
        });

        it('deve usar o mapeamento de 2024 se o ano for desconhecido', () => {
            const mockEscola = {
                CO_ENTIDADE: 1,
                NO_ENTIDADE: 'Escola Fallback',
                TP_DEPENDENCIA: 1
            };
            // 2099 não existe no mockMappings, deve usar 2024
            const result = service.processarEscolaCompleta(mockEscola, '2099');
            expect(result.identificacao.nome_escola).toBe('Escola Fallback');
        });
    });

    describe('Mapeadores', () => {
        it('deve mapear tipos de dependência', () => {
            expect(service.mapearTipoDependencia(1)).toBe('Federal');
            expect(service.mapearTipoDependencia(99)).toBe('Não informado');
        });

        it('deve mapear categoria privada', () => {
            expect(service.mapearCategoriaPrivada(1)).toBe('Particular');
            expect(service.mapearCategoriaPrivada(99)).toBeNull();
        });

        it('deve mapear localização', () => {
            expect(service.mapearLocalizacao(1)).toBe('Urbana');
            expect(service.mapearLocalizacao(99)).toBe('Não informado');
        });

        it('deve mapear localização diferenciada', () => {
            expect(service.mapearLocalizacaoDiferenciada(1)).toBe('Área de assentamento');
            expect(service.mapearLocalizacaoDiferenciada(99)).toBeNull();
        });

        it('deve mapear situação', () => {
            expect(service.mapearSituacaoFuncionamento(1)).toBe('Em atividade');
            expect(service.mapearSituacaoFuncionamento(99)).toBe('Não informado');
        });

        it('deve mapear fonte de água', () => {
            expect(service.mapearFonteAgua(1)).toBe('Rede pública');
            expect(service.mapearFonteAgua(99)).toBe('Não informado');
        });

        it('deve mapear fonte de energia', () => {
            expect(service.mapearFonteEnergia(1)).toBe('Rede pública');
            expect(service.mapearFonteEnergia(99)).toBe('Não informado');
        });

        it('deve mapear destino do esgoto', () => {
            expect(service.mapearDestinoEsgoto(1)).toBe('Rede pública');
            expect(service.mapearDestinoEsgoto(99)).toBe('Não informado');
        });

        it('deve mapear destino do lixo', () => {
            expect(service.mapearDestinoLixo(1)).toBe('Serviço de coleta');
            expect(service.mapearDestinoLixo(99)).toBe('Não informado');
        });

        it('deve mapear tratamento de água', () => {
            expect(service.mapearTratamentoAgua(1)).toBe('Filtração');
            expect(service.mapearTratamentoAgua(99)).toBe('Não informado');
        });

        it('deve mapear composição do conselho', () => {
            expect(service.mapearComposicaoConselho(1)).toContain('Pais');
            expect(service.mapearComposicaoConselho(99)).toBe('Não informado');
        });

        it('deve mapear tipo de gestão', () => {
            expect(service.mapearTipoGestao(1)).toBe('Estatutário');
            expect(service.mapearTipoGestao(99)).toBe('Não informado');
        });

        it('deve mapear tipo de alimentação', () => {
            expect(service.mapearTipoAlimentacao(1)).toBe('Merenda escolar');
            expect(service.mapearTipoAlimentacao(99)).toBe('Não informado');
        });

        it('deve mapear tipo de transporte', () => {
            expect(service.mapearTipoTransporte(1)).toBe('Transporte público');
            expect(service.mapearTipoTransporte(99)).toBe('Não informado');
        });
    });

    describe('query', () => {
        it('deve executar a query e retornar linhas', async () => {
            const mockRows = [{ id: 1 }];
            mockJob.getQueryResults.mockResolvedValue([mockRows]);

            const result = await service.query('SELECT *');

            expect(mockBigQueryInstance.createQueryJob).toHaveBeenCalledWith({
                query: 'SELECT *',
                location: 'US'
            });
            expect(result).toBe(mockRows);
        });

        it('deve lançar erro se a query falhar', async () => {
            const consoleSpy = jest.spyOn(console, 'error').mockImplementation(() => { });
            mockBigQueryInstance.createQueryJob.mockRejectedValue(new Error('Query Failed'));

            await expect(service.query('SELECT *')).rejects.toThrow('Query Failed');
            expect(consoleSpy).toHaveBeenCalled();
        });
    });

    describe('getDadosEscolasFallback', () => {
        it('deve logar o uso do fallback', async () => {
            const consoleSpy = jest.spyOn(console, 'log').mockImplementation(() => { });
            await service.getDadosEscolasFallback('2024', {});
            expect(consoleSpy).toHaveBeenCalledWith('🔄 Usando fallback para 2024');
        });
    });
});

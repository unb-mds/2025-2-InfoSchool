import { jest } from '@jest/globals';

// Define o mock antes dos imports
const mockQuery = jest.fn();

// Usa unstable_mockModule para suportar ESM
jest.unstable_mockModule('@google-cloud/bigquery', () => ({
    BigQuery: jest.fn(() => ({
        query: mockQuery,
    })),
}));

// Import dinâmico após o mock
const { buildApp } = await import('../../src/app.js');

describe('API Integration Tests', () => {
    let app;

    beforeAll(async () => {
        app = buildApp();
        await app.ready();
    });

    afterAll(async () => {
        await app.close();
    });

    beforeEach(() => {
        mockQuery.mockClear();
    });

    test('GET /pagina-inicial/ should return 200 and welcome message', async () => {
        const response = await app.inject({
            method: 'GET',
            url: '/pagina-inicial/',
        });

        expect(response.statusCode).toBe(200);
        expect(JSON.parse(response.payload)).toEqual({ mensagem: 'Rota da home' });
    });

    test('GET /api/escola/details should return 200 and school details', async () => {
        // Mock da resposta do BigQuery
        const mockSchoolData = {
            CO_ENTIDADE: 12345678,
            NO_ENTIDADE: 'Escola Teste',
            TP_DEPENDENCIA: 1,
            TP_LOCALIZACAO: 1,
            TP_SITUACAO_FUNCIONAMENTO: 1,
            IN_DIURNO: 1,
            IN_NOTURNO: 0,
            IN_EJA: 0,
            IN_BIBLIOTECA: 1,
            IN_SALA_LEITURA: 0,
            IN_ACESSIBILIDADE_INEXISTENTE: 0,
        };

        // Retorna [[rows]] pois o BigQuery retorna [rows, metadata]
        mockQuery.mockResolvedValueOnce([[mockSchoolData]]);

        const response = await app.inject({
            method: 'GET',
            url: '/api/escola/details',
            query: {
                id: '12345678',
            },
        });

        expect(response.statusCode).toBe(200);
        const payload = JSON.parse(response.payload);

        expect(payload.CO_ENTIDADE).toBe(12345678);
        expect(payload.NO_ENTIDADE).toBe('Escola Teste');
        expect(payload.turnos_ui).toContain('Diurno');
        expect(payload.tem_biblioteca_ui).toBe(true);
        expect(payload.tem_acessibilidade_ui).toBe(true);
    });

    test('GET /api/escola/details should return 400 if id is missing', async () => {
        const response = await app.inject({
            method: 'GET',
            url: '/api/escola/details',
        });

        expect(response.statusCode).toBe(400);
        expect(JSON.parse(response.payload)).toEqual({ error: 'ID da escola é obrigatório.' });
    });

    test('GET /api/escola/details should return 404 if school not found', async () => {
        mockQuery.mockResolvedValueOnce([[]]); // Retorna array vazio de linhas

        const response = await app.inject({
            method: 'GET',
            url: '/api/escola/details',
            query: {
                id: '99999999',
            },
        });

        expect(response.statusCode).toBe(404);
        expect(JSON.parse(response.payload)).toEqual({ error: 'Escola não encontrada.' });
    });

    test('GET /rota-inexistente should return 404', async () => {
        const response = await app.inject({
            method: 'GET',
            url: '/rota-inexistente',
        });

        expect(response.statusCode).toBe(404);
    });
});

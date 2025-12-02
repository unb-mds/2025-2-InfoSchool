import { jest } from '@jest/globals';

// Mock das dependências ANTES de importar o controller
// Como o controller importa e instancia no módulo ou construtor, precisamos mockar os módulos.
jest.unstable_mockModule('../../src/services/hybrid-ragService.js', () => ({
    default: {
        processQuery: jest.fn()
    }
}));

jest.unstable_mockModule('../../src/services/bigQueryServices.js', () => ({
    BigQueryService: jest.fn().mockImplementation(() => ({
        getDadosEscolas: jest.fn()
    }))
}));

// Import dinâmico para garantir que os mocks sejam aplicados
const { default: chatController } = await import('../../src/controllers/chatController.js');
const { default: mockRagService } = await import('../../src/services/hybrid-ragService.js');

describe('Unit Tests: ChatController', () => {
    let req, res;

    beforeEach(() => {
        req = {
            body: {},
            query: {}
        };
        res = {
            status: jest.fn().mockReturnThis(),
            json: jest.fn()
        };
        jest.clearAllMocks();
    });

    describe('chat', () => {
        test('deve retornar 400 se a pergunta não for fornecida', async () => {
            req.body = {}; // Sem pergunta

            await chatController.chat(req, res);

            expect(res.status).toHaveBeenCalledWith(400);
            expect(res.json).toHaveBeenCalledWith({ error: "Pergunta é obrigatória" });
        });

        test('deve processar a pergunta e retornar sucesso', async () => {
            req.body = { question: 'Qual a melhor escola?' };

            const mockResult = {
                resposta: 'A melhor escola é X',
                intent: 'comparison',
                sources: [],
                statistics: {},
                filtros: {}
            };

            mockRagService.processQuery.mockResolvedValue(mockResult);

            await chatController.chat(req, res);

            expect(mockRagService.processQuery).toHaveBeenCalledWith('Qual a melhor escola?', undefined);
            expect(res.json).toHaveBeenCalledWith(expect.objectContaining({
                success: true,
                answer: 'A melhor escola é X',
                intent: 'comparison'
            }));
        });

        test('deve lidar com erros do serviço', async () => {
            req.body = { question: 'Erro' };
            mockRagService.processQuery.mockRejectedValue(new Error('Erro interno'));

            await chatController.chat(req, res);

            expect(res.status).toHaveBeenCalledWith(500);
            expect(res.json).toHaveBeenCalledWith(expect.objectContaining({
                error: "Erro interno do servidor",
                details: "Erro interno"
            }));
        });
    });

    describe('searchSchools', () => {
        test('deve buscar escolas com filtros e paginação', async () => {
            req.query = { city: 'São Paulo', page: '1', limit: '10' };

            const mockSchools = [{ name: 'Escola A' }, { name: 'Escola B' }];

            // Acessando o mock da instância do BigQueryService dentro do controller
            chatController.bigQueryService.getDadosEscolas.mockResolvedValue(mockSchools);

            await chatController.searchSchools(req, res);

            expect(chatController.bigQueryService.getDadosEscolas).toHaveBeenCalledWith({
                city: 'São Paulo',
                state: undefined,
                adminType: undefined
            });

            expect(res.json).toHaveBeenCalledWith({
                success: true,
                data: mockSchools,
                pagination: {
                    page: 1,
                    limit: 10,
                    total: 2
                }
            });
        });

        test('deve lidar com erros na busca', async () => {
            req.query = {};
            chatController.bigQueryService.getDadosEscolas.mockRejectedValue(new Error('Erro DB'));

            await chatController.searchSchools(req, res);

            expect(res.status).toHaveBeenCalledWith(500);
            expect(res.json).toHaveBeenCalledWith({ error: 'Erro DB' });
        });
    });
});

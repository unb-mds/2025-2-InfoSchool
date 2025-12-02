import { jest } from '@jest/globals';
import CensoDataProcessor from '../../src/services/dataProcessor.js';

describe('Unit Tests: CensoDataProcessor', () => {
    let processor;

    beforeEach(() => {
        processor = new CensoDataProcessor();
    });

    describe('getAdminType', () => {
        test('deve retornar Federal para código 1', () => {
            expect(processor.getAdminType('1')).toBe('Federal');
        });

        test('deve retornar Estadual para código 2', () => {
            expect(processor.getAdminType('2')).toBe('Estadual');
        });

        test('deve retornar Municipal para código 3', () => {
            expect(processor.getAdminType('3')).toBe('Municipal');
        });

        test('deve retornar Privada para código 4', () => {
            expect(processor.getAdminType('4')).toBe('Privada');
        });

        test('deve retornar Desconhecida para código inválido', () => {
            expect(processor.getAdminType('99')).toBe('Desconhecida');
            expect(processor.getAdminType(null)).toBe('Desconhecida');
        });
    });

    describe('transformSchoolData', () => {
        const mockRawData = {
            CO_ENTIDADE: '12345678',
            NO_ENTIDADE: 'Escola Teste',
            NO_MUNICIPIO: 'São Paulo',
            SG_UF: 'SP',
            TP_DEPENDENCIA: '3',
            QT_MAT_BAS: '500',
            QT_MAT_FUND: '300',
            QT_MAT_MED: '200',
            QT_COMP_ALUNO: '10',
            IN_INTERNET: '1',
            IN_BIBLIOTECA: '0',
            DS_ENDERECO: 'Rua Teste, 123',
            NU_DDD: '11',
            NU_TELEFONE: '99999999'
        };

        test('deve transformar dados brutos corretamente', () => {
            const result = processor.transformSchoolData(mockRawData);

            expect(result).toHaveProperty('id', '12345678');
            expect(result).toHaveProperty('name', 'Escola Teste');
            expect(result).toHaveProperty('city', 'São Paulo');
            expect(result).toHaveProperty('state', 'SP');
            expect(result).toHaveProperty('adminType', 'Municipal');

            expect(result.enrollment).toEqual({
                total: '500',
                elementary: '300',
                highSchool: '200'
            });

            expect(result.infrastructure).toEqual({
                computers: '10',
                internet: '1',
                library: '0'
            });

            expect(result).toHaveProperty('documentText');
        });
    });

    describe('createSchoolDocument', () => {
        const mockSchool = {
            CO_ENTIDADE: '12345678',
            NO_ENTIDADE: 'Escola Teste',
            NO_MUNICIPIO: 'São Paulo',
            SG_UF: 'SP',
            TP_DEPENDENCIA: '3',
            QT_MAT_BAS: '500',
            QT_MAT_FUND: '300',
            QT_MAT_MED: '200',
            QT_COMP_ALUNO: '10',
            IN_INTERNET: '1',
            IN_BIBLIOTECA: '0',
            DS_ENDERECO: 'Rua Teste, 123',
            NU_DDD: '11',
            NU_TELEFONE: '99999999'
        };

        test('deve gerar texto do documento corretamente', () => {
            const text = processor.createSchoolDocument(mockSchool);

            expect(text).toContain('Escola: Escola Teste');
            expect(text).toContain('Código INEP: 12345678');
            expect(text).toContain('Localização: São Paulo - SP');
            expect(text).toContain('Dependência Administrativa: Municipal');
            expect(text).toContain('Total: 500');
            expect(text).toContain('Internet: Sim');
            expect(text).toContain('Biblioteca: Não');
            expect(text).toContain('Telefone: 1199999999');
        });

        test('deve lidar com valores nulos ou ausentes', () => {
            const emptySchool = {
                CO_ENTIDADE: '123',
                NO_ENTIDADE: 'Escola Vazia',
                TP_DEPENDENCIA: '99',
                NU_DDD: '',
                NU_TELEFONE: ''
            };

            const text = processor.createSchoolDocument(emptySchool);

            expect(text).toContain('Total: 0');
            expect(text).toContain('Computadores: 0');
            expect(text).toContain('Internet: Não');
        });
    });
});

const csv = require('csv-parser');
const fs = require('fs');

class CensoDataProcessor {
    constructor() {
        this.schoolsData = [];
    }

    async loadCensoData(filePath) {
        return new Promise((resolve, reject) => {
            const results = [];
            fs.createReadStream(filePath)
                .pipe(csv())
                .on('data', (data) => results.push(this.transformSchoolData(data)))
                .on('end', () => {
                    this.schoolsData = results;
                    resolve(results);
                })
                .on('error', reject);
        });
    }

    transformSchoolData(rawData) {
        return {
            id: rawData.CO_ENTIDADE,
            name: rawData.NO_ENTIDADE,
            city: rawData.NO_MUNICIPIO,
            state: rawData.SG_UF,
            adminType: this.getAdminType(rawData.TP_DEPENDENCIA),
            enrollment: {
                total: rawData.QT_MAT_BAS,
                elementary: rawData.QT_MAT_FUND,
                highSchool: rawData.QT_MAT_MED
            },
            infrastructure: {
                computers: rawData.QT_COMP_ALUNO,
                internet: rawData.IN_INTERNET,
                library: rawData.IN_BIBLIOTECA
            },
            // Criar documento textual para embeddings
            documentText: this.createSchoolDocument(rawData)
        };
    }

    createSchoolDocument(school) {
        return `
        Escola: ${school.NO_ENTIDADE}
        Código INEP: ${school.CO_ENTIDADE}
        Localização: ${school.NO_MUNICIPIO} - ${school.SG_UF}
        Dependência Administrativa: ${this.getAdminType(school.TP_DEPENDENCIA)}
        
        Matrículas:
        - Total: ${school.QT_MAT_BAS || 0}
        - Ensino Fundamental: ${school.QT_MAT_FUND || 0}
        - Ensino Médio: ${school.QT_MAT_MED || 0}
        
        Infraestrutura:
        - Computadores: ${school.QT_COMP_ALUNO || 0}
        - Internet: ${school.IN_INTERNET === '1' ? 'Sim' : 'Não'}
        - Biblioteca: ${school.IN_BIBLIOTECA === '1' ? 'Sim' : 'Não'}
        
        Contato:
        - Endereço: ${school.DS_ENDERECO}
        - Telefone: ${school.NU_DDD + school.NU_TELEFONE}
        `.trim();
    }

    getAdminType(code) {
        const types = {
            '1': 'Federal',
            '2': 'Estadual',
            '3': 'Municipal',
            '4': 'Privada'
        };
        return types[code] || 'Desconhecida';
    }
}

module.exports = CensoDataProcessor;
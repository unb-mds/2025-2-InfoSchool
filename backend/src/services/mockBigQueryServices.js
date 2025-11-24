class MockBigQueryService {
  constructor() {
    console.log("🔄 Usando dados MOCK do BigQuery - Modo de desenvolvimento");
  }

  async query(sql) {
    console.log("📊 Simulando query BigQuery (MOCK)");
    return this.generateMockData();
  }

  async getDadosEscolas(filtros = {}) {
    console.log("📊 Retornando dados MOCK de escolas");

    let dados = this.generateMockData();

    if (filtros.uf) {
      dados = dados.filter((escola) => escola.uf === filtros.uf);
    }

    if (filtros.municipio) {
      dados = dados.filter((escola) =>
        escola.municipio.toLowerCase().includes(filtros.municipio.toLowerCase())
      );
    }

    if (filtros.etapa_ensino) {
      dados = dados.filter(
        (escola) => escola.etapa_ensino === filtros.etapa_ensino
      );
    }

    return dados.slice(0, 100);
  }

  generateMockData() {
    const municipiosSP = [
      "São Paulo",
      "Campinas",
      "Santos",
      "Ribeirão Preto",
      "São José dos Campos",
      "Sorocaba",
      "Jundiaí",
      "Bauru",
    ];
    const municipiosRJ = [
      "Rio de Janeiro",
      "Niterói",
      "Duque de Caxias",
      "São Gonçalo",
      "Nova Iguaçu",
      "Petrópolis",
    ];
    const municipiosMG = [
      "Belo Horizonte",
      "Uberlândia",
      "Contagem",
      "Juiz de Fora",
      "Betim",
      "Montes Claros",
    ];

    const escolas = [];

    // Gerar escolas para SP
    municipiosSP.forEach((municipio, index) => {
      escolas.push({
        id_escola: `35${10000 + index}`,
        nome_escola: `Escola Estadual ${municipio} ${index + 1}`,
        municipio: municipio,
        uf: "SP",
        etapa_ensino:
          index % 3 === 0
            ? "Fundamental"
            : index % 3 === 1
            ? "Médio"
            : "Infantil",
        num_matriculas: Math.floor(Math.random() * 800) + 200,
        ideb: (Math.random() * 3 + 4).toFixed(1),
        possui_laboratorio_informatica: Math.random() > 0.3,
        possui_internet: Math.random() > 0.1,
        num_docentes: Math.floor(Math.random() * 40) + 10,
        tipo_dependencia: index % 4 === 0 ? "Estadual" : "Municipal",
        localizacao: index % 5 === 0 ? "Rural" : "Urbana",
      });
    });

    // Gerar escolas para RJ
    municipiosRJ.forEach((municipio, index) => {
      escolas.push({
        id_escola: `33${10000 + index}`,
        nome_escola: `Colégio Municipal ${municipio} ${index + 1}`,
        municipio: municipio,
        uf: "RJ",
        etapa_ensino:
          index % 3 === 0
            ? "Fundamental"
            : index % 3 === 1
            ? "Médio"
            : "Infantil",
        num_matriculas: Math.floor(Math.random() * 600) + 150,
        ideb: (Math.random() * 3 + 3.5).toFixed(1),
        possui_laboratorio_informatica: Math.random() > 0.4,
        possui_internet: Math.random() > 0.15,
        num_docentes: Math.floor(Math.random() * 35) + 8,
        tipo_dependencia: index % 4 === 0 ? "Estadual" : "Municipal",
        localizacao: index % 6 === 0 ? "Rural" : "Urbana",
      });
    });

    // Gerar escolas para MG
    municipiosMG.forEach((municipio, index) => {
      escolas.push({
        id_escola: `31${10000 + index}`,
        nome_escola: `Instituto Educacional ${municipio} ${index + 1}`,
        municipio: municipio,
        uf: "MG",
        etapa_ensino:
          index % 3 === 0
            ? "Fundamental"
            : index % 3 === 1
            ? "Médio"
            : "Infantil",
        num_matriculas: Math.floor(Math.random() * 700) + 100,
        ideb: (Math.random() * 3 + 4.2).toFixed(1),
        possui_laboratorio_informatica: Math.random() > 0.2,
        possui_internet: Math.random() > 0.05,
        num_docentes: Math.floor(Math.random() * 45) + 12,
        tipo_dependencia: index % 4 === 0 ? "Estadual" : "Municipal",
        localizacao: index % 4 === 0 ? "Rural" : "Urbana",
      });
    });

    // Adicionar algumas escolas com IDEB alto para teste
    escolas.push({
      id_escola: "99999991",
      nome_escola: "Colégio Excelência São Paulo",
      municipio: "São Paulo",
      uf: "SP",
      etapa_ensino: "Médio",
      num_matriculas: 1200,
      ideb: "7.8",
      possui_laboratorio_informatica: true,
      possui_internet: true,
      num_docentes: 85,
      tipo_dependencia: "Estadual",
      localizacao: "Urbana",
    });

    escolas.push({
      id_escola: "99999992",
      nome_escola: "Escola Referência Belo Horizonte",
      municipio: "Belo Horizonte",
      uf: "MG",
      etapa_ensino: "Fundamental",
      num_matriculas: 800,
      ideb: "8.2",
      possui_laboratorio_informatica: true,
      possui_internet: true,
      num_docentes: 60,
      tipo_dependencia: "Municipal",
      localizacao: "Urbana",
    });

    return escolas;
  }
}

module.exports = new MockBigQueryService();

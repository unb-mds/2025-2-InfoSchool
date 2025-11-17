const bigquery = new BigQuery({ projectId: 'infoschool-475602' }); 

app.get('/explorar-escolas', async (req, res) => {
    const { termo, estado, municipio, ano, tipo, limite, pagina } = req.query;

    const pageSize = parseInt(limite) || 50;
    const page = parseInt(pagina) || 1;
    const offset = (page - 1) * pageSize;
    // Supondo que a tabela é `escolas.2024` ou `escolas.2023`
    const tabelaCenso = ano 
      ? `\`infoschool-475602.escolas.${ano}\`` 
      : `\`infoschool-475602.escolas.2023\``; // Defina um padrão seguro
    
    let whereClauses = [];
    let params = {};

    // 1. FILTRO DE BUSCA PARCIAL (nome ou município)
    if (termo) {
        whereClauses.push(`(UPPER(nome_escola) LIKE @termo OR UPPER(nome_municipio) LIKE @termo)`);
        params.termo = `%${termo.toUpperCase()}%`;
    }

    // 2. FILTROS DE LOCALIZAÇÃO E TIPO
    if (estado) {
        whereClauses.push(`SG_UF = @estado`);
        params.estado = estado; 
    }
    if (municipio) {
        whereClauses.push(`NO_MUNCIPIO = @municipio`);
        params.municipio = municipio;
    }
    if (tipo) {
        whereClauses.push(`tipo_escola = @tipo`); // Substitua 'tipo_escola' pela coluna real
        params.tipo = tipo;
    }

    const whereCondition = whereClauses.length > 0 ? `WHERE ${whereClauses.join(' AND ')}` : '';

    try {
        // A. CONSULTA DE CONTAGEM (Total de registros para paginação)
        const countQuery = `SELECT COUNT(*) as total FROM ${tabelaCenso} ${whereCondition}`;
        const [countRows] = await bigquery.query({ query: countQuery, params });
        const total = countRows[0].total; // Total de escolas filtradas

        // B. CONSULTA DE DADOS (A página atual)
        const dataQuery = `
            SELECT 
                NO_ENTIDADE, 
                NO_MUNICIPIO, 
                SG_UF, 
                tipo_escola,
                -- ... outras colunas que o frontend precisa
            FROM 
                ${tabelaCenso} 
            ${whereCondition}
            ORDER BY 
                NO_ENTIDADE ASC -- Essencial para paginação estável
            LIMIT @limite OFFSET @offset
        `;

        // Adiciona os parâmetros de paginação
        params.limite = pageSize;
        params.offset = offset;
        
        const [dataRows] = await bigquery.query({ query: dataQuery, params });

        // 3. RETORNA O RESULTADO FORMATADO
        res.json({
            dados: dataRows,
            total: total,
            paginaAtual: page,
            limite: pageSize
        });

    } catch (error) {
        console.error("Erro ao consultar BigQuery:", error);
        res.status(500).json({ error: 'Falha na busca de dados.' });
    }
});

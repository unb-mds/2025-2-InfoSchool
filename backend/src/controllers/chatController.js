const HybridRAGService = require("../services/hybrid-ragService");

class ChatController {
  constructor() {
    this.ragService = HybridRAGService;
  }

  async chat(req, res) {
    try {
      const { question, schoolId, filters } = req.body;

      if (!question) {
        return res.status(400).json({
          error: "Pergunta é obrigatória",
        });
      }

      const result = await this.ragService.processQuery(question, schoolId);

      res.json({
        success: true,
        question,
        answer: result.resposta,
        intent: result.intent,
        sources: result.sources,
        statistics: result.statistics,
        filters: result.filtros,
        timestamp: new Date().toISOString(),
      });
    } catch (error) {
      console.error("Erro no chat:", error);
      res.status(500).json({
        error: "Erro interno do servidor",
        details: error.message,
      });
    }
  }

  async searchSchools(req, res) {
    try {
      const { city, state, adminType, page = 1, limit = 20 } = req.query;
      const filters = { city, state, adminType };

      const schools = await bigQueryService.getDadosEscolas(filters);

      res.json({
        success: true,
        data: schools,
        pagination: {
          page: parseInt(page),
          limit: parseInt(limit),
          total: schools.length,
        },
      });
    } catch (error) {
      res.status(500).json({ error: error.message });
    }
  }
}

module.exports = new ChatController();

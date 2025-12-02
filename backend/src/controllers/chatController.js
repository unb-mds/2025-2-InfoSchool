const hybridRAGService = require("../services/hybrid-ragServices").default;

class ChatController {
  constructor() {
    this.ragService = hybridRAGService;
  }

  async chat(req, res) {
    try {
      const { question, filters = {} } = req.body; // MUDOU: schoolId → filters

      if (!question) {
        return res.status(400).json({
          error: "Pergunta é obrigatória",
        });
      }

      // Inicializar se necessário
      if (!this.ragService.isInitialized) {
        await this.ragService.initialize();
      }

      const result = await this.ragService.processQuery(question, filters); // MUDOU

      res.json({
        success: true,
        pergunta: result.pergunta, // MUDOU: question → pergunta
        resposta: result.resposta, // MUDOU: answer → resposta
        intent: result.intent,
        filtros: result.filtros,
        sources: result.sources,
        statistics: result.statistics,
        timestamp: result.timestamp,
      });
    } catch (error) {
      console.error("Erro no chat:", error);
      res.status(500).json({
        success: false, // ADICIONADO
        error: "Erro interno do servidor",
        details: error.message,
      });
    }
  }
}

module.exports = new ChatController();
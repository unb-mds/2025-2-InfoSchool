// src/routes/chat.routes.js
const hybridRAGService = require("../../services/hybrid-ragService");

async function chatRoutes(fastify, options) {
  // Rota de saúde do RAG
  fastify.get("/chat/health", async (request, reply) => {
    return {
      status: "OK",
      initialized: hybridRAGService.isInitialized,
      service: "RAG Híbrido - Censo Escolar",
    };
  });

  // Rota principal de chat
  fastify.post(
    "/chat/query",
    {
      schema: {
        body: {
          type: "object",
          required: ["pergunta"],
          properties: {
            pergunta: { type: "string" },
            filtros: {
              type: "object",
              properties: {
                uf: { type: "string" },
                municipio: { type: "string" },
                etapa_ensino: { type: "string" },
              },
            },
          },
        },
      },
    },
    async (request, reply) => {
      try {
        const { pergunta, filtros } = request.body;

        if (!pergunta || pergunta.trim().length === 0) {
          return reply.status(400).send({
            error: "Pergunta é obrigatória",
          });
        }

        console.log(`🤔 Processando pergunta: "${pergunta}"`);

        const resultado = await hybridRAGService.processQuery(pergunta);

        return {
          success: true,
          ...resultado,
        };
      } catch (error) {
        console.error("❌ Erro na rota /chat/query:", error);
        return reply.status(500).send({
          error: "Erro interno do servidor",
          details: error.message,
        });
      }
    }
  );

  // Rota para inicialização manual
  fastify.post("/chat/initialize", async (request, reply) => {
    try {
      await hybridRAGService.initialize();
      return { success: true, message: "RAG inicializado com sucesso" };
    } catch (error) {
      return reply.status(500).send({
        error: "Erro na inicialização",
        details: error.message,
      });
    }
  });
}

module.exports = chatRoutes;

const ap = require("fastify")({
  logger: {
    level: process.env.NODE_ENV === "development" ? "info" : "warn",
    transport:
      process.env.NODE_ENV === "development"
        ? {
            target: "pino-pretty",
          }
        : undefined,
  },
});

// Plugins (mantenha igual)
ap.register(require("@fastify/cors"), {
  origin: true,
  methods: ["GET", "POST"],
});
ap.register(require("@fastify/helmet"));
ap.register(require("@fastify/rate-limit"), {
  max: 100,
  timeWindow: "1 minute",
});

// Import de rotas (CORRIGIDO - removida duplicata)
const paginaInicialRoutes = require("./src/routes/public/home.js");
const rankingRoutes = require("./src/routes/public/ranking.js");
const ragRoutes = require("./src/routes/public/rag.js");
const brasilRoutes = require("./src/routes/maps/brasil.js");
const estadosRoutes = require("./src/routes/maps/estado.js");
const municipioRoutes = require("./src/routes/maps/municipio.js");
const dashboardRoutes = require("./src/routes/dashboard/index.js");
const escolasApiRoutes = require("./src/routes/explorar-escolas/api/explorar-escolas.js");

const app = Fastify({ logger: true });

// Registro de rotas (CORRIGIDO)
app.register(paginaInicialRoutes, { prefix: "/pagina-inicial" });
app.register(rankingRoutes, { prefix: "/ranking" });
app.register(ragRoutes, { prefix: "/rag" });
app.register(brasilRoutes, { prefix: "/mapa" });
app.register(escolasApiRoutes, { prefix: "/api/explorar-escolas" });

app.register(estadosRoutes, { prefix: "/estados" }); // MUDEI: /estado -> /estados
app.register(municipioRoutes, { prefix: "/municipios" }); // NOVO: prefixo separado
app.register(dashboardRoutes, { prefix: "/dashboard" }); // SIMPLIFIQUEI

// Rota raiz
app.get("/", async (request, reply) => {
  return {
    message: "API Censo Escolar RAG funcionando!",
    endpoints: {
      rag: {
        health: "GET /rag/chat/health",
        query: "POST /rag/chat/query",
        initialize: "POST /rag/chat/initialize",
      },
      maps: {
        brasil: "GET /mapa/...",
        estados: "GET /estados/...",
        municipios: "GET /municipios/...",
      },
      data: {
        ranking: "GET /ranking/...",
        dashboard: "GET /dashboard/...",
      },
    },
  };
});

// Error handler (mantenha)
app.setErrorHandler((error, request, reply) => {
  console.error(error);


  // É CRUCIAL retornar JSON em caso de erro para o frontend!

  reply.status(error.statusCode || 500).send({
    error: true,
    message: error.message || "Erro interno do servidor",
  });
});


// Iniciar servidor
const start = async () => {
  try {
    await app.listen({
      port: process.env.PORT || 3000,
      host: "0.0.0.0",
    });
    console.log(`🚀 Servidor rodando na porta ${process.env.PORT || 3000}`);

    // Inicialização automática do RAG (OPCIONAL)
    console.log("🔄 Inicializando RAG Híbrido...");
    const hybridRAGService = require("./src/services/hybrid-ragService");
    setTimeout(async () => {
      try {
        await hybridRAGService.initialize();
        console.log("✅ RAG Híbrido inicializado automaticamente");
      } catch (error) {
        console.error(
          "❌ Erro na inicialização automática do RAG:",
          error.message
        );
      }
    }, 2000);
  } catch (err) {
    console.error(err);
    process.exit(1);
  }
};

start();

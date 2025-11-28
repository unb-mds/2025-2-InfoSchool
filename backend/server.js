require('dotenv').config({ override: true });

// ETAPA 1: IMPORTAÇÕES
const Fastify = require("fastify");
const paginaInicialRoutes = require("./src/routes/public/home.js");
const rankingRoutes = require("./src/routes/public/ranking.js");
const ragRoutes = require("./src/routes/public/rag.js");
const brasilRoutes = require("./src/routes/maps/brasil.js");
const estadosRoutes = require("./src/routes/maps/estado.js");
const municipioRoutes = require("./src/routes/maps/municipio.js");
const dashboardRoutes = require("./src/routes/dashboard/dashboard.js");
const escolasApiRoutes = require("./src/routes/explorar-escolas/api/explorar-escolas.js");
const escolaSearchRoutes = require("./src/routes/paginaPrincipal/escolaSearch.js");
const escolasLocationRoutes = require("./src/routes/caminho-normal/api/escolaPorLocalizao.js");

// ETAPA 2: INICIALIZAÇÃO DA INSTÂNCIA ÚNICA (AP = APP)
const app = Fastify({
  // Consolidando a configuração de logger que estava no seu 'ap'
  logger: {
    level: process.env.NODE_ENV === "development" ? "info" : "warn",
    transport:
    process.env.NODE_ENV === "development"
    ? {
      target: "pino-pretty",
    }
    : undefined,
  },
  // Adiciona o ignoreTrailingSlash para evitar 404s
  ignoreTrailingSlash: true 
});

// ETAPA 3: REGISTRO DE PLUGINS
app.register(require("@fastify/cors"), {
  // ATENÇÃO: Para produção, mude 'true' para o endereço exato do seu frontend (ex: 'https://seuapp.com')
  origin: true,
  methods: ["GET", "POST"],
});
app.register(require("@fastify/helmet"));
app.register(require("@fastify/rate-limit"), {
  max: 100,
  timeWindow: "1 minute",
});

// ETAPA 4: REGISTRO DE ROTAS (TODAS NO OBJETO 'app')
app.register(paginaInicialRoutes, { prefix: "/pagina-inicial" });
app.register(rankingRoutes, { prefix: "/ranking" });
app.register(ragRoutes, { prefix: "/rag" });
app.register(brasilRoutes, { prefix: "/mapa" });
app.register(escolasApiRoutes, { prefix: "/api/explorar-escolas" });

app.register(escolaSearchRoutes, { prefix: "/api/escolas/search" });

// Adaptação dos seus prefixos
app.register(estadosRoutes, { prefix: "/estados" }); 
app.register(municipioRoutes, { prefix: "/municipios" }); 
app.register(dashboardRoutes, { prefix: "/dashboard" }); 
app.register(escolasLocationRoutes, { prefix: "/api/escolas/location" });
app.register(dashboardRoutes, { prefix: "/api/escola/details" });

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
        search: "GET /api/escolas/search?q=...", // Adiciona a nova rota de busca
      },
    },
  };
});

// Error handler 
app.setErrorHandler((error, request, reply) => {
  console.error(error);

  reply.status(error.statusCode || 500).send({
    error: true,
    message: error.message || "Erro interno do servidor",
  });
});


// Iniciar servidor
const start = async () => {
  try {
    // Usando process.env.PORT, que agora está garantido pelo dotenv
    await app.listen({
      port: process.env.PORT || 3001, // Mudei o default para 3001 para evitar conflito com Next.js
      host: "0.0.0.0",
    });
    console.log(`🚀 Servidor rodando na porta ${process.env.PORT || 3001}`);

    // Inicialização automática do RAG
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
const app = require("fastify")({
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

// Plugins
app.register(require("@fastify/cors"), {
  origin: true,
  methods: ["GET", "POST"],
});

app.register(require("@fastify/helmet"));

app.register(require("@fastify/rate-limit"), {
  max: 100,
  timeWindow: "1 minute",
});

const paginaInicialRoutes = require("./src/routes/public/home.js");
const rankingRoutes = require("./src/routes/public/ranking.js");
const ragRoutes = require("./src/routes/public/rag.js");
const brasilRoutes = require("./src/routes/maps/brasil.js");
const estadosRoutes = require("./src/routes/maps/estado.js");
const municipioRoutes = require("./src/routes/maps/municipio.js");
const dashboardRoutes = require("./src/routes/dashboard/index.js");
const rag = require("./src/routes/public/rag.js");

app.register(paginaInicialRoutes, { prefix: "/pagina-inicial" });
app.register(rankingRoutes, { prefix: "/ranking" });
app.register(ragRoutes, { prefix: "/rag" });
app.register(brasilRoutes, { prefix: "/mapa" });
app.register(estadosRoutes, { prefix: "/estado" });
app.register(municipioRoutes, { prefix: "/estado" });
app.register(dashboardRoutes, { prefix: "/estado/municipio/dashboard" });

app.setErrorHandler((error, request, reply) => {
  console.error(error);

  reply.status(error.statusCode || 500).send({
    error: true,
    message: error.message || "Erro interno do servidor",
  });
});

app.listen({ port: 3000 }, (err, address) => {
  if (err) throw err;
  console.log(`Servidor rodando em http://localhost:3000`);
});

app.get("/rag/health", async (request, reply) => {
  return {
    status: "RAG Service Running",
    timestamp: new Date().toISOString(),
  };
});

app.get("/", async (request, reply) => {
  return { message: "API Censo Escolar RAG funcionando!" };
});

// Iniciar servidor
const start = async () => {
  try {
    await app.listen({
      port: process.env.PORT || 3000,
      host: "0.0.0.0",
    });
    console.log(`🚀 Servidor rodando na porta ${process.env.PORT || 3000}`);
  } catch (err) {
    // usa app.log se disponível, senão console.error
    if (app && app.log && typeof app.log.error === "function") {
      app.log.error(err);
    } else {
      console.error(err);
    }
    process.exit(1);
  }
};

start();

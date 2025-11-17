const Fastify = require("fastify");
const paginaInicialRoutes = require("./src/routes/public/home.js");
const rankingRoutes = require("./src/routes/public/ranking.js");
const ragRoutes = require("./src/routes/public/rag.js");
const brasilRoutes = require("./src/routes/maps/brasil.js");
const estadosRoutes = require("./src/routes/maps/estado.js");
const municipioRoutes = require("./src/routes/maps/municipio.js");
const dashboardRoutes = require("./src/routes/dashboard/index.js");
const escolasApiRoutes = require("./src/routes/explorar-escolas/api/explorar-escolas.js");

const app = Fastify({ logger: true });

app.register(paginaInicialRoutes, { prefix: "/pagina-inicial" });
app.register(rankingRoutes, { prefix: "/ranking" });
app.register(ragRoutes, { prefix: "/rag" });
app.register(brasilRoutes, { prefix: "/mapa" });
app.register(estadosRoutes, { prefix: "/estado" });
app.register(municipioRoutes, { prefix: "/estado" });
app.register(dashboardRoutes, { prefix: "/estado/municipio/dashboard" });
app.register(escolasApiRoutes, { prefix: "/api/explorar-escolas" });

app.setErrorHandler((error, request, reply) => {
  console.error(error);

  // É CRUCIAL retornar JSON em caso de erro para o frontend!
  reply.status(error.statusCode || 500).send({
    error: true,
    message: error.message || "Erro interno do servidor",
  });
});

app.listen({ port: 3001, host: '0.0.0.0' }, (err, address) => {
  if (err) throw err;
  console.log(`Servidor rodando em http://localhost:3001`);
});

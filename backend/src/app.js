import Fastify from "fastify";
import cors from "@fastify/cors";
import helmet from "@fastify/helmet";
import rateLimit from "@fastify/rate-limit";

// Import de rotas
import paginaInicialRoutes from "./routes/public/home.js";
import rankingRoutes from "./routes/public/ranking.js";
import ragRoutes from "./routes/public/rag.js";
import brasilRoutes from "./routes/maps/brasil.js";
import estadosRoutes from "./routes/maps/estado.js";
import municipioRoutes from "./routes/maps/municipio.js";
import dashboardRoutes from "./routes/dashboard/dashboard.js";
import historicalRoutes from "./routes/dashboard/historical.js";
import escolasApiRoutes from "./routes/explorar-escolas/api/explorar-escolas.js";
import escolaSearchRoutes from "./routes/paginaPrincipal/escolaSearch.js";
import escolasLocationRoutes from "./routes/caminho-normal/api/escolaPorLocalizao.js";

const buildApp = (opts = {}) => {
    const app = Fastify({
        logger: opts.logger || false,
        ...opts
    });

    // Plugins
    app.register(cors, {
        origin: true,
        methods: ["GET", "POST"],
    });
    app.register(helmet);
    app.register(rateLimit, {
        max: 100,
        timeWindow: "1 minute",
    });

    // Registro de rotas
    app.register(paginaInicialRoutes, { prefix: "/pagina-inicial" });
    app.register(rankingRoutes, { prefix: "/ranking" });
    app.register(ragRoutes, { prefix: "/rag" });
    app.register(brasilRoutes, { prefix: "/mapa" });
    app.register(escolasApiRoutes, { prefix: "/api/explorar-escolas" });
    app.register(escolaSearchRoutes, { prefix: "/api/escolas/search" });
    app.register(estadosRoutes, { prefix: "/estados" });
    app.register(municipioRoutes, { prefix: "/municipios" });
    app.register(dashboardRoutes, { prefix: "/dashboard" });
    app.register(escolasLocationRoutes, { prefix: "/api/escolas/location" });
    app.register(dashboardRoutes, { prefix: "/api/escola/details" });
    app.register(historicalRoutes, { prefix: "/api/escola/historical" });

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
                    search: "GET /api/escolas/search?q=...",
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

    return app;
};

export { buildApp };

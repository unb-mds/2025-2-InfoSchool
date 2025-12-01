import Fastify from "fastify";
import dotenv from 'dotenv';

dotenv.config();

// Crie APENAS UMA instância do Fastify
const app = Fastify({
  logger: process.env.NODE_ENV === "development" 
    ? { 
        level: 'info',
        transport: {
          target: 'pino-pretty',
          options: {
            colorize: true,
            ignore: 'pid,hostname',
            translateTime: 'HH:MM:ss.l'
          }
        }
      }
    : { 
        level: 'warn' 
      }
});

// Import de rotas (CORRIGIDO para ES Modules)
import paginaInicialRoutes from "./src/routes/public/home.js";
import rankingRoutes from "./src/routes/public/ranking.js";
import ragRoutes from "./src/routes/public/rag.js";
import brasilRoutes from "./src/routes/maps/brasil.js";
import estadosRoutes from "./src/routes/maps/estado.js";
import municipioRoutes from "./src/routes/maps/municipio.js";
import dashboardRoutes from "./src/routes/dashboard/index.js";
import escolasApiRoutes from "./src/routes/explorar-escolas/api/explorar-escolas.js";

// Plugins (CORRIGIDO para ES Modules)
import cors from "@fastify/cors";
import helmet from "@fastify/helmet";
import rateLimit from "@fastify/rate-limit";

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
app.register(estadosRoutes, { prefix: "/estados" });
app.register(municipioRoutes, { prefix: "/municipios" });
app.register(dashboardRoutes, { prefix: "/dashboard" });

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

// Error handler
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
    
    // CORRIGIDO: import para ES Modules
    import('./src/services/hybrid-ragService.js')
      .then(module => {
        setTimeout(async () => {
          try {
            await module.default.initialize();
            console.log("✅ RAG Híbrido inicializado automaticamente");
          } catch (error) {
            console.error(
              "❌ Erro na inicialização automática do RAG:",
              error.message
            );
          }
        }, 2000);
      })
      .catch(error => {
        console.error("❌ Erro ao carregar módulo RAG:", error.message);
      });
      
  } catch (err) {
    console.error(err);
    process.exit(1);
  }
};

start();
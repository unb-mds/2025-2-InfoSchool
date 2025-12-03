import "dotenv/config";
import Fastify from "fastify";
import cors from "@fastify/cors";
import helmet from "@fastify/helmet";
import rateLimit from "@fastify/rate-limit";
import { writeFileSync, existsSync } from "fs";
import { join, dirname } from "path";
import { fileURLToPath } from "url";

// Import de rotas
import paginaInicialRoutes from "./src/routes/public/home.js";
import rankingRoutes from "./src/routes/public/ranking.js";
import ragRoutes from "./src/routes/public/rag.js";
import brasilRoutes from "./src/routes/maps/brasil.js";
import estadosRoutes from "./src/routes/maps/estado.js";
import municipioRoutes from "./src/routes/maps/municipio.js";
import dashboardRoutes from "./src/routes/dashboard/dashboard.js";
import historicalRoutes from "./src/routes/dashboard/historical.js";
import escolasApiRoutes from "./src/routes/explorar-escolas/api/explorar-escolas.js";
import escolaSearchRoutes from "./src/routes/paginaPrincipal/escolaSearch.js";
import escolasLocationRoutes from "./src/routes/caminho-normal/api/escolaPorLocalizao.js";

// Inicialização da instância única
const app = Fastify({
  logger:
    process.env.NODE_ENV === "development"
      ? {
          level: "info",
          transport: {
            target: "pino-pretty",
            options: {
              colorize: true,
              ignore: "pid,hostname",
              translateTime: "HH:MM:ss.l",
            },
          },
        }
      : {
          level: "warn",
        },
});

const serviceAccountPath = join(__dirname, "service-account.json");
const __filename = fileURLToPath(import.meta.url);
const __dirname = dirname(__filename);

if (
  process.env.GOOGLE_APPLICATION_CREDENTIALS &&
  process.env.GOOGLE_APPLICATION_CREDENTIALS.includes("type")
) {
  // Limpa o JSON - remove escapes
  const jsonString = process.env.GOOGLE_APPLICATION_CREDENTIALS.replace(
    /\\n/g,
    "\n"
  )
    .replace(/\\"/g, '"')
    .replace(/^"|"$/g, ""); // Remove aspas no início e fim se houver

  writeFileSync(serviceAccountPath, jsonString);
  console.log("Arquivo de credenciais criado em:", serviceAccountPath);

  // Atualiza a variável para o caminho do arquivo
  process.env.GOOGLE_APPLICATION_CREDENTIALS = serviceAccountPath;
}

// Verifica se o arquivo foi criado
if (existsSync(serviceAccountPath)) {
  console.log("✅ Credenciais do Google disponíveis");
} else {
  console.log("⚠️  Credenciais do Google não encontradas");
}

app.register(cors, {
  origin: [
    "http://localhost:3000", // desenvolvimento
    "https://seu-frontend.vercel.app", // ← VAI MUDAR DEPOIS
    "https://*.vercel.app", // aceita qualquer subdomínio vercel
  ],
  methods: ["GET", "POST"],
  credentials: true,
});
app.register(helmet);
app.register(rateLimit, {
  max: 100,
  timeWindow: "1 minute",
});

// Registro de rotas
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
        search: "GET /api/escolas/search?q=...", // Adiciona a nova rota de busca
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
    // Usando process.env.PORT, que agora está garantido pelo dotenv
    await app.listen({
      port: process.env.PORT || 3001, // Mudei o default para 3001 para evitar conflito com Next.js
      host: "0.0.0.0",
    });
    console.log(`🚀 Servidor rodando na porta ${process.env.PORT || 3001}`);

    // Inicialização automática do RAG
    console.log("🔄 Inicializando RAG Híbrido...");

    // CORRIGIDO: import para ES Modules
    import("./src/services/hybrid-ragService.js")
      .then((module) => {
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
      .catch((error) => {
        console.error("❌ Erro ao carregar módulo RAG:", error.message);
      });
  } catch (err) {
    console.error(err);
    process.exit(1);
  }
};

start();

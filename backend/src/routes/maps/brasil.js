// brasil.js - Versão ES Module
export default async function brasilRoutes(fastify, opts) {
  fastify.get("/", async (request, reply) => {
    return { mensagem: "Rota do mapa do Brasil" };
  });
}
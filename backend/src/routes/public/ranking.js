export default async function rankingRoutes(fastify, opts) {
  fastify.get("/", async (request, reply) => {
    return { mensagem: "Rota do ranking" };
  });
}

export default async function homeRoutes(fastify, opts) {
  fastify.get("/", async (request, reply) => {
    return { mensagem: "Rota da home" };
  });
}
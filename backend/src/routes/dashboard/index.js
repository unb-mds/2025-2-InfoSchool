// Substitua module.exports por export default
export default async function dashboardRoutes(fastify, opts) {
  fastify.get("/", async (request, reply) => {
    return { mensagem: "Rota do dashboard" };
  });
}

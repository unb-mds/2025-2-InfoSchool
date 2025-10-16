module.exports = async function (fastify, opts) {
  fastify.get("/", async (request, reply) => {
    return { mensagem: "Rota do mapa do Brasil" };
  });
};

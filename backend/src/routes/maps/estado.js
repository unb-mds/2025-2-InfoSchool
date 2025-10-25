module.exports = async function (fastify, opts) {
  // lista todos os estados (opcional)
  fastify.get("/", async (request, reply) => {
    return { mensagem: "Lista de estados (a implementar)" };
  });

  // rota com o nome do estado na URL
  fastify.get(
    "/estado/:estadoNome",
    {
      schema: {
        params: {
          type: "object",
          properties: {
            estadoNome: { type: "string" },
          },
          required: ["estadoNome"],
        },
      },
    },
    async (request, reply) => {
      const { estadoNome } = request.params;
      // estadoNome vem URL-encoded se necessário -> decode
      const nome = decodeURIComponent(estadoNome);
      // aqui você pode buscar dados do estado no serviço/DB
      return { estado: nome };
    }
  );
};

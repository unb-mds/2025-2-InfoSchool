module.exports = async function (fastify, opts) {
  // Lista municípios de um estado -> GET /estado/:estadoNome/municipio
  fastify.get(
    "/:estadoNome/municipio",
    {
      schema: {
        params: {
          type: "object",
          properties: { estadoNome: { type: "string" } },
          required: ["estadoNome"],
        },
      },
    },
    async (request, reply) => {
      const estadoNome = decodeURIComponent(request.params.estadoNome);
      // TODO: buscar lista real no serviço/DB
      return { estado: estadoNome, municipios: [] };
    }
  );

  // Detalhe de um município -> GET /estado/:estadoNome/municipio/:municipioNome
  fastify.get(
    "/:estadoNome/municipio/:municipioNome",
    {
      schema: {
        params: {
          type: "object",
          properties: {
            estadoNome: { type: "string" },
            municipioNome: { type: "string" },
          },
          required: ["estadoNome", "municipioNome"],
        },
      },
    },
    async (request, reply) => {
      const estado = decodeURIComponent(request.params.estadoNome);
      const municipio = decodeURIComponent(request.params.municipioNome);
      // TODO: buscar dados reais no serviço/DB
      return { estado, municipio };
    }
  );
};

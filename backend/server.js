const Fastify = require("fastify");

const app = Fastify();

app.get("/pagina-inicial", async () => {
  return { message: "Rota inicial funcionando!" };
});

app.get("/mapa-brasil", async () => {
  return { message: "Rota do mapa funcionando!" };
});

app.get("/ranking", async () => {
  return { message: "Rota do ranking funcionando!" };
});

app.get("/rag", async () => {
  return { message: "Rota do rag funcionando!" };
});

app.get("/mapa-estado", async () => {
  return { message: "Rota do mapa dos estados funcionando!" };
});

app.get("/mapa-municipio", async () => {
  return { message: "Rota do mapa dos municípios funcionando!" };
});

app.get("/dashboard", async () => {
  return { message: "Rota do dashboard funcionando!" };
});

app.listen({ port: 3000 }, (err) => {
  if (err) throw err;
  console.log(`Pagina inicial rodando em http://localhost:3000/pagina-inicial`);
});

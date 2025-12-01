## 📘 Guia de Desenvolvimento: InfoSchool

Este documento serve como guia técnico para desenvolvedores que desejam contribuir com o projeto InfoSchool.

### 1. 📌 Visão Geral e Estrutura

O sistema é um monorepo que integra visualização de dados do Censo Escolar com capacidade de busca conversacional inteligente.

📂 Estrutura de Pastas

IMPORTANTE: Tudo entre as linhas ``` precisa ser copiado exatamente — isso garante o quadrado cinza.

```bash
infoschool/
 ├── backend/
 │    ├── server.js                 # Ponto de entrada (Fastify)
 │    ├── src/
 │    │    ├── services/
 │    │    │    ├── bigQueryServices.js     # Conexão e SQL
 │    │    │    ├── embeddingService.js     # Embeddings
 │    │    │    ├── vectorStoreServices.js  # Vetores
 │    │    │    └── hybridRAGService.js     # Lógica RAG + RRF
 │    │    ├── config/
 │    │    └── routes/
 │    └── scripts/
 │         └── data-preparation.js
 │
 ├── front-end/ (Next.js)
 │    ├── src/
 │    ├── public/
 │    └── package.json
 │
 └── README.md
```

2. 🧰 Pré-requisitos
```txt
- Node.js 18.x
- npm ou yarn
- Git
- Google Cloud SDK (opcional)
```

🔑 Credenciais Necessárias
```txt
- OPENAI_API_KEY
- Service Account JSON (BigQuery)
```

3. 🚀 Instalação e Execução
🖥️ Front-end
```bash
cd front-end
npm install
npm run dev
```


Acesse: http://localhost:3000

⚙️ Back-end
```bash
cd backend
npm install
```


Crie .env:

```env
PORT=3333

GOOGLE_CLOUD_PROJECT=seu-id
GOOGLE_PROJECT_ID=seu-id
GOOGLE_APPLICATION_CREDENTIALS=./credentials/service-account.json

OPENAI_API_KEY=sk-sua-chave
```


Execute:

```bash
npm run dev
```

4. 🧱 Arquitetura – Hybrid RAG
```txt
Pergunta do Usuário
        ↓
Classificação de Intenção
        ↓
┌──────────────────────┬──────────────────────┬────────────────────────┐
│   Busca Vetorial     │    Busca Esparsa     │   Busca Estruturada    │
│ (Semantic Search)    │       (BM25)         │      (BigQuery)        │
└──────────┬───────────┴──────────┬───────────┴───────────┬────────────┘
           │                      │                       │
           └──────────────────────┼───────────────────────┘
                                  ↓
                     Fusão RRF (Reciprocal Rank Fusion)
                                  ↓
                       Contexto Unificado para LLM
                                  ↓
                        Resposta Final
```

5. 📦 Tecnologias
```txt
Front-end:
- Next.js 15
- React 18
- TailwindCSS v4
- Recharts, D3
- Framer Motion

Back-end:
- Fastify
- BigQuery Client
- LangChain
- Elasticlunr (BM25)
- OpenAI
```

6. 📜 Scripts Disponíveis
Front-end
```txt
dev     → Rodar desenvolvimento
build   → Build de produção
```

Back-end
```txt
dev            → Rodar API
data:prepare   → ETL / preparação de dados
```

7. 💡 Dicas de Desenvolvimento
```txt
- Recrie BM25 ao atualizar BigQuery
- Embeddings custam dinheiro — evite regenerar tudo
- Queries grandes no BigQuery = custo
- Nunca comitar .env ou chaves JSON
```

8. 🔄 CI/CD
```txt
workflow: deploy.yml
- Node 18
- npm ci
- build do front-end
- roda em PR e branch features
```

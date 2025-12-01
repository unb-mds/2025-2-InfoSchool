📘 Guia de Desenvolvimento: InfoSchool

Este documento serve como guia técnico para desenvolvedores que desejam contribuir com o projeto InfoSchool. Aqui você encontrará instruções sobre configuração de ambiente, execução local, arquitetura detalhada e processos de CI/CD.

1. Visão Geral e Estrutura

O sistema é um monorepo que integra visualização de dados do Censo Escolar com capacidade de busca conversacional inteligente.

Estrutura de Pastas

infoschool/
 ├── backend/
 │    ├── server.js              # Ponto de entrada (Fastify)
 │    ├── src/
 │    │    ├── services/
 │    │    │    ├── bigQueryServices.js    # Conexão e queries SQL
 │    │    │    ├── embeddingService.js    # OpenAI ou Local Embeddings
 │    │    │    ├── vectorStoreServices.js # Gerenciamento vetorial
 │    │    │    └── hybridRAGService.js    # Lógica principal (RAG + RRF)
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


2. Pré-requisitos

Antes de iniciar, certifique-se de ter instalado em sua máquina:

Node.js: Versão 18.x (Definida no pipeline de CI).

Gerenciador de Pacotes: npm (utilizado no CI) ou yarn.

Git: Para versionamento.

Google Cloud SDK (Opcional): Útil para testar credenciais localmente.

Credenciais Necessárias

Para rodar o projeto completamente (com busca e dados reais), você precisará configurar:

OpenAI API Key: Para o funcionamento do chatbot (Embeddings e LLM).

Google Cloud Service Account: Arquivo JSON com permissões de leitura no BigQuery.

3. Guia de Instalação e Execução

🖥️ Front-end (Interface)

Navegue até a pasta:

cd front-end


Instale as dependências:

npm install
# ou yarn install


Execute o servidor de desenvolvimento:

npm run dev


Acesse em: http://localhost:3000

⚙️ Back-end (API & Dados)

Navegue até a pasta:

cd backend


Instale as dependências:

npm install


Configuração de Ambiente (.env):
Crie um arquivo .env na raiz da pasta backend. Abaixo estão as variáveis essenciais e opcionais:

PORT=3333

# --- Google Cloud (BigQuery) ---
GOOGLE_CLOUD_PROJECT=seu-id-do-projeto
GOOGLE_PROJECT_ID=seu-id-do-projeto
# Caminho para sua credencial GCP (JSON)
GOOGLE_APPLICATION_CREDENTIALS=./credentials/service-account.json

# --- Inteligência Artificial ---
OPENAI_API_KEY=sk-sua-chave-aqui

# (Opcional) Alternativa para embeddings locais
# LOCAL_EMBEDDING_URL=http://localhost:5000/embed


Execute a API:

npm run dev
# ou yarn dev


4. Arquitetura do Backend e Serviços

O backend do InfoSchool não é apenas uma API REST simples; ele implementa um padrão de RAG Híbrido (Hybrid Retrieval-Augmented Generation).

Fluxo de Processamento (Hybrid RAG)

O sistema utiliza uma estratégia de fusão para garantir respostas precisas, combinando três fontes de informação antes de enviar ao LLM:

Pergunta do Usuário 
       ↓
Classificação de Intenção & Extração de Filtros
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
                        Resposta Final Gerada


Principais Serviços (/src/services)

bigQueryServices.js:

Gerencia a conexão com o Data Warehouse.

Executa queries SQL com filtros dinâmicos (UF, Município, Etapa de Ensino).

Exemplo de uso: await this.bigQuery.createQueryJob({ query, location: "US" });

embeddingService.js:

Responsável por converter texto em vetores.

Suporta OpenAI (text-embedding-ada-002) ou servidor local (ex: MiniLM).

vectorStoreServices.js:

Armazena os embeddings gerados e realiza a busca de vizinhos mais próximos (k-NN) para encontrar similaridade semântica.

Busca Esparsa (Elasticlunr):

Implementa algoritmo BM25 para busca por palavras-chave exatas nos campos: nome_escola, municipio, uf, etapa_ensino.

5. Dependências e Tecnologias

Front-end

Core: Next.js 15, React 18, TypeScript.

Visualização: d3, d3-geo, recharts.

UI: Tailwind CSS v4, Framer Motion, Lucide React.

Back-end

Core: Fastify (Performance), Nodemon (Dev).

Dados: @google-cloud/bigquery.

IA: LangChain (Orquestração), OpenAI, elasticlunr (Busca local).

6. Scripts Disponíveis

Front-end (/front-end)

Script

Descrição

dev

Inicia o ambiente de desenvolvimento.

build

Compila a aplicação para produção.

Back-end (/backend)

Script

Descrição

dev

Inicia o servidor (Watch mode).

data:prepare

Executa scripts de ETL para preparar dados iniciais (BigQuery/Índices).

7. Dicas de Desenvolvimento

Índices de Busca: Recrie o índice BM25 sempre que a base de dados do BigQuery sofrer atualizações significativas para garantir consistência.

Embeddings: A geração de embeddings tem custo (se usar OpenAI). O sistema tende a reaproveitá-los; evite regenerar toda a base sem necessidade.

BigQuery Quotas: Evite rodar queries massivas sem cache repetidamente durante o desenvolvimento para não estourar a cota gratuita ou gerar custos excessivos no GCP.

Segurança: Nunca comite o arquivo .env ou chaves JSON de credenciais no Git.

8. Pipeline CI/CD (GitHub Actions)

O arquivo .github/workflows/deploy.yml atua como Verificação de Integração (CI):

Gatilho: Pull Requests e Push na branch features.

Job: Instala Node.js v18, dependências (npm ci) e roda o build do Front-end.

Objetivo: Garantir que o código do front-end está compilável antes do merge.
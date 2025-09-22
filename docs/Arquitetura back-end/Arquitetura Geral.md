# 🏗 Arquitetura em Camadas – Node.js + Next.js

## 1. Camada de Apresentação (Frontend – Next.js)
- **Tecnologia**: Next.js.
- **Funções**:
  - Interface do usuário para exploração dos dados do censo.
  - Dashboard interativo (gráficos e tabelas).
  - Interface conversacional (chat) para interagir com o RAG.
  - Autenticação de usuários (caso necessário).
  - Consumo da API do backend via REST/GraphQL.

---

## 2. Camada de Aplicação (Backend – Node.js/Express/Fastify)
- **Tecnologia**: Node.js com Express ou Fastify.
- **Funções**:
  - Orquestrar a lógica de negócio.
  - Expor endpoints REST/GraphQL para o frontend.
  - Conectar serviços de **busca vetorial** (para RAG).
  - Middleware para autenticação, autorização e auditoria.

---

## 3. Camada de Serviço (Business Logic)
- **Funções**:
  - Processamento dos microdados do Censo Escolar.
  - Enriquecimento dos metadados (normalização, categorização).
  - Implementação de consultas complexas e filtros.
  - Conexão com os serviços de IA (RAG).
  - Cache de resultados frequentes.

---

## 4. Camada de Integração (RAG e Serviços Externos)
- **Serviços**:
  - **RAG Pipeline**:
    1. **Indexação**: dividir dados do censo em chunks, enriquecer com embeddings.
    2. **Armazenamento Vetorial**: Pinecone, Weaviate, Milvus ou PostgreSQL + pgvector.
    3. **Busca híbrida**: semântica (vetorial) + keyword.
    4. **LLM**: OpenAI GPT, Anthropic Claude ou Llama 3 para geração de respostas.
  - **APIs externas**: dados adicionais do MEC/INEP.

---

## 5. Camada de Dados
- **Banco de Dados Relacional**: PostgreSQL (armazenamento estruturado dos microdados).
- **Banco de Dados Vetorial**: pgvector (no PostgreSQL) ou Pinecone/Milvus

---

## 6. Camada de Infraestrutura
- **Hospedagem**: Vercel (frontend) + Railway/Render/AWS (backend).
- **Monitoramento**: Grafana + Prometheus ou ferramentas SaaS.
- **CI/CD**: GitHub Actions para testes e deploy.

---

## 🔗 Fluxo de Dados
1. Usuário acessa o **Next.js** (UI).
2. UI chama a API no **Node.js**.
3. API consulta:
   - PostgreSQL (dados tabulares).
   - VetorDB (para busca semântica no RAG).
4. Serviço de RAG envia contexto relevante para o **LLM**.
5. LLM gera resposta + dados de apoio.
6. API retorna ao frontend.
7. Frontend renderiza no **dashboard** ou **chatbot**.

---

# 📊 Diagrama da Arquitetura em Camadas

```mermaid
flowchart TD

%% Camada de Apresentação
A[Frontend - Next.js] -->|REST/GraphQL| B[API Layer - Node.js]

%% Camada de Aplicação
B --> C[Business Services]

%% Camada de Integração
C --> D[RAG Pipeline]
D --> D1[Indexação & Embeddings]
D --> D2[VetorDB - pgvector / Pinecone / Milvus]
D --> D3[Busca Híbrida]
D --> D4[LLM Provider - GPT / Claude / Llama]

%% Camada de Dados
C --> E[(PostgreSQL)]

%% Camada de Infraestrutura
subgraph Infra[Infraestrutura]
  G[Hospedagem: Vercel, AWS, Railway]
  H[CI/CD: GitHub Actions]
  I[Monitoramento: Grafana/Prometheus]
end

A --- Infra
B --- Infra


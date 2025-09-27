# 🏗 Arquitetura em Camadas – Node.js + Next.js + BigQuery

## 1. Camada de Apresentação (Frontend – Next.js)
- **Tecnologia**: Next.js
- **Funções**:
  - Interface do usuário (dashboards, tabelas, chat).  
  - Integração com a API do backend.  
  - Visualização de análises do BigQuery em tempo real.  
  - Chat interativo para consultas em linguagem natural (via RAG).  

---

## 2. Camada de Aplicação (Backend – Node.js)
- **Tecnologia**: Node.js (Express ou Fastify).  
- **Funções**:
  - Orquestrar consultas e lógica de negócio.  
  - Expor APIs REST/GraphQL para o frontend.  
  - Conectar diretamente ao **BigQuery** para consultas analíticas.  
  - Intermediar chamadas ao **RAG Pipeline**.  

---

## 3. Camada de Serviço (Business Services)
- **Funções**:
  - Implementação das regras de negócio.  
  - Definição de consultas ao **BigQuery** (SQL analítico).  
  - Otimização e cache de queries frequentes.  
  - Conexão com o **pipeline de RAG** (quando necessário).  

---

## 4. Camada de Integração (RAG e IA)
- **Componentes**:
  - **Indexação e embeddings** dos microdados ou metadados.  
  - **Armazenamento Vetorial**: Pinecone, Weaviate ou Milvus.  
  - **Busca híbrida**: semântica + filtros tabulares vindos do BigQuery.  
  - **LLM Provider**: GPT, Claude ou Llama para geração de respostas.  

---

## 5. Camada de Dados
- **BigQuery (Data Warehouse)**  
  - Fonte única de dados tabulares e históricos.  
  - Responsável por consultas analíticas massivas.  
  - Armazena tanto microdados brutos quanto tabelas processadas.  

- **Data Lake (CSV/Parquet no GCS)**  
  - Armazena arquivos originais do Censo Escolar.  
  - Alimenta o BigQuery.  

- **Banco Vetorial (VectorDB)**  
  - Para embeddings usados no RAG.  
  - Conectado ao backend para buscas semânticas.  

---

## 6. Camada de Infraestrutura
- **Hospedagem**: Vercel (frontend) + Railway/Azure/AWS (backend).  
- **CI/CD**: GitHub Actions ou Cloud Build.  
- **Monitoramento**: Grafana, Prometheus ou Stackdriver (GCP).    

---

## 🔗 Fluxo Resumido
1. Usuário acessa o **Next.js**.  
2. A interface chama o **backend em Node.js**.  
3. O backend consulta diretamente o **BigQuery** para dados estruturados.  
4. Se for consulta em linguagem natural, o backend aciona o **RAG Pipeline**:
   - Recupera contexto do **BigQuery** (estatísticas, tabelas).  
   - Combina com informações semânticas do **VectorDB**.  
   - Envia ao **LLM** para gerar a resposta.  
5. O resultado retorna ao **frontend** (dashboard ou chat).  

---

## 📊 Diagrama Simplificado

```mermaid
flowchart TD

%% Camada de Apresentação
A[Frontend - Next.js] -->|REST/GraphQL| B[API Layer - Node.js]

%% Camada de Aplicação
B --> C[Business Services]

%% Camada de Integração
C --> D[RAG Pipeline]
D --> D1[Indexação & Embeddings]
D --> D2[VectorDB - Pinecone / Weaviate / Milvus]
D --> D3[LLM Provider - GPT / Claude / Llama]

%% Camada de Dados
C --> E[(BigQuery - Data Warehouse)]
E --> F[(Data Lake - CSV/Parquet)]

%% Camada de Infraestrutura
subgraph Infra[Infraestrutura]
  H[Hospedagem: Vercel, Azure, AWS]
  I[CI/CD: GitHub Actions / Cloud Build]
  J[Monitoramento: Grafana / Stackdriver]
end

A --- Infra
B --- Infra

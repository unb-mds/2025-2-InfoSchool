# 📘 Retrieval-Augmented Generation (RAG)

## 🔎 O que é RAG?
O **Retrieval-Augmented Generation (RAG)** é uma abordagem de **Inteligência Artificial** que combina dois componentes principais:

1. **Modelos de Recuperação de Informação (Retriever)** – responsáveis por buscar dados relevantes em coleções externas (documentos, bases de conhecimento, APIs etc.).  
2. **Modelos de Geração de Linguagem (Generator/LLM)** – responsáveis por interpretar o prompt do usuário e **produzir uma resposta natural**, utilizando tanto o conhecimento do próprio modelo quanto os documentos recuperados.  

👉 Em resumo, o RAG permite que os **LLMs (Large Language Models)** sejam **alimentados dinamicamente** com informações externas e atualizadas, em vez de dependerem apenas do que aprenderam no treinamento.

---

## 🧩 Funcionamento do RAG

O processo pode ser dividido em **quatro etapas principais**:

### 1. Entrada do Usuário (Prompt)
- O usuário faz uma pergunta ou fornece um comando.  
- Exemplo: *“Quais foram os indicadores de evasão escolar no último Censo Escolar?”*

---

### 2. Recuperação de Contexto (Retriever)
- O texto do usuário é convertido em **vetores** (representações matemáticas via embeddings).  
- Esses vetores são comparados com vetores de documentos em uma **base de conhecimento vetorial** (Vector Database).  
- O sistema retorna os documentos mais semelhantes/relevantes ao prompt.  
- Exemplos de ferramentas: **FAISS, Pinecone, Milvus, Weaviate**.

---

### 3. Geração Aumentada (Generator/LLM)
- O **modelo de linguagem** (como GPT, LLaMA, Mistral etc.) recebe o prompt do usuário **junto com os documentos recuperados**.  
- Ele processa essa informação e gera uma resposta coerente, fundamentada nos dados buscados.  

---

### 4. Resposta Final
- O usuário recebe uma resposta **mais precisa, contextualizada e confiável**, já que o modelo consultou dados externos em tempo real.  

---

## 🏗️ Arquitetura do RAG

Fluxo simplificado:  

    U[Usuário] --> P[Prompt]
    P --> E[Conversor de Embeddings]
    E --> V[Banco de Vetores]
    V --> D[Documentos Relevantes]
    D --> L[LLM + Documentos Recuperados]
    L --> R[Resposta Final]

---

# Por que usar RAG?
- **Atualização contínua do conhecimento:** dados podem ser atualizados na base sem re-treinar o LLM.  
- **Redução de *hallucinations*:** fornecer evidências textuais torna as respostas mais verificáveis.  
- **Custos:** permite usar LLMs menores ou menos chamadas se a informação estiver externa.  
- **Governança / Compliance:** é possível restringir respostas a fontes autorizadas e registrar proveniência.

---
## ✅ Vantagens do RAG
  
- **Domínios especializados** → possível adicionar documentos de áreas específicas (jurídico, médico, educacional etc.).  
- **Maior confiabilidade** → reduz alucinações, já que o modelo consulta fatos externos.  
- **Customização** → diferentes bases de dados podem ser conectadas conforme a necessidade.  
- **Escalabilidade** → pode crescer junto com o volume de dados sem precisar re-treinar o modelo.  

---

## 🚧 Desafios e Limitações

- **Qualidade dos dados recuperados**: se a base tiver informações erradas, o modelo pode gerar respostas incorretas.  
- **Latência**: buscar em grandes volumes de dados pode tornar as respostas mais lentas.  
- **Integração técnica**: requer infraestrutura para embeddings, indexação e orquestração entre Retriever e Generator.  
- **Dependência do LLM**: mesmo com dados corretos, o modelo pode interpretar de forma equivocada.  
- **Custo operacional**: manter bases atualizadas e otimizadas pode gerar custos altos.  

---

## 🌍 Casos de Uso do RAG

1. **Chatbots empresariais**  
   - Atendimento ao cliente com base em FAQs e documentos internos.  

2. **Educação**  
   - Assistentes que consultam bases de dados educacionais e censos escolares.  

3. **Saúde**  
   - Suporte a profissionais médicos com informações científicas atualizadas.  

4. **Pesquisa acadêmica**  
   - Busca e síntese de artigos em tempo real.  

5. **Governança e Dados Públicos**  
   - Análise e exploração de **microdados de censos** ou relatórios governamentais.  

---

## 🛠️ Ferramentas e Tecnologias usadas em RAG

- **LLMs (Generator)** → GPT, LLaMA, Mistral, Falcon etc.  
- **Vector Databases (Retriever)** → FAISS, Pinecone, Milvus, Weaviate.  
- **Frameworks de Orquestração** → LangChain, LlamaIndex, Haystack.  
- **Embeddings** → OpenAI Embeddings, SentenceTransformers, Cohere, HuggingFace.  

---

## Fluxo de requisição (end-to-end)

1. **User → API:** query + contexto do usuário  
2. **Query processing:** normalização e expansão da consulta  
3. **Embedding:** gerar embedding da query  
4. **ANN Search:** busca top-N no Vector DB  
5. **Rerank / Filter:** reordenação e filtragem  
6. **Context selection:** selecionar passagens mais relevantes  
7. **Prompt construction:** montagem do prompt  
8. **LLM call:** geração da resposta  
9. **Post-process:** citações, fact-checking, anonimização  
10. **Return + Log:** resposta final e métricas  

---

## Como implementar — passo a passo

- [ ] **PoC inicial:** corpus pequeno + FAISS + embeddings + LLM  
- [ ] **Ingestão & Chunking:** tamanho ideal 500–1000 tokens com overlap  
- [ ] **Embeddings:** escolher modelo conforme custo/latência  
- [ ] **Vector DB:** FAISS (PoC) ou Pinecone/Qdrant/Milvus (produção)  
- [ ] **Retriever & Hybrid Search:** combinação lexical + semântica  
- [ ] **Prompting & Context Window:** controle de tokens + citações  
- [ ] **LLM (Generator):** API externa ou self-hosted  
- [ ] **Grounding & Provenance:** sempre mostrar fontes  
- [ ] **Observability & Feedback:** métricas e pipeline de atualização  

---

## Boas práticas

- Chunking inteligente (não cortar listas/tabelas)  
- Uso de metadados para filtragem  
- Hybrid search para consultas factuais  
- Limite de tokens bem administrado  
- Fact-checking com modelos auxiliares  
- Logs e auditoria para compliance  
- Otimização de custo e latência com cache e batch  

---

## Métricas essenciais

- **Precision@k / Recall@k**  
- **MRR (Mean Reciprocal Rank)**  
- **Factuality / Hallucination rate**  
- **Latency end-to-end**  
- **Coverage / Freshness**  

---

## Exemplo de stack sugerido

- **UI:** Next.js / React  
- **API:** FastAPI / Node.js  
- **Embeddings:** OpenAI / SentenceTransformers  
- **Vector DB:** Pinecone / Qdrant / Milvus  
- **Retriever:** LangChain / LlamaIndex / Haystack  
- **LLM:** OpenAI, Anthropic, LlamaX, Mistral  
- **Infra:** Docker + Kubernetes, Redis (cache)  
- **Monitoring:** Prometheus + Grafana, ELK  

---

## Checklist de implantação

- [ ] Pipeline de ingestão automatizado  
- [ ] Testes de embeddings (nearest neighbors sanity)  
- [ ] Políticas de segurança aplicadas  
- [ ] Reindexação incremental com versionamento  
- [ ] Feedback humano para correções  
- [ ] SLA para latência + fallback configurado  
- [ ] Plano de rollback do index  

---

# 🔑 APIs para cada etapa do RAG

## 1. LLM (Geração)
Responsável por interpretar a consulta e gerar a resposta final.

- **OpenAI API** → GPT-4.1, GPT-4o, GPT-5 (quando disponível)
- **Anthropic Claude API** → Claude 3.x
- **Cohere Generate API** → modelos otimizados para chat
- **Google Gemini API** → modelos multimodais
- **Mistral API** → modelos abertos (ex.: Mixtral)

---

## 2. Embeddings (Vetorização)
Convertem textos em vetores numéricos para busca semântica.

- **OpenAI Embeddings API** → `text-embedding-3-small` / `text-embedding-3-large`
- **Cohere Embed API** → `embed-multilingual-v3.0`
- **Hugging Face Inference API** → diversos modelos de embeddings
- **Voyage AI** → embeddings especializados em busca factual

---

## 3. Vector Database (Armazenamento e Busca)
Guarda os vetores e executa a recuperação.

- **Pinecone** → Vector DB SaaS
- **Weaviate** → API GraphQL / REST
- **Milvus / Zilliz Cloud** → escalável para bilhões de vetores
- **Qdrant** → open source com API REST / gRPC
- **Elasticsearch / OpenSearch** → busca textual + vetorial consolidada

---

## 4. Orquestração (opcional, mas recomendado)
Facilita integrar **LLM + embeddings + retrievers + prompts**.

- **LangChain (Python/JS)** → abstrações para RAG
- **LlamaIndex** → conectar a diversas fontes de dados
- **Haystack** → framework para pipelines RAG

---

# 🔗 Fluxo Simplificado de APIs

1. **Usuário** → query
2. **Embeddings API** → transforma query em vetor
3. **Vector DB API** → busca documentos relevantes
4. **LLM API** → gera resposta usando contexto recuperado
5. **Entrega ao usuário**

---

# ⚖️ Dicas de escolha

| Objetivo | Recomendação |
|----------|--------------|
| **Prototipar rápido** | OpenAI + Pinecone + LangChain |
| **Open source / baixo custo** | Hugging Face + Qdrant/Milvus + Haystack |
| **Multilinguagem (inclui português)** | Cohere + Weaviate |
| **Governança / compliance** | Elasticsearch/OpenSearch + LLM privado |

---

## Referências

1. *Retrieval-Augmented Generation for Knowledge-Intensive NLP Tasks* — Lewis et al.  
2. **LangChain** — documentação conceitual sobre RAG e patterns  
3. **OpenAI** — guia sobre RAG e semantic search  
4. **Microsoft Azure** — overview e padrões RAG  
5. **Tutoriais práticos** (Haystack, LangChain, DigitalOcean)  


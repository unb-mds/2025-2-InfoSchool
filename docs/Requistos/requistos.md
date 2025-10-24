# Censo Escolar InfoSchool - Requisitos

## Visão Geral
O propósito dos requisitos funcionais é definir o que a plataforma Censo Escolar InfoSchool deve oferecer em termos de consulta e análise de dados educacionais do censo escolar brasileiro.

**Prioridade das funcionalidades:**
- 🔴 **P0 (Crítico / MVP)** – funcionalidade essencial para o funcionamento básico.
- 🟠 **P1 (Importante)** – relevante, mas pode ser entregue após o MVP.
- 🟢 **P2 (Desejável)** – incrementos ou funcionalidades complementares.


## Papéis (roles)
> Não haverá login nem cadastro de usuário. Todos os papéis acessam o sistema de forma pública.

- **Estudante:** consulta dados de escolas para pesquisa educacional.
- **Pesquisador:** analisa dados do censo para estudos acadêmicos.
- **Gestor Educacional:** acompanha indicadores para tomada de decisão.
- **Administrador:** papel interno para gerenciar base de dados e atualizações.

---

## Epic: Navegação Geográfica

### US-01 — Seleção de Estado
- **Descrição:** Usuário pode selecionar estado via busca ou lista.
- **Prioridade:** P0 🔴
- **Critérios de Aceitação:**
  - Busca deve funcionar por nome completo ou parcial
  - Lista dropdown deve estar ordenada alfabeticamente
  - Deve ignorar acentos e case sensitivity
- **Endpoint:** `GET /api/estados?search={termo}`

### US-02 — Visualização do Mapa Estadual
- **Descrição:** Ao selecionar estado, sistema exibe mapa com municípios.
- **Prioridade:** P0 🔴
- **Critérios de Aceitação:**
  - Mapa deve carregar em ≤ 2 segundos
  - Municípios devem ser áreas clicáveis
  - Tooltip com nome ao passar mouse
- **Endpoint:** `GET /api/estados/{uf}/mapa`

### US-03 — Seleção de Município
- **Descrição:** Usuário pode selecionar município do mapa ou lista.
- **Prioridade:** P0 🔴
- **Critérios de Aceitação:**
  - Deve mostrar contador de escolas no município
  - Lista alternativa para seleção rápida
- **Endpoint:** `GET /api/estados/{uf}/municipios`

---

## Epic: Busca e Filtros

### US-04 — Pesquisa de Escolas
- **Descrição:** Usuário pode buscar escolas por múltiplos critérios.
- **Prioridade:** P0 🔴
- **Critérios de Aceitação:**
  - Busca por: nome parcial, código INEP, tipo (estadual/municipal/federal)
  - Filtros por: localização, etapa ensino, dependência administrativa
  - Deve funcionar em tempo real (debounce 500ms)
- **Endpoint:** `GET /api/municipios/{id}/escolas?search={termo}&tipo={tipo}`

### US-05 — Listagem de Resultados
- **Descrição:** Sistema exibe lista paginada de escolas encontradas.
- **Prioridade:** P0 🔴
- **Critérios de Aceitação:**
  - Ordenação por: nome, código, quantidade alunos
  - Paginação (20 itens por página)
  - Indicador de total de resultados
- **Endpoint:** `GET /api/escolas?page=1&limit=20&sort=nome`

---

## Epic: Dashboard Escola

### US-06 — Visualização Detalhada da Escola
- **Descrição:** Usuário acessa dashboard completo com dados da escola.
- **Prioridade:** P0 🔴
- **Critérios de Aceitação:**
  - Seção identificação: nome, código INEP, endereço, contato
  - Métricas: alunos, professores, turmas, IDEB
  - Infraestrutura: laboratórios, biblioteca, quadra
- **Endpoint:** `GET /api/escolas/{codigo_inep}`

### US-07 — Análise Temporal
- **Descrição:** Usuário pode alterar ano de análise dos dados.
- **Prioridade:** P1 🟠
- **Critérios de Aceitação:**
  - Seletor de anos (2015-2023)
  - Gráfico de evolução temporal
  - Comparativo entre 2 anos
- **Endpoint:** `GET /api/escolas/{codigo_inep}?ano=2023`

### US-08 — Destaques da Escola
- **Descrição:** Sistema mostra pontos fortes e melhores indicadores.
- **Prioridade:** P1 🟠
- **Critérios de Aceitação:**
  - "Melhor indicador" (ex: IDEB acima da média)
  - "Maior evolução"
  - Comparação com média municipal/estadual

---

## Epic: Exportação e Relatórios

### US-09 — Exportação PDF
- **Descrição:** Usuário pode exportar relatório completo em PDF.
- **Prioridade:** P1 🟠
- **Critérios de Aceitação:**
  - Layout formatado com logo e dados organizados
  - Incluir todos os indicadores e métricas
  - Opção de tema claro/escuro no PDF
- **Endpoint:** `POST /api/escolas/{codigo_inep}/export-pdf`

### US-10 — Exportação Excel
- **Descrição:** Usuário pode exportar dados brutos em Excel/CSV.
- **Prioridade:** P1 🟠
- **Critérios de Aceitação:**
  - Dados tabulares completos
  - Formatação para análise
  - Múltiplas abas por categorias
- **Endpoint:** `POST /api/escolas/{codigo_inep}/export-excel`

---

## Epic: Sistema de Rankings

### US-11 — Página de Rankings
- **Descrição:** Usuário pode visualizar rankings comparativos.
- **Prioridade:** P2 🟢
- **Critérios de Aceitação:**
  - Rankings por: IDEB, infraestrutura, tamanho
  - Filtros por estado/município/tipo
  - Top 10 por categoria
- **Endpoint:** `GET /api/rankings?categoria=ideb&uf=sp`

---

## Epic: IA e Busca Inteligente

### US-12 — Chatbot de Consultas
- **Descrição:** Sistema de IA para perguntas complexas sobre dados.
- **Prioridade:** P2 🟢
- **Critérios de Aceitação:**
  - Página dedicada "/chat"
  - Perguntas como: "Escolas com melhor infraestrutura em SP"
  - Citar fontes dos dados
- **Endpoint:** `POST /api/chat` - `{ message: string }`

---

## Epic: Interface e Usabilidade

### US-13 — Tema Claro/Escuro
- **Descrição:** Usuário pode alternar entre temas de interface.
- **Prioridade:** P1 🟠
- **Critérios de Aceitação:**
  - Toggle no header
  - Persistência da preferência
  - Aplicar a todas as páginas
  - Seguir prefers-color-scheme do sistema

### US-14 — Navegação Responsiva
- **Descrição:** Interface funciona em desktop e mobile.
- **Prioridade:** P0 🔴
- **Critérios de Aceitação:**
  - Navbar responsiva com breadcrumb
  - Mobile-first design
  - Gestos touch no mapa

---

## Epic: Dados e ETL

### US-15 — ETL Censo Escolar
- **Descrição:** Coletar, transformar e carregar dados do censo escolar.
- **Prioridade:** P0 🔴
- **Estrutura Escola:**
```bash
Escolas {
  id: UUID PK
  codigo_inep: string UNIQUE
  nome: string
  endereco: string
  municipio: string FK
  uf: string FK
  tipo: enum(ESTADUAL, MUNICIPAL, FEDERAL, PRIVADA)
  ideb: decimal
  total_alunos: integer
  total_professores: integer
  infraestrutura: JSON
  contato: JSON
  anos: JSON // dados históricos
}

```


### US-16 — Atualização Anual
- **Descrição:** Sistema para incorporar novos dados do censo escolar.
- **Prioridade:** P1 🟠
- **Critérios de Aceitação:**
  - Processo automatizado de importação
  - Validação de integridade
  - Manter histórico de anos anteriores

---

## Requisitos Não Funcionais

1. **Usabilidade**
   - Interface simples e intuitiva, curva de aprendizado ≤ 5 minutos
   - Design responsivo (mobile-first)
   - Navegação por breadcrumb e histórico
   - Temas claro/escuro com transição suave

2. **Desempenho**
   - Carregamento mapa: ≤ 2 segundos
   - Busca escolas: ≤ 3 segundos
   - API responses: ≤ 500ms para endpoints críticos
   - Cache de dados estáticos por 24h

3. **Segurança**
   - HTTPS obrigatório
   - Rate limiting: 1000 requisições/minuto por IP
   - Dados anonimizados para consulta pública
   - Proteção contra XSS e SQL injection

4. **Confiabilidade**
   - Disponibilidade: 99.5% SLA
   - Backup automático semanal da base
   - Fallback graceful para serviços externos

5. **Escalabilidade**
   - Arquitetura para 10.000 usuários concorrentes
   - Auto-scaling baseado em carga
   - Microsserviços independentes

6. **Manutenibilidade**
   - Código modular e documentado
   - Docker para ambientes
   - Test coverage: ≥ 80% código crítico
   - Logs estruturados para monitoramento

---

## Conclusão
Este documento estabelece a base funcional do **Censo Escolar InfoSchool**, priorizando as funcionalidades essenciais para o MVP (P0) enquanto define o roadmap para evolução da plataforma.

**Observação:**  
🔖 Para detalhes visuais e fluxos completos, consulte os Protótipos no Figma:  
(https://www.figma.com/board/feNX4bnc1LbmuZ9Rp4j8QI/Template-MDS---group-11?node-id=0-1&t=UwFkLH0dnM3yZC7V-1)


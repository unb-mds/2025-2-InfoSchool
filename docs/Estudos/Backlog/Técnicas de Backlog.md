📄 Estudo de Criação e Priorização de Backlog
📌 Definição de Backlog e seus Componentes

O Product Backlog é uma lista priorizada de tudo que precisa ser feito em um produto. Ele é dinâmico, ou seja, muda conforme novas necessidades surgem.
Componentes principais:

Épicos → grandes funcionalidades ou temas (ex.: “Sistema de Login”).

User Stories → funcionalidades menores, escritas do ponto de vista do usuário (ex.: “Como usuário, quero redefinir minha senha para recuperar acesso”).

Tarefas/Subtarefas → desdobramento técnico das User Stories (ex.: criar endpoint de recuperação de senha).

Bugs → correções necessárias.

Spikes → atividades de pesquisa/estudo para reduzir incertezas.

📌 Técnicas de Priorização
🔹 1. MoSCoW

Método que classifica as histórias de acordo com a importância:

Must Have (Obrigatório) → essenciais para o produto funcionar.

Should Have (Importante) → relevantes, mas não bloqueiam o funcionamento inicial.

Could Have (Desejável) → agregam valor, mas podem ser adiadas.

Won’t Have (Não será feito agora) → decidido que não entra no escopo atual.

Exemplo prático:

Must Have: “Login com e-mail e senha.”

Should Have: “Login via Google.”

Could Have: “Login via Facebook.”

Won’t Have: “Login via Apple ID (por enquanto).”

🔹 2. Value vs Effort

Gráfico que cruza Valor de Negócio (impacto) com Esforço (complexidade/custo).
Ajuda a visualizar onde investir primeiro.

Quadrantes típicos:

Alto valor, baixo esforço → priorizar imediatamente.

Alto valor, alto esforço → planejar bem.

Baixo valor, baixo esforço → fazer se sobrar tempo.

Baixo valor, alto esforço → evitar.

Exemplo:

“Login com e-mail” → Alto valor, baixo esforço → prioridade alta.

“Gamificação de login (níveis de acesso)” → Baixo valor, alto esforço → não priorizar.

📌 Exemplo Prático de Backlog Fictício
Épico: Gerenciamento de Conta do Usuário

User Stories:

<img width="1536" height="1024" alt="Image" src="https://github.com/user-attachments/assets/68729796-a649-4cc3-ab6e-a72bf605ff05" />

[Must Have]
Como usuário, quero criar uma conta com e-mail e senha para acessar a plataforma.

Valor: 5/5

Esforço: 2/5

[Must Have]
Como usuário, quero redefinir minha senha para recuperar acesso quando esquecida.

Valor: 5/5

Esforço: 3/5

[Should Have]
Como usuário, quero fazer login usando minha conta do Google para maior praticidade.

Valor: 4/5

Esforço: 3/5

[Could Have]
Como usuário, quero escolher uma foto de perfil personalizada para diferenciar minha conta.

Valor: 3/5

Esforço: 2/5

[Won’t Have (agora)]
Como usuário, quero vincular várias contas de redes sociais ao meu perfil para unificar acessos.

Valor: 2/5

Esforço: 4/5

➡️ Priorização final usando MoSCoW + Value vs Effort:

Criar conta com e-mail e senha (Must Have, alto valor/baixo esforço).

Redefinição de senha (Must Have, alto valor).

Login via Google (Should Have, valor médio-alto).

Foto de perfil personalizada (Could Have).

Vincular várias redes sociais (Won’t Have)

📍 Recursos Adicionais

1. Scrum.org – Técnicas de Priorização para o Product Owner
    👉 [Link](https://www.scrum.org/resources/blog/prioritization-techniques-product-owner)

📌 Explica diferentes técnicas de priorização do backlog, incluindo MoSCoW, mostrando como um Product Owner pode usar esse método para classificar o que é mais importante entregar primeiro.

2. Atlassian – Backlogs no Scrum
   👉 [Link](https://www.atlassian.com/agile/scrum/backlogs)

📌 Define o que é um Product Backlog e como ele deve ser organizado (épicos, histórias, tarefas). Dá dicas práticas de manutenção e de como priorizar para que não se torne apenas uma lista desordenada de coisas a fazer.

3. Atlassian – 6 Frameworks de Priorização de Produto (+ Como Escolher)
👉 [Link](https://www.atlassian.com/agile/product-management/prioritization-framework)

📌 Apresenta seis técnicas de priorização, entre elas o MoSCoW e a Matriz Valor vs Esforço (Value vs Effort), mostrando prós e contras de cada método.

4. Atlassian – Descoberta de Produto (Product Discovery)
👉 [Link](https://www.atlassian.com/agile/product-management/discovery)

📌 Aborda como identificar e validar ideias antes de colocá-las no backlog. Menciona frameworks de priorização como RICE, Value/Effort e outros, ajudando a definir o que realmente deve ser desenvolvido.

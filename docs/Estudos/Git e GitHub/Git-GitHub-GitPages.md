# Git e GitHub

Esta documentação resume as etapas e conceitos abordados na preparação e colaboração do projeto. O objetivo é que todos os membros da equipe compreendam o fluxo de trabalho para gerenciar o código de forma eficiente e segura.

---

## Git vs GitHub:
**- Git** é um sistema de controle de versão que rastreia alterações no código localmente.
**- GitHub** é uma  plataforma online que usa o Git para hospedar repositórios, facilitando o compartilhamento e a colaboração.
  
### 1. Configuração Inicial do Projeto

Primeiramente, devemos baixar o Git, acesso em https://git-scm.com/downloads. Como estamos todos no Ubuntu, basta apenas executar a seguinte linha de código no terminal 

```
sudo apt-get install git
```

### 1.1 Passos Iniciais:

- **Crie uma conta no GitHub:** Acesse `github.com` e preencha as informações de usuário, e-mail e senha. Aconselha-se a escolher um usuário e-mail profissionais, pois serão visíveis para outros desenvolvedores e empresas.
- **Criar um novo repositório:**
    - Na sua página inicial do GitHub, vá para a aba **"Repositories"**.
    - Clique no botão verde **"New"**.
    - **Nome do repositório:** Escolha um nome claro e relacionado ao projeto.
    - **Descrição:** Adicione uma breve descrição para explicar o que o projeto faz.
    - **Visibilidade:** Mantenha o repositório como **"Public"** para que o portfólio seja visível para todos.
    - **Adicionar README:** Inicie o repositório com um arquivo `README.md`, que pode ser editado posteriormente para incluir uma documentação mais detalhada do projeto.
    
-  **Criar um repositório remoto**
    - No terminal, digite o seguinte comando para a criação do repositório remoto
   
```
git init
```

- **Conexão do repositório local com o remoto**
     - Digite o comando

```
git remote add origin URL_do_repositório
```

### 2. Fluxo de Trabalho Git Essencial

O envio de arquivos para o GitHub segue um fluxo de três etapas:

- **Sincronização (`git pull origin main`):** Para manter o repositório local atualizado com as alterações feitas por outros colaboradores, é essencial usar o comando `git pull`. Ele busca e baixa as mudanças do repositório remoto.

1. **Adicionar arquivos (`git add .`):** Seleciona todos os arquivos alterados ou novos para serem incluídos no próximo registro (commit).
2. **Registrar alterações (`git commit -m "Mensagem"`):** Cria um ponto de registro no histórico local do projeto com uma descrição clara das mudanças.
3. **Enviar para o GitHub (`git push origin main`):** Sincroniza o repositório local com o repositório remoto no GitHub, enviando todas as alterações registradas.


---

### 3. Gerenciamento com Branches

**Branches** (ou ramificações) são linhas de desenvolvimento isoladas. Elas permitem que se trabalhe em novas funcionalidades ou correções sem afetar o código principal.

<img width="940" height="430" alt="Image" src="https://github.com/user-attachments/assets/0aef3862-6c8c-441d-a205-738d4c6ce4c6" />

- **Fluxo de trabalho com Branches:**
    1. **Criar e mudar de branch (`git checkout -b <nome_da_branch>`):** Cria uma nova ramificação e muda para ela.
    2. **Realizar alterações:** O desenvolvimento da funcionalidade é feito na nova branch.
    3. **Enviar a branch para o GitHub (`git push origin <nome_da_branch>`):** Compartilha o trabalho da nova branch com a equipe.
    4. **Mesclar branches (`git merge <nome_da_branch>`):** Após a conclusão, as alterações são integradas à branch principal (`main`). Para fazer isso, é necessário estar na branch de destino (`main`).
    5. **Excluir a branch (`git branch -D <nome_da_branch>`):** É uma boa prática deletar as branches após a mesclagem, tanto localmente quanto no GitHub.
- **Modelos de Desenvolvimento:**
    - **GitFlow (Vamos utilizar essa):** Usado em projetos grandes, com branches dedicadas para features, releases, hotfixes e desenvolvimento (`main` e `develop`).

<img width="973" height="871" alt="Image" src="https://github.com/user-attachments/assets/ee222da3-c747-4b34-b82e-36716d1410b8" />

- **Trunk Based:** Foca em uma única branch principal (`main`), com branches de curta duração. Indicado para equipes menores e projetos com testes robustos.


<img width="1280" height="400" alt="Image" src="https://github.com/user-attachments/assets/57a80ac4-3016-4cf9-a0bc-c07990ca5e79" />

---

### 4. Resolução de Conflitos

Conflitos ocorrem quando duas pessoas alteram a mesma parte de um arquivo simultaneamente.

- **Como resolver:**
    1. O **Git** sinaliza o conflito durante o `git pull` ou `git merge`.
    2. O VS Code destaca o trecho de código conflitante com marcadores (`<<<<<<< HEAD`, `=======`, `>>>>>>>`).
    3. O desenvolvedor precisa decidir qual alteração manter ou mesclar manualmente, removendo os marcadores de conflito.
    4. Após a resolução, um novo `commit` de mesclagem é feito para registrar a solução.
    
<img width="842" height="508" alt="Image" src="https://github.com/user-attachments/assets/fd640162-bc49-47cd-a53d-c0d0d682b3d8" />

---

### 5. Issues e Pull Requests no GitHub

Essas ferramentas são essenciais para organizar o trabalho em equipe.

- **Issues:**
    - Funcionam como tarefas ou problemas a serem resolvidos (como por exemplo esta issue que estamos).
    - Permitem documentar, descrever e atribuir responsabilidades para cada atividade.
    - Podem ser associadas a **Labels** para categorizar o tipo de trabalho (ex: `modificação`, `bug`).
- **Pull Requests (PRs):**
    - São solicitações para mesclar o código de uma branch secundária para a branch principal.
    - Permitem que o código seja revisado por outros membros da equipe antes de ser integrado.
    - É possível vincular um Pull Request a uma Issue usando a palavra-chave `fix #<ID_da_issue>`, o que fecha a issue automaticamente após o merge.

---

### 6. Automação e Segurança com GitHub Actions

O GitHub oferece ferramentas para automatizar tarefas repetitivas e garantir a segurança do projeto.

- **Integração Contínua (CI):**
    - Configura um `workflow` com o **GitHub Actions** para rodar testes automaticamente em cada **Pull Request** (`.github/workflows/workflow-ci.yml`).
    - Isso garante que nenhuma alteração seja mesclada na `main` se os testes falharem, mantendo o código estável.
- **Proteção de Branch (`main`):**
    - Uma regra de proteção foi adicionada na branch `main` (`Settings > Branches`).
    - Agora, todo o código que for para lá deve passar por um Pull Request, garantindo que o fluxo de revisão e testes seja seguido.
- **Dependabot (Segurança e Atualizações):**
    - **Dependabot Alerts:** Ativado para monitorar vulnerabilidades de segurança nas dependências do projeto.
    - **Dependabot Security Updates:** Configurado para criar Pull Requests automaticamente para corrigir vulnerabilidades, facilitando o processo de correção.
    - **Dependabot Version Updates:** Configurado para abrir Pull Requests semanais, mantendo as dependências sempre atualizadas para as versões mais recentes.

---


## Publicando um Projeto Web com GitHub Pages

Esta documentação explica o processo de como colocar um projeto web no ar usando o **GitHub Pages**, uma ferramenta gratuita do GitHub.

---

### 1. Adicionando os Arquivos ao Repositório

Após a criação do repositório, é preciso carregar os arquivos do projeto para o GitHub. Isso pode ser feito diretamente pela interface web.

** Já ensinei anteriormente **

---

### 2. Configurando o GitHub Pages

Com os arquivos no repositório, é preciso configurar o serviço para que o site possa ser visualizado.

- **Configuração:**
    - No menu superior do repositório, clique em **"Settings"**.
    - No menu lateral esquerdo, navegue até a opção **"Pages"**.
    - Em **"Build and deployment"**, selecione a **"Source"** (fonte) como `main`.
    - Clique em **"Save"** para publicar o site.

---

### 4. Resolvendo o Problema de Conexão entre Arquivos

O site já está publicado, mas ainda pode não funcionar corretamente. Isso ocorre porque o arquivo HTML precisa se conectar aos arquivos CSS e JavaScript.

- **Como conectar os arquivos:**
    - No GitHub, navegue de volta para o arquivo `index.html`.
    - Clique no ícone de lápis para editar o arquivo.
    - Adicione a tag de link para o CSS dentro da tag `<head>`:HTML
        
```
<link rel="stylesheet" href="style.css">
```
        
- Adicione a tag de script para o JavaScript no final do corpo `<body>`:HTML
        
```
<script src="script.js"></script>
```
        
- **Commit e Verificação:**
    - Confirme a alteração com um **"commit"**.
    - O GitHub Pages irá recarregar o site automaticamente. Após alguns segundos, o site estará funcionando com todas as funcionalidades e estilo.

---

### 5. Acesso ao Site Publicado

O seu site agora está acessível para todos através de um link.

- **Link padrão:** O formato do link será `[seu-usuário].github.io/[nome-do-repositório]`.
    - Exemplo: `FabioVieira05.github.io/nome_do_repositório`
- **Domínio personalizado:** O GitHub Pages permite vincular um domínio personalizado, caso você possua um, como `FabioVieira05.com`.

---

### Links úteis
https://docs.github.com/pt
https://docs.github.com/pt/pages/getting-started-with-github-pages/what-is-github-pages
https://www.youtube.com/watch?v=DqTITcMq68k
https://www.youtube.com/watch?v=UBAX-13g8OM
https://www.youtube.com/watch?v=BU-w2_Aae54

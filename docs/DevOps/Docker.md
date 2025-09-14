# Contêineres e Docker
Esta documentação tem como objetivo fornecer uma visão geral do uso de contêineres e da ferramenta Docker, facilitando o entendimento e a colaboração da equipe.

## 1. O Problema e a Solução
Desafio: Durante o desenvolvimento, o software precisa passar por diversos ambientes (desenvolvimento, testes, produção). Frequentemente, surgem problemas de "pré-requisitos e dependências" onde a aplicação funciona em uma máquina, mas não em outra.

**Solução:** Contêineres. Eles funcionam como "contêineres de transporte" do mundo físico, encapsulando a aplicação e todas as suas dependências em um pacote isolado. Isso garante que a aplicação funcione de forma consistente em qualquer ambiente.

## 2. Conceitos Essenciais do Docker
**Imagem:** Um pacote executável, leve e independente que contém tudo o que é necessário para rodar uma aplicação: código, bibliotecas, ferramentas de sistema, etc. Pense nela como um "modelo" ou "classe".

**Contêiner:** Uma instância em execução de uma imagem. Pense nele como um "objeto" criado a partir da classe (a imagem). É um processo isolado que roda no seu sistema.

**Docker Hub:** Um registro central de imagens Docker. Funciona como um repositório onde você pode encontrar, armazenar e compartilhar imagens públicas ou privadas.

## 3. Comandos Docker Essenciais
Esses são os comandos mais importantes para começar a trabalhar com Docker.

**Imagens**
docker pull <imagem>:<tag>: Baixa uma imagem do Docker Hub para sua máquina local.

docker image ls: Lista todas as imagens baixadas na sua máquina.

docker build -t <nome>:<tag> .: Constrói uma imagem a partir de um Dockerfile. O ponto no final indica o diretório de contexto.

docker push <nome>:<tag>: Envia a imagem para o seu repositório no Docker Hub.

docker tag <imagem_antiga>:<tag_antiga> <imagem_nova>:<tag_nova>: Renomeia uma imagem localmente para prepará-la para o push.

**Contêineres**
docker run <imagem>:<tag>: Cria e executa um novo contêiner a partir de uma imagem.

docker run -it <imagem>:<tag> bash: Inicia um contêiner e te dá acesso interativo ao terminal.

docker run -d <imagem>:<tag>: Executa o contêiner em modo "detached" (em segundo plano).

docker run -p <porta_host>:<porta_container> <imagem>: Mapeia uma porta do seu computador para uma porta do contêiner, permitindo acesso externo.

docker ps: Lista todos os contêineres que estão em execução.

docker ps -a: Lista todos os contêineres (em execução ou parados).

docker stop <id/nome>: Para a execução de um contêiner.

docker start <id/nome>: Inicia um contêiner que está parado.

docker rm <id/nome>: Remove um contêiner.

## 4. Persistência de Dados
Contêineres têm uma existência curta. Para manter os dados após a remoção de um contêiner, usamos mecanismos de persistência.

**Volumes (Recomendado):** Áreas de armazenamento gerenciadas pelo Docker. São a forma preferida e mais segura para persistir dados, pois o Docker gerencia o ciclo de vida e a localização do volume no sistema de arquivos do host.

**Bind Mounts:** Cria um link direto entre um diretório do seu sistema de arquivos (host) e um diretório dentro do contêiner. Útil para desenvolvimento local, mas vulnerável a alterações externas no host.

**Tmpfs:** Armazena dados na memória RAM do host. É ideal para dados sensíveis ou temporários que não precisam ser persistidos, pois são removidos quando o contêiner para.

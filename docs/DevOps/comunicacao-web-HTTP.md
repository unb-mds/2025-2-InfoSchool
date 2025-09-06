# Comunicação web
Esta documentação foi criada para explicar de forma clara e acessível os conceitos de redes e a comunicação em aplicações web.

## 1. Conectando Desenvolvimento e Operações com DevOps
DevOps é uma abordagem que busca unir as equipes de Desenvolvimento e Operações. O objetivo é garantir que uma solução, funcione perfeitamente no computador do desenvolvedor e também  no computador do usuário final. Para isso, a solução é disponibilizada em um servidor, que geralmente utiliza softwares como Nginx ou Apache.

A interação entre o servidor e o computador do usuário (o cliente) é baseada no modelo cliente-servidor. O cliente envia solicitações ao servidor, que por sua vez, atende a essas requisições, permitindo que o usuário acesse páginas e funcionalidades.

<img width="2484" height="1204" alt="Image" src="https://github.com/user-attachments/assets/32f9e6fc-62a1-402e-9429-f084d61ef0bf" />

Fonte: https://materialpublic.imd.ufrn.br/curso/disciplina/3/78/3/2

## 2. O Protocolo HTTP e as Redes de Computadores
A comunicação entre cliente e servidor se dá por meio de protocolos. O principal protocolo da web é o HTTP (Hypertext Transfer Protocol), que atua na camada de aplicação. No entanto, a realidade é um pouco mais complexa, pois a mensagem viaja por uma rede de dispositivos que se comunicam através do modelo TCP/IP, dividido em cinco camadas:

<img width="300" height="300" alt="Image" src="https://github.com/user-attachments/assets/58060c09-bb5d-4663-8054-200d842a7157" />

Fonte: https://www.redesbrasil.com/modelo-tcp-ip-4-ou-5-camadasp/

**Camada de Aplicação:** Onde o HTTP opera. É a camada onde as aplicações do usuário interagem com a rede.

**Camada de Transporte:** O protocolo TCP (Transmission Control Protocol) garante a entrega confiável da mensagem ao destino.

**Camada de Rede:** O protocolo IP (Internet Protocol) atua. Ele adiciona o endereço de origem e de destino à mensagem, permitindo que ela seja roteada corretamente. Cada dispositivo em uma rede tem um endereço IP único.

**Camada de Enlace:** Responsável pela comunicação entre dispositivos em uma mesma rede local.

**Camada Física:** A camada mais baixa, que lida com a transmissão dos dados através de cabos e ondas de rádio.

A internet é uma "rede das redes", permitindo que dispositivos de diferentes redes se comuniquem globalmente.

## 3. URLs, Portas e o Sistema DNS
Para acessar um recurso na web, usamos um endereço chamado URL (Uniform Resource Locator). Uma URL é composta por:

**Protocolo:** (http:// ou https://), indicando o protocolo de comunicação.

**Servidor e Porta:** (localhost:3000), identificando o servidor e a porta de conexão. A porta permite que múltiplos servidores rodem em um único dispositivo.

**Caminho do Recurso:** (/), o caminho para o recurso específico dentro do servidor.

Para traduzir um nome de domínio amigável (google.com.br) para um endereço IP, usamos o DNS (Domain Name System). O DNS é um sistema hierárquico de servidores que mapeia nomes de domínio para endereços IP. Quando você digita um endereço, seu dispositivo consulta um servidor DNS que, por sua vez, pode consultar outros servidores para encontrar o endereço IP correto e direcionar sua requisição.

<img width="1459" height="525" alt="Image" src="https://github.com/user-attachments/assets/0218a8e9-2942-4a3a-b716-4f343fdd3138" />

Fonte: https://www.cloudflare.com/pt-br/learning/dns/glossary/dns-root-server/

## 4. Estrutura e Métodos do HTTP

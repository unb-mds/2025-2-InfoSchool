# 📘 Node.js — Guia Inicial

## 🔎 Visão Geral
Node.js é um *runtime* JavaScript de código aberto, multiplataforma, que executa JS fora do navegador (no servidor, CLIs, scripts).  
Ele combina o motor **V8** (para executar JS com alto desempenho) com a biblioteca **libuv** (para **I/O não bloqueante** e **event loop**), oferecendo uma plataforma rápida e escalável para aplicações com muita entrada/saída (APIs, tempo real, *streaming*).

---

## 🚀 O que é Node.js?
- **Runtime JavaScript** para criar servidores, apps web, CLIs e automações — executa JS fora do navegador.  
- **Baseado no V8**, o motor do Chrome, que compila JS para código nativo em tempo de execução.  
- **Arquitetura orientada a eventos** com **I/O assíncrona**: ideal para lidar com muitas conexões simultâneas sem bloquear a thread principal.

---

## 🛠️ Como e por que foi criado
- **Autor:** Ryan Dahl.  
- **Ano:** 2009, demonstrado no **JSConf EU** (08/11/2009).  
- **Motivação técnica:** criar servidores capazes de lidar com **dezenas de milhares de conexões simultâneas** sem o modelo pesado de *threads*, usando um **event loop** com I/O não bloqueante.  
- **npm:** em **2010** surgiu o **npm**, gerenciador de pacotes oficial do Node.js.  
- **Governança:** após um *fork* em 2014 (**io.js**), a comunidade se reorganizou sob a **Node.js Foundation**, que em 2019 se uniu à **JS Foundation**, formando a **OpenJS Foundation**.

---

## 🏗️ Arquitetura do Node.js

### 1. **V8 (execução do JS)**
Compila e executa JavaScript com otimizações JIT, oferecendo alto desempenho.

### 2. **libuv + Event Loop**
Implementa o **event loop**, *worker threads* internos e abstrações de I/O.  
É a base do modelo assíncrono não bloqueante.

### 3. **Módulos e Ecossistema**
Node traz módulos nativos (HTTP, FS, Path, Crypto etc.) e se integra ao **npm** para pacotes de terceiros.

### 4. **Streams**
Processa dados em fluxo (arquivos, rede) com suporte a **backpressure** para evitar sobrecarga de memória.

### 5. **Add-ons Nativos (C/C++)**
Via **Node-API (N-API)**, permitindo escrever extensões nativas com estabilidade de ABI entre versões.

---

## ⚙️ Características principais
- **I/O não bloqueante** e **orientado a eventos**.  
- **Multiplataforma** (Linux, macOS, Windows).  
- **Ecossistema rico** com npm e módulos *core*.  
- **Streams com backpressure** para dados em tempo real.  
- **Extensibilidade via N-API** para integrar código nativo.  
- **Governança aberta** sob a **OpenJS Foundation**.

---

## 🌟 Vantagens
- **Escalabilidade** para aplicações baseadas em I/O intensivo (APIs, *gateways*, tempo real).  
- **Mesma linguagem no stack** (frontend + backend em JS).  
- **Alta produtividade** graças ao npm e à comunidade ativa.  
- **Baixa latência** em cenários de rede e *streaming*.  
- **Integração com código nativo** quando necessário.

---

## 💡 Casos de uso típicos
- **APIs REST/GraphQL** para web e mobile.  
- **Aplicações em tempo real** (chats, dashboards, colaboração).  
- **Streaming de dados e mídia**.  
- **Gateways/BFF** em microsserviços.

---

## 📅 Linha do tempo essencial
- **2009** — Criação por Ryan Dahl (demo no JSConf EU).  
- **2010** — Lançamento do **npm**.  
- **2014** — *Fork* **io.js**.  
- **2015** — Criação da Node.js Foundation e reunificação.  
- **2019** — Fundação passa a se chamar **OpenJS Foundation**.

---
## ⚙️ Como instalar o Node.js no Linux (Ubuntu)
Acesse esse link e siga o passo a passo:
https://www.alura.com.br/artigos/como-instalar-node-js-windows-linux-macos

## 📚 Referências
1. [Node.js Official Website](https://nodejs.org/)  
2. [Event Loop, Timers and process.nextTick()](https://nodejs.org/en/docs/guides/event-loop-timers-and-nexttick/)  
3. [Node.js Streams API](https://nodejs.org/api/stream.html)  
4. [Node.js C++ Addons & libuv](https://nodejs.org/api/addons.html)  
5. [Node-API (N-API)](https://nodejs.org/api/n-api.html)  
6. [Node.js GitHub — OpenJS Foundation](https://github.com/nodejs/node)  
7. [Wired (2014) — io.js Fork](https://www.wired.com/2014/12/io-js/)  
8. [Wired (2015) — Node.js Foundation](https://www.wired.com/2015/06/nodejs/)  


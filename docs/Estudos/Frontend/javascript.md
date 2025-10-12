# 📘 Estudo sobre JavaScript

## 📜 História do JavaScript
- **1995**: Brendan Eich, trabalhando na Netscape Communications, criou o JavaScript em apenas **10 dias**.  
  - Nome inicial: **Mocha**.  
  - Depois foi chamado de **LiveScript**.  
  - Finalmente recebeu o nome **JavaScript**, como uma estratégia de marketing para aproveitar a popularidade do **Java** na época.
- Apesar do nome, **JavaScript não é Java**. As duas linguagens têm propósitos e estruturas diferentes.
- **1997**: O JavaScript foi padronizado pela **ECMA International** sob o nome **ECMAScript**.  
- **2009**: Com a criação do **Node.js**, o JavaScript passou a ser usado também no **back-end**, permitindo construir servidores e aplicações completas usando apenas uma linguagem.
- Atualmente é uma das linguagens **mais populares do mundo**, presente em navegadores, servidores, aplicações móveis e até IoT.

---

## ⚙️ O que é o JavaScript?
- Linguagem de programação **interpretada** e **dinâmica**.
- Executada em **navegadores** para criar páginas **dinâmicas e interativas**.
- **Multiparadigma**: suporta programação **imperativa, orientada a objetos e funcional**.
- Utilizada tanto no **front-end** (navegadores) quanto no **back-end** (Node.js).
- Evoluiu para um **ecossistema completo**, com bibliotecas e frameworks como:
  - **React, Vue, Angular** (front-end)
  - **Node.js, Express** (back-end)
  - **React Native, Ionic** (mobile)

---

## 🧩 Fundamentos Básicos

### Declaração de Variáveis
```javascript
let nome = "Pedro";   // variável mutável (mais usado atualmente)
const idade = 20;     // constante, não pode ser reatribuída
var cidade = "Brasília"; // forma antiga, menos recomendada
```
---

## Tipos de dados
```javascript
String: "Olá, mundo"

Number: 42, 3.14

Boolean: true / false

Null: valor nulo

Undefined: indefinido

Object: { nome: "Pedro", idade: 20 }

Array: [1, 2, 3, 4]
```

## Operadores
```javascript
let a = 10;
let b = 5;

console.log(a + b); // soma -> 15
console.log(a - b); // subtração -> 5
console.log(a * b); // multiplicação -> 50
console.log(a / b); // divisão -> 2
console.log(a % b); // resto -> 0
```

## 🌐 O DOM (Document Object Model)

## 🔎 O que é o DOM?
O **Document Object Model (DOM)** é uma **representação em forma de árvore** de um documento HTML ou XML.  
Cada elemento da página (como `<div>`, `<p>`, `<img>`, `<button>`) é representado como um **nó (node)** nessa árvore.

 Em outras palavras:  
- O HTML é o **esqueleto** da página.  
- O CSS é a **aparência** (estilo).  
- O JavaScript, através do DOM, é o **cérebro**, que pode **alterar, adicionar ou remover** partes do documento em tempo real.

---

## 🌳 Estrutura em Árvore
Se tivermos o HTML:
```html
<!DOCTYPE html>
<html>
  <head>
    <title>Exemplo DOM</title>
  </head>
  <body>
    <h1 id="titulo">Olá, mundo!</h1>
    <p class="texto">Esse é um parágrafo.</p>
    <button id="botao">Clique aqui</button>
  </body>
</html>
```
O navegador cria a segunte árvore do DOM
```less
Document
 └── html
      ├── head
      │    └── title
      └── body
           ├── h1 (id="titulo")
           ├── p (class="texto")
           └── button (id="botao")
```
## 🎯 Seleção de Elementos

JavaScript pode acessar elementos do DOM usando métodos:
```javascript
// Seleção por ID
const titulo = document.getElementById("titulo");

// Seleção por classe
const paragrafos = document.getElementsByClassName("texto");

// Seleção por tag
const botoes = document.getElementsByTagName("button");

// Seleção mais moderna
const titulo2 = document.querySelector("#titulo");
const paragrafos2 = document.querySelectorAll(".texto");
```
## ✍️ Alterando Conteúdo, Atributos e Estilos
O JavaScript pode interagir com html e o CSS
```javascript
// Mudar o texto
titulo.textContent = "Bem-vindo ao JavaScript!";

// Inserir HTML dentro do elemento
titulo.innerHTML = "<span style='color:blue'>Texto em azul</span>";

// Alterar atributos
const botao = document.getElementById("botao");
botao.setAttribute("disabled", true); // desativa o botão
 
titulo.style.color = "red";
titulo.style.fontSize = "30px";
```
## 🎬 Manipulando Eventos
Com o JavaScript é possível fazer com que o usuário interaja com o site, como:

click → clique do mouse

mouseover → quando o mouse passa sobre o elemento

keydown / keyup → quando o usuário pressiona/libera uma tecla

input → quando o usuário digita em um campo de formulário

change → quando o valor de um campo muda

```javascript
botao.addEventListener("click", () => {
  alert("Você clicou no botão!");
});

document.body.addEventListener("keydown", (event) => {
  console.log("Tecla pressionada: " + event.key);
});
```
# 🔎 Referências
[Documentação oficial do JavaScript (MDN)](https://developer.mozilla.org/pt-BR/docs/Web/JavaScript)
[Curso grátis do JavaScript](https://www.youtube.com/watch?v=1-w1RfGIov4&list=PLHz_AreHm4dlsK3Nr9GVvXCbpQyHQl1o1)
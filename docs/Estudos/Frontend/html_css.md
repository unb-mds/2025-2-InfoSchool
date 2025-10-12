# 📚 Estudo sobre HTML e CSS


## 🖥️ O que é HTML?
O **HTML (HyperText Markup Language)** é a linguagem de marcação usada para estruturar o conteúdo de uma página web.  
Ele organiza o conteúdo em **tags** que indicam a função de cada elemento.

---

## 🏗️ Estrutura básica do HTML
```html
<!DOCTYPE html>
<html lang="pt-BR">
<head>
    <meta charset="UTF-8">
    <meta name="viewport" content="width=device-width, initial-scale=1.0">
    <title>Minha Página</title>
</head>
<body>
    <h1>Olá, mundo!</h1>
    <p>Esse é meu primeiro parágrafo em HTML.</p>
</body>
</html>
```
## 🔖 Principais Tags HTML
```html
- Títulos: <h1> até <h6>

- Parágrafos: <p>

- Links: <a href="url">Texto</a>

- Imagens: <img src="imagem.jpg" alt="descrição">

- Listas:

      - Ordenada: <ol><li>Item</li></ol>

      - Não ordenada: <ul><li>Item</li></ul>

Tabelas:
<table>
    <tr>
        <th>Nome</th>
        <th>Idade</th>
    </tr>
    <tr>
        <td>Pedro</td>
        <td>20</td>
    </tr>
</table>

- Formularios:
<form>
    <label for="nome">Nome:</label>
    <input type="text" id="nome" name="nome">

    <label for="senha">Senha:</label>
    <input type="password" id="senha" name="senha">

    <button type="submit">Enviar</button>
</form>
```
## 📑 HTML Semântico

O HTML5 trouxe tags que dão significado ao conteúdo:
```html
<header> → Cabeçalho

<nav> → Menu de navegação

<main> → Conteúdo principal

<section> → Seção de conteúdo

<article> → Artigo independente

<aside> → Barra lateral

<footer> → Rodapé

```
Isso melhora a acessibilidade e o SEO (otimização para buscadores).

# 🎨 O que é CSS?

O CSS (Cascading Style Sheets) é usado para definir o estilo do HTML, controlando cores, tamanhos, posicionamentos e muito mais.

Exemplo básico:
```css
body {
    background-color: #f0f0f0;
    font-family: Arial, sans-serif;
}

h1 {
    color: blue;
    text-align: center;
}

p {
    font-size: 18px;
    color: #333;
}
```

## 🎯 Seletores CSS
```css
Por tag: p { color: red; }

Por classe: .texto { font-size: 20px; }

Por id: #titulo { text-align: center; }

Hierarquia: div p { color: blue; } → afeta só p dentro de div
```
## 📦 Box Model (Modelo de Caixa)

Todo elemento HTML é uma caixa formada por:

Content → conteúdo do texto/imagem

Padding → espaço interno

Border → borda

Margin → espaço externo

Exemplo:
```css
div {
    width: 200px;
    padding: 10px;
    border: 2px solid black;
    margin: 20px;
}
```
## 🧩 Layout com Flexbox

O Flexbox facilita a organização de elementos na tela.

Exemplo:

```css
.container {
    display: flex;
    justify-content: center; /* centraliza horizontal */
    align-items: center;     /* centraliza vertical */
    height: 100vh;
}
```
## 📱 Responsividade

Para ajustar a página em diferentes telas (PC, tablet, celular), usamos media queries:
```css
body {
    font-size: 18px;
}

@media (max-width: 600px) {
    body {
        font-size: 14px;
        background-color: lightgray;
    }
}
```
# **Next.js**

## **Introdução**

Next.js é um framework React de código aberto desenvolvido pela Vercel que revolucionou o desenvolvimento front-end ao introduzir conceitos avançados de renderização híbrida. Criado em 2016, surgiu como resposta às limitações do React tradicional em aplicações que demandam melhor performance SEO e experiência de usuário (Coodesh, 2023).

## **Por que usar Next.js?**

- **Renderização Híbrida Flexível** - Combina Static Site Generation (SSG), Server-Side Rendering (SSR) e Client-Side Rendering (CSR) conforme a necessidade de cada página
- **Performance Otimizada** - Inclui divisão automática de código, compressão e estratégias de caching avançadas
- **Roteamento Intuitivo** - Sistema de rotas baseado na estrutura de arquivos, simplificando a criação e organização de rotas
- **TypeScript Nativo** - Suporte integrado sem necessidade de configurações complexas
- **API Routes Integradas** - Permite criar endpoints backend diretamente dentro do projeto front-end

## **Características Principais**

- **File-system based routing** - Rotas automáticas baseadas na estrutura de pastas
- **Pre-rendering** - Suporte a SSG (gera páginas estáticas no build) e SSR (renderiza no servidor a cada requisição)
- **API routes** - Criação de APIs dentro do projeto usando a mesma estrutura de rotas
- **Built-in CSS support** - Suporte nativo a CSS Modules, Sass e soluções CSS-in-JS
- **Code splitting automático** - Divisão inteligente de código por rota
- **Hot reloading** - Recarregamento instantâneo durante o desenvolvimento
- **Otimização de imagens** - Componente Image com optimizações automáticas
- **Internacionalização** - Suporte nativo a múltiplos idiomas e rotas internacionalizadas

## **Guia de Instalação**

### **Pré-requisitos**

```bash
# Verifique se tem Node.js instalado (versão 18+)
node --version

# Verifique o gerenciador de pacotes
npm --version
# ou
yarn --version
```

### **1. Criar Novo Projeto**

```bash
# Comando principal (sempre use a versão latest)
npx create-next-app@latest meu-projeto-next

# Durante a instalação, escolha:
# - TypeScript: Yes
# - ESLint: Yes
# - Tailwind CSS: Yes
# - src/ directory: Yes
# - App Router: Yes
# - Import alias: No
```

### **2. Executar o Projeto**

```bash
# Entrar na pasta do projeto
cd meu-projeto-next

# Modo desenvolvimento
npm run dev

# Acesse: http://localhost:3000
```

### **3. Estrutura Básica Criada**

```
meu-projeto-next/
├── src/
│   ├── app/
│   │   ├── globals.css
│   │   ├── layout.tsx
│   │   └── page.tsx
│   └── components/
├── public/
├── package.json
└── next.config.js
```

## **Dependências Instaladas Automaticamente**

### **Produção (package.json)**

```json
{
  "dependencies": {
    "next": "14.0.0",
    "react": "18.0.0",
    "react-dom": "18.0.0"
  }
}
```

### **Desenvolvimento (instaladas automaticamente)**

- typescript - Suporte a TypeScript
- tailwindcss - Estilização com Tailwind
- eslint - Análise de código
- @types/* - Definições TypeScript
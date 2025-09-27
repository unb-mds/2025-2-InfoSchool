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

## **Guia de Instalação**

### **Pré-requisitos**

```bash
# Verifique se tem Node.js instalado (versão 18+)
node --version

# Verifique o gerenciador de pacotes
npm --version
```

### **1. Criar Novo Projeto**

```bash
npx create-next-app@latest infoschool --typescript --eslint --tailwind --src-dir --app
```

### **2. Executar o Projeto**

```bash
cd infoschool
npm run dev
```

### **3. Estrutura Básica Criada**

```
infoschool/
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

## **Dependências do Projeto InfoSchool**

### **Dependências Adicionais Necessárias**

```bash
npm install @fortawesome/react-fontawesome @fortawesome/fontawesome-svg-core @fortawesome/free-solid-svg-icons
```

## **Arquitetura Modular do InfoSchool**

### **Estrutura Adaptada**

```
infoschool/
├── src/
│   ├── modules/
│   │   ├── schools/
│   │   │   ├── components/
│   │   │   ├── hooks/
│   │   │   ├── services/
│   │   │   └── types/
│   │   ├── maps/
│   │   │   ├── components/
│   │   │   ├── hooks/
│   │   │   ├── services/
│   │   │   └── types/
│   │   ├── rankings/
│   │   │   ├── components/
│   │   │   ├── hooks/
│   │   │   ├── services/
│   │   │   └── types/
│   │   └── shared/
│   │       ├── components/
│   │       ├── hooks/
│   │       ├── utils/
│   │       └── types/
│   ├── app/
│   │   ├── globals.css
│   │   ├── layout.tsx
│   │   ├── page.tsx
│   │   └── api/
│   └── lib/
├── public/
│   ├── Favicon/
│   ├── images/
│   └── icons/
├── package.json
└── next.config.js
```

## **Comandos de Desenvolvimento**

```bash
npm run dev      # Servidor de desenvolvimento
npm run build    # Build de produção
npm run start    # Servidor de produção
npm run lint     # Análise de código
```
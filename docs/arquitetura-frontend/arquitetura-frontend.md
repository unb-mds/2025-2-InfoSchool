# Arquitetura de Software Front-End

Este guia foi montado para facilitar o entendimento de arquitetura front-end para o metodo do coelho apresentada em sala de aula.

## Princípios Fundamentais

Sabe aquele projeto que virou uma bagunça, que ninguém mais quer mexer, cheio de componentes gigantescos e dependências fora de ordem? Então, a arquitetura de front-end é justamente o conjunto de práticas, padrões e estruturas que previnem esse caos, orientando como organizar e evoluir aplicações voltadas ao usuário.

Ao contrário da visão simplista que reduz o front-end apenas à camada visual, a literatura especializada mostra que a arquitetura nesta camada é essencial para garantir:

- **Escalabilidade**: Capacidade de crescer sem perder a organização
- **Manutenibilidade**: Facilidade de fazer mudanças e correções
- **Testabilidade**: Possibilidade de testar partes isoladas do sistema
- **Performance**: Otimizações consistentes e previsíveis

### Elementos Essenciais

Uma breve contextualização para cada princípio arquitetural, pois cada um resolve um problema específico do desenvolvimento:

- **Separação de Responsabilidades**: Evita que uma mudança no CSS quebre a lógica de login
- **Padronização e Consistência**: Permite que qualquer dev encontre e entenda o código rapidamente
- **Componentização**: Cria partes reutilizáveis que se encaixam como blocos de Lego
- **Fluxo de Dados Previsível**: Torna as mudanças de estado rastreáveis e debuggáveis
- **Testabilidade**: Garante que cada parte do sistema possa ser verificada isoladamente

### **Na Prática, Isso Significa:**

- **Padronização e Consistência**
    - Nomenclatura clara de arquivos e componentes
    - Estrutura de diretórios bem definida
    - Guias de estilo (BEM, CSS Modules, etc.)
    - Ferramentas de lint/format (ESLint, Prettier)
    - Convenções de commits
- **Separação de Responsabilidades**
    - Camadas bem definidas (UI, lógica de negócio, acesso a dados)
    - Interfaces claras entre módulos
    - Princípio da responsabilidade única
- **Componentização**
    - Design systems estruturados
    - Abordagem modular (Atomic Design)
    - Reusabilidade e consistência visual
- **Fluxo de Dados Previsível**
    - Unidirecionalidade (Redux, Flux, etc.)
    - Gerenciamento de estado controlado
    - Previsibilidade de comportamento
- **Testabilidade**
    - Componentes desacoplados com dependências injetáveis
    - Facilidade para criar testes unitários e de integração
    - Estrutura que favorece mocks e stubs

Percebeu o quão importante a arquitetura do front-end ajuda no projeto de forma atemporal?

## **A Evolução dos Modelos Arquiteturais**

A história da arquitetura front-end é uma resposta evolutiva aos desafios de manutenção e escalabilidade. Irei mostrar meio que uma linha do tempo/ atualizaç]ao:

### **1. MVC: O Ponto de Partida**

O **MVC (Model-View-Controller)** foi revolucionário ao introduzir separação de concerns, mas mostrou limitações no front-end moderno.

**Prós**:

- Conceito amplamente conhecido
- Separação clássica de preocupações

**Contras**:

- Facilmente vira "Massive View Controllers"
- Lógica de negócio e estado misturados com UI
- Fluxo de dados bidirecional complexo

### **2. Arquitetura Clássica (por tipo)**

Organização por tipo de arquivo: **`/components`**, **`/services`**, **`/styles`**

**Prós**:

- Fácil para iniciantes
- Setup rápido

**Contras**:

- Difícil manutenção em projetos grandes
- Não reflete o domínio do negócio
- Leva a acoplamento

### **3. Arquitetura Modular (por feature)**

Organização por funcionalidades ou domínios - a evolução natural

**Prós**:

- Facilita manutenção e entendimento
- Agrupa tudo relacionado a uma feature
- Estrutura que "grita" o domínio

**Contras**:

- Pode gerar duplicação de código
- Requer gestão de código compartilhado

### **4. Feature-Sliced Design (FSD)**

Combina camadas (app, pages, features, entities, shared) com domínios

**Prós**:

- Escalabilidade em sistemas complexos
- Regras claras de dependência

**Contras**:

- Curva de aprendizado maior
- Complexidade adicional

### **5. Clean Architecture**

Isolamento total da lógica de negócio do framework

**Prós**:

- Máxima testabilidade
- Independência tecnológica

**Contras**:

- Complexidade inicial significativa
- "Overkill" para projetos pequenos

Em geral: A Modular por Feature é a evolução natural da Clássica, enquanto FSD e Clean Architecture são para casos extremos de complexidade.

## Benefícios de uma Boa Arquitetura

- ✅ Redução da carga cognitiva para desenvolvedores
- ✅ Facilidade de manutenção e evolução
- ✅ Melhor testabilidade de componentes
- ✅ Performance otimizada
- ✅ Onboarding-integralizçãode um novo membro- mais rápido

## Considerações para Escolha

Na hora de escolher, considere:

- 📊 Tamanho e complexidade do projeto
- 👥 Composição e experiência da equipe
- 🚀 Requisitos de escalabilidade
- ⚡ Necessidades de performance
- 🏢 Domínio do negócio

A arquitetura ideal equilibra necessidades técnicas e de negócio, permitindo evolução de acordo com o proposito.

## **Conclusão: Por Onde Começar?**

A arquitetura não é um fim, mas um meio para criar software sustentável. A melhor arquitetura é a mais simples que resolve seus problemas atuais.

Para a grande maioria dos projetos, o caminho é:

1. **Comece com Arquitetura Modular por Funcionalidade** (**`/features`**)
    - Modelo mais intuitivo
    - Melhor retorno para o esforço
    - Implementa naturalmente os princípios fundamentais
2. **Adicione gerenciamento de estado apenas quando necessário**
    - Zustand ou Jotai para estado global
    - Apenas quando o "prop drilling" ficar inconveniente
    - Quando o estado for compartilhado entre áreas não conectadas

### **Exemplo Prático Simplificado**

Estrutura Modular para React/Next.js:

```
src/
├── features/           # ← Coração da aplicação
│   ├── cart/          # Tudo do carrinho
│   └── auth/          # Tudo de autenticação
│
├── shared/            # Código entre features
│   ├── components/    # Componentes genéricos
│   ├── hooks/         # Hooks genéricos
│   └── utils/         # Utilitários
│
└── app/               # Configuração Next.js
```

Exemplo de código na feature`cart`:

Dentro de `features/cart/hooks/useCart.ts`:

```
export const useCart = () => {
  const [items, setItems] = useState<CartItem[]>([]);
  
  const addItem = (newItem: CartItem) => {
    setItems(prev => [...prev, newItem]);
  };

  return { items, addItem };
};
```

**Dentro de `features/cart/components/CartItem.tsx`:**

```
export const CartItemComponent = ({ item, onRemove }) => {
  return (
    <div className="cart-item">
      <span>{item.name} - ${item.price}</span>
      <button onClick={() => onRemove(item.id)}>Remover</button>
    </div>
  );
};
```

**Ferramentas que serão úteis para esta abordagem:**

- **React/Next.js**: Framework base que utiliza JS ou TypeScript
- **Zustand/Jotai**: Estado global quando necessário
- **ESLint + Prettier**: Padronização
- **Testing Library**: Testabilidade

**Você precisa mesmo disso?Chegou até aqui e ainda esta se perguntanto?**

- **Para um projeto simples:** Comece apenas com a pasta **`features/`** e uma **`shared/`**. É mais que suficiente.
- **Para um projeto em crescimento:** A estrutura acima te levará muito longe com uma curva de aprendizado suave.
- **Para uma equipe grande em sistema complexo:** Só então considere modelos como FSD ou Clean Architecture.

Não se prenda a estruturas complexas prematuramente. A arquitetura ideal é a que evolve com seu projeto, não a que você força desde o início.

## **Referências**

- ***Vaccaro, C. (2019).** Arquitetura de Front-End: Boas práticas para projetos escaláveis. Disponível em: https://medium.com/@caio_vaccaro*
- ***Awari. (2022).** Fundamentos da Arquitetura de Front-End.*
- ***Rocketseat. (2023).** Comparativo de arquiteturas de front-end.*
- ***Martin, R. C. (2017).** Clean Architecture: A Craftsman's Guide to Software Structure and Design. Prentice Hall.*
- ***Fowler, M. (2002).** Patterns of Enterprise Application Architecture. Addison-Wesley.*
- ***Gamma, E., Helm, R., Johnson, R., & Vlissides, J. (1994).** Design Patterns: Elements of Reusable Object-Oriented Software. Addison-Wesley.*

![Diagrama de Táticas e Estilos Arquiteturais](./arquitetura-frontend.png)

https://www.youtube.com/watch?v=E89BlFlNm4A

Video que auxilia a montar a arquitetura com Next
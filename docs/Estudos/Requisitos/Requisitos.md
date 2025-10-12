# 📌  Levantamento de Requisitos (BASE)
## ✅ Requisitos Funcionais (o que o sistema deve fazer)

- O sistema deve permitir pesquisar um estado através de um campo de busca ou lista de seleção.

- Ao selecionar um estado, o sistema deve exibir o mapa do estado correspondente.

- O sistema deve exibir os municípios do estado selecionado no mapa.

- O sistema deve permitir a seleção de um município para detalhamento.

- Ao acessar um município, o sistema deve disponibilizar um campo de pesquisa de escolas.

- O sistema deve permitir pesquisa de escolas por palavras-chave (nome parcial, código, tipo, etc.).

- O sistema deve exibir uma lista de escolas compatíveis com a pesquisa.

- O sistema deve permitir a seleção de uma escola para visualização detalhada.

- O sistema deve exibir um dashboard em formato de boletim com informações da escola (ex.: número de alunos, professores, infraestrutura, indicadores de desempenho, etc.).

- O sistema deve permitir navegação de retorno (voltar para lista de escolas, municípios e estados).

## ⚙️ Requisitos Não Funcionais (qualidades, restrições e características do sistema)

 ### Usabilidade: 
- A interface deve ser simples, intuitiva e de fácil navegação.

### Desempenho: 
- A busca por estados, municípios e escolas deve retornar resultados em até 3 segundos.

### Confiabilidade: 
- O sistema deve garantir consistência dos dados exibidos, evitando duplicações ou inconsistências.

### Disponibilidade: 
- O sistema deve estar disponível 24/7, com tempo de inatividade mínimo.

### Escalabilidade: 
- O sistema deve suportar grande volume de acessos simultâneos (ex.: 10 mil usuários).

### Compatibilidade: 
- O site deve ser acessível em navegadores modernos (Chrome, Edge, Firefox) e dispositivos móveis.

### Segurança: 
- O sistema deve proteger os dados sensíveis das escolas e impedir acessos não autorizados.

### Acessibilidade: 
- A interface deve seguir padrões de acessibilidade (WCAG), permitindo uso por pessoas com deficiência.

### Manutenibilidade: 
- O código do sistema deve ser modular e documentado, facilitando futuras atualizações.

### Escopo Geográfico: 
- O sistema deve contemplar todos os estados e municípios do Brasil.
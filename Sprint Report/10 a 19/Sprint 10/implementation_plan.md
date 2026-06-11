# Refatoração da Tabela de Triagem de Chamados (Arquitetura Client-Side)

Este documento detalha o plano de implementação revisado para a tela de Triagem de Chamados, adotando uma estratégia de **Client-Side Sorting** em conjunto com filtros otimizados no banco de dados.

## User Review Required

> [!IMPORTANT]
> - **Client-Side Data Table:** A página (`page.tsx`) fará a busca no banco (Server-Side) e passará os dados brutos para um novo componente de tabela interativo no cliente (`<DashboardTable />`).
> - **Filtro de Status Padrão:** Por regra de negócio, a listagem excluirá inicialmente chamados `COMPLETED` (Concluídos) e `REJECTED` (Rejeitados) para manter a carga do navegador leve e focada na triagem ativa.
> - **Navegação de Edição:** O ícone de Editar na coluna de ação continuará roteando o usuário para a página de detalhes do chamado (`/dashboard/chamado/[id]`).

## Proposed Changes

---

### 1. Refatoração da Página Principal (Server Component)

#### [MODIFY] [page.tsx](file:///e:/V3_conecta/gestao_conecta/src/app/(admin)/dashboard/page.tsx)
- **Otimização da Query:** Fazer um JOIN com a tabela `categories` para puxar o nome real (`categories(name)`).
- **Filtro Base:** Ajustar a query padrão para não buscar `COMPLETED` ou `REJECTED` se não houver um parâmetro de URL explícito pedindo por eles.
- **Isolamento de UI:** Remover todo o código HTML da tabela (`<table>`, `<tbody>`, etc) e as funções auxiliares de badge/label. A página vai apenas resolver a busca e injetar os dados como _props_ num novo componente client-side `<DashboardTable occurrences={occurrences} />`.

---

### 2. Criação da Tabela Interativa (Client Component)

#### [NEW] [dashboard-table.tsx](file:///e:/V3_conecta/gestao_conecta/src/components/dashboard-table.tsx)
- **Responsabilidade:** Renderizar a tabela, gerenciar a ordenação na memória e expandir/recolher linhas.
- **Nova Ordem de Colunas:** `Categoria` - `Data` - `Status` - `Protocolo` - `Título` - `Ação`.
- **Ordenação Client-Side:**
  - Criar estados para a coluna atual de ordenação (`sortColumn`) e a direção (`sortDirection`: 'asc' ou 'desc').
  - Tornar os títulos das colunas clicáveis. Ao clicar, o Javascript fará um `array.sort()` rápido sobre os dados injetados antes de renderizar.
- **Expansão de Linhas:**
  - Criar um estado (ex: `expandedRows` como um Set de IDs) para controlar quais chamados estão abertos.
  - Ao clicar na linha inteira (exceto na área do botão de ação), a linha logo abaixo exibe a descrição completa do chamado (`occurrence.description`).
- **Ações Visuais:**
  - Substituir o texto "Ver Detalhes" por um ícone de Edição moderno (lápis) que continua redirecionando usando `<Link>`.

## Verification Plan

### Manual Verification
1. Acessar o Dashboard e confirmar que os nomes reais das categorias aparecem (ex: "Iluminação") e não mais "Classificado".
2. Clicar nos cabeçalhos das colunas (Categoria, Data, Status) e ver os dados se reordenarem instantaneamente (Crescente/Decrescente), sem piscar a tela ou recarregar a página.
3. Clicar sobre uma linha de chamado e verificar se a linha desliza abrindo a descrição, e clicar novamente para fechar.
4. Confirmar que clicar no ícone de Lápis leva corretamente para a tela do detalhe do chamado.
5. Garantir que chamados "Concluídos" não poluem a lista inicial, a menos que sejam explicitamente filtrados.

# Task List - Sprint 14: Analytics e Relatórios

- [x] **Task 01: Inicialização e Git**
  - Crie e mude para a branch: `git checkout -b feature/sprint-14-analytics-web`.
  - Trabalhe dentro da pasta `gestao_conecta/`.

- [x] **Task 02: Configuração de Dependências**
  - No terminal, dentro de `gestao_conecta/`, instale a biblioteca de gráficos: `npm install recharts`.

- [x] **Task 03: Banco de Dados (Supabase MCP)**
  - Use o MCP do Postgres para criar uma Função RPC (`CREATE OR REPLACE FUNCTION get_dashboard_metrics(p_prefeitura_id UUID, p_department_id UUID DEFAULT NULL)`) ou uma View que retorne os totais agrupados por status e por categoria. Certifique-se de que a função respeite a prefeitura do usuário.

- [x] **Task 04: Server Actions para Analytics**
  - Crie `src/actions/analytics.ts`.
  - Implemente chamadas usando o cliente SSR do Supabase para invocar a função RPC criada na Task 03 (`supabase.rpc('get_dashboard_metrics', {...})`).

- [x] **Task 05: UI - Página de Estatísticas**
  - Crie a rota `src/app/(admin)/dashboard/estatisticas/page.tsx`.
  - Construa os Cards de KPI (Total Aberto, Em Andamento, Concluído).
  - Integre a biblioteca `recharts` criando componentes de cliente (`'use client'`) para renderizar um Gráfico de Barras (Chamados por Categoria) e um Gráfico de Pizza/Donut (Distribuição de Status).

- [x] **Task 06: UI - Navegação (Sidebar)**
  - Atualize o componente de Sidebar (em `layout.tsx` ou no componente isolado) para incluir o atalho para `/dashboard/estatisticas` com um ícone apropriado (ex: gráfico/chart).

- [ ] **Task 07: Encerramento da Sprint (OBRIGATÓRIO)**
  - Volte para a raiz do workspace integrado.
  - Execute a skill `@commit`.
  - Execute a skill `@gerando-relatorios-sprint.md` para a pasta `Sprint Report/Sprint 14/`.
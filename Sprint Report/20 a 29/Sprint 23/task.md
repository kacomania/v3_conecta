# Task List - Sprint 23: Painel de Satisfação (CSAT) e Feedbacks

- [x] **Task 01: Inicialização e Git**
  - Crie a branch: `git checkout -b feature/sprint-23-csat-dashboard`.
  - Trabalhe exclusivamente na pasta `gestao_conecta/` e no banco de dados.

- [x] **Task 02: [BD] RPC de Métricas de CSAT**
  - Use o MCP do Postgres para criar a função SQL `get_csat_metrics(p_prefeitura_id UUID)`.
  - Ela deve retornar a média geral de `rating` e uma agregação de média de `rating` por departamento.

- [x] **Task 03: [WEB] Server Actions de Satisfação**
  - Crie `src/actions/csat.ts` (com `"use server"`).
  - Implemente a chamada para a RPC criada e outra função para buscar os últimos 50 chamados onde `rating IS NOT NULL` e `feedback_notes IS NOT NULL`.

- [x] **Task 04: [WEB] UI - Dashboard de Satisfação**
  - Crie a rota `src/app/(admin)/dashboard/satisfacao/page.tsx`.
  - Adicione a página na Sidebar com um ícone apropriado (ex: estrela ou sorriso).
  - Renderize os Cards de KPI (Nota Média) no topo da página.

- [x] **Task 05: [WEB] UI - Feed de Comentários**
  - Na mesma página, crie uma lista ou tabela para os feedbacks.
  - Cada item deve mostrar as Estrelas, a Data, o Texto do Comentário, o Departamento relacionado e um botão "Ver Chamado" que redireciona para `/dashboard/chamado/[id]`.

- [x] **Task 06: Validação Interna do Dibro (Testes)**
  - Leia o arquivo `docs/tests_dibro_sprint_23.md`.
  - Execute as verificações descritas e reporte o status no chat aguardando aprovação.

- [x] **Task 07: Encerramento da Sprint (OBRIGATÓRIO)**
  - Execute a skill `@commit` e `@gerando-relatorios-sprint.md` para a pasta `Sprint Report/Sprint 23/`.
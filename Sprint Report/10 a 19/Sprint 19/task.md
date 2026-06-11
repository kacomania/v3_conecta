# Task List - Sprint 19: Gestão de SLA e Prazos

- [x] **Task 01: Inicialização e Git**
  - Crie a branch: `git checkout -b feature/sprint-19-gestao-sla`.

- [x] **Task 02: [BD] Colunas e Trigger de SLA**
  - Use o MCP do Postgres para adicionar `sla_hours` em `categories` e `due_date` em `occurrences`.
  - Crie a função e a Trigger `BEFORE INSERT` em `occurrences` que calcula automaticamente o `due_date` baseado na categoria escolhida.

- [x] **Task 03: [WEB] Server Actions e UI de Categorias**
  - Atualize a action de categorias e a página `/dashboard/categorias` para suportar o input do SLA (em horas).

- [x] **Task 04: [WEB] UI do Dashboard de Triagem**
  - Atualize o `DashboardTable`.
  - Exiba o SLA do chamado com indicativos visuais (Verde, Amarelo, Vermelho) calculando a diferença entre o `due_date` e a data atual (considerando o status atual para não marcar como "Atrasado" um chamado que já está "Concluído").

- [x] **Task 05: [MOBILE] Exibição da Previsão (Flutter)**
  - Atualize o modelo de dados para ler o `due_date`.
  - Na `DetalhesChamadoPage`, insira a informação visual "Previsão de Atendimento: [Data]".

- [x] **Task 06: Validação Interna do Dibro (Testes)**
  - Leia o arquivo `docs/tests_dibro_sprint_19.md` (ou equivalente).
  - Execute as verificações descritas e reporte o status no chat aguardando aprovação.

- [x] **Task 07: Encerramento da Sprint (OBRIGATÓRIO)**
  - Execute a skill `@commit` e `@gerando-relatorios-sprint.md` para a pasta `Sprint Report/Sprint 19/`.
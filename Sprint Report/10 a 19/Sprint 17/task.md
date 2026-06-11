# Task List - Sprint 17: Central de Notificações In-App

- [x] **Task 01: Inicialização e Git**
  - Crie a branch: `git checkout -b feature/sprint-17-in-app-notifications`.

- [x] **Task 02: [BD] Tabela e Trigger de Notificação**
  - Use o MCP do Postgres para criar a tabela `notifications` com RLS restrito ao `user_id`. Habilite o Realtime nela.
  - Crie uma Trigger `AFTER INSERT` na tabela `occurrence_timeline`. Se `is_public = true`, a função deve buscar o `user_id` da `occurrences` e inserir um alerta na tabela `notifications`.

- [x] **Task 03: [MOBILE] Domínio e Repositório**
  - Na pasta `cidadao_conecta/`, crie a entidade de Notificação e o `NotificationRepositoryImpl`.
  - Implemente `watchNotifications(String userId)` retornando um `Stream` e `markAsRead(String notificationId)`.

- [x] **Task 04: [MOBILE] State Management (Riverpod)**
  - Crie o Provider que consome o Stream de notificações.
  - Crie o método para calcular o total de notificações não lidas (`is_read == false`).

- [x] **Task 05: [MOBILE] UI da Central e Badge**
  - Na `HomePage` (ou AppBar global), adicione um ícone de sino (🔔). Se houver não-lidas, exiba um Badge numérico vermelho.
  - Crie a `NotificationsPage` com a lista de alertas. Diferencie visualmente as lidas das não lidas (ex: fundo azul claro para novas).

- [x] **Task 06: [MOBILE] Ação de Leitura e Roteamento**
  - Ao tocar em um card de notificação, dispare o método `markAsRead` e utilize o GoRouter para navegar até `/chamado/:id` (passando o `occurrence_id` da notificação).

- [x] **Task 07: Validação Interna do Dibro (Testes)**
  - Leia o arquivo `docs/tests_dibro_sprint_17.md`.
  - Execute as verificações descritas e reporte o status no chat aguardando aprovação.

- [x] **Task 08: Encerramento da Sprint (OBRIGATÓRIO)**
  - Execute a skill `@commit` e `@gerando-relatorios-sprint.md` para a pasta `Sprint Report/Sprint 17/`.
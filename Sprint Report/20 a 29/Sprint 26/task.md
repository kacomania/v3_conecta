# Task List - Sprint 26: Comunicados Oficiais (Defesa Civil)

- [x] **Task 01: Inicialização e Git**
  - Crie a branch: `git checkout -b feature/sprint-26-comunicados-oficiais`.

- [x] **Task 02: [BD] Tabela de Comunicados**
  - Crie a tabela `announcements` com RLS (Leitura para todos da prefeitura, Inserção apenas para Admins).

- [x] **Task 03: [BACKEND] Edge Function de Broadcast**
  - Crie a função `supabase/functions/broadcast-push/index.ts`.
  - A função deve extrair a `prefeitura_id` do novo comunicado, buscar os tokens FCM correspondentes e disparar a notificação em lote. Crie a Trigger/Webhook para acionar a função.

- [x] **Task 04: [WEB] UI e Server Action**
  - Crie `src/actions/comunicados.ts` no Next.js.
  - Crie a rota `/dashboard/comunicados/page.tsx` com formulário de envio (com dropdown de severidade) e histórico.

- [x] **Task 05: [MOBILE] Repositório e ViewModel**
  - No Flutter, implemente a busca de comunicados filtrando pela prefeitura atual logada.
  - Crie o `AsyncNotifier` (Riverpod) para gerenciar a lista de avisos.

- [x] **Task 06: [MOBILE] Mural de Avisos (UI)**
  - Adicione a aba "Avisos" no aplicativo (via `BottomNavBar` ou botão na Home).
  - Crie os cards de aviso aplicando cores semânticas baseadas na severidade (Info, Warning, Emergency).

- [x] **Task 07: Validação Interna do Dibro (Testes)**
  - Leia o arquivo `docs/tests_dibro_sprint_26.md`.
  - Execute as verificações descritas e reporte o status no chat aguardando aprovação.

- [ ] **Task 08: Encerramento da Sprint (OBRIGATÓRIO)**
  - Execute a skill `@commit` e `@gerando-relatorios-sprint.md` para a pasta `Sprint Report/Sprint 26/`.
# Task List - Sprint 25: Notificações Push Nativas

- [x] **Task 01: Inicialização e Git**
  - Crie a branch: `git checkout -b feature/sprint-25-push-notifications`.

- [x] **Task 02: [BD] Tabela de Dispositivos**
  - Use o MCP do Postgres para criar a tabela `user_devices` e suas políticas de RLS.

- [x] **Task 03: [BACKEND] Supabase Edge Function**
  - Na raiz do workspace, crie o diretório `supabase/functions/send-push/`.
  - Crie o arquivo `index.ts` contendo a lógica em Deno para receber o payload do Webhook, buscar o `fcm_token` em `user_devices` e enviar para a API do FCM.

- [x] **Task 04: [BD] Database Webhook (Trigger HTTP)**
  - Crie a Trigger no Postgres (utilizando a extensão `pg_net` do Supabase) que fará um POST para a Edge Function `send-push` sempre que houver um `INSERT` na tabela `notifications`.

- [x] **Task 05: [MOBILE] Integração Firebase (Flutter)**
  - No `cidadao_conecta/`, adicione `firebase_core` e `firebase_messaging` no `pubspec.yaml`.
  - Atualize o `main.dart` para inicializar o Firebase e solicitar as permissões de notificação (`FirebaseMessaging.instance.requestPermission()`).

- [x] **Task 06: [MOBILE] Sincronização do Token**
  - Crie o repositório que obtém o `FirebaseMessaging.instance.getToken()` e faz um `upsert` na tabela `user_devices` associado ao `auth.uid()`.
  - Invoque essa sincronização no momento em que o `authStateProvider` detectar um login bem-sucedido.

- [x] **Task 07: Validação Interna do Dibro (Testes)**
  - Leia o arquivo `docs/tests_dibro_sprint_25.md`.
  - Execute as verificações descritas e reporte o status no chat aguardando aprovação.

- [ ] **Task 08: Encerramento da Sprint (OBRIGATÓRIO)**
  - Execute a skill `@commit` e `@gerando-relatorios-sprint.md` para a pasta `Sprint Report/Sprint 25/`.
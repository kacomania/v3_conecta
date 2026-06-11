# Task List - Sprint 30: API Pública e Webhooks

- [x] **Task 01: Inicialização e Git**
  - Crie a branch: `git checkout -b feature/sprint-30-api-webhooks`.
  - O foco desta sprint é no `gestao_conecta/` e no Supabase.

- [x] **Task 02: [BD] Tabelas de Integração**
  - Use o MCP do Postgres para criar as tabelas `webhooks_endpoints` e `api_keys` com vínculo ao `prefeitura_id` e RLS rigoroso.

- [x] **Task 03: [BACKEND] Edge Function de Despacho**
  - Crie `supabase/functions/webhook-dispatcher/index.ts`.
  - Implemente o fetch HTTP POST enviando o payload do chamado para a URL configurada pela prefeitura. Adicione um header de segurança usando o `secret_token`.
  - Crie a Trigger no banco de dados para acionar a função em `INSERT` ou `UPDATE` na tabela `occurrences`.

- [x] **Task 04: [WEB] Server Actions de Desenvolvedor**
  - Crie `src/actions/developers.ts` no Next.js.
  - Implemente o CRUD de webhooks e a geração de API Keys.

- [x] **Task 05: [WEB] UI do Painel de Desenvolvedores**
  - Crie a rota `src/app/(admin)/dashboard/desenvolvedores/page.tsx`.
  - Construa a interface permitindo o cadastro da URL do Webhook. Restrinja o acesso na Sidebar para `access_level >= 4`.

- [x] **Task 06: Validação Interna do Dibro (Testes)**
  - Leia o arquivo `docs/tests_dibro_sprint_30.md`.
  - Execute as verificações descritas e reporte o status no chat aguardando aprovação.

- [x] **Task 07: Encerramento da Sprint (OBRIGATÓRIO)**
  - Execute a skill `@commit` e `@gerando-relatorios-sprint.md` para a pasta `Sprint Report/Sprint 30/`.
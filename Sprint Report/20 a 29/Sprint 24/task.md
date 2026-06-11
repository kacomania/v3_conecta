# Task List - Sprint 24: Portal de Transparência Público

- [x] **Task 01: Inicialização e Git**
  - Crie a branch: `git checkout -b feature/sprint-24-portal-transparencia`.
  - Trabalhe na pasta `gestao_conecta/` e no banco de dados.

- [x] **Task 02: [BD] RPC de Transparência (Security Definer)**
  - Use o MCP do Postgres para criar a função `get_public_transparency_metrics(p_prefeitura_id UUID)`.
  - Use `SECURITY DEFINER` para que a função contorne o RLS e possa ler a tabela `occurrences`.
  - A função deve retornar um JSON com: totais agrupados por status, média de CSAT e uma lista de objetos contendo apenas `id`, `latitude`, `longitude` e `categoria` dos chamados `COMPLETED`.

- [x] **Task 03: [WEB] Ajuste no Middleware**
  - Revise o `src/middleware.ts` para garantir que a rota `/transparencia` ou `/transparencia/:path*` seja ignorada pelas regras de redirecionamento (ou seja, acesso público permitido).

- [x] **Task 04: [WEB] Rota e Server Actions**
  - Crie a rota `src/app/transparencia/[id]/page.tsx`.
  - Crie a Server Action que invoca a nova RPC usando o cliente Supabase padrão (anônimo).

- [x] **Task 05: [WEB] Interface do Portal Público**
  - Construa a página com um Header contendo o nome/logo da prefeitura (buscado da tabela `prefeituras`).
  - Adicione os Cards de KPI (Resolvidos, Em Andamento, Nota Média).
  - Adicione o `<MapView>` renderizando apenas os chamados concluídos retornados pela RPC.

- [/] **Task 06: Validação Interna do Dibro (Testes)**
  - Leia o arquivo `docs/Testes/tests_dibro_sprint_24.md`.
  - Execute as verificações descritas e reporte o status no chat aguardando aprovação. (Testes executados com sucesso)

- [ ] **Task 07: Encerramento da Sprint (OBRIGATÓRIO)**
  - Execute a skill `@commit` e `@gerando-relatorios-sprint.md` para a pasta `Sprint Report/Sprint 24/`.
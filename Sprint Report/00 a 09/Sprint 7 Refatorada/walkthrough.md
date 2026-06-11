# Task List - Sprint 7 (Refatorada): Limpeza Mobile & Setup Web

- [x] **Task 01: Inicialização e Git**
  - Crie e mude para a branch: `git checkout -b feature/sprint-7-refatorada-cleanup-web`.

- [x] **Task 02: Limpeza de UI e Rotas (Flutter)**
  - Delete a pasta `lib/ui/admin/` inteira.
  - No `app_router.dart`, remova os redirecionamentos para `/admin/*` e as definições dessas rotas. Garanta que qualquer usuário logado caia na `/home`.

- [x] **Task 03: Limpeza de Domínio e Dados (Flutter)**
  - No `OccurrenceRepository` e `OccurrenceRepositoryImpl`, remova os métodos que eram exclusivos do servidor (ex: `updateRequestStatus`, buscar todos os chamados da prefeitura).
  - Garanta que o app compile sem erros após as remoções.

- [x] **Task 04: Criação do Projeto Next.js (Portal Web)**
  - Abra o terminal na raiz do workspace (um nível acima do `cidadao_conecta`).
  - Execute o comando: `npx create-next-app@latest gestao_conecta --typescript --tailwind --eslint --app --src-dir --import-alias "@/*" --use-npm` (aceite os prompts padrão, sem turbopack se perguntar).

- [x] **Task 05: Configuração Inicial do Supabase no Next.js**
  - Navegue para a nova pasta: `cd gestao_conecta`.
  - Instale o Supabase: `npm install @supabase/supabase-js`.
  - Crie um arquivo `.env.local` na raiz do `gestao_conecta` com as mesmas chaves `NEXT_PUBLIC_SUPABASE_URL` e `NEXT_PUBLIC_SUPABASE_ANON_KEY` usadas no Flutter.

- [x] **Task 06: Encerramento da Sprint**
  - Volte para a raiz do workspace integrado.
  - Execute a skill `@commit`.
  - Execute a skill `@gerando-relatorios-sprint.md` para a pasta `Sprint Report/Sprint 7 Refatorada/`.
# Task List - Sprint 8: Dashboard do Servidor (Web Portal)

- [x] **Task 01: Inicialização e Git**
  - Crie e mude para a branch: `git checkout -b feature/sprint-8-portal-web-dashboard`.
  - Certifique-se de realizar as tarefas de código dentro do diretório `gestao_conecta/`.

- [x] **Task 02: Configuração do Supabase SSR**
  - No diretório `gestao_conecta`, instale o pacote de SSR: `npm install @supabase/ssr`.
  - Crie os utilitários de cliente e servidor do Supabase (ex: `src/utils/supabase/server.ts` e `client.ts`).
  - Implemente o `src/middleware.ts` para proteger as rotas administrativas e redirecionar para `/login` se não houver sessão.

- [x] **Task 03: Tela de Login**
  - Crie `src/app/login/page.tsx` com um formulário simples (email e senha).
  - Implemente a server action ou client function para autenticar o usuário e redirecioná-lo para `/dashboard`.

- [x] **Task 04: Layout Administrativo (UI)**
  - Consulte o `DESIGN.md` (Portal Web).
  - Crie o `src/app/(admin)/layout.tsx` contendo a navegação lateral (Sidebar) padrão do nosso sistema de gestão.

- [x] **Task 05: Dashboard & Triagem (Data Fetching)**
  - Crie `src/app/(admin)/dashboard/page.tsx`.
  - Faça o fetch da tabela `occurrences` (ordenado por `created_at` descrescente).
  - Renderize os chamados usando Tailwind CSS, destacando o Status (Pendente, Em Andamento) e as tags de Categoria.

- [x] **Task 06: Encerramento da Sprint (OBRIGATÓRIO)**
  - Execute a skill `@commit`.
  - Execute a skill `@gerando-relatorios-sprint.md` para a pasta `Sprint Report/Sprint 8/`.
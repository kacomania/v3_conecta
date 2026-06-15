# Task List - Sprint 35: Theming Web e UX

- [x] **Task 01: Inicialização e Git**
  - Crie a branch: `git checkout -b feature/sprint-35-web-ux-theming`.
  - O trabalho será 100% no Next.js (`gestao_conecta/`).

- [x] **Task 02: [WEB] Configuração do Tailwind**
  - Atualize `tailwind.config.ts` para que as cores `primary` e `secondary` leiam variáveis CSS (ex: `var(--color-primary)`).

- [x] **Task 03: [WEB] Fetch do Tenant no Layout**
  - No `src/app/(admin)/layout.tsx`, busque os dados do usuário e de sua respectiva `prefeitura` (primary_color, secondary_color, logo_url).
  - Injete as variáveis CSS no elemento wrapper do layout.

- [x] **Task 04: [WEB] Sidebar com Active State e Logo**
  - Isole a lógica de links da Sidebar em um Client Component (para usar `usePathname()`).
  - Adicione a lógica visual: se a rota atual for igual à do link, mude a cor do item para a cor primária (com destaque).
  - Adicione o `<img src={logo_url}>` no topo da Sidebar.

- [x] **Task 05: [WEB] Padronização de Cabeçalhos**
  - Crie um componente `<PageHeader title="Nome da Página" />`.
  - Refatore as páginas do dashboard (`/dashboard`, `/dashboard/auditoria`, `/categorias`, etc.) para usarem esse componente no topo do conteúdo, garantindo coesão visual.

- [x] **Task 06: Validação Interna do Dibro (Testes)**
  - Leia o arquivo `docs/tests_dibro_sprint_35.md`.
  - Execute as verificações descritas e reporte os resultados no chat.

- [ ] **Task 07: Encerramento da Sprint (OBRIGATÓRIO)**
  - Execute a skill `@commit` e `@gerando-relatorios-sprint.md` para a pasta `Sprint Report/Sprint 35/`.
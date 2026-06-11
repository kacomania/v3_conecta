# Task List - Sprint 10: Filtros de Triagem e QA

- [x] **Task 01: Inicialização e Git**
  - Crie e mude para a branch: `git checkout -b feature/sprint-10-filtros-e-qa-web`.
  - Trabalhe dentro da pasta `gestao_conecta/`.

- [x] **Task 02: Lógica de Busca no Supabase (Server)**
  - Atualize a função de fetch dos chamados no Server Component `dashboard/page.tsx` (ou nas Server Actions) para aceitar os parâmetros de busca (`status`, `categoria`, `query`).
  - Aplique os filtros condicionais do Supabase (`ilike`, `eq`).

- [x] **Task 03: Componente de Filtros (Client UI)**
  - Crie um novo componente `src/components/dashboard-filters.tsx` (Client Component).
  - Implemente um campo de Busca (texto), um Select para Status e um botão de "Limpar Filtros".
  - O componente deve atualizar a URL (ex: `?status=PENDING&q=teste`) ao interagir com os inputs.

- [x] **Task 04: Integração na UI do Dashboard**
  - Adicione o componente `DashboardFilters` acima da lista de chamados no `dashboard/page.tsx`.
  - Garanta que a UI lide graciosamente com o estado de "Nenhum chamado encontrado".

- [x] **Task 05: Documentação de Testes Manuais (QA)**
  - Crie um arquivo `docs/qa_manual_tests_web.md` contendo um roteiro passo a passo para o Piloto testar manualmente:
    1. Login de Servidor vs Cidadão (bloqueio).
    2. Aplicação de filtros no Dashboard.
    3. Atualização de status e adição de notas.
    4. Verificação no App Mobile.

- [x] **Task 05b: Tabela Interativa (Client-Side)**
  - Atualizar `dashboard/page.tsx` para buscar a categoria e filtrar por status ativos nativamente.
  - Criar `src/components/dashboard-table.tsx` para ordenação no cliente e expansão de linha.
  - Inserir ícone de Edição e reordenar as colunas conforme solicitado.

- [ ] **Task 06: Encerramento da Sprint (OBRIGATÓRIO)**
  - Execute a skill `@commit`.
  - Execute a skill `@gerando-relatorios-sprint.md` para a pasta `Sprint Report/Sprint 10/`.
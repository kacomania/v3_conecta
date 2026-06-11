# Task List - Sprint 31: Testes Automatizados e QA

- [x] **Task 01: Inicialização e Git**
  - Crie a branch: `git checkout -b feature/sprint-31-qa-automation`.

- [x] **Task 02: [MOBILE] Setup e Testes Unitários (Flutter)**
  - No `cidadao_conecta/`, adicione `mockito` nas `dev_dependencies`.
  - Crie a pasta `test/` e escreva testes unitários para a `OccurrenceEntity` (from/toJson) e para o `NovoChamadoViewModel`.

- [x] **Task 03: [MOBILE] Testes de Widget (Flutter)**
  - Escreva testes garantindo que o `RatingWidget` renderize 5 estrelas e reaja a cliques, e que o `ChamadoCard` exiba a cor correta baseada no status.

- [x] **Task 04: [WEB] Testes de API (M2M) e Unitários (Next.js)**
  - Configure o Jest no `gestao_conecta/`.
  - Crie testes unitários para os Client Components (ex: formulários).
  - **[CRÍTICO]** Crie os testes automatizados para a camada de Entrada de Dados M2M (rotas `/api/v1/...`). Use testes de integração (ex: `node-mocks-http` ou testes nativos do Next.js) para simular requisições HTTP e garantir que o Middleware/Validador de `api_keys` bloqueie acessos não autorizados e valide o hash criptográfico corretamente.

- [x] **Task 05: [WEB] Setup E2E (Playwright)**
  - Instale o Playwright (`npm init playwright@latest` com configs padrão na pasta `gestao_conecta`).
  - Crie um teste básico `login.spec.ts` que valida se a página de login renderiza os inputs corretamente.

- [x] **Task 06: Validação Interna do Dibro (Testes)**
  - Leia o arquivo `docs/tests_dibro_sprint_31.md`.
  - Execute os comandos de teste (`flutter test`, `npm run test`, `npx playwright test`) e apresente o relatório de sucesso no chat.

- [x] **Task 07: Encerramento da Sprint (OBRIGATÓRIO)**
  - Execute a skill `@commit` e `@gerando-relatorios-sprint.md` para a pasta `Sprint Report/Sprint 31/`.
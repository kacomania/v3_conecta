# Task List - Sprint 36: DevOps e Advanced QA

- [x] **Task 01: Inicialização e Git**
  - Crie a branch: `git checkout -b feature/sprint-36-devops-cicd`.

- [x] **Task 02: [DEVOPS] GitHub Actions (CI)**
  - Crie a pasta `.github/workflows/` na raiz do workspace.
  - Crie o arquivo `ci.yml`. Configure dois jobs: `flutter_test` (acessando `cidadao_conecta/`) e `nextjs_test` (acessando `gestao_conecta/`). O trigger deve ser `pull_request` para a branch `main`.

- [x] **Task 03: [DEVOPS] Codemagic YAML (CD Mobile)**
  - Crie o arquivo `codemagic.yaml` na raiz do workspace.
  - Configure o workflow para compilar o Android AppBundle (`.aab`) apontando o `working_directory` para `cidadao_conecta`.

- [x] **Task 04: [MOBILE] Widget Tests (Flutter)**
  - No `cidadao_conecta/test/`, crie testes de widget (ex: `rating_widget_test.dart`).
  - Use `ProviderScope` para mockar o Riverpod e garanta que a UI renderize as estrelas do CSAT corretamente.

- [x] **Task 05: [WEB] Testes E2E (Playwright)**
  - No `gestao_conecta/`, inicialize o Playwright (se ainda não estiver ativo).
  - Crie o arquivo `tests/e2e/login-flow.spec.ts`.
  - Escreva um teste que acesse a página `/login`, preencha os inputs, intercepte a requisição (mock) e verifique se a navegação para `/dashboard` ocorre.

- [x] **Task 06: Validação Interna do Dibro (Testes)**
  - Leia o arquivo `docs/tests_dibro_sprint_36.md`.
  - Execute as verificações descritas e reporte os resultados no chat.

- [x] **Task 07: Encerramento da Sprint (OBRIGATÓRIO)**
  - Execute a skill `@commit` e `@gerando-relatorios-sprint.md` para a pasta `Sprint Report/Sprint 36/`.
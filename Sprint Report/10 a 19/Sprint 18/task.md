# Task List - Sprint 18: White-Label e Theming Dinâmico

- [x] **Task 01: Inicialização e Git**
  - Crie a branch: `git checkout -b feature/sprint-18-whitelabel-theming`.

- [x] **Task 02: [BD] Colunas e Bucket de Assets**
  - Use o MCP do Postgres para adicionar `primary_color`, `secondary_color` e `logo_url` na tabela `prefeituras`.
  - Crie o bucket `tenant_assets` no Supabase Storage e configure-o como público (para leitura de imagens).

- [x] **Task 03: [WEB] Server Actions de Identidade Visual**
  - No `gestao_conecta`, crie a action `updateTenantIdentity(formData)` que faz o upload do logo (se enviado) e atualiza a tabela `prefeituras` com as cores.

- [x] **Task 04: [WEB] UI de Configurações**
  - Atualize a página `/dashboard/configuracoes` adicionando o formulário de Identidade Visual (Cores e Logo).
  - Garanta que apenas usuários com nível `CITY_ADMIN` ou superior possam alterar isso.

- [x] **Task 05: [MOBILE] Atualização do Modelo e Tema**
  - No `cidadao_conecta`, atualize `prefeitura_model.dart` para parsear as novas colunas.
  - Ajuste a classe `TenantTheme` (`tenant_theme.dart`) para aceitar strings HEX e injetar na paleta de cores do Material 3.

- [x] **Task 06: [MOBILE] Aplicação Visual na UI**
  - Garanta que o `MyApp` está escutando o `tenantThemeProvider` corretamente.
  - Na `HomeScreen`, renderize o `logoUrl` (se disponível) no topo da tela ou na AppBar usando `CachedNetworkImage`.

- [x] **Task 07: Validação Interna do Dibro (Testes)**
  - Leia o arquivo `docs/tests_dibro_sprint_18.md`.
  - Execute as verificações descritas e reporte o status no chat aguardando aprovação.

- [x] **Task 08: Encerramento da Sprint (OBRIGATÓRIO)**
  - Execute a skill `@commit` e `@gerando-relatorios-sprint.md` para a pasta `Sprint Report/Sprint 18/`.
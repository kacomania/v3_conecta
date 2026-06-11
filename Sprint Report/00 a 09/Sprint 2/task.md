# Tasks - Sprint 2: Auth & Tenant

- [x] **Task 01:** Usar o Terminal MCP para criar a branch `feature/sprint-2-auth-tenant`.
- [x] **Task 02:** Criar as entidades de domínio `app_user.dart` e `prefeitura_model.dart` em `lib/domain/models/`.
- [x] **Task 03:** Criar as interfaces `auth_repository.dart` e `tenant_repository.dart` em `lib/domain/repositories/`.
- [x] **Task 04:** Criar os serviços `supabase_auth_service.dart` e `supabase_tenant_service.dart` em `lib/data/services/`. *Lembre-se de passar o `prefeitura_id` no metadata do signUp.*
- [x] **Task 05:** Criar as implementações `auth_repository_impl.dart` e `tenant_repository_impl.dart` em `lib/data/repositories/`.
- [x] **Task 06:** Atualizar `lib/core/di/providers.dart` adicionando os novos providers (`authStateProvider`, `currentTenantProvider`, etc).
- [x] **Task 07:** Atualizar `lib/routing/app_router.dart` para ser um `Provider<GoRouter>`, adicionando o `redirect` (Guard) com base no estado de autenticação.
- [x] **Task 08:** Criar o `auth_controller.dart` (NotifierProvider) em `lib/ui/features/auth/` para gerenciar a lógica de UI.
- [x] **Task 09:** Criar o `prefeitura_dropdown.dart` e a `login_screen.dart` utilizando os componentes atômicos da Sprint 1 (`CustomTextField`, `PrimaryButton`).
- [x] **Task 10:** Rodar `flutter analyze` para checar se a Clean Architecture e as regras `.mdc` foram respeitadas.
- [x] **Task 11 (Finalização):** Executar a skill `@commit` com a mensagem `feat: implementa autenticacao, tenant e guards de rota`.
- [ ] **Task 12 (Encerramento):** Executar a skill `@gerando-relatorios-sprint` para gerar o relatório final da Sprint 2 na pasta `Sprint Report/Sprint 2/`.
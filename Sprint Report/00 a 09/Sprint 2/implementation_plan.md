# Implementation Plan - Sprint 2: Auth & Tenant

## 1. Visão Geral
Implementar o módulo de Autenticação e Multi-Tenancy (Prefeituras). O sistema deve garantir que o usuário selecione uma Prefeitura (Tenant) antes do registro, salvando o ID localmente. O GoRouter será blindado com um Guard baseado no estado de autenticação (Riverpod).

## 2. Estratégia Git (Obrigatória)
- **Branch:** `feature/sprint-2-auth-tenant`
- **Encerramento:** Commits atômicos via skill `@commit` e arquivamento via `gerando-relatorios-sprint.md`.

## 3. Escopo Técnico
### A. Camada Domain (Entidades e Contratos)
- `models/app_user.dart`: Entidade pura (id, email, name, isAdmin).
- `models/prefeitura_model.dart`: Entidade pura (id, name, primaryColor, secondaryColor, logoUrl).
- `repositories/auth_repository.dart`: Contrato abstrato (signIn, signUp, signOut, authStateChanges).
- `repositories/tenant_repository.dart`: Contrato abstrato (fetchAllTenants, fetchTenantById).

### B. Camada Data (Serviços e Implementações)
- `services/supabase_auth_service.dart`: Wrapper do Supabase Auth. **CRÍTICO:** O método `signUp` deve aceitar e enviar o `prefeitura_id` no parâmetro `data` (metadata) para ativar a Trigger do banco.
- `services/supabase_tenant_service.dart`: Consultas à tabela `prefeituras`.
- `repositories/auth_repository_impl.dart` e `tenant_repository_impl.dart`.

### C. Injeção de Dependências (`core/di/providers.dart`)
- Adicionar: `authServiceProvider`, `tenantServiceProvider`, `authRepositoryProvider`, `tenantRepositoryProvider`.
- Criar `authStateProvider` (StreamProvider escutando `supabase.auth.onAuthStateChange`).
- Criar `currentTenantProvider` (AsyncNotifier) que lê o `last_prefeitura_id` do SharedPreferences.

### D. Roteamento e Guards (`routing/app_router.dart`)
- Transformar o `appRouter` em um Provider (`appRouterProvider`) para ler o `authStateProvider`.
- Adicionar lógica de `redirect`: Se não autenticado e rota != `/login`, redireciona para `/login`.

### E. Camada UI (Features)
- `auth_controller.dart`: NotifierProvider para gerenciar loading/erros no login e registro.
- `widgets/prefeitura_dropdown.dart`: Dropdown que busca tenants e salva no SharedPreferences.
- `screens/login_screen.dart`: UI com e-mail, senha e o Dropdown de prefeituras integrado.
- `screens/select_tenant_screen.dart` (Opcional se o dropdown resolver na tela de login).
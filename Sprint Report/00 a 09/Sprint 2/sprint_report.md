# Relatório Final - Sprint 2: Auth & Tenant
**Módulo:** Cidadão Conecta v3
**Status:** CONCLUÍDO
**Data de Encerramento:** 01 de Junho de 2026
**Branch:** `feature/sprint-2-auth-tenant`
**Commit:** `feat: implementa autenticacao, tenant e guards de rota`
**Responsável:** Dibro (Digital Brother) — Engenheiro de Software Sênior

---

## 1. Sumário Executivo
A Sprint 2 foi concluída com sucesso. Toda a camada de autenticação (Auth) e multi-tenancy (Tenant) foi implementada seguindo rigorosamente a Clean Architecture com Riverpod. O fluxo completo de login com seleção de Prefeitura, guards de rota (GoRouter redirect) e persistência do tenant selecionado (SharedPreferences) está funcional. A diretriz crítica de segurança (inclusão do `prefeitura_id` no metadata do `signUp`) foi cumprida.

---

## 2. Objetivos Alcançados & Entregas

### A. Camada de Domínio (Domain Layer)
- **Models:** Criados `AppUser` e `PrefeituraModel` com serialização JSON e override de `==`/`hashCode`.
- **Interfaces:** Criados contratos abstratos `AuthRepository` e `TenantRepository`.

### B. Camada de Dados (Data Layer)
- **Services:**
  - `SupabaseAuthService`: Encapsula `signIn`, `signUp` (com `prefeitura_id` no metadata) e `signOut`.
  - `SupabaseTenantService`: Busca de prefeituras com tratamento robusto de null e try/catch.
- **Repositories:**
  - `AuthRepositoryImpl`: Mapeia `User` do Supabase para `AppUser` do domínio.
  - `TenantRepositoryImpl`: Delega para o service mantendo o contrato limpo.

### C. Camada de UI (Presentation Layer)
- **AuthController** (`AsyncNotifier`): Gerencia estado de login/signup com `AsyncValue`.
- **LoginScreen**: Tela de login com `PrefeituraDropdown`, campos de e-mail/senha e botão de cadastro.
- **PrefeituraDropdown**: Widget reativo que carrega prefeituras do banco e persiste seleção via `CurrentTenantNotifier`.

### D. Infraestrutura & Navegação
- **Providers atualizados:** `authStateProvider` (Stream), `currentTenantProvider` (AsyncNotifier com SharedPreferences), `tenantThemeProvider` (reativo ao tenant selecionado).
- **GoRouter com Auth Guard:** Redirect automático para `/login` se não autenticado, e para `/` se já autenticado.

### E. Banco de Dados (Supabase)
- **Policy RLS:** Adicionada policy de leitura pública na tabela `prefeituras` para permitir seleção antes do login.
- **Dados de teste:** Inserida "Prefeitura de Teste" com cores do Master Blueprint (`#003B73`, `#005B9F`).
- **Tabela de validação:** Criada tabela `teste` para confirmar conectividade com o banco.

---

## 3. Problemas Enfrentados & Resolvidos

### 🔴 Problema 1: Arquivo `.env` com placeholders
- **Sintoma:** Dropdown de prefeituras sempre vazio. Erro `TypeError: null: type 'Null' is not a subtype of type 'Iterable<dynamic>'`.
- **Causa Raiz:** O arquivo `cidadao_conecta/.env` continha `YOUR_SUPABASE_URL` e `YOUR_SUPABASE_ANON_KEY` em vez das credenciais reais do projeto Supabase. O app nunca esteve conectado ao banco de dados real.
- **Solução:** Substituídas as credenciais usando os dados obtidos via Supabase MCP (`get_project_url` e `get_publishable_keys`).
- **Lição:** Sempre validar a conexão com o banco após configurar o `.env`. Implementar um health-check na inicialização do app.

### 🔴 Problema 2: Emulador Android não abria
- **Sintoma:** O comando `flutter emulators --launch Pixel_10_Pro_XL` retornava sucesso mas o emulador nunca aparecia em `flutter devices`. O `adb` não estava no PATH do sistema.
- **Causa Raiz:** O `flutter emulators --launch` delegava para o executável do emulador que morria silenciosamente (possivelmente snapshot corrompido ou problema de inicialização cold boot).
- **Solução:** Chamar o `emulator.exe` diretamente pelo caminho completo do SDK (`$env:LOCALAPPDATA\Android\sdk\emulator\emulator.exe`) com a flag `-no-snapshot-load`. Também usar o ADB pelo caminho completo (`platform-tools\adb.exe`) para monitoramento.
- **Lição:** Adicionar `platform-tools` e `emulator` ao PATH do sistema. Usar sempre `-no-snapshot-load` para cold boots limpas.

### 🟡 Problema 3: Casting de tipos na Web (Chrome)
- **Sintoma:** Mesmo com o `.env` correto, o parse de prefeituras falhava no Chrome com erro de `Iterable<dynamic>`.
- **Causa Raiz:** A compilação Dart para JavaScript (Web) tem comportamento diferente de casting. O `Map` retornado pelo Supabase precisa de `Map<String, dynamic>.from()` explícito.
- **Solução:** Implementado for-loop seguro com casting explícito no `SupabaseTenantService.fetchAllTenants()`. Adicionado `try/catch` retornando `[]` em caso de falha.
- **Lição:** Sempre testar em Web e Android separadamente. Usar casting explícito em projetos multi-plataforma.

---

## 4. Estrutura de Arquivos da Sprint 2

```
cidadao_conecta/lib/
├── core/
│   └── di/
│       └── providers.dart          [MODIFICADO] +authStateProvider, +currentTenantProvider
├── data/
│   ├── repositories/
│   │   ├── auth_repository_impl.dart   [NOVO]
│   │   └── tenant_repository_impl.dart [NOVO]
│   └── services/
│       ├── supabase_auth_service.dart  [NOVO]
│       └── supabase_tenant_service.dart [NOVO]
├── domain/
│   ├── models/
│   │   ├── app_user.dart               [NOVO]
│   │   └── prefeitura_model.dart       [NOVO]
│   └── repositories/
│       ├── auth_repository.dart        [NOVO]
│       └── tenant_repository.dart      [NOVO]
├── routing/
│   └── app_router.dart             [MODIFICADO] +routerProvider, +Auth Guard
└── ui/
    └── features/
        └── auth/
            ├── auth_controller.dart         [NOVO]
            └── screens/
                ├── login_screen.dart        [NOVO]
                └── widgets/
                    └── prefeitura_dropdown.dart [NOVO]
```

---

## 5. Verificação & Resultado
- **`flutter analyze`:** Zero erros, zero warnings.
- **Chrome (Web):** App rodando com `Supabase init completed`, dropdown de prefeituras funcional.
- **Android Emulator (`emulator-5554`):** App compilado e instalado com sucesso, `Supabase init completed`.
- **Supabase:** Dados confirmados na tabela `prefeituras` (1 registro), tabela `teste` criada para validação manual.

---

## 6. Arquivos Arquivados

```
Sprint Report/Sprint 2/
├── implementation_plan.md    # Plano original de implementação técnica
├── task.md                   # Checklist com 100% das tarefas marcadas como resolvidas
└── sprint_report.md          # Este documento de encerramento da Sprint 2
```

# Implementation Plan - Sprint 7: Painel do Servidor

## 🎯 Objetivo
Construir a área Administrativa ("Painel do Servidor") para que os funcionários da Prefeitura possam visualizar, filtrar e gerenciar os chamados da cidade. Além disso, corrigir a falha de segurança no RLS para restringir a leitura dos cidadãos apenas aos seus próprios chamados, mantendo o acesso total para os servidores da mesma prefeitura.

## 🏗️ Decisões Arquiteturais (Clean Architecture)

### 1. Segurança e Banco de Dados (Supabase)
- **Correção de RLS:** Atualizar a política de `SELECT` da tabela `occurrences`. 
  - Regra: Se a *role* for `USER`, ler apenas onde `user_id = auth.uid()`. Se for diferente de `USER`, ler onde `prefeitura_id = get_current_user_prefeitura_id()`.

### 2. Domain Layer (`lib/domain/`)
- **Autenticação:** Garantir que a entidade de Usuário/Sessão atualize seu estado com os dados da tabela `user_roles` (especialmente a `role`).
- **Interfaces:** Adicionar contratos no `OccurrenceRepository` para:
  - Buscar todas as ocorrências da prefeitura com filtros (Status, Categoria).
  - Atualizar o status de uma ocorrência (`updateOccurrenceStatus`).
  - Inserir na timeline marcando `is_public` (true para Cidadão ver, false para nota interna).

### 3. Data Layer (`lib/data/`)
- Implementar as novas requisições administrativas no `OccurrenceRepositoryImpl`.

### 4. Presentation Layer (`lib/ui/`)
- **State Management (Riverpod 3.x):**
  - `ServidorDashboardViewModel` (`AsyncNotifier`): Gerencia a lista global e os filtros.
  - `GestaoChamadoViewModel` (`AsyncNotifier`): Gerencia a alteração de status e inserção de notas.
- **UI (Baseado no DESIGN.md - Mobile App Administrativo):**
  - `ServidorDashboardPage`: Lista com filtros. `ServidorChamadoCard` exibindo SLA/Urgência.
  - `GestaoChamadoPage`: Detalhes completos, dropdown de mudança de status e formulário de nova atualização na timeline.

### 5. Roteamento (GoRouter)
- Atualizar o *Guard* e o *Redirect* no `app_router.dart`: Após o login, verificar a `role`. Se `USER`, redirecionar para `/home` (Cidadão). Se qualquer outra *role* administrativa, redirecionar para `/admin/dashboard`.

## 🔀 Estratégia de Git
- Branch: `feature/sprint-7-painel-servidor`.
- Fechamento padrão com `@commit` e `@gerando-relatorios-sprint.md`.
# Task List - Sprint 3: Landing Page

- [x] **Task 01: Inicialização e Git**
  - Abra o terminal integrado.
  - Execute: `git checkout -b feature/sprint-3-landing-page`.

- [x] **Task 02: Camada de Domínio (Categorias)**
  - Crie `lib/domain/entities/categoria_entity.dart`.
  - Crie `lib/domain/repositories/categoria_repository.dart`.

- [x] **Task 03: Camada de Dados (Supabase/Mocks)**
  - Crie `lib/data/repositories/categoria_repository_impl.dart`.
  - Implemente a busca de categorias (pode usar mock temporário se a tabela não existir, mas injete o cliente do Supabase).

- [x] **Task 04: Injeção de Dependências (Providers)**
  - Crie `lib/core/providers/categoria_providers.dart`.
  - Registre o Provider do `CategoriaRepository`.

- [x] **Task 05: State Management (Riverpod 3.x)**
  - Crie `lib/ui/home/viewmodels/home_view_model.dart`.
  - Implemente a classe usando `@riverpod` ou estendendo `AsyncNotifier`.
  - O `build()` deve buscar simultaneamente o Perfil do usuário (para a saudação) e as Categorias.

- [x] **Task 06: Componentes de UI (Widgets)**
  - Crie `lib/ui/home/widgets/greeting_header.dart` (UI burra, recebe dados via construtor).
  - Crie `lib/ui/home/widgets/action_card.dart` (UI burra, recebe ícone, título e callback).
  - Crie `lib/ui/home/widgets/category_grid.dart` (UI burra, recebe lista de categorias).

- [x] **Task 07: Montagem da HomePage e Roteamento**
  - Atualize/Crie `lib/ui/home/pages/home_page.dart`.
  - Conecte a `HomePage` ao `HomeViewModel` usando `ref.watch`.
  - Garanta que o GoRouter (`lib/core/router/app_router.dart`) aponte a rota `/home` para esta nova página.
  - Teste o Hot Reload no Emulador Android.

- [x] **Task 08: Encerramento da Sprint (OBRIGATÓRIO)**
  - Execute a skill `@commit` para analisar as mudanças e realizar o commit padronizado.
  - Execute a skill `@gerando-relatorios-sprint.md` para criar o relatório na pasta `Sprint Report/Sprint 3/`.
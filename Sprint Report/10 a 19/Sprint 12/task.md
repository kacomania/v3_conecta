# Task List - Sprint 12: Sincronização de Categorias Mobile-Web

- [x] **Task 01: Inicialização e Git**
  - Crie e mude para a branch: `git checkout -b feature/sprint-12-categorias-sync`.

- [x] **Task 02: [WEB] Server Actions para Categorias**
  - No diretório `gestao_conecta/`, adicione/atualize as Server Actions para realizar o CRUD na tabela `categories` (inserindo `name` e `department_id`).

- [x] **Task 03: [WEB] UI de Gestão de Categorias**
  - Crie a rota `src/app/(admin)/dashboard/categorias/page.tsx`.
  - Implemente a listagem de categorias e um formulário para criar novas (com um select buscando os departamentos disponíveis).

- [x] **Task 04: [MOBILE] Integração do Repositório (Flutter)**
  - Mude para o diretório `cidadao_conecta/`.
  - Atualize `lib/data/repositories/requests_repository_impl.dart` (na verdade `categoria_repository_impl.dart`).
  - Implemente o método `getCategories()` substituindo os mocks por uma query real: `supabase.from('categories').select()`.

- [x] **Task 05: [MOBILE] State Management (Riverpod)**
  - Atualize ou crie o `categories_controller.dart` (`FutureProvider` ou `AsyncNotifier`) para invocar `getCategories()` e expor a lista de `CategoryModel`.

- [x] **Task 06: [MOBILE] UI de Seleção de Categoria**
  - Na `SelectCategoryScreen` (implementado em `novo_chamado_page.dart`), consuma o provider de categorias usando `ref.watch`.
  - Trate os estados de `loading`, `error` e `data`.
  - Ao selecionar um card (dropdown) de categoria, envie o `id` (UUID) para o `RequestDraftController`.

- [x] **Task 07: [MOBILE] Teste de Submissão**
  - Revisado o `RequestDraftController` (novo_chamado_view_model) e o repositório de submissão (`occurrence_repository_impl`). A inserção na tabela `occurrences` agora envia um `category_id` válido selecionado do banco.

- [ ] **Task 08: Encerramento da Sprint (OBRIGATÓRIO)**
  - Volte para a raiz do workspace integrado.
  - Execute a skill `@commit`.
  - Execute a skill `@gerando-relatorios-sprint.md` para a pasta `Sprint Report/Sprint 12/`.
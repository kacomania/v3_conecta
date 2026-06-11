# Task List - Sprint 4: Draft & Câmera

- [x] **Task 01: Inicialização e Git**
  - Crie e mude para a branch: `git checkout -b feature/sprint-4-draft-camera`.

- [x] **Task 02: Integração de Design via MCP (Google Stitch)**
  - Use o MCP do Google Stitch para buscar o design do projeto ID `13457475318460215628`.
  - Salve ou atualize o arquivo `DESIGN.md` com as instruções retornadas e leia-o para guiar a UI.

- [x] **Task 03: Camada de Domínio (Draft)**
  - Crie `lib/domain/entities/draft_solicitacao.dart`.

- [x] **Task 04: Gerência de Estado (Riverpod)**
  - Crie `lib/ui/novo_chamado/viewmodels/novo_chamado_view_model.dart`.
  - Implemente a lógica para atualizar descrição, categoria, endereço e gerenciar a lista de fotos (adicionar/remover).

- [x] **Task 05: Integração de Câmera/Galeria**
  - Adicione a dependência necessária no `pubspec.yaml` (ex: `image_picker`).
  - Crie um helper ou service na camada de infraestrutura (se necessário) para abstrair a chamada nativa da câmera/galeria.

- [x] **Task 06: Componentes de UI e Página**
  - Baseado no `DESIGN.md`, crie a `NovoChamadoPage` em `lib/ui/novo_chamado/pages/novo_chamado_page.dart`.
  - Crie os widgets internos (formulário, botão de foto, preview de imagens) mantendo-os "burros".

- [x] **Task 07: Roteamento**
  - Adicione a rota `/novo-chamado` no `app_router.dart` (GoRouter).
  - Conecte o `ActionCard` da `HomePage` (feito na Sprint 3) para navegar para esta nova rota.

- [x] **Task 08: Encerramento da Sprint**
  - Execute a skill `@commit`.
  - Execute a skill `@gerando-relatorios-sprint.md` para a pasta `Sprint Report/Sprint 4/`.

- [x] **Task 09: Adicionar Rota de Cadastro**
  - Adicione a rota `/register` (nome `RouteNames.register`) no `app_router.dart` e `route_names.dart`.

- [x] **Task 10: Criação da UI de Cadastro**
  - Crie `lib/ui/features/auth/screens/register_screen.dart` seguindo a identidade visual (Cidadão Conecta) com campos de Nome, E-mail, Senha e Confirmar Senha.

- [x] **Task 11: Lógica de Autenticação (Signup)**
  - Implemente e conecte a chamada de `signUp` no Riverpod (`AuthController` e `AuthRepository`), usando o Supabase.
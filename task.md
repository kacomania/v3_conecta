# Task List - Sprint 34: Refinamentos de UX Mobile

- [x] **Task 01: Inicialização e Git**
  - Crie a branch: `git checkout -b feature/sprint-34-ux-refinements`.
  - Todo o trabalho desta Sprint será no Flutter (`cidadao_conecta/`).

- [x] **Task 02: Limpeza do Card de Perfil**
  - Em `home_page.dart`, localize e remova o `ActionCard` referente ao "Meu Perfil".

- [x] **Task 03: Confirmação de Logout**
  - Localize as ações de Logout (no ícone da AppBar e na `MeuPerfilPage`).
  - Intercepte a ação com um `showDialog` retornando um `AlertDialog` (Título: "Sair da conta?", Ações: Cancelar / Sair).
  - Execute o `signOut()` apenas se o usuário confirmar.

- [x] **Task 04: Limite de Categorias na Home**
  - Na `HomePage`, onde as categorias são renderizadas, aplique o limite de no máximo 4 itens (usando `.take(4)` no array retornado pelo Provider).

- [x] **Task 05: Atalho de Pré-seleção (Novo Chamado)**
  - Atualize o `onTap` dos cards de Categoria na `HomePage`.
  - O clique deve chamar o método do ViewModel (ex: `ref.read(novoChamadoViewModelProvider.notifier).setCategory(...)`) passando os dados da categoria clicada.
  - Em seguida, utilize `context.push('/novo-chamado')`.
  - Certifique-se de que a `NovoChamadoPage` e seu Dropdown reajam a esse estado inicial preenchido.

- [x] **Task 06: Validação Interna do Dibro (Testes)**
  - Leia o arquivo `docs/tests_dibro_sprint_34.md`.
  - Execute as verificações descritas e reporte os resultados no chat.

- [x] **Task 07: Encerramento da Sprint**
  - **Ação:** Fechar a sprint executando os relatórios de encerramento.
  - **Resultado Esperado:** Código commitado, relatórios gerados e arquivos de planejamento movidos.ta `Sprint Report/Sprint 34/`.
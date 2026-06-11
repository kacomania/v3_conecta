# Task List - Sprint 22: Conformidade LGPD e Exclusão de Conta

- [x] **Task 01: Inicialização e Git**
  - Crie a branch: `git checkout -b feature/sprint-22-lgpd-compliance`.

- [x] **Task 02: [BD] Alteração de Constraints (Anonimização)**
  - Use o MCP do Postgres. Localize a constraint de Foreign Key de `user_id` na tabela `occurrences` e `occurrence_timeline` (se aplicável).
  - Altere o comportamento de `ON DELETE CASCADE` para `ON DELETE SET NULL`.

- [x] **Task 03: [BD] RPC de Exclusão de Conta**
  - Crie a função SQL `delete_user_account()` com `SECURITY DEFINER`.
  - A função deve extrair o ID do usuário logado via `auth.uid()` e deletar o registro correspondente diretamente na tabela `auth.users` (o Supabase cuidará de limpar a tabela `user_roles` se esta tiver delete cascade).

- [x] **Task 04: [MOBILE] Checkbox de Termos de Uso**
  - No `cidadao_conecta/`, atualize a `RegisterScreen`.
  - Adicione o checkbox de Termos de Uso. Valide para que o formulário só possa ser submetido se a caixa estiver marcada.

- [x] **Task 05: [MOBILE] Repositório e Exclusão de Conta**
  - Adicione o método `deleteAccount()` no `AuthRepositoryImpl` chamando `supabase.rpc('delete_user_account')`.
  - Atualize a `MeuPerfilViewModel` para suportar essa ação (tratando loading e erros).

- [x] **Task 06: [MOBILE] UI de Exclusão (Danger Zone)**
  - Atualize a `MeuPerfilPage`. Adicione o botão "Excluir Minha Conta" com cor vermelha.
  - Implemente um Dialog de confirmação antes de disparar a ação para a ViewModel. Ao concluir, o app deve deslogar automaticamente.

- [x] **Task 07: Validação Interna do Dibro (Testes)**
  - Leia o arquivo `docs/tests_dibro_sprint_22.md`.
  - Execute as verificações descritas e reporte o status no chat aguardando aprovação.

- [x] **Task 08: Encerramento da Sprint (OBRIGATÓRIO)**
  - Execute a skill `@commit` e `@gerando-relatorios-sprint.md` para a pasta `Sprint Report/Sprint 22/`.
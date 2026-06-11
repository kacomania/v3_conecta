# Task List - Sprint 13: Gestão de Conta e Meu Perfil (Mobile)

- [ ] **Task 01: Inicialização e Git**
  - Crie e mude para a branch: `git checkout -b feature/sprint-13-meu-perfil-mobile`.
  - O trabalho desta sprint será focado exclusivamente na pasta `cidadao_conecta/`.

- [ ] **Task 02: Atualização do Repositório de Auth**
  - Revise `AuthRepository` e `AuthRepositoryImpl`.
  - Garanta que os métodos `signOut()`, `resetPassword(String email)` e `updateProfile(String name)` estejam implementados comunicando com o Supabase Auth.

- [ ] **Task 03: Tela de Recuperação de Senha**
  - Crie `lib/ui/features/auth/screens/recovery_screen.dart`.
  - Implemente o formulário e conecte ao método de `resetPassword`.
  - Atualize o GoRouter (`app_router.dart`) com a rota `/recovery` e adicione o link "Esqueci minha senha" na `LoginScreen`.

- [ ] **Task 04: ViewModel do Perfil**
  - Crie `lib/ui/features/perfil/viewmodels/meu_perfil_view_model.dart`.
  - Implemente as funções para chamar a atualização de nome e o logout, tratando os estados de loading e erro.

- [ ] **Task 05: Construção da Tela Meu Perfil**
  - Crie `lib/ui/features/perfil/screens/meu_perfil_page.dart`.
  - Adicione a interface seguindo o Design System: Avatar, informações de contato, botão de editar perfil, botão de alterar prefeitura (tenant) e botão de Logout (com destaque visual em vermelho).
  - Atualize o `BottomNavBar` ou a `HomePage` para incluir um atalho para a tela de Perfil.

- [ ] **Task 06: Testes de Fluxo**
  - Certifique-se de que, ao clicar em "Sair", o usuário é imediatamente deslogado e o GoRouter o joga de volta para a tela de Login.

- [x] **Task 07: Encerramento da Sprint (OBRIGATÓRIO)**
  - Volte para a raiz do workspace integrado.
  - Execute a skill `@commit`.
  - Execute a skill `@gerando-relatorios-sprint.md` para a pasta `Sprint Report/Sprint 13/`.
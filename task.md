# Task List - Sprint 33: Ajustes na tela de login do APP

- [x] **Task 01: Inicialização e Git**
  - Crie a branch: `git checkout -b feature/sprint-33-login-enhancements`.
  - Todo o trabalho desta Sprint será na pasta `cidadao_conecta/`.

- [x] **Task 02: Sanitização de Inputs (Trim)**
  - No `AuthController` (ou ViewModel de Login/Cadastro), modifique as funções de `signIn` e `signUp` para aplicar `.trim()` nos campos de texto antes de enviá-los ao Supabase.

- [x] **Task 03: Validador de CPF e UI de Cadastro**
  - Crie `lib/core/utils/validators.dart` com a função matemática de validação de CPF.
  - Atualize a `RegisterScreen` adicionando o campo CPF (obrigatório com máscara). Exiba erro se for inválido.

- [x] **Task 04: Toggle de Mostrar/Ocultar Senha**
  - Atualize os campos de senha na `LoginScreen` e `RegisterScreen`.
  - Adicione o ícone de olho (`Icons.visibility` / `visibility_off`) que alterna a propriedade `obscureText` usando estado local (`setState`).

- [x] **Task 05: Configuração Google Sign-In**
  - Adicione a dependência `google_sign_in` no `pubspec.yaml`.
  - Atualize o `AuthRepositoryImpl` com o método de autenticação do Google (`signInWithIdToken`).

- [x] **Task 06: UI de Login com Google**
  - Na `LoginScreen`, adicione o botão "Entrar com Google".
  - Conecte o botão à nova função do repositório, garantindo que o loading state seja respeitado.

- [x] **Task 07: Validação Interna do Dibro (Testes)**
  - Leia o arquivo `docs/tests_dibro_sprint_33.md`.
  - Execute as verificações (Testes Unitários) descritas.

- [x] **Task 08: Encerramento da Sprint (OBRIGATÓRIO)**
  - Execute a skill `@commit` e `@gerando-relatorios-sprint.md` para a pasta `Sprint Report/Sprint 33/`.
# Blueprint Summary - Sprint 13 (Mobile)

## Novas Implementações: Gestão de Conta & Meu Perfil

### Roteamento e Telas (UI)
- `[NEW]` [recovery_screen.dart](file:///e:/V3_conecta/cidadao_conecta/lib/ui/features/auth/screens/recovery_screen.dart) - Tela com formulário para redefinição de senha (`/recovery`). Acessível via link de ajuda na tela de Login.
- `[NEW]` [meu_perfil_page.dart](file:///e:/V3_conecta/cidadao_conecta/lib/ui/features/perfil/screens/meu_perfil_page.dart) - Interface para visualização do usuário ativo, oferecendo opções de alteração de nome, troca da prefeitura (Tenant) associada e a opção de Logout (Sair).
- `[MODIFY]` [home_page.dart](file:///e:/V3_conecta/cidadao_conecta/lib/ui/home/pages/home_page.dart) - A "Landpage" do aplicativo foi atualizada. O botão estático de Logout foi removido e, em seu lugar, foram adicionados um novo ícone de perfil no AppBar e um ActionCard (atalho rápido), guiando o usuário nativamente para a tela "Meu Perfil". O botão de logoff definitivo reside agora dentro desta página de perfil.

### Controle de Estado (ViewModel)
- `[NEW]` [meu_perfil_view_model.dart](file:///e:/V3_conecta/cidadao_conecta/lib/ui/features/perfil/viewmodels/meu_perfil_view_model.dart) - `AsyncNotifier` controlando os fluxos de edição e Logout, isolando a UI da comunicação direta com os repositórios.

### Dados e Integração Auth
- `[MODIFY]` `AuthRepository` & `AuthRepositoryImpl` - Contratos e implementações atualizadas para abraçar os métodos `resetPassword` e `updateProfile`.
- `[MODIFY]` `SupabaseAuthService` - Integração direta às APIs `resetPasswordForEmail` e `updateUser` do Supabase SDK.

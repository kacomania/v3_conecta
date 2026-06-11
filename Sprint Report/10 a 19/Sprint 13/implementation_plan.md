# Implementation Plan - Sprint 13: Gestão de Conta e Meu Perfil (Mobile)

## 🎯 Objetivo
Finalizar os fluxos de conta do cidadão no aplicativo Flutter (`cidadao_conecta`). Implementar a tela "Meu Perfil" (visualização de dados, edição de nome, botão de logout e troca de prefeitura) e a tela de "Recuperação de Senha" (Esqueci minha senha), garantindo a integração total com o Supabase Auth.

## 🏗️ Decisões Arquiteturais (Clean Architecture & Riverpod)

### 1. Camada de Domínio e Dados (Auth)
- **AuthRepository:** Adicionar/verificar os contratos para `updateProfile(String name)`, `signOut()` e `resetPassword(String email)`.
- **AuthRepositoryImpl:** Implementar a chamada `supabase.auth.updateUser()` para atualizar o metadado `name`. Implementar `resetPasswordForEmail()`.

### 2. State Management (Riverpod 3.x)
- **`MeuPerfilViewModel` (`AsyncNotifier`):** Gerenciar o estado da tela de perfil, controlando o loading durante a atualização de dados ou logout.
- O `authStateProvider` (que escuta o Supabase Auth) já deve lidar automaticamente com o redirecionamento do GoRouter após o `signOut()`.

### 3. Interface de Usuário (UI)
- **`MeuPerfilPage`:** 
  - Exibir Avatar (placeholder com as iniciais do usuário), Nome, Email e a Prefeitura atual.
  - Botão para "Editar Nome" (abre um bottom sheet ou dialog).
  - Botão para "Trocar de Cidade" (limpa a preferência de tenant e redireciona para `/select-tenant`).
  - Botão de "Sair / Logout" (desloga e redireciona para `/login`).
- **`RecoveryScreen`:**
  - Tela simples com campo de e-mail e botão "Enviar link de recuperação". Acessada a partir da tela de Login.

## 🔀 Estratégia de Git
- Branch: `feature/sprint-13-meu-perfil-mobile`.
- Fechamento padrão com `@commit` e `@gerando-relatorios-sprint.md`.
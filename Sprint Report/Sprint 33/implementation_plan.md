# Implementation Plan - Sprint 33: Ajustes na Tela de Login do App

## 🎯 Objetivo
Aprimorar a experiência e a segurança na entrada do Cidadão Conecta. Introduzir a autenticação via Google, exigir e validar o CPF no cadastro, aplicar sanitização de inputs (trim) e adicionar o recurso de "Mostrar/Ocultar Senha" para reduzir erros de digitação.

## 🏗️ Decisões Arquiteturais (Flutter & Supabase)

### 1. Autenticação Google (OAuth)
- **Pacote:** Adicionar `google_sign_in` ao Flutter.
- **Supabase Auth:** Utilizar o fluxo nativo do Supabase (`signInWithIdToken`) integrando o token gerado pelo pacote do Google.
- **Domain/Data:** Adicionar `signInWithGoogle()` no `AuthRepository`. O Supabase cuidará de criar o usuário no `auth.users`.

### 2. Validação de CPF e Sanitização
- **Lógica Local:** Criar um validador de CPF em Dart usando o algoritmo padrão (Módulo 11).
- **Sanitização (Trim):** Aplicar `.trim()` nativo nas variáveis de `email`, `nome` e `cpf` antes de invocar o repositório, removendo espaços em branco acidentais da área de transferência.

### 3. Visibilidade de Senha (UI State)
- **Componente:** Atualizar o campo de senha nas telas `LoginScreen` e `RegisterScreen` (ou no `CustomTextField` global) para incluir um `suffixIcon` (olho).
- **State Management:** Utilizar `setState` local (ou Hooks) para alternar a propriedade `obscureText` do input. Conforme o Blueprint, não usaremos Riverpod para esse estado puramente visual e transitório.

## 🔀 Estratégia de Git
- Branch: `feature/sprint-33-login-enhancements`.
- Fechamento padrão com `@commit` e `@gerando-relatorios-sprint.md`.
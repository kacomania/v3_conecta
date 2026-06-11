# Implementation Plan - Sprint 25: Notificações Push Nativas (OS Level)

## 🎯 Objetivo
Implementar notificações Push reais (FCM/APNs) no aplicativo Cidadão Conecta. O sistema deve acordar o celular do cidadão com um alerta na tela de bloqueio sempre que uma nova notificação for gerada no banco de dados.

## 🏗️ Decisões Arquiteturais

### 1. Banco de Dados (Supabase)
- **Tabela `user_devices`:** `id` (UUID), `user_id` (FK), `fcm_token` (TEXT), `platform` (TEXT), `created_at`.
- **RLS:** Usuários podem fazer INSERT/UPDATE/SELECT apenas nos seus próprios tokens.

### 2. Backend Serverless (Supabase Edge Functions)
- **Edge Function `send-push`:** Escrita em TypeScript (Deno). Será responsável por ler o `fcm_token` do usuário alvo e disparar uma requisição nativa usando a biblioteca `npm:firebase-admin`.
- **Autenticação FCM:** O projeto utilizará a Service Account do Google. A credencial será armazenada no Supabase Secrets como `FIREBASE_SERVICE_ACCOUNT` e lida pela Edge Function para gerar o Access Token automaticamente.
- **Database Webhook:** Configurar um webhook no Supabase que escuta `INSERT` na tabela `notifications` (criada na Sprint 17) e dispara automaticamente a Edge Function `send-push`.

### 3. App Mobile (Flutter - `cidadao_conecta`)
- **Dependências:** `firebase_core` e `firebase_messaging`.
- **Domain/Data:** Criar `DeviceTokenRepository` para enviar o `fcm_token` gerado pelo celular para a tabela `user_devices` do Supabase após o Login.
- **Permissões:** Solicitar permissão de notificação nativa ao abrir o app.

### 4. Ajustes Finais (UX/Navegação)
- **Edge Function (Payload):** Alterar o `title` do push para exibir o Protocolo do chamado (primeiros 8 caracteres do `occurrence_id` em maiúsculo) em vez do título genérico. Adicionar `occurrence_id` no campo `data` do payload.
- **App (Deep Linking):** Adicionar ouvintes `FirebaseMessaging.onMessageOpenedApp` e `FirebaseMessaging.instance.getInitialMessage` no `main.dart` (ou configuração do `GoRouter`) para capturar o toque na notificação e navegar o usuário diretamente para a tela `/chamado/:id`.

## 🔀 Estratégia de Git
- Branch: `feature/sprint-25-push-notifications`.
- Fechamento padrão com `@commit` e `@gerando-relatorios-sprint.md`.
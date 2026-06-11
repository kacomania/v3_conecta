# Implementation Plan - Sprint 17: Central de Notificações In-App (Mobile)

## 🎯 Objetivo
Manter o cidadão engajado e informado criando uma Central de Notificações no aplicativo Flutter. As notificações serão geradas automaticamente pelo banco de dados (Triggers) sempre que um servidor da prefeitura inserir uma nota pública ou alterar o status do chamado no Portal Web.

## 🏗️ Decisões Arquiteturais

### 1. Banco de Dados (Supabase)
- **Nova Tabela `notifications`:** `id` (UUID), `user_id` (FK), `occurrence_id` (FK), `message` (TEXT), `is_read` (BOOLEAN DEFAULT FALSE), `created_at` (TIMESTAMPTZ).
- **Automação (Trigger):** Em vez de alterar o código do Next.js, criaremos uma Trigger no Postgres. Sempre que houver um `INSERT` na tabela `occurrence_timeline` onde `is_public = true`, o banco descobre o `user_id` dono do chamado e insere um registro na tabela `notifications`.
- **Segurança (RLS):** O cidadão só pode fazer `SELECT` e `UPDATE` (para marcar como lida) nas notificações onde `user_id = auth.uid()`.

### 2. App Mobile (Flutter - `cidadao_conecta`)
- **Camada de Dados:** Criar `NotificationRepository` com métodos para buscar as notificações como um `Stream` (Realtime) e para marcar como lida (`markAsRead`).
- **State Management (Riverpod):** Um `StreamProvider` ficará ouvindo a tabela `notifications`. Ele alimentará tanto a lista principal quanto o "Badge" (bolinha vermelha com contador numérico) no ícone do sininho.
- **UI:** 
  - Adicionar o ícone de Sino na `HomePage`.
  - Criar a `NotificationsScreen`. Ao clicar em uma notificação, o app marca como lida e navega para a `RequestDetailsScreen` usando o `occurrence_id`.

## 🔀 Estratégia de Git
- Branch: `feature/sprint-17-in-app-notifications`.
- Fechamento padrão com `@commit` e `@gerando-relatorios-sprint.md`.
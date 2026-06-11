# Implementation Plan - Sprint 26: Comunicados Oficiais (Defesa Civil)

## 🎯 Objetivo
Criar um canal de comunicação de massa (Broadcast) da prefeitura para a população. Gestores poderão enviar alertas e comunicados que gerarão Push Notifications em lote para os cidadãos e ficarão salvos em um mural no aplicativo móvel.

## 🏗️ Decisões Arquiteturais

### 1. Banco de Dados e Edge Functions (Supabase)
- **Tabela `announcements`:** `id`, `prefeitura_id` (FK), `title`, `body`, `severity` (ENUM: INFO, WARNING, EMERGENCY), `created_at`.
- **Edge Function (`broadcast-push`):** Nova função Deno. Acionada via Webhook no `INSERT` da tabela `announcements`. A função buscará **todos** os `fcm_token` da tabela `user_devices` vinculados aos usuários que pertencem àquela `prefeitura_id` e usará o `sendMulticast` do Firebase Admin para enviar a notificação em lote.

### 2. Portal Web (Next.js - `gestao_conecta`)
- **Rota `/dashboard/comunicados`:** Acessível para `MANAGER` e `CITY_ADMIN`.
- **UI:** Formulário para criação do comunicado (Título, Mensagem, Severidade) e uma tabela listando o histórico de comunicados enviados.
- **Server Action:** `createAnnouncement` para inserir na tabela do banco.

### 3. App Mobile (Flutter - `cidadao_conecta`)
- **Domain/Data:** Criar o repositório para buscar os avisos (`SELECT * FROM announcements WHERE prefeitura_id = ? ORDER BY created_at DESC`).
- **UI:** Adicionar uma nova aba no `BottomNavBar` chamada "Avisos" ou "Mural".
- **Design:** Diferenciar as cores dos cards baseados na severidade (Azul para INFO, Amarelo para WARNING, Vermelho para EMERGENCY).

## 🔀 Estratégia de Git
- Branch: `feature/sprint-26-comunicados-oficiais`.
- Fechamento padrão com `@commit` e `@gerando-relatorios-sprint.md`.
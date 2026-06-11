# Implementation Plan - Sprint 30: API Pública e Webhooks

## 🎯 Objetivo
Habilitar a integração do ecossistema Conecta com sistemas legados de prefeituras (ERPs). Criar um módulo de desenvolvedores para gestão de Webhooks e chaves de API, além da infraestrutura serverless para disparar eventos em tempo real para servidores externos.

## 🏗️ Decisões Arquiteturais (Supabase & Next.js)

### 1. Banco de Dados (Supabase)
- **Tabela `webhooks_endpoints`:** `id`, `prefeitura_id` (FK), `url` (TEXT), `secret_token` (TEXT), `is_active` (BOOLEAN DEFAULT TRUE), `created_at`.
- **Tabela `api_keys`:** `id`, `prefeitura_id` (FK), `name` (TEXT), `key_hash` (TEXT), `created_at`.
- **Segurança (RLS):** Apenas gestores com `access_level >= 4` (CITY_ADMIN, SYSTEM_ADMIN) podem gerenciar integrações.

### 2. Backend Serverless (Edge Functions)
- **Edge Function `webhook-dispatcher`:** Nova função em Deno. Será acionada por uma Database Trigger (Webhook nativo do Postgres) sempre que houver `INSERT` ou `UPDATE` na tabela `occurrences`.
- **Lógica:** A função lê o `prefeitura_id` do chamado, busca se existe uma URL ativa na tabela `webhooks_endpoints` para aquela prefeitura e faz um `fetch(url, { method: 'POST', body: json })`. A função não deve bloquear o banco (disparo *fire-and-forget*).

### 3. Portal Web (Next.js - `gestao_conecta`)
- **Rota `/dashboard/desenvolvedores`:** Nova página administrativa.
- **UI:** Formulários simples para cadastrar/editar a URL do Webhook da prefeitura e para gerar uma Chave de API (exibida apenas uma vez).

## 🔀 Estratégia de Git
- Branch: `feature/sprint-30-api-webhooks`.
- Fechamento padrão com `@commit` e `@gerando-relatorios-sprint.md`.
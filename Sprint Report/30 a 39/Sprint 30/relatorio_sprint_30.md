# Relatório de Sprint - Sprint 30: API Pública e Webhooks

## 1. Resumo Executivo
Na Sprint 30, implementamos a infraestrutura inicial para a **Integração Legada (M2M)** entre o ecossistema Cidadão Conecta e os sistemas internos (ERPs) das prefeituras. 

O principal objetivo de negócios alcançado foi possibilitar que as prefeituras recebam notificações assíncronas em tempo real (Webhooks) sempre que um cidadão registrar ou interagir com uma ocorrência. Isso elimina a necessidade de consultas manuais, acelerando a capacidade de resposta das prefeituras. Adicionalmente, estabelecemos o módulo de "Portal do Desenvolvedor" com a emissão segura de Chaves de API (API Keys), pavimentando a infraestrutura para consumo de endpoints REST no futuro.

## 2. Blueprint (Arquitetura)
As decisões técnicas mantiveram as premissas de Clean Architecture e Serverless via ecossistema Supabase e Next.js:

- **Banco de Dados (Postgres) & Segurança (RLS):** 
  - Criação das tabelas `webhooks_endpoints` (limitada por `UNIQUE` constraint no `prefeitura_id`) e `api_keys`.
  - RLS (Row Level Security): Restrição rigorosa garantindo que apenas Gestores Administrativos (`access_level >= 4`) leiam, criem ou revoguem webhooks e chaves.

- **Supabase Edge Functions & Event Triggers:**
  - Implementada a Trigger nativa `occurrences_webhook_dispatcher` acionada em operações de `AFTER INSERT OR UPDATE` sobre a tabela principal de `occurrences`.
  - A Trigger efetua uma chamada (HTTP POST) transparente (Fire-and-Forget) para a Edge Function `webhook-dispatcher` desenvolvida em Deno.
  - Resiliência: A Edge Function foi encapsulada com blocos `try/catch` de modo a isolar instabilidades de rede e timeouts dos servidores das prefeituras. Ela absorve os erros (status 500) e finaliza o processo graciosamente (`console.error`), não travando o evento do banco.

- **Painel de Gestão Conecta (Next.js):**
  - Criação da página técnica em `src/app/(admin)/dashboard/desenvolvedores/page.tsx`.
  - Server Actions em `src/actions/developers.ts` que manipulam a API criptográfica. As Chaves de API geradas em texto pleno são apresentadas de maneira efémera na UI e apenas seus *Hashes Criptográficos (SHA-256)* são armazenados no Supabase, adotando um protocolo "Zero-Trust" contra vazamentos em dumps de banco de dados.

## 3. Walkthrough (Log de Validação)
Durante a bateria de testes interativos (Dibro + Tech Lead), as seguintes validações e resoluções foram conduzidas:

- **Migrações e Banco de Dados:**
  - Migração executada com sucesso (`07_api_webhooks.sql`). Teste provou a efetividade do bloqueio de RLS para perfis "USER".
- **Comportamento Múltiplo de Triggers Validado:**
  - Foi questionado pelo Tech Lead sobre o comportamento de múltiplos requests no Webhook. Investigação arquitetural comprovou que o disparo duplo (`INSERT` seguido de `UPDATE`) está correto, dado que o `INSERT` da Ocorrência é imediatamente procedido por um `UPDATE` da Edge Function de Inteligência Artificial (`generate-embedding`), e ambas as fases disparam eventos ao webhook para sistemas externos acompanharem em "Real-Time".
- **Ajustes e Fixes Adicionais (Flutter & Autenticação):**
  - Bugfix: O Aplicativo Flutter (`cidadao_conecta`) não atualizava o dropdown de categorias adequadamente no login da "Prefeitura Doom". Corrigido a injeção de dependência atualizando o `currentTenantProvider` de forma síncrona dentro do listener global de rotas (`app_router.dart`).
  - Cadastro nativo: Identificada incompatibilidade do Hash `$2a$06$` nativo do Postgres (`pgcrypto`) contra os `$2a$10$` exigidos pelo Supabase GoTrue na criação de usuários. Conta do `city_admin@doom.com` reconstruída usando SDK oficial JS para sanitização do Identity e vinculação de Roles via queries seguras.

---
**Status da Sprint:** ✅ Concluída e Arquivada.

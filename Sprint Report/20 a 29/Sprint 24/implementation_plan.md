# Implementation Plan - Sprint 24: Portal de Transparência Público

## 🎯 Objetivo
Criar uma página web pública (sem necessidade de autenticação) para prestação de contas da Prefeitura. O Portal de Transparência exibirá métricas consolidadas (KPIs de resolução, SLA) e um mapa de zeladoria anonimizado, cumprindo requisitos legais de transparência governamental.

## 🏗️ Decisões Arquiteturais (Next.js & Supabase)

### 1. Banco de Dados (Supabase RPCs & Segurança)
- **Desafio de RLS:** Como a tabela `occurrences` é protegida pelo RLS (usuários não logados não podem ler tudo), criaremos uma função RPC `get_public_transparency_metrics(p_prefeitura_id UUID)` com a diretiva `SECURITY DEFINER`.
- **Anonimização:** A RPC retornará apenas dados agregados (totais) e, para o mapa, retornará apenas as coordenadas (lat/lng), categoria e data de chamados `COMPLETED`, omitindo propositalmente o `user_id` e a descrição para proteger a privacidade (LGPD).

### 2. Portal Web (Next.js - `gestao_conecta`)
- **Nova Rota Pública:** `src/app/transparencia/[id]/page.tsx` (fora do grupo `(admin)` para não ser bloqueada pelo middleware de autenticação).
- **UI (Métricas):** Cards exibindo "Total de Problemas Resolvidos", "Satisfação da População (CSAT)" e "Chamados em Andamento".
- **UI (Mapa Público):** Reutilizar o componente de mapa (`react-leaflet`) para plotar os *pins* dos chamados concluídos, usando a cor primária da prefeitura.

## 🔀 Estratégia de Git
- Branch: `feature/sprint-24-portal-transparencia`.
- Fechamento padrão com `@commit` e `@gerando-relatorios-sprint.md`.
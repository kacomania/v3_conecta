# Implementation Plan - Sprint 8: Dashboard do Servidor (Web Portal)

## 🎯 Objetivo
Construir a fundação do Portal Web Administrativo (`gestao_conecta`) em Next.js. Isso inclui a tela de login para servidores, a proteção de rotas (middleware) e o Dashboard principal exibindo a lista (grid/tabela) de chamados da prefeitura, consumindo o Supabase.

## 🏗️ Decisões Arquiteturais (Next.js App Router)

### 1. Autenticação e Middleware
- **Pacote:** Utilizar `@supabase/ssr` para gerenciar cookies e sessão no Next.js App Router de forma segura.
- **Middleware:** Proteger as rotas `/dashboard` e `/requests`. Usuários não logados devem ser redirecionados para `/login`. Usuários sem nível de acesso administrativo (ex: `USER`) não devem acessar o portal.

### 2. Estrutura de Rotas (App Router)
- `src/app/login/page.tsx`: Tela de login isolada.
- `src/app/(admin)/layout.tsx`: Layout compartilhado do painel (Sidebar de navegação, Topbar).
- `src/app/(admin)/dashboard/page.tsx`: Visão geral e listagem de triagem de chamados.

### 3. Busca de Dados (Data Fetching)
- Realizar consultas ao Supabase utilizando **React Server Components (RSC)** sempre que possível para garantir performance e segurança.
- A query na tabela `occurrences` já será automaticamente filtrada pelo RLS (o servidor só verá chamados da sua `prefeitura_id`).

### 4. UI e Estilização
- Utilizar **Tailwind CSS** (já configurado) para componentização rápida.
- Consultar o `DESIGN.md` (gerado pelo Google Stitch) na seção "Portal Web (Desktop)" para definir as cores, tipografia e o layout dos cards/tabelas de SLA.

## 🔀 Estratégia de Git
- Branch: `feature/sprint-8-portal-web-dashboard`.
- Fechamento padrão com `@commit` e `@gerando-relatorios-sprint.md`.
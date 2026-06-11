# Implementation Plan - Sprint 7 (Refatorada): Limpeza Mobile & Setup Gestão Web

## 🎯 Objetivo
Corrigir o desvio arquitetural da sprint anterior removendo todo o código administrativo (UI, Rotas e Repositórios) do aplicativo Flutter (`cidadao_conecta`). Em seguida, inicializar o repositório do Portal Web Administrativo (`gestao_conecta`) utilizando Next.js (React), garantindo a separação estrita das plataformas conforme o Master Blueprint v1.0.

## 🏗️ Decisões Arquiteturais

### 1. Limpeza do App Mobile (Flutter - `cidadao_conecta`)
- **Remoção de UI:** Deletar completamente a pasta `lib/ui/admin/` e todos os seus ViewModels e Widgets.
- **Roteamento:** Remover as rotas `/admin/*` do GoRouter. Qualquer usuário autenticado (seja `USER` ou `ATTENDANT`) deve ser redirecionado para `/home` (o Servidor usará o app mobile apenas com o "chapéu" de cidadão).
- **Repositório:** Remover métodos administrativos (`updateRequestStatus`, `addInternalNote`) do `OccurrenceRepository` e `OccurrenceRepositoryImpl`.
- **O que Fica:** A política RLS no Supabase e a captura da `role` no `AppUser` continuam, pois são regras vitais de segurança e fundação.

### 2. Setup do Portal Web (Next.js - `gestao_conecta`)
- **Tecnologia:** Next.js (App Router), TypeScript, Tailwind CSS.
- **Estrutura:** O projeto será criado em uma nova pasta na raiz do workspace (lado a lado com `cidadao_conecta`).
- **Integração:** Instalação do `@supabase/supabase-js` para conectar ao mesmo backend.

## 🔀 Estratégia de Git
- Branch: `feature/sprint-7-refatorada-cleanup-web`.
- Fechamento padrão com `@commit` e `@gerando-relatorios-sprint.md`.
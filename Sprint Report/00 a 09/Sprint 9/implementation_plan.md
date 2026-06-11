# Implementation Plan - Sprint 9: Gestão de Chamado (Web Portal)

## 🎯 Objetivo
Construir a interface de detalhes do chamado (`/dashboard/chamado/[id]`) no Portal Web (Next.js). Permitir que os servidores visualizem os dados completos da ocorrência, alterem seu status e insiram atualizações na `occurrence_timeline` (públicas ou internas).

## 🏗️ Decisões Arquiteturais (Next.js App Router)

### 1. Estrutura de Rotas
- **Página de Detalhes:** `src/app/(admin)/dashboard/chamado/[id]/page.tsx`. Esta página fará o fetch dos dados da ocorrência, incluindo as fotos (URL do Storage) e o cruzamento com a tabela de categorias e departamentos.

### 2. Mutação de Dados (Server Actions)
- Utilizar **Next.js Server Actions** (`"use server"`) em `src/actions/chamados.ts` para manipular o banco de forma segura.
- **Ação 1 (`updateStatus`):** Atualiza a coluna `status` na tabela `occurrences`.
- **Ação 2 (`addTimelineNote`):** Insere um novo registro na tabela `occurrence_timeline`. O campo `is_public` será `true` se a nota for para o cidadão, e `false` se for uma nota restrita aos servidores.

### 3. Integração com o App Mobile
- Como criamos a tela de Linha do Tempo no app Flutter na Sprint 6 (consultando `is_public = true`), qualquer nota pública adicionada aqui no Next.js refletirá instantaneamente para o cidadão no mobile.

### 4. UI e Estilização
- Seguir o padrão do Tailwind CSS.
- Layout dividido: Lado esquerdo com as informações do chamado e foto; Lado direito com o formulário de mudança de status e o feed da linha do tempo.

## 🔀 Estratégia de Git
- Branch: `feature/sprint-9-gestao-chamado-web`.
- Fechamento padrão com `@commit` e `@gerando-relatorios-sprint.md`.
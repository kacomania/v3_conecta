# Implementation Plan - Sprint 14: Analytics e Relatórios (Web Portal)

## 🎯 Objetivo
Construir o painel de Estatísticas (Analytics) no Portal Web (`gestao_conecta`). O painel fornecerá aos gestores da Prefeitura (Managers e Admins) uma visão macro da zeladoria, com Cards de KPIs (Total de Chamados, Em Andamento, Concluídos) e Gráficos (Chamados por Categoria/Departamento).

## 🏗️ Decisões Arquiteturais (Next.js & Supabase)

### 1. Banco de Dados (Supabase)
- **Views ou RPCs:** O PostgREST (API padrão do Supabase) possui limitações nativas com agregações complexas (`GROUP BY`). Para resolver isso elegantemente, criaremos *Views* SQL no PostgreSQL (ex: `vw_occurrences_stats`) ou funções RPC para calcular as estatísticas sumarizadas por `prefeitura_id` e `department_id`.

### 2. Frontend Web (Next.js)
- **Nova Rota:** Criação de `src/app/(admin)/dashboard/estatisticas/page.tsx`.
- **Biblioteca Gráfica:** Utilizaremos a biblioteca `recharts` (padrão de mercado para React) para renderizar os gráficos de barras e de pizza, mantendo o visual limpo do Tailwind.
- **Server Actions:** Criação de `src/actions/analytics.ts` para buscar as métricas já mastigadas pelo banco de dados, mantendo a página como um Server Component rápido.

### 3. Integração de UI
- Adicionar o link "Estatísticas" na Sidebar principal do layout administrativo.
- Exibir 3 a 4 Cards de KPI no topo (Resumo rápido).
- Exibir 2 gráficos abaixo (ex: Distribuição de Status e Volume por Categoria).

## 🔀 Estratégia de Git
- Branch: `feature/sprint-14-analytics-web`.
- Fechamento padrão com `@commit` e `@gerando-relatorios-sprint.md`.
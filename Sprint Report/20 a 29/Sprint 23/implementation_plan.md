# Implementation Plan - Sprint 23: Painel de Satisfação (CSAT) e Feedbacks

## 🎯 Objetivo
Extrair valor dos dados de avaliação gerados pelos cidadãos. Construir um painel analítico no Portal Web para que os gestores monitorem a Nota Média de Atendimento (CSAT), o desempenho por departamento e leiam os comentários deixados na conclusão dos chamados.

## 🏗️ Decisões Arquiteturais (Next.js & Supabase)

### 1. Banco de Dados (Supabase RPCs)
- **Cálculo de Métricas:** Para evitar overhead no Next.js, criaremos uma função RPC (`get_csat_metrics`) que calcula a nota média global da prefeitura, o total de avaliações, e faz um `GROUP BY` por `department_id` para retornar o ranking de notas médias por secretaria.

### 2. Portal Web (Next.js - `gestao_conecta`)
- **Nova Rota:** `src/app/(admin)/dashboard/satisfacao/page.tsx`.
- **Server Actions:** Criar `src/actions/csat.ts` para invocar a RPC de métricas e fazer um `SELECT` focado em trazer as últimas ocorrências que possuem `feedback_notes IS NOT NULL`.
- **UI (Métricas e Gráficos):** 
  - Cards de KPI: Nota Média (ex: 4.2 / 5.0) e Total de Avaliações.
  - Tabela/Gráfico de Ranking de Departamentos.
- **UI (Feed de Comentários):**
  - Um DataGrid ou Lista rolável exibindo os últimos comentários, a quantidade de estrelas recebidas e um atalho (`<Link>`) que leva direto para os detalhes daquele chamado.

## 🔀 Estratégia de Git
- Branch: `feature/sprint-23-csat-dashboard`.
- Fechamento padrão com `@commit` e `@gerando-relatorios-sprint.md`.
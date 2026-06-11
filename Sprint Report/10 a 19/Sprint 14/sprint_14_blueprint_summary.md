# Blueprint Summary - Sprint 14

## Escopo da Sprint
- **Área**: Gestão Conecta (Next.js Portal)
- **Features Principais**:
  - Analytics & Reports (Gráficos)
  - Configurações do Sistema (Cadastro de Prefeituras e Secretarias)

## Detalhes Técnicos (Checklist de Componentes)

### 1. Banco de Dados (Supabase)
- `[NEW]` **RPC `get_dashboard_metrics`**: Função em PL/pgSQL para sumarização rápida e estruturada (JSONB) dos chamados, respeitando o RLS via ID da prefeitura.
- `[ALTER]` **Tabela `departments`**: Adição de FK `prefeitura_id REFERENCES prefeituras(id)`.

### 2. Frontend (Next.js / React)
- **Rotas Adicionadas:**
  - `src/app/(admin)/dashboard/estatisticas/page.tsx`
  - `src/app/(admin)/dashboard/configuracoes/page.tsx`
- **Componentes Adicionados:**
  - `src/components/analytics-charts.tsx` (Use Client para o Recharts)
  - `src/components/config-forms.tsx` (Use Client para gestão de formulários e estados)
- **Mutações (Server Actions):**
  - `src/actions/analytics.ts`
  - `src/actions/configuracoes.ts`
- **Layout Modificado:**
  - `src/app/(admin)/layout.tsx`: Sidebar atualizada com navegação RBAC para Estatísticas (Livre) e Configurações (`accessLevel >= 5`).

## Referências Arquiteturais
*As diretrizes seguidas obedeceram os princípios estabelecidos no `docs/conecta_v3_master_blueprint.md`.*

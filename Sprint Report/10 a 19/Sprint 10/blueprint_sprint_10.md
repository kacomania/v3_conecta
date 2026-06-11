# Blueprint Técnico - Sprint 10 (Triagem e Dashboard Web)

Este documento atua como o **Master Blueprint da Sprint 10**, detalhando a estrutura arquitetural final das entregas de triagem, estado do banco de dados e as próximas fundações que deverão ser erguidas.

## 1. Arquitetura do Dashboard (Web Portal)
Nesta sprint, o Dashboard (`/dashboard`) passou por uma grande reestruturação para suportar escalabilidade, dividindo as responsabilidades entre Servidor e Cliente.

### 1.1 Data Fetching (Server-Side)
- **Caminho:** `src/app/(admin)/dashboard/page.tsx`
- **Padrão Utilizado:** Next.js App Router (Server Components) com Supabase Auth.
- **Regras de Negócio Implementadas:**
  - Carregamento assíncrono via `createClient()`.
  - Filtro padrão excludente de chamados `COMPLETED` e `REJECTED` (para poupar dados trafegados).
  - *Inner Join* nativo com a tabela `categories` para tradução de `category_id` -> `categories(name)`.

### 1.2 Interactive Data Table (Client-Side)
- **Componente:** `<DashboardTable />`
- **Estratégia:** Client-Side Sorting & Rendering
- **Funcionalidades:**
  - Ordenação imediata na memória (`array.sort()`) baseada na seleção dos cabeçalhos.
  - Alternância de visualização em Linhas (Row Expand) permitindo leitura do `description` sem abrir uma nova tela ou modal.
  - Conversão fluída de Status Textuais (`PENDING`, `ANALYZING`) para Badges de cor via design system embutido no componente.

---

## 2. Lógica de Status e Linha do Tempo (Detalhe do Chamado)
- **Caminho:** `/dashboard/chamado/[id]`
- **Padrão de Mutação:** Next.js Server Actions (`src/actions/chamados.ts`) acionadas por `<form action={...}>`.

### 2.1 Server Action de Atualização (`updateStatus`)
- Protegida por Row Level Security (RLS) no banco de dados.
- Realiza duas operações simultâneas:
  1. Atualiza a tabela `occurrences` (coluna `status`).
  2. Insere um log na tabela `occurrence_timeline` detalhando a transição (Ex: `Status atualizado de PENDING para IN_PROGRESS`).

### 2.2 Revalidação de Cache Nativa
- Ao finalizar qualquer mutação, a ação chama `revalidatePath('/dashboard', 'layout')`. Isso força o Next.js a invalidar o cache da página de detalhes E da listagem principal do Dashboard, garantindo que o novo status reflita em tempo real para o usuário assim que ele voltar para a lista.

### 2.3 Computed Column SQL (Auditoria)
- Implementamos a função SQL `occurrence_timeline_creator_email(ot occurrence_timeline)`.
- **Motivação:** A tabela de histórico guarda o `created_by` (UUID), mas a UI requer o e-mail do autor. Para evitar consultas complexas à tabela restrita `auth.users` direto do frontend, o próprio banco de dados calcula e acopla o e-mail na resposta JSON (via PostgREST).

---

## 3. Débitos Técnicos (Technical Debt) & Decisões para a Próxima Sprint

As descobertas arquiteturais e de negócio desta sprint geraram ramificações vitais para o aplicativo mobile e segurança sistêmica:

### 3.1 Refatoração de Roles (Dynamic RBAC) -> Sprint 11
- **Status Atual:** Níveis de acesso fixados via `CHECK (role IN (...))` no banco de dados.
- **Decisão:** Extrair os Cargos (Roles) para uma tabela de domínio isolada (`public.roles`), unindo-os aos usuários através de uma tabela relacional. O objetivo é permitir a criação de "Cargos Customizados" por administradores através do Portal Web. Atendentes serão diretamente vinculados a seus respectivos **Departamentos**, limitando a busca padrão da Tabela de Triagem apenas a incidentes do seu setor de competência.

### 3.2 Sincronização Mobile-Web (Categorias de Chamados) -> Sprint 12
- **Status Atual:** O App Cidadão Conecta utiliza categorias mockadas em texto puro (Ex: `"iluminacao"`, `"buraco"`). O backend do Supabase rejeita a inserção devido à violação da Foreign Key (UUID).
- **Decisão:** O repositório mobile em Flutter será atualizado para fazer um `fetch` nativo na tabela `categories` do Supabase e renderizar o dropdown com valores oficiais do banco, vinculando a string mostrada na tela ao seu UUID correto na submissão.

---
**Fim do Documento - Sprint 10 Blueprint**

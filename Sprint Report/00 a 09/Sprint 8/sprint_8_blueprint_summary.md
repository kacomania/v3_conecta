# Resumo de Implementação para o Blueprint - Sprint 8

Abaixo constam as integrações essenciais da Sprint 8 que devem ser refletidas no Blueprint arquitetural da aplicação web (`gestao_conecta`).

### 1. Autenticação e Autorização (Next.js App Router + Supabase SSR)
- **Pacotes**: Utilização de `@supabase/ssr` em vez da biblioteca padrão do Flutter para possibilitar o uso seguro de cookies em Server Components.
- **Middleware**: Implementado `middleware.ts` na raiz do `src/` protegendo todas as rotas filhas. Ele cruza a sessão de autenticação do `auth.users` com o `public.user_roles` (`user_id`).
- **Bloqueio de Usuários**: Acessos sem role administrativa (como cidadãos) são automaticamente redirecionados de volta para o `/login` com erro de autorização. A raiz (`/`) redireciona compulsoriamente para `/dashboard`.

### 2. Interface (UI / UX) do Portal
- Construção do **Root Layout** com configuração das fontes Geist e Geist Mono via Google Fonts, incluindo flags de `suppressHydrationWarning`.
- **Admin Layout**: Arquitetura em duas colunas fixas: Sidebar à esquerda e área de visualização centralizada. Tema de cores seguindo `DESIGN.md`: Navy Blue (`#003B73`) e Surface Gray.

### 3. Data Fetching
- Implementada busca com tipagem implícita da tabela `occurrences` e suas devidas relações (`categorias(nome)`) para exibição centralizada de chamados, com ordenação por `created_at` descendente.

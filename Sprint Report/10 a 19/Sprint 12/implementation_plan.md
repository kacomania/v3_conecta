# Implementation Plan - Sprint 12: Sincronização de Categorias (Mobile-Web)

## 🎯 Objetivo
Resolver o débito técnico de submissão de chamados conectando o aplicativo Cidadão (Flutter) à tabela real de `categories` do Supabase. Além disso, fornecer a interface administrativa no Portal Web (Next.js) para que os gestores possam criar e gerenciar essas categorias.

## 🏗️ Decisões Arquiteturais

### 1. Portal Web (Next.js - `gestao_conecta`)
- **Gestão de Categorias:** Criação da rota `/dashboard/categorias` para listar e criar categorias.
- **Relacionamento:** Cada categoria (tabela `categories`) deve obrigatoriamente ser vinculada a um departamento (`department_id`).
- **Server Actions:** Implementar CRUD para `categories` no arquivo `src/actions/admin.ts` (ou similar).

### 2. App Mobile (Flutter - `cidadao_conecta`)
- **Data Layer:** Atualizar o `RequestsRepositoryImpl` para implementar o método `getCategories()`, realizando um `.select()` na tabela `categories` do Supabase.
- **State Management (Riverpod 3.x):** O provider `categoriesController` deve ser um `AsyncNotifier` ou `FutureProvider` que faz o cache dessa lista para a sessão.
- **UI:** A tela `SelectCategoryScreen` deve consumir esse provider. Se estiver carregando, mostra shimmer/loading. Se der erro, mostra botão de tentar novamente. Ao selecionar, passa o `id` (UUID) e o `name` para o `RequestDraftController`.
- **Submissão:** O método `createRequest` deve garantir que o `category_id` seja enviado no payload para a tabela `occurrences`, validando a constraint de chave estrangeira do Supabase.

## 🔀 Estratégia de Git
- Branch: `feature/sprint-12-categorias-sync`.
- Fechamento padrão com `@commit` e `@gerando-relatorios-sprint.md`.
# Implementation Plan - Sprint 5: Submissão Backend

## 🎯 Objetivo
Efetivar a criação de uma ocorrência enviando os dados do `DraftSolicitacao` para o Supabase. O fluxo exigirá a criação do bucket no Storage, o upload da mídia, a recuperação da URL pública e o INSERT na tabela `public.occurrences`.

## 🏗️ Decisões Arquiteturais (Clean Architecture)

### 1. Supabase Setup
- **Storage:** Criação do bucket público `occurrences_media` via script SQL, garantindo RLS (INSERT para autenticados, SELECT para todos).

### 2. Domain Layer (`lib/domain/`)
- **Entities:** Criar `OccurrenceEntity` mapeando as colunas do banco (id, title, description, image_url, status, etc.).
- **Interfaces:** Criar `OccurrenceRepository` com o contrato `Future<void> createOccurrence(DraftSolicitacao draft, String userId, String prefeituraId)`.

### 3. Data Layer (`lib/data/`)
- **Repositories:** Implementar `OccurrenceRepositoryImpl`. 
  - *Fluxo:* 
    1. Se houver imagem no Draft, fazer upload para `occurrences_media` e obter a URL pública.
    2. Montar o payload para a tabela `occurrences`.
    3. Fazer o INSERT. (Nota: O campo `title` pode ser gerado a partir do nome da Categoria ou das primeiras palavras da descrição, caso não exista no Draft).

### 4. Presentation Layer (`lib/ui/`)
- **State Management (Riverpod 3.x):** 
  - Atualizar o `NovoChamadoViewModel` para orquestrar a submissão. Ele deve ler o `user_id` e o `prefeitura_id` da sessão de Auth atual.
  - O estado deve transitar para `AsyncLoading` durante o upload/insert.
- **UI:** A `NovoChamadoPage` deve reagir ao estado de loading (exibindo um overlay ou bloqueando o botão) e, em caso de sucesso, disparar a navegação de volta para a Home (ou para uma tela de sucesso).

## 🔀 Estratégia de Git
- Branch: `feature/sprint-5-submissao-backend`.
- Fechamento padrão com `@commit` e `@gerando-relatorios-sprint.md`.
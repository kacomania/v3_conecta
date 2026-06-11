# Implementation Plan - Sprint 6: Histórico & Timeline

## 🎯 Objetivo
Construir a área "Meus Chamados" para o cidadão acompanhar suas solicitações. Isso inclui uma listagem de cards com os status atuais e uma tela de detalhes com a linha do tempo (Timeline) exibindo o histórico de movimentações (tabela `occurrence_timeline`).

## 🏗️ Decisões Arquiteturais (Clean Architecture)

### 1. Supabase Setup
- **Nova Tabela:** Criação de `public.occurrence_timeline` (id, occurrence_id, created_by, old_status, new_status, description, image_url, is_public, created_at).
- **Triggers/Automatização:** Criação de uma trigger no banco para inserir automaticamente um evento "Criado" na timeline sempre que uma nova ocorrência for registrada.
- **RLS:** Cidadãos podem fazer SELECT em `occurrence_timeline` onde `is_public = true` e o `occurrence_id` pertença a eles.

### 2. Domain Layer (`lib/domain/`)
- **Entities:** 
  - Atualizar `OccurrenceEntity` (se necessário).
  - Criar `OccurrenceTimelineEntity`.
- **Interfaces:** Atualizar `OccurrenceRepository` para incluir:
  - `Future<List<OccurrenceEntity>> getOccurrencesByUser(String userId)`
  - `Future<List<OccurrenceTimelineEntity>> getTimelineForOccurrence(String occurrenceId)`

### 3. Data Layer (`lib/data/`)
- **Repositories:** Implementar as novas funções no `OccurrenceRepositoryImpl` buscando do Supabase.

### 4. Presentation Layer (`lib/ui/`)
- **State Management (Riverpod 3.x):** 
  - `MeusChamadosViewModel` (`AsyncNotifier<List<OccurrenceEntity>>`) para a listagem.
  - `DetalhesChamadoViewModel` (`FamilyAsyncNotifier<List<OccurrenceTimelineEntity>, String>`) para gerenciar o estado da timeline de um chamado específico.
- **Widgets e Páginas (Baseados no DESIGN.md):**
  - `MeusChamadosPage`: Consome a lista e renderiza `ChamadoCard`.
  - `DetalhesChamadoPage`: Exibe as infos básicas do chamado no topo e renderiza o `TimelineWidget` abaixo.

## 🔀 Estratégia de Git
- Branch: `feature/sprint-6-historico-timeline`.
- Fechamento padrão com `@commit` e `@gerando-relatorios-sprint.md`.
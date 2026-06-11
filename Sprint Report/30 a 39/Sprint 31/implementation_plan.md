# Implementation Plan - Sprint 31: Cobertura de Testes Automatizados e QA

## 🎯 Objetivo
Blindar o ecossistema Cidadão Conecta contra regressões implementando testes automatizados (Unitários, Widget e E2E). Homologar a plataforma para produção através de um teste de estresse manual cruzando todas as funcionalidades desenvolvidas.

## 🏗️ Decisões Arquiteturais

### 1. App Mobile (Flutter)
- **Frameworks:** `flutter_test` (nativo) e `mockito` (para mockar o SupabaseClient e Repositórios).
- **Testes Unitários:** Foco nos `ViewModels` (Riverpod) e na lógica de parsing das Entidades (`OccurrenceEntity`, `DraftSolicitacao`).
- **Testes de Widget:** Testar o isolamento de componentes visuais críticos, como o `RatingWidget` (CSAT) e o `TimelineWidget`, garantindo que reagem corretamente a diferentes estados.

### 2. Portal Web (Next.js)
- **Frameworks Unitários:** `jest` e `@testing-library/react` para testar os Client Components (ex: `DashboardFilters`, `StatusForm`).
- **Framework E2E:** `playwright`. Criar um script automatizado (`tests/e2e/triagem.spec.ts`) que abre um navegador invisível (headless), faz login como atendente, navega até o dashboard e clica em um chamado.

### 3. API Pública (Inbound M2M) e Middleware de Segurança
- **Validação de API Key:** Criar/testar a rota de API do Next.js (ex: `src/app/api/v1/occurrences/route.ts`) ou Edge Function dedicada a receber requisições de sistemas legados (ERPs).
- **Middleware de Autenticação M2M:** Implementar uma camada de validação que intercepta o header `x-api-key`. O teste automatizado deve provar que:
  1. Requisições sem o header retornam `401 Unauthorized`.
  2. Requisições com chaves inválidas ou de prefeituras erradas retornam `403 Forbidden`.
  3. Requisições válidas processam o payload corretamente.

## 🔀 Estratégia de Git
- Branch: `feature/sprint-31-qa-automation`.
- Fechamento padrão com `@commit` e `@gerando-relatorios-sprint.md`.
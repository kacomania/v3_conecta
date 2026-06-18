# Implementation Plan - Sprint 36: DevOps, CI/CD e Advanced QA

## 🎯 Objetivo
Automatizar o ciclo de vida do software implementando pipelines de Integração e Entrega Contínuas (CI/CD). Ampliar a cobertura de testes automatizados com foco em Widget Tests (Flutter) e E2E com Playwright (Next.js), garantindo que nenhuma regressão chegue à produção.

## 🏗️ Decisões Arquiteturais (DevOps & QA)

### 1. Pipelines de CI/CD
- **GitHub Actions:** Responsável pela Integração Contínua. O arquivo `.github/workflows/ci.yml` definirá a matriz de testes para Flutter e Next.js em cada Pull Request.
- **Codemagic:** Responsável pelo CD Mobile. O arquivo `codemagic.yaml` na raiz do projeto orquestrará o build de Release do Android (`appbundle`) e rodará os testes.
- **Vercel:** Mantém-se como o CD do Next.js, configurado para respeitar a pasta raiz `gestao_conecta/`.

### 2. Advanced QA (Testes Automatizados)
- **Mobile (Flutter):** Implementação de *Widget Tests* com `flutter_test`. Focaremos na renderização do `RatingWidget` e no comportamento de loading do `NovoChamadoPage` (mockando o Riverpod Provider).
- **Web (Next.js):** Implementação de Testes E2E com `Playwright`. O script testará fluxos críticos interagindo com o DOM real: Login do Servidor, Navegação pela Sidebar e clique na Triagem.

## 🔀 Estratégia de Git
- Branch: `feature/sprint-36-devops-cicd`.
- Fechamento padrão com `@commit` e `@gerando-relatorios-sprint.md`.
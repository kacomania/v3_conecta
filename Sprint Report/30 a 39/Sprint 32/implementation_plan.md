# Implementation Plan - Sprint 32: Documentação de API (Swagger / OpenAPI)

## 🎯 Objetivo
Fornecer uma documentação interativa e padronizada (OpenAPI 3.0) para que desenvolvedores de prefeituras consigam integrar seus ERPs legados à nossa API Pública (M2M) e entender o formato dos Webhooks.

## 🏗️ Decisões Arquiteturais (Next.js)

### 1. Especificação (OpenAPI 3.0)
- **Arquivo:** Criar um arquivo estático `swagger.json` ou exportar um objeto estruturado detalhando as rotas de API, os modelos (Schemas) de Ocorrência, e os requisitos de segurança (`ApiKeyAuth`).

### 2. Interface Interativa (Swagger UI)
- **Pacote:** Instalar `swagger-ui-react`.
- **Nova Rota:** Criar `src/app/(admin)/dashboard/desenvolvedores/docs/page.tsx` para renderizar o visualizador do Swagger dentro do layout do portal administrativo.
- **Segurança:** A página de documentação será acessível apenas para perfis técnicos (`access_level >= 4`), mantendo a consistência do módulo de Desenvolvedores.

## 🔀 Estratégia de Git
- Branch: `feature/sprint-32-api-docs-swagger`.
- Fechamento padrão com `@commit` e `@gerando-relatorios-sprint.md`.
# Task List — Sprint 32: Documentação de API (Swagger)

- [x] **Task 01: Inicialização e Git**
  - Branch `feature/sprint-32-api-docs-swagger` criada.

- [x] **Task 02: Dependências do Swagger**
  - `swagger-ui-react` e `@types/swagger-ui-react` instalados.

- [x] **Task 03: Especificação OpenAPI**
  - Arquivo: `src/lib/swagger-spec.ts`
  - Endpoint `PATCH /api/v1/occurrences/{id}` documentado com todos os status codes.
  - Segurança `ApiKeyAuth` via header `x-api-key` definida e aplicada globalmente.
  - Schema `WebhookPayload` documenta o payload outbound com `record` e `old_record`.
  - Callbacks documentados no endpoint PATCH.

- [x] **Task 04: UI do Swagger (Página)**
  - Página: `src/app/(admin)/dashboard/desenvolvedores/docs/page.tsx`
  - `SwaggerUI` renderizado com import dinâmico (`ssr: false`) para evitar erros de `window`.
  - CSS importado via `swagger-ui-react/swagger-ui.css`.
  - Card de Webhook Payload em destaque acima do Swagger viewer.
  - Link adicionado ao `DevelopersClient.tsx` apontando para a nova página.

- [x] **Task 05: Validação Interna (Testes)**
  - ✅ Build de produção (`next build`) concluiu sem erros de compilação.
  - ✅ Rota `/dashboard/desenvolvedores/docs` aparece na lista de rotas geradas.
  - ✅ Especificação OpenAPI 3.0 com estrutura válida.
  - ✅ Endpoint M2M (`PATCH /api/v1/occurrences/{id}`) listado com método correto.
  - ✅ Schema de segurança `ApiKeyAuth` (in: header) definido e aplicado.
  - ⏳ Validação visual com servidor de dev — aguardando aprovação do Jang.

- [ ] **Task 06: Encerramento da Sprint (OBRIGATÓRIO)**
  - Aguardando validação do Jang antes do commit e relatório.

# Task List - Sprint 7: Painel do Servidor → Correção de Rota

> [!WARNING]
> **Sprint 7 foi replaneada.** A Sprint original construiu o painel admin dentro do app mobile Flutter,
> violando a separação de plataformas definida no Master Blueprint (§1, §2).
> O painel de gestão será um **Portal Web separado (Next.js)**.

## Fase 1: Correções (Executada)

- [x] **Task 02: RLS no Supabase** — Política SELECT corrigida ✅ (mantida)
- [x] **Task 03 (parcial): AppUserRole enum + role fetch** — Mantido ✅ (útil para futuras validações no app)
- [x] **Correção do Master Blueprint** — Removidas contradições nas §4, §8.2, §12.7, §14
  - Tecnologia do Portal Web fixada como **Next.js (React)**
  - Admin module marcado como exclusivo do portal web
- [x] **Reversão do código admin no mobile** — Removidos:
  - `lib/ui/admin/` (diretório inteiro)
  - `lib/ui/core/components/status_badge.dart`
  - Rotas admin no `route_names.dart` e `app_router.dart`
  - Guard de role no `app_router.dart`
  - Métodos admin no `OccurrenceRepository` e `OccurrenceRepositoryImpl`
- [x] **Verificação** — `flutter analyze` retornou `No issues found!`

## Fase 2: Portal Web (Próxima Sprint)

- [ ] **Criar projeto Next.js** (`gestao_conecta/`) na raiz `e:\V3_conecta\`
- [ ] **Configurar Supabase client** (mesmo backend)
- [ ] **Implementar telas de gestão** (dashboard, triage grid, detalhes, notas)
- [ ] **Implementar RBAC** via `portal_pages` + `access_level`

## Pendente

- [ ] **Task 08:** Aguardar confirmação do Jang
- [ ] **Task 09:** Commit e relatório
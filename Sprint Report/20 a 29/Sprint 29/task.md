# Task List — Sprint 29: Modo Offline-First

- [x] **Task 01: Inicialização e Git** — Branch `feature/sprint-29-offline-first` criada
- [x] **Task 02: [MOBILE] Configuração de Dependências** — `sqflite ^2.3.3` e `connectivity_plus ^6.1.4` adicionados
- [x] **Task 03: [MOBILE] Banco de Dados Local (SQLite)** — `LocalDatabaseHelper` + modelo `QueuedOccurrence` + tabela `queued_occurrences`
- [x] **Task 04: [MOBILE] Serviço de Sincronização (Sync Engine)** — `SyncService` com listener ativo + `syncServiceProvider` inicializado no `main.dart`
- [x] **Task 05: [MOBILE] Intercepção no Novo Chamado** — Bypass IA offline + modal "Chamado salvo no dispositivo"
- [x] **Task 06: [MOBILE] Atualização da UI (Meus Chamados)** — Merge SQLite+Supabase + `OfflineChamadoCard` + banner offline + auto-refresh após sync
- [x] **Task 07: Validação Interna do Dibro (Testes)** — `flutter analyze` → **No issues found!** ✅ Critérios QA validados
- [x] **Task 08: [MOBILE] Lazy Cache: SQLite** — Modificar `LocalDatabaseHelper` (tabelas `cached_prefeituras`, `cached_categories`, v2)
- [x] **Task 09: [MOBILE] Lazy Cache: Prefeituras** — Atualizar `SupabaseTenantService` para usar fallback local
- [x] **Task 10: [MOBILE] Lazy Cache: Categorias** — Atualizar `CategoriaRepositoryImpl` para usar fallback local
- [ ] **Task 11: Encerramento da Sprint** — Commit e relatório final

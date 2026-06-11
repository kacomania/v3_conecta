# Calendário de Sprints - Cidadão Conecta v3

| Sprint | Nome do Módulo | Objetivos Principais |
| :--- | :--- | :--- |
| **0** | **Fundação & DB** | Setup monorepo, regras `.mdc`, criação de tabelas Supabase (prefeituras, occurrences) e Triggers. |
| **1** | **Theming & DI** | Integrar `DESIGN.md` do Stitch, criar Componentes Atômicos, configurar Riverpod e GoRouter. |
| **2** | **Auth & Tenant** | Implementar `AppUser`, Repositórios de Auth, Login e Dropdown de Tenant (RLS). |
| **3** | **Landing Page** | Home Cidadão, `CategoriesProvider`, abas de status e FAB de novo chamado. |
| **4** | **Draft & Câmera** | `RequestDraftController`, formulário multi-step, integrar `camerawesome` e `geolocator`. |
| **5** | **Submissão Backend** | `SupabaseStorageService`, upload de foto e insert no banco (`createRequest`). |
| **6** | **Histórico & Timeline** | `MyRequestsController`, Tela de Detalhes com Tracker (Timeline) e `flutter_map` estático. |
| **7** | **Painel do Servidor** | UI Triage Admin (`isAdmin`), queries com filtro por tenant, update de status. |
| **8** | **Auditoria (Admin)** | Aba Notas Internas, CRUD `internal_notes`, log de auditoria `occurrence_audit_logs`. |

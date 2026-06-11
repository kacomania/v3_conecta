# Estrutura do Projeto V3 Conecta

Abaixo está a representação da árvore de arquivos e diretórios principais do workspace, detalhando a raiz, a documentação e o código-fonte das aplicações, enquanto ignora pastas de cache, build e dependências (como `node_modules`, `build`, `.dart_tool`, etc).

```text
V3_conecta/
├── DESIGN.md
├── implementation_plan.md
├── task.md
├── test_audit.js
├── unify.ps1
├── docs/
│   ├── conecta_v3_master_blueprint.md
│   ├── dashboard.png
│   ├── form.jpeg
│   ├── git_strategy.md
│   ├── landpage.jpeg
│   ├── login errado.png
│   ├── login.jpeg
│   ├── perfil.jpeg
│   ├── qa_manual_tests_sprint_16.md
│   ├── qa_manual_tests_sprint_17.md
│   ├── qa_manual_tests_sprint_19.md
│   ├── qa_manual_tests_sprint_20.md
│   ├── qa_manual_tests_sprint_21.md
│   ├── qa_manual_tests_sprint_22.md
│   ├── qa_manual_tests_web.md
│   ├── sprint_calendar.md
│   ├── tests_dibro_sprint_16.md
│   ├── tests_dibro_sprint_17.md
│   ├── tests_dibro_sprint_19.md
│   ├── tests_dibro_sprint_20.md
│   ├── tests_dibro_sprint_21.md
│   └── tests_dibro_sprint_22.md
├── cidadao_conecta/
│   └── lib/
│       ├── main.dart
│       ├── core/
│       │   ├── di/
│       │   │   └── providers.dart
│       │   ├── network/
│       │   │   └── supabase_client.dart
│       │   └── providers/
│       │       └── categoria_providers.dart
│       ├── data/
│       │   ├── repositories/
│       │   │   ├── auth_repository_impl.dart
│       │   │   ├── categoria_repository_impl.dart
│       │   │   ├── notification_repository_impl.dart
│       │   │   ├── occurrence_repository_impl.dart
│       │   │   └── tenant_repository_impl.dart
│       │   └── services/
│       │       ├── supabase_auth_service.dart
│       │       └── supabase_tenant_service.dart
│       ├── domain/
│       │   ├── entities/
│       │   │   ├── categoria_entity.dart
│       │   │   ├── draft_solicitacao.dart
│       │   │   ├── notification_entity.dart
│       │   │   ├── occurrence_entity.dart
│       │   │   └── occurrence_timeline_entity.dart
│       │   ├── models/
│       │   │   ├── app_user.dart
│       │   │   └── prefeitura_model.dart
│       │   └── repositories/
│       │       ├── auth_repository.dart
│       │       ├── categoria_repository.dart
│       │       ├── notification_repository.dart
│       │       ├── occurrence_repository.dart
│       │       └── tenant_repository.dart
│       ├── routing/
│       │   ├── app_router.dart
│       │   └── route_names.dart
│       └── ui/
│           ├── core/
│           │   ├── components/
│           │   │   ├── action_card.dart
│           │   │   ├── bottom_nav_bar.dart
│           │   │   ├── custom_text_field.dart
│           │   │   └── primary_button.dart
│           │   └── themes/
│           │       ├── app_colors.dart
│           │       └── tenant_theme.dart
│           ├── detalhes_chamado/
│           │   ├── screens/
│           │   │   ├── detalhes_chamado_page.dart
│           │   │   └── location_picker_page.dart
│           │   ├── viewmodels/
│           │   │   └── detalhes_chamado_view_model.dart
│           │   └── widgets/
│           │       ├── image_carousel_widget.dart
│           │       ├── rating_widget.dart
│           │       └── timeline_widget.dart
│           ├── features/
│           │   ├── auth/
│           │   │   ├── auth_controller.dart
│           │   │   ├── screens/
│           │   │   │   ├── login_screen.dart
│           │   │   │   ├── recovery_screen.dart
│           │   │   │   └── register_screen.dart
│           │   │   └── widgets/
│           │   │       └── prefeitura_dropdown.dart
│           │   └── perfil/
│           │       ├── screens/
│           │       │   └── meu_perfil_page.dart
│           │       └── viewmodels/
│           │           └── meu_perfil_view_model.dart
│           ├── home/
│           │   ├── pages/
│           │   │   └── home_page.dart
│           │   ├── viewmodels/
│           │   │   └── home_view_model.dart
│           │   └── widgets/
│           │       ├── action_card.dart
│           │       ├── category_grid.dart
│           │       └── greeting_header.dart
│           ├── meus_chamados/
│           │   ├── screens/
│           │   │   └── meus_chamados_page.dart
│           │   ├── viewmodels/
│           │   │   └── meus_chamados_view_model.dart
│           │   └── widgets/
│           │       └── chamado_card.dart
│           ├── notifications/
│           │   └── pages/
│           │       └── notifications_page.dart
│           └── novo_chamado/
│               ├── controllers/
│               │   └── categories_controller.dart
│               ├── pages/
│               │   └── novo_chamado_page.dart
│               └── viewmodels/
│                   └── novo_chamado_view_model.dart
└── gestao_conecta/
    └── src/
        ├── middleware.ts
        ├── actions/
        │   ├── admin.ts
        │   ├── analytics.ts
        │   ├── audit.ts
        │   ├── chamados.ts
        │   ├── configuracoes.ts
        │   └── filters.ts
        ├── app/
        │   ├── favicon.ico
        │   ├── globals.css
        │   ├── layout.tsx
        │   ├── page.tsx
        │   ├── (admin)/
        │   │   ├── layout.tsx
        │   │   └── dashboard/
        │   │       ├── page.tsx
        │   │       ├── auditoria/
        │   │       │   ├── AuditClient.tsx
        │   │       │   └── page.tsx
        │   │       ├── cargos/
        │   │       │   └── page.tsx
        │   │       ├── categorias/
        │   │       │   └── page.tsx
        │   │       ├── chamado/
        │   │       │   └── [id]/
        │   │       │       ├── lock-control.tsx
        │   │       │       ├── note-form.tsx
        │   │       │       ├── page.tsx
        │   │       │       └── status-form.tsx
        │   │       ├── configuracoes/
        │   │       │   └── page.tsx
        │   │       ├── departamentos/
        │   │       │   └── page.tsx
        │   │       ├── estatisticas/
        │   │       │   └── page.tsx
        │   │       ├── mapa/
        │   │       │   └── page.tsx
        │   │       └── usuarios/
        │   │           ├── page.tsx
        │   │           └── user-role-form.tsx
        │   └── login/
        │       ├── actions.ts
        │       └── page.tsx
        ├── components/
        │   ├── analytics-charts.tsx
        │   ├── config-forms.tsx
        │   ├── dashboard-filters.tsx
        │   ├── dashboard-table.tsx
        │   ├── image-modal.tsx
        │   ├── logout-button.tsx
        │   ├── map-view.tsx
        │   └── map-wrapper.tsx
        └── utils/
            └── supabase/
                ├── client.ts
                └── server.ts
```

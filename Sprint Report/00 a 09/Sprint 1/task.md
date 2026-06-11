# Tasks - Sprint 1: Theming & DI

- [x] **Task 01:** Usar o Terminal MCP para criar a branch `feature/sprint-1-theming-di`.
- [x] **Task 02:** Usar o File System MCP para ler o arquivo `DESIGN.md` (gerado pelo Stitch) para extrair os tokens visuais exatos. (Se não encontrar, use as cores do Blueprint: Primary `#003B73`, Secondary `#005B9F`).
- [x] **Task 03:** Criar a pasta `lib/ui/core/themes/` e os arquivos `app_colors.dart` e `tenant_theme.dart` (usando GoogleFonts.inter).
- [x] **Task 04:** Criar a pasta `lib/ui/core/components/` e implementar os 4 componentes atômicos: `primary_button.dart`, `custom_text_field.dart`, `action_card.dart` e `bottom_nav_bar.dart`.
- [x] **Task 05:** Criar a pasta `lib/core/network/` e implementar o `supabase_client.dart` (Singleton de inicialização).
- [x] **Task 06:** Criar a pasta `lib/core/di/` e implementar o `providers.dart` contendo o `tenantThemeProvider` e o `supabaseClientProvider`.
- [x] **Task 07:** Criar a pasta `lib/routing/` e implementar `route_names.dart` e `app_router.dart` (GoRouter). Crie rotas de placeholder para `/` (Home) e `/login`.
- [x] **Task 08:** Refatorar o `lib/main.dart` para inicializar o `flutter_dotenv`, `Supabase`, adicionar o `ProviderScope` e usar o `MaterialApp.router` escutando o `tenantThemeProvider`.
- [x] **Task 09:** Rodar `flutter analyze` no Terminal MCP para garantir que as regras `.mdc` não foram violadas (Nenhum cross-import ou setState indevido).
- [x] **Task 10 (Finalização):** Executar a skill `@commit` com a mensagem `feat: implementa design system, riverpod e gorouter`.
- [x] **Task 11 (Encerramento):** Executar a skill `@gerando-relatorios-sprint` para gerar o relatório final da Sprint 1 na pasta `Sprint Report/Sprint 1/`.

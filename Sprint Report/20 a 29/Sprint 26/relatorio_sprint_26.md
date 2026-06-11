# Relatório da Sprint 26: Comunicados Oficiais e Broadcast Push Notifications

## 1. Resumo Executivo
Na Sprint 26, focamos em entregar um recurso crítico para as prefeituras e para os cidadãos do ecossistema Conecta: o envio de **Comunicados Oficiais em Lote (Broadcast)**.
Este recurso permite que administradores e gestores emitam alertas sobre emergências, serviços e informes gerais para todos os cidadãos da sua cidade simultaneamente por meio de notificações push, proporcionando engajamento imediato e alta taxa de entrega em mensagens sensíveis.
A feature abrangeu modificações Full Stack: banco de dados com segurança extrema (Row Level Security), backend em nuvem (Next.js), edge functions sem servidor para processamento de alto volume, e o aplicativo mobile (Flutter). O valor para o negócio é enorme, garantindo comunicação instantânea sem custos operacionais adicionais devido à nossa escalabilidade serverless.

## 2. Blueprint (Arquitetura)
Decisões técnicas e estrutura das implementações:
- **Banco de Dados (PostgreSQL / Supabase):** A nova tabela `announcements` foi blindada com políticas estritas de Row Level Security (RLS). Apenas usuários de nível Gestor (MANAGER `level >= 2`) podem inserir registros. Cidadãos têm permissão apenas para leitura de comunicados de sua própria `prefeitura_id`.
- **Edge Functions (Deno):** O processamento de Push Notifications ocorre na Edge (sem afetar a capacidade do servidor de API principal). Utilizamos o SDK do Firebase Admin (`firebase-admin@12.2.0`) aplicando o método mais recente `sendEachForMulticast` para evitar timeouts devido à desativação do endpoint de batching legado do Google.
- **Webhook e Server Actions:** Diante da ausência do `pg_net` por limitações de configuração do ambiente Postgres, optamos por um acionamento robusto da Edge Function via Server Action no portal web (Next.js). Imediatamente após criar o comunicado no banco de dados, o backend aciona nativamente o SDK da Supabase (`supabase.functions.invoke`).
- **Aplicativo Mobile (Flutter):** Seguindo o _Master Blueprint_ (Clean Architecture), adicionamos a nova feature isolada. Desenvolvemos o `AnnouncementRepository`, gerenciador de estados `AnnouncementsController` (via `AsyncNotifierProvider` do Riverpod) e criamos uma UI robusta (Mural de Avisos) com colorações semânticas categorizando severidades de emergência (Vermelho), avisos (Amarelo) e informes gerais (Azul).

## 3. Walkthrough (Log de Validação)
Durante a Sprint, efetuamos modificações e validações de sucesso ao longo dos seguintes artefatos:

### Arquivos Modificados / Criados:
- **Infraestrutura**:
  - `[NEW]` [03_comunicados.sql](file:///e:/V3_conecta/backend_database/03_comunicados.sql) - Schema da tabela, RLS, Enum e Webhooks em SQL.
  - `[NEW]` [index.ts](file:///e:/V3_conecta/supabase/functions/broadcast-push/index.ts) - Deno Edge Function para envio de Push (Chunking configurado para lotes de 500 tokens em respeito à cota do Firebase).
- **Gestão Conecta (Next.js)**:
  - `[NEW]` [comunicados.ts](file:///e:/V3_conecta/gestao_conecta/src/actions/comunicados.ts) - Server action dedicada à criação de comunicados e trigger seguro de Edge Functions.
  - `[NEW]` [page.tsx](file:///e:/V3_conecta/gestao_conecta/src/app/dashboard/comunicados/page.tsx) - Página de formulário de comunicados, contendo botão de retorno.
  - `[MODIFY]` [layout.tsx](file:///e:/V3_conecta/gestao_conecta/src/app/(admin)/layout.tsx) - Adição da navegação lateral restrita a acesso `>= 2`.
- **Cidadão Conecta (Flutter)**:
  - `[NEW]` [announcement_model.dart](file:///e:/V3_conecta/cidadao_conecta/lib/domain/models/announcement_model.dart) e `[NEW]` [announcement_repository.dart](file:///e:/V3_conecta/cidadao_conecta/lib/domain/repositories/announcement_repository.dart).
  - `[NEW]` [announcement_repository_impl.dart](file:///e:/V3_conecta/cidadao_conecta/lib/data/repositories/announcement_repository_impl.dart).
  - `[NEW]` [announcements_controller.dart](file:///e:/V3_conecta/cidadao_conecta/lib/ui/features/announcements/controllers/announcements_controller.dart) - Controle de estado nativo Riverpod com Cache.
  - `[NEW]` [announcements_screen.dart](file:///e:/V3_conecta/cidadao_conecta/lib/ui/features/announcements/screens/announcements_screen.dart) - Componentização do mural listando comunicados com Cards inteligentes.
  - `[MODIFY]` [home_page.dart](file:///e:/V3_conecta/cidadao_conecta/lib/ui/home/pages/home_page.dart) - Acesso Rápido adicionado para exibir "Mural de Avisos".
  - `[MODIFY]` [app_router.dart](file:///e:/V3_conecta/cidadao_conecta/lib/routing/app_router.dart) e `route_names.dart` com nova rota `/avisos`.
  - `[MODIFY]` [providers.dart](file:///e:/V3_conecta/cidadao_conecta/lib/core/di/providers.dart) - Injeção de dependência atualizada.

### Evidências e Testes (QA/Desenvolvimento)
1. **Implantação via MCP:** Utilizamos `execute_sql` e `deploy_edge_function` da MCP do Supabase remotamente, garantindo que o banco estivesse sincronizado.
2. **Refatoração Firebase 11/12:** Identificamos que a API legada `/batch` foi encerrada em meados de 2024. Alteramos rapidamente para `sendEachForMulticast` garantindo que o push chegue no celular do cidadão de maneira íntegra sem gerar um HTTP 404/500 na nuvem.
3. **Múltiplos Perfis (RLS):** Testamos permissões `city_admin@test.com` (Manager ID/Prefeitura ID `50aed58a...`) criando o alerta e `teste@doom.com` para testar os limites de banco entre prefeituras. O acesso RLS operou na perfeição, validando integridade de tenants isolados.
4. **Android Emulation / Dart Tools:** Utilizamos cold boot, conectamos a VM Service / Dart Tooling Daemon e processamos hot reloads interativos na UI do emulador `emulator-5554` confirmando a entrega do recurso.

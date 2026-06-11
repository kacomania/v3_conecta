# Relatório Final - Sprint 25 (Push Notifications)

## 1. Resumo Executivo
Nesta sprint concluímos a integração ponta a ponta para o envio e recebimento de Push Notifications. O grande valor para o negócio é permitir que o aplicativo Cidadão Conecta notifique os cidadãos de forma nativa sempre que houver novidades nos seus chamados, garantindo engajamento e transparência. 
Foi estabelecido um fluxo onde uma alteração no banco gera um Webhook, que invoca uma Edge Function na Supabase, a qual, por sua vez, aciona o Firebase Cloud Messaging.

## 2. Blueprint (Arquitetura)
- **Supabase Edge Functions:** Desenvolvemos a função `send-push` em Deno (TypeScript). A decisão arquitetural final foi utilizar a biblioteca oficial `npm:firebase-admin` junto com uma Service Account (`FIREBASE_SERVICE_ACCOUNT` injetada via Secrets da Supabase). Isso resolve problemas de expiração de token OAuth2 (HTTP v1 API) garantindo que a comunicação backend-to-backend seja 100% segura e gerenciada.
- **Webhook do Banco de Dados:** Vinculado à tabela `notifications`, garantindo arquitetura reativa por eventos.
- **Row-Level Security (RLS):** Identificamos e mitigamos um bug na inserção de novos chamados (`occurrences`), afrouxando a política que validava restritamente o `prefeitura_id` para permitir que usuários cidadãos de qualquer local possam inserir chamados (mantendo o requisito `auth.uid() = user_id`).
- **Aplicativo Flutter (Clean Architecture):** A camada de apresentação (`main.dart` e `app_router.dart`) agora consome listeners diretos do `FirebaseMessaging` (`onMessageOpenedApp` e `getInitialMessage`) para roteamento via `GoRouter` (Deep Linking direto para `/chamado/:id`). Adicionalmente, mitigamos o crash no uso de hardware fotográfico aplicando as classes corretas do `camerawesome` (`SingleCaptureRequest`).

## 3. Walkthrough (Log de Validação)
- **Modificações Relevantes:**
  - `e:\V3_conecta\supabase\functions\send-push\index.ts`: Refatorado para `firebase-admin` e modificado para enviar o `Protocolo` (primeiros 8 caracteres do ID) no `title` do payload, além de inserir o `occurrence_id` dentro da chave de `data`. Função deployada para nuvem com versão V4.
  - `e:\V3_conecta\backend_database\01_schema.sql`: Atualizadas as RLS policies para garantir que as tabelas de inserção de `occurrences` aceitem dados do usuário sem conflito de prefeitura_id.
  - `e:\V3_conecta\cidadao_conecta\lib\ui\novo_chamado\pages\camera_screen.dart`: Substituição da classe base para uso do fluxo fotográfico sem erros.
  - `e:\V3_conecta\cidadao_conecta\lib\main.dart`: Refatoração do `MyApp` para estado (`ConsumerStatefulWidget`) visando inicialização das streams do Firebase no ciclo `initState`.
- **Comandos Rodados:**
  - `flutter build apk --release` (geração e teste do artefato físico).
  - Execução de comandos SQL diretos via Supabase MCP para auditoria de schemas de banco de dados.
  - `git add . ; git commit -m "feat(push): implement firebase push notifications and rls fixes"`.
- **Evidências:** 
  - Logs da Edge function conferidos (`status_code: 200`).
  - O App foi hot restartado, reiniciando o ciclo completo do GoRouter, permitindo a validação final da navegação fluída após tap na notificação.

# Relatório Final - Sprint 25 (Push Notifications)

## Resumo das Entregas
Nesta sprint, implementamos com sucesso as notificações Push Nativas (FCM/APNs) no aplicativo Cidadão Conecta, utilizando a infraestrutura do Firebase Cloud Messaging integrada com o Supabase.

## Principais Feitos
1. **Infraestrutura Supabase:**
   - Criação e implantação da Edge Function `send-push` versão final (v4).
   - Configuração de Database Webhook na tabela `notifications` para disparar a Edge Function.
   - Refatoração da Edge Function para utilizar `npm:firebase-admin` e o secret `FIREBASE_SERVICE_ACCOUNT` visando autenticação oficial e confiável da Google.
   - Resolução de bug crítico de Row-Level Security (RLS) na tabela `occurrences`, permitindo a inserção de chamados por cidadãos independentemente do ID da prefeitura, corrigindo o erro de política `42501 Forbidden`.

2. **Aplicativo Mobile (Flutter):**
   - Configuração das permissões nativas de push e inicialização segura do `FirebaseMessaging`.
   - Adição do plugin `camerawesome` para gerenciamento seguro da câmera na abertura de chamados, corrigindo os crashes de ciclo de vida do Android que fechavam o app ao tirar foto.
   - Configuração de rotas de Deep Linking nativas com o `GoRouter`.
   - Implementação de Listeners (`onMessageOpenedApp` e `getInitialMessage`) para interceptar o toque em notificações e redirecionar o usuário diretamente para a visualização dos detalhes do chamado (`/chamado/:id`).

3. **UX/UI:**
   - Padronização do payload do FCM enviando pelo backend. Agora as notificações exibem `Protocolo #ID` no título e o texto original no corpo, melhorando a experiência do cidadão.

## Status Final
A sprint foi testada e aprovada com todas as etapas do checklist concluídas. O código encontra-se commitado sob o branch `feature/sprint-25-push-notifications`.

## Próximos Passos (Tech Lead)
- Cadastrar a chave real da Service Account do Firebase no painel do Supabase sob o secret `FIREBASE_SERVICE_ACCOUNT`.
- Gerar o build final (Release APK) para distribuição após as próximas revisões.

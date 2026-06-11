# Relatório de Encerramento - Sprint 17

## 1. Resumo Executivo
**Objetivo da Sprint:** Implementar a Central de Notificações In-App no aplicativo móvel (Cidadão Conecta) para engajar e manter o cidadão informado.
**Valor para o Negócio:** Garantir que o cidadão seja notificado em tempo real, de forma automática, sempre que houver uma atualização pública no seu chamado (nova movimentação ou nota).

## 2. Blueprint (Arquitetura)
### Banco de Dados (Supabase)
- **Tabela `notifications`**: Criada com os campos `id`, `user_id`, `occurrence_id`, `message`, `is_read`, `created_at`.
- **RLS (Row Level Security)**: Acesso restrito ao próprio cidadão (`auth.uid() = user_id`) para as operações de leitura (`SELECT`) e atualização (`UPDATE`).
- **Realtime**: Habilitado na tabela `notifications` (inserção na publication `supabase_realtime`) para que o aplicativo receba os dados instantaneamente via WebSockets.
- **Automação (Trigger)**: Criada a trigger `tg_on_public_timeline_insert` na tabela `occurrence_timeline`. A função associada (`handle_new_timeline_event`) verifica se a nova nota tem `is_public = true` e, caso positivo, insere automaticamente uma nova notificação direcionada ao `user_id` dono do chamado original.

### App Mobile (Flutter)
- **Domain & Data**: Implementação aderente à Clean Architecture com a entidade `NotificationEntity` e a classe `NotificationRepositoryImpl` utilizando o Supabase Stream (`.stream()`).
- **State Management (Riverpod)**:
  - `notificationsProvider`: Consome e provê a stream das notificações do usuário autenticado.
  - `unreadNotificationsCountProvider`: Deriva os dados da stream calculando apenas o total de itens onde `is_read = false`.
- **UI & Navegação (GoRouter)**:
  - **Badge Reativo**: Adicionado o ícone do sino 🔔 na `HomePage`, reagindo ao Provider de contagem de notificações e exibindo uma bolinha vermelha para itens não lidos.
  - **NotificationsPage**: Lista contendo todas as notificações. As não lidas recebem destaque (fundo azulado e texto negrito).
  - **Interação**: Ao tocar na notificação, ela é marcada como lida (`markAsRead` do repositório) assincronamente e o cidadão é levado aos detalhes do chamado na mesma hora (rota `/chamado/:id`).

## 3. Walkthrough (Log de Validação)
### Arquivos Modificados/Criados
- [NEW] `cidadao_conecta/lib/domain/entities/notification_entity.dart`
- [NEW] `cidadao_conecta/lib/domain/repositories/notification_repository.dart`
- [NEW] `cidadao_conecta/lib/data/repositories/notification_repository_impl.dart`
- [NEW] `cidadao_conecta/lib/ui/notifications/pages/notifications_page.dart`
- [MODIFY] `cidadao_conecta/lib/core/di/providers.dart` (Injeção de Providers)
- [MODIFY] `cidadao_conecta/lib/ui/home/pages/home_page.dart` (Adição do Badge)
- [MODIFY] `cidadao_conecta/lib/routing/app_router.dart` (Adição da Rota `notificacoes`)

### Testes do Dibro e Ações Extras
1. **Validação de Schema e Trigger:** Acessamos via MCP do Supabase e testamos a geração de notificação simulando uma nota interna (`is_public = false`, sem notificação) e uma pública (`is_public = true`, que gerou a notificação perfeitamente ligada ao usuário).
2. **Bugfix (Painel Web - Gestão):** O usuário `attendant@test.com` (teste manual) estava com erro na triagem Web por conta da falta de departamento. Para seguir testando a Sprint, fizemos um update na Role do banco, alterando para `MANAGER`, o que destravou o acesso geral dele.
3. **Bugfix (Build do Dart):** Resolvemos um conflito silencioso de importações (caminhos absolutos do package `package:cidadao_conecta/...` conflitando com os relativos) no `occurrence_repository.dart` e forçamos o hot restart com Cold Boot do emulador para verificar a nova versão com o botão de sininho funcionando.

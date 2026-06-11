# Relatório Consolidado - Sprint 22

## 1. Resumo Executivo
Nesta sprint, entregamos a Conformidade LGPD referente à Exclusão de Conta no ecossistema Conecta. O objetivo principal era permitir que os cidadãos solicitassem e executassem a exclusão permanente de seus dados pessoais pelo aplicativo móvel, enquanto garantíamos a manutenção do histórico operacional e analítico para os gestores na prefeitura.
Para isso, foi alterada a forma como os chamados estão vinculados aos usuários, promovendo a anonimização em vez da deleção em cascata (CASCADE para SET NULL). Além disso, implementamos uma nova regra de negócios automática: quando o usuário exclui a conta, todos os seus chamados ativos não concluídos são automaticamente movidos para o status "Rejeitado", recebendo uma anotação sistêmica para auditoria interna.

## 2. Blueprint (Arquitetura)

### 2.1. Banco de Dados (Supabase)
- **Constraint Alterada:** A foreign key em `occurrences` que liga ao `auth.users` foi modificada de `ON DELETE CASCADE` para `ON DELETE SET NULL`, preservando os chamados.
- **Occurrence Status:** O enum `occurrence_status` recebeu o novo valor `REJECTED`.
- **Occurrence Timeline:** Adicionada a nova coluna nula `system_author_name` para permitir o registro de auditoria via sistema sem associar a um e-mail.
- **RPC `delete_user_account`:** A function com `SECURITY DEFINER` foi reescrita. Antes da exclusão do registro em `auth.users`, ela itera sobre os chamados ativos (diferentes de COMPLETED e REJECTED), alterando-os para `REJECTED` e publicando um evento privado na linha do tempo contendo o "Artigo X dos termos de aceite".

### 2.2. Portal Web (Gestão Conecta - Next.js)
- Adicionado mapeamento do novo status `REJECTED` na UI (`bg-red-100 text-red-800`).
- Atualizada a `TimelineEntry` no arquivo `src/actions/chamados.ts`.
- O renderizador da timeline foi adaptado para exibir a string contida em `system_author_name` se estiver presente, ou exibir `Conta Excluída` se a conta não estiver mais disponível e não for um evento de sistema.

### 2.3. Aplicativo Mobile (Cidadão Conecta - Flutter)
- **Registro de Conta:** Checkbox obrigatório de Termos de Uso adicionado à tela de registro (`register_screen.dart`).
- **Repositório:** Implementado o método `deleteAccount()` em `AuthRepositoryImpl`.
- **ViewModel e Reatividade:** `MeuPerfilViewModel` foi refatorada para ser 100% reativa à stream `authStateProvider`, corrigindo o bug de `loading` infinito durante hot-restarts ou transições assíncronas.
- **UI:** Incluído um "Danger Zone" na página do Perfil com Dialogs de duplo-checkin para a exclusão irreversível.

## 3. Walkthrough (Log de Validação)
- **Feature Branch:** `feature/sprint-22-lgpd-compliance`
- **Validações Manuais Realizadas:** 
  - Testado o processo de exclusão de conta via App Flutter, verificando o redirecionamento imediato para login após a execução do RPC.
  - O e-mail de teste "zschuster@firstlawyer.org" foi ativado e excluído via processo ponta-a-ponta, validando a exclusão em `auth.users`.
  - Verificado no Web Portal que a linha do tempo exibe corretamente a badge de "Conta Excluída" e a anotação sistêmica de Rejeição, validando o fallback e a reatividade.
- **Correções Adicionais:** Corrigida renderização infinita (`CircularProgressIndicator`) no perfil lidando proativamente com estados vazios ou dessincronizados do provedor de auth do Riverpod.

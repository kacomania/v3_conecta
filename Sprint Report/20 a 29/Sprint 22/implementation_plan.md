# Rejeição Automática de Chamados na Exclusão de Conta

O objetivo desta implementação é garantir que, quando um usuário excluir sua conta, todos os seus chamados ativos sejam automaticamente classificados como "REJECTED" e uma mensagem sistêmica padrão seja incluída na linha do tempo desses chamados.

## User Review Required
> [!IMPORTANT]
> Verifique se o texto exato da mensagem interna e o nome do autor do sistema atendem aos requisitos legais do termo de aceite.

## Proposed Changes

### Banco de Dados (Supabase)

#### 1. Alteração do Enum de Status
Adicionaremos o valor `REJECTED` ao enum `occurrence_status` existente no PostgreSQL.

#### 2. Nova Coluna na Linha do Tempo
Adicionaremos a coluna `system_author_name` (tipo TEXT, nullable) à tabela `occurrence_timeline`. Isso permitirá que mensagens geradas pelo sistema tenham uma assinatura personalizada no campo do autor, substituindo o e-mail.

#### 3. Atualização da RPC `delete_user_account`
A função atual será modificada para:
- Selecionar todos os chamados (`occurrences`) do usuário cujo status NÃO seja `COMPLETED` nem `REJECTED`.
- Inserir um registro na `occurrence_timeline` para cada chamado com:
  - `description`: "Esse chamado foi movido para rejeitado pois não possui uma conta válida associada"
  - `system_author_name`: "Status alterado pelo sistema seguindo a política interna. Artigo X dos termos de aceite.!"
  - `is_public`: `false` (atualização interna)
  - `old_status`: (status atual)
  - `new_status`: `REJECTED`
- Atualizar o status desses chamados para `REJECTED`.
- Prosseguir com a exclusão do usuário.

---

### Portal Web (`gestao_conecta`)

#### [MODIFY] `src/actions/chamados.ts`
Atualizaremos a tipagem `TimelineEntry` para incluir `system_author_name?: string | null`.

#### [MODIFY] `src/app/(admin)/dashboard/chamado/[id]/page.tsx`
Atualizaremos a UI da Linha do Tempo:
- Adicionar o status `REJECTED` na função `getStatusLabel` (rótulo: "Rejeitado") e `getStatusBadge` (cor: bg-red-100 / text-red-800).
- Na renderização do autor do evento, verificar se `entry.system_author_name` está presente. Se sim, exibir este texto. Caso contrário, exibir (e-mail ou "Conta Excluída").

## Verification Plan
1. Testar exclusão da conta.
2. Validar se os chamados ativos mudam para `REJECTED`.
3. Validar exibição da linha do tempo no portal.
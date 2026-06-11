# Atribuição de Departamentos em Chamados

O objetivo deste plano é corrigir a falha no fluxo de negócio onde chamados estão sendo registrados sem um departamento, e permitir a alteração manual do departamento no portal de Gestão.

## Open Questions

(Resolvidas - O trigger foi aprovado e a justificativa textual foi tornada obrigatória).

## Proposed Changes

### Banco de Dados (Supabase)

#### [NEW] Migration SQL
Será criada e executada uma query SQL no banco de dados para:
1. Atualizar todos os chamados atuais que estão sem `department_id` usando a tabela `categories`.
2. Criar uma Função (`set_department_from_category`) e um Trigger no Postgres que, a cada novo `INSERT` ou alteração na tabela `occurrences`, verifique se há um `category_id` e preencha automaticamente o `department_id` correto.

---

### Portal Web (Gestão Conecta)

#### [MODIFY] gestao_conecta/src/actions/chamados.ts
- Criar a nova server action `updateDepartment(formData: FormData)` que atualizará o departamento do chamado. Ela receberá o `department_id` novo e a `justificativa`, salvando uma nota detalhada na `occurrence_timeline` informando a mudança e o motivo obrigatório.

#### [NEW] gestao_conecta/src/app/(admin)/dashboard/chamado/[id]/department-form.tsx
- Criar um formulário client-side que contenha:
  - Um elemento `<select>` listando todos os departamentos da prefeitura.
  - Uma caixa de texto (textarea) para o atendente inserir **obrigatoriamente** o motivo/justificativa da mudança.
- O formulário só permitirá envio se a justificativa for preenchida e o departamento for diferente do atual.

#### [MODIFY] gestao_conecta/src/app/(admin)/dashboard/chamado/[id]/page.tsx
- Injetar uma query para buscar a lista de departamentos (`departments`) da prefeitura correspondente.
- Renderizar o componente `<DepartmentForm>` na coluna direita (abaixo do bloco de Status), permitindo que o gestor reatribua o chamado quando estiver em atendimento (`isLockedByMe`).

## Verification Plan

### Automated Tests
N/A

### Manual Verification
- Acessar a página do chamado (Protocolo `F1CFFA69`).
- O gestor deverá assumir o chamado e alterar o departamento preenchendo a justificativa obrigatória no novo formulário.
- Verificar se a alteração foi registrada na linha do tempo com o texto inserido.
- Enviar um novo chamado de teste pelo app móvel e verificar se o `department_id` foi populado automaticamente no banco de dados.

# Parte 2: Restrição de Departamentos por Prefeitura e Limpeza da Base (Sprint 27 Plus)

Para corrigir o isolamento multi-tenant (SaaS) e garantir que cada departamento pertença unicamente a uma prefeitura, alteramos o esquema do banco de dados adicionando a coluna `prefeitura_id` às tabelas `departments` e `categories`. 

Aproveitando a alteração, fizemos uma **limpeza total das ocorrências e departamentos antigos**, mantendo apenas Prefeituras e Usuários intactos, proporcionando um ambiente fresco para novos testes.

## User Review Required

> [!WARNING]
> **Impacto da Limpeza de Base (Soft Reset)**
> 1. **Perda Permanente:** Todas as Ocorrências, Notas Internas, Logs de Auditoria, Departamentos e Categorias foram excluídos definitivamente do banco de dados.
> 2. **Usuários e Tenants mantidos:** Os usuários (Cidadãos, Atendentes, Admins) e as Prefeituras continuaram existindo e funcionando normalmente, sem precisar refazer login ou recadastro.
> 3. **Novo Setup Necessário:** Após a limpeza, o Administrador precisou acessar o portal Gestão Conecta e **recadastrar** os Departamentos e Categorias para a sua Prefeitura.

## Proposed Changes

---

### Banco de Dados (Schema & Limpeza)

#### [MODIFY] [01_schema.sql](file:///e:/V3_conecta/backend_database/01_schema.sql)
- Adicionada coluna `prefeitura_id UUID NOT NULL REFERENCES public.prefeituras(id) ON DELETE CASCADE` na tabela `departments` e `categories`.
- Atualizadas as políticas de RLS de ambas as tabelas para que os dados fiquem filtrados corretamente por Tenant (`prefeitura_id`).

#### [NEW] Script de Reset e Migração (SQL)
- Criado `04_limpeza_e_multi_tenant.sql` com TRUNCATE CASCADE e adição condicional (IF NOT EXISTS) da nova coluna.

---

### Gestão Conecta (Web Portal)

#### [MODIFY] [page.tsx](file:///e:/V3_conecta/gestao_conecta/src/app/(admin)/dashboard/chamado/%5Bid%5D/page.tsx)
- Como a coluna agora existe de fato no banco, restauramos o código que limitava o dropdown da tela de detalhes do chamado para buscar departamentos da prefeitura específica (`.eq('prefeitura_id', occurrence.prefeitura_id)`).

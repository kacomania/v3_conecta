# Plano de Implementação: Auditoria e Restrições de Nível Cidadão

## 1. Nova Tela de Auditoria (`/dashboard/auditoria`)
Para permitir que gestores analisem a governança de acessos:
- **Página Nova:** `src/app/(admin)/dashboard/auditoria/page.tsx`
- **Acesso Restrito:** Utilizaremos o RLS atual que já protege a tabela `system_audit_logs`. A página verificará no servidor o `access_level`. Apenas níveis 3 (AUDITOR), 4 (CITY_ADMIN) e 5 (SYSTEM_ADMIN) terão acesso. Se o nível for menor, bloqueamos o acesso.
- **Tabela de Dados:** Faremos um `SELECT` em `system_audit_logs` buscando também as tabelas relacionadas (e-mail do administrador que fez a ação, e-mail de quem sofreu a ação, nome do cargo e dos departamentos).
- **Inclusão na Sidebar:** O link para "Auditoria" será adicionado à navegação lateral (`layout.tsx`), aparecendo apenas para `access_level >= 3`.

## 2. Restrição à Conta `USER` (Nível 0)
Conforme regra de negócio solicitada: *Contas de nível USER não podem receber departamentos nem ser promovidas.*
- **Frontend (`user-role-form.tsx`):**
  - Checaremos se o nível do alvo é 0 (`ur.roles?.access_level === 0`).
  - Se for 0, o formulário inteiro (selects e checkboxes) ficará desativado (disabled).
  - O botão de "Salvar" exibirá "Conta de Cidadão (Bloqueada)".
- **Backend (`actions/admin.ts`):**
  - Adicionaremos uma trava rígida: `if (targetUserLevel === 0) throw new Error(...)`.
  - Isso garante que nenhuma requisição maliciosa tente promover um Cidadão à revelia, mantendo a integridade estrita entre a gestão interna e a área pública.

> [!IMPORTANT]
> **Jang, favor revisar:**
> 1. Mostrar os usuários `USER` (Cidadãos) desabilitados na lista da Administração é suficiente, ou você prefere que eles sejam **totalmente ocultados** da listagem de `/dashboard/usuarios` para não poluir a tela?
> 2. Podemos proceder com as implementações de tela descritas acima?

# Implementação: Gestão de Prefeituras e Secretarias (Configurações)

Esta solicitação envolve a criação de uma nova área administrativa restrita ao administrador do sistema (`SYSTEM_ADMIN`), permitindo o cadastro de Prefeituras e a vinculação de Secretarias (Departamentos) a elas.

## ⚠️ User Review Required

> [!WARNING]
> A tabela `departments` atualmente não possui a coluna `prefeitura_id`. Para que possamos associar uma secretaria a uma prefeitura específica, **precisaremos alterar a tabela `departments` no banco de dados**, adicionando a coluna `prefeitura_id` como uma chave estrangeira para `prefeituras(id)`. Por favor, aprove se está de acordo com esta alteração no modelo de dados.

## Open Questions

> [!IMPORTANT]
> 1. Deseja que a página de configurações seja exclusiva do `SYSTEM_ADMIN` (nível 5) e fique invisível no menu lateral para outros usuários?
> 2. Posso prosseguir com a execução do comando SQL para alterar a tabela `departments` usando o Supabase MCP?

## Proposed Changes

### Database (Supabase)
Executar instrução SQL para alterar a estrutura:
```sql
ALTER TABLE departments ADD COLUMN prefeitura_id UUID REFERENCES prefeituras(id);
```

### gestao_conecta/src/actions/configuracoes.ts
- **[NEW]**: Criar Server Actions para gerenciar operações de banco de dados (`createPrefeitura`, `getPrefeituras`, `createDepartment`, `getDepartmentsByPrefeitura`).

### gestao_conecta/src/app/(admin)/dashboard/configuracoes/page.tsx
- **[NEW]**: Criar a página de listagem e formulários de criação.
- Implementar verificação de autorização no Server Component, barrando usuários com `access_level < 5`.

### gestao_conecta/src/app/(admin)/layout.tsx
- **[MODIFY]**: Atualizar o link "Configurações" na Sidebar para apontar para `/dashboard/configuracoes`.
- Condicionar a exibição do link "Configurações" para ocorrer apenas se `accessLevel >= 5`.

## Verification Plan
1. Atualizar o banco de dados e conferir a persistência da nova coluna `prefeitura_id`.
2. Acessar a página logado como usuário comum (deve ser bloqueado/escondido) e como admin.
3. Criar uma prefeitura e uma secretaria associada, verificando se são refletidas no banco.

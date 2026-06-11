# Plano de Implementação: Filtros em Cascata e Busca por Protocolo

A implementação adicionará uma experiência de funil para o auditor poder segmentar exatamente os logs que ele deseja ver, além de permitir a pesquisa direta por número de protocolo.

## User Review Required

> [!WARNING]
> **Modelo de Dados de Departamentos**
> Atualmente, a tabela `departments` é global (não possui `prefeitura_id`). Portanto, ao selecionar uma Prefeitura, podemos listar todos os departamentos globais, ou filtrar apenas os departamentos que possuem usuários vinculados àquela prefeitura (via `user_departments`). O plano assume a listagem de todos os departamentos globais.

> [!WARNING]
> **Usuários e Categorias**
> Os usuários são vinculados a Departamentos (via `user_departments`), mas não são vinculados a Categorias. Portanto, ao selecionar uma Categoria, a lista de usuários mostrará os servidores daquele Departamento.

## Open Questions

1. **Protocolo na Timeline:** Como os logs atuais estão vindo de `occurrence_timeline` e `system_audit_logs`, precisarei cruzar a `occurrence_timeline` com a tabela `occurrences` para trazer o número do protocolo do chamado para a interface? (A resposta deve ser afirmativa para conseguirmos buscar).
2. **Listagem de Usuários:** Ao chegar no último dropdown (Usuários), deseja que liste todos os usuários da prefeitura selecionada, ou somente os usuários que pertencem àquele departamento específico?

## Proposed Changes

### Gestão Conecta (Next.js)

#### [MODIFY] `gestao_conecta/src/actions/audit.ts`
- Atualizar a função `getAuditLogs` para receber os novos parâmetros de filtro: `prefeituraId`, `departmentId`, `categoryId`, e `userId`.
- Receber também novos parâmetros `sortBy` (`'date'` ou `'author'`) e `sortOrder` (`'asc'` ou `'desc'`).
- Fazer um JOIN com a tabela `occurrences` ao buscar a `occurrence_timeline` para trazer o número do protocolo.
- Atualizar a lógica de busca textual (`userName` que agora chamaremos de `searchQuery`) para também verificar se o texto bate com o número do protocolo.
- Atualizar a rotina de ordenação no final da função (que hoje ordena estaticamente por data decrescente) para respeitar `sortBy` e `sortOrder`.

#### [NEW] `gestao_conecta/src/actions/filters.ts` (ou adicionar no `audit.ts`)
- Criar Server Actions auxiliares para alimentar os dropdowns de forma assíncrona:
  - `getPrefeituras()`
  - `getDepartments()`
  - `getCategories(departmentId)`
  - `getUsers(prefeituraId, departmentId)`

#### [MODIFY] `gestao_conecta/src/app/(admin)/dashboard/auditoria/page.tsx`
- Atualizar a recepção de `searchParams` para incluir os novos IDs na URL.
- Passar os parâmetros e os novos dados de filtros iniciais (como a lista de prefeituras) para o `AuditClient`.

#### [MODIFY] `gestao_conecta/src/app/(admin)/dashboard/auditoria/AuditClient.tsx`
- Substituir o input de busca atual por um layout com 4 Selects/Dropdowns em cascata:
  - Prefeitura (Sempre visível).
  - Departamento (Aparece ao selecionar Prefeitura).
  - Categoria (Aparece ao selecionar Departamento).
  - Usuário (Aparece ao selecionar Categoria).
- Atualizar o campo de busca de texto existente para placeholder "Buscar por servidor ou protocolo...".
- Adicionar cabeçalhos clicáveis (com ícones indicativos de ordenação) nas colunas "Data / Hora" e "Autor".
- Adicionar lógica com `useRouter` para sincronizar os selections e a ordenação com a URL (ex: `?prefeituraId=...&sortBy=date&sortOrder=asc`).

## Verification Plan

### Manual Verification
1. Entrar na tela de Auditoria como Auditor ou System Admin.
2. Validar que apenas o Dropdown de Prefeituras está visível.
3. Clicar em uma prefeitura e garantir que o dropdown de Departamentos apareceu.
4. Seguir a cascata até selecionar um usuário e checar se a URL atualiza os parâmetros.
5. Digitar um número de protocolo válido no campo de busca e verificar se os logs do respectivo chamado aparecem isoladamente.
6. Clicar no título da coluna "Data / Hora" e verificar se a lista inverte a ordenação e a URL atualiza corretamente.
7. Clicar na coluna "Autor" e garantir que a ordenação alfabética (crescente/decrescente) funciona.

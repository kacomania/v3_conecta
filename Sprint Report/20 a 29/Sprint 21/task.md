# Audit Panel Enhancement Checklist

- [x] **Task 01: Server Actions e Filtros**
  - Criar função para buscar Prefeituras.
  - Criar função para buscar Departamentos (filtrados por prefeitura_id via user_departments).
  - Criar função para buscar Categorias (filtradas por department_id).
  - Criar função para buscar Usuários (filtrados por department_id e prefeitura_id via user_departments).
- [x] **Task 02: Atualização do `getAuditLogs` (src/actions/audit.ts)**
  - Receber os novos parâmetros: `prefeituraId`, `departmentId`, `categoryId`, `userId`, `sortBy` e `sortOrder`.
  - Fazer join em `occurrence_timeline` com `occurrences` para buscar o `protocol_number`.
  - Aplicar filtros lógicos no array em memória.
  - Aplicar ordenação dinâmica nas colunas.
- [x] **Task 03: Page Server (src/app/(admin)/dashboard/auditoria/page.tsx)**
  - Adicionar extração de novos `searchParams`.
  - Buscar dados iniciais (Prefeituras) para repassar ao Client.
- [x] **Task 04: Componente Client (src/app/(admin)/dashboard/auditoria/AuditClient.tsx)**
  - Implementar estado local para gerenciar o fluxo dos 4 dropdowns.
  - Adicionar ícones e cliques nos cabeçalhos de tabela para ordenação.
  - Adicionar debounce e atualização da URL de busca de texto.

# Walkthrough: Atribuição de Departamentos em Chamados

Esta funcionalidade garante que chamados nunca fiquem órfãos de departamento e permite que a gestão reatribua tickets quando necessário.

## O que foi implementado

### 1. Automação no Banco de Dados (Supabase)
> [!NOTE]
> Essa foi a mudança principal para garantir resiliência, independente se o chamado vier do app móvel ou de APIs futuras.

- **Trigger (`trg_set_department_from_category`)**: Criamos um gatilho que intercepta qualquer `INSERT` ou `UPDATE` na tabela de ocorrências. Sempre que um `category_id` é fornecido, a função do Postgres automaticamente busca a qual departamento a categoria pertence e preenche o `department_id` do chamado.
- **Backfill**: Rodamos um script de atualização (UPDATE) que corrigiu os chamados antigos do banco que tinham uma categoria válida mas o departamento estava nulo.

### 2. Interface de Gestão (Portal Web)
> [!IMPORTANT]
> A funcionalidade de alteração só pode ser feita quando o gestor estiver com o chamado **"Travado"** (Locked) para si mesmo, garantindo as regras de negócio de atendimento.

- **Novo Formulário de Reatribuição**: Implementamos o `department-form.tsx` na página de detalhes do chamado (coluna da direita). 
- **Justificativa Obrigatória**: O formulário bloqueia o botão de envio até que o atendente forneça explicitamente um texto no campo *Motivo da Reatribuição*.
- **Timeline do Chamado**: Qualquer mudança feita através do formulário invoca a Server Action `updateDepartment`, que atualiza a ocorrência e insere instantaneamente uma nota não-pública na linha do tempo, documentando quem mudou, para onde o chamado foi e o texto justificativo.

## Testando

1. Acesse o portal web rodando localmente no Chrome.
2. Navegue até o dashboard e abra um dos chamados pendentes (ou em análise).
3. Assuma o chamado para liberar os formulários de edição.
4. Troque o departamento do chamado e informe um motivo.
5. Verifique a nota adicionada ao fim da Linha do Tempo registrando a ação de reatribuição.

### 3. Isolamento Multi-Tenant e Restrição de Departamentos (SaaS)
> [!WARNING]
> **Alteração Estrutural e Limpeza da Base de Dados**
> Para garantir que os Atendentes e Cidadãos só vejam e utilizem os Departamentos da **sua própria Prefeitura**, a coluna `prefeitura_id` foi adicionada às tabelas `departments` e `categories` no schema do PostgreSQL (`01_schema.sql`).

- **Limpeza (Truncate):** Realizamos um expurgo completo dos dados de chamados, auditoria, departamentos e categorias antigos do banco de desenvolvimento para aplicar a restrição `NOT NULL` de forma segura. Prefeituras e Usuários foram preservados.
- **Novos RLS:** Foram criadas novas *Row Level Security* (RLS) policies no Supabase, garantindo a nível de banco de dados que um tenant nunca terá acesso ou listará departamentos de outro.
- **Portal Web Corrigido:** A página de detalhes do chamado `page.tsx` voltou a filtrar o select list de reatribuição (`.eq('prefeitura_id', ...)`) agora que o schema oficial do SaaS suporta essa associação.

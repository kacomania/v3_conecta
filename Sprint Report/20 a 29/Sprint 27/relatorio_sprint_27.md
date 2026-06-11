# Relatório da Sprint 27 - Cidadão Conecta & Gestão Conecta

## 1. Resumo Executivo
Nesta sprint, entregamos a correção do fluxo de inteligência artificial e aprimoramos as regras de negócio para atribuição de departamentos aos chamados do Cidadão Conecta. Identificamos que a Edge Function de análise de sentimento não estava publicada e solucionamos isso para garantir que feedbacks recebidos no aplicativo móvel sejam corretamente avaliados como Positivos, Neutros ou Negativos pelo modelo Gemini 2.5 Flash, e devidamente exibidos no portal Gestão Conecta.
Além disso, resolvemos o bug de chamados sem departamento ("Sem Departamento") criando uma automação em banco de dados e desenvolvemos um novo formulário obrigando o gestor a justificar reatribuições no painel web, gerando mais transparência e rastreabilidade para o município.

**Extensão (Sprint 27 Plus):** Focamos na estabilização do isolamento de tenants (Prefeituras) para o sistema de Departamentos e Categorias. Estabelecemos que cada Prefeitura tenha acesso exclusivamente aos seus próprios departamentos (`prefeitura_id` NOT NULL), fortalecendo a segurança e aderência à arquitetura SaaS multi-tenant. Foi realizado também um expurgo controlado da base de testes para garantir a consistência rigorosa das novas restrições.

## 2. Blueprint (Arquitetura)
### Stack & Infraestrutura
- **Supabase Cloud:** Utilizamos o MCP Server do Supabase para fazer deploy da Edge Function `analyze-sentiment`, que consome a API do Google Gemini.
- **Banco de Dados (PostgreSQL):** Criamos uma regra de negócios a nível de banco (Trigger `trg_set_department_from_category`) em vez de no aplicativo. Isso garante que a atribuição de departamento baseada na categoria escolhida funcione perfeitamente, não importando a origem do chamado (Mobile App ou API externa).
- **Gestão Conecta (Next.js):** Mantivemos a Clean Architecture no frontend separando as *Server Actions* (`actions/chamados.ts`) do formulário Client-Side (`department-form.tsx`).
- **Segurança & Auditoria:** Adicionamos o log interno não-público (`is_public: false`) na tabela `occurrence_timeline` sempre que a Server Action de alteração de departamento é chamada.
- **SaaS Multi-Tenant (Sprint 27 Plus):** Inclusão da coluna `prefeitura_id` obrigatória nas tabelas `departments` e `categories`. Reforço agressivo do Row Level Security (RLS) impedindo vazamento de dados de secretaria entre inquilinos. Uso do `.eq('prefeitura_id', ...)` restaurado no Web Portal para alinhar com o novo design de banco.

## 3. Walkthrough (Log de Validação)
### Arquivos Modificados/Criados
- `[NEW]` `supabase/.env.local`: Criado para testes locais da IA.
- `[DEPLOY]` `supabase/functions/analyze-sentiment`: A função foi publicada na nuvem via comando MCP `deploy_edge_function`.
- `[NEW]` `gestao_conecta/src/app/(admin)/dashboard/chamado/[id]/department-form.tsx`: Componente de UI para alteração do departamento.
- `[MODIFY]` `gestao_conecta/src/app/(admin)/dashboard/chamado/[id]/page.tsx`: Injeção do componente de reatribuição e restauração de filtro de tenant.
- `[MODIFY]` `gestao_conecta/src/actions/chamados.ts`: Action `updateDepartment` que persiste a alteração e atualiza a timeline.
- `[MODIFY]` `backend_database/01_schema.sql`: Atualização do schema documentando as novas restrições (Sprint 27 Plus).
- `[NEW]` `backend_database/04_limpeza_e_multi_tenant.sql`: Migração contendo TRUNCATE das tabelas operacionais e adição das colunas `prefeitura_id` via `IF NOT EXISTS`.

### Comandos SQL Rodados no Supabase
1. **Backfill** (Para corrigir registros vazios que causavam erro na view):
```sql
UPDATE occurrences o
SET department_id = c.department_id
FROM categories c
WHERE o.category_id = c.id
AND o.department_id IS NULL;
```
2. **Criação da Função e Trigger**:
```sql
CREATE OR REPLACE FUNCTION set_department_from_category()
RETURNS TRIGGER AS $$
BEGIN
  IF NEW.category_id IS NOT NULL THEN
    SELECT department_id INTO NEW.department_id
    FROM categories
    WHERE id = NEW.category_id;
  END IF;
  RETURN NEW;
END;
$$ LANGUAGE plpgsql;

DROP TRIGGER IF EXISTS trg_set_department_from_category ON occurrences;

CREATE TRIGGER trg_set_department_from_category
BEFORE INSERT OR UPDATE OF category_id ON occurrences
FOR EACH ROW
EXECUTE FUNCTION set_department_from_category();
```

### Validação
- **Bug da IA:** Foi validado localmente e publicado na nuvem. O ícone de sentimento já renderiza adequadamente no portal.
- **Regras de Departamento:** A trigger já está ativa na nuvem. O formulário de interface só desbloqueia o botão de envio se o gestor preencher a *textarea* da justificativa, garantindo sucesso no fluxo de negócio.
- **Isolamento de Tenants (Sprint 27 Plus):** Rodado script de TRUNCATE em tabelas operacionais (`departments`, `occurrences`, `announcements`) e adição de restrições nas colunas `prefeitura_id` para resolver falhas de visibilidade no form de atribuição de departamento.

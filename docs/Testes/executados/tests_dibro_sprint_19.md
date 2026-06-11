# 🧪 Plano de Testes (Desenvolvedor / Dibro) - Sprint 19

**Responsável:** Dibro (Agente IA)
**Objetivo:** Validar a lógica de cálculo de SLA diretamente no motor do PostgreSQL.

## 1. Validação da Trigger (Simulação SQL)
- [ ] Inserir manualmente um registro na tabela `occurrences` (fornecendo um `category_id` válido, mas OMITINDO o campo `due_date`).
- [ ] Fazer um `SELECT` no registro recém-criado. Validar se o campo `due_date` foi preenchido automaticamente pelo banco.
- [ ] Verificar se a diferença entre `created_at` e `due_date` corresponde exatamente ao `sla_hours` configurado na categoria vinculada.

## 2. Validação da Tipagem (Next.js & Flutter)
- [ ] Garantir que o tipo exportado do Supabase no Next.js reflete o novo campo `due_date`.
- [ ] Garantir que o `RequestModel` ou `OccurrenceEntity` no Flutter aceita `due_date` como um campo `DateTime` anulável.
# 🧪 Plano de Testes (Desenvolvedor / Dibro) - Sprint 23

**Responsável:** Dibro (Agente IA)
**Objetivo:** Validar o cálculo das agregações SQL e a estabilidade da Server Action.

## 1. Validação da RPC (`get_csat_metrics`)
- [ ] Conectar ao Supabase (via MCP) e invocar a função `get_csat_metrics` passando um `prefeitura_id` válido.
- [ ] Verificar se a função retorna corretamente as chaves esperadas (ex: `global_average`, `total_reviews`, `department_ranking`).
- [ ] Validar o comportamento quando não há avaliações: a função deve retornar `0` ou `null` nas médias, sem causar erro de divisão por zero.

## 2. Validação da Server Action
- [ ] Garantir que a busca pelos "Últimos Feedbacks" possui um `.limit()` (ex: 50) para evitar sobrecarga de memória na renderização da lista.
- [ ] Garantir que a query exclui registros onde `feedback_notes` é apenas uma string vazia `""` ou espaços em branco.
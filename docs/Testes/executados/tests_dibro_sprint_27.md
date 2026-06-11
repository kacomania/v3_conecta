# 🧪 Plano de Testes (Desenvolvedor / Dibro) - Sprint 27

**Responsável:** Dibro (Agente IA)
**Objetivo:** Validar o comportamento da Edge Function, a estabilidade do prompt da LLM e as consultas no banco de dados.

## 1. Validação de Banco de Dados e RPC
- [ ] Confirmar se a coluna `sentiment` foi criada na tabela `occurrences`.
- [ ] Executar a RPC `get_csat_metrics` manualmente via SQL e verificar se a nova chave de contagem de sentimentos (`sentiment_counts` ou similar) está presente no payload JSON de retorno.

## 2. Validação da Edge Function (Mock de IA)
- [ ] Criar um script de teste rápido ou usar `curl` para invocar a função `analyze-sentiment` localmente (via `supabase functions serve`).
- [ ] Passar o payload: `{"occurrence_id": "[ID_VALIDO]", "feedback": "Equipe demorou muito, serviço péssimo!"}`. Verificar se a função atualiza o banco para `NEGATIVE`.
- [ ] Passar o payload com feedback vazio ou nulo. Verificar se a função trata a exceção e define o sentimento como `NEUTRAL` sem retornar HTTP 500 para o cliente.
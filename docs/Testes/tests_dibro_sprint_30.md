# 🧪 Plano de Testes (Desenvolvedor / Dibro) - Sprint 30

**Responsável:** Dibro (Agente IA)
**Objetivo:** Validar o isolamento das integrações e o disparo da Edge Function.

## 1. Validação de Banco de Dados e RLS
- [ ] Garantir que a tabela `webhooks_endpoints` possua uma *Unique Constraint* para o `prefeitura_id` (assumindo que cada prefeitura tenha apenas 1 URL principal de webhook nesta V1).
- [ ] Verificar as políticas de RLS: Usuários normais ou Atendentes não podem fazer `SELECT` na tabela de webhooks (pois contém tokens de segurança).

## 2. Validação da Edge Function (`webhook-dispatcher`)
- [ ] Executar a função localmente simulando um payload do Postgres. Garantir que a função extrai o `prefeitura_id`, busca a URL correspondente no banco e tenta realizar o `fetch`.
- [ ] Testar resiliência: Se a URL do webhook do cliente estiver fora do ar (timeout ou status 500), a Edge Function deve lidar com o erro no `catch` e terminar a execução sem gerar retentativas infinitas que sobrecarreguem o Supabase.
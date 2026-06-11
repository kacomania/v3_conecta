# 🧪 Plano de Testes (Desenvolvedor / Dibro) - Sprint 17

**Responsável:** Dibro (Agente IA)
**Objetivo:** Validar a Trigger do banco de dados e as permissões de RLS da nova tabela de notificações.

## 1. Validação de Schema e RLS
- [ ] Verificar se a tabela `notifications` foi criada com as colunas corretas (`user_id`, `occurrence_id`, `message`, `is_read`).
- [ ] Testar RLS: Tentar realizar um `SELECT` na tabela `notifications` sem estar autenticado ou com um usuário diferente do `user_id`. O retorno deve ser vazio ou erro de permissão.
- [ ] Verificar se a publicação de *Realtime* está ativa para a tabela `notifications`.

## 2. Validação da Trigger (Simulação SQL)
- [ ] Criar um registro manual de teste na tabela `occurrence_timeline` com `is_public = false`. Verificar se a tabela `notifications` **continua vazia** (não deve notificar notas internas).
- [ ] Criar um registro manual na tabela `occurrence_timeline` com `is_public = true` para uma `occurrence_id` válida. Verificar se a tabela `notifications` agora possui **exatamente 1 novo registro** com o `user_id` correto e `is_read = false`.
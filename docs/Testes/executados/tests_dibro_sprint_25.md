# 🧪 Plano de Testes (Desenvolvedor / Dibro) - Sprint 25

**Responsável:** Dibro (Agente IA)
**Objetivo:** Validar a tabela de devices e a compilação da Edge Function.

## 1. Validação de Banco de Dados
- [ ] Verificar se a tabela `user_devices` foi criada corretamente.
- [ ] Confirmar se a extensão `pg_net` foi habilitada no PostgreSQL (`CREATE EXTENSION IF NOT EXISTS pg_net;`).
- [ ] Analisar a Trigger/Webhook de disparo para a Edge Function, garantindo que o payload do `INSERT` (tabela `notifications`) está sendo formatado como JSON.

## 2. Validação Mobile
- [ ] Verificar se as dependências do Firebase não causaram conflito de versão no `pubspec.yaml`.
- [ ] Garantir que o repositório realiza um `upsert` (e não apenas `insert`) na tabela `user_devices`, evitando erros de chave duplicada caso o token seja atualizado.
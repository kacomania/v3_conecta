# 🧪 Plano de Testes (Desenvolvedor / Dibro) - Sprint 26

**Responsável:** Dibro (Agente IA)
**Objetivo:** Validar a Edge Function de Multicast e a segurança do banco.

## 1. Validação de Banco de Dados (RLS)
- [x] Verificar se a tabela `announcements` possui a coluna `prefeitura_id`.
- [x] Testar RLS: Garantir que a política de INSERT permite apenas usuários com `access_level >= 2` (MANAGER/CITY_ADMIN).
- [x] Verificar se a Trigger `AFTER INSERT` (Webhook) está conectada corretamente à nova Edge Function `broadcast-push`.

## 2. Validação da Edge Function (Deno)
- [x] Revisar o código TypeScript para confirmar a presença da lógica de "Chunking" (divisão de arrays em 500 posições) antes de chamar `messaging().sendMulticast()`.
- [x] Validar se a função realiza um `SELECT fcm_token FROM user_devices` fazendo JOIN ou filtrando corretamente os usuários que pertencem à `prefeitura_id` do comunicado.
# 🧪 Plano de Testes (Desenvolvedor / Dibro) - Sprint 22

**Responsável:** Dibro (Agente IA)
**Objetivo:** Validar a segurança da RPC de exclusão e a integridade referencial do banco.

## 1. Validação de Constraints (Supabase)
- [ ] Verificar no schema do PostgreSQL se a constraint de `user_id` na tabela `occurrences` agora possui a regra `ON DELETE SET NULL`.
- [ ] (Opcional) Tentar deletar um usuário fictício diretamente no SQL e verificar se a ocorrência dele permanece na tabela `occurrences` com `user_id = null`.

## 2. Validação da RPC (`delete_user_account`)
- [ ] Verificar se a função possui `SECURITY DEFINER`.
- [ ] Garantir que a função atua ESTRITAMENTE sobre o ID retornado por `auth.uid()`, impossibilitando que um usuário passe o ID de outro usuário como parâmetro para deletá-lo indevidamente.
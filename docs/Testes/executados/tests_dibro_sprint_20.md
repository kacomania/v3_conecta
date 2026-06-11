# 🧪 Plano de Testes (Desenvolvedor / Dibro) - Sprint 20

**Responsável:** Dibro (Agente IA)
**Objetivo:** Validar as constraints de banco e os fluxos de repositório da Avaliação.

## 1. Validação de Schema (Supabase)
- [ ] Confirmar se a coluna `rating` foi criada e possui o `CHECK (rating >= 1 AND rating <= 5)`.
- [ ] Teste de banco direto: Tentar rodar um `UPDATE occurrences SET rating = 6` em um ID válido. O banco DEVE rejeitar a operação.

## 2. Validação de Permissão (RLS / Flutter)
- [ ] Verificar se a política de `UPDATE` da tabela `occurrences` permite que o usuário dono do chamado atualize seu próprio registro.
- [ ] Garantir que o método `rateOccurrence` no Flutter envia apenas `rating` e `feedback_notes` no mapa do update, não alterando status indevidamente.
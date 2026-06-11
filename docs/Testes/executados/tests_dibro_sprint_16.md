# 🧪 Plano de Testes (Desenvolvedor / Dibro) - Sprint 16

**Responsável:** Dibro (Agente IA)
**Objetivo:** Validar a integridade do banco de dados, regras de servidor e inscrições de WebSocket antes de entregar para o QA Manual.

## 1. Validação de Schema (Supabase)
- [ ] Verificar se as colunas `locked_by` (UUID) e `locked_at` (TIMESTAMPTZ) existem na tabela `occurrences`.
- [ ] Verificar se a restrição de chave estrangeira (FK) de `locked_by` aponta corretamente para `auth.users(id)`.
- [ ] Verificar se o *Replication* (Realtime) está ativado nas tabelas `occurrences` e `occurrence_timeline` (consulta na tabela `pg_publication_tables`).

## 2. Validação de Server Actions (`gestao_conecta`)
- [ ] **Ação `lockTicket` (Regra de 1 por vez):** Simular a chamada da função para um usuário que já possui um chamado atrelado ao seu UUID na coluna `locked_by`. A função DEVE lançar um erro/retorno negativo.
- [ ] **Ação `lockTicket` (Regra de 30 min):** Simular a chamada para um chamado que possui `locked_by` preenchido, mas cujo `locked_at` é `NOW() - INTERVAL '31 minutes'`. A função DEVE permitir o "roubo" da trava e inserir um log de timeout na timeline.
- [ ] **Ação `unlockTicket`:** Simular a destrava. O campo `locked_by` deve se tornar `NULL` e uma nota interna de encerramento deve ser criada.

## 3. Validação de Realtime e Streams
- [ ] **Next.js:** Confirmar no código do Client Component do Dashboard se o `supabase.channel('custom-all-channel')` possui a função de *cleanup* (`removeChannel`) no `return` do `useEffect` (prevenção de memory leak).
- [ ] **Flutter:** Confirmar se o repositório `watchTimeline` retorna um `Stream<List<OccurrenceTimelineEntity>>` e se o Riverpod Provider correspondente é um `StreamProvider` (ou equivalente no Riverpod 3.x), não um `FutureProvider`.
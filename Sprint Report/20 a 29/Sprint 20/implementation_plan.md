# Implementation Plan - Sprint 20: Avaliação de Atendimento (CSAT)

## 🎯 Objetivo
Fechar o ciclo de vida da ocorrência permitindo que o cidadão avalie o serviço prestado (1 a 5 estrelas e comentário opcional) após a conclusão do chamado. O feedback será visível para os gestores no Portal Web, fornecendo métricas de qualidade.

## 🏗️ Decisões Arquiteturais

### 1. Banco de Dados (Supabase)
- **Tabela `occurrences`:** Adicionar colunas `rating` (SMALLINT, CHECK 1 a 5) e `feedback_notes` (TEXT).
- **RLS:** A política atual já permite que o dono do chamado (`user_id = auth.uid()`) faça `UPDATE`. O backend garantirá que a nota só possa ser inserida se o status for `COMPLETED` e a nota ainda for nula (evitando múltiplas avaliações).

### 2. App Mobile (Flutter - `cidadao_conecta`)
- **Domain/Data:** Adicionar método `rateOccurrence(String id, int rating, String? feedback)` no `OccurrenceRepository`. Atualizar a entidade para ler as novas colunas.
- **UI (`DetalhesChamadoPage`):** 
  - Regra de Visibilidade: Se `status == COMPLETED` e `rating == null`, exibir um Card interativo "Como você avalia este atendimento?" com 5 estrelas clicáveis e um campo de texto opcional.
  - Se `rating != null`, exibir um Card de "Sua Avaliação" (somente leitura) com as estrelas preenchidas.
- **State Management:** Após submeter a nota, o Riverpod deve revalidar o estado para ocultar o formulário e mostrar a nota salva.

### 3. Portal Web (Next.js - `gestao_conecta`)
- **UI (`/dashboard/chamado/[id]`):** Adicionar um componente visual no painel lateral exibindo a avaliação do cidadão (Estrelas + Comentário) caso o chamado esteja concluído e avaliado.

## 🔀 Estratégia de Git
- Branch: `feature/sprint-20-avaliacao-atendimento`.
- Fechamento padrão com `@commit` e `@gerando-relatorios-sprint.md`.
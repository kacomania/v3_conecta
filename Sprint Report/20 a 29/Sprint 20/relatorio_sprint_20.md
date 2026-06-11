# Relatório Unificado da Sprint 20: Avaliação de Atendimento (CSAT)

## 1. Resumo Executivo
Foi concluído o fechamento do ciclo de vida da ocorrência (chamado), implementando a funcionalidade de avaliação de atendimento (CSAT). Agora, o cidadão pode avaliar o serviço prestado atribuindo uma nota de 1 a 5 estrelas e adicionando um comentário opcional assim que o chamado constar como `COMPLETED`. 

Essa avaliação gera valor direto para o negócio, pois fornece aos gestores métricas reais de qualidade e satisfação sobre a resolução de problemas da zeladoria urbana, as quais são imediatamente visíveis no Portal Web.

---

## 2. Blueprint (Arquitetura)

### Banco de Dados (Supabase)
- **Tabela `occurrences`**: Foram adicionadas as colunas `rating` (tipo `SMALLINT`) com restrição `CHECK (rating >= 1 AND rating <= 5)` e `feedback_notes` (tipo `TEXT`).
- **Segurança (RLS)**: O usuário titular do chamado pode realizar `UPDATE` nos próprios registros. O backend garante a transição segura para evitar avaliações múltiplas ou avaliações em chamados ainda em andamento.

### App Mobile (Flutter - `cidadao_conecta`)
- **Domain e Data**: Atualizamos a `OccurrenceEntity` para contemplar os novos campos e implementamos o método `rateOccurrence(String id, int rating, String? feedback)` no `OccurrenceRepository` para comunicar com o Supabase.
- **Interface e Estado (Clean Architecture + Riverpod)**:
  - Adicionamos o componente isolado `RatingWidget` que gerencia a interatividade de 1 a 5 estrelas.
  - A página `DetalhesChamadoPage` expõe dinamicamente um card interativo ou estático, dependendo da existência de avaliação prévia.
  - O Riverpod provê reatividade, removendo o formulário e exibindo as estrelas fixas assim que o submit da nota é concluído.

### Portal Web (Next.js - `gestao_conecta`)
- **Visualização do Gestor**: A tipagem e as Server Actions (como `getChamadoDetails`) foram atualizadas no Next.js. O painel lateral na rota `/dashboard/chamado/[id]` exibe agora o feedback texturizado do cidadão.

---

## 3. Walkthrough (Log de Validação)

### Modificações e Comandos Executados:
- **Git**: Criada e mesclada a branch `feature/sprint-20-avaliacao-atendimento`.
- **Supabase**: As migrations de inclusão das colunas de CSAT foram executadas com sucesso.
- **Arquivos-chave modificados**:
  - `cidadao_conecta/lib/domain/entities/occurrence_entity.dart`
  - `cidadao_conecta/lib/data/repositories/occurrence_repository.dart`
  - `cidadao_conecta/lib/presentation/pages/detalhes_chamado_page.dart`
  - `cidadao_conecta/lib/presentation/widgets/rating_widget.dart`
  - `gestao_conecta/src/app/dashboard/chamado/[id]/page.tsx`
  - `gestao_conecta/src/lib/actions/getChamadoDetails.ts`

### Evidências e Testes
As verificações de UI e conectividade foram documentadas (`docs/tests_dibro_sprint_20.md`) e executadas:
- O formulário surge apenas em chamados com `status == 'COMPLETED'` e `rating == null`.
- O envio do formulário dispara a Server Action e sincroniza a coluna no banco.
- Após o envio, o formulário some do App dando lugar à visualização de "Somente Leitura".
- Os gestores conseguem observar o comentário e as estrelas no Backoffice Web simultaneamente.

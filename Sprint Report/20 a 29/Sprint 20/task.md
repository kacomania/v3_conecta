# Task List - Sprint 20: Avaliação de Atendimento (CSAT)

- [x] **Task 01: Inicialização e Git**
  - Crie a branch: `git checkout -b feature/sprint-20-avaliacao-atendimento`.

- [x] **Task 02: [BD] Colunas de Avaliação**
  - Use o MCP do Postgres para adicionar as colunas `rating` (SMALLINT) e `feedback_notes` (TEXT) à tabela `occurrences`.
  - Adicione uma constraint `CHECK (rating >= 1 AND rating <= 5)`.

- [x] **Task 03: [MOBILE] Repositório e Entidade**
  - No `cidadao_conecta/`, atualize a entidade `OccurrenceEntity` para suportar `rating` e `feedbackNotes`.
  - Implemente o método `rateOccurrence` no repositório fazendo o `UPDATE` no Supabase.

- [x] **Task 04: [MOBILE] UI de Avaliação (Flutter)**
  - Crie um componente `RatingWidget` (5 ícones de estrela interativos).
  - Na `DetalhesChamadoPage`, adicione a lógica: mostrar formulário se concluído e sem nota; mostrar nota estática se já avaliado.
  - Conecte o botão de envio à ViewModel, tratando loading e sucesso.

- [x] **Task 05: [WEB] Exibição no Painel Web**
  - No `gestao_conecta/`, atualize a tipagem e a Server Action `getChamadoDetails` para trazer as novas colunas.
  - Na página de detalhes do chamado, adicione um card "Avaliação do Cidadão" exibindo as estrelas e o comentário, se houver.

- [x] **Task 06: Validação Interna do Dibro (Testes)**
  - Leia o arquivo `docs/tests_dibro_sprint_20.md`.
  - Execute as verificações descritas e reporte o status no chat aguardando aprovação.

- [x] **Task 07: Encerramento da Sprint (OBRIGATÓRIO)**
  - Execute a skill `@commit` e `@gerando-relatorios-sprint.md` para a pasta `Sprint Report/Sprint 20/`.
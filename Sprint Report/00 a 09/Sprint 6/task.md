# Task List - Sprint 6: Histórico, Timeline & Edição de Localização

- [x] **Task 01: Inicialização e Git**
  - Crie e mude para a branch: `git checkout -b feature/sprint-6-historico-timeline`.

- [x] **Task 02: Infra e Banco de Dados (Supabase MCP)**
  - Execute SQL para criar a tabela `public.occurrence_timeline`.
  - Crie as políticas RLS de leitura pública para o cidadão.
  - Crie Trigger no Postgres que insere registro inicial na timeline.
  - Migration SQL: adicionar `original_latitude`, `original_longitude`, `location_edited_at` em `occurrences`.

- [x] **Task 03: Camada de Domínio**
  - Crie `OccurrenceTimelineEntity`.
  - Atualize `OccurrenceEntity` com os novos campos e a flag `locationAlreadyEdited`.
  - Adicione os métodos `getOccurrencesByUser`, `getTimelineForOccurrence` e `updateOccurrenceLocation` no contrato `OccurrenceRepository`.

- [x] **Task 04: Camada de Dados**
  - Implemente as consultas `getOccurrencesByUser` e `getTimelineForOccurrence` em `OccurrenceRepositoryImpl`.
  - Implemente `updateOccurrenceLocation` e mapeie os novos campos de localização.

- [x] **Task 05: Gerência de Estado (ViewModels)**
  - `meus_chamados_view_model.dart` criado e testado.
  - `detalhes_chamado_view_model.dart` com busca da timeline e provedor `updateLocationProvider`.

- [x] **Task 06: UI (Listagem, Timeline e Imagens)**
  - Construa a `MeusChamadosPage` com o `ChamadoCard`.
  - Construa a `DetalhesChamadoPage` com o `TimelineWidget`.
  - Construa o `ImageCarouselWidget` para visualização múltipla de imagens com PageView.

- [x] **Task 07: UI (Edição de Localização)**
  - Crie `location_picker_page.dart` com `flutter_map` para seleção interativa (leitura com zoom ou edição com arraste de pino).
  - Adicione botão de editar ou ver no mapa na `DetalhesChamadoPage`.
  - Exiba campo condicional de data com a formatação "Ajustada pelo Usuário em dd-mm-yyyy às hh:mm".

- [x] **Task 08: Roteamento (GoRouter)**
  - Adicione as rotas `/meus-chamados` e `/chamado/:id`.

- [x] **Task 09: Encerramento da Sprint**
  - Execute a skill `@commit`.
  - Execute a skill `@gerando-relatorios-sprint` para a pasta `Sprint Report/Sprint 6/`.
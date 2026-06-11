# Sprint 6: Histórico, Timeline & Ajuste de Localização - Relatório de Fechamento

## Resumo
A Sprint 6 focou em entregar transparência para o cidadão em relação às suas ocorrências. Foi implementada a funcionalidade "Meus Chamados", permitindo que o usuário visualize a listagem dos chamados abertos por ele, bem como uma tela de detalhes exibindo a linha do tempo (Timeline) com todas as movimentações e status do chamado.
Além disso, durante a validação da tela de Detalhes do Chamado, foram desenvolvidas funcionalidades complementares de grande valor:
- Visualização de imagens em um **Carrossel interativo** (PageView).
- Uma tela dedicada para **visualização de mapa interativo** (pan e zoom).
- A possibilidade de realizar a **edição única da localização**, mantendo a latitude e longitude originais para fins de auditoria, junto com a data do ajuste.

## Tarefas Concluídas
- **Infraestrutura e Supabase:**
  - Criação da tabela `public.occurrence_timeline` e Trigger no PostgreSQL para registrar a entrada inicial.
  - Modificação da tabela `occurrences` para adicionar os campos `original_latitude`, `original_longitude` e `location_edited_at`.
  - Implementação de políticas RLS permitindo aos cidadãos ler as movimentações (`is_public = true`).
- **Camada de Domínio:**
  - Criação da entidade `OccurrenceTimelineEntity`.
  - Atualização da entidade `OccurrenceEntity` com os novos campos e a propriedade computada `locationAlreadyEdited`.
  - Inclusão dos métodos `getOccurrencesByUser`, `getTimelineForOccurrence` e `updateOccurrenceLocation` no `OccurrenceRepository`.
- **Camada de Dados:**
  - Implementação completa dos métodos de consulta e atualização no `OccurrenceRepositoryImpl`.
- **Gerência de Estado:**
  - `MeusChamadosViewModel` para carregar a lista do usuário.
  - `DetalhesChamadoViewModel` para gerenciar a busca da timeline e a atualização de localização usando Riverpod (AsyncNotifierProvider).
- **Desenvolvimento da Interface (UI):**
  - Construção da `MeusChamadosPage` com o `ChamadoCard`.
  - Melhorias na `DetalhesChamadoPage` incluindo o `ImageCarouselWidget`, componente de timeline, e integração de botões condicionais de edição.
  - Construção da `LocationPickerPage` utilizando `flutter_map`, suportando tanto modo visualização interativo (zoom e pinça) quanto modo de edição.
- **Roteamento:**
  - Configuração de rotas no GoRouter (`/meus-chamados`, `/chamado/:id`).

## Status
Todas as telas e integrações de banco de dados foram implementadas conforme as especificações do Clean Architecture e utilizando Riverpod 3.x. O código está versionado usando "Conventional Commits" e os arquivos de planejamento da sprint foram atualizados.

Sprint 6 concluída com sucesso!

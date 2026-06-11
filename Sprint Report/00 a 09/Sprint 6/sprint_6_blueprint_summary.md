# Relatório de Implementações - Sprint 6

## 1. Histórico e Timeline (Acompanhamento Cidadão)
O objetivo principal inicial foi dar transparência ao andamento dos chamados.

*   **Banco de Dados (Supabase):**
    *   Criamos a tabela `public.occurrence_timeline` para registrar cada movimentação (status) do chamado.
    *   Implementamos políticas de segurança RLS para que o cidadão possa ler (`is_public = true`) as movimentações dos chamados de sua autoria.
    *   Adicionamos uma *Trigger* no PostgreSQL para registrar a etapa inicial automaticamente na timeline sempre que houver um `INSERT` na tabela `occurrences`.
*   **Domínio e Dados:**
    *   Criada a entidade `OccurrenceTimelineEntity`.
    *   Implementados os métodos `getOccurrencesByUser` e `getTimelineForOccurrence` na interface `OccurrenceRepository` e na sua implementação base (`OccurrenceRepositoryImpl`).
*   **Interface e Estado:**
    *   **Meus Chamados:** Criada a tela `MeusChamadosPage` e seu `MeusChamadosViewModel` (usando Riverpod) para exibir a lista dos chamados criados pelo usuário logado, construídos com o novo `ChamadoCard` contendo badges visuais de status.
    *   **Detalhes do Chamado:** Criada a `DetalhesChamadoPage` junto com o `TimelineWidget`, responsável por desenhar a evolução temporal do chamado de forma vertical e conectada.

## 2. Ajuste de Localização e Mapa Interativo
Uma melhoria de usabilidade e precisão incluída durante a sprint. A regra exigia que a edição de localização ocorresse apenas uma única vez, preservando a informação original para auditoria.

*   **Banco de Dados (Supabase):**
    *   Adicionamos os campos `original_latitude`, `original_longitude` e `location_edited_at` na tabela `occurrences`.
*   **Domínio e Dados:**
    *   Atualizada a `OccurrenceEntity` para gerenciar os novos campos, incluindo a propriedade computada `locationAlreadyEdited`.
    *   Criado o método `updateOccurrenceLocation` no `OccurrenceRepositoryImpl` para submeter a atualização das coordenadas no Supabase.
*   **Interface e Estado:**
    *   Desenvolvida a tela **`LocationPickerPage`** usando `flutter_map`. Ela atua em dois modos: visualização (somente leitura, porém permitindo interações como pan e zoom) e edição (onde o usuário arrasta o pino).
    *   Atualizada a tela de Detalhes para exibir o botão **"Editar"** condicionalmente.
    *   Implementado o badge textual **"Ajustada pelo Usuário em dd-mm-yyyy às hh:mm"** para demonstrar quando ocorreu a alteração.

## 3. Múltiplas Fotos (Carrossel de Imagens)
Refatoração total para permitir que o usuário envie e visualize mais de uma foto por ocorrência.

*   **Banco de Dados (Supabase):**
    *   Adicionamos a coluna `image_urls` (do tipo array de texto: `text[]`) à tabela `occurrences` para agrupar todas as mídias anexadas.
*   **Domínio e Dados:**
    *   Modificamos a `OccurrenceEntity` para receber `List<String> imageUrls`. Para retrocompatibilidade com chamados antigos, criamos um *fallback* que busca a propriedade legado `image_url` caso a lista venha vazia.
    *   No `OccurrenceRepositoryImpl`, substituímos o upload unitário por um laço de repetição (`for var i = 0; i < draft.fotos.length`), realizando upload de todas as mídias ao Storage e depois registrando o array de URLs no banco.
*   **Interface e Estado:**
    *   Desenvolvemos o novo **`ImageCarouselWidget`** utilizando um `PageView`. Ele inclui marcações indicadoras (bolinhas) estilizadas para guiar a rolagem entre as fotos.
    *   Substituímos o antigo componente de imagem unitária nas telas de *Detalhes do Chamado* pelo novo Carrossel, e garantimos que o *Card da Lista* exiba a primeira foto do array como capa.

---

**Nota Técnica:** Todas as dependências e o gerenciamento de estado seguem a *Clean Architecture* e *Riverpod 3.x*. O código da Sprint 6 foi commitado utilizando o padrão *Conventional Commits*.

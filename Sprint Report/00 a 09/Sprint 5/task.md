# Task List - Sprint 5: Submissão Backend

- [x] **Task 01: Inicialização e Git**
  - Crie e mude para a branch: `git checkout -b feature/sprint-5-submissao-backend`.

- [x] **Task 02: Configuração do Supabase Storage (Infra)**
  - Use o MCP do Postgres/Supabase para rodar as queries SQL necessárias para criar o bucket `occurrences_media`.
  - Configure o bucket como público (`public: true`).
  - Crie as políticas RLS: INSERT para usuários autenticados e SELECT para público.

- [x] **Task 03: Camada de Domínio (Occurrence)**
  - Crie `lib/domain/entities/occurrence_entity.dart`.
  - Crie `lib/domain/repositories/occurrence_repository.dart`.

- [x] **Task 04: Camada de Dados (Upload e Insert)**
  - Crie `lib/data/repositories/occurrence_repository_impl.dart`.
  - Implemente o método de criação: ele deve fazer o upload do arquivo da foto (se existir) para o bucket `occurrences_media`, pegar a URL pública e inserir o registro na tabela `public.occurrences`.

- [x] **Task 05: Injeção de Dependências**
  - Crie ou atualize o provider para injetar o `OccurrenceRepositoryImpl` na aplicação via Riverpod.

- [x] **Task 06: State Management (ViewModel)**
  - Atualize `NovoChamadoViewModel` para invocar o repositório.
  - Capture o `user_id` e o `prefeitura_id` via provider de Auth/Tenant para passar ao repositório.
  - Implemente tratamento de Loading, Sucesso e Erro (Try/Catch).

- [x] **Task 07: Atualização da UI e Navegação**
  - Na `NovoChamadoPage`, exiba um indicador de carregamento enquanto o estado do ViewModel estiver em loading.
  - Implemente um *listener* (ex: `ref.listen`) para detectar o sucesso da operação e usar o GoRouter para voltar à Home (`context.go('/')`) e exibir um SnackBar de sucesso.

- [x] **Task 08: Encerramento da Sprint**
  - Execute a skill `@commit`.
  - Execute a skill `@gerando-relatorios-sprint.md` para a pasta `Sprint Report/Sprint 5/`.
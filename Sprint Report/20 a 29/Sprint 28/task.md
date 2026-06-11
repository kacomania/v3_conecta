# Task List - Sprint 28: IA - Detecção de Duplicatas

- [x] **Task 01: Inicialização e Git**
  - Crie a branch: `git checkout -b feature/sprint-28-ia-duplicatas`.

- [x] **Task 02: [BD] pgvector e Schema**
  - Habilite a extensão `vector`. Adicione `embedding vector(768)` e `supporters_count DEFAULT 0` em `occurrences`.
  - Crie a tabela `occurrence_supporters`.
  - Crie a RPC `match_occurrences`. Implemente a fórmula de Haversine para filtrar raio <= 100 metros e similaridade >= 0.75.

- [x] **Task 03: [BACKEND] Edge Functions (Embeddings)**
  - Crie `supabase/functions/find-duplicates/index.ts`. A função deve chamar a API do Gemini para vetorizar o texto e invocar a RPC.

- [x] **Task 04: [MOBILE] Integração no Repositório**
  - No `OccurrenceRepositoryImpl`, adicione `findDuplicates(String description, double lat, double lng, String prefeituraId)`.
  - Adicione `supportOccurrence(String occurrenceId)` (que incrementa o contador e insere na tabela de apoios).

- [x] **Task 05: [MOBILE] Fluxo de UI (Loading e Match)**
  - No `NovoChamadoViewModel`, ao enviar, exiba o modal de loading estrito: "Analisando relato... Isso leva em média 30 segundos."
  - Se achar duplicatas, exiba o modal listando os protocolos para o usuário "Apoiar" ou "Recusar e abrir novo".

- [x] **Task 06: [MOBILE] Fluxo de UI (Sucesso e Copiar)**
  - Substitua a antiga tela de sucesso por um Pop-up (Dialog) exibindo o Protocolo final.
  - Adicione o botão "Copiar" (usando `Clipboard.setData`) e o botão "OK" que limpa o draft e volta para a rota `/`.

- [x] **Task 07: Validação Interna do Dibro (Testes)**
  - Leia o arquivo `docs/tests_dibro_sprint_28.md`.

- [ ] **Task 08: Encerramento da Sprint (OBRIGATÓRIO)**
  - Execute a skill `@commit` e `@gerando-relatorios-sprint.md`.
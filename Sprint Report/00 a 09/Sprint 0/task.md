# Tasks - Sprint 0: Fundação & DB

- [x] **Task 01:** Usar o Terminal MCP para criar a branch `feature/sprint-0-fundacao` (`git checkout -b feature/sprint-0-fundacao`).
- [x] **Task 02:** Usar o Terminal MCP para criar o projeto Flutter rodando `flutter create cidadao_conecta --empty`.
- [x] **Task 03:** Atualizar o arquivo `cidadao_conecta/pubspec.yaml` adicionando as dependências exatas definidas no plano (supabase_flutter, flutter_riverpod, go_router, flutter_dotenv, shared_preferences).
- [x] **Task 04:** Rodar `flutter pub get` dentro da pasta `cidadao_conecta/`.
- [x] **Task 05:** Criar a pasta `backend_database/` na raiz do projeto.
- [x] **Task 06:** Criar o arquivo `backend_database/01_schema.sql` contendo o DDL completo (Tabelas, Enums, Triggers, RLS Functions) especificado no Master Blueprint (Seção 7). *Atenção: Inclua a tabela `internal_notes` separada da auditoria, conforme decisão arquitetural.*
- [x] **Task 07:** Usar o **Supabase/PostgreSQL MCP** para ler e executar o conteúdo de `01_schema.sql` diretamente no banco de dados conectado.
- [x] **Task 08:** Criar o arquivo `.env.example` na pasta `cidadao_conecta/` com as chaves `SUPABASE_URL=` e `SUPABASE_ANON_KEY=`.
- [x] **Task 09 (Finalização):** Executar a skill `@commit` para realizar o commit das alterações com a mensagem `feat: inicializa projeto flutter e schema do supabase`.
- [x] **Task 10 (Encerramento):** Executar a skill `@gerando-relatorios-sprint` para gerar o relatório final da Sprint 0 e mover os arquivos para a pasta `Sprint Report/Sprint 0/`.
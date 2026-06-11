# Implementation Plan - Sprint 0: Fundação & DB

## 1. Visão Geral
Esta sprint inicializa o ecossistema "Cidadão Conecta v3". O objetivo é criar o projeto base em Flutter (como um subdiretório do monorepo) e aplicar o schema completo de banco de dados no Supabase, garantindo que as regras de RLS (Row Level Security) e triggers estejam ativas desde o dia zero.

## 2. Estratégia Git (Obrigatória)
- **Branch:** `feature/sprint-0-fundacao`
- **Encerramento:** Commits atômicos via skill `@commit` e arquivamento via `gerando-relatorios-sprint.md`.

## 3. Escopo Técnico
### A. Inicialização do Frontend (Flutter)
- Criar o projeto Flutter na pasta `cidadao_conecta/`.
- Limpar o `main.dart` padrão.
- Adicionar dependências canônicas no `pubspec.yaml` (pinadas conforme Blueprint):
  - `supabase_flutter: ^2.12.4`
  - `flutter_riverpod: ^3.3.1`
  - `go_router: ^17.2.3`
  - `flutter_dotenv: ^6.0.1`
  - `shared_preferences: ^2.5.5`

### B. Inicialização do Backend (Supabase)
- Criar a pasta `backend_database/` na raiz do projeto.
- Criar o arquivo `01_schema.sql` contendo a arquitetura de tabelas do Blueprint:
  - `prefeituras`, `departments`, `categories`.
  - `user_roles` (com trigger `on_auth_user_created`).
  - `occurrences` (com enum `occurrence_status`).
  - `occurrence_audit_logs` (com trigger de protocolo `ALT-YYYY-XXXXXX`).
  - `internal_notes`.
  - Funções `SECURITY DEFINER` para evitar recursão no RLS.
- Executar o script SQL no Supabase utilizando o PostgreSQL/Supabase MCP.
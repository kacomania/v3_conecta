# Task List - Sprint 16: Realtime, Exportação e Controle de Atendimento

- [x] **Task 01: Inicialização e Git**
  - Crie a branch: `git checkout -b feature/sprint-16-realtime-locking`.

- [x] **Task 02: [BD] Colunas de Locking e Realtime**
  - Use o MCP do Postgres para adicionar `locked_by` (UUID, FK auth.users) e `locked_at` (TIMESTAMPTZ) na tabela `occurrences`.
  - Habilite o *Replication* (Realtime) nas tabelas `occurrences` e `occurrence_timeline`.

- [x] **Task 03: [WEB] Server Actions de Atendimento**
  - No `gestao_conecta`, crie as actions `lockTicket(id)` e `unlockTicket(id)`. 
  - Regras: 1 chamado por usuário. O lock expira em 30 minutos (se expirar, outro pode roubar a trava, gerando log de "Encerrado por inatividade").
  - Ações devem gerar notas internas (`is_public = false`) na `occurrence_timeline`.

- [x] **Task 04: [WEB] UI da Triagem e Detalhes**
  - Atualize a tabela do Dashboard: mostre quem está atendendo (se houver).
  - Bloqueie a página de detalhes (`/dashboard/chamado/[id]`) se o chamado estiver travado por outro usuário (alerta de acesso negado).
  - Na tela de detalhes, adicione o botão "Pausar/Encerrar Atendimento" (que chama o `unlockTicket`).

- [x] **Task 05: [WEB] Realtime e Exportação CSV**
  - Inscreva o Dashboard no Supabase Realtime (Client Component) para ver os chamados sendo atualizados/travados ao vivo.
  - Adicione o botão de Exportar CSV na tabela de triagem.

- [x] **Task 06: [MOBILE] Integração do Stream (Flutter)**
  - No `cidadao_conecta`, mude o repositório da Timeline para retornar um `Stream`.
  - Atualize a tela de detalhes para consumir esse Stream via Riverpod, refletindo as atualizações ao vivo.

- [x] **Task 07: Validação Interna do Dibro (Testes)**
  - Leia o arquivo `docs/tests_dibro_sprint_16.md`.
  - Utilize o MCP de Banco de Dados ou crie scripts rápidos de teste para validar todas as regras contidas no arquivo (Lock único, Timeout de 30min, Realtime).
  - Apresente um resumo dos resultados da sua validação no chat e aguarde a permissão do Piloto para prosseguir.

- [x] **Task 08: Finalização da Sprint (Commit e Relatório)**
  - Execute o workflow `/fechar-sprint`.
  - Arquive o `implementation_plan.md` em `docs/sprints/Sprint 16/`.
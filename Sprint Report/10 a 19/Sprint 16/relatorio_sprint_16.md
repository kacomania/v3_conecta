# Relatorio Unificado de Encerramento - Sprint 16

## 1. Resumo Executivo
# 🏁 Relatório de Encerramento - Sprint 16 (Realtime & Pessimistic Locking)

Este relatório documenta a conclusão das tarefas, os desvios do plano inicial que se mostraram necessários para a correta implementação e validação, bem como os resultados dos testes executados durante a Sprint 16.

## 1. Visão Geral das Implementações

O objetivo principal desta sprint foi introduzir o **Pessimistic Locking** (Controle de Atendimento de Chamados) e **Atualizações em Tempo Real (Realtime)** utilizando o Supabase, para que múltiplos atendentes não cruzassem informações e as atualizações refletissem em todas as telas conectadas, incluindo o aplicativo Flutter do cidadão (`cidadao_conecta`).

### Entregas:
- **Banco de Dados:** Colunas `locked_by` (UUID) e `locked_at` (TIMESTAMPTZ) inseridas em `occurrences`. Tabela adicionada à `publication` de realtime.
- **Server Actions (Web):** Lógicas de validação em `lockTicket` e `unlockTicket`, definindo validade de trava de 30 minutos e registro de auditoria via `occurrence_timeline`.
- **Interface Web (`gestao_conecta`):** Adição de componentes como `LockControl` para assumir o ticket, exibição do status travado/livre na tabela e Exportação CSV em conformidade com acentuação e padrão de quebra (Excel PT-BR). Bloqueio visual para tickets de terceiros.
- **Interface Mobile (`cidadao_conecta`):** Adaptação do `detalhes_chamado_view_model` e `OccurrenceRepository` para consumir dados reativos (via streams).

---

## 2. Decisões Arquiteturais e Modificações Não Previstas

Ao decorrer das execuções, o QA testou as entregas baseadas no planejamento inicial, o que desencadeou em três ações/decisões corretivas **que não constavam no escopo original (`implementation_plan.md`)**:

1. **Bug do Usuário City Admin Não Ver Chamados:**
   - **O que aconteceu:** Durante os testes, o usuário com função `CITY_ADMIN` não enxergava nenhum chamado em andamento.
   - **Solução Implementada:** O plano não previa atualizações cadastrais. Contudo, identifiquei via RLS que a coluna `prefeitura_id` da tabela `user_roles` estava `null` para esse usuário. Executei um SQL Update direto no banco, definindo a Prefeitura de Teste (ID `50aed58...`) para ele, reativando suas permissões imediatas de leitura nos chamados associados à prefeitura.

2. **Refatoração do Realtime (Subqueries no RLS do Supabase):**
   - **O que aconteceu:** O `StreamProvider` implementado no Flutter não estava sendo acionado automaticamente para atualizações vindas da tabela `occurrence_timeline` (o QA precisou dar Refresh).
   - **Solução Implementada:** Foi detectada uma limitação nativa do `wal2json` no Postgres/Supabase Realtime, que falha silenciosamente caso as regras de RLS da tabela contenham *subqueries/joins* (como ocorre no `select_occurrence_timeline`). A solução foi criar o `occurrenceUpdatesProvider` e escutar o evento da tabela raiz `occurrences` (cujo RLS não possui subqueries para o Cidadão) para invalidar o cache da timeline e do status geral simultaneamente.

3. **Restrições de Filtros Múltiplos na Stream Supabase-Flutter:**
   - **O que aconteceu:** Erros de sintaxe da tipagem `SupabaseStreamBuilder`.
   - **Solução Implementada:** O `.stream()` no Flutter não suporta duas cláusulas `.eq()` encadeadas de forma nativa. O filtro secundário de visibilidade (`is_public == true`) foi deslocado da Query para um filtro em memória no client-side usando `.where()`.

4. **Experiência do Atendente no Dashboard:**
   - **Modificação (Fix Caso 02):** Adicionado um "Banner de Retorno Rápido" fixo no topo da tabela `DashboardTable`. Ele identifica imediatamente se o atendente possui uma trava ativa (menos de 30 minutos) e disponibiliza um atalho direto para o chamado em andamento.
   - **Modificação (Fix Caso 05):** O exportador de CSV do Dashboard foi reconfigurado de `,` para `;` e adicionado o prefixo BOM UTF-8 (`\uFEFF`) para suprir falhas de leitura em Microsoft Excel localizados em português.

---

## 3. Relatório de Qualidade e Testes Realizados

A bateria de testes foi elaborada e executada integralmente em duas etapas (Validação Dibro e QA Manual). Todos os testes finalizaram com status de **SUCESSO** após as correções da etapa de QA.

### Testes do Dibro (Validação Interna):
- ✅ **Schema Check:** As colunas `locked_by` e `locked_at` foram checadas contra o banco ativo.
- ✅ **Constraint Check:** Timeout de 30 minutos verificado. O roubo de trava injeta a observação de encerramento automático sem falhas de foreign keys.
- ✅ **Memory Leaks:** `removeChannel` validado no retorno do `useEffect` dos Client Components em React.

### Testes de QA Manual:
- ✅ **Caso 01 (Lock Simples):** Atendente conseguiu travar.
- ✅ **Caso 02 (Retorno):** Banner informativo implementado e testado.
- ✅ **Caso 03 (Timeout):** Destrava correta aos 30 minutos.
- ✅ **Caso 04 (Realtime Flutter):** App mobile recebe as alterações assim que um update atinge a base no servidor sem a necessidade do "pull to refresh".
- ✅ **Caso 05 (Exportação CSV):** Dados baixados tabulados em colunas corretas e acentuação perfeitamente renderizada.

---

### Fechamento
A Sprint 16 pode ser dada como **concluída** e arquivada, com código testado e commitado (`feat(sprint-16): implement pessimistic locking and realtime updates for occurrences`). As regras da Clean Architecture foram respeitadas e as responsabilidades foram separadas no Backend Actions do Next.js e nos Data Repositories do Flutter.


## 2. Blueprint (Arquitetura)
# Blueprint da Sprint 16: Realtime & Pessimistic Locking

## Decisões Arquiteturais e Modelagem de Dados

### 1. Mecanismo de "Pessimistic Locking" Baseado em Tempo
- O sistema de travas de chamados não impede o ticket de ser visualizado, mas desabilita a edição e bloqueia o roteamento para a URL de detalhes caso o atendente não seja o dono da trava.
- Foi adotada a **Regra do Timeout Passivo (30 minutos)**. Não há um "cronjob" rodando no servidor para destravar tickets. A destrava é feita sob demanda na própria Server Action `lockTicket`: se o timestamp atual for maior que `locked_at + 30 min`, o sistema permite que o novo usuário "roube" a trava, disparando no mesmo instante um log automático na `occurrence_timeline` informando que o atendimento anterior caiu por inatividade.

### 2. O Desafio de RLS vs Supabase Realtime (Web Sockets)
- Durante a integração do Realtime no Flutter (`cidadao_conecta`), o provedor principal que monitorava a tabela `occurrence_timeline` não disparava os eventos do servidor.
- **Motivo Técnico:** O Postgres, através da extensão `wal2json` do Supabase Realtime, descarta os eventos silenciosamente caso as Row Level Securities (RLS) da tabela demandem *Subqueries* (exemplo: validar o ID da prefeitura do chamado original do evento da timeline).
- **Decisão Arquitetural:** Em vez de comprometer o RLS abrindo brechas de segurança na timeline, o Flutter foi instruído a manter um `StreamProvider` que escuta ativamente o canal de replicação da tabela-mãe (`occurrences`), que possui um RLS mais simples de igualdade direta (`user_id = auth.uid()`). Sempre que um evento ocorre na tabela-mãe, o Provider detecta e aciona uma invalidação simultânea das listas de timeline e status principal em cache no Riverpod.

### 3. Filtros no SDK Supabase Flutter
- O método `.stream()` do `supabase_flutter` suporta nativamente apenas uma cláusula `.eq()`, retornando um construtor unificado que não permite múltiplos `WHERE`.
- Em consultas que exigem duplo filtro de restrição (ex: `occurrence_id` E `is_public`), a restrição principal de ID é inserida no Web Socket, enquanto a restrição secundária é aplicada em memória no *client-side* usando o `.where()` do Dart. Isso reduz o payload da rede ao máximo enquanto atende as limitações de design da SDK.

### 4. Geração de CSV (Exportação Client-Side)
- O processamento de relatórios em CSV foi mantido 100% no cliente do React (`DashboardTable`), tirando o peso da geração de relatórios do servidor.
- Para manter compatibilidade com o Excel na região PT-BR, abandonamos o padrão tradicional (separador `,`) em favor do ponto e vírgula (`;`).
- O JavaScript insere um preâmbulo na Blob com o código **BOM (Byte Order Mark) UTF-8** (`\uFEFF`) para forçar o Microsoft Excel a ler caracteres acentuados corretamente (como a string "Título"). Sem o BOM, o Excel leria a string interpretando codificação ANSI.


## 3. Walkthrough (Log de Validacao)
*(Sem walkthrough registrado no ambiente para esta sprint)*


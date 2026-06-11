# Implementation Plan - Sprint 16: Realtime, Exportação e Controle de Atendimento

## 🎯 Objetivo
Habilitar a reatividade em tempo real (Supabase Realtime) no ecossistema e implementar o **Controle de Colisão de Chamados (Pessimistic Locking)** no Portal Web. Garantir que apenas um atendente atue em um chamado por vez, gerando logs de auditoria automáticos na timeline.

## 🏗️ Decisões Arquiteturais

### 1. Banco de Dados (Supabase)
- **Realtime:** Ativar *Replication* nas tabelas `occurrences` e `occurrence_timeline`.
- **Locking:** Adicionar colunas `locked_by` (FK auth.users) e `locked_at` (TIMESTAMPTZ) na tabela `occurrences`.

### 2. Controle de Atendimento (Next.js)
- **Listagem (Dashboard):** Chamados bloqueados exibem um ícone de "Cadeado" e o nome de quem está atendendo. Botão muda de "Ver Detalhes" para "Assumir Chamado" se estiver livre.
- **Server Actions:** 
  - `lockTicket(id)`: Verifica se o chamado está livre ou se o lock atual expirou (> 30 min). Se sim, assume o chamado e insere Nota Interna na timeline ("Atendimento iniciado").
  - `unlockTicket(id)`: Libera o chamado e insere Nota Interna ("Atendimento pausado/encerrado").
- **Regra de 1 por vez:** Ao chamar `lockTicket`, o sistema verifica se o usuário já possui outro chamado bloqueado e o impede de assumir um novo.

### 3. Realtime e Exportação (Next.js & Flutter)
- **Web:** Assinar o canal `occurrences` para atualizar a tabela (e os cadeados) ao vivo. Função de exportar a lista para `.csv`.
- **Mobile:** Usar `StreamProvider` para a linha do tempo, refletindo as atualizações ao vivo no app do cidadão.

## 🔀 Estratégia de Git
- Branch: `feature/sprint-16-realtime-locking`.
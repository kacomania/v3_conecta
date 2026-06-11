# Implementation Plan - Sprint 19: Gestão de SLA e Prazos

## 🎯 Objetivo
Implementar o controle de Acordo de Nível de Serviço (SLA) para as ocorrências. Isso permitirá que a prefeitura monitore chamados atrasados e que o cidadão saiba a previsão exata de resolução do seu problema.

## 🏗️ Decisões Arquiteturais

### 1. Banco de Dados (Supabase)
- **Tabela `categories`:** Adicionar coluna `sla_hours` (INT, DEFAULT 72).
- **Tabela `occurrences`:** Adicionar coluna `due_date` (TIMESTAMPTZ).
- **Automação (Trigger):** Criar uma trigger `BEFORE INSERT` na tabela `occurrences`. A trigger deve ler o `sla_hours` da categoria selecionada e definir o `due_date` (`NOW() + interval '1 hour' * sla_hours`).

### 2. Portal Web (Next.js - `gestao_conecta`)
- **Gestão de Categorias:** Atualizar o formulário em `/dashboard/categorias` para permitir que o gestor defina o tempo de SLA (em horas) ao criar/editar uma categoria.
- **Triagem (Dashboard):** Adicionar a coluna "Prazo / SLA" na tabela de chamados. Criar um utilitário visual que classifique:
  - 🟢 **No Prazo:** Faltam mais de 24h.
  - 🟡 **Vencendo:** Faltam menos de 24h.
  - 🔴 **Atrasado:** `due_date` é menor que `NOW()`.

### 3. App Mobile (Flutter - `cidadao_conecta`)
- **Domain/Data:** Atualizar o `RequestModel` (ou `OccurrenceEntity`) para realizar o parse da nova coluna `due_date`.
- **UI:** Na `DetalhesChamadoPage`, adicionar um card ou aviso informando a "Previsão de Resolução" (formatando o `due_date` para `dd/MM/yyyy`). Se o chamado for marcado como Concluído, esse card pode ser ocultado ou mostrar "Concluído no Prazo/Atrasado".

## 🔀 Estratégia de Git
- Branch: `feature/sprint-19-gestao-sla`.
- Fechamento padrão com `@commit` e `@gerando-relatorios-sprint.md`.
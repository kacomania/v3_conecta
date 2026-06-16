---
name: sddd-gerando-relatorios
description: Lê logs de commits, tarefas concluídas e descrições de PRs para gerar relatórios executivos e técnicos de encerramento de Sprint. Disparado quando o usuário solicita o fechamento de uma sprint ou geração de relatório SDDD.
---
# SDDD Report (Gerando Relatórios)

Lê logs de commits, tarefas concluídas e descrições de PRs para gerar relatórios executivos e técnicos de encerramento de Sprint.

## Diretrizes de Conteúdo

* O relatório deve sempre conter 3 seções: 
  1. Resumo Executivo
  2. Blueprint (Decisões Arquiteturais)
  3. Walkthrough (Log de Validação)
* Focar em explicar as mudanças que afetam o Master Blueprint (ex: novas tabelas, novos fluxos).

## Checklist de Workflow

Copie o checklist abaixo para acompanhar a geração do relatório:

- [ ] Coletar informações das tarefas concluídas e logs da Sprint atual.
- [ ] Identificar mudanças arquiteturais (Banco de Dados, Flutter, Next.js).
- [ ] Redigir o Resumo Executivo com foco em valor de negócio.
- [ ] Redigir a seção Blueprint explicando o "Por Quê" das decisões técnicas.
- [ ] Redigir o Walkthrough com os arquivos modificados e testes realizados.
- [ ] Validar se o Markdown está limpo e formatado corretamente.

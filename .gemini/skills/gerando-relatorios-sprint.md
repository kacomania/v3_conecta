---
name: gerando-relatorios-sprint
description: Gerencia, arquiva e documenta os processos de desenvolvimento do Conecta, copiando os artefatos ativos (Implementation Plan, Tasks) e gerando um Relatório Unificado (Executivo, Arquitetural e Operacional) ao fim de cada Sprint na pasta 'Sprint Report/Sprint x/'. Use sempre que iniciar ou concluir uma Sprint.
---

# Gerador e Arquivador de Relatórios de Sprint (SDDD.Report)

Esta skill é responsável por garantir a integridade histórica, rastreabilidade e governança das entregas de engenharia do ecossistema Conecta. Ela automatiza o arquivamento dos planos de implementação e checklists de tarefas, além de gerar um único relatório consolidado de encerramento para cada Sprint concluída.

---

## 🏃♂️ Quando Usar Esta Skill
* **No Início de uma Sprint:** Para estruturar a nova pasta e arquivar o planejamento aprovado.
* **Durante a Sprint:** Para atualizar o andamento das tarefas (`task.md`).
* **Ao Concluir uma Sprint:** Para registrar os resultados consolidados em um documento único.

---

## 📋 Fluxo de Trabalho (Workflow)

Copie e siga este checklist a cada execução:

- [ ] **Definir o Escopo da Sprint:** Identificar o número da Sprint ativa (**x**).
- [ ] **Criar a Pasta da Sprint:** Garantir a existência do diretório físico em `Sprint Report/Sprint x/`.
- [ ] **Arquivar os Artefatos Iniciais:** Copiar os arquivos ativos (`implementation_plan.md` e `task.md`) da pasta da conversa/trabalho para a pasta criada.
- [ ] **Escrever o Relatório Unificado da Sprint:** Gerar um único arquivo chamado `relatorio_sprint_x.md` na pasta correspondente. Este arquivo deve absorver todas as informações e ser dividido em três seções principais:
      1. **Resumo Executivo:** O que foi entregue e valor para o negócio.
      2. **Blueprint (Arquitetura):** Decisões técnicas, estrutura de pastas, uso de Clean Architecture, Riverpod, Supabase, etc.
      3. **Walkthrough (Log de Validação):** Os exatos arquivos modificados, comandos rodados, testes executados e evidências.
- [ ] **Validar os Caminhos:** Certificar-se de que os links markdown criados usam a convenção de caminhos absolutos e barras normais `/`.

---

## 📂 Estrutura de Diretórios e Arquivos

Cada Sprint deve possuir a seguinte organização na raiz do workspace:
```text
Sprint Report/
  Sprint x/
    relatorio_sprint_x.md           (Documento único: Executivo + Blueprint + Walkthrough)
    implementation_plan.md          (Cópia do plano aprovado)
    task.md                         (Cópia do checklist final com as tarefas em [x])
```

📝 **Template do Relatório Unificado (`relatorio_sprint_x.md`)**
Ao gerar o relatório, lembre-se de consolidar as visões gerencial, de arquitetura de software e os logs técnicos (walkthrough) num fluxo de leitura contínuo e bem formatado utilizando os dados obtidos durante a Sprint.

⚠️ **Tratamento de Erros e Casos Especiais**
Caminhos com Barras: Nunca utilize barras invertidas \ para links markdown na documentação. Sempre formate utilizando barras normais / e codificando espaços vazios como %20.
Versionamento de Cópias: Ao copiar arquivos, se o arquivo já existir no destino, não o sobrescreva. Em vez disso, salve-o com um novo nome adicionando um sufixo alfabético sequencial (ex: se relatorio_sprint_17.md existir, salve como relatorio_sprint_17A.md. Se este também existir, salve como relatorio_sprint_17B.md, e assim por diante).

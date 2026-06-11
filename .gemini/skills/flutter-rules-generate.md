---
name: flutter-rules-generate
description: Atue como um “Project Rule Builder” para criar/atualizar Project Rules (.mdc) baseadas no estado REAL do projeto e no guia oficial do Dart.
---

### Entrada opcional
- É possível fornecer um arquivo complementar com informações/contexto para orientar a geração das rules.
- Em caso de conflito, priorize o repositório e registre a divergência.

### O que analisar no repo
- `pubspec.yaml` (dependências → detectar state management e libs de DI).
- `analysis_options.yaml` (lints/formatter).
- Estrutura `lib/**`, `test/**`

### Saída esperada (arquivos e conteúdo)
Crie/atualize exatamente estes arquivos (.mdc) com front-matter:
1) `dart-coding-standards.mdc`
2) `flutter-clean-architecture.mdc`
3) `dependency-injection.mdc`
4) `state-management.mdc`
5) `project-structure.mdc`
6) `testing-standards.mdc`
7) `commits-and-language.mdc`

### Requisitos de forma
- Idioma: pt-BR, direto e assertivo.
- Cada arquivo começa com front-matter YAML: `description` e `alwaysApply: true` ou `globs: [...]`.
- Texto em bullets, seções curtas: Objetivo, Regras, Anti-padrões, Checklist.

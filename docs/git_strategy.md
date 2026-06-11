# Estratégia de Versionamento (Git) - Cidadão Conecta v3

## 1. Branching Model (Feature Branching por Sprint)
- **Branch `main`:** Protegida. Fonte da verdade. Sempre compilável.
- **Branches de Trabalho:** Criadas a partir da `main` no início de cada Sprint.
- **Nomenclatura:** `feature/sprint-[numero]-[nome-curto]` (ex: `feature/sprint-0-fundacao`).

## 2. Commits (Conventional Commits)
- Todos os commits devem seguir a convenção (feat, fix, refactor, chore, docs).
- O idioma das mensagens de commit deve ser o **Português do Brasil (pt-BR)**.
- Os commits devem ser atômicos (um commit por tarefa lógica concluída do `task.md`).

## 3. Workflow de Fim de Sprint
- Apenas fazer o merge para a `main` APÓS a geração do `relatorio_sprint_X.md`.
- Deletar a branch local após o merge.

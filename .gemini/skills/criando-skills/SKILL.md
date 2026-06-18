---
name: criando-skills
description: Cria e estrutura novas skills (habilidades) especialistas para o Antigravity Agent em .agents/skills/[nome-da-skill]/ seguindo os padrões estruturais de pastas, convenções do YAML frontmatter com nome no gerúndio e descrição em 3ª pessoa, princípios do Claude de concisão e divulgação progressiva, e loops de feedback (checklists, validações e tratamento de erros). Use quando o usuário solicitar a criação ou geração de uma nova skill.
metadata:
  model: models/gemini-3.1-pro-preview
  last_modified: Mon, 18 May 2026 20:55:00 GMT
---
# Criador de Skills (Antigravity)

Esta skill permite a criação de novas "Skills" (Habilidades) estruturadas e consistentes para o ecossistema de agentes IA.

## Quando usar esta skill
- Quando o usuário solicitar a criação de uma nova skill ou habilidade personalizada.
- Para automatizar e padronizar o processo de extensão das capacidades do agente IA.

## Fluxo de Trabalho (Workflow)

Copie este checklist para acompanhar o progresso de criação de uma nova skill:

- [ ] Validar e ajustar o nome da skill (deve ser em gerúndio, minúsculo, com hifens, máx. 64 caracteres).
- [ ] Definir a descrição da skill em 3ª pessoa, incluindo explicitamente as palavras-chave e gatilhos de ativação.
- [ ] Criar a estrutura física do diretório em `.agents/skills/[nome-da-skill]/`.
- [ ] Criar o arquivo principal `SKILL.md`.
- [ ] Criar os diretórios opcionais se necessários (`scripts/`, `examples/`, `resources/`).
- [ ] Validar se as regras de escrita "The Claude Way" (concisão, caminhos com `/`, divulgação progressiva) foram respeitadas.
- [ ] Inserir os loops de validação e feedback (checklists de progresso, tratamento de erros) no corpo do `SKILL.md`.

## Instruções de Geração

### 1. Hierarquia da Skill
Crie os seguintes diretórios e arquivos:
*   `.agents/skills/[nome-da-skill]/SKILL.md` (Obrigatório)
*   `.agents/skills/[nome-da-skill]/scripts/` (Opcional - para scripts utilitários)
*   `.agents/skills/[nome-da-skill]/examples/` (Opcional - para códigos de referência)
*   `.agents/skills/[nome-da-skill]/resources/` (Opcional - para templates ou assets estáticos)

### 2. Formato do YAML Frontmatter (SKILL.md)
O cabeçalho do arquivo deve possuir rigorosamente a seguinte estrutura:
```yaml
---
name: [nome-no-gerundio]
description: [descrição clara e objetiva em 3ª pessoa com gatilhos específicos]
---
```

### 3. Padrões de Conteúdo e Concisão
*   **Concisão:** Focar estritamente na lógica prática da habilidade. Assumir que o agente executor possui alta inteligência básica.
*   **Divulgação Progressiva:** Limitar o `SKILL.md` a menos de 500 linhas. Caso necessário, linkar outros arquivos no mesmo diretório (ex: `[Detalhes em AVANCADO.md](AVANCADO.md)`).
*   **Barras de Caminho:** Utilizar sempre barras normais `/` nos caminhos de arquivos.
*   **Níveis de Liberdade:**
    *   *Alta Liberdade:* Usar listas com marcadores (*bullet points*) para heurísticas de alto nível.
    *   *Média Liberdade:* Usar blocos de código com trechos/templates gerais.
    *   *Baixa Liberdade:* Comandos bash precisos e específicos para tarefas sensíveis.

## Recursos
- Templates de referência podem ser adicionados no subdiretório `resources/`.

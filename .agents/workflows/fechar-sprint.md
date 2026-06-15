---
description: Faz o commit e gera os relatórios de encerramento.
---

Dibro, o código foi testado e aprovado. Siga estas etapas para concluir a sprint:

1. **Atualização do Master Blueprint:** Analise todas as mudanças de arquitetura, banco de dados ou de negócio feitas nesta sprint. Se houve alteração relevante, atualize obrigatoriamente o documento `docs/conecta_v3_master_blueprint.md` para garantir que ele permaneça como a Single Source of Truth do projeto.
2. **Verificação de Segurança (Pre-commit):** Revise os arquivos que serão enviados. Verifique proativamente se existem informações sensíveis (API Keys, chaves de serviço, configurações de Firebase como google-services.json, arquivos .env, etc.). Se encontrar algum arquivo sensível, certifique-se de adicioná-lo ao `.gitignore` e removê-lo do controle de versão do git antes de realizar o commit.
3. **Commit:** Conclua as tarefas finais do task.md e execute a skill @commit com uma mensagem no padrão Conventional Commits.
4. **Relatórios:** Em seguida, execute a skill @gerando-relatorios-sprint para gerar o relatório final e mover os arquivos de planejamento para a pasta correta em 'Sprint Report'.
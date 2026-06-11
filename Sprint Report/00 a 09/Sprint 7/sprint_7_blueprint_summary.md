# Sprint 7 - Resumo para o Blueprint

Esta sprint resultou em modificações diretas no **Master Blueprint** (v1.0), visando corrigir contradições e reforçar as regras arquiteturais originais. As principais atualizações foram:

## 1. Definição Tecnológica do Portal Web
A Seção 2 (*Platform Segmentation*) foi atualizada para cravar a tecnologia do portal web administrativo:
- **Gestão Conecta (Web Portal):** Definido para ser construído em **Next.js (React)**.
- O portal web será um repositório isolado, não compartilhando código-fonte com o `cidadao_conecta` (Flutter).

## 2. Limpeza da Estrutura Mobile
O App Mobile (*Cidadão Conecta*) é de uso **exclusivo** do cidadão. As seguintes correções foram feitas no blueprint para refletir isso:
- **Folder Layout (Seção 4):** A pasta `admin/` foi banida da árvore de diretórios do `cidadao_conecta`.
- **Route Map (Seção 8.2):** As rotas `/admin/requests` e `/admin/request-details` foram removidas.
- **RequestDetailsScreen:** Foi redefinida como uma tela de visualização exclusiva (apenas leitura), sem controles de modo "admin" para atualização de status.
- **Admin Module (Seção 12.7):** Foi reescrito para especificar que todas as funcionalidades de gestão (Dashboard, Triage, Roles) ocorrem apenas no portal web Next.js.

## 3. Segurança (RLS e Supabase)
A política RLS para a tabela `occurrences` agora aplica:
- `USER` lê `user_id = auth.uid()`
- Servidores leem `prefeitura_id = get_current_user_prefeitura_id()`

> **Nota para Desenvolvedores:** Nenhuma funcionalidade de servidor da prefeitura (visualizar lista de todos os chamados, alterar status, adicionar nota interna) deve ser implementada no Flutter. Caso o usuário logado no app mobile seja um Servidor (`role != USER`), ele poderá usar o app normalmente com o "chapéu" de cidadão.

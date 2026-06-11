# Roteiro de Testes Manuais (QA) - Web Portal

Este documento descreve os passos para validação manual dos fluxos desenvolvidos até a Sprint 10.

## 1. Login de Servidor vs Cidadão (Bloqueio)

**Objetivo:** Garantir que apenas usuários com a role `SERVIDOR` ou `ADMIN` consigam acessar o portal web.

1. Acesse a URL do portal web localmente (ex: `http://localhost:3000`).
2. Tente fazer login usando credenciais de um usuário cujo `role` no Supabase (tabela `profiles`) seja `CIDADÃO`.
3. **Resultado Esperado:** O acesso deve ser negado com uma mensagem clara de erro informando que o acesso é restrito a servidores.
4. Faça login com credenciais de um usuário com role `SERVIDOR`.
5. **Resultado Esperado:** O login deve ser bem-sucedido e redirecionar para a página `/dashboard`.

## 2. Aplicação de Filtros no Dashboard

**Objetivo:** Validar a funcionalidade de busca e filtragem por status na triagem de chamados.

1. Na página de Dashboard (`/dashboard`), verifique a listagem inicial de todos os chamados.
2. No campo de busca **"Buscar por título"**, digite uma palavra que exista em um dos chamados (ex: "buraco") e pressione `Enter` ou clique no botão **"Filtrar"**.
3. **Resultado Esperado:** A URL deve ser atualizada (ex: `?q=buraco`) e a tabela deve exibir apenas os chamados contendo a palavra pesquisada no título (case-insensitive).
4. No campo **"Status"**, selecione a opção **"Pendente"**.
5. **Resultado Esperado:** A URL deve ser atualizada (ex: `?q=buraco&status=PENDING`) e a tabela deve filtrar os chamados para corresponder à busca de texto E ao status selecionado.
6. Clique no botão **"Limpar"**.
7. **Resultado Esperado:** A URL deve ser limpa (remover os parâmetros `q` e `status`), e a listagem original completa deve ser restaurada.

## 3. Atualização de Status e Adição de Notas

**Objetivo:** Validar a interação na tela de detalhes do chamado.

1. No Dashboard, clique em **"Ver Detalhes →"** em qualquer chamado.
2. Na página de detalhes (`/dashboard/chamado/[id]`), vá para o painel de **"Atualizar Status"**.
3. Mude o status (ex: de "Pendente" para "Em Andamento").
4. **Resultado Esperado:** O sistema deve salvar o novo status (mensagem de sucesso, se aplicável) e a UI deve refletir a mudança imediatamente.
5. Vá para o painel de **"Adicionar Nota (Histórico)"** ou equivalente.
6. Insira uma nova nota (ex: "Equipe técnica foi despachada.") e envie.
7. **Resultado Esperado:** A nota deve ser salva e aparecer na linha do tempo (timeline) do chamado. Opcionalmente, pode ser visível para o cidadão dependendo das regras de negócio implementadas.

## 4. Verificação no App Mobile (Cidadão)

**Objetivo:** Garantir a integração e sincronização de ponta a ponta.

1. Abra o aplicativo Mobile (Cidadão).
2. Faça login com a conta do cidadão que criou o chamado alterado no passo 3.
3. Navegue até a seção **"Meus Chamados"**.
4. Abra os detalhes do chamado em questão.
5. **Resultado Esperado:** 
   - O status do chamado deve estar refletindo a alteração feita no painel web (ex: "Em Andamento").
   - A linha do tempo/histórico deve exibir a movimentação de status.
   - (Se aplicável) A nota adicionada no painel web deve estar visível no histórico do chamado para o cidadão.

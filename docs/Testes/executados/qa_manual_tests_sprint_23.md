# 🧪 Plano de Testes Manuais (QA) - Sprint 23

**Módulo:** Gestão Conecta (Web Portal)
**Objetivo:** Validar a exibição correta das métricas de satisfação (CSAT) e a navegabilidade do feed de comentários.

## ⚙️ Pré-requisitos
1. Portal Web rodando localmente.
2. Estar logado com uma conta de gestor (MANAGER ou CITY_ADMIN).
3. O banco de dados já deve possuir pelo menos **1 chamado concluído com avaliação** (se não tiver, abra o App Mobile, crie um chamado, conclua-o no portal e avalie com 5 estrelas e um comentário de teste).

---

## 🟢 Caso 01: Acesso e Exibição de KPIs
**Objetivo:** Garantir que o painel calcula a nota média corretamente.

- [ ] **Passo 1:** No Portal Web, verifique a Sidebar e clique no novo menu **"Satisfação"** (ou Avaliações).
- [ ] **Passo 2:** Observe o topo da página.
- [ ] **Resultado Esperado A:** A página deve carregar sem erros. Devem existir Cards exibindo a Nota Média (ex: 4.5 / 5.0) e o Total de Avaliações Recebidas. Os números devem refletir as avaliações reais do banco de dados.

## 🟢 Caso 02: Feed de Comentários e Roteamento
**Objetivo:** Garantir que o gestor pode ler um elogio/reclamação e ir direto para a fonte.

- [ ] **Passo 1:** Role a página até a seção de "Últimos Comentários" (ou Feed de Feedbacks).
- [ ] **Resultado Esperado A:** A lista deve exibir o texto do comentário que você gerou nos pré-requisitos, junto com as estrelas (ex: ⭐⭐⭐⭐⭐) e a data.
- [ ] **Passo 2:** Clique no botão ou link "Ver Chamado" atrelado a esse comentário.
- [ ] **Resultado Esperado B:** Você deve ser redirecionado automaticamente para a rota `/dashboard/chamado/[id]` correspondente.
- [ ] **Passo 3:** Na tela de detalhes do chamado, verifique o painel lateral de "Avaliação do Cidadão".
- [ ] **Resultado Esperado C:** As informações do painel lateral devem ser exatamente as mesmas exibidas no Dashboard de Satisfação.

## 🟢 Caso 03: Resiliência contra Divisão por Zero
**Objetivo:** Garantir que o painel não quebra se for uma prefeitura recém-cadastrada.

- [ ] **Passo 1:** No banco de dados (via Supabase Studio), altere todas as colunas `rating` de todos os chamados para `NULL`.
- [ ] **Passo 2:** Volte ao painel de Satisfação no Portal Web e atualize a página.
- [ ] **Resultado Esperado:** A página não pode apresentar a tela vermelha de erro (Crash). Os cards devem mostrar "0.0" ou "Sem avaliações", e a lista de comentários deve exibir um estado vazio amigável ("Nenhum comentário recebido ainda").

---

### 📝 Observações do QA
*(Anote aqui se o layout quebrou ao receber um comentário muito longo ou se faltou paginação/scroll).*
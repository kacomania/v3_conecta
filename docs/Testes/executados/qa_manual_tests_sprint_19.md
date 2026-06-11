# 🧪 Plano de Testes Manuais (QA) - Sprint 19

**Módulo:** Gestão Conecta (Web) & Cidadão Conecta (Mobile)
**Objetivo:** Validar o fluxo de SLAs, desde a configuração na categoria até a visualização do prazo de atendimento.

## ⚙️ Pré-requisitos
1. Portal Web rodando localmente (logado com usuário `CITY_ADMIN`).
2. Emulador Flutter rodando (App Cidadão Conecta).

---

## 🟢 Caso 01: Configuração do SLA na Categoria
**Objetivo:** Garantir que gestores possam definir prazos diferentes por tipo de problema.

- [ ] **Passo 1:** No Portal Web, acesse "Categorias" no painel administrativo.
- [ ] **Passo 2:** Crie uma nova categoria chamada "Lâmpada Queimada (Teste)".
- [ ] **Passo 3:** No campo de SLA, defina **24 horas**. Salve.
- [ ] **Passo 4:** Crie outra categoria chamada "Buraco na Via (Teste)".
- [ ] **Passo 5:** No campo de SLA, defina **120 horas** (5 dias). Salve.
- [ ] **Resultado Esperado:** Ambas as categorias devem ser salvas com sucesso na listagem, exibindo a carga horária do SLA.

## 🟢 Caso 02: Abertura de Chamado e Previsão
**Objetivo:** Garantir que o App e o Banco calculem a previsão correta.

- [ ] **Passo 1:** Abra o app Flutter logado como Cidadão.
- [ ] **Passo 2:** Abra um novo chamado e escolha a categoria "Lâmpada Queimada (Teste)". Envie o chamado.
- [ ] **Passo 3:** Vá em "Meus Chamados" e abra os detalhes desse novo chamado.
- [ ] **Resultado Esperado:** A tela deve exibir a informação "Previsão de Atendimento: [Data do dia seguinte]". (Ou seja, Data Atual + 24 horas).

## 🟢 Caso 03: Alertas Visuais no Dashboard de Triagem
**Objetivo:** Garantir que a fila de atendimento avisa os servidores sobre os prazos.

- [ ] **Passo 1:** No Portal Web, acesse o "Dashboard" (Triagem).
- [ ] **Passo 2:** Localize o chamado criado no Caso 02.
- [ ] **Resultado Esperado A:** A coluna/tag de SLA deve aparecer indicando "No Prazo" (provavelmente verde).
- [ ] **Passo 3:** (Teste Avançado) Acesse o banco de dados (Table Editor no Supabase). Mude o `due_date` do chamado para a **data de ontem** (vencido).
- [ ] **Passo 4:** Volte ao Dashboard Web e atualize a página.
- [ ] **Resultado Esperado B:** A coluna de SLA desse chamado deve mudar visualmente para **Atrasado** (vermelho).
- [ ] **Passo 5:** Como Atendente, inicie o atendimento desse chamado atrasado e altere o Status para **Concluído**.
- [ ] **Resultado Esperado C:** Ao retornar para a lista, o badge de SLA não deve mais gritar "Atrasado" em vermelho, pois o chamado já foi encerrado (deve assumir um estado neutro ou "Concluído Fora do Prazo").

---

### 📝 Observações do QA
*(Verifique se os fusos horários (Timezones) não estão gerando conflitos nas datas mostradas no App vs Web).*
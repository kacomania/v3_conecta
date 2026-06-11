# 🧪 Plano de Testes Manuais (QA) - Sprint 17

**Módulo:** Cidadão Conecta (Mobile) & Gestão Conecta (Web)
**Objetivo:** Validar o recebimento de notificações no aplicativo do Cidadão em tempo real.

## ⚙️ Pré-requisitos
1. Portal Web rodando localmente (aba anônima com usuário Atendente).
2. Emulador Flutter rodando (usuário Cidadão). O Cidadão deve ter um chamado aberto ("Pendente" ou "Em Andamento").

---

## 🟢 Caso 01: Badge e Notificação em Tempo Real
**Objetivo:** Garantir que a ação do servidor no Web Portal aciona o sino no app mobile.

- [ ] **Passo 1:** No app Flutter, fique na tela Inicial (`HomePage`). Observe o ícone de Sino (não deve ter *badge* ou deve mostrar apenas as antigas).
- [ ] **Passo 2:** No Portal Web, como Atendente, abra o chamado correspondente a esse Cidadão.
- [ ] **Passo 3:** Adicione uma **Nota Pública** ("Sua solicitação foi analisada.").
- [ ] **Resultado Esperado A:** No app Flutter, **sem tocar na tela**, o ícone de Sino deve ganhar uma bolinha vermelha com o número "1" (ou incrementar o número existente).

## 🟢 Caso 02: Visualização e Leitura
**Objetivo:** Garantir que a lista renderiza corretamente e marca como lida.

- [ ] **Passo 1:** No app Flutter, clique no ícone de Sino.
- [ ] **Resultado Esperado A:** A tela de Notificações se abre. A nova notificação ("Sua solicitação foi analisada.") deve estar no topo, com destaque visual (ex: negrito ou fundo colorido) indicando que não foi lida.
- [ ] **Passo 2:** Toque no card da notificação.
- [ ] **Resultado Esperado B:** Duas coisas devem acontecer:
  1. O aplicativo navega imediatamente para a tela de Detalhes do Chamado correspondente.
  2. Nos bastidores, a notificação foi marcada como lida.
- [ ] **Passo 3:** Volte para a tela inicial do app (`HomePage`).
- [ ] **Resultado Esperado C:** O contador vermelho do Sino deve ter diminuído (ou desaparecido, se era a única não lida).

## 🟢 Caso 03: Silêncio em Notas Internas
**Objetivo:** Garantir que notas sigilosas da prefeitura não geram notificações.

- [ ] **Passo 1:** No Portal Web, adicione uma nova atualização marcando o toggle como **"Nota Interna"**.
- [ ] **Passo 2:** Olhe para o app Flutter do Cidadão.
- [ ] **Resultado Esperado:** Nenhuma notificação deve chegar. O contador do Sino deve permanecer inalterado.

---

### 📝 Observações do QA
*(Anote aqui eventuais demoras na chegada da notificação ou problemas no layout da lista).*
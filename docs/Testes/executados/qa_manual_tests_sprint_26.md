# 🧪 Plano de Testes Manuais (QA) - Sprint 26

**Módulo:** Gestão Conecta (Web) & Cidadão Conecta (Mobile)
**Objetivo:** Validar o envio de comunicados em massa e a renderização do mural no app.

## ⚙️ Pré-requisitos
1. Portal Web rodando localmente (logado como Gestor/Admin).
2. Emulador/Celular com o App Flutter rodando (logado como Cidadão, com permissão de notificação ativa). **Deixe o app em segundo plano (minimizado) para o teste de Push.**

---

## 🟢 Caso 01: Disparo de Alerta de Emergência (Web)
**Objetivo:** Garantir que o gestor consegue enviar um comunicado com nível de severidade.

- [ ] **Passo 1:** No Portal Web, vá até a nova aba **"Comunicados"** (ou Avisos).
- [ ] **Passo 2:** Preencha o Título: "ALERTA DE CHUVAS FORTES".
- [ ] **Passo 3:** Preencha a Mensagem: "A Defesa Civil alerta para risco de alagamentos na região central."
- [ ] **Passo 4:** No seletor de Severidade, escolha **EMERGENCY** (Emergência/Vermelho).
- [ ] **Passo 5:** Clique em "Enviar Comunicado".
- [ ] **Resultado Esperado:** O formulário deve salvar com sucesso, e o comunicado deve aparecer imediatamente na tabela de histórico abaixo do formulário.

## 🟢 Caso 02: Recebimento do Broadcast (Push Nativo)
**Objetivo:** Validar se o cidadão recebe o alerta na tela do celular.

- [ ] **Passo 1:** Aguarde de 3 a 10 segundos observando o emulador/celular.
- [ ] **Resultado Esperado:** Uma notificação Push nativa deve aparecer no aparelho com o título "ALERTA DE CHUVAS FORTES".
- [ ] **Passo 2:** Clique na notificação nativa.
- [ ] **Resultado Esperado B:** O aplicativo deve se abrir.

## 🟢 Caso 03: Mural de Avisos (Mobile)
**Objetivo:** Garantir que o cidadão pode consultar o histórico de alertas da cidade.

- [ ] **Passo 1:** No aplicativo Flutter, navegue até a nova aba **"Avisos"** (ou Mural de Comunicados).
- [ ] **Resultado Esperado A:** A tela deve listar o comunicado "ALERTA DE CHUVAS FORTES".
- [ ] **Resultado Esperado B:** Como a severidade escolhida foi EMERGENCY, o card deve ter um destaque visual forte (ex: Borda vermelha, ícone de alerta vermelho ou fundo avermelhado), diferenciando-se de um aviso comum de "Informativo".

## 🟠 Caso 04: Separação por Prefeitura (Multi-Tenant)
**Objetivo:** Garantir que o cidadão de uma cidade não receba aviso de outra.

- [ ] **Passo 1:** No App Flutter, vá no Perfil e troque para uma Prefeitura DIFERENTE da que o gestor da Web está logado.
- [ ] **Passo 2:** No Portal Web, o gestor envia um novo aviso: "Festa da Cidade".
- [ ] **Resultado Esperado:** O celular do cidadão **NÃO** deve receber notificação. Ao abrir a aba "Avisos" no app, o aviso da "Festa da Cidade" **NÃO** deve estar na lista.

---

### 📝 Observações do QA
*(Anote aqui se o layout do card quebrou com textos muito longos ou se o Push demorou excessivamente para chegar).*
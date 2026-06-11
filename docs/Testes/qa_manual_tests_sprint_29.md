# 🧪 Plano de Testes Manuais (QA) - Sprint 29

**Módulo:** Cidadão Conecta (Mobile) & Gestão Conecta (Web)
**Objetivo:** Validar o envio de chamados em "Modo Avião" e a sincronização automática.

## ⚙️ Pré-requisitos
1. Emulador Flutter rodando (App Cidadão Conecta logado).
2. Portal Web rodando localmente (logado como Atendente).

---

## 🟢 Caso 01: Criação de Chamado Offline
**Objetivo:** Garantir que o app permite o registro sem internet.

- [ ] **Passo 1:** No Emulador (ou aparelho físico), **ative o MODO AVIÃO** (ou desligue o Wi-Fi e Dados Móveis).
- [ ] **Passo 2:** No aplicativo Flutter, abra um Novo Chamado.
- [ ] **Passo 3:** Tire uma foto da câmera e digite a descrição: *"Poste apagado (Teste Offline)"*.
- [ ] **Passo 4:** Clique em Enviar.
- [ ] **Resultado Esperado A:** A tela de carregamento da IA **não deve** travar. O app deve pular essa etapa imediatamente.
- [ ] **Resultado Esperado B:** O pop-up de sucesso deve exibir uma mensagem específica: *"Chamado salvo no dispositivo. Será enviado automaticamente quando houver internet."* (Não deve exibir número de protocolo).

## 🟢 Caso 02: Visualização na Fila (Meus Chamados)
**Objetivo:** Garantir que o cidadão saiba que o chamado está pendente de envio.

- [ ] **Passo 1:** Com o Modo Avião ainda ligado, vá na aba **"Meus Chamados"**.
- [ ] **Resultado Esperado A:** O chamado "Poste apagado (Teste Offline)" deve aparecer no topo da lista.
- [ ] **Resultado Esperado B:** Ele deve ter um indicativo visual claro (ex: ícone de Nuvem cortada, ou Tag "Aguardando Sincronização" em cinza).
- [ ] **Passo 2:** Vá para o Portal Web (Next.js) no seu computador e atualize a tabela de triagem.
- [ ] **Resultado Esperado C:** O chamado **NÃO PODE** estar no sistema da prefeitura ainda.

## 🟢 Caso 03: Sincronização Automática (A "Magia")
**Objetivo:** Validar se o *SyncService* detecta a internet e envia o pacote.

- [ ] **Passo 1:** Mantenha o aplicativo Flutter aberto na tela "Meus Chamados".
- [ ] **Passo 2:** **Desligue o MODO AVIÃO** (restabeleça a conexão do emulador).
- [ ] **Passo 3:** Aguarde alguns segundos (não precisa tocar na tela).
- [ ] **Resultado Esperado A:** A tela do aplicativo deve atualizar sozinha. O chamado deve perder a tag "Aguardando Sincronização" e ganhar o status "Em Análise" (Pendente), ganhando também um número de Protocolo oficial.
- [ ] **Passo 4:** Vá para o Portal Web (Next.js) e atualize a triagem.
- [ ] **Resultado Esperado B:** O chamado "Poste apagado (Teste Offline)" deve estar lá na fila da Prefeitura, contendo a foto perfeitamente anexada e a coordenada de GPS salva.

---

### 📝 Observações do QA
*(Anote aqui se o app apresentou lentidão ao cruzar as listas locais e online ou se o upload da foto falhou durante a reconexão).*
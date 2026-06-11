# 🧪 Plano de Testes Manuais (QA) - Sprint 25

**Módulo:** Cidadão Conecta (Mobile) & Backend (Supabase)
**Objetivo:** Validar o registro do Token do dispositivo e o recebimento de uma Push Notification real.

## ⚙️ Pré-requisitos
1. Projeto Flutter configurado com um projeto válido no Firebase (arquivo `google-services.json` no Android ou `GoogleService-Info.plist` no iOS). *Nota: Se você ainda não configurou o projeto no Firebase Console, faça isso antes do teste.*
2. Emulador Android (ou dispositivo físico) rodando o App Cidadão Conecta.
3. Portal Web rodando localmente (logado como Atendente).

---

## 🟢 Caso 01: Solicitação de Permissão e Sincronização do Token
**Objetivo:** Garantir que o app pede permissão e salva o ID do celular no banco.

- [ ] **Passo 1:** No emulador, faça login com a conta do Cidadão (ou deslogue e logue novamente).
- [ ] **Passo 2:** O aplicativo deve exibir o prompt nativo do Sistema Operacional perguntando: *"Cidadão Conecta deseja enviar notificações para você"*.
- [ ] **Passo 3:** Clique em **Permitir**.
- [ ] **Passo 4:** Acesse o Supabase Studio (banco de dados), abra a tabela `user_devices`.
- [ ] **Resultado Esperado:** Deve existir uma linha vinculada ao `user_id` do cidadão logado, contendo um texto longo na coluna `fcm_token` e a plataforma (ex: "android").

## 🟢 Caso 02: Disparo de Push Notification (End-to-End)
**Objetivo:** Garantir que a nota pública gera um Push no celular.

- [ ] **Passo 1:** No Emulador, **FECHE O APLICATIVO** ou deixe-o em segundo plano (minimizado na tela inicial do celular). *Push notifications do Firebase se comportam de forma diferente com o app aberto vs fechado.*
- [ ] **Passo 2:** No Portal Web (Next.js), como Atendente, vá na tela de detalhes de um chamado pertencente a este Cidadão.
- [ ] **Passo 3:** Adicione uma Nota Pública (ex: "Sua solicitação foi concluída com sucesso!").
- [ ] **Resultado Esperado A:** Após alguns segundos, o emulador/celular deve vibrar/tocar e exibir uma notificação nativa na barra superior (Lock Screen) com o título do app e a mensagem da notificação.
- [ ] **Passo 4:** Clique na notificação nativa no celular.
- [ ] **Resultado Esperado B:** O aplicativo deve abrir e (idealmente, se o roteamento deep-link estiver configurado) levar o usuário direto para a tela de notificações ou detalhes do chamado.

---

### 📝 Observações do QA
*(Anote aqui se a notificação demorou para chegar, se não tocou som ou se houve problemas ao gerar o token no Firebase).*
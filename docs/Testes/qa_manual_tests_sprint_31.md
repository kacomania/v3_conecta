# 🧪 Plano de Testes Manuais (QA) - Sprint 31 (Jornada Épica Final)

**Módulo:** Ecossistema Completo (Mobile + Web + API Pública + Background)
**Objetivo:** Validar a Jornada do Usuário Ponta-a-Ponta, cruzando todas as features avançadas (IA, Push, Realtime, CSAT, Webhooks e Locking M2M).

## ⚙️ Pré-requisitos
1. Celular/Emulador logado como Cidadão.
2. Portal Web rodando logado como Atendente/Gestor.
3. Site `webhook.site` aberto no navegador.
4. Postman, Insomnia ou Terminal (cURL) aberto.

---

## 🟢 Fase 1: Abertura, IA e Outbound (Webhook)

- [ ] **Passo 1 (Cidadão - Abertura):** No Flutter, abra um chamado para "Lâmpada Queimada". Digite o texto: *"O poste da minha rua está apagado há 3 dias."*. Tire uma foto e envie.
- [ ] **Passo 2 (IA - Vector Search):** Observe se o app analisa o relato em busca de duplicatas. Se não houver match, ele deve gerar o protocolo com sucesso. Copie o UUID/Protocolo gerado.
- [ ] **Passo 3 (M2M Outbound - Webhook):** Verifique imediatamente a aba do `webhook.site`. O payload completo do novo chamado deve ter chegado via Edge Function.

## 🟢 Fase 2: Atendimento, Locking e Comunicação

- [ ] **Passo 4 (Servidor - Locking):** No Portal Web, localize o chamado na Triagem. Clique em "Iniciar Atendimento". Verifique se a tela abriu e se o seu usuário assumiu o *Lock* (Cadeado para outros usuários).
- [ ] **Passo 5 (Servidor - Evidência e Push):** Mude o status do chamado para "Em Andamento". Na linha do tempo, anexe uma foto qualquer e adicione uma **Nota Pública**: *"Equipe a caminho do local"*.
- [ ] **Passo 6 (Push Notification):** O celular do Cidadão deve receber uma notificação Push (Firebase) e o ícone de Sino no app deve ganhar um *Badge* vermelho.

## 🟢 Fase 3: Integração Legada (Inbound API M2M)
*Simulando que o caminhão da prefeitura fechou o chamado no sistema antigo deles (ERP).*

- [ ] **Passo 7 (Geração de Chave):** No Portal Web, vá no menu "Desenvolvedores". Crie uma nova API Key (ex: "Chave do ERP"). **Copie a chave gerada**.
- [ ] **Passo 8 (Zero-Trust Security):** Vá para o Postman. Crie uma requisição `PATCH` para a API local (ex: `http://localhost:3000/api/v1/occurrences/[UUID_DO_CHAMADO]`). No Body (JSON), coloque: `{ "status": "COMPLETED" }`. **NÃO coloque o Header de autenticação.**
- [ ] **Resultado Esperado A:** A API deve retornar Status HTTP `401 Unauthorized` ou `403 Forbidden`.
- [ ] **Passo 9 (Sucesso M2M):** Adicione o Header de autenticação (ex: `x-api-key: [CHAVE_COPIADA]`). Envie a requisição novamente.
- [ ] **Resultado Esperado B:** A API deve retornar `200 OK`. 

## 🟢 Fase 4: Encerramento, CSAT e Transparência

- [ ] **Passo 10 (Reflexo Realtime):** Olhe para a tela do Portal Web e para o App do Cidadão. Ambos devem ter atualizado o status do chamado para "Concluído" automaticamente, mesmo a ordem tendo vindo da API externa do Postman.
- [ ] **Passo 11 (Cidadão - CSAT):** No App do cidadão, o formulário de Avaliação deve aparecer. Dê **5 estrelas** e escreva: *"Excelente integração e rapidez!"*. Envie.
- [ ] **Passo 12 (IA - Sentimento):** Aguarde alguns segundos. No Portal Web, verifique a rota `/dashboard/satisfacao`. O comentário deve aparecer classificado como **POSITIVO** (😊) pela IA do Gemini.
- [ ] **Passo 13 (Transparência Pública):** Acesse a rota pública do Portal de Transparência (aba anônima). Verifique se o KPI de chamados resolvidos subiu e se o novo chamado aparece como um "Pin" anonimizado no mapa.

---

### 📝 Observações do QA
*(Se você chegou até aqui sem quebrar nada, o sistema passou no mais rigoroso teste de estresse possível! 🥂)*
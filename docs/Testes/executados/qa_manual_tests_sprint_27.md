# 🧪 Plano de Testes Manuais (QA) - Sprint 27

**Módulo:** Cidadão Conecta (Mobile) & Gestão Conecta (Web)
**Objetivo:** Validar se a Inteligência Artificial classifica os textos corretamente e se o dashboard Web exibe os gráficos de sentimento.

## ⚙️ Pré-requisitos
1. Portal Web rodando localmente (logado como Gestor/Admin).
2. Emulador Flutter rodando (App Cidadão Conecta).
3. **MUITO IMPORTANTE:** Você precisa criar uma chave de API do Google Gemini (gratuita no Google AI Studio) e adicioná-la aos Secrets do Supabase (`supabase secrets set GEMINI_API_KEY=sua_chave`).
4. Ter 3 chamados de teste no status `Concluído` prontos para serem avaliados pelo Cidadão.

---

## 🟢 Caso 01: Feedback Positivo (Classificação da IA)
**Objetivo:** Garantir que a IA entende um elogio.

- [ ] **Passo 1:** No app Flutter, abra o primeiro chamado concluído e avalie com 5 estrelas.
- [ ] **Passo 2:** No comentário, escreva: *"O serviço foi excelente, a equipe tapou o buraco super rápido e deixou a rua limpa. Parabéns prefeitura!"*. Clique em Enviar.
- [ ] **Passo 3:** Abra o Portal Web, vá no menu **"Satisfação"**.
- [ ] **Resultado Esperado:** No Feed de Comentários, esse feedback deve aparecer com um ícone/badge de **POSITIVO** (ex: Emoji Feliz 😊 ou badge Verde).

## 🟢 Caso 02: Feedback Negativo (Classificação da IA)
**Objetivo:** Garantir que a IA entende uma crítica.

- [ ] **Passo 1:** No app Flutter, abra o segundo chamado concluído e avalie com 1 ou 2 estrelas.
- [ ] **Passo 2:** No comentário, escreva: *"Uma vergonha! Demoraram meses para vir aqui e o asfalto já está cedendo de novo."*. Clique em Enviar.
- [ ] **Passo 3:** Atualize o Portal Web na página de Satisfação.
- [ ] **Resultado Esperado:** O comentário deve aparecer no feed com um ícone/badge de **NEGATIVO** (ex: Emoji Irritado 😡 ou badge Vermelho).

## 🟢 Caso 03: Feedback Neutro / Sem Texto (Tratamento de Erros)
**Objetivo:** Garantir que o sistema não quebra se o cidadão não digitar nada.

- [ ] **Passo 1:** No app Flutter, abra o terceiro chamado concluído. Dê 3 estrelas e **deixe o campo de comentário vazio**. Clique em Enviar.
- [ ] **Passo 2:** Atualize o Portal Web na página de Satisfação.
- [ ] **Resultado Esperado A:** O comentário deve aparecer no feed classificado como **NEUTRO** (ex: Emoji Neutro 😐 ou badge Cinza).
- [ ] **Resultado Esperado B:** Observe o novo "Gráfico de Humor da População" (Donut/Pie Chart) na página. Ele deve estar renderizando corretamente as fatias de Positivo, Neutro e Negativo com base nos testes que você acabou de fazer.

---

### 📝 Observações do QA
*(Anote aqui se o gráfico de rosca falhou na renderização ou se a invocação da Edge Function causou lentidão excessiva no aplicativo móvel na hora de enviar a nota).*
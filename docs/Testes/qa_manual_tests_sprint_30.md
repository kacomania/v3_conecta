# 🧪 Plano de Testes Manuais (QA) - Sprint 30

**Módulo:** Gestão Conecta (Web) & Cidadão Conecta (Mobile)
**Objetivo:** Validar a configuração do Webhook e o disparo de eventos em tempo real para sistemas externos.

## ⚙️ Pré-requisitos
1. Acesse o site **[webhook.site](https://webhook.site/)** no seu navegador. Ele gerará uma "URL Única" temporária (ex: `https://webhook.site/abc-123`). Deixe essa aba aberta.
2. Portal Web rodando localmente (logado com usuário `CITY_ADMIN` ou `SYSTEM_ADMIN`).
3. Emulador Flutter rodando (logado como Cidadão).

---

## 🟢 Caso 01: Configuração do Webhook no Portal Web
**Objetivo:** Garantir que o gestor pode cadastrar o servidor legado da prefeitura.

- [ ] **Passo 1:** No Portal Web, verifique a Sidebar e clique no novo menu **"Integrações"** ou **"Desenvolvedores"**. *(Se o menu não aparecer, verifique se o seu usuário tem access_level 4 ou 5)*.
- [ ] **Passo 2:** Na seção de Webhooks, cole a URL única gerada no site `webhook.site`.
- [ ] **Passo 3:** Crie uma senha/secret (ex: `minha_senha_secreta`) e clique em Salvar.
- [ ] **Resultado Esperado:** O sistema deve confirmar o salvamento e exibir a URL cadastrada com o status "Ativo".

## 🟢 Caso 02: Disparo de Evento Externo (End-to-End)
**Objetivo:** Comprovar que o Supabase envia o chamado para o ERP da prefeitura.

- [ ] **Passo 1:** No aplicativo Flutter, abra um **Novo Chamado** (ex: "Semáforo quebrado na praça principal").
- [ ] **Passo 2:** Clique em Enviar e aguarde o protocolo ser gerado.
- [ ] **Passo 3:** Vá rapidamente para a aba do seu navegador onde o site **webhook.site** está aberto.
- [ ] **Resultado Esperado A:** Você deve ver um novo request HTTP do tipo `POST` recebido instantaneamente na tela do `webhook.site`.
- [ ] **Resultado Esperado B:** No corpo da requisição (Raw Content / JSON), devem constar os dados do chamado recém-criado (Título, Descrição, Latitude, Longitude, etc.).
- [ ] **Resultado Esperado C:** Verifique os Headers do request no site. Deve haver um Header de autorização (ex: `x-conecta-signature` ou `Authorization`) contendo a senha `minha_senha_secreta` que você configurou no Caso 01.

## 🟢 Caso 03: Isolamento Multi-Tenant
**Objetivo:** Garantir que a prefeitura não receba chamados de outra cidade.

- [ ] **Passo 1:** No App Flutter, vá em Meu Perfil e mude para uma **Prefeitura Diferente** da qual você configurou a URL.
- [ ] **Passo 2:** Abra um novo chamado.
- [ ] **Passo 3:** Observe o site `webhook.site`.
- [ ] **Resultado Esperado:** Nenhum novo request deve chegar. O webhook só dispara para ocorrências vinculadas à prefeitura dona da URL configurada.

---

### 📝 Observações do QA
*(Anote aqui se o payload JSON recebido no webhook.site faltou alguma informação importante como o ID da Categoria ou URL da Imagem).*
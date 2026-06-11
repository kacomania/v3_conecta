# 🧪 Plano de Testes Manuais - Sprint 15 (Gestão Territorial e Evidências)

**Módulo:** Gestão Conecta (Portal Web) & Cidadão Conecta (App Mobile)  
**Objetivo:** Validar o upload de imagens na Timeline e a renderização do Mapa Interativo.

## ⚙️ Pré-requisitos (Setup do Ambiente)
1. O servidor Web (`gestao_conecta`) deve estar rodando localmente (`npm run dev`).
2. O App Mobile (`cidadao_conecta`) deve estar rodando em um emulador ou dispositivo físico.
3. Ter acesso a **duas contas**:
   - Conta de Servidor (ex: role `ATTENDANT` ou `CITY_ADMIN`).
   - Conta de Cidadão (role `USER`).
4. O Cidadão já deve ter aberto pelo menos **2 chamados de teste** pelo app mobile (com a permissão de GPS ativada, para que eles tenham `latitude` e `longitude` gravados no banco).

---

## 🟢 Caso de Teste 01: Upload de Evidência (Portal Web)
**Objetivo:** Garantir que o servidor consegue anexar uma foto de comprovação do serviço na linha do tempo.

- [ ] **Passo 1:** Acesse o Portal Web (`http://localhost:3000`) e faça login com a **Conta de Servidor**.
- [ ] **Passo 2:** No Dashboard de Triagem, clique em "Ver Detalhes" em qualquer chamado com status *Pendente* ou *Em Andamento*.
- [ ] **Passo 3:** Role a tela até a seção "Adicionar Atualização" (Formulário da Timeline).
- [ ] **Passo 4:** Escreva um texto descritivo (ex: "Buraco tapado pela equipe técnica").
- [ ] **Passo 5:** Clique no novo botão de anexo (input de arquivo) e selecione uma imagem válida (JPG ou PNG, máx 5MB).
- [ ] **Passo 6:** Marque o toggle de visibilidade como **"Nota Pública"**.
- [ ] **Passo 7:** Clique em "Adicionar Atualização".
- [ ] **Resultado Esperado:** O botão deve mostrar estado de "Loading...". Após 1 a 3 segundos, a página deve atualizar automaticamente (sem refresh do navegador). A nova nota deve aparecer na Linha do Tempo abaixo, exibindo a foto renderizada corretamente.

---

## 🟢 Caso de Teste 02: Sincronização e Visualização no App (Mobile)
**Objetivo:** Garantir que o cidadão recebe a foto como evidência no seu celular.

- [ ] **Passo 1:** Abra o aplicativo **Cidadão Conecta** no emulador e faça login com a **Conta do Cidadão** dono do chamado testado no Caso 01.
- [ ] **Passo 2:** Na Home, clique no atalho "Meus Chamados".
- [ ] **Passo 3:** Toque no chamado correspondente.
- [ ] **Passo 4:** Role a tela de detalhes até a seção "Linha do Tempo".
- [ ] **Resultado Esperado:** A nota adicionada pelo servidor deve estar visível, mostrando o texto ("Buraco tapado...") e a **foto da evidência**. A imagem deve ser carregada sem erros (verificar se a URL pública do Supabase Storage está acessível).

---

## 🟢 Caso de Teste 03: Evidência Interna (Sigilo)
**Objetivo:** Garantir que uploads marcados como "Nota Interna" não vazem para o cidadão.

- [ ] **Passo 1:** No Portal Web, no mesmo chamado, adicione uma nova nota com texto "Foto do documento interno" e anexe uma imagem diferente.
- [ ] **Passo 2:** **Desmarque** o toggle (deixe como "Nota Interna").
- [ ] **Passo 3:** Salve. Confirme que a nota aparece na timeline da Web com a cor/badge de uso interno.
- [ ] **Passo 4:** No App Mobile (Cidadão), atualize a tela do chamado (volte e entre de novo).
- [ ] **Resultado Esperado:** A nota interna e a foto do documento **NÃO** podem aparecer para o Cidadão.

---

## 🟢 Caso de Teste 04: Gestão Territorial (Renderização Segura do Mapa)
**Objetivo:** Validar a integração do Leaflet com o Next.js, garantindo que não ocorram erros de *Server-Side Rendering* (SSR) e que os dados geográficos sejam plotados corretamente.

- [ ] **Passo 1:** No Portal Web, clique no item **"Mapa"** (ou Gestão Territorial) na Sidebar lateral.
- [ ] **Passo 2:** Observe o carregamento da página.
- [ ] **Resultado Esperado 1 (Anti-Crash):** A página **não** pode apresentar a tela vermelha de erro do Next.js ("Window is not defined" ou "Hydration failed"). O mapa deve carregar suavemente.
- [ ] **Passo 3:** Verifique os "Pins" (marcadores) no mapa.
- [ ] **Resultado Esperado 2:** Devem existir marcações geográficas correspondentes aos chamados abertos na sua Prefeitura.
- [ ] **Passo 4:** Clique em um dos *Pins*.
- [ ] **Resultado Esperado 3:** Um popup/tooltip deve abrir exibindo informações resumidas do chamado (ex: Título e Status atual).

---

## 🟠 Caso de Teste 05: Resiliência de Erros (Edge Cases)
**Objetivo:** Testar como o sistema reage a usos indevidos.

- [ ] **Teste A (Sem Foto):** No Portal Web, envie uma nota na timeline sem anexar nenhuma foto. **Resultado:** A nota deve ser salva apenas com texto, sem quebrar o layout.
- [ ] **Teste B (Arquivo Inválido):** No Portal Web, tente anexar um arquivo `.pdf` ou um vídeo `.mp4` no formulário da timeline. **Resultado:** O sistema deve bloquear o envio (via atributo `accept="image/*"` no HTML ou validação na Server Action) e exibir um aviso.
- [ ] **Teste C (Chamado sem GPS):** Crie um chamado manual no banco de dados (ou force via app) onde `latitude` e `longitude` sejam `null`. Acesse a tela do Mapa no Web Portal. **Resultado:** O mapa não pode quebrar. O chamado simplesmente não deve ser renderizado no mapa, mas os outros continuam normais.

---

### 📝 Observações do QA
*(Espaço para o testador anotar bugs encontrados, lentidões de carregamento de imagem ou falhas de UX nas mensagens de sucesso).*
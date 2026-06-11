# 🧪 Plano de Testes Manuais (QA) - Sprint 24

**Módulo:** Gestão Conecta (Web Portal - Público)
**Objetivo:** Validar o acesso anônimo ao portal de transparência e a correta anonimização dos dados no mapa.

## ⚙️ Pré-requisitos
1. Portal Web rodando localmente (`npm run dev`).
2. Obter o ID (UUID) de uma Prefeitura de teste no banco de dados (ex: acessando o Supabase Studio ou copiando da URL do painel logado).
3. Ter um navegador em modo **Anônimo / Incógnito** (garantindo que não há cookies de sessão do Supabase).

---

## 🟢 Caso 01: Acesso Deslogado (Navegação Anônima)
**Objetivo:** Garantir que qualquer cidadão consiga acessar a página sem ter conta.

- [ ] **Passo 1:** Abra uma janela Anônima no seu navegador.
- [ ] **Passo 2:** Digite a URL: `http://localhost:3000/transparencia/[COLE_AQUI_O_UUID_DA_PREFEITURA]`.
- [ ] **Resultado Esperado A:** A página deve carregar perfeitamente, sem redirecionar para a tela de `/login`.
- [ ] **Resultado Esperado B:** O nome da Prefeitura e o logotipo (se houver) devem aparecer no topo da página.

## 🟢 Caso 02: Validação de Métricas e LGPD no Mapa
**Objetivo:** Garantir que o mapa exibe os pontos sem vazar dados pessoais.

- [ ] **Passo 1:** Na mesma página pública, verifique os Cards de estatísticas.
- [ ] **Resultado Esperado A:** Os números devem refletir os totais reais (ex: Total Resolvido, CSAT), não podendo estar zerados se a prefeitura já possui histórico.
- [ ] **Passo 2:** Role até a seção do Mapa de Zeladoria.
- [ ] **Resultado Esperado B:** O mapa deve renderizar os "Pins" dos chamados que já estão concluídos.
- [ ] **Passo 3:** Clique em um dos Pins no mapa.
- [ ] **Resultado Esperado C:** O popup deve exibir apenas informações genéricas (Ex: "Categoria: Buraco na Via"), e **NÃO DEVE** exibir o nome de quem abriu o chamado, a foto da evidência, nem a descrição textual do problema.

## 🟢 Caso 03: Tratamento de Prefeitura Inexistente
**Objetivo:** Garantir que o sistema lida bem com URLs incorretas.

- [ ] **Passo 1:** Altere a URL para um UUID aleatório ou inexistente (ex: `http://localhost:3000/transparencia/11111111-1111-1111-1111-111111111111`).
- [ ] **Resultado Esperado:** A página deve exibir um aviso amigável de "Prefeitura não encontrada" ou "Página não disponível", em vez de quebrar com um erro fatal do React (Tela Vermelha).

---

### 📝 Observações do QA
*(Anote aqui se o mapa demorou muito para carregar ou se o layout responsivo quebrou no celular).*
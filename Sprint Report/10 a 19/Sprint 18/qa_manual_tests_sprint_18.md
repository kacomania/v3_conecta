# 🧪 Plano de Testes Manuais (QA) - Sprint 18

**Módulo:** Gestão Conecta (Web) & Cidadão Conecta (Mobile)
**Objetivo:** Validar a customização de cores e logotipos e a reatividade do tema no aplicativo.

## ⚙️ Pré-requisitos
1. Portal Web rodando localmente (logado com usuário que possua acesso a "Configurações" - ex: `CITY_ADMIN`).
2. Emulador Flutter rodando (App Cidadão Conecta).
3. Ter salvo no computador uma imagem qualquer (JPG/PNG) para servir de "Logo de Teste".

---

## 🟢 Caso 01: Configuração de White-Label (Portal Web)
**Objetivo:** Garantir que o gestor consegue aplicar as cores institucionais.

- [ ] **Passo 1:** No Portal Web, acesse a aba **"Configurações"**.
- [ ] **Passo 2:** Localize a seção de "Identidade Visual" para a sua Prefeitura de teste.
- [ ] **Passo 3:** Defina a **Cor Primária** (ex: um tom de Vermelho forte, como `#D32F2F`) e a **Cor Secundária** (ex: um Laranja).
- [ ] **Passo 4:** Faça o upload da imagem de "Logo de Teste" no input de arquivo.
- [ ] **Passo 5:** Salve as configurações.
- [ ] **Resultado Esperado:** O botão deve processar a ação com sucesso. Ao recarregar a página web, as cores e a imagem devem permanecer salvas (dados persistidos no banco e no Storage).

## 🟢 Caso 02: Reflexo Mágico no App (Mobile)
**Objetivo:** Validar que o aplicativo do cidadão se adapta à identidade visual da prefeitura escolhida.

- [ ] **Passo 1:** Abra o app Flutter no emulador.
- [ ] **Passo 2:** Se já estiver logado, feche o app completamente (Cold Start) e abra novamente, ou vá em "Meu Perfil" e faça "Logout" -> "Trocar de Prefeitura".
- [ ] **Passo 3:** Selecione a prefeitura que você acabou de customizar no Portal Web.
- [ ] **Resultado Esperado A:** Na tela inicial (`HomePage`), a cor principal da AppBar, botões principais ("Nova Solicitação") e ícones de destaque devem estar **Vermelhos** (a cor que você configurou no Passo 3 do Caso 01), substituindo o Azul padrão.
- [ ] **Resultado Esperado B:** O "Logo de Teste" que você fez upload deve aparecer no topo da tela ou na AppBar da Home, carregado via internet.

## 🟢 Caso 03: Resiliência de Fallback (Cores Padrão)
**Objetivo:** Garantir que o app não quebra se a prefeitura não tiver cores configuradas.

- [ ] **Passo 1:** No Portal Web, limpe as configurações de cor e logo da prefeitura (deixe vazio/null) e salve.
- [ ] **Passo 2:** No app Flutter, feche e abra novamente.
- [ ] **Resultado Esperado:** O aplicativo deve retornar suavemente para a paleta padrão definida no Blueprint (Azul Conecta `#003B73`) e não deve apresentar nenhum erro de compilação ou tela vermelha (crash).

---

### 📝 Observações do QA
*(Anote aqui se houve algum engasgo na transição do tema ou demora no carregamento do logo na Home).*
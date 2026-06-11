# 🧪 Plano de Testes Manuais (QA) - Sprint 22

**Módulo:** Cidadão Conecta (Mobile) & Gestão Conecta (Web)
**Objetivo:** Validar a criação de conta com Termos de Uso e o fluxo de anonimização (Direito ao Esquecimento / LGPD).

## ⚙️ Pré-requisitos
1. Emulador Flutter rodando (App Cidadão Conecta).
2. Portal Web rodando localmente (logado com usuário Atendente).
3. E-mail temporário ou fictício pronto para criar uma nova conta de testes.

---

## 🟢 Caso 01: Aceite dos Termos no Cadastro
**Objetivo:** Garantir que o app exige a concordância jurídica.

- [ ] **Passo 1:** No app Flutter, vá para a tela de Registro (`RegisterScreen`).
- [ ] **Passo 2:** Preencha Nome, E-mail (ex: `cidadado.lgpd@teste.com`) e Senha.
- [ ] **Passo 3:** Deixe o checkbox "Li e aceito os Termos" **desmarcado**.
- [ ] **Passo 4:** Tente clicar em "Criar Conta".
- [ ] **Resultado Esperado A:** O botão deve estar desabilitado ou exibir uma mensagem de erro ("Você precisa aceitar os termos").
- [ ] **Passo 5:** Marque o checkbox e tente novamente.
- [ ] **Resultado Esperado B:** A conta é criada com sucesso e o usuário loga no app.

## 🟢 Caso 02: Anonimização de Ocorrência
**Objetivo:** Garantir que excluir a conta apaga os dados pessoais, mas preserva a zeladoria.

- [ ] **Passo 1:** Com a conta recém-criada (`cidadado.lgpd@teste.com`) logada no App, **abra um novo chamado** (ex: Categoria "Buraco", Título "Buraco LGPD").
- [ ] **Passo 2:** Vá até a aba "Meu Perfil" no aplicativo.
- [ ] **Passo 3:** Clique no botão vermelho **"Excluir Minha Conta"**.
- [ ] **Passo 4:** No Dialog de Confirmação, confirme a exclusão.
- [ ] **Resultado Esperado A:** O app faz um loading rápido, desloga o usuário e volta para a Tela de Login.
- [ ] **Passo 5:** Tente fazer Login novamente com `cidadado.lgpd@teste.com` e a senha usada.
- [ ] **Resultado Esperado B:** O Supabase deve rejeitar o login ("Credenciais inválidas" ou usuário não encontrado), provando que a conta foi apagada do `auth.users`.
- [ ] **Passo 6:** Abra o Portal Web (Next.js) e olhe o Dashboard de Triagem.
- [ ] **Resultado Esperado C:** O chamado "Buraco LGPD" **ainda deve estar lá**. Porém, ao abrir os detalhes, o nome do cidadão deve constar como "Usuário Excluído", "Anônimo" ou ficar em branco, confirmando a anonimização.

---

### 📝 Observações do QA
*(Anote aqui se o Dialog de confirmação ficou confuso ou se o botão de criar conta não reagiu corretamente ao checkbox).*
# 🧪 Plano de Testes Manuais (QA) - Sprint 21

**Módulo:** Gestão Conecta (Web Portal)
**Objetivo:** Validar a eficácia do painel de auditoria na rastreabilidade de ações dos servidores.

## ⚙️ Pré-requisitos
1. Portal Web rodando localmente.
2. Ter acesso a **duas contas**:
   - Conta A: Nível "Atendente" (`ATTENDANT`).
   - Conta B: Nível "Administrador" ou "Auditor" (`CITY_ADMIN` ou `AUDITOR`).

---

## 🟢 Caso 01: Segurança de Acesso (Anti-Bisbilhoteiro)
**Objetivo:** Garantir que atendentes comuns não acessem os logs do sistema.

- [ ] **Passo 1:** Faça login no Portal Web usando a **Conta A (Atendente)**.
- [ ] **Passo 2:** Verifique a Sidebar lateral. O menu "Auditoria" ou "Corregedoria" **NÃO** deve estar visível.
- [ ] **Passo 3:** Force a entrada digitando na URL do navegador: `http://localhost:3000/dashboard/auditoria`.
- [ ] **Resultado Esperado:** O sistema deve bloquear a renderização e redirecionar você para o Dashboard inicial, possivelmente exibindo um alerta de "Acesso Negado".

## 🟢 Caso 02: Geração de Evidência e Rastreabilidade
**Objetivo:** Garantir que uma ação de um servidor seja registrada e auditável.

- [ ] **Passo 1:** Ainda logado como **Conta A (Atendente)**, vá ao Dashboard, inicie um atendimento qualquer e adicione uma Nota Interna com o texto: "Ação Suspeita de Teste".
- [ ] **Passo 2:** Faça Logout da Conta A.
- [ ] **Passo 3:** Faça Login com a **Conta B (Auditor/Admin)**.
- [ ] **Passo 4:** Clique no menu "Auditoria" na Sidebar.
- [ ] **Resultado Esperado A:** O painel de Auditoria deve carregar uma tabela com logs.
- [ ] **Passo 5:** Na primeira linha da tabela (mais recente), verifique os dados.
- [ ] **Resultado Esperado B:** Deve constar a data e hora exatas, o nome/e-mail da Conta A, e a descrição da ação (ex: "Inseriu nota interna no Chamado #XYZ").

## 🟢 Caso 03: Filtros de Tempo e Autor
**Objetivo:** Validar se a Corregedoria consegue isolar eventos específicos.

- [ ] **Passo 1:** No painel de Auditoria, utilize o filtro de "Data". Defina um período que não englobe a data de hoje (ex: de um mês atrás até semana passada).
- [ ] **Resultado Esperado A:** A tabela deve atualizar e **esconder** o log gerado no Caso 02, mostrando apenas logs antigos (ou "Nenhum registro encontrado").
- [ ] **Passo 2:** Limpe o filtro de data.
- [ ] **Passo 3:** No filtro de Busca/Autor, digite o e-mail exato da **Conta A**.
- [ ] **Resultado Esperado B:** A tabela deve filtrar e exibir **exclusivamente** as ações realizadas pela Conta A.

---

### 📝 Observações do QA
*(Anote aqui se a tabela demonstrou lentidão para carregar ou se as colunas estão quebrando em telas menores).*
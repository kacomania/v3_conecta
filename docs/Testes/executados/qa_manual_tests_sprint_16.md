# 🧪 Plano de Testes Manuais (QA) - Sprint 16

**Módulo:** Gestão Conecta (Web) & Cidadão Conecta (Mobile)
**Objetivo:** Validar o Pessimistic Locking (Prevenção de Colisão), a Exportação CSV e a reatividade (Realtime) nas duas plataformas.

## ⚙️ Pré-requisitos
1. Servidor Next.js rodando localmente. Emulador Android rodando o Flutter.
2. Ter acesso a **duas contas de Servidor** (Atendente A e Atendente B) e **uma conta de Cidadão**.
3. Recomenda-se usar duas janelas de navegador diferentes (ex: Chrome normal para o Atendente A, Chrome Incógnito para o Atendente B) para simular duas pessoas diferentes logadas ao mesmo tempo.

---

## 🟢 Caso 01: Trava de Atendimento (Pessimistic Locking)
**Objetivo:** Garantir que dois atendentes não consigam abrir o mesmo chamado.

- [ ] **Passo 1:** No Navegador 1, logue como **Atendente A**.
- [ ] **Passo 2:** No Navegador 2, logue como **Atendente B**.
- [ ] **Passo 3:** O Atendente A clica em **"Iniciar Atendimento"** no Chamado #001.
- [ ] **Resultado Esperado A:** A tela de detalhes do chamado se abre para o Atendente A. Uma nota interna "Atendimento iniciado" aparece na timeline.
- [ ] **Passo 4:** Olhe para a tela do Atendente B (Dashboard).
- [ ] **Resultado Esperado B:** O botão do Chamado #001 deve ter mudado **automaticamente** (via Realtime) para um ícone de cadeado ou "Em atendimento por [Nome do Atendente A]" e estar desabilitado.
- [ ] **Passo 5:** Como Atendente B, copie a URL do chamado (ex: `/dashboard/chamado/001`) e cole na barra de endereços para forçar a entrada.
- [ ] **Resultado Esperado C:** O sistema deve bloquear a renderização e mostrar uma mensagem de acesso negado ("Este chamado está sendo atendido por outro usuário").

## 🟢 Caso 02: Limite de 1 Chamado por Atendente
**Objetivo:** Evitar que um usuário "abrace" a fila inteira.

- [ ] **Passo 1:** Com o Atendente A ainda com o Chamado #001 aberto, volte para a aba do Dashboard.
- [ ] **Passo 2:** Tente clicar em **"Iniciar Atendimento"** no Chamado #002.
- [ ] **Resultado Esperado:** O sistema deve exibir um alerta/Toast vermelho: "Você já possui um atendimento em andamento. Encerre-o antes de puxar um novo."

## 🟢 Caso 03: Quebra de Trava por Inatividade (Timeout de 30 min)
**Objetivo:** Garantir que um chamado não fique travado para sempre se o atendente for embora.

- [ ] **Passo 1:** No painel do Supabase (Table Editor), vá na tabela `occurrences`, ache o Chamado #001 (que está travado pelo Atendente A).
- [ ] **Passo 2:** Altere manualmente a coluna `locked_at` para uma data/hora de **35 minutos atrás**.
- [ ] **Passo 3:** No Navegador 2 (Atendente B), atualize a página. O botão deve voltar a ficar disponível.
- [ ] **Passo 4:** O Atendente B clica em "Iniciar Atendimento".
- [ ] **Resultado Esperado:** O Atendente B consegue entrar. A timeline registra duas notas automáticas: "Atendimento de [Atendente A] encerrado por inatividade" e "Atendimento iniciado por [Atendente B]".

## 🟢 Caso 04: Realtime Mobile-Web (A "Magia")
**Objetivo:** Validar a sincronização ao vivo entre a Prefeitura e o Cidadão.

- [ ] **Passo 1:** No emulador Flutter, logue como Cidadão, abra "Meus Chamados" e entre na tela de detalhes de um chamado seu. Deixe a tela aberta.
- [ ] **Passo 2:** No Portal Web, um Atendente "Inicia Atendimento" desse mesmo chamado.
- [ ] **Passo 3:** O Atendente muda o status de "Pendente" para "Em Andamento" e adiciona uma Nota Pública: "Equipe a caminho!".
- [ ] **Resultado Esperado:** **SEM TOCAR NO CELULAR**, a tela do aplicativo Flutter deve piscar/atualizar sozinha, mudando a cor do Status e exibindo a nova mensagem na Linha do Tempo instantaneamente.

## 🟢 Caso 05: Exportação de CSV
**Objetivo:** Validar a geração de relatórios.

- [ ] **Passo 1:** No Dashboard Web, use os filtros para exibir apenas chamados com status "Concluído".
- [ ] **Passo 2:** Clique no botão "Exportar CSV".
- [ ] **Resultado Esperado:** Um arquivo `.csv` deve ser baixado. Ao abri-lo no Excel/Numbers, ele deve conter as colunas básicas (ID, Título, Status, Data) e **apenas** as linhas correspondentes ao filtro de "Concluído" que estava na tela.

---

### 📝 Observações do QA
*(Anote aqui comportamentos inesperados, falhas de CSS durante a troca de botões ou lentidão na exportação).*
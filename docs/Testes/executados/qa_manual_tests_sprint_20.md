# 🧪 Plano de Testes Manuais (QA) - Sprint 20

**Módulo:** Gestão Conecta (Web) & Cidadão Conecta (Mobile)
**Objetivo:** Validar a jornada de avaliação do cidadão após a resolução do chamado.

## ⚙️ Pré-requisitos
1. Portal Web rodando localmente (logado com usuário Atendente).
2. Emulador Flutter rodando (App Cidadão Conecta, logado com Cidadão).
3. O Cidadão deve ter um chamado aberto no status "Em Andamento" ou "Pendente".

---

## 🟢 Caso 01: Ocultação Prévia (App Mobile)
**Objetivo:** Garantir que não é possível avaliar antes de o chamado ser concluído.

- [ ] **Passo 1:** No app Flutter, abra os detalhes do seu chamado que está "Pendente" ou "Em Andamento".
- [ ] **Resultado Esperado:** Role a página inteira. **Não deve haver** nenhuma opção ou botão perguntando "Como você avalia este atendimento?".

## 🟢 Caso 02: Liberação da Avaliação e Submissão
**Objetivo:** Garantir que o Cidadão consegue avaliar quando o chamado é finalizado.

- [ ] **Passo 1:** No Portal Web, como Atendente, inicie o atendimento desse chamado.
- [ ] **Passo 2:** Mude o Status para **Concluído**.
- [ ] **Passo 3:** No app Flutter, a tela do chamado vai atualizar (via Realtime).
- [ ] **Resultado Esperado A:** Um novo Card deve aparecer imediatamente dizendo "Como você avalia este atendimento?" com 5 estrelas vazias.
- [ ] **Passo 4:** Toque na 4ª estrela (para dar nota 4).
- [ ] **Passo 5:** Escreva no campo de comentários: "Equipe rápida, mas deixou sujeira."
- [ ] **Passo 6:** Clique em "Enviar Avaliação".
- [ ] **Resultado Esperado B:** O botão deve mostrar um loading rápido. Em seguida, o formulário interativo some e dá lugar a um Card estático dizendo "Sua Avaliação", mostrando 4 estrelas preenchidas e o seu comentário.

## 🟢 Caso 03: Visualização do Servidor (Web)
**Objetivo:** Garantir que a prefeitura receba o feedback do cidadão.

- [ ] **Passo 1:** Volte para o Portal Web (tela de detalhes do chamado que acabou de ser avaliado).
- [ ] **Passo 2:** Atualize a página.
- [ ] **Resultado Esperado:** Em alguma parte da tela (no painel lateral ou abaixo da descrição), deve aparecer um card de "Avaliação do Cidadão" exibindo as **4 estrelas** e o comentário exato que foi digitado no celular.

## 🟠 Caso 04: Edge Cases e Segurança
**Objetivo:** Garantir a consistência da nota.

- [ ] **Teste A:** No app Flutter, saia da tela do chamado e entre novamente. **Resultado:** O card estático com as 4 estrelas deve continuar lá. O cidadão **não pode** reavaliar ou alterar a nota.
- [ ] **Teste B:** No Portal Web, o Atendente NÃO deve ter nenhum botão ou campo que permita alterar a nota que o cidadão deu. A visualização deve ser apenas leitura (Read-Only).

---

### 📝 Observações do QA
*(Anote aqui eventuais problemas visuais de layout, estrelas não centralizadas ou falta de feedback visual no botão de envio).*
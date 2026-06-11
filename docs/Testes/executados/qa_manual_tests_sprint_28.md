# 🧪 Plano de Testes Manuais (QA) - Sprint 28

**Módulo:** Cidadão Conecta (Mobile)
**Objetivo:** Validar a experiência de prevenção de duplicatas, o raio de 100 metros e os novos Pop-ups.

## ⚙️ Pré-requisitos
1. Emulador Flutter rodando (App Cidadão Conecta logado).
2. Chave `GEMINI_API_KEY` configurada nos Secrets do Supabase.
3. Permissão de Localização (GPS) habilitada no emulador.

---

## 🟢 Caso 01: Criação da "Semente" (Primeiro Chamado)
**Objetivo:** Criar um chamado base e validar o novo Pop-up de Sucesso.

- [ ] **Passo 1:** No app Flutter, abra um Novo Chamado (Categoria: Vias Públicas).
- [ ] **Passo 2:** Na descrição, digite: *"Poste caído no meio da rua com fios expostos."*
- [ ] **Passo 3:** Clique em Enviar.
- [ ] **Resultado Esperado A:** Um modal bloqueante aparece com o texto: "Analisando relato... Isso leva em média 30 segundos."
- [ ] **Resultado Esperado B:** Como não há duplicatas no banco, o modal fecha e abre o **Pop-up de Sucesso**.
- [ ] **Resultado Esperado C:** O Pop-up exibe o Protocolo gerado. Clique em "Copiar". Uma mensagem de confirmação (SnackBar) deve aparecer.
- [ ] **Passo 4:** Clique em "OK". O app deve voltar para a Home.

## 🟢 Caso 02: Match de IA (Dentro de 100 Metros)
**Objetivo:** Garantir que a IA pega um texto similar no mesmo local.

- [ ] **Passo 1:** No emulador, mantenha o GPS no MESMO LOCAL do Caso 01.
- [ ] **Passo 2:** Abra um Novo Chamado e digite: *"Tem um poste no chão aqui, os cabos de energia arrebentaram."*
- [ ] **Passo 3:** Clique em Enviar.
- [ ] **Resultado Esperado A:** Aparece o loading de 30 segundos.
- [ ] **Resultado Esperado B:** O sistema abre um Widget/Modal listando o chamado do Caso 01 ("Poste caído no meio da rua...").
- [ ] **Passo 4:** Clique em **"Apoiar este chamado"**.
- [ ] **Resultado Esperado C:** O Pop-up de Sucesso aparece informando o protocolo do chamado apoiado. Clique em "OK" para voltar à Home.

## 🟢 Caso 03: Fuga do Match (Recusa do Cidadão)
**Objetivo:** Garantir que o cidadão pode ignorar a IA se achar que são problemas diferentes.

- [ ] **Passo 1:** Abra outro chamado no MESMO LOCAL. Digite: *"Poste tombou na calçada."*
- [ ] **Passo 2:** Clique em Enviar. O modal de duplicata deve aparecer novamente.
- [ ] **Passo 3:** Clique no botão **"Não, abrir novo chamado"**.
- [ ] **Resultado Esperado:** O app ignora a duplicata, salva o novo chamado no banco e exibe o Pop-up de Sucesso com um **NOVO** número de protocolo.

## 🟢 Caso 04: Isolamento Geográfico (> 100 Metros)
**Objetivo:** Garantir que problemas iguais em bairros diferentes não se misturam.

- [ ] **Passo 1:** No seu Emulador (Android/iOS), abra as configurações de GPS e altere sua localização para um bairro ou cidade distante (mais de 2km de distância do Caso 01).
- [ ] **Passo 2:** No app, abra um Novo Chamado e digite exatamente o mesmo texto: *"Poste caído no meio da rua com fios expostos."*
- [ ] **Passo 3:** Clique em Enviar.
- [ ] **Resultado Esperado:** O loading de 30 segundos aparece, mas o modal de duplicatas **NÃO DEVE APARECER**. O chamado deve ser criado diretamente, pois está fora do raio de 100 metros.

---

### 📝 Observações do QA
*(Verifique se o texto copiado do botão "Copiar" cola corretamente em outro app, como o bloco de notas).*
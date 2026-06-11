# 🧪 Plano de Testes (Desenvolvedor / Dibro) - Sprint 31

**Responsável:** Dibro (Agente IA)
**Objetivo:** Executar e confirmar o sucesso das suítes de testes automatizados recém-criadas.

## 1. Execução de Testes Mobile (Flutter)
- [x] No terminal, acesse `cidadao_conecta/`.
- [x] Execute o comando: `flutter test`.
- [x] O resultado deve ser `All tests passed!`. Se houver falhas, corrija o código de teste ou o código fonte antes de prosseguir.

## 2. Execução de Testes Web Unitários (Next.js)
- [x] No terminal, acesse `gestao_conecta/`.
- [x] Execute o comando (configurado no package.json): `npm run test`.
- [x] O Jest deve reportar `PASS` para todas as suítes de teste de componentes.

## 3. Execução de Testes Web E2E (Playwright)
- [x] Ainda em `gestao_conecta/`, execute o comando: `npx playwright test`.
- [x] O Playwright deve compilar e executar o teste (headless) com sucesso. Verifique se não há erros de dependências ou timeout.

## 4. Validação da API M2M (Inbound)
- [x] Executar o teste automatizado da rota de API REST (Endpoint de Integração Legada).
- [x] Confirmar que o teste simula o envio de um header `x-api-key` inválido e atesta o recebimento do HTTP Status `401` ou `403`.
- [x] Confirmar que o teste simula o envio de uma chave válida e atesta o recebimento do HTTP Status `200` ou `201`.
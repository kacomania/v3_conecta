# 🧪 Plano de Testes Manuais (QA) - Sprint 32

**Módulo:** Gestão Conecta (Web Portal)
**Objetivo:** Validar a experiência de um desenvolvedor externo lendo a documentação da API.

## ⚙️ Pré-requisitos
1. Portal Web rodando localmente.
2. Estar logado com conta de Administrador (CITY_ADMIN ou SYSTEM_ADMIN).

---

## 🟢 Caso 01: Acesso à Documentação
**Objetivo:** Garantir que o Swagger está integrado ao painel.

- [ ] **Passo 1:** No Portal Web, vá em "Integrações" ou "Desenvolvedores".
- [ ] **Passo 2:** Clique no botão/link "Ver Documentação da API".
- [ ] **Resultado Esperado:** A página deve carregar a interface clássica do Swagger UI (com a barra superior e os blocos expansíveis).

## 🟢 Caso 02: Compreensão e Interatividade
**Objetivo:** Validar a clareza da especificação gerada.

- [ ] **Passo 1:** Na tela do Swagger, clique no botão **"Authorize"** (cadeado).
- [ ] **Resultado Esperado A:** Deve abrir um modal pedindo o valor do Header (ex: `x-api-key`).
- [ ] **Passo 2:** Expanda o endpoint de Ocorrências (ex: `PATCH /api/v1/occurrences/{id}`).
- [ ] **Resultado Esperado B:** Deve haver uma descrição clara do que o endpoint faz, os parâmetros obrigatórios e um exemplo de JSON (body) mostrando como atualizar o status de um chamado.

---

### 📝 Observações do QA
*(Verifique se o CSS do Swagger não entrou em conflito com o Dark Mode ou estilos globais do Tailwind).*
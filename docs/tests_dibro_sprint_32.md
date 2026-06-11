# 🧪 Plano de Testes (Desenvolvedor / Dibro) - Sprint 32

**Responsável:** Dibro (Agente IA)
**Objetivo:** Validar a renderização da interface do Swagger e a integridade da especificação.

## 1. Validação da Especificação (OpenAPI)
- [ ] O objeto JSON/YAML da especificação atende ao padrão OpenAPI 3.0?
- [ ] O endpoint de M2M (`/api/v1/...`) está listado com os métodos corretos?
- [ ] O esquema de segurança (`ApiKeyAuth` in `header`) está definido e aplicado globalmente ou no endpoint?

## 2. Validação Visual
- [ ] Acessar a rota `/dashboard/desenvolvedores/docs` no navegador (ou ambiente de teste).
- [ ] Garantir que o componente do Swagger renderiza sem quebrar o layout do Tailwind CSS e sem erros no console referentes ao `window` (caso seja necessário usar import dinâmico no Next.js).
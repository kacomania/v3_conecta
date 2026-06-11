# 🧪 Plano de Testes (Desenvolvedor / Dibro) - Sprint 24

**Responsável:** Dibro (Agente IA)
**Objetivo:** Validar a segurança da RPC pública e a exposição de rotas no Next.js.

## 1. Validação de Segurança da RPC (`get_public_transparency_metrics`)
- [ ] Invocar a função via SQL ou Supabase Client simulando um usuário ANÔNIMO (sem token de autenticação). A função DEVE retornar os dados (devido ao `SECURITY DEFINER`).
- [ ] Analisar o payload JSON retornado pela função. Garantir que as colunas `description`, `user_id` e `image_url` **NÃO** estejam presentes nos dados dos chamados do mapa (Garantia de LGPD).

## 2. Validação do Middleware
- [ ] Realizar um request GET simulado (ou análise de código) para a rota `/transparencia/123456`.
- [ ] Confirmar que o `middleware.ts` não executa redirecionamento (Status 307/308 para `/login`), permitindo que a página renderize com status 200.
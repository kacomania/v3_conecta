# 🧪 Plano de Testes (Desenvolvedor / Dibro) - Sprint 21

**Responsável:** Dibro (Agente IA)
**Objetivo:** Validar a segurança de rotas e o comportamento das queries de logs.

## 1. Validação de Middleware e Permissões
- [ ] Simular um acesso à rota `/dashboard/auditoria` com um usuário de `access_level = 1` (ATTENDANT). O sistema DEVE redirecionar o usuário para fora da página ou retornar status 403/Forbidden.
- [ ] Simular um acesso à rota `/dashboard/auditoria` com um usuário de `access_level = 3` (AUDITOR) ou superior. O acesso DEVE ser concedido.

## 2. Validação da Data Layer (Server Actions)
- [ ] Executar a Server Action de busca de logs passando um filtro de data restrito (ex: log de ontem). Garantir que a query do Supabase retorne apenas registros dentro do range estabelecido.
- [ ] Garantir que o nome ou email do autor da ação (Server/Atendente) seja corretamente traduzido do `user_id` para texto legível, utilizando o relacionamento das views ou RPCs do banco.
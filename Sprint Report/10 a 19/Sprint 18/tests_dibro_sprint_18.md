# 🧪 Plano de Testes (Desenvolvedor / Dibro) - Sprint 18

**Responsável:** Dibro (Agente IA)
**Objetivo:** Validar a integridade do banco de dados e a infraestrutura de Storage para o Theming.

## 1. Validação de Schema (Supabase)
- [ ] Confirmar se as colunas `primary_color`, `secondary_color` e `logo_url` foram adicionadas à tabela `prefeituras` como `TEXT` e aceitam `NULL`.

## 2. Validação de Storage e RLS
- [ ] Confirmar se o bucket `tenant_assets` foi criado com a flag `public: true`.
- [ ] Verificar as Policies do bucket: a leitura (`SELECT`) deve ser permitida para o público geral (anon), e a inserção (`INSERT/UPDATE`) deve ser permitida apenas para autenticados (ou restrita a admins via RLS).

## 3. Validação de Conversão Hex (Flutter)
- [ ] Executar um teste unitário ou verificação lógica na função de conversão Hex -> Color no Flutter. Passar as strings `"#003B73"`, `"003B73"` e `null` e garantir que o app não sofra *crash* (gerando a cor correta ou o fallback default).
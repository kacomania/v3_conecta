# Implementation Plan - Sprint 18: White-Label e Theming Dinâmico

## 🎯 Objetivo
Habilitar a customização visual (White-label) por locatário (Tenant). Permitir que gestores configurem as cores institucionais e o logotipo da prefeitura no Portal Web, refletindo essas mudanças dinamicamente no tema (ThemeData) do aplicativo móvel Flutter.

## 🏗️ Decisões Arquiteturais

### 1. Banco de Dados e Storage (Supabase)
- **Tabela `prefeituras`:** Adicionar colunas `primary_color` (TEXT), `secondary_color` (TEXT) e `logo_url` (TEXT).
- **Storage:** Criar o bucket público `tenant_assets` para armazenar os logotipos das prefeituras.

### 2. Portal Web (Next.js - `gestao_conecta`)
- **UI:** Adicionar uma aba ou seção de "Identidade Visual" na página de Configurações (`/dashboard/configuracoes`).
- **Formulário:** Inputs de cor (color picker ou hex text) para cor primária e secundária, e um input de arquivo para upload do logotipo.
- **Server Actions:** Atualizar a `prefeituras` e gerenciar o upload de imagem para o bucket `tenant_assets`.

### 3. App Mobile (Flutter - `cidadao_conecta`)
- **Domain/Data:** Atualizar o `PrefeituraModel` e a entidade para realizar o parse das novas colunas.
- **Theming (Riverpod):** O `tenantThemeProvider` (já previsto no Blueprint) deve ler o `currentTenantProvider`. Se a prefeitura tiver cores customizadas, a classe `TenantTheme` deve gerar o `ThemeData` substituindo o azul padrão pelas cores em HEX vindas do banco.
- **UI:** Atualizar a `HomeScreen` e a `LoginScreen` (ou `SelectTenantScreen`) para exibir o `logo_url` via `CachedNetworkImage` (caso exista), substituindo o logo genérico do app.

## 🔀 Estratégia de Git
- Branch: `feature/sprint-18-whitelabel-theming`.
- Fechamento padrão com `@commit` e `@gerando-relatorios-sprint.md`.
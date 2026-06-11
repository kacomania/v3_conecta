# Implementation Plan - Sprint 1: Theming & DI

## 1. Visão Geral
O objetivo desta sprint é estabelecer a fundação visual e de navegação do aplicativo `cidadao_conecta`. Vamos traduzir o `DESIGN.md` (gerado pelo Stitch) para código Flutter (Design Tokens), criar a biblioteca de componentes atômicos e configurar a injeção de dependências global (Riverpod) e o roteamento (GoRouter).

## 2. Estratégia Git (Obrigatória)
- **Branch:** `feature/sprint-1-theming-di`
- **Encerramento:** Commits atômicos via skill `@commit` e arquivamento via `gerando-relatorios-sprint.md`.

## 3. Escopo Técnico
### A. Design System & Theming (`lib/ui/core/themes/`)
- Ler o arquivo `DESIGN.md` (se existir) para extrair hexadecimais e tipografia.
- Criar `app_colors.dart`: Constantes estáticas para cores de base (Branco, Cinza, Erro, Sucesso).
- Criar `tenant_theme.dart`: Factory class que gera o `ThemeData` completo (InputDecoration, TextTheme usando `GoogleFonts.inter`) baseado nas cores dinâmicas da prefeitura (Primary/Secondary).

### B. Componentes Atômicos (`lib/ui/core/components/`)
- Criar `primary_button.dart`: Botão principal com suporte a estado de loading (`CircularProgressIndicator`).
- Criar `custom_text_field.dart`: Input padronizado com suporte a prefix icons.
- Criar `action_card.dart`: Card interativo para a Home.
- Criar `bottom_nav_bar.dart`: Barra de navegação inferior padrão.

### C. Infraestrutura Core (`lib/core/` e `lib/routing/`)
- Criar `network/supabase_client.dart`: Inicialização do `SupabaseClient`.
- Criar `di/providers.dart`: Arquivo central de provedores do Riverpod (ex: `supabaseClientProvider`, `tenantThemeProvider` com fallback para o tema padrão).
- Criar `routing/route_names.dart`: Constantes de rotas (`/login`, `/`, etc).
- Criar `routing/app_router.dart`: Configuração do `GoRouter` com um esqueleto inicial de redirecionamento.

### D. Entrypoint (`lib/main.dart`)
- Refatorar o `main.dart` para inicializar o `flutter_dotenv` e o Supabase.
- Envolver o app no `ProviderScope` do Riverpod.
- Configurar o `MaterialApp.router` para consumir o `tenantThemeProvider` e o `appRouter`.

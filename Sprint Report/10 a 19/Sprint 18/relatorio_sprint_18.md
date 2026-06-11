# Relatório de Encerramento - Sprint 18

## 1. Resumo Executivo
**Objetivo da Sprint:** Implementar a arquitetura completa de White-Label Dinâmico, permitindo que as prefeituras configurem suas identidades visuais de forma autônoma (cores e logo) no painel web, refletindo automaticamente no aplicativo Cidadão Conecta.
**Valor para o Negócio:** Escalabilidade SaaS sem precisar fazer deploys paralelos do app móvel para cada prefeitura. Flexibilidade total para os clientes customizarem sua marca via painel administrativo.

## 2. Blueprint (Arquitetura)
### Banco de Dados (Supabase)
- **Tabela `prefeituras`**: Inserção das novas colunas `primary_color` (TEXT), `secondary_color` (TEXT) e `logo_url` (TEXT).
- **Storage**: Criação do bucket público `tenant_assets` para hospedar os logotipos.
- **RLS e Policies**: Políticas exclusivas de `INSERT` e `UPDATE` limitadas a usuários autenticados, enquanto a leitura (`SELECT`) foi configurada como de acesso público (através da policy `Public Access Tenant Assets`) para possibilitar o carregamento imediato das imagens no Flutter.

### App Web (Gestão Conecta)
- **Server Actions**: Implementada a action `updateTenantIdentity`, responsável pelo gerenciamento de cores hexadecimais e o streaming do arquivo do logotipo (`File` → `Buffer`), evitando falhas clássicas de upload e encoding do Next.js via fetch.
- **Painel Administrativo**: Reestruturação das permissões para liberar a configuração da identidade visual aos perfis designados como `SYSTEM_ADMIN` e `CITY_ADMIN`.

### App Mobile (Cidadão Conecta)
- **Domain**: Adição dos novos parâmetros `primaryColor`, `secondaryColor` e `logoUrl` no `prefeitura_model.dart`.
- **Theme Manager**: Evolução da classe `TenantTheme` injetando parsers de strings Hex em Colors do Flutter, recalculando e derivando um novo `ColorScheme` (Material 3) responsivo em tempo real.
- **State Management (Riverpod)**:
  - Integração do `tenantThemeProvider` com a árvore de componentes principais.
- **UI & Navegação**:
  - `LoginScreen`: Intercepção da prefeitura selecionada, renderizando o `logoUrl` no topo utilizando `CachedNetworkImage`.
  - `HomePage`: Renderização responsiva do logo na Header da AppBar nativa do sistema.

## 3. Walkthrough (Log de Validação)
### Arquivos Modificados/Criados
- [MODIFY] `cidadao_conecta/lib/domain/models/prefeitura_model.dart`
- [MODIFY] `cidadao_conecta/lib/ui/core/themes/tenant_theme.dart`
- [MODIFY] `cidadao_conecta/lib/ui/home/pages/home_page.dart`
- [MODIFY] `cidadao_conecta/lib/ui/features/auth/screens/login_screen.dart`
- [MODIFY] `gestao_conecta/src/app/(admin)/dashboard/configuracoes/page.tsx`
- [MODIFY] `gestao_conecta/src/components/config-forms.tsx`
- [MODIFY] `gestao_conecta/src/actions/configuracoes.ts`

### Testes do Dibro e Ações Extras
1. **Validação RLS do Storage:** Durante os testes de upload do painel Web, o Supabase bloqueava a operação como *Access Denied* em modo de Upsert. Identificamos que a função carecia de política pública de leitura devido a um conflito de nomeclatura. O problema foi sanado gerando a role `Public Access Tenant Assets`.
2. **Correção de Serialização (Next.js):** Na ação de upload nativa do App Router (Web), o `FormData` emitia arquivos vazios ou bloqueava a gravação do log. O fix envolveu converter a interface DOM `File` explicitamente em `Node.js Buffer` na action do backend.
3. **Correção de Reatividade React:** Na troca dinâmica da dropdown do painel, foi necessário embrulhar a Action num método custom (`handleUpdateIdentity`) para evitar que a promessa nativa `confirm` do javascript reiniciasse a página à força, o que antes "desfazia" a gravação imediata na UI.
4. **Resolução Dinâmica de UI (Flutter):** Resolvemos pequenos detalhes de Syntax para acessar as instâncias do `logoUrl` com suporte de fallback, validando sua disponibilidade via `currentTenantProvider` com Hot Restart pleno finalizado.

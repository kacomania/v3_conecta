# Relatório Unificado da Sprint 28: IA Duplicatas & UX de Apoio

## 1. Resumo Executivo
Nesta Sprint, focamos em melhorar a experiência do usuário ao criar e interagir com chamados e fortalecer as restrições multi-tenant e recursos de IA. 
Entregamos:
- **Inteligência Artificial de Duplicatas**: Atualizamos as *Edge Functions* de Geração de Embeddings e Busca por Similaridade para usar o mais moderno modelo `gemini-embedding-001`, com dimensionalidade 768, melhorando a precisão na hora de encontrar chamados repetidos num raio de 100 metros.
- **UX de Apoio**: O cidadão agora visualiza os chamados semelhantes em uma lista interativa. Ao clicar, um pop-up de detalhes é aberto permitindo ler toda a descrição. O botão "Apoiar Chamado" previne chamados repetidos através de um log cronológico de apoio.
- **Transparência do Apoio**: Os chamados apoiados são incluídos automaticamente na aba "Meus Chamados" com um ícone de "👍" e contador numérico. Na linha do tempo de cada chamado, o log de novos apoiadores é inserido.
- **Segurança Multi-Tenant**: Correção estrutural na base de dados (Supabase) onde as constraints de unicidade para "departamentos" e "categorias" agora consideram o ID da prefeitura, resolvendo erros ao criar nomes iguais em cidades diferentes. Correção de Server Actions (`useActionState`) no painel Next.js.

## 2. Blueprint (Arquitetura)
- **Supabase**: 
  - Restrições Multi-tenant aplicadas `UNIQUE (name, prefeitura_id)` em `departments` e `categories`.
  - Tratamento da exceção PostgreSQL `23505` (Unique Constraint) direto no repositório de ocorrências do Flutter para apoios duplicados.
- **Edge Functions**:
  - `generate-embedding` e `find-duplicates` atualizados para consumir `gemini-embedding-001`.
- **Flutter**:
  - Clean Architecture mantida. A integração do contador de apoios e exibição mesclada das listas (`criados` + `apoiados`) operam a partir do repositório, com `getOccurrencesByUser` agregando os dados nativamente e lidando com remoção de duplicatas na View.
  - Correção de condição de corrida (`Race Condition`) envolvendo a pilha de navegação modal (`Navigator.pop()`) para o loader assíncrono na tela de novo chamado.

## 3. Walkthrough (Log de Validação)
- [x] **Gestão Web**: `admin.ts` refatorado para não usar throw em blocos Next.js e permitir retorno limpo de ActionState. UI do painel validada com inclusão do mesmo departamento em cidades diferentes.
- [x] **Banco de Dados**: Constraints aplicadas com sucesso (`06_fix_multi_tenant_unique_constraints.sql` e Edge Functions deployadas).
- [x] **App Mobile**: Tela de Novo Chamado aprimorada. `ChamadoCard` atualizado. Log inserido na tabela `occurrence_timeline` ao realizar apoio. Testes executados via emulador (Dart MCP) e validado fluxo de hot-restart/cold boot para prevenir crash de snapshot.

Arquivos principais modificados:
- [admin.ts](file:///e:/V3_conecta/gestao_conecta/src/actions/admin.ts)
- [occurrence_repository_impl.dart](file:///e:/V3_conecta/cidadao_conecta/lib/data/repositories/occurrence_repository_impl.dart)
- [novo_chamado_page.dart](file:///e:/V3_conecta/cidadao_conecta/lib/ui/novo_chamado/pages/novo_chamado_page.dart)
- [novo_chamado_view_model.dart](file:///e:/V3_conecta/cidadao_conecta/lib/ui/novo_chamado/viewmodels/novo_chamado_view_model.dart)
- [chamado_card.dart](file:///e:/V3_conecta/cidadao_conecta/lib/ui/meus_chamados/widgets/chamado_card.dart)
- [find-duplicates/index.ts](file:///e:/V3_conecta/supabase/functions/find-duplicates/index.ts)
- [generate-embedding/index.ts](file:///e:/V3_conecta/supabase/functions/generate-embedding/index.ts)

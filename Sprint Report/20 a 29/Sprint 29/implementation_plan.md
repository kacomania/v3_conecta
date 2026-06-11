# Cache Local de Prefeituras e Categorias (Offline-First)

Este plano visa corrigir o problema relatado: a impossibilidade de carregar a lista de prefeituras (impedindo o login) e a lista de categorias (impedindo a criação de chamados) quando o dispositivo está offline.

## 🚧 Problema Atual
As listas de `prefeituras` e `categories` são dados de referência (mudam pouco) e atualmente são buscadas exclusivamente no Supabase. Quando há falha de rede (`SocketException`), as chamadas falham e a UI quebra/bloqueia.

## ✅ Solução Proposta (Arquitetura Offline-First)
Vamos utilizar o `LocalDatabaseHelper` (SQLite) recém-criado para também atuar como cache local desses dados de referência.

### Fluxo de Leitura (Repositories/Services)
1. Tenta buscar do Supabase.
2. Se sucesso: Atualiza o cache no SQLite e retorna os dados.
3. Se falha (ex: `SocketException`): Busca do cache no SQLite e retorna.

## User Review Required

> [!IMPORTANT]
> **Estratégia de Cache:** A abordagem atual fará com que o app precise de **pelo menos 1 acesso à internet** logo após a instalação para popular o cache local de prefeituras. Após o primeiro acesso, o usuário poderá logar offline. Você concorda com essa estratégia "Lazy Cache" ou prefere injetar um JSON estático na build do app com prefeituras base? Eu recomendo a abordagem "Lazy Cache" (tentar rede, salvar localmente para as próximas) por ser mais fácil de manter.

## Proposed Changes

---

### Banco de Dados Local (SQLite)

#### [MODIFY] [local_database_helper.dart](file:///e:/V3_conecta/cidadao_conecta/lib/core/local_db/local_database_helper.dart)
- Aumentar `_dbVersion` para `2`.
- Adicionar `onUpgrade` para criar as tabelas `cached_prefeituras` e `cached_categories` de forma segura.
- Adicionar os métodos:
  - `cachePrefeituras(List<PrefeituraModel>)` e `getCachedPrefeituras()`
  - `cacheCategories(List<CategoriaEntity>)` e `getCachedCategories()`

---

### Camada de Serviços e Repositórios

#### [MODIFY] [supabase_tenant_service.dart](file:///e:/V3_conecta/cidadao_conecta/lib/data/services/supabase_tenant_service.dart)
- Importar `LocalDatabaseHelper`.
- No `fetchAllTenants`: encapsular o fetch do Supabase num bloco try/catch.
  - No `try`: Após buscar do Supabase e parsear, chamar `LocalDatabaseHelper().cachePrefeituras(resultList)`.
  - No `catch`: Chamar `LocalDatabaseHelper().getCachedPrefeituras()`. Se o cache estiver vazio, relança o erro ou retorna vazio.

#### [MODIFY] [categoria_repository_impl.dart](file:///e:/V3_conecta/cidadao_conecta/lib/data/repositories/categoria_repository_impl.dart)
- Importar `LocalDatabaseHelper`.
- No `getCategorias`: encapsular a busca.
  - No `try`: Após buscar, mapear e retornar, salvar via `cacheCategories`.
  - No `catch`: Retornar `LocalDatabaseHelper().getCachedCategories()`.

## Verification Plan

### Automated Tests
- Rodar `flutter analyze` para checar tipagem.

### Manual Verification
1. Com a internet **ligada**, abrir o app na tela de Login para popular o cache de prefeituras.
2. Fazer login e abrir a tela "Novo Chamado" para popular o cache de categorias.
3. Matar o app. Ligar o **Modo Avião**.
4. Abrir o app: o dropdown de prefeituras deve carregar instantaneamente (do cache).
5. Tentar abrir a tela "Novo Chamado": o dropdown de categorias deve carregar (do cache).

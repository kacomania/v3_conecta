# Relatório de Encerramento — Sprint 29: Offline-First Parcial

**Data de Conclusão:** 10 de Junho de 2026
**Engenheiro Executante:** Dibro (Agente IA)
**Tech Lead:** Jang

---

## 1. Resumo Executivo

A Sprint 29 teve como objetivo inicial a implementação de um fluxo **Offline-First** para a criação de chamados (ocorrências) no aplicativo mobile. Durante a execução, foram integradas soluções de persistência local utilizando `sqflite` e detecção de conectividade em tempo real.

Entretanto, durante as fases de testes, identificou-se um impedimento de usabilidade relacionado à autenticação (Login sem internet) e à sincronização da base de dados de categorias e prefeituras. Para contornar parte do problema, foi implementada uma estrutura de **Lazy Cache** em SQLite. 

Ao final da Sprint, após deliberação técnica, o **Tech Lead decidiu abortar o recurso offline para a criação de novos chamados**. O app manterá o funcionamento online tradicional para abertura de ocorrências, porém se beneficia da infraestrutura de cache local (Lazy Cache) já implantada para otimizar o carregamento de prefeituras e categorias na interface.

---

## 2. Blueprint (Arquitetura)

### Infraestrutura Criada e Mantida
Embora o fluxo de salvamento de chamados offline tenha sido revertido na UI, a base arquitetural para suporte a dados offlines e sincronização foi estruturada de acordo com a Clean Architecture e Riverpod:

*   **LocalDatabaseHelper (SQLite):** Implementado no padrão Singleton (v2). O banco `conecta_offline.db` possui tabelas para fila de sincronização (`queued_occurrences`) e cache de dados transacionais rápidos (`cached_prefeituras`, `cached_categories`).
*   **Lazy Caching:** A estratégia de cache consiste em um carregamento "sujo". Ao tentar buscar prefeituras ou categorias no Supabase:
    *   **Sucesso de Rede:** Os dados frescos são retornados à UI e um processo assíncrono em background sobrescreve o cache no SQLite.
    *   **Falha de Rede:** O repositório engole o `SocketException` e lê silenciosamente a última versão gravada no SQLite, permitindo que a tela seja construída instantaneamente.
*   **SyncService:** Foi construído um motor de sincronização reativo usando `connectivity_plus` para gerenciar futuras filas assíncronas em background.

### Decisões Críticas
*   **Abolição do "Criar Chamado Offline":** A intercepção offline foi removida de `novo_chamado_page.dart`. A lógica de criação passa a ser estritamente Online para garantir validação imediata de protocolo e uso da IA (Vector Search).
*   **Sessão Auth Restrita:** A autenticação do `SupabaseAuth` exige que o primeiro login ocorra online. Offline, a sessão é apenas restaurada caso o usuário não tenha feito logout previamente.

---

## 3. Walkthrough (Log de Validação)

### Arquivos Modificados/Criados

| Caminho Relativo | Descrição | Status Final |
| :--- | :--- | :--- |
| `pubspec.yaml` | Adição de `sqflite` e `connectivity_plus`. | Aplicado |
| `lib/core/local_db/local_database_helper.dart` | Singleton do SQLite com suporte a tabelas de fila e caches `prefeituras` / `categories`. | Aplicado |
| `lib/data/services/supabase_tenant_service.dart` | Refatorado para tentar buscar prefeituras no backend; em caso de falha, carregar via `LocalDatabaseHelper`. | Aplicado |
| `lib/data/repositories/categoria_repository_impl.dart` | Refatorado para usar fallback do SQLite em caso de offline no fetch de categorias. | Aplicado |
| `lib/ui/novo_chamado/pages/novo_chamado_page.dart` | Intercepção offline foi implementada e, no fechamento da sprint, removida. O App agora valida ocorrências online. | Revertido (Parcial) |

### Testes Executados
*   **Análise Estática (`flutter analyze`):** O código final reportou `No issues found!`, atestando a qualidade das conversões de tipos no mapeamento do SQLite.
*   **Emulador (Cold Boot):** O banco SQLite (v2) inicializou corretamente, engatilhando o método `_onUpgrade` para criar as novas tabelas da feature de Lazy Cache.

### Conclusão e Próximos Passos
A Sprint encerra com o aplicativo possuindo resiliência de cache para dados de referência e sem o recurso problemático de criação offline. A ramificação (`feature/sprint-29-offline-first`) foi preparada para submissão e merge. O ecossistema está pronto para a Sprint 30.

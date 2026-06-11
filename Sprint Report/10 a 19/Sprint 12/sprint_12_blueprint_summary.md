# Sprint 12 Blueprint Summary

## Resumo de Arquitetura e Decisões
- **Integração Real-Time Data**: O aplicativo Flutter (`cidadao_conecta`) acessa diretamente a tabela `categories` do Supabase via Repositório, suportando a exibição e seleção dinâmica em `NovoChamadoPage`.
- **Governança Web**: Fluxo de Server Actions (Next.js) em `gestao_conecta` gerencia a criação de categorias em `/dashboard/categorias`, alimentando o dropdown do app mobile em tempo real.
- **Gerência de Estado**: Implementação sólida de `AsyncNotifier/FutureProvider` com Riverpod no `categoriesControllerProvider`, injetando de maneira fluída os AsyncValues na camada UI sem ferir a Clean Architecture.
- **Data Integrity**: Validada a passagem de dados UUID (`category_id`) limpos da View para a camada Repository, garantindo o Foreign Key Check da inserção em `occurrences`.

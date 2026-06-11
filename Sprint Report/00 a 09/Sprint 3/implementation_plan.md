# Implementation Plan - Sprint 3: Landing Page (Home Cidadão)

## 🎯 Objetivo
Construir a tela inicial do aplicativo para o Cidadão logado, exibindo saudação personalizada, atalhos de ações rápidas (Action Cards) e um grid de categorias de zeladoria/serviços.

## 🏗️ Decisões Arquiteturais (Clean Architecture)

### 1. Domain Layer (`lib/domain/`)
- **Entities**: Criar a entidade `Categoria` (id, nome, icone, descricao).
- **Interfaces**: Criar `CategoriaRepository` definindo o contrato para buscar as categorias vinculadas à prefeitura atual.

### 2. Data Layer (`lib/data/`)
- **Repositories**: Implementar `CategoriaRepositoryImpl` consumindo o Supabase. 
  - *Nota:* Se a tabela de categorias ainda não estiver populada no banco, o repositório deve retornar uma lista de categorias mockadas temporariamente para não bloquear a UI, mas a estrutura de chamada HTTP/Supabase já deve ficar preparada.

### 3. Presentation Layer (`lib/ui/`)
- **State Management (Riverpod 3.x)**: 
  - Criar um `HomeViewModel` estendendo `AsyncNotifier<HomeState>`.
  - O estado deve conter o nome do usuário logado (vindo do AuthRepository) e a lista de `Categoria` (vindo do CategoriaRepository).
- **Widgets**:
  - `GreetingHeader`: Widget puro exibindo "Olá, [Nome]" e o nome da Prefeitura.
  - `ActionCard`: Botão grande estilizado (ex: "Nova Solicitação", "Meus Chamados").
  - `CategoryGrid`: GridView exibindo as categorias disponíveis.
- **Pages**: `HomePage` que consome o `HomeViewModel` e monta o layout unindo os widgets acima, tratando os estados de `loading`, `error` e `data`.

## 🔀 Estratégia de Git (OBRIGATÓRIO)
- A Sprint deve ser isolada na branch: `feature/sprint-3-landing-page`.
- O fechamento da Sprint exige o uso das skills de commit e geração de relatório.
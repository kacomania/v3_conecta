# Implementation Plan - Sprint 34: Refinamentos de UX Mobile

## 🎯 Objetivo
Polir a experiência do usuário na Home Page do Cidadão Conecta. Otimizar a interface removendo redundâncias (Card de Perfil), protegendo ações destrutivas (Confirmação de Logout) e agilizando a abertura de chamados via atalhos de categoria pré-selecionados.

## 🏗️ Decisões Arquiteturais (Flutter & Riverpod)

### 1. UX da Landpage (Home)
- **Limpeza Visual:** O `ActionCard` de "Meu Perfil" será removido da grade principal, mantendo o acesso exclusivo pelo ícone da AppBar.
- **Grid de Categorias:** A lista consumida do `categoriesControllerProvider` sofrerá um `.take(4).toList()` na camada de UI para exibir apenas os 4 primeiros serviços como "Serviços Populares/Rápidos".

### 2. Proteção de Logout
- **Dialog de Confirmação:** O botão de saída (seja na AppBar da Home ou dentro do Meu Perfil) não chamará mais o `signOut` diretamente. Ele exibirá um `AlertDialog` nativo (Sim/Não). O método do repositório só será invocado após a confirmação explícita.

### 3. Pré-seleção de Categoria (State Management)
- **Fluxo de Atalho:** Ao clicar em um Card de Categoria na Home, a UI não apenas fará o push para a tela `/novo-chamado`. Antes de navegar, ela invocará o método do `NovoChamadoViewModel` (ou `RequestDraftController`) para atualizar o estado do rascunho injetando o `categoryId` e `categoryName`.
- **Dropdown Reativo:** Quando a `NovoChamadoPage` for renderizada, o Dropdown lerá o estado atual do Riverpod e já aparecerá com a categoria selecionada, poupando um clique do cidadão.

## 🔀 Estratégia de Git
- Branch: `feature/sprint-34-ux-refinements`.
- Fechamento padrão com `@commit` e `@gerando-relatorios-sprint.md`.
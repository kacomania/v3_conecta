# Implementation Plan - Sprint 4: Draft & Câmera

## 🎯 Objetivo
Construir a tela de "Nova Solicitação" baseada no design do Google Stitch. Implementar o formulário de dados (descrição, categoria, endereço) e a captura/seleção de fotos, mantendo o estado localmente em um "Draft" (rascunho) via Riverpod.

## 🏗️ Decisões Arquiteturais (Clean Architecture)

### 1. Domain Layer (`lib/domain/`)
- **Entities**: Criar `DraftSolicitacao` (id_categoria, descricao, endereco, lista_de_caminhos_das_fotos).

### 2. Presentation Layer (`lib/ui/`)
- **State Management (Riverpod 3.x)**: 
  - Criar um `NovoChamadoViewModel` estendendo `Notifier<DraftSolicitacao>` (ou `AsyncNotifier` se precisar carregar algo prévio). Ele será o responsável por validar os campos e adicionar/remover fotos da lista do rascunho.
- **Widgets**:
  - Formulário com validação.
  - Componente de captura de imagem (usando pacote `image_picker` ou `camera`).
  - Grid de preview das fotos anexadas.
- **Pages**: `NovoChamadoPage` que consome o ViewModel e constrói a tela guiada pelo design do Stitch.

## 🔀 Estratégia de Git
- Branch: `feature/sprint-4-draft-camera` (Continuaremos na mesma branch para agregar a feature de Registro, conforme solicitado).
- Fechamento padrão com `@commit` e `@gerando-relatorios-sprint.md`.

## 🆕 Adendo: Fluxo de Nova Conta (Cadastro)

### 1. Presentation Layer (`lib/ui/`)
- **Pages**: Criar `RegisterScreen` (`lib/ui/features/auth/screens/register_screen.dart`) com formulário para Nome, E-mail, Senha e Confirmação de Senha.
- **State Management**: Atualizar `AuthController` (se necessário) para incluir a função de `signUp(nome, email, password)`.

### 2. Infra Layer (`lib/infra/`)
- **Auth**: Garantir que o método de criação de conta esteja integrado com o Supabase (ou serviço de autenticação vigente).

### 3. Routing (`lib/routing/`)
- **Rotas**: Adicionar a rota `/register` (nome: `RouteNames.register`) no `app_router.dart` apontando para a `RegisterScreen`.

### 4. Validação
- O botão na `login_screen.dart` que faz `context.push('/register')` deverá abrir a nova tela.
- Após o cadastro com sucesso, o usuário deve ser redirecionado para o fluxo autenticado ou receber um aviso (dependendo do fluxo do Supabase, como confirmação de email).
# 🚀 Walkthrough: Gestão de Prefeituras e Secretarias

As alterações foram concluídas com sucesso. Abaixo está o resumo do que foi implementado na arquitetura do nosso projeto e no banco de dados.

## 🗄️ Alterações no Banco de Dados
- **Tabela `departments`**: Foi alterada via Supabase MCP para incluir a coluna `prefeitura_id UUID REFERENCES prefeituras(id)`. Isso resolve o problema estrutural e agora permite que cada secretaria pertença a uma prefeitura específica.

## 🛠️ Server Actions e Backend
- Criamos o arquivo `src/actions/configuracoes.ts` responsável por conter as funções de Server Actions exclusivas para este domínio de negócio.
- Foram implementados:
  - `getPrefeituras` e `createPrefeitura`
  - `getDepartmentsByPrefeitura` e `createDepartment`
- Todas as actions chamam `revalidatePath('/dashboard/configuracoes')` após mutações para manter a UI sempre atualizada, evitando o uso desnecessário de estado no cliente (React State) para cache.

## 🎨 UI e Componentização
- **Server Component (Página)**: Criamos a rota `src/app/(admin)/dashboard/configuracoes/page.tsx`. Ela é responsável por:
  1. Validar a sessão do usuário.
  2. Consultar a tabela `user_roles` para garantir que `access_level === 5` (SYSTEM_ADMIN).
  3. Buscar inicialmente as Prefeituras para SSR.
- **Client Component (Formulários)**: Para interatividade limpa e agradável, criamos o componente `ConfigManager` em `src/components/config-forms.tsx`. Ele possui dois cards:
  - Card para cadastro e listagem rápida de Prefeituras (com suporte a cor primária e secundária).
  - Card para selecionar uma Prefeitura e cadastrar/listar suas Secretarias vinculadas.

## 🧭 Navegação
- Alteramos a Sidebar em `layout.tsx`.
- O atalho genérico "Configurações" que antes tinha `#` agora aponta para `/dashboard/configuracoes`.
- Envolvemos o link em uma condicional rigorosa: só será renderizado na tela de usuários com `accessLevel >= 5`. 

## 🔍 Como Testar
Como o seu servidor de desenvolvimento (`npm run dev`) já está rodando:
1. Acesse **http://localhost:3000/dashboard/configuracoes** logado com um usuário `SYSTEM_ADMIN`.
2. Tente criar uma nova Prefeitura.
3. Em seguida, selecione a prefeitura recém criada e adicione algumas Secretarias (ex: "Saúde", "Obras").
4. Acesse com outro usuário e certifique-se de que a página retornará a view de "Acesso Negado".

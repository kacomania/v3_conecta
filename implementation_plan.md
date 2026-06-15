# Implementation Plan - Sprint 35: Theming Web e UX do Portal Administrativo

## 🎯 Objetivo
Melhorar a experiência de navegação do servidor no Portal Web (Next.js). Implementar a injeção dinâmica da Identidade Visual (White-Label) da Prefeitura (Cores e Logo), destacar a página ativa no menu lateral e padronizar os cabeçalhos das páginas.

## 🏗️ Decisões Arquiteturais (Next.js & Tailwind)

### 1. Theming Dinâmico (CSS Variables)
- **Desafio:** O Tailwind CSS gera as classes em tempo de build, então não podemos usar classes como `bg-[${dynamicColor}]`.
- **Solução:** O `layout.tsx` (Server Component) fará o fetch dos dados da tabela `prefeituras`. Ele injetará as cores no DOM usando *CSS Variables* inline (ex: `<body style={{ '--color-primary': prefeitura.primary_color }}>`).
- **Tailwind Config:** Atualizaremos o `tailwind.config.ts` para mapear a cor `primary` para a variável `var(--color-primary, #003B73)`.

### 2. Header e Logo
- O Layout administrativo passará a exibir o `logo_url` no topo da Sidebar, ao lado do nome do portal.
- Criação de um componente padrão `<PageHeader title="X" />` para ser reutilizado no topo de todas as rotas do `/dashboard`.

### 3. Sidebar Active State (Client Component)
- Para que o menu lateral saiba qual página está aberta, o componente de navegação precisa ter acesso ao hook `usePathname()` do Next.js.
- O bloco de links da Sidebar será extraído para um Client Component (`"use client"`), aplicando um estilo de destaque (ex: fundo com opacidade da cor primária e borda lateral) quando o `pathname` corresponder ao `href` do link.

## 🔀 Estratégia de Git
- Branch: `feature/sprint-35-web-ux-theming`.
- Fechamento padrão com `@commit` e `@gerando-relatorios-sprint.md`.
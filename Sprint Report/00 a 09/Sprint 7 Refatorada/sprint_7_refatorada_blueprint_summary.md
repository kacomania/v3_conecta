# Resumo do Blueprint - Sprint 7 Refatorada

## Componentes Atualizados
- **App Mobile (Flutter)**: A interface, repositório e roteamento foram completamente limpos de qualquer recurso administrativo (`/admin`).
- **Portal Web (Next.js)**: Novo projeto `gestao_conecta` foi iniciado na raiz do workspace.
- **Backend (Supabase)**: Compartilhamento mantido (chaves integradas no Next.js).

## Mudanças Arquiteturais
- Aplicação rigorosa da separação de UI/UX, isolando o `cidadao_conecta` como cliente exclusivo do cidadão, e o novo `gestao_conecta` servindo como Portal Web de administração da prefeitura e atendimento.

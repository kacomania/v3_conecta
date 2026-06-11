# Resumo de Implementação para o Blueprint — Sprint 9

Abaixo constam as integrações essenciais da Sprint 9 que devem ser refletidas no Blueprint arquitetural da aplicação web (`gestao_conecta`).

### 1. Nova Rota Dinâmica — `/dashboard/chamado/[id]`
- **Tipo:** Server Component com `export const dynamic = 'force-dynamic'`.
- **Localização:** `src/app/(admin)/dashboard/chamado/[id]/page.tsx`.
- **Data Fetching:** Realizado exclusivamente via Server Action `getChamadoDetails(id)`, que busca em paralelo a tabela `occurrences` (registro único) e a tabela `occurrence_timeline` (todos os registros relacionados, sem filtro de `is_public`).
- **Layout:** Grid responsivo (1 coluna mobile / 3 colunas desktop): coluna de detalhes (2/3) + coluna de gestão (1/3), seguida pela seção de Linha do Tempo em largura total.

### 2. Camada de Server Actions — `src/actions/chamados.ts`
- **Diretiva:** `"use server"` no topo do arquivo — todas as funções exportadas são Server Actions invocáveis por Client Components.
- **Instanciação do Supabase:** Via `createClient()` de `@/utils/supabase/server` (cookies SSR), garantindo que o RLS seja aplicado com a identidade do servidor logado em **todas** as operações de leitura e escrita.
- **Funções exportadas:**
  | Função | Tabela Afetada | Efeito |
  |---|---|---|
  | `getChamadoDetails(id)` | `occurrences` + `occurrence_timeline` | Leitura (SELECT) |
  | `updateStatus(formData)` | `occurrences` (UPDATE) + `occurrence_timeline` (INSERT) | Escrita + `revalidatePath` |
  | `addTimelineNote(formData)` | `occurrence_timeline` (INSERT) | Escrita + `revalidatePath` |

### 3. Padrão de Mutação com `revalidatePath`
- Após qualquer escrita (`updateStatus` ou `addTimelineNote`), `revalidatePath('/dashboard/chamado/[id]')` é chamado server-side.
- Isso invalida o cache da rota no Next.js, forçando uma nova renderização server-side com dados frescos do Supabase — sem necessidade de refresh manual pelo usuário.

### 4. Integração `occurrence_timeline` ↔ App Flutter
- O campo booleano `is_public` na tabela `occurrence_timeline` é o contrato de integração entre o Portal Web e o App Mobile:
  - `is_public = true` → nota visível para o cidadão na tela de Linha do Tempo (Sprint 6, `getTimelineForOccurrence` com `.eq('is_public', true)`).
  - `is_public = false` → nota restrita ao time interno de servidores, invisível no Flutter.
- Mudanças de status via `updateStatus` são sempre inseridas com `is_public = true` para rastreabilidade pública.

### 5. Novos Client Components Interativos
- **`StatusForm`** e **`NoteForm`** são `'use client'`, usando `useTransition` para invocar Server Actions de forma não-bloqueante com feedback de loading via spinner e mensagem de confirmação temporária.
- Padrão adotado: **formulário controlado + `useRef` para reset** após submissão bem-sucedida.

# Task List - Sprint 9: Gestão de Chamado (Web Portal)

- [x] **Task 01: Inicialização e Git**
  - Branch `feature/sprint-9-gestao-chamado-web` criada a partir de `feature/sprint-8-portal-web-dashboard`.
  - Trabalho exclusivo dentro da pasta `gestao_conecta/`.

- [x] **Task 02: Server Actions (Backend Logic)**
  - Criado `src/actions/chamados.ts` com a diretiva `"use server"`.
  - `getChamadoDetails(id)`: busca a ocorrência + toda a timeline.
  - `updateStatus(formData)`: atualiza `occurrences.status` + registra na `occurrence_timeline` + `revalidatePath`.
  - `addTimelineNote(formData)`: insere nota em `occurrence_timeline` com `is_public` controlado + `revalidatePath`.
  - Supabase instanciado via `createClient()` (cookies SSR) em todas as ações.

- [x] **Task 03: UI - Página de Detalhes**
  - Criada a rota `src/app/(admin)/dashboard/chamado/[id]/page.tsx`.
  - Layout com foto, título, badge de status, descrição, protocolo, data e galeria.

- [x] **Task 04: UI - Controles de Gestão**
  - `status-form.tsx`: Select com os 4 status + feedback visual de sucesso.
  - `note-form.tsx`: Textarea + Toggle público/interno + feedback visual.

- [x] **Task 05: Conexão e Testes**
  - Formulários vinculados às Server Actions via `useTransition`.
  - `revalidatePath` acionado após cada mutação.
  - Botão "Ver Detalhes →" da listagem linkado à rota `/dashboard/chamado/[id]`.
  - Build: `✓ Compiled successfully` — sem erros TypeScript.

- [ ] **Task 06: Encerramento da Sprint (OBRIGATÓRIO)** ← Aguardando validação do Jang
  - Volte para a raiz do workspace integrado.
  - Execute a skill `@commit`.
  - Execute a skill `@gerando-relatorios-sprint.md` para a pasta `Sprint Report/Sprint 9/`.
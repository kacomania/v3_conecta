# Task List - Sprint 15: Gestão Territorial e Evidências

- [x] **Task 01: Inicialização e Git**
  - Crie e mude para a branch: `git checkout -b feature/sprint-15-mapa-e-evidencias`.
  - Trabalhe dentro da pasta `gestao_conecta/`.

- [x] **Task 02: Configuração de Dependências do Mapa**
  - No terminal, dentro de `gestao_conecta/`, instale o Leaflet: `npm install leaflet react-leaflet` e as tipagens `npm install -D @types/leaflet`.
  - Adicione a folha de estilos do Leaflet no `layout.tsx` ou via importação no CSS global.

- [x] **Task 03: Upload de Evidência (Timeline UI)**
  - Atualize o componente `NoteForm` (`src/app/(admin)/dashboard/chamado/[id]/note-form.tsx`) para incluir um `<input type="file" accept="image/*" />`.

- [x] **Task 04: Upload de Evidência (Server Action)**
  - Atualize a função `addTimelineNote` em `src/actions/chamados.ts`.
  - Se um arquivo for enviado via `FormData`, faça o upload para o bucket `occurrences_media` gerando um nome único, obtenha a `publicUrl` e salve no campo `image_url` da `occurrence_timeline`.

- [x] **Task 05: Componente de Mapa (Client Component)**
  - Crie `src/components/map-view.tsx`.
  - Construa o mapa utilizando `MapContainer`, `TileLayer` e `Marker` do `react-leaflet`.
  - **Atenção:** Como o componente usa `window`, ele deve ser exportado com segurança ou importado dinamicamente por quem for usá-lo.

- [x] **Task 06: Rota de Gestão Territorial**
  - Crie `src/app/(admin)/dashboard/mapa/page.tsx`.
  - Faça o fetch das ocorrências que possuam lat/lng válidas.
  - Importe o componente `map-view.tsx` utilizando `dynamic(() => import('...'), { ssr: false })` para evitar erros de hidratação.
  - Adicione o link "Mapa" na Sidebar.

- [x] **Task 07: Encerramento da Sprint (OBRIGATÓRIO)**
  - Volte para a raiz do workspace integrado.
  - Execute a skill `@commit`.
  - Execute a skill `@gerando-relatorios-sprint.md` para a pasta `Sprint Report/Sprint 15/`.
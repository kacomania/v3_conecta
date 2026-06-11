# Implementation Plan - Sprint 15: Gestão Territorial e Evidências (Web Portal)

## 🎯 Objetivo
Prover visão geográfica das ocorrências no Portal Web através de um Mapa Interativo e habilitar o upload de imagens (evidências de resolução) pelos servidores na linha do tempo do chamado.

## 🏗️ Decisões Arquiteturais (Next.js & Supabase)

### 1. Upload de Imagens na Timeline (Server Actions)
- Modificar o formulário de `NoteForm` (em `/dashboard/chamado/[id]`) para aceitar arquivos de imagem.
- Atualizar a Server Action `addTimelineNote` em `src/actions/chamados.ts` para:
  1. Fazer o upload do arquivo no bucket `occurrences_media` do Supabase Storage.
  2. Recuperar a URL pública.
  3. Inserir o registro na tabela `occurrence_timeline` preenchendo a coluna `image_url`.

### 2. Gestão Territorial (Mapa no Next.js)
- **Biblioteca:** Utilizaremos `react-leaflet` e `leaflet` (mesma base do `flutter_map` que usamos no mobile, usando mapas gratuitos do OpenStreetMap, sem custo de API do Google).
- **Rota:** `src/app/(admin)/dashboard/mapa/page.tsx`.
- **Desafio SSR:** O Leaflet manipula o objeto `window` nativo do navegador. Portanto, o componente do mapa precisará ser carregado dinamicamente no Next.js com `ssr: false` usando `next/dynamic`.
- **Data Fetching:** O Server Component buscará as ocorrências (filtradas pelo `prefeitura_id`) que possuam `latitude` e `longitude` não nulas, repassando para o mapa plotar os "Pins".

## 🔀 Estratégia de Git
- Branch: `feature/sprint-15-mapa-e-evidencias`.
- Fechamento padrão com `@commit` e `@gerando-relatorios-sprint.md`.
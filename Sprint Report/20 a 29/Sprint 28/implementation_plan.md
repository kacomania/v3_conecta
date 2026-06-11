# Implementation Plan - Sprint 28: IA - Detecção de Duplicatas (Vector Search)

## 🎯 Objetivo
Prevenir a superlotação da fila de triagem identificando chamados duplicados usando IA (Gemini) e `pgvector`. A busca utilizará um raio de 100 metros e 75% de similaridade semântica. O fluxo mobile será atualizado com modais interativos e transparentes para o cidadão.

## 🏗️ Decisões Arquiteturais

### 1. Banco de Dados (Supabase + pgvector)
- **Extensão:** Habilitar `vector`. Adicionar `embedding vector(768)` e `supporters_count INT DEFAULT 0` em `occurrences`.
- **Tabela de Apoio:** `occurrence_supporters` (`user_id`, `occurrence_id`).
- **RPC `match_occurrences`:** Recebe o vetor da IA, Latitude e Longitude. Filtra por: Mesma prefeitura, Status Ativo, **Distância geográfica <= 100 metros** (usando fórmula de Haversine nativa no SQL) e **Similaridade de Cosseno >= 0.75**.

### 2. Backend Serverless (Edge Functions)
- **Edge Function `find-duplicates`:** Recebe o texto e coordenadas, gera o vetor via Gemini API e consome a RPC `match_occurrences`.

### 3. App Mobile (Flutter - `cidadao_conecta`)
- **UX de Loading:** Ao enviar, exibir um Dialog bloqueante: *"Analisando relato... Isso pode levar em média 30 segundos."*
- **UX de Match:** Se a Edge Function retornar resultados, trocar o dialog por um Widget listando os protocolos/títulos encontrados. Botões: "Apoiar este chamado" ou "Ignorar e abrir novo".
- **UX de Sucesso:** Pop-up final (Dialog) contendo o Protocolo Gerado, um botão de "Copiar" (para a área de transferência) e um botão "OK" que fecha o modal e retorna à Home.

## 🔀 Estratégia de Git
- Branch: `feature/sprint-28-ia-duplicatas`.
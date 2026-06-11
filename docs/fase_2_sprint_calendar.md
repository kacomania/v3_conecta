# 📅 Calendário de Sprints - Fase 2 (Expansão Enterprise, IA & QA)

Este calendário define o roadmap de evolução tecnológica do ecossistema Conecta V3, partindo da Sprint 25. O objetivo é escalar a plataforma com funcionalidades de alta complexidade (IA, Offline, Integrações, Push) e blindar o código com testes automatizados para produção.

---

## 🚀 Épico 1: Comunicação Ativa & Engajamento

### Sprint 25: Notificações Push Nativas (OS Level)
- **Objetivo:** Acordar o celular do cidadão com notificações reais (FCM/APNs) sempre que o chamado dele for atualizado.
- **Backend (Supabase):** Tabela `user_devices` e Edge Function que escuta a tabela `notifications` disparando o Push via Firebase.
- **Mobile (Flutter):** Integração do `firebase_messaging`.

### Sprint 26: Módulo de Comunicados Oficiais (Defesa Civil)
- **Objetivo:** Prefeitura envia alertas em massa (Enchentes, Vacinação) para a população.
- **Backend:** Tabela `announcements`.
- **Web (Next.js):** Rota `/dashboard/comunicados` com editor Rich Text para disparos.
- **Mobile (Flutter):** Aba "Avisos" recebendo os alertas com Push Notification.

---

## 🧠 Épico 2: Inteligência Artificial (Supabase + LLMs)

### Sprint 27: IA - Análise de Sentimento no CSAT
- **Objetivo:** Classificar automaticamente as avaliações da população (Positivo, Neutro, Negativo).
- **Backend:** Edge Function conectada ao Gemini/OpenAI engatilhada ao receber um `feedback_notes`.
- **Web (Next.js):** Gráfico de "Humor da População" no Dashboard de Satisfação.

### Sprint 28: IA - Detecção de Duplicatas (Vector Search)
- **Objetivo:** Impedir chamados repetidos para o mesmo problema na mesma rua.
- **Backend:** `pgvector` gera embeddings (vetores) da descrição + GPS do chamado.
- **Mobile (Flutter):** Antes de enviar, o app sugere "Apoiar" um chamado similar existente num raio próximo.

---

## 🌍 Épico 3: Resiliência & Integração Legada

### Sprint 29: Modo "Offline-First" no App Mobile
- **Objetivo:** Fiscais e cidadãos registram problemas mesmo sem internet.
- **Mobile (Flutter):** Banco de dados local (`sqflite` ou `Isar`). Status `QUEUED` para chamados.
- **Mobile Sync:** Fila em background sincroniza fotos e dados com o Supabase silenciosamente ao recuperar conexão (`connectivity_plus`).

### Sprint 30: API Pública & Webhooks (Integração ERPs)
- **Objetivo:** Conectar o Gestão Conecta a sistemas de prefeituras (SAP, 1Doc, etc).
- **Backend:** Tabelas `api_keys` e `webhooks_endpoints`. Edge Function de despacho (HTTP POST).
- **Web (Next.js):** Painel de Desenvolvedores para gestão de tokens e endpoints.

---

## 🛡️ Épico 4: Blindagem e Qualidade (QA)

### Sprint 31: Cobertura de Testes Automatizados e QA Manual
- **Objetivo:** Garantir estabilidade, resiliência e evitar regressões antes do lançamento em produção.
- **Mobile (Flutter):** 
  - *Unit Tests* para ViewModels (Riverpod), Repositórios e Entidades (Mockito).
  - *Widget Tests* para componentes isolados (ex: `RatingWidget`, `TimelineWidget`).
- **Web (Next.js):** 
  - *Unit Tests* com Jest e React Testing Library para os Client Components.
  - *E2E Tests* (End-to-End) com Playwright ou Cypress simulando jornada de Triagem, Locking e CSAT.
- **QA Manual Cruzado:** Execução de roteiros de estresse completos (ex: Cidadão abre chamado offline -> Recupera sinal -> Sincroniza -> IA agrupa -> Atendente bloqueia -> Atualiza -> Push chega no celular bloqueado).
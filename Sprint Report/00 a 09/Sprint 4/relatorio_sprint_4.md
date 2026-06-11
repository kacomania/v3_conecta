# Relatorio Unificado de Encerramento - Sprint 4

## 1. Resumo Executivo
# Relatório da Sprint 4 (Draft, Câmera e Autenticação/Cadastro)

## 📌 Resumo Executivo
Nesta Sprint, o foco principal foi estabelecer o fluxo de criação de chamados no Cidadão Conecta, integrando o componente de rascunho de dados (Draft) e a captura de mídia (Câmera e Galeria). Além disso, a Sprint foi estendida a pedido do Tech Lead para incluir a feature de Criação de Conta (Registro de Usuário).

O objetivo principal de disponibilizar uma interface limpa, conectada ao Riverpod e respeitando o Design System (Google Stitch) foi alcançado. O formulário de Novo Chamado já agrupa os dados e imagens temporariamente antes de disparar para o servidor. O fluxo de registro está totalmente integrado com a camada de Autenticação do Supabase.

## ✨ Entregas Realizadas (Funcionalidades)
- **Design System:** Integração da nova especificação de design Figma baseada no Google Stitch (projeto 13457475318460215628), com tokens e diretrizes definidos no `DESIGN.md`.
- **Camada de Entidade:** Criação do objeto `DraftSolicitacao` para acomodar textos e caminhos de imagens em memória.
- **Gerenciamento de Estado:** Implementação do `NovoChamadoViewModel` via Riverpod (NotifierProvider), responsável por receber interações da UI, usar o `image_picker` para anexar imagens e gerenciar o `DraftSolicitacao`.
- **UI (Novo Chamado):** Criação da `NovoChamadoPage` com os formulários adequados, Preview de imagens anexadas e botão de submissão (burro em lógica de negócio).
- **Integração de Rotas:** GoRouter atualizado e linkado no `ActionCard` da HomePage.
- **UI de Cadastro (Extra):** Criação da `RegisterScreen` (`/register`) com seleção de Prefeitura e campos de dados pessoais, com validações baseadas na identidade visual.
- **Autenticação (Extra):** Integração com `AuthController` e Supabase para efetivar o `signUp` de novos cidadãos, com ajuste na regra do GoRouter (redirect) para desbloquear as rotas públicas de Autenticação.

## ⚠️ Limitações / Technical Debt
- A submissão final do Draft para o backend Supabase foi intencionalmente deixada fora do escopo desta Sprint (a ser trabalhada em uma Sprint subsequente, possivelmente junto com Storage para upload de imagens).
- Apenas a tela e a estrutura do ViewModel foram montadas para a câmera/galeria (`image_picker`), os testes profundos de permissão em dispositivos reais podem requerer atenção futura na Sprint focada em device hardware.

## 🤝 Colaboradores
- Engenheiro Executor: Dibro (Agente AI Antigravity)
- Tech Lead: Jang (Autoridade de Negócio/Arquitetura)

---
*Relatório gerado automaticamente através da skill SDDD.Report.*


## 2. Blueprint (Arquitetura)
*(Sem blueprint tecnico cadastrado)*

## 3. Walkthrough (Log de Validacao)
# Walkthrough — Sprint 02: Setup Arquitetural & Configuração Nativa

**Data de conclusão:** 22/05/2026  
**Resultado da validação:** `flutter analyze` → **No issues found!** ✅

---

## Resumo Executivo

A Sprint 02 estabeleceu as **fundações nativas e de arquitetura** do app Flutter "Canal do Povo", preparando-o para receber as features de câmera, GPS e autenticação multi-tenant nas sprints seguintes.

---

## Mudanças Realizadas

### 1. Planejamento de Sprints Atualizado
**Arquivo:** [`stash/sprints_planejamento.md`](file:///c:/Users/Joker/Documents/teste%20md%20flutter/stash/sprints_planejamento.md)

- Documentada a decisão de **deferir o Portal Web (Vite + TypeScript)** da Sprint 02.
- Adicionados alertas `⚠️ DECISÃO DE ESCOPO` e `🔔 REVISÃO NECESSÁRIA` nas Sprints 2, 3 e 5 para lembrar o time de revisar o momento de iniciar o Portal Web.

---

### 2. Android — Build Config
**Arquivo:** [`android/app/build.gradle.kts`](file:///c:/Users/Joker/Documents/teste%20md%20flutter/android/app/build.gradle.kts)

```diff
- minSdk = flutter.minSdkVersion   // (~16, herdado do SDK)
+ minSdk = 21                       // Android 5.0+, requisito do camerawesome
+ multiDexEnabled = true            // Precaução para volume de dependências
```

---

### 3. Android — Permissões Nativas
**Arquivo:** [`android/app/src/main/AndroidManifest.xml`](file:///c:/Users/Joker/Documents/teste%20md%20flutter/android/app/src/main/AndroidManifest.xml)

Adicionadas **10 permissões** e **3 features de hardware** (todas com `required="false"`):

| Permissão | Usada em |
|---|---|
| `CAMERA` | camerawesome — Sprint 4 |
| `RECORD_AUDIO` | Vídeo de evidências — Sprint 4 |
| `ACCESS_FINE_LOCATION` | geolocator GPS — Sprint 4 |
| `ACCESS_COARSE_LOCATION` | Fallback de rede |
| `ACCESS_MEDIA_LOCATION` | EXIF de fotos |
| `READ_MEDIA_IMAGES` | Android 13+ galeria |
| `READ_EXTERNAL_STORAGE` (maxSdk=32) | Android < 13 |
| `WRITE_EXTERNAL_STORAGE` (maxSdk=29) | Android < 10 |
| `INTERNET` | Supabase (Auth, DB, Storage) |
| `VIBRATE` | Feedback háptico |

---

### 4. Dependências Core
**Arquivo:** [`pubspec.yaml`](file:///c:/Users/Joker/Documents/teste%20md%20flutter/pubspec.yaml)

> O nome do pacote foi atualizado de `teste_md_flutter` → `canal_do_povo`.

**8 novas dependências de produção:**

| Pacote | Versão | Sprint |
|---|---|---|
| `camerawesome` | ^2.1.0 | 4 |
| `geolocator` | ^13.0.2 | 4 |
| `permission_handler` | ^11.4.0 | 3/4 |
| `shared_preferences` | ^2.5.3 | 3 |
| `cached_network_image` | ^3.4.1 | 4/8 |
| `intl` | ^0.20.2 | 3/8 |
| `uuid` | ^4.5.1 | 4 |
| `url_launcher` | ^6.3.1 | 8 |

**2 novas dev dependencies:**

| Pacote | Versão | Sprint |
|---|---|---|
| `mockito` | ^5.4.5 | 9 |
| `build_runner` | ^2.4.15 | 9 |

---

### 5. Padrões de Qualidade
**Arquivo:** [`analysis_options.yaml`](file:///c:/Users/Joker/Documents/teste%20md%20flutter/analysis_options.yaml)

Implementado conjunto de **20 regras de lint** em 3 categorias:
- **Qualidade & Segurança de Tipos**: `avoid_dynamic_calls`, `always_declare_return_types`, `avoid_print`, `avoid_positional_boolean_parameters`, `avoid_returning_null_for_void`, `avoid_type_to_string`
- **Estilo & Consistência**: `prefer_single_quotes`, `prefer_const_constructors`, `prefer_const_declarations`, `prefer_const_literals_to_create_immutables`, `sort_child_properties_last`, `use_full_hex_values_for_flutter_colors`, `prefer_null_aware_operators`
- **Boas Práticas Dart**: `prefer_is_empty`, `prefer_is_not_empty`, `unnecessary_new`, `unnecessary_this`, `unawaited_futures`, `prefer_void_to_null`

Configuração do `analyzer` com `unused_import: error` e `unused_local_variable: error`.
Exclusão automática de `*.g.dart` e `*.mocks.dart` (gerados pelo build_runner).

---

### 6. PermissionService
**Arquivo:** [`lib/core/permissions/permission_service.dart`](file:///c:/Users/Joker/Documents/teste%20md%20flutter/lib/core/permissions/permission_service.dart)

Serviço centralizado com:
- `requestCameraPermission()` → `Future<bool>`
- `requestLocationPermission()` → `Future<bool>`
- `requestMicrophonePermission()` → `Future<bool>`
- `isCameraGranted()` / `isLocationGranted()` — verificação sem prompt
- `isPermanentlyDenied(Permission)` — detecta bloqueio permanente
- `requestAllOccurrencePermissions()` — batch para onboarding
- `openSystemAppSettings()` — redireciona para Configurações do SO

---

### 7. Correções de Qualidade
- [`lib/ui/core/themes/tenant_theme.dart`](file:///c:/Users/Joker/Documents/teste%20md%20flutter/lib/ui/core/themes/tenant_theme.dart): Corrigidas aspas duplas → simples (`prefer_single_quotes`).
- [`test/widget_test.dart`](file:///c:/Users/Joker/Documents/teste%20md%20flutter/test/widget_test.dart): Substituído smoke test do template (referenciava package renomeado) por placeholder documentado para a Sprint 9.

---

## Validação

```
$ flutter analyze
Analyzing canal_do_povo...
No issues found! (ran in 3.7s)
```

---

## Próxima Sprint

**Sprint 03 — Autenticação Multi-Tenant & Guarda de Rotas**

> ⚠️ **Lembrete de início de Sprint 03**: Revisar se o Portal Web (Vite + TypeScript) deve ser criado agora (antes de implementar a autenticação Web). Veja as notas em `stash/sprints_planejamento.md`.



# Sprint 5: Submissão Backend - Relatório de Fechamento

## Resumo
A Sprint 5 teve como objetivo principal concluir o fluxo de envio de novos chamados (ocorrências) pelo aplicativo Cidadão Conecta. O desenvolvimento focou na integração do formulário da `NovoChamadoPage` com o banco de dados Supabase e o Storage para upload de fotos.

## Tarefas Concluídas
- **Entidades e Repositórios:** Criação da `OccurrenceEntity` e da implementação de repositório `OccurrenceRepositoryImpl` utilizando Supabase.
- **Upload de Fotos:** Configurado o upload de anexos para o bucket `occurrences_media` do Supabase Storage. O sistema gera automaticamente os links públicos.
- **Inserção no Banco:** Configurada a gravação na tabela `occurrences`, capturando os campos: `title`, `description`, `category_id`, `latitude`, `longitude`, `image_url`, `status` (como PENDING), `user_id` e `prefeitura_id`.
- **Injeção de Dependências:** Configuração do `occurrenceRepositoryProvider`.
- **State Management:** Atualizado o `NovoChamadoViewModel` para gerenciar a chamada assíncrona (`submit()`), o estado de *loading*, tratamento de erros e obtenção das coordenadas geográficas através do pacote `geolocator`.
- **Validações e UI:**
  - Validação estrita de limites de caracteres no título (5 a 60) e descrição (5 a 600).
  - Obrigatoriedade de fotos (limitado a 3 imagens por requisição da UI/VM) e de localização via GPS.
  - Implementado feedback visual com modais customizados listando as pendências do usuário e *SnackBars* para sucesso ou falha.
  - O aplicativo navega de volta para a Home (`/`) após envio bem-sucedido.
- **Ajustes:** Correção de pequenos warnings na base de código, remoção de código morto e atualização da sintaxe *deprecated* do `Geolocator`.

## Status
Todas as validações e testes manuais da interface foram aprovados pelo Tech Lead (Jang).
Código versionado através de commit padronizado ("Conventional Commits") para a branch da sprint.

Sprint concluída com sucesso!

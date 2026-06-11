# Relatorio Unificado de Encerramento - Sprint 15

## 1. Resumo Executivo
# Relatório da Sprint 15: Gestão Territorial e Evidências

## 1. Resumo Executivo
A Sprint 15 teve como objetivo principal a implementação da aba de "Gestão Territorial" (Mapa) no portal administrativo e o aprimoramento da funcionalidade de anexação de evidências nas ocorrências (Timeline). Todas as tarefas previstas no escopo foram concluídas com sucesso. Além disso, melhorias não planejadas foram identificadas e aplicadas durante os testes manuais de QA, garantindo maior estabilidade, usabilidade e robustez.

## 2. Tarefas Concluídas
- **Task 01**: Inicialização da branch `feature/sprint-15-mapa-e-evidencias`.
- **Task 02**: Configuração do Leaflet no `gestao_conecta` (Portal Next.js).
- **Task 03 e 04**: Implementação da Interface e Server Actions para upload de evidência na Timeline para o bucket `occurrences_media`.
- **Task 05 e 06**: Criação do Componente Cliente do Mapa com marcadores dinâmicos, integrado na nova rota `/dashboard/mapa`.
- **Task 07**: Encerramento e geração de relatórios.

## 3. Melhorias Adicionais Realizadas (Identificadas no QA)
Durante o QA e alinhamento com o Tech Lead (Jang), os seguintes ajustes foram realizados além do plano original:
- **Correção de Crash de SSR do React-Leaflet**: O componente `<MapView />` causava erros no build do Next.js por requerer acesso ao objeto `window`. Isso foi contornado através da criação do `<MapWrapper />` configurado com import dinâmico (`ssr: false`).
- **Pré-Visualização da Evidência em Modal (Portal)**: Na aba do chamado do Portal, foi inserida a renderização da evidência da timeline por meio do `<ImageModal />`. Agora, o gestor pode ver uma miniatura da imagem anexada e clicar para expandi-la num modal flutuante.
- **Renderização da Imagem no App (Flutter)**: O arquivo `timeline_widget.dart` do app foi atualizado para consumir e exibir as imagens atreladas as entradas na linha do tempo.
- **Painel Resumo no Mapa**: Adição de contadores no cabeçalho do mapa de calor. O sistema exibe o total geral de ocorrências, acompanhado de contadores parciais agrupados pelo nome da prefeitura.
- **Pins de Mapa Personalizados (Dashboard)**: Os marcadores azuis genéricos do Leaflet foram trocados por *dot pins* circulares estilizados. A cor do marcador no mapa corresponde à `primary_color` da Prefeitura, permitindo identificação visual intuitiva do lado do gestor.
- **Exibição do Protocolo no App com Botão Copiar**: A tela de detalhes do App do Cidadão teve sua *App Bar* melhorada para apresentar a palavra `Protocolo XYZ` com um ícone lateral que permite copiar o ID para a área de transferência do celular, complementado por um feedback de Sucesso (SnackBar).
- **Validação Robustecida de Upload**: Como prevenção ao teste "Arquivo Inválido" (onde foi submetido um PDF como imagem), implementamos:
  - Uma validação no **Servidor** na Server Action para abortar o insert se o arquivo não começar com `image/`.
  - Uma validação no **Cliente (Front-end)** para bloquear o upload antes do request. Em caso de arquivo inválido, a UI apresenta um aviso e zera apenas a seleção do campo "File", sem apagar o texto digitado na caixa de "Mensagem".


## 2. Blueprint (Arquitetura)
# Blueprint da Sprint 15: Gestão Territorial e Evidências

## Decisões Arquiteturais e Modelagem de Dados

### 1. Upload de Imagem na Timeline (Server Action)
- O fluxo de envio do arquivo não utiliza APIs intermediárias. A `FormData` é capturada pelo **Server Action** e delegada ao Supabase Storage no bucket público `occurrences_media`.
- Apenas imagens são armazenadas no banco. Se o tipo não for `image/*` (ex: PDF ou documentos), o Server Action barra o upload.
- O campo `image_url` é gravado na tabela `occurrence_timeline`.

### 2. Contorno do Window Object (Next.js SSR vs Leaflet)
- Como o `react-leaflet` precisa de acesso às APIs do Browser (DOM/Window) logo na injeção, usar `ssr: false` dentro de um Server Component diretamente se tornou uma violação restrita no Next.js 15+.
- **Padrão de Wrapper**: Adotamos o padrão de "Cliente Wrapper". Foi criado o `MapWrapper` com a diretiva `'use client'` sendo responsável por importar e injetar o `MapView` dinamicamente. O `page.tsx` continua com Server Side rendering nativo, fazendo os fetches das ocorrências limpos.

### 3. Marcadores de Mapa Agrupados
- O `OccurrenceDetail` foi tipado para incluir dados unificados de `prefeituras`, recuperados do banco utilizando os relacionamentos automáticos do Supabase: `select('*, prefeituras(name, primary_color)')`.
- Os ícones (`L.divIcon`) do mapa renderizam estilos CSS inline dinâmicos, usando o `primary_color` da prefeitura amarrada à ocorrência, simplificando a infraestrutura de imagens estáticas.

### 4. Client-side state na Timeline
- O input de arquivo sofreu uma validação de duplo nível (Client + Server). Utilizou-se o método de manipulação de Ref (`formRef.current.querySelector('input')`) no formulário Next.js (que roda `useTransition`) para conseguir redefinir/limpar o campo de seleção de arquivo (`fileInput.value = ''`) caso ocorra um erro de validação. Isso não apaga o State interno do componente da Timeline, preservando o descritivo de texto que o usuário preencheu.


## 3. Walkthrough (Log de Validacao)
*(Sem walkthrough registrado no ambiente para esta sprint)*


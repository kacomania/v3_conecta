---
description: Abre o emulador Android (Cold Boot) e executa o aplicativo Flutter usando o Dart MCP Server.
---

Dibro, siga este checklist para rodar nosso aplicativo de forma resiliente, evitando problemas de terminal preso e crash de snapshot:

1. **Checar / Iniciar o Emulador (Cold Boot):**
   Verifique se o emulador já está ativo (usando `adb devices` ou `flutter devices`). Se não houver nenhum emulador rodando, inicie o emulador padrão ignorando os snapshots (para evitar crashes). Você pode usar o terminal para rodar o executável do emulador diretamente com a flag `-no-snapshot` (ex: `emulator.exe -avd <nome_do_emulador> -no-snapshot` ou o comando do android-cli). Aguarde até que o `adb devices` reconheça o dispositivo.

2. **Verificar se o App já está rodando (Dart VM):**
   Não use o comando `flutter run` no terminal. Em vez disso, utilize a ferramenta `list_running_apps` do **Dart MCP Server**. Se o app já estiver rodando (você receberá a URL do Dart VM Service), apenas avise ao usuário que ele já está ativo. Caso o usuário peça atualização, utilize as ferramentas `hot_reload` ou `hot_restart` do MCP.

3. **Iniciar o App (se necessário):**
   Se o app não estiver na lista de aplicativos em execução, inicie-o utilizando a ferramenta `launch_app` do **Dart MCP Server**, passando a URI raiz do projeto (`e:\V3_conecta\cidadao_conecta`). Capture qualquer erro para analisarmos. Se rodar com sucesso, me avise.
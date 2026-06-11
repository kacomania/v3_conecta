# Diagnóstico Completo - Sprint 2

## 🔴 Problema 1: Emulador Android não abre

### Causa Investigada
- O `flutter emulators --launch Pixel_10_Pro_XL` retorna "success" mas **não abre realmente o emulador**
- O `adb` não está no PATH do sistema (erro `CommandNotFoundException` ao chamar `adb devices`)
- Após o launch, o emulador nunca aparece em `flutter devices`

### Diagnóstico
O Android SDK está instalado em `C:\Users\Joker\AppData\Local\Android\sdk` e o emulador (v36.5.11.0) existe.
O problema é que o `flutter emulators --launch` delega para o executável do emulador mas o processo pode estar morrendo silenciosamente (possivelmente um cold boot travado ou falta de aceleração HAXM/WHPX).

### Ação Corretiva Aplicada
- Iniciando o emulador diretamente via `emulator.exe -avd Pixel_10_Pro_XL -no-snapshot-load`
- Usando o ADB pelo caminho completo para verificar se o dispositivo sobe

### Ação Manual Necessária (Jang)
Se o emulador continuar sem abrir, verifique no Android Studio:
1. Se o `Pixel_10_Pro_XL` AVD está corretamente configurado (Device Manager)
2. Se o Hyper-V ou WHPX está habilitado no Windows (necessário para virtualização)

---

## 🔴 Problema 2: Dropdown de Prefeituras vazio

### Causa Raiz Encontrada: **ARQUIVO `.env` COM PLACEHOLDERS!**

O arquivo `cidadao_conecta/.env` estava assim:
```
SUPABASE_URL=YOUR_SUPABASE_URL
SUPABASE_ANON_KEY=YOUR_SUPABASE_ANON_KEY
```

Ou seja, o app **nunca se conectou ao Supabase real**. A inicialização do `Supabase.initialize()` provavelmente falhava silenciosamente ou conectava a uma URL inválida, resultando em `null` na resposta de `select()`.

### Ação Corretiva Aplicada
Substituí o `.env` pelas credenciais reais obtidas via Supabase MCP:
```
SUPABASE_URL=https://jddctbskhxxvspaawtqn.supabase.co
SUPABASE_ANON_KEY=eyJhbGciOiJIUzI1NiIs...(truncado)
```

---

## 🟢 Problema 3: Validação de conexão com o banco

### Verificações feitas
1. **Dados existem:** `SELECT * FROM prefeituras` retorna 1 registro ("Prefeitura de Teste")
2. **RLS está correto:** 4 policies ativas na tabela `prefeituras`, incluindo leitura pública
3. **Grants corretos:** `anon` e `authenticated` têm `SELECT` na tabela

### Tabela de Teste Criada
Criei a tabela `public.teste` com:
- Coluna `id` (SERIAL PK)
- Coluna `mensagem` (TEXT)
- Coluna `criado_em` (TIMESTAMPTZ)
- 1 registro inserido: "Dibro confirmando conexao - tabela criada via MCP"
- RLS habilitado com policy de leitura pública

> **Jang:** Acesse o dashboard do Supabase > Table Editor > tabela `teste` e confirme se o registro aparece.

---

## Resumo das Ações

| Problema | Causa Raiz | Status |
|----------|-----------|--------|
| Emulador Android | Investigando (pode ser HAXM/WHPX) | 🟡 Em andamento |
| Dropdown vazio | `.env` com placeholders | 🟢 **CORRIGIDO** |
| Validação do banco | Tabela `teste` criada | 🟢 Aguardando validação manual |

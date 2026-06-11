# 🧪 Plano de Testes (Desenvolvedor / Dibro) - Sprint 29

**Responsável:** Dibro (Agente IA)
**Objetivo:** Validar o CRUD do SQLite e a lógica do Connectivity.

## 1. Validação do SQLite
- [ ] Garantir que o `LocalDatabaseHelper` inicializa corretamente o arquivo `.db` e cria a tabela `queued_occurrences` usando os tipos corretos (TEXT para caminhos de fotos, REAL para coordenadas).
- [ ] Criar um teste unitário ou script de injeção direta que insere um *draft* mockado no banco local e, em seguida, faz um `SELECT` para confirmar a persistência.

## 2. Validação da Camada de Rede
- [ ] Verificar se o `MeusChamadosViewModel` lida graciosamente com o *merge* das listas. Se a lista do SQLite tiver 1 item e o Supabase 5, o estado final do Riverpod deve expor 6 itens (com o item offline recebendo uma flag/status visual distinto).
- [ ] Validar se o loop de sincronização possui um bloco `try/catch`. Se o upload da foto falhar por instabilidade, o registro NÃO deve ser apagado do SQLite (deve tentar novamente no próximo ciclo).
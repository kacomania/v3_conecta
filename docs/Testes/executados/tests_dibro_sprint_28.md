# 🧪 Plano de Testes (Desenvolvedor / Dibro) - Sprint 28

**Responsável:** Dibro (Agente IA)
**Objetivo:** Validar o cálculo de Haversine, a distância vetorial e os fluxos de UI.

## 1. Validação de Banco de Dados (`pgvector` e Haversine)
- [ ] Inserir um chamado de teste no banco com uma coordenada GPS fixa e um vetor mockado.
- [ ] Executar a RPC `match_occurrences` passando a MESMA coordenada e o mesmo vetor. Deve retornar o chamado.
- [ ] Executar a RPC passando uma coordenada a 200 metros de distância (alterar levemente a lat/lng). **NÃO deve retornar o chamado** (validação do raio de 100m).
- [ ] Executar a RPC passando a mesma coordenada, mas um vetor oposto (similaridade < 0.75). **NÃO deve retornar o chamado**.

## 2. Validação Mobile (Mocking)
- [ ] Verificar se a UI do Flutter implementa corretamente o `Clipboard.setData` no botão de Copiar Protocolo, exibindo um SnackBar de "Protocolo copiado!".
- [ ] Confirmar se o Dialog de "Analisando relato..." bloqueia toques externos (barrierDismissible: false) para evitar que o cidadão envie o formulário duas vezes seguidas.
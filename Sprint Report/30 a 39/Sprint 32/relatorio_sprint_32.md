# Relatório de Sprint Unificado — Sprint 32: Documentação de API (Swagger)

**Data de Conclusão:** 11/06/2026
**Responsável:** Dibro (Engenheiro de Software Sênior)
**Status:** ✅ Concluída

---

## 1. Resumo Executivo

A Sprint 32 teve como foco principal fornecer uma documentação interativa e padronizada para a API Pública (M2M) do ecossistema Conecta V3. Essa iniciativa atende à necessidade das prefeituras de integrarem seus ERPs legados ao nosso portal para gerenciar ocorrências de zeladoria urbana de forma programática. 

**Entregas de Valor:**
- **Especificação OpenAPI 3.0:** Documentação clara dos endpoints, modelos (schemas) e mecanismos de segurança (ApiKeyAuth).
- **Swagger UI Interativo:** Uma interface visual no Portal do Desenvolvedor (restrita a administradores com acesso de nível técnico) que permite aos desenvolvedores das prefeituras explorar os recursos disponíveis.
- **Documentação de Webhooks (Outbound):** Esclarecimento sobre o formato do payload recebido pelas prefeituras sempre que um chamado é criado ou tem seu status alterado no Conecta.

---

## 2. Blueprint (Arquitetura e Decisões Técnicas)

As implementações desta Sprint focaram no projeto Next.js (Gestão Conecta) e adotaram as seguintes decisões:

- **Integração com Swagger:** Escolhemos o pacote `swagger-ui-react` para renderizar a especificação nativamente no React. Para mitigar o problema de incompatibilidade com SSR (Server-Side Rendering) e falhas no acesso a propriedades globais (como `window`), o componente foi encapsulado em um *Dynamic Import* (`ssr: false`).
- **Definição Estática vs Dinâmica:** A especificação OpenAPI foi declarada em um arquivo TypeScript estático (`src/lib/swagger-spec.ts`). Isso evita sobrecarga no tempo de requisição com a geração dinâmica do JSON, mantendo uma performance ideal no carregamento do portal.
- **Isolamento e Segurança (Multi-Tenancy):** A documentação da API reforça arquiteturalmente que as chaves de API (`x-api-key`) garantem que os ERPs apenas possam manipular ocorrências da sua própria prefeitura (`prefeitura_id`). Esta regra é baseada no endpoint implementado na Sprint 31.
- **Comunicação Outbound (Webhooks):** Em resposta às solicitações de acompanhamento de chamados (onde não faz sentido a prefeitura ficar fazendo *polling* na nossa base), o `WebhookPayload` com eventos de `INSERT` e `UPDATE` foi tipado e formalmente documentado na especificação OpenAPI, guiando o desenvolvedor externo a realizar o parsing adequado.

---

## 3. Walkthrough (Log de Validação)

### Modificações Técnicas:
1. **Branch Criada:** `feature/sprint-32-api-docs-swagger`
2. **Dependências:** `npm install swagger-ui-react` e `npm install -D @types/swagger-ui-react`
3. **Novo Arquivo:** `src/lib/swagger-spec.ts` contendo a especificação OpenAPI (endpoint `PATCH /api/v1/occurrences/{id}`, schemas e documentação do webhook).
4. **Nova Página:** `src/app/(admin)/dashboard/desenvolvedores/docs/page.tsx` para exibição do `SwaggerUI` em conjunto com um card explicativo sobre os Webhooks.
5. **Atualização UI:** O arquivo `DevelopersClient.tsx` no Portal do Desenvolvedor recebeu um novo card de navegação (call-to-action) para direcionar os administradores de prefeituras para a página de documentação da API.

### Processo de Validação (QA):
- ✅ **Build de Produção:** Comando `npx next build` executado sem erros (Compiled successfully em 7.1s).
- ✅ **Especificação OpenAPI:** O modelo atende às diretrizes 3.0.3 e detalha corretamente a autenticação `ApiKeyAuth`.
- ✅ **Renderização Web (Avisos Conhecidos):** O componente renderiza corretamente a interface do Swagger. Alertamos para as mensagens de console referentes ao uso de ciclos de vida depreciados no `ModelCollapse` e atributos de select. Esses *warnings* originam-se internamente da dependência `swagger-ui-react` (rodando em ambiente React 19/Strict Mode) e não impactam a experiência final ou a funcionalidade do portal em ambiente de produção.
- ✅ **Integração de Links:** O link inserido no painel de desenvolvedores roteia adequadamente à documentação (verificada na lista de rotas geradas no Build).

---

A Sprint foi encerrada e o código com as devidas alterações de QA foi arquivado sob a branch do projeto para eventual *merge* / deploy contínuo.

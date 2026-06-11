# Task List - Sprint 32: Documentação de API (Swagger)

- [ ] **Task 01: Inicialização e Git**
  - Crie a branch: `git checkout -b feature/sprint-32-api-docs-swagger`.
  - Todo o trabalho será na pasta `gestao_conecta/`.

- [ ] **Task 02: Dependências do Swagger**
  - No terminal, instale o pacote: `npm install swagger-ui-react` e as tipagens `npm install -D @types/swagger-ui-react`.

- [ ] **Task 03: Especificação OpenAPI**
  - Crie o arquivo de definição (ex: `src/lib/swagger-spec.ts` ou `.json`).
  - Documente o endpoint `PATCH /api/v1/occurrences/{id}`.
  - Defina o esquema de segurança exigindo o header `x-api-key`.
  - Documente o formato do payload do Webhook (o que a prefeitura recebe quando um chamado é criado).

- [ ] **Task 04: UI do Swagger (Página)**
  - Crie a rota `src/app/(admin)/dashboard/desenvolvedores/docs/page.tsx`.
  - Importe e renderize o componente `<SwaggerUI spec={spec} />`.
  - Adicione um botão ou link na página principal de "Desenvolvedores" apontando para esta nova página de Documentação.

- [ ] **Task 05: Validação Interna do Dibro (Testes)**
  - Leia o arquivo `docs/tests_dibro_sprint_32.md`.
  - Execute o servidor local e verifique se a página do Swagger renderiza sem erros de CSS ou de hidratação.

- [ ] **Task 06: Encerramento da Sprint (OBRIGATÓRIO)**
  - Execute a skill `@commit` e `@gerando-relatorios-sprint.md` para a pasta `Sprint Report/Sprint 32/`.
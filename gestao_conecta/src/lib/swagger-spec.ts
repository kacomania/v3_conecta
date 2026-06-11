/**
 * Conecta V3 — Especificação OpenAPI 3.0
 *
 * Documenta a API Pública M2M (Machine-to-Machine) do sistema Conecta V3
 * para integração com ERPs legados de Prefeituras.
 *
 * Baseada no endpoint real: PATCH /api/v1/occurrences/{id}
 * Criada na Sprint 31 (Fundação M2M).
 */

export const swaggerSpec = {
  openapi: '3.0.3',
  info: {
    title: 'Conecta V3 — API Pública (M2M)',
    version: '1.0.0',
    description: `
## Visão Geral

A **API Pública do Conecta V3** permite que ERPs e sistemas legados de Prefeituras integrem-se ao ecossistema Conecta para gerenciar ocorrências (chamados) de zeladoria urbana de forma programática.

### Autenticação

Todas as requisições devem incluir o header \`x-api-key\` com uma chave de API válida. As chaves são geradas no **Portal do Desenvolvedor** (\`/dashboard/desenvolvedores\`) por administradores com \`access_level >= 4\`.

A chave é vinculada a uma **Prefeitura** (tenant). Isso garante que operações M2M respeitem o isolamento multi-tenant — uma chave só consegue alterar ocorrências da sua própria prefeitura.

### Segurança

- As chaves são armazenadas como **hashes SHA-256** no banco de dados. A chave original é exibida apenas no momento da criação.
- O servidor valida o hash da chave recebida contra a tabela \`api_keys\`.
- Tentativas com chaves inválidas retornam \`403 Forbidden\`.

### Webhook (Outbound)

O sistema dispara webhooks automaticamente quando ocorrências são **criadas** ou **atualizadas**. Veja a seção de Callbacks para o formato do payload.
    `,
    contact: {
      name: 'Equipe Conecta V3',
      email: 'dev@conectav3.com.br',
    },
    license: {
      name: 'Proprietário',
    },
  },
  servers: [
    {
      url: '{protocol}://{host}',
      description: 'Servidor da aplicação Gestão Conecta',
      variables: {
        protocol: {
          default: 'https',
          enum: ['https', 'http'],
        },
        host: {
          default: 'gestao-conecta.vercel.app',
          description: 'Hostname do ambiente (produção ou local)',
        },
      },
    },
  ],
  tags: [
    {
      name: 'Ocorrências',
      description: 'Operações de gerenciamento de ocorrências (chamados) de zeladoria urbana.',
    },
    {
      name: 'Webhooks',
      description: 'Documentação do payload enviado automaticamente pelo sistema quando ocorrências são criadas ou atualizadas.',
    },
  ],

  // ─── Segurança Global ───────────────────────────────────────────
  components: {
    securitySchemes: {
      ApiKeyAuth: {
        type: 'apiKey',
        in: 'header',
        name: 'x-api-key',
        description:
          'Chave de API gerada no Portal do Desenvolvedor. Formato: `sk_live_<48 caracteres hex>`. Exemplo: `sk_live_a1b2c3d4e5f6...`',
      },
    },
    schemas: {
      // ── Occurrence (recurso principal) ────────────────────────────
      Occurrence: {
        type: 'object',
        description: 'Representação completa de uma ocorrência de zeladoria urbana.',
        properties: {
          id: {
            type: 'string',
            format: 'uuid',
            description: 'Identificador único da ocorrência.',
            example: 'c3a1f5e2-4b6d-4e8f-9a2c-1d3e5f7a9b0c',
          },
          title: {
            type: 'string',
            description: 'Título resumido do problema reportado pelo cidadão.',
            example: 'Buraco na calçada da Rua XV',
          },
          description: {
            type: 'string',
            description: 'Descrição detalhada da ocorrência.',
            example: 'Buraco de aproximadamente 50cm de diâmetro na calçada, próximo ao número 123.',
          },
          status: {
            type: 'string',
            enum: ['PENDING', 'ANALYZING', 'IN_PROGRESS', 'COMPLETED'],
            description: 'Status atual do ciclo de vida da ocorrência.',
            example: 'IN_PROGRESS',
          },
          latitude: {
            type: 'number',
            format: 'double',
            nullable: true,
            description: 'Coordenada de latitude (GPS).',
            example: -25.4284,
          },
          longitude: {
            type: 'number',
            format: 'double',
            nullable: true,
            description: 'Coordenada de longitude (GPS).',
            example: -49.2733,
          },
          image_url: {
            type: 'string',
            format: 'uri',
            nullable: true,
            description: 'URL pública da foto de evidência (Supabase Storage).',
            example: 'https://xxx.supabase.co/storage/v1/object/public/occurrences_media/user123/photo.jpg',
          },
          user_id: {
            type: 'string',
            format: 'uuid',
            description: 'ID do cidadão que criou a ocorrência.',
          },
          category_id: {
            type: 'string',
            format: 'uuid',
            nullable: true,
            description: 'ID da categoria do problema.',
          },
          department_id: {
            type: 'string',
            format: 'uuid',
            nullable: true,
            description: 'ID do departamento responsável.',
          },
          prefeitura_id: {
            type: 'string',
            format: 'uuid',
            description: 'ID da prefeitura (tenant) proprietária da ocorrência.',
          },
          created_at: {
            type: 'string',
            format: 'date-time',
            description: 'Data/hora de criação (UTC).',
            example: '2026-06-10T14:30:00.000Z',
          },
        },
        required: ['id', 'title', 'description', 'status', 'user_id', 'prefeitura_id', 'created_at'],
      },

      // ── Request Body para PATCH ───────────────────────────────────
      UpdateOccurrenceRequest: {
        type: 'object',
        description: 'Corpo da requisição para atualizar o status de uma ocorrência.',
        required: ['status'],
        properties: {
          status: {
            type: 'string',
            enum: ['PENDING', 'ANALYZING', 'IN_PROGRESS', 'COMPLETED'],
            description: 'Novo status desejado para a ocorrência.',
            example: 'IN_PROGRESS',
          },
        },
      },

      // ── Resposta de Sucesso ───────────────────────────────────────
      UpdateOccurrenceResponse: {
        type: 'object',
        description: 'Resposta de sucesso ao atualizar uma ocorrência.',
        properties: {
          success: {
            type: 'boolean',
            example: true,
          },
          occurrence: {
            $ref: '#/components/schemas/Occurrence',
          },
        },
        required: ['success', 'occurrence'],
      },

      // ── Erros ─────────────────────────────────────────────────────
      ErrorResponse: {
        type: 'object',
        description: 'Formato padrão de resposta de erro.',
        properties: {
          error: {
            type: 'string',
            description: 'Mensagem descritiva do erro.',
            example: 'Missing x-api-key header',
          },
        },
        required: ['error'],
      },

      // ── Webhook Payload (Outbound) ────────────────────────────────
      WebhookPayload: {
        type: 'object',
        description: `
Payload enviado automaticamente pelo sistema ao endpoint de Webhook configurado pela prefeitura.

**Quando é disparado?**
- Quando uma nova ocorrência é **criada** (\`INSERT\`).
- Quando uma ocorrência é **atualizada** (\`UPDATE\`), por exemplo, mudança de status.

**Como configurar?**
O endpoint de recebimento é configurado no Portal do Desenvolvedor (\`/dashboard/desenvolvedores\`), na seção "Webhook Endpoint".

**Verificação de Assinatura:**
O payload é enviado via \`POST\` para a URL configurada. A prefeitura deve configurar um \`secret_token\` no portal para validar a origem das chamadas.
        `,
        properties: {
          type: {
            type: 'string',
            enum: ['INSERT', 'UPDATE'],
            description: 'Tipo da operação que disparou o webhook.',
            example: 'UPDATE',
          },
          table: {
            type: 'string',
            description: 'Nome da tabela de origem.',
            example: 'occurrences',
          },
          schema: {
            type: 'string',
            description: 'Schema do banco de dados.',
            example: 'public',
          },
          record: {
            $ref: '#/components/schemas/Occurrence',
            description: 'Estado atual (novo) do registro após a operação.',
          },
          old_record: {
            oneOf: [
              { $ref: '#/components/schemas/Occurrence' },
              { type: 'null' },
            ],
            description: 'Estado anterior do registro. Presente apenas em operações `UPDATE`. `null` para `INSERT`.',
          },
        },
        required: ['type', 'table', 'schema', 'record'],
      },
    },
  },

  // ─── Segurança Global ───────────────────────────────────────────
  security: [
    {
      ApiKeyAuth: [],
    },
  ],

  // ─── Paths ──────────────────────────────────────────────────────
  paths: {
    '/api/v1/occurrences/{id}': {
      patch: {
        tags: ['Ocorrências'],
        operationId: 'updateOccurrenceStatus',
        summary: 'Atualizar status de uma ocorrência',
        description: `
Atualiza o status de uma ocorrência específica. A ocorrência deve pertencer à mesma prefeitura vinculada à chave de API utilizada.

**Fluxo de validação:**
1. O header \`x-api-key\` é verificado.
2. O hash SHA-256 da chave é comparado com a tabela \`api_keys\`.
3. O \`prefeitura_id\` associado à chave é extraído.
4. A ocorrência é atualizada **somente se** pertencer à mesma prefeitura.

**Após a atualização:** Um Webhook é disparado automaticamente para o endpoint configurado pela prefeitura (se ativo), notificando a mudança de status.
        `,
        parameters: [
          {
            name: 'id',
            in: 'path',
            required: true,
            description: 'UUID da ocorrência a ser atualizada.',
            schema: {
              type: 'string',
              format: 'uuid',
            },
            example: 'c3a1f5e2-4b6d-4e8f-9a2c-1d3e5f7a9b0c',
          },
        ],
        requestBody: {
          required: true,
          content: {
            'application/json': {
              schema: {
                $ref: '#/components/schemas/UpdateOccurrenceRequest',
              },
              examples: {
                'Mover para Em Andamento': {
                  summary: 'Iniciar atendimento da ocorrência',
                  value: {
                    status: 'IN_PROGRESS',
                  },
                },
                'Concluir ocorrência': {
                  summary: 'Marcar ocorrência como concluída',
                  value: {
                    status: 'COMPLETED',
                  },
                },
              },
            },
          },
        },
        responses: {
          '200': {
            description: 'Ocorrência atualizada com sucesso.',
            content: {
              'application/json': {
                schema: {
                  $ref: '#/components/schemas/UpdateOccurrenceResponse',
                },
                example: {
                  success: true,
                  occurrence: {
                    id: 'c3a1f5e2-4b6d-4e8f-9a2c-1d3e5f7a9b0c',
                    title: 'Buraco na calçada da Rua XV',
                    description: 'Buraco de aproximadamente 50cm de diâmetro.',
                    status: 'IN_PROGRESS',
                    latitude: -25.4284,
                    longitude: -49.2733,
                    image_url: 'https://xxx.supabase.co/storage/v1/object/public/occurrences_media/photo.jpg',
                    user_id: 'a1b2c3d4-e5f6-7890-abcd-ef1234567890',
                    category_id: 'f1e2d3c4-b5a6-7890-cdef-1234567890ab',
                    department_id: 'd1c2b3a4-e5f6-7890-abcd-ef1234567890',
                    prefeitura_id: 'b1a2c3d4-e5f6-7890-abcd-ef1234567890',
                    created_at: '2026-06-10T14:30:00.000Z',
                  },
                },
              },
            },
          },
          '400': {
            description: 'Requisição inválida — JSON malformado ou campo `status` ausente.',
            content: {
              'application/json': {
                schema: {
                  $ref: '#/components/schemas/ErrorResponse',
                },
                examples: {
                  'Campo ausente': {
                    value: { error: 'Missing status in body' },
                  },
                  'JSON inválido': {
                    value: { error: 'Invalid JSON body' },
                  },
                },
              },
            },
          },
          '401': {
            description: 'Não autorizado — header `x-api-key` ausente.',
            content: {
              'application/json': {
                schema: {
                  $ref: '#/components/schemas/ErrorResponse',
                },
                example: {
                  error: 'Missing x-api-key header',
                },
              },
            },
          },
          '403': {
            description: 'Proibido — chave de API inválida ou revogada.',
            content: {
              'application/json': {
                schema: {
                  $ref: '#/components/schemas/ErrorResponse',
                },
                example: {
                  error: 'Invalid API Key',
                },
              },
            },
          },
          '404': {
            description: 'Não encontrado — ocorrência não existe ou não pertence à prefeitura da chave.',
            content: {
              'application/json': {
                schema: {
                  $ref: '#/components/schemas/ErrorResponse',
                },
                example: {
                  error: 'Occurrence not found or access denied',
                },
              },
            },
          },
        },

        // ── Callbacks (Webhook Outbound) ──────────────────────────
        callbacks: {
          'onOccurrenceUpdated': {
            '{$request.body#/webhookUrl}': {
              post: {
                summary: 'Webhook Outbound — Notificação de mudança na ocorrência',
                description: `
Quando uma ocorrência é criada ou atualizada, o sistema dispara automaticamente um POST para o endpoint de Webhook configurado pela prefeitura.

**Endpoint configurável em:** Portal do Desenvolvedor > Webhook Endpoint

**Importante:** Este callback é disparado por um trigger no banco de dados (\`occurrences_webhook_dispatcher\`) e processado por uma Edge Function do Supabase. O payload segue o formato descrito abaixo.
                `,
                requestBody: {
                  required: true,
                  content: {
                    'application/json': {
                      schema: {
                        $ref: '#/components/schemas/WebhookPayload',
                      },
                      example: {
                        type: 'UPDATE',
                        table: 'occurrences',
                        schema: 'public',
                        record: {
                          id: 'c3a1f5e2-4b6d-4e8f-9a2c-1d3e5f7a9b0c',
                          title: 'Buraco na calçada da Rua XV',
                          description: 'Buraco de aproximadamente 50cm de diâmetro.',
                          status: 'IN_PROGRESS',
                          latitude: -25.4284,
                          longitude: -49.2733,
                          image_url: null,
                          user_id: 'a1b2c3d4-e5f6-7890-abcd-ef1234567890',
                          category_id: 'f1e2d3c4-b5a6-7890-cdef-1234567890ab',
                          department_id: 'd1c2b3a4-e5f6-7890-abcd-ef1234567890',
                          prefeitura_id: 'b1a2c3d4-e5f6-7890-abcd-ef1234567890',
                          created_at: '2026-06-10T14:30:00.000Z',
                        },
                        old_record: {
                          id: 'c3a1f5e2-4b6d-4e8f-9a2c-1d3e5f7a9b0c',
                          title: 'Buraco na calçada da Rua XV',
                          description: 'Buraco de aproximadamente 50cm de diâmetro.',
                          status: 'PENDING',
                          latitude: -25.4284,
                          longitude: -49.2733,
                          image_url: null,
                          user_id: 'a1b2c3d4-e5f6-7890-abcd-ef1234567890',
                          category_id: 'f1e2d3c4-b5a6-7890-cdef-1234567890ab',
                          department_id: 'd1c2b3a4-e5f6-7890-abcd-ef1234567890',
                          prefeitura_id: 'b1a2c3d4-e5f6-7890-abcd-ef1234567890',
                          created_at: '2026-06-10T14:30:00.000Z',
                        },
                      },
                    },
                  },
                },
                responses: {
                  '200': {
                    description: 'Webhook recebido com sucesso pelo sistema da prefeitura.',
                  },
                },
              },
            },
          },
        },
      },
    },
  },
} as const

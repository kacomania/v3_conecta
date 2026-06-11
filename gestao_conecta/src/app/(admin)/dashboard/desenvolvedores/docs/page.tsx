'use client'

import dynamic from 'next/dynamic'
import Link from 'next/link'
import 'swagger-ui-react/swagger-ui.css'
import { swaggerSpec } from '@/lib/swagger-spec'

// SwaggerUI usa APIs do browser (window), então precisa de import dinâmico com ssr: false
const SwaggerUI = dynamic(() => import('swagger-ui-react'), { ssr: false })

export default function ApiDocsPage() {
  return (
    <div className="space-y-6 max-w-6xl">
      {/* Header com breadcrumb */}
      <div className="flex items-center justify-between">
        <div>
          <div className="flex items-center gap-2 text-sm font-mono text-gray-500 mb-2">
            <Link
              href="/dashboard/desenvolvedores"
              className="hover:text-blue-400 transition-colors"
            >
              ← Portal do Desenvolvedor
            </Link>
            <span>/</span>
            <span className="text-gray-400">Documentação da API</span>
          </div>
          <h2 className="text-2xl font-mono font-bold text-gray-900 tracking-tight">
            Documentação da API (OpenAPI 3.0)
          </h2>
          <p className="text-gray-500 mt-1 font-mono text-sm">
            Referência completa da API Pública M2M do Conecta V3 para integrações com ERPs.
          </p>
        </div>
      </div>

      {/* Webhook Payload Info Card */}
      <div className="bg-gray-900 rounded-lg p-6 shadow-md border border-gray-800">
        <h3 className="text-lg font-mono font-semibold text-amber-400 mb-3">
          &gt; Payload do Webhook (Outbound)
        </h3>
        <p className="text-gray-400 font-mono text-sm mb-4">
          Quando uma ocorrência é <span className="text-green-400">criada</span> ou{' '}
          <span className="text-blue-400">atualizada</span>, o sistema envia automaticamente um{' '}
          <code className="text-amber-300 bg-gray-800 px-1 rounded">POST</code> para o endpoint de
          Webhook da sua prefeitura com o seguinte formato:
        </p>
        <div className="bg-gray-950 rounded p-4 overflow-x-auto">
          <pre className="text-green-300 font-mono text-xs leading-relaxed">
{`{
  "type": "UPDATE",          // "INSERT" | "UPDATE"
  "table": "occurrences",
  "schema": "public",
  "record": {                // Estado ATUAL do registro
    "id": "uuid",
    "title": "string",
    "description": "string",
    "status": "IN_PROGRESS", // PENDING | ANALYZING | IN_PROGRESS | COMPLETED
    "latitude": -25.4284,
    "longitude": -49.2733,
    "image_url": "string | null",
    "user_id": "uuid",
    "category_id": "uuid | null",
    "department_id": "uuid | null",
    "prefeitura_id": "uuid",
    "created_at": "2026-06-10T14:30:00.000Z"
  },
  "old_record": {            // Estado ANTERIOR (null em INSERT)
    "...mesmo formato de record..."
  }
}`}
          </pre>
        </div>
        <p className="text-gray-500 font-mono text-xs mt-3">
          💡 Configure o endpoint e o secret token no{' '}
          <Link href="/dashboard/desenvolvedores" className="text-blue-400 hover:underline">
            Portal do Desenvolvedor
          </Link>.
        </p>
      </div>

      {/* Swagger UI Container */}
      <div className="bg-white rounded-lg shadow-md border border-gray-200 overflow-hidden">
        <SwaggerUI spec={swaggerSpec} />
      </div>
    </div>
  )
}

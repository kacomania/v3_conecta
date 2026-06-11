'use client'

import { useState } from 'react'
import Link from 'next/link'
import { saveWebhook, generateApiKey, deleteApiKey } from '@/actions/developers'

export default function DevelopersClient({ initialWebhooks, initialApiKeys }: { initialWebhooks: any[], initialApiKeys: any[] }) {
  const [webhookUrl, setWebhookUrl] = useState(initialWebhooks[0]?.url || '')
  const [webhookSecret, setWebhookSecret] = useState(initialWebhooks[0]?.secret_token || '')
  const [webhookActive, setWebhookActive] = useState(initialWebhooks[0]?.is_active ?? true)
  const [newKeyName, setNewKeyName] = useState('')
  const [generatedKey, setGeneratedKey] = useState<string | null>(null)
  const [isLoadingWebhook, setIsLoadingWebhook] = useState(false)
  const [isLoadingKey, setIsLoadingKey] = useState(false)

  async function handleSaveWebhook(e: React.FormEvent) {
    e.preventDefault()
    setIsLoadingWebhook(true)
    const formData = new FormData()
    formData.append('url', webhookUrl)
    formData.append('secret_token', webhookSecret)
    formData.append('is_active', webhookActive.toString())
    try {
      await saveWebhook(formData)
      alert('Webhook salvo com sucesso!')
    } catch (err: any) {
      alert(err.message)
    }
    setIsLoadingWebhook(false)
  }

  async function handleGenerateKey(e: React.FormEvent) {
    e.preventDefault()
    setIsLoadingKey(true)
    const formData = new FormData()
    formData.append('name', newKeyName)
    try {
      const key = await generateApiKey(formData)
      setGeneratedKey(key)
      setNewKeyName('')
    } catch (err: any) {
      alert(err.message)
    }
    setIsLoadingKey(false)
  }

  async function handleDeleteKey(id: string) {
    if (!confirm('Deseja realmente revogar esta chave?')) return
    const formData = new FormData()
    formData.append('id', id)
    try {
      await deleteApiKey(formData)
    } catch (err: any) {
      alert(err.message)
    }
  }

  return (
    <div className="space-y-8 max-w-4xl">
      <div>
        <h2 className="text-2xl font-mono font-bold text-gray-900 tracking-tight">Portal do Desenvolvedor</h2>
        <p className="text-gray-500 mt-1 font-mono text-sm">Gerencie Webhooks e Chaves de API para integrações externas.</p>
      </div>

      {/* Card de Documentação da API */}
      <Link
        href="/dashboard/desenvolvedores/docs"
        className="block bg-gradient-to-r from-gray-900 to-gray-800 rounded-lg p-6 shadow-md border border-gray-700 hover:border-blue-500 transition-all group"
      >
        <div className="flex items-center justify-between">
          <div>
            <h3 className="text-lg font-mono font-semibold text-blue-400 mb-1">
              &gt; Documentação da API (OpenAPI 3.0)
            </h3>
            <p className="text-gray-400 font-mono text-sm">
              Referência interativa completa da API Pública M2M — endpoints, schemas, autenticação e webhooks.
            </p>
          </div>
          <span className="text-gray-500 group-hover:text-blue-400 transition-colors text-2xl font-mono">
            →
          </span>
        </div>
      </Link>

      <div className="bg-gray-900 rounded-lg p-6 shadow-md border border-gray-800">
        <h3 className="text-lg font-mono font-semibold text-green-400 mb-4">&gt; Webhook Endpoint</h3>
        <form onSubmit={handleSaveWebhook} className="space-y-4">
          <div>
            <label className="block text-sm font-mono text-gray-400 mb-1">Payload URL</label>
            <input 
              type="url" 
              required
              value={webhookUrl}
              onChange={(e) => setWebhookUrl(e.target.value)}
              className="w-full bg-gray-800 text-green-300 font-mono text-sm border border-gray-700 rounded p-2 focus:ring-green-500 focus:border-green-500 outline-none" 
              placeholder="https://api.prefeitura.gov.br/conecta-webhook"
            />
          </div>
          <div>
            <label className="block text-sm font-mono text-gray-400 mb-1">Secret Token (Assinatura)</label>
            <input 
              type="text" 
              required
              value={webhookSecret}
              onChange={(e) => setWebhookSecret(e.target.value)}
              className="w-full bg-gray-800 text-green-300 font-mono text-sm border border-gray-700 rounded p-2 focus:ring-green-500 focus:border-green-500 outline-none" 
              placeholder="secret_xyz123..."
            />
          </div>
          <div className="flex items-center gap-2">
            <input 
              type="checkbox" 
              id="webhookActive"
              checked={webhookActive}
              onChange={(e) => setWebhookActive(e.target.checked)}
              className="rounded bg-gray-800 border-gray-700 text-green-500 focus:ring-green-500"
            />
            <label htmlFor="webhookActive" className="text-sm font-mono text-gray-400">Webhook Ativo</label>
          </div>
          <button 
            type="submit" 
            disabled={isLoadingWebhook}
            className="bg-green-600 hover:bg-green-700 text-white font-mono text-sm py-2 px-4 rounded transition-colors disabled:opacity-50"
          >
            {isLoadingWebhook ? 'Salvando...' : 'Salvar Configuração'}
          </button>
        </form>
      </div>

      <div className="bg-gray-900 rounded-lg p-6 shadow-md border border-gray-800">
        <h3 className="text-lg font-mono font-semibold text-blue-400 mb-4">&gt; Chaves de API (Tokens)</h3>
        
        {generatedKey && (
          <div className="mb-6 p-4 bg-blue-900/30 border border-blue-500/50 rounded-lg">
            <p className="text-blue-300 font-mono text-sm mb-2">Chave gerada com sucesso! Guarde-a agora, ela não será exibida novamente:</p>
            <div className="bg-gray-950 p-3 rounded flex justify-between items-center break-all">
              <code className="text-green-400 font-mono">{generatedKey}</code>
            </div>
          </div>
        )}

        <form onSubmit={handleGenerateKey} className="flex gap-4 items-end mb-6">
          <div className="flex-1">
            <label className="block text-sm font-mono text-gray-400 mb-1">Nome da nova chave (ex: ERP Integration)</label>
            <input 
              type="text" 
              required
              value={newKeyName}
              onChange={(e) => setNewKeyName(e.target.value)}
              className="w-full bg-gray-800 text-blue-300 font-mono text-sm border border-gray-700 rounded p-2 focus:ring-blue-500 focus:border-blue-500 outline-none" 
              placeholder="Nome da chave"
            />
          </div>
          <button 
            type="submit" 
            disabled={isLoadingKey}
            className="bg-blue-600 hover:bg-blue-700 text-white font-mono text-sm py-2 px-4 rounded transition-colors disabled:opacity-50"
          >
            {isLoadingKey ? 'Gerando...' : 'Gerar Chave'}
          </button>
        </form>

        {initialApiKeys.length > 0 ? (
          <div className="overflow-hidden rounded border border-gray-800">
            <table className="w-full text-left text-sm font-mono text-gray-400">
              <thead className="bg-gray-800 text-gray-300">
                <tr>
                  <th className="px-4 py-3 font-semibold">Nome</th>
                  <th className="px-4 py-3 font-semibold">Criada em</th>
                  <th className="px-4 py-3 font-semibold text-right">Ações</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-gray-800 bg-gray-900">
                {initialApiKeys.map((key) => (
                  <tr key={key.id} className="hover:bg-gray-800/50">
                    <td className="px-4 py-3 text-gray-200">{key.name}</td>
                    <td className="px-4 py-3">{new Date(key.created_at).toLocaleDateString()}</td>
                    <td className="px-4 py-3 text-right">
                      <button 
                        onClick={() => handleDeleteKey(key.id)}
                        className="text-red-400 hover:text-red-300 transition-colors"
                      >
                        Revogar
                      </button>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        ) : (
          <p className="text-gray-500 font-mono text-sm">Nenhuma chave de API gerada.</p>
        )}
      </div>
    </div>
  )
}

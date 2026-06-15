import { createClient } from '@/utils/supabase/server'
import { createAnnouncement } from '@/actions/comunicados'
import { redirect } from 'next/navigation'
import Link from 'next/link'
import { PageHeader } from '@/components/page-header'

export const metadata = {
  title: 'Comunicados | Gestão Conecta',
}

export default async function ComunicadosPage() {
  const supabase = await createClient()
  
  const { data: { user } } = await supabase.auth.getUser()
  if (!user) redirect('/login')

  const { data: roleData } = await supabase
    .from('user_roles')
    .select('prefeitura_id, roles(access_level)')
    .eq('user_id', user.id)
    .single()

  const accessLevel = Array.isArray(roleData?.roles) 
    ? roleData?.roles[0]?.access_level 
    : (roleData?.roles as any)?.access_level

  if ((accessLevel || 0) < 2) {
    return (
      <div className="p-8">
        <h1 className="text-2xl font-bold text-red-600">Acesso Negado</h1>
        <p>Você não tem permissão para gerenciar comunicados.</p>
      </div>
    )
  }

  const { data: announcements } = await supabase
    .from('announcements')
    .select('*')
    .eq('prefeitura_id', roleData?.prefeitura_id)
    .order('created_at', { ascending: false })

  return (
    <div className="p-8 max-w-5xl mx-auto">
      <div className="mb-4">
        <Link href="/dashboard" className="text-blue-600 hover:text-blue-800 text-sm font-medium flex items-center gap-1">
          ← Voltar para o Dashboard
        </Link>
      </div>
      <PageHeader title="Comunicados Oficiais (Broadcast)" />
      
      <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
        {/* Formulário */}
        <div className="md:col-span-1 bg-white p-6 rounded-lg shadow border">
          <h2 className="text-xl font-semibold mb-4">Novo Comunicado</h2>
          <form action={createAnnouncement} className="space-y-4">
            <div>
              <label className="block text-sm font-medium mb-1">Título</label>
              <input 
                name="title" 
                type="text" 
                required 
                className="w-full border p-2 rounded" 
                placeholder="Ex: Alerta de Tempestade"
              />
            </div>
            
            <div>
              <label className="block text-sm font-medium mb-1">Mensagem</label>
              <textarea 
                name="body" 
                required 
                rows={4}
                className="w-full border p-2 rounded" 
                placeholder="Detalhes do aviso..."
              />
            </div>

            <div>
              <label className="block text-sm font-medium mb-1">Severidade</label>
              <select name="severity" required className="w-full border p-2 rounded bg-white">
                <option value="INFO">Informação (Azul)</option>
                <option value="WARNING">Atenção (Amarelo)</option>
                <option value="EMERGENCY">Emergência (Vermelho)</option>
              </select>
            </div>

            <button 
              type="submit" 
              className="w-full bg-blue-600 text-white font-medium py-2 px-4 rounded hover:bg-blue-700 transition"
            >
              Disparar Broadcast
            </button>
          </form>
        </div>

        {/* Histórico */}
        <div className="md:col-span-2">
          <h2 className="text-xl font-semibold mb-4">Histórico de Envios</h2>
          {announcements && announcements.length > 0 ? (
            <div className="space-y-4">
              {announcements.map((a: any) => (
                <div key={a.id} className="bg-white p-4 rounded-lg shadow border flex justify-between items-start">
                  <div>
                    <div className="flex items-center gap-2 mb-2">
                      <span className={`px-2 py-1 text-xs font-bold rounded-full ${
                        a.severity === 'EMERGENCY' ? 'bg-red-100 text-red-700' :
                        a.severity === 'WARNING' ? 'bg-yellow-100 text-yellow-800' :
                        'bg-blue-100 text-blue-700'
                      }`}>
                        {a.severity}
                      </span>
                      <h3 className="font-bold text-lg">{a.title}</h3>
                    </div>
                    <p className="text-gray-700">{a.body}</p>
                    <p className="text-xs text-gray-500 mt-2">
                      Enviado em: {new Date(a.created_at).toLocaleString('pt-BR')}
                    </p>
                  </div>
                </div>
              ))}
            </div>
          ) : (
            <div className="bg-gray-50 p-8 text-center rounded border border-dashed">
              <p className="text-gray-500">Nenhum comunicado enviado ainda.</p>
            </div>
          )}
        </div>
      </div>
    </div>
  )
}

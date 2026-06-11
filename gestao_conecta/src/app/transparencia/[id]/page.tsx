import { getPrefeituraInfo, getTransparencyMetrics } from '@/actions/transparency'
import { notFound } from 'next/navigation'
import PublicMap from './PublicMap'

import { CheckCircle2, Clock, Activity, Star } from 'lucide-react'
import Image from 'next/image'

export default async function TransparenciaPage({
  params,
}: {
  params: Promise<{ id: string }>
}) {
  const { id } = await params
  const prefeituraInfo = await getPrefeituraInfo(id)
  const metrics = await getTransparencyMetrics(id)

  if (!prefeituraInfo) {
    return notFound()
  }

  const totals = metrics?.totals || { resolved: 0, in_progress: 0, pending: 0, analyzing: 0 }
  const avgCsat = metrics?.avg_csat || 0
  const completedPins = metrics?.completed_pins || []

  return (
    <div className="min-h-screen bg-slate-50 flex flex-col">
      <header
        className="text-white py-6 px-4 shadow-md sticky top-0 z-10"
        style={{ backgroundColor: prefeituraInfo.primary_color || '#0047AB' }}
      >
        <div className="container mx-auto flex items-center justify-between">
          <div className="flex items-center gap-4">
            {prefeituraInfo.logo_url && (
              <div className="bg-white p-1 rounded-md">
                <Image
                  src={prefeituraInfo.logo_url}
                  alt={`Logo ${prefeituraInfo.name}`}
                  width={48}
                  height={48}
                  className="object-contain"
                />
              </div>
            )}
            <h1 className="text-2xl font-bold">Portal de Transparência</h1>
          </div>
          <div className="text-right">
            <p className="font-semibold text-lg">{prefeituraInfo.name}</p>
            <p className="text-sm opacity-90">Gestão Pública Transparente</p>
          </div>
        </div>
      </header>

      <main className="flex-1 container mx-auto p-4 py-8">
        <section className="mb-8">
          <h2 className="text-xl font-bold text-slate-800 mb-6">Métricas de Zeladoria</h2>
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
            <div className="bg-white rounded-xl shadow-sm border border-slate-200 border-l-4 p-6" style={{ borderLeftColor: '#10b981' }}>
              <div className="flex flex-row items-center justify-between pb-2 space-y-0">
                <h3 className="text-sm font-medium text-slate-600">Resolvidos</h3>
                <CheckCircle2 className="w-4 h-4 text-emerald-500" />
              </div>
              <div>
                <div className="text-3xl font-bold text-slate-800">{totals.resolved}</div>
              </div>
            </div>

            <div className="bg-white rounded-xl shadow-sm border border-slate-200 border-l-4 p-6" style={{ borderLeftColor: '#f59e0b' }}>
              <div className="flex flex-row items-center justify-between pb-2 space-y-0">
                <h3 className="text-sm font-medium text-slate-600">Em Andamento</h3>
                <Activity className="w-4 h-4 text-amber-500" />
              </div>
              <div>
                <div className="text-3xl font-bold text-slate-800">{totals.in_progress}</div>
              </div>
            </div>

            <div className="bg-white rounded-xl shadow-sm border border-slate-200 border-l-4 p-6" style={{ borderLeftColor: '#ef4444' }}>
              <div className="flex flex-row items-center justify-between pb-2 space-y-0">
                <h3 className="text-sm font-medium text-slate-600">Pendentes</h3>
                <Clock className="w-4 h-4 text-red-500" />
              </div>
              <div>
                <div className="text-3xl font-bold text-slate-800">{totals.pending + totals.analyzing}</div>
              </div>
            </div>

            <div className="bg-white rounded-xl shadow-sm border border-slate-200 border-l-4 p-6" style={{ borderLeftColor: '#8b5cf6' }}>
              <div className="flex flex-row items-center justify-between pb-2 space-y-0">
                <h3 className="text-sm font-medium text-slate-600">Satisfação Média</h3>
                <Star className="w-4 h-4 text-violet-500" />
              </div>
              <div>
                <div className="text-3xl font-bold text-slate-800 flex items-baseline gap-1">
                  {avgCsat.toFixed(1)} <span className="text-sm font-normal text-slate-500">/ 5.0</span>
                </div>
              </div>
            </div>
          </div>
        </section>

        <section className="bg-white rounded-xl shadow-sm border border-slate-200 overflow-hidden flex flex-col h-[600px]">
          <div className="p-4 border-b border-slate-100 bg-slate-50">
            <h2 className="text-lg font-bold text-slate-800">Mapa de Zeladoria (Chamados Concluídos)</h2>
            <p className="text-sm text-slate-500">Acompanhe as ações finalizadas na sua região.</p>
          </div>
          <div className="flex-1 w-full h-full relative">
            <PublicMap pins={completedPins} primaryColor={prefeituraInfo.primary_color} />
          </div>
        </section>
      </main>

      <footer className="bg-slate-800 text-slate-400 py-6 text-center text-sm">
        <p>© {new Date().getFullYear()} {prefeituraInfo.name}. Todos os direitos reservados.</p>
        <p className="mt-1">Desenvolvido com Conecta v3</p>
      </footer>
    </div>
  )
}

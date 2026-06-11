import { createClient } from '@/utils/supabase/server'
import { MapWrapper } from '@/components/map-wrapper'
import { OccurrenceDetail } from '@/actions/chamados'

export default async function MapaPage() {
  const supabase = await createClient()

  // Get occurrences with valid lat/lng
  const { data: occurrences, error } = await supabase
    .from('occurrences')
    .select('*, prefeituras(name, primary_color)')
    .not('latitude', 'is', null)
    .not('longitude', 'is', null)

  if (error) {
    console.error('Error fetching map occurrences:', error)
  }

  const typedOccurrences = (occurrences || []) as OccurrenceDetail[]

  const countsByPrefeitura = typedOccurrences.reduce((acc, curr) => {
    const pName = curr.prefeituras?.name || 'Desconhecida'
    const color = curr.prefeituras?.primary_color || '#003B73'
    if (!acc[pName]) acc[pName] = { count: 0, color }
    acc[pName].count++
    return acc
  }, {} as Record<string, { count: number, color: string }>)

  return (
    <div className="flex flex-col h-[calc(100vh-6rem)] gap-4 px-8 py-6">
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-2xl font-bold text-[#1b1c1c]">Gestão Territorial</h1>
          <p className="text-sm text-[#737781]">
            Visualize todas as ocorrências mapeadas geograficamente.
          </p>
        </div>
        <div className="flex flex-wrap justify-end items-center gap-3">
          {Object.entries(countsByPrefeitura).map(([name, data]) => (
            <span key={name} className="flex items-center gap-2 rounded-lg bg-white border border-[#e4e2e1] px-3 py-1.5 text-sm font-semibold text-[#1b1c1c] shadow-sm">
              <span className="h-3 w-3 rounded-full shadow-sm" style={{ backgroundColor: data.color }}></span>
              {name}: {data.count}
            </span>
          ))}
          <span className="rounded-lg bg-[#003B73]/10 px-4 py-1.5 text-sm font-bold text-[#003B73]">
            Total: {typedOccurrences.length}
          </span>
        </div>
      </div>

      <div className="flex-1 overflow-hidden rounded-xl border border-[#e4e2e1] shadow-sm bg-white">
        <MapWrapper occurrences={typedOccurrences} />
      </div>
    </div>
  )
}

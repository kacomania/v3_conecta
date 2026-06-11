import { notFound } from 'next/navigation'
import Link from 'next/link'
import { getChamadoDetails } from '@/actions/chamados'
import { StatusForm } from './status-form'
import { NoteForm } from './note-form'
import { DepartmentForm } from './department-form'
import { ImageModal } from '@/components/image-modal'
import { LockControl } from './lock-control'
import { createClient } from '@/utils/supabase/server'

export const dynamic = 'force-dynamic'

// ─── Helpers ─────────────────────────────────────────────────────────────────

const STATUS_OPTIONS = [
  { value: 'PENDING', label: 'Pendente' },
  { value: 'ANALYZING', label: 'Em Análise' },
  { value: 'IN_PROGRESS', label: 'Em Andamento' },
  { value: 'COMPLETED', label: 'Concluído' },
  { value: 'REJECTED', label: 'Rejeitado' },
]

function getStatusLabel(status: string) {
  return STATUS_OPTIONS.find((s) => s.value === status)?.label ?? status
}

function getStatusBadge(status: string) {
  switch (status) {
    case 'PENDING':      return 'bg-amber-100 text-amber-800 border border-amber-200'
    case 'ANALYZING':    return 'bg-blue-100 text-blue-800 border border-blue-200'
    case 'IN_PROGRESS':  return 'bg-indigo-100 text-indigo-800 border border-indigo-200'
    case 'COMPLETED':    return 'bg-emerald-100 text-emerald-800 border border-emerald-200'
    case 'REJECTED':     return 'bg-red-100 text-red-800 border border-red-200'
    default:             return 'bg-gray-100 text-gray-700 border border-gray-200'
  }
}

function formatDate(iso: string) {
  return new Date(iso).toLocaleString('pt-BR', {
    day: '2-digit', month: '2-digit', year: 'numeric',
    hour: '2-digit', minute: '2-digit',
  })
}

// ─── Page ─────────────────────────────────────────────────────────────────────

export default async function ChamadoDetailPage({
  params,
}: {
  params: Promise<{ id: string }>
}) {
  const { id } = await params
  const { occurrence, timeline, error } = await getChamadoDetails(id)

  if (error || !occurrence) {
    notFound()
  }

  const supabase = await createClient()
  const { data: { user } } = await supabase.auth.getUser()
  const currentUserId = user?.id

  const { data: departments } = await supabase
    .from('departments')
    .select('id, name')
    .eq('prefeitura_id', occurrence.prefeitura_id)
    .order('name')

  const thirtyMinutesAgo = new Date(Date.now() - 30 * 60 * 1000)
  const isLocked = occurrence.locked_by && occurrence.locked_at && new Date(occurrence.locked_at) > thirtyMinutesAgo
  const isLockedByMe = isLocked && occurrence.locked_by === currentUserId
  const isLockedByOther = isLocked && occurrence.locked_by !== currentUserId
  const isFree = !isLocked

  if (isLockedByOther) {
    return (
      <div className="flex flex-col items-center justify-center p-12 bg-white rounded-xl border border-red-200">
        <svg className="w-16 h-16 text-red-500 mb-4" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 15v2m-6 4h12a2 2 0 002-2v-6a2 2 0 00-2-2H6a2 2 0 00-2 2v6a2 2 0 002 2zm10-10V7a4 4 0 00-8 0v4h8z" /></svg>
        <h2 className="text-2xl font-bold text-[#1b1c1c] mb-2">Acesso Negado</h2>
        <p className="text-[#434750]">Este chamado está em atendimento por outro usuário no momento.</p>
        <Link href="/dashboard" className="mt-6 px-4 py-2 bg-[#003B73] text-white rounded hover:bg-[#002a52] transition-colors">Voltar para Triagem</Link>
      </div>
    )
  }

  const hasPhoto = occurrence.image_url || (occurrence.image_urls && occurrence.image_urls.length > 0)
  const photoUrl = occurrence.image_url ?? occurrence.image_urls?.[0] ?? null

  return (
    <div className="flex flex-col gap-6 font-inter">
      {/* Breadcrumb */}
      <nav className="flex items-center gap-2 text-sm text-[#737781]">
        <Link href="/dashboard" className="hover:text-[#003B73] hover:underline">
          Dashboard
        </Link>
        <span>/</span>
        <span className="font-medium text-[#1b1c1c]">Chamado #{occurrence.id.split('-')[0].toUpperCase()}</span>
      </nav>

      {/* Main Grid */}
      <div className="grid grid-cols-1 gap-6 lg:grid-cols-3">

        {/* ── Coluna Esquerda: Informações do Chamado ── */}
        <div className="flex flex-col gap-6 lg:col-span-2">

          {/* Card de Detalhes */}
          <div className="overflow-hidden rounded-xl border border-[#e4e2e1] bg-white shadow-sm">
            {/* Foto */}
            {hasPhoto && photoUrl ? (
              <div className="relative h-64 w-full overflow-hidden bg-[#f0eded]">
                {/* eslint-disable-next-line @next/next/no-img-element */}
                <img
                  src={photoUrl}
                  alt="Foto do chamado"
                  className="h-full w-full object-cover"
                />
              </div>
            ) : (
              <div className="flex h-48 items-center justify-center bg-[#f6f3f2]">
                <div className="flex flex-col items-center gap-2 text-[#b5b1b1]">
                  <svg xmlns="http://www.w3.org/2000/svg" className="h-12 w-12" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M4 16l4.586-4.586a2 2 0 012.828 0L16 16m-2-2l1.586-1.586a2 2 0 012.828 0L20 14m-6-6h.01M6 20h12a2 2 0 002-2V6a2 2 0 00-2-2H6a2 2 0 00-2 2v12a2 2 0 002 2z" />
                  </svg>
                  <span className="text-sm">Sem foto anexada</span>
                </div>
              </div>
            )}

            {/* Info */}
            <div className="p-6">
              <div className="mb-4 flex flex-wrap items-start justify-between gap-3">
                <h2 className="text-xl font-bold text-[#1b1c1c]">{occurrence.title}</h2>
                <span className={`inline-flex rounded-full px-3 py-1 text-xs font-semibold ${getStatusBadge(occurrence.status)}`}>
                  {getStatusLabel(occurrence.status)}
                </span>
              </div>

              <p className="mb-6 text-sm leading-relaxed text-[#434750]">
                {occurrence.description || 'Sem descrição.'}
              </p>

              <dl className="grid grid-cols-2 gap-x-6 gap-y-4 border-t border-[#e4e2e1] pt-5 text-sm">
                <div>
                  <dt className="font-semibold text-[#737781]">Protocolo</dt>
                  <dd className="mt-1 font-mono text-[#1b1c1c]">{occurrence.id.split('-')[0].toUpperCase()}</dd>
                </div>
                <div>
                  <dt className="font-semibold text-[#737781]">Abertura</dt>
                  <dd className="mt-1 text-[#1b1c1c]">{formatDate(occurrence.created_at)}</dd>
                </div>
                {occurrence.latitude && occurrence.longitude && (
                  <div className="col-span-2">
                    <dt className="font-semibold text-[#737781]">Localização</dt>
                    <dd className="mt-1 text-[#1b1c1c]">
                      {occurrence.latitude.toFixed(6)}, {occurrence.longitude.toFixed(6)}
                    </dd>
                  </div>
                )}
              </dl>

              {/* Galeria adicional */}
              {occurrence.image_urls && occurrence.image_urls.length > 1 && (
                <div className="mt-5 border-t border-[#e4e2e1] pt-5">
                  <p className="mb-3 text-sm font-semibold text-[#737781]">Outras fotos</p>
                  <div className="flex flex-wrap gap-2">
                    {occurrence.image_urls.slice(1).map((url, i) => (
                      <a key={i} href={url} target="_blank" rel="noopener noreferrer">
                        {/* eslint-disable-next-line @next/next/no-img-element */}
                        <img
                          src={url}
                          alt={`Foto ${i + 2}`}
                          className="h-20 w-20 rounded-lg object-cover ring-1 ring-[#e4e2e1] transition hover:opacity-80"
                        />
                      </a>
                    ))}
                  </div>
                </div>
              )}
            </div>
          </div>
        </div>

        {/* ── Coluna Direita: Gestão ── */}
        <div className="flex flex-col gap-6">

          {/* Avaliação do Cidadão */}
          {occurrence.rating && (
            <div className="rounded-xl border border-[#e4e2e1] bg-white p-5 shadow-sm">
              <h3 className="mb-4 font-inter text-base font-semibold text-[#1b1c1c]">Avaliação do Cidadão</h3>
              <div className="flex items-center gap-1 mb-3">
                {Array.from({ length: 5 }).map((_, i) => (
                  <svg
                    key={i}
                    className={`w-6 h-6 ${i < (occurrence.rating ?? 0) ? 'text-[#EAB308]' : 'text-gray-300'}`}
                    fill="currentColor"
                    viewBox="0 0 20 20"
                  >
                    <path d="M9.049 2.927c.3-.921 1.603-.921 1.902 0l1.07 3.292a1 1 0 00.95.69h3.462c.969 0 1.371 1.24.588 1.81l-2.8 2.034a1 1 0 00-.364 1.118l1.07 3.292c.3.921-.755 1.688-1.54 1.118l-2.8-2.034a1 1 0 00-1.175 0l-2.8 2.034c-.784.57-1.838-.197-1.539-1.118l1.07-3.292a1 1 0 00-.364-1.118L2.98 8.72c-.783-.57-.38-1.81.588-1.81h3.461a1 1 0 00.951-.69l1.07-3.292z" />
                  </svg>
                ))}
              </div>
              {occurrence.feedback_notes && (
                <p className="text-sm text-[#434750] italic">"{occurrence.feedback_notes}"</p>
              )}
            </div>
          )}

          {/* Controle de Atendimento */}
          <div className="rounded-xl border border-[#e4e2e1] bg-white p-5 shadow-sm">
            <h3 className="mb-4 font-inter text-base font-semibold text-[#1b1c1c]">Controle de Atendimento</h3>
            <LockControl occurrenceId={occurrence.id} isLockedByMe={!!isLockedByMe} isFree={isFree} />
            
            {!isLockedByMe && (
              <p className="mt-3 text-xs text-[#737781]">
                Você precisa assumir o chamado para poder alterar o status ou adicionar notas.
              </p>
            )}
          </div>

          {/* Alterar Status */}
          {isLockedByMe && (
            <div className="rounded-xl border border-[#e4e2e1] bg-white p-5 shadow-sm transition-all">
              <h3 className="mb-4 font-inter text-base font-semibold text-[#1b1c1c]">Alterar Status</h3>
              <StatusForm
                occurrenceId={occurrence.id}
                currentStatus={occurrence.status}
                statusOptions={STATUS_OPTIONS}
              />
            </div>
          )}

          {/* Reatribuir Departamento */}
          {isLockedByMe && (
            <div className="rounded-xl border border-[#e4e2e1] bg-white p-5 shadow-sm transition-all">
              <h3 className="mb-4 font-inter text-base font-semibold text-[#1b1c1c]">Reatribuir Departamento</h3>
              <DepartmentForm
                occurrenceId={occurrence.id}
                currentDepartmentId={occurrence.department_id}
                departments={departments ?? []}
              />
            </div>
          )}

          {/* Nova Atualização */}
          {isLockedByMe && (
            <div className="rounded-xl border border-[#e4e2e1] bg-white p-5 shadow-sm transition-all">
              <h3 className="mb-4 font-inter text-base font-semibold text-[#1b1c1c]">Nova Atualização</h3>
              <NoteForm occurrenceId={occurrence.id} />
            </div>
          )}
        </div>
      </div>

      {/* ── Linha do Tempo ── */}
      <div className="rounded-xl border border-[#e4e2e1] bg-white p-6 shadow-sm">
        <h3 className="mb-6 font-inter text-base font-semibold text-[#1b1c1c]">
          Linha do Tempo
          <span className="ml-2 rounded-full bg-[#f0eded] px-2 py-0.5 text-xs font-normal text-[#737781]">
            {timeline.length} {timeline.length === 1 ? 'entrada' : 'entradas'}
          </span>
        </h3>

        {timeline.length === 0 ? (
          <p className="text-center text-sm text-[#737781]">Nenhuma atualização registrada ainda.</p>
        ) : (
          <ol className="relative border-l border-[#e4e2e1]">
            {timeline.map((entry) => (
              <li key={entry.id} className="mb-6 ml-4 last:mb-0">
                {/* Dot */}
                <span className={`absolute -left-[9px] flex h-4 w-4 items-center justify-center rounded-full ring-2 ring-white ${entry.is_public ? 'bg-[#003B73]' : 'bg-[#737781]'}`} />

                <div className="rounded-lg border border-[#e4e2e1] bg-[#fbf9f8] p-4">
                  <div className="mb-2 flex flex-wrap items-center justify-between gap-2">
                    <div className="flex items-center gap-2">
                      <time className="text-xs text-[#737781]">{formatDate(entry.created_at)}</time>
                      <span className="text-xs text-[#b5b1b1]">•</span>
                      <span className="text-xs font-medium text-[#434750]">
                        {entry.system_author_name ? entry.system_author_name : (entry.creator_email ? entry.creator_email : 'Conta Excluída')}
                      </span>
                    </div>
                    <span className={`rounded px-2 py-0.5 text-[10px] font-semibold uppercase tracking-wide ${entry.is_public ? 'bg-[#d5e3ff] text-[#001c3b]' : 'bg-[#e4e2e1] text-[#434750]'}`}>
                      {entry.is_public ? '🌐 Pública' : '🔒 Interna'}
                    </span>
                  </div>

                  {entry.description && (
                    <p className="text-sm text-[#1b1c1c]">{entry.description}</p>
                  )}

                  {entry.image_url && (
                    <div className="mt-3">
                      <ImageModal 
                        url={entry.image_url} 
                        className="h-32 w-32 rounded-lg object-cover ring-1 ring-[#e4e2e1]" 
                      />
                    </div>
                  )}

                  {entry.old_status && entry.new_status && entry.old_status !== entry.new_status && (
                    <div className="mt-2 flex items-center gap-2 text-xs text-[#737781]">
                      <span className={`rounded px-2 py-0.5 font-medium ${getStatusBadge(entry.old_status)}`}>
                        {getStatusLabel(entry.old_status)}
                      </span>
                      <span>→</span>
                      <span className={`rounded px-2 py-0.5 font-medium ${getStatusBadge(entry.new_status)}`}>
                        {getStatusLabel(entry.new_status)}
                      </span>
                    </div>
                  )}
                </div>
              </li>
            ))}
          </ol>
        )}
      </div>
    </div>
  )
}

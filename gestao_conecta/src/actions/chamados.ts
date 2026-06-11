'use server'

import { revalidatePath } from 'next/cache'
import { createClient } from '@/utils/supabase/server'

// ─── Tipos ───────────────────────────────────────────────────────────────────

export type OccurrenceDetail = {
  id: string
  title: string
  description: string
  status: string
  created_at: string
  image_url: string | null
  image_urls: string[]
  latitude: number | null
  longitude: number | null
  category_id: string | null
  department_id: string | null
  prefeitura_id: string
  user_id: string
  prefeituras?: {
    name: string
    primary_color: string | null
  }
  locked_by?: string | null
  locked_at?: string | null
  rating?: number | null
  feedback_notes?: string | null
}

export type TimelineEntry = {
  id: string
  occurrence_id: string
  created_by: string | null
  creator_email?: string | null
  old_status: string | null
  new_status: string | null
  description: string | null
  image_url: string | null
  is_public: boolean
  created_at: string
  system_author_name?: string | null
}

// ─── Queries ─────────────────────────────────────────────────────────────────

/**
 * Busca os detalhes completos de um chamado e sua linha do tempo.
 * Executa server-side para garantir que o RLS do servidor logado seja respeitado.
 */
export async function getChamadoDetails(id: string): Promise<{
  occurrence: OccurrenceDetail | null
  timeline: TimelineEntry[]
  error: string | null
}> {
  const supabase = await createClient()

  const { data: occurrence, error: occErr } = await supabase
    .from('occurrences')
    .select('*')
    .eq('id', id)
    .single()

  if (occErr) {
    return { occurrence: null, timeline: [], error: occErr.message }
  }

  const { data: timeline, error: tlErr } = await supabase
    .from('occurrence_timeline')
    .select('*, creator_email:occurrence_timeline_creator_email')
    .eq('occurrence_id', id)
    .order('created_at', { ascending: true })

  if (tlErr) {
    return { occurrence, timeline: [], error: tlErr.message }
  }

  return { occurrence, timeline: timeline ?? [], error: null }
}

// ─── Mutations ────────────────────────────────────────────────────────────────

/**
 * Ação 1: Atualiza o status de um chamado na tabela `occurrences`.
 * Também insere um registro na `occurrence_timeline` para auditar a mudança.
 */
export async function updateStatus(formData: FormData) {
  const supabase = await createClient()
  const { data: { user } } = await supabase.auth.getUser()

  const occurrenceId = formData.get('occurrenceId') as string
  const oldStatus = formData.get('oldStatus') as string
  const newStatus = formData.get('newStatus') as string

  if (!occurrenceId || !newStatus) return

  // Atualiza o status na tabela de ocorrências
  const { error: updateErr } = await supabase
    .from('occurrences')
    .update({ status: newStatus })
    .eq('id', occurrenceId)

  if (updateErr) {
    console.error('Erro ao atualizar status:', updateErr.message)
    throw new Error(updateErr.message)
  }

  // Registra a mudança de status na linha do tempo (sempre pública)
  const { error: insertErr } = await supabase.from('occurrence_timeline').insert({
    occurrence_id: occurrenceId,
    created_by: user?.id ?? null,
    old_status: oldStatus,
    new_status: newStatus,
    description: `Status atualizado de "${oldStatus}" para "${newStatus}".`,
    is_public: true,
  })

  if (insertErr) {
    console.error('Erro ao inserir timeline:', insertErr.message)
    throw new Error(insertErr.message)
  }

  revalidatePath('/dashboard', 'layout')
}

/**
 * Ação 2: Insere uma nova nota na `occurrence_timeline`.
 * O campo `is_public` define a visibilidade para o cidadão no app Flutter.
 */
export async function addTimelineNote(formData: FormData) {
  const supabase = await createClient()
  const { data: { user } } = await supabase.auth.getUser()

  const occurrenceId = formData.get('occurrenceId') as string
  const description = formData.get('description') as string
  // O checkbox envia 'on' quando marcado; ausente quando desmarcado
  const isPublic = formData.get('isPublic') === 'on'
  const evidence = formData.get('evidence') as File | null

  if (!occurrenceId || !description?.trim()) return

  let imageUrl = null

  if (evidence && evidence.size > 0) {
    if (!evidence.type.startsWith('image/')) {
      throw new Error('Apenas arquivos de imagem são permitidos.')
    }

    const fileExt = evidence.name.split('.').pop()
    const fileName = `${Date.now()}-${Math.random().toString(36).substring(7)}.${fileExt}`
    const filePath = `evidence/${fileName}`

    const { error: uploadError } = await supabase.storage
      .from('occurrences_media')
      .upload(filePath, evidence)

    if (uploadError) {
      console.error('Erro ao fazer upload da evidência:', uploadError.message)
      throw new Error('Falha no upload da evidência: ' + uploadError.message)
    }

    const { data: publicUrlData } = supabase.storage
      .from('occurrences_media')
      .getPublicUrl(filePath)

    imageUrl = publicUrlData.publicUrl
  }

  // Busca o status atual para preencher os campos obrigatórios na timeline
  const { data: occurrence, error: fetchErr } = await supabase
    .from('occurrences')
    .select('status')
    .eq('id', occurrenceId)
    .single()

  if (fetchErr || !occurrence) {
    throw new Error('Não foi possível verificar o status atual da ocorrência.')
  }

  const { error } = await supabase.from('occurrence_timeline').insert({
    occurrence_id: occurrenceId,
    created_by: user?.id ?? null,
    old_status: occurrence.status,
    new_status: occurrence.status,
    description: description.trim(),
    is_public: isPublic,
    image_url: imageUrl,
  })

  if (error) {
    console.error('Erro ao adicionar nota:', error.message)
    throw new Error(error.message)
  }

  revalidatePath('/dashboard', 'layout')
}

/**
 * Ação 3: Assume o atendimento de um chamado (Pessimistic Locking).
 */
export async function lockTicket(id: string) {
  const supabase = await createClient()
  const { data: { user } } = await supabase.auth.getUser()
  
  if (!user) throw new Error('Não autenticado')

  const thirtyMinutesAgo = new Date(Date.now() - 30 * 60 * 1000).toISOString()

  // Verifica se o usuário já tem outro chamado travado
  const { data: existingLocks } = await supabase
    .from('occurrences')
    .select('id')
    .eq('locked_by', user.id)
    .gt('locked_at', thirtyMinutesAgo)
    .neq('id', id)

  if (existingLocks && existingLocks.length > 0) {
    throw new Error('Você já possui um chamado em atendimento.')
  }

  // Busca status atual e lock
  const { data: ticket, error: ticketErr } = await supabase
    .from('occurrences')
    .select('locked_by, locked_at, status')
    .eq('id', id)
    .single()

  if (ticketErr || !ticket) throw new Error('Chamado não encontrado')

  // Se tem lock de outro usuário
  if (ticket.locked_by && ticket.locked_by !== user.id) {
    if (ticket.locked_at && new Date(ticket.locked_at) > new Date(thirtyMinutesAgo)) {
      throw new Error('Chamado já está em atendimento por outro usuário.')
    } else {
      // Expirou, gera log de inatividade para o usuário anterior
      await supabase.from('occurrence_timeline').insert({
        occurrence_id: id,
        created_by: ticket.locked_by,
        old_status: ticket.status,
        new_status: ticket.status,
        description: 'Atendimento encerrado por inatividade (timeout de 30 min).',
        is_public: false,
      })
    }
  }

  // Assume o lock
  const { error: updateErr } = await supabase
    .from('occurrences')
    .update({
      locked_by: user.id,
      locked_at: new Date().toISOString()
    })
    .eq('id', id)

  if (updateErr) throw new Error(updateErr.message)

  // Loga o início do atendimento
  await supabase.from('occurrence_timeline').insert({
    occurrence_id: id,
    created_by: user.id,
    old_status: ticket.status,
    new_status: ticket.status,
    description: 'Atendimento iniciado.',
    is_public: false,
  })

  revalidatePath('/dashboard', 'layout')
}

/**
 * Ação 4: Pausa/Encerra o atendimento de um chamado.
 */
export async function unlockTicket(id: string) {
  const supabase = await createClient()
  const { data: { user } } = await supabase.auth.getUser()
  
  if (!user) throw new Error('Não autenticado')

  const { data: ticket, error: ticketErr } = await supabase
    .from('occurrences')
    .select('locked_by, status')
    .eq('id', id)
    .single()

  if (ticketErr || !ticket) throw new Error('Chamado não encontrado')

  if (ticket.locked_by !== user.id) {
    throw new Error('Você não pode encerrar o atendimento de outro usuário.')
  }

  // Remove o lock
  const { error: updateErr } = await supabase
    .from('occurrences')
    .update({
      locked_by: null,
      locked_at: null
    })
    .eq('id', id)

  if (updateErr) throw new Error(updateErr.message)

  // Loga a pausa/encerramento
  await supabase.from('occurrence_timeline').insert({
    occurrence_id: id,
    created_by: user.id,
    old_status: ticket.status,
    new_status: ticket.status,
    description: 'Atendimento pausado/encerrado.',
    is_public: false,
  })

  revalidatePath('/dashboard', 'layout')
}

/**
 * Ação 5: Atualiza o departamento de um chamado e exige justificativa.
 */
export async function updateDepartment(formData: FormData) {
  const supabase = await createClient()
  const { data: { user } } = await supabase.auth.getUser()

  const occurrenceId = formData.get('occurrenceId') as string
  const newDepartmentId = formData.get('newDepartmentId') as string
  const justification = formData.get('justification') as string

  if (!occurrenceId || !newDepartmentId || !justification?.trim()) {
    throw new Error('Todos os campos são obrigatórios.')
  }

  const { data: occurrence, error: fetchErr } = await supabase
    .from('occurrences')
    .select('status')
    .eq('id', occurrenceId)
    .single()

  if (fetchErr || !occurrence) throw new Error('Chamado não encontrado.')

  const { data: dept, error: deptErr } = await supabase
    .from('departments')
    .select('name')
    .eq('id', newDepartmentId)
    .single()

  if (deptErr || !dept) throw new Error('Departamento não encontrado.')

  const { error: updateErr } = await supabase
    .from('occurrences')
    .update({ department_id: newDepartmentId })
    .eq('id', occurrenceId)

  if (updateErr) throw new Error(updateErr.message)

  const { error: insertErr } = await supabase.from('occurrence_timeline').insert({
    occurrence_id: occurrenceId,
    created_by: user?.id ?? null,
    old_status: occurrence.status,
    new_status: occurrence.status,
    description: `Departamento alterado para "${dept.name}". Motivo: ${justification.trim()}`,
    is_public: false,
  })

  if (insertErr) throw new Error(insertErr.message)

  revalidatePath('/dashboard', 'layout')
}

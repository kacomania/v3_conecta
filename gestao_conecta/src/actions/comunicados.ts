'use server'

import { revalidatePath } from 'next/cache'
import { createClient } from '@/utils/supabase/server'

export async function createAnnouncement(formData: FormData) {
  const supabase = await createClient()
  const title = formData.get('title') as string
  const body = formData.get('body') as string
  const severity = formData.get('severity') as string
  
  if (!title?.trim() || !body?.trim() || !severity) {
    throw new Error('Todos os campos são obrigatórios')
  }

  const { data: { user } } = await supabase.auth.getUser()
  if (!user?.id) throw new Error('Não autenticado')

  const { data: roleData, error: roleError } = await supabase
    .from('user_roles')
    .select('prefeitura_id')
    .eq('user_id', user.id)
    .single()

  if (roleError || !roleData?.prefeitura_id) {
    throw new Error('Prefeitura não encontrada para este usuário')
  }

  const { error } = await supabase.from('announcements').insert({
    title: title.trim(),
    body: body.trim(),
    severity,
    prefeitura_id: roleData.prefeitura_id
  })

  if (error) throw new Error(error.message)
  
  // Call the Edge Function directly since Postgres pg_net might be unconfigured
  const { error: funcError } = await supabase.functions.invoke('broadcast-push', {
    body: {
      record: {
        prefeitura_id: roleData.prefeitura_id,
        title: title.trim(),
        body: body.trim(),
        severity
      }
    }
  })

  if (funcError) {
    console.error('Falha ao acionar Push Notifications:', funcError)
    // We don't throw to not break the UI, the announcement was created successfully.
  }
  
  revalidatePath('/dashboard/comunicados')
}

'use server'

import { revalidatePath } from 'next/cache'
import { createClient } from '@/utils/supabase/server'
import crypto from 'crypto'

export async function getWebhooks() {
  const supabase = await createClient()
  const { data: { user } } = await supabase.auth.getUser()
  if (!user) return []

  const { data: userRole } = await supabase
    .from('user_roles')
    .select('prefeitura_id, roles(access_level)')
    .eq('user_id', user.id)
    .single()

  if (!userRole?.prefeitura_id) return []

  // Check access level
  const roleData = userRole.roles as any
  const accessLevel = Array.isArray(roleData) ? roleData[0]?.access_level : roleData?.access_level
  if (accessLevel < 4) return []

  const { data } = await supabase
    .from('webhooks_endpoints')
    .select('*')
    .eq('prefeitura_id', userRole.prefeitura_id)

  return data || []
}

export async function saveWebhook(formData: FormData) {
  const supabase = await createClient()
  const url = formData.get('url') as string
  const secret_token = formData.get('secret_token') as string
  const is_active = formData.get('is_active') === 'true'

  if (!url?.trim() || !secret_token?.trim()) {
    throw new Error('URL e Secret Token são obrigatórios')
  }

  const { data: { user } } = await supabase.auth.getUser()
  if (!user) throw new Error('Não autenticado')

  const { data: userRole } = await supabase
    .from('user_roles')
    .select('prefeitura_id, roles(access_level)')
    .eq('user_id', user.id)
    .single()

  const prefeitura_id = userRole?.prefeitura_id
  if (!prefeitura_id) throw new Error('Prefeitura não associada')

  const roleData = userRole.roles as any
  const accessLevel = Array.isArray(roleData) ? roleData[0]?.access_level : roleData?.access_level
  if (accessLevel < 4) throw new Error('Acesso negado')

  // Verifica se já existe webhook
  const { data: existing } = await supabase
    .from('webhooks_endpoints')
    .select('id')
    .eq('prefeitura_id', prefeitura_id)
    .limit(1)

  let error;
  if (existing && existing.length > 0) {
    const res = await supabase.from('webhooks_endpoints').update({
      url: url.trim(),
      secret_token: secret_token.trim(),
      is_active
    }).eq('id', existing[0].id)
    error = res.error
  } else {
    const res = await supabase.from('webhooks_endpoints').insert({
      prefeitura_id,
      url: url.trim(),
      secret_token: secret_token.trim(),
      is_active
    })
    error = res.error
  }

  if (error) throw new Error(error.message)

  revalidatePath('/dashboard/desenvolvedores', 'page')
}

export async function getApiKeys() {
  const supabase = await createClient()
  const { data: { user } } = await supabase.auth.getUser()
  if (!user) return []

  const { data: userRole } = await supabase
    .from('user_roles')
    .select('prefeitura_id, roles(access_level)')
    .eq('user_id', user.id)
    .single()

  if (!userRole?.prefeitura_id) return []

  const roleData = userRole.roles as any
  const accessLevel = Array.isArray(roleData) ? roleData[0]?.access_level : roleData?.access_level
  if (accessLevel < 4) return []

  const { data } = await supabase
    .from('api_keys')
    .select('*')
    .eq('prefeitura_id', userRole.prefeitura_id)
    .order('created_at', { ascending: false })

  return data || []
}

export async function generateApiKey(formData: FormData) {
  const supabase = await createClient()
  const name = formData.get('name') as string

  if (!name?.trim()) throw new Error('Nome da chave é obrigatório')

  const { data: { user } } = await supabase.auth.getUser()
  if (!user) throw new Error('Não autenticado')

  const { data: userRole } = await supabase
    .from('user_roles')
    .select('prefeitura_id, roles(access_level)')
    .eq('user_id', user.id)
    .single()

  const prefeitura_id = userRole?.prefeitura_id
  if (!prefeitura_id) throw new Error('Prefeitura não associada')

  const roleData = userRole.roles as any
  const accessLevel = Array.isArray(roleData) ? roleData[0]?.access_level : roleData?.access_level
  if (accessLevel < 4) throw new Error('Acesso negado')

  // Gerar chave raw e hash
  const rawKey = `sk_live_${crypto.randomBytes(24).toString('hex')}`
  const keyHash = crypto.createHash('sha256').update(rawKey).digest('hex')

  const { error } = await supabase.from('api_keys').insert({
    prefeitura_id,
    name: name.trim(),
    key_hash: keyHash
  })

  if (error) throw new Error(error.message)

  revalidatePath('/dashboard/desenvolvedores', 'page')

  return rawKey
}

export async function deleteApiKey(formData: FormData) {
  const supabase = await createClient()
  const id = formData.get('id') as string

  if (!id) return

  const { data: { user } } = await supabase.auth.getUser()
  if (!user) throw new Error('Não autenticado')

  const { data: userRole } = await supabase
    .from('user_roles')
    .select('prefeitura_id, roles(access_level)')
    .eq('user_id', user.id)
    .single()

  const roleData = userRole?.roles as any
  const accessLevel = Array.isArray(roleData) ? roleData[0]?.access_level : roleData?.access_level
  if (accessLevel < 4) throw new Error('Acesso negado')

  const { error } = await supabase.from('api_keys').delete().eq('id', id).eq('prefeitura_id', userRole?.prefeitura_id)
  
  if (error) throw new Error(error.message)

  revalidatePath('/dashboard/desenvolvedores', 'page')
}

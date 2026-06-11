'use server'

import { createClient } from '@/utils/supabase/server'

export async function getTransparencyMetrics(prefeituraId: string) {
  const supabase = await createClient()

  const { data, error } = await supabase.rpc('get_public_transparency_metrics', {
    p_prefeitura_id: prefeituraId,
  })

  if (error) {
    console.error('Error fetching transparency metrics:', error)
    return null
  }

  return data
}

export async function getPrefeituraInfo(prefeituraId: string) {
  const supabase = await createClient()

  const { data, error } = await supabase
    .from('prefeituras')
    .select('name, primary_color, secondary_color, logo_url')
    .eq('id', prefeituraId)
    .single()

  if (error) {
    console.error('Error fetching prefeitura info:', error)
    return null
  }

  return data
}

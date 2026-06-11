import { redirect } from 'next/navigation'
import { createClient } from '@/utils/supabase/server'
import { getWebhooks, getApiKeys } from '@/actions/developers'
import DevelopersClient from './DevelopersClient'

export default async function DevelopersPage() {
  const supabase = await createClient()
  const { data: { user } } = await supabase.auth.getUser()
  if (!user) redirect('/login')

  const { data: userRole } = await supabase
    .from('user_roles')
    .select('roles(access_level)')
    .eq('user_id', user.id)
    .single()

  const roleData = userRole?.roles as any
  const accessLevel = Array.isArray(roleData) ? roleData[0]?.access_level : roleData?.access_level

  if ((accessLevel ?? 0) < 4) {
    redirect('/dashboard')
  }

  const webhooks = await getWebhooks()
  const apiKeys = await getApiKeys()

  return <DevelopersClient initialWebhooks={webhooks} initialApiKeys={apiKeys} />
}

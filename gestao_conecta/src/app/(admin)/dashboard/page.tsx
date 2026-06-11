import Link from 'next/link'
import { createClient } from '@/utils/supabase/server'
import { DashboardFilters } from '@/components/dashboard-filters'
import { DashboardTable } from '@/components/dashboard-table'

export const dynamic = 'force-dynamic'

type Props = {
  searchParams: Promise<{ [key: string]: string | string[] | undefined }>
}

export default async function DashboardPage({ searchParams }: Props) {
  const resolvedParams = await searchParams
  const status = typeof resolvedParams.status === 'string' ? resolvedParams.status : undefined
  const q = typeof resolvedParams.q === 'string' ? resolvedParams.q : undefined

  const supabase = await createClient()

  let query = supabase
    .from('occurrences')
    .select(`
      id,
      title,
      description,
      status,
      created_at,
      category_id,
      categories(name),
      locked_by,
      locked_at,
      due_date
    `)
    .order('created_at', { ascending: false })

  if (status) {
    query = query.eq('status', status)
  } else {
    // Por padrão, não mostra Concluídos nem Rejeitados
    query = query.in('status', ['PENDING', 'ANALYZING', 'IN_PROGRESS'])
  }

  if (q) {
    query = query.ilike('title', `%${q}%`)
  }

  const { data: { user } } = await supabase.auth.getUser()
  if (user) {
    const { data: userRole } = await supabase
      .from('user_roles')
      .select('roles(access_level)')
      .eq('user_id', user.id)
      .single()

    const accessLevel = userRole?.roles?.access_level ?? 0
    
    const { data: userDepts } = await supabase
      .from('user_departments')
      .select('department_id')
      .eq('user_id', user.id)
      
    const departmentIds = userDepts?.map(d => d.department_id) || []

    // Restringe chamados aos departamentos se o nível for baixo (ex: Atendente)
    if (accessLevel < 2) {
      if (departmentIds.length > 0) {
        query = query.in('department_id', departmentIds)
      } else {
        query = query.in('department_id', ['00000000-0000-0000-0000-000000000000'])
      }
    }
  }

  const { data: occurrences, error } = await query

  if (error) {
    console.error('Error fetching occurrences:', error)
    return <div className="rounded-md bg-[#ffdad6] p-4 font-inter text-[#93000a]">Erro ao carregar chamados.</div>
  }

  // Fetch emails for locked occurrences
  let enrichedOccurrences = occurrences || []
  const lockedByIds = [...new Set(enrichedOccurrences.map(o => o.locked_by).filter(Boolean))] as string[]
  
  if (lockedByIds.length > 0) {
    const { data: emails } = await supabase
      .from('admin_user_emails')
      .select('id, email')
      .in('id', lockedByIds)
      
    if (emails) {
      const emailMap = Object.fromEntries(emails.map(e => [e.id, e.email]))
      enrichedOccurrences = enrichedOccurrences.map(o => ({
        ...o,
        locked_by_email: o.locked_by ? emailMap[o.locked_by] : undefined
      }))
    }
  }

  return (
    <div className="flex flex-col gap-6 font-inter">
      <h2 className="text-2xl font-bold text-[#1b1c1c]">Triagem de Chamados</h2>
      
      <DashboardFilters />

      <DashboardTable occurrences={enrichedOccurrences as any} currentUserId={user?.id} />
    </div>
  )
}

import { createClient } from '@/utils/supabase/server'
import { redirect } from 'next/navigation'
import { getAuditLogs } from '@/actions/audit'
import { getPrefeituras } from '@/actions/filters'
import AuditClient from './AuditClient'

export const dynamic = 'force-dynamic'

export default async function AuditoriaPage({
  searchParams,
}: {
  searchParams: Promise<{ [key: string]: string | string[] | undefined }>
}) {
  const supabase = await createClient()
  
  // 1. Verificação de acesso (Apenas nível >= 3)
  const { data: { user } } = await supabase.auth.getUser()
  if (!user) redirect('/login')

  const { data: currentUR } = await supabase
    .from('user_roles')
    .select('roles(access_level)')
    .eq('user_id', user.id)
    .single()

  const currentRoles = currentUR?.roles as unknown as { access_level: number } | { access_level: number }[] | null
  const accessLevel = Array.isArray(currentRoles)
    ? currentRoles[0]?.access_level || 0
    : currentRoles?.access_level || 0
  if (accessLevel < 3) {
    return (
      <div className="p-6">
        <div className="bg-red-50 text-red-800 p-4 rounded-md border border-red-200">
          Acesso negado. Você precisa ser Auditor ou Administrador para visualizar esta página.
        </div>
      </div>
    )
  }

  const resolvedParams = await searchParams
  
  const page = typeof resolvedParams.page === 'string' ? parseInt(resolvedParams.page, 10) : 1
  const limit = typeof resolvedParams.limit === 'string' ? parseInt(resolvedParams.limit, 10) : 25
  const startDate = typeof resolvedParams.startDate === 'string' ? resolvedParams.startDate : undefined
  const endDate = typeof resolvedParams.endDate === 'string' ? resolvedParams.endDate : undefined
  const userName = typeof resolvedParams.userName === 'string' ? resolvedParams.userName : undefined
  
  const prefeituraId = typeof resolvedParams.prefeituraId === 'string' ? resolvedParams.prefeituraId : undefined
  const departmentId = typeof resolvedParams.departmentId === 'string' ? resolvedParams.departmentId : undefined
  const categoryId = typeof resolvedParams.categoryId === 'string' ? resolvedParams.categoryId : undefined
  const userId = typeof resolvedParams.userId === 'string' ? resolvedParams.userId : undefined
  
  const sortBy = (resolvedParams.sortBy === 'author' || resolvedParams.sortBy === 'date') ? resolvedParams.sortBy : 'date'
  const sortOrder = (resolvedParams.sortOrder === 'asc' || resolvedParams.sortOrder === 'desc') ? resolvedParams.sortOrder : 'desc'

  const [{ data, total, totalPages }, prefeituras] = await Promise.all([
    getAuditLogs({
      page,
      limit,
      startDate,
      endDate,
      userName,
      prefeituraId,
      departmentId,
      categoryId,
      userId,
      sortBy,
      sortOrder,
    }),
    getPrefeituras()
  ])

  return (
    <div className="flex flex-col gap-6">
      <div>
        <h1 className="font-inter text-2xl font-bold text-[#00254d]">Corregedoria e Auditoria</h1>
        <p className="text-sm text-[#434750]">
          Rastreabilidade total das ações no sistema.
        </p>
      </div>

      <AuditClient 
        initialData={data} 
        total={total}
        page={page}
        totalPages={totalPages}
        initialPrefeituras={prefeituras}
        initialFilters={{ 
          startDate, 
          endDate, 
          userName,
          prefeituraId,
          departmentId,
          categoryId,
          userId,
          sortBy,
          sortOrder
        }}
      />
    </div>
  )
}

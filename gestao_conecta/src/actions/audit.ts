'use server'

import { createServerClient } from '@supabase/ssr'
import { cookies } from 'next/headers'

export type AuditLog = {
  id: string
  created_at: string
  action: string
  entity_type: 'OCCURRENCE' | 'SYSTEM' | 'USER'
  entity_id: string
  user_id: string
  user_name: string
  user_email: string
  details: any
}

export async function getAuditLogs({
  page = 1,
  limit = 25,
  startDate,
  endDate,
  userName,
  prefeituraId,
  departmentId,
  categoryId,
  userId,
  sortBy = 'date',
  sortOrder = 'desc',
}: {
  page?: number
  limit?: number
  startDate?: string
  endDate?: string
  userName?: string
  prefeituraId?: string
  departmentId?: string
  categoryId?: string
  userId?: string
  sortBy?: 'date' | 'author'
  sortOrder?: 'asc' | 'desc'
}) {
  const cookieStore = await cookies()
  const supabase = createServerClient(
    process.env.NEXT_PUBLIC_SUPABASE_URL!,
    process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!,
    {
      cookies: {
        getAll() {
          return cookieStore.getAll()
        },
      },
    }
  )

  // 1. Query occurrence_timeline (Operational logs & internal notes)
  // We join occurrences to be able to filter by prefeituraId, departmentId, categoryId
  let occurrenceQuery = supabase
    .from('occurrence_timeline')
    .select(`
      id,
      created_at,
      occurrence_id,
      created_by,
      old_status,
      new_status,
      description,
      is_public,
      occurrences!inner(
        prefeitura_id,
        department_id,
        category_id
      )
    `)

  // 2. Query system_audit_logs (Administrative logs)
  let systemQuery = supabase
    .from('system_audit_logs')
    .select(`
      id,
      created_at,
      action_type,
      target_user_id,
      admin_id,
      roles!system_audit_logs_new_role_id_fkey ( name )
    `)

  // Apply filters
  if (prefeituraId) {
    occurrenceQuery = occurrenceQuery.eq('occurrences.prefeitura_id', prefeituraId)
  }
  if (departmentId) {
    // Note: occurrences.department_id is currently null in the DB, so we must filter by the department's categories
    const { data: catData } = await supabase.from('categories').select('id').eq('department_id', departmentId)
    const catIds = catData?.map(c => c.id) || []
    if (catIds.length > 0) {
      occurrenceQuery = occurrenceQuery.in('occurrences.category_id', catIds)
    } else {
      // If the department has no categories, it can't have occurrences
      occurrenceQuery = occurrenceQuery.eq('occurrences.department_id', departmentId)
    }
  }
  if (categoryId) {
    occurrenceQuery = occurrenceQuery.eq('occurrences.category_id', categoryId)
  }
  if (userId) {
    occurrenceQuery = occurrenceQuery.eq('created_by', userId)
    systemQuery = systemQuery.eq('admin_id', userId)
  }

  if (startDate) {
    const startObj = new Date(startDate)
    startObj.setUTCHours(0, 0, 0, 0)
    const startStr = startObj.toISOString()
    occurrenceQuery = occurrenceQuery.gte('created_at', startStr)
    systemQuery = systemQuery.gte('created_at', startStr)
  }
  if (endDate) {
    const endObj = new Date(endDate)
    endObj.setUTCHours(23, 59, 59, 999)
    const endStr = endObj.toISOString()
    occurrenceQuery = occurrenceQuery.lte('created_at', endStr)
    systemQuery = systemQuery.lte('created_at', endStr)
  }

  const [occurrenceRes, systemRes, emailsRes] = await Promise.all([
    occurrenceQuery,
    (departmentId || categoryId) ? { data: [], error: null } : systemQuery, // system logs don't have dept/category
    supabase.rpc('get_admin_user_emails')
  ])

  if (occurrenceRes.error) console.error('Error fetching occurrence_timeline:', occurrenceRes.error)
  if (systemRes.error) console.error('Error fetching system_audit_logs:', systemRes.error)

  const emailMap: Record<string, string> = Object.fromEntries(
    emailsRes.data?.map((u: any) => [u.id, u.email]) || []
  )

  // Format and merge data
  let allLogs: AuditLog[] = []

  if (occurrenceRes.data) {
    occurrenceRes.data.forEach((log: any) => {
      const email = emailMap[log.created_by] || 'Sem e-mail'
      
      let actionName = 'UPDATE_OCCURRENCE'
      if (!log.is_public && !log.old_status) {
        actionName = 'ADD_INTERNAL_NOTE'
      }

      allLogs.push({
        id: log.id,
        created_at: log.created_at,
        action: actionName,
        entity_type: 'OCCURRENCE',
        entity_id: log.occurrence_id,
        user_id: log.created_by,
        user_name: email.split('@')[0],
        user_email: email,
        details: {
          description: log.description,
          old_status: log.old_status,
          new_status: log.new_status,
          is_public: log.is_public
        }
      })
    })
  }

  if (systemRes.data) {
    systemRes.data.forEach((log: any) => {
      const email = emailMap[log.admin_id] || 'Sem e-mail'
      const targetEmail = emailMap[log.target_user_id] || log.target_user_id
      const newRole = log.roles?.name
      allLogs.push({
        id: log.id,
        created_at: log.created_at,
        action: log.action_type || 'SYSTEM_ACTION',
        entity_type: 'USER',
        entity_id: log.target_user_id,
        user_id: log.admin_id,
        user_name: email.split('@')[0],
        user_email: email,
        details: {
          target_user: targetEmail,
          new_role: newRole
        }
      })
    })
  }

  // Filter by userName (search query) if provided, checking name, email AND protocol/entity_id
  if (userName) {
    const search = userName.toLowerCase()
    allLogs = allLogs.filter(log => 
      log.user_name.toLowerCase().includes(search) || 
      log.user_email.toLowerCase().includes(search) ||
      log.entity_id.toLowerCase().includes(search)
    )
  }

  // Sorting
  allLogs.sort((a, b) => {
    if (sortBy === 'author') {
      const cmp = a.user_name.localeCompare(b.user_name)
      return sortOrder === 'asc' ? cmp : -cmp
    } else {
      // sort by date
      const timeA = new Date(a.created_at).getTime()
      const timeB = new Date(b.created_at).getTime()
      return sortOrder === 'asc' ? timeA - timeB : timeB - timeA
    }
  })

  // Paginate
  const start = (page - 1) * limit
  const end = start + limit
  const paginatedLogs = allLogs.slice(start, end)

  return {
    data: paginatedLogs,
    total: allLogs.length,
    page,
    limit,
    totalPages: Math.ceil(allLogs.length / limit)
  }
}

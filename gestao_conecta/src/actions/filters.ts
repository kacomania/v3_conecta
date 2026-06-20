'use server'

import { createServerClient } from '@supabase/ssr'
import { cookies } from 'next/headers'

export type FilterOption = {
  id: string
  name: string
}

async function getSupabase() {
  const cookieStore = await cookies()
  return createServerClient(
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
}

export async function getPrefeituras(): Promise<FilterOption[]> {
  const supabase = await getSupabase()
  const { data, error } = await supabase
    .from('prefeituras')
    .select('id, name')
    .order('name')
  
  if (error) {
    console.error('Error fetching prefeituras for filter:', error)
    return []
  }
  return data
}

export async function getDepartments(prefeituraId: string): Promise<FilterOption[]> {
  if (!prefeituraId) return []
  const supabase = await getSupabase()
  const { data, error } = await supabase
    .from('departments')
    .select('id, name')
    .or(`prefeitura_id.eq.${prefeituraId},prefeitura_id.is.null`)
    .order('name')
  
  if (error) {
    console.error('Error fetching departments for filter:', error)
    return []
  }
  return data
}

export async function getCategories(departmentId: string): Promise<FilterOption[]> {
  if (!departmentId) return []
  const supabase = await getSupabase()
  const { data, error } = await supabase
    .from('categories')
    .select('id, name')
    .eq('department_id', departmentId)
    .order('name')
  
  if (error) {
    console.error('Error fetching categories for filter:', error)
    return []
  }
  return data
}

export async function getUsersByDepartment(prefeituraId: string, departmentId: string): Promise<FilterOption[]> {
  if (!prefeituraId || !departmentId) return []
  const supabase = await getSupabase()
  
  // Get all user mappings for this department
  const { data: udData, error: udError } = await supabase
    .from('user_departments')
    .select('user_id')
    .eq('prefeitura_id', prefeituraId)
    .eq('department_id', departmentId)

  if (udError) {
    console.error('Error fetching user_departments for filter:', udError)
    return []
  }

  const userIds = udData.map(ud => ud.user_id)
  if (userIds.length === 0) return []

  // Fetch emails/names for those user IDs using admin_user_emails view
  const { data: emailsData, error: emailsError } = await supabase
    .rpc('get_admin_user_emails')
    .select('id, email')
    .in('id', userIds)

  if (emailsError) {
    console.error('Error fetching user emails for filter:', emailsError)
    return []
  }

  return emailsData.map(u => ({
    id: u.id,
    name: u.email // Using email as the display name
  }))
}

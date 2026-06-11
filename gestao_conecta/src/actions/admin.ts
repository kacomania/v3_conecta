'use server'

import { revalidatePath } from 'next/cache'
import { createClient } from '@/utils/supabase/server'

// ─── Departamentos ──────────────────────────────────────────────────────────

export async function createDepartment(prevState: any, formData: FormData) {
  const supabase = await createClient()
  const name = formData.get('name') as string
  
  if (!name?.trim()) return { error: 'Nome do departamento é obrigatório' }

  const { data: { user } } = await supabase.auth.getUser()
  if (!user) return { error: 'Não autenticado' }

  const { data: userRole } = await supabase
    .from('user_roles')
    .select('prefeitura_id')
    .eq('user_id', user.id)
    .single()

  const prefeitura_id = userRole?.prefeitura_id
  if (!prefeitura_id) return { error: 'Prefeitura não associada' }

  const { error } = await supabase.from('departments').insert({ 
    name: name.trim(),
    prefeitura_id
  })
  
  if (error) {
    if (error.code === '23505' || error.message.includes('unique constraint')) {
      return { error: 'Um departamento com este nome já existe nesta prefeitura.' }
    }
    return { error: error.message }
  }
  
  revalidatePath('/dashboard', 'layout')
  return { error: null }
}

export async function deleteDepartment(formData: FormData) {
  const supabase = await createClient()
  const id = formData.get('id') as string
  
  if (!id) return

  const { error } = await supabase.from('departments').delete().eq('id', id)
  if (error) throw new Error(error.message)
  
  revalidatePath('/dashboard', 'layout')
}

// ─── Categorias ─────────────────────────────────────────────────────────────

export async function createCategory(formData: FormData) {
  const supabase = await createClient()
  const name = formData.get('name') as string
  const department_id = formData.get('department_id') as string
  const sla_hours_raw = formData.get('sla_hours')
  const sla_hours = sla_hours_raw ? parseInt(sla_hours_raw as string, 10) : 72
  
  if (!name?.trim() || !department_id) {
    throw new Error('Nome da categoria e departamento são obrigatórios')
  }

  const { data: { user } } = await supabase.auth.getUser()
  if (!user) throw new Error('Não autenticado')

  const { data: userRole } = await supabase
    .from('user_roles')
    .select('prefeitura_id')
    .eq('user_id', user.id)
    .single()

  const prefeitura_id = userRole?.prefeitura_id
  if (!prefeitura_id) throw new Error('Prefeitura não associada')

  const { error } = await supabase.from('categories').insert({ 
    name: name.trim(),
    department_id,
    prefeitura_id,
    sla_hours
  })

  if (error) {
    if (error.code === '23505' || error.message.includes('unique constraint')) {
      throw new Error('Uma categoria com este nome já existe nesta prefeitura.')
    }
    throw new Error(error.message)
  }
  
  if (user?.id) {
    await supabase.from('system_audit_logs').insert({
      admin_id: user.id,
      target_user_id: user.id, // Referenciando o próprio admin pois a tabela exige target_user_id
      action_type: `Criou a categoria: ${name.trim()}`
    })
  }
  
  revalidatePath('/dashboard', 'layout')
}

export async function deleteCategory(formData: FormData) {
  const supabase = await createClient()
  const id = formData.get('id') as string
  
  if (!id) return

  const { error } = await supabase.from('categories').delete().eq('id', id)
  if (error) throw new Error(error.message)
  
  const { data: { user } } = await supabase.auth.getUser()
  if (user?.id) {
    await supabase.from('system_audit_logs').insert({
      admin_id: user.id,
      target_user_id: user.id, // Referenciando o próprio admin pois a tabela exige target_user_id
      action_type: `Deletou a categoria ID: ${id}`
    })
  }

  revalidatePath('/dashboard', 'layout')
}

// ─── Cargos (Roles) ─────────────────────────────────────────────────────────

export async function createRole(formData: FormData) {
  const supabase = await createClient()
  const name = formData.get('name') as string
  const access_level = parseInt(formData.get('access_level') as string, 10)
  
  if (!name?.trim() || isNaN(access_level)) {
    throw new Error('Nome e nível de acesso são obrigatórios')
  }

  const { error } = await supabase.from('roles').insert({ 
    name: name.trim(), 
    access_level 
  })
  
  if (error) {
    if (error.code === '23505' || error.message.includes('unique constraint')) {
      throw new Error('Um cargo com este nome já existe no sistema.')
    }
    throw new Error(error.message)
  }
  
  revalidatePath('/dashboard', 'layout')
}

export async function deleteRole(formData: FormData) {
  const supabase = await createClient()
  const id = formData.get('id') as string
  
  if (!id) return

  const { error } = await supabase.from('roles').delete().eq('id', id)
  if (error) throw new Error(error.message)
  
  revalidatePath('/dashboard', 'layout')
}

// ─── Usuários (Gestão de Acessos) ───────────────────────────────────────────

export async function updateUserRole(formData: FormData) {
  const supabase = await createClient()
  const user_id = formData.get('user_id') as string
  const role_id = formData.get('role_id') as string
  const department_ids = formData.getAll('department_id') as string[]
  
  if (!user_id || !role_id) throw new Error('Usuário e Cargo são obrigatórios')

  // 1. Validação de Hierarquia (Segurança)
  const { data: { user } } = await supabase.auth.getUser()
  const adminId = user?.id

  // Nível do executor (quem está logado)
  const { data: currentUR } = await supabase.from('user_roles').select('roles(access_level)').eq('user_id', adminId).single()
  const currentUserRoles = currentUR?.roles as unknown as { access_level: number } | { access_level: number }[] | null
  const currentUserLevel = Array.isArray(currentUserRoles) 
    ? currentUserRoles[0]?.access_level || 0 
    : currentUserRoles?.access_level || 0

  // Nível do alvo (quem será alterado)
  const { data: targetUR } = await supabase.from('user_roles').select('roles(access_level)').eq('user_id', user_id).single()
  const targetUserRoles = targetUR?.roles as unknown as { access_level: number } | { access_level: number }[] | null
  const targetUserLevel = Array.isArray(targetUserRoles)
    ? targetUserRoles[0]?.access_level || 0
    : targetUserRoles?.access_level || 0

  // Nível do novo cargo selecionado
  const { data: newRole } = await supabase.from('roles').select('access_level').eq('id', role_id).single()
  const newRoleLevel = newRole?.access_level || 0

  if (targetUserLevel === 0) {
    throw new Error('Permissão negada: Contas de Cidadão (USER) não podem ser alteradas no painel administrativo.')
  }
  if (targetUserLevel > currentUserLevel) {
    throw new Error('Permissão negada: Não é possível modificar um usuário com cargo superior ao seu.')
  }
  if (newRoleLevel > currentUserLevel) {
    throw new Error('Permissão negada: Não é possível atribuir um cargo superior ao seu.')
  }

  // 2. Atualizar cargo principal
  const { error: roleError } = await supabase
    .from('user_roles')
    .update({ role_id })
    .eq('user_id', user_id)

  if (roleError) throw new Error(roleError.message)

  // 2. Buscar prefeitura_id para inserir nas tabelas
  const { data: userRole } = await supabase
    .from('user_roles')
    .select('prefeitura_id')
    .eq('user_id', user_id)
    .single()

  const prefeitura_id = userRole?.prefeitura_id

  // 3. Atualizar departamentos (Remover antigos e inserir novos)
  const { error: delError } = await supabase
    .from('user_departments')
    .delete()
    .eq('user_id', user_id)

  if (delError) throw new Error(delError.message)

  if (department_ids.length > 0) {
    const inserts = department_ids.map(dep_id => ({
      user_id,
      department_id: dep_id,
      prefeitura_id: prefeitura_id || null
    }))
    
    const { error: insError } = await supabase
      .from('user_departments')
      .insert(inserts)
      
    if (insError) throw new Error(insError.message)
  }

  // 4. Gravar log de auditoria
  const action_desc = formData.get('action_desc') as string || 'Atualizou acessos do usuário'
  
  if (user?.id) {
    await supabase.from('system_audit_logs').insert({
      admin_id: user.id,
      target_user_id: user_id,
      action_type: action_desc,
      new_role_id: role_id,
      new_department_ids: department_ids
    })
  }
  
  revalidatePath('/dashboard', 'layout')
}

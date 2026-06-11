import { createClient } from '@/utils/supabase/server'
import { UserRoleForm } from './user-role-form'

export default async function UsuariosPage() {
  const supabase = await createClient()
  
  // Fetch users roles
  const { data: rawUserRoles } = await supabase
    .from('user_roles')
    .select(`
      user_id,
      roles ( id, name, access_level )
    `)
    
  // Task 1: Ocultar contas USER (nível 0)
  const userRoles = rawUserRoles?.filter((ur: any) => ur.roles?.access_level > 0) || []

  // Fetch user emails from secure view
  const { data: userEmails } = await supabase.from('admin_user_emails').select('*')
  const emailMap: Record<string, string> = Object.fromEntries(userEmails?.map((u: any) => [u.id, u.email]) || [])

  // Fetch user departments
  const { data: userDepts } = await supabase.from('user_departments').select('user_id, department_id')
  const deptMap: Record<string, string[]> = {}
  userDepts?.forEach((ud: any) => {
    if (!deptMap[ud.user_id]) deptMap[ud.user_id] = []
    deptMap[ud.user_id].push(ud.department_id)
  })
  
  // Fetch lists for dropdowns and checkboxes
  const { data: roles } = await supabase.from('roles').select('*').order('name')
  const { data: departments } = await supabase.from('departments').select('*').order('name')

  // Get current user access level
  const { data: { user } } = await supabase.auth.getUser()
  const { data: currentUR } = await supabase.from('user_roles').select('roles(access_level)').eq('user_id', user?.id).single()
  const currentUserLevel = currentUR?.roles?.access_level || 0

  // Filter roles allowed to be assigned
  const availableRoles = roles?.filter(r => r.access_level <= currentUserLevel) || []

  return (
    <div className="p-6 max-w-6xl mx-auto space-y-8">
      <div className="flex justify-between items-center">
        <h1 className="text-2xl font-bold text-gray-900 dark:text-white">Gestão de Usuários</h1>
      </div>

      <div className="bg-white dark:bg-gray-800 rounded-lg shadow-sm border border-gray-100 dark:border-gray-700 overflow-hidden">
        <table className="w-full text-left border-collapse">
          <thead>
            <tr className="bg-gray-50 dark:bg-gray-900/50 border-b dark:border-gray-700">
              <th className="px-6 py-4 font-semibold text-gray-600 dark:text-gray-400">E-mail</th>
              <th className="px-6 py-4 font-semibold text-gray-600 dark:text-gray-400">Cargo</th>
              <th className="px-6 py-4 font-semibold text-gray-600 dark:text-gray-400">Departamentos</th>
              <th className="px-6 py-4 font-semibold text-gray-600 dark:text-gray-400 text-right">Ações</th>
            </tr>
          </thead>
          <tbody className="divide-y divide-gray-100 dark:divide-gray-700">
            {userRoles?.map((ur: any) => (
              <UserRoleForm 
                key={ur.user_id}
                ur={ur}
                emailMap={emailMap}
                deptMap={deptMap}
                availableRoles={availableRoles}
                departments={departments || []}
                currentUserLevel={currentUserLevel}
              />
            ))}
            {(!userRoles || userRoles.length === 0) && (
              <tr>
                <td colSpan={4} className="px-6 py-8 text-center text-gray-500 dark:text-gray-400">
                  Nenhum usuário encontrado.
                </td>
              </tr>
            )}
          </tbody>
        </table>
      </div>
    </div>
  )
}

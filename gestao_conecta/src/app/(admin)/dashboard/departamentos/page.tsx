import { createClient } from '@/utils/supabase/server'
import { deleteDepartment } from '@/actions/admin'
import CreateDepartmentForm from './CreateDepartmentForm'

export default async function DepartamentosPage() {
  const supabase = await createClient()
  const { data: departments } = await supabase.from('departments').select('*').order('name')

  return (
    <div className="p-6 max-w-4xl mx-auto space-y-8">
      <div className="flex justify-between items-center">
        <h1 className="text-2xl font-bold text-gray-900 dark:text-white">Gerenciar Departamentos</h1>
      </div>

      <div className="bg-white dark:bg-gray-800 p-6 rounded-lg shadow-sm border border-gray-100 dark:border-gray-700">
        <h2 className="text-lg font-semibold mb-4 text-gray-800 dark:text-gray-200">Novo Departamento</h2>
        <CreateDepartmentForm />
      </div>

      <div className="bg-white dark:bg-gray-800 rounded-lg shadow-sm border border-gray-100 dark:border-gray-700 overflow-hidden">
        <table className="w-full text-left border-collapse">
          <thead>
            <tr className="bg-gray-50 dark:bg-gray-900/50 border-b dark:border-gray-700">
              <th className="px-6 py-4 font-semibold text-gray-600 dark:text-gray-400">Nome</th>
              <th className="px-6 py-4 font-semibold text-gray-600 dark:text-gray-400 text-right">Ações</th>
            </tr>
          </thead>
          <tbody className="divide-y divide-gray-100 dark:divide-gray-700">
            {departments?.map(dept => (
              <tr key={dept.id} className="hover:bg-gray-50 dark:hover:bg-gray-700/50 transition-colors">
                <td className="px-6 py-4 text-gray-800 dark:text-gray-200">{dept.name}</td>
                <td className="px-6 py-4 text-right">
                  <form action={deleteDepartment}>
                    <input type="hidden" name="id" value={dept.id} />
                    <button 
                      type="submit" 
                      className="text-red-500 hover:text-red-700 font-medium px-3 py-1 rounded-md hover:bg-red-50 dark:hover:bg-red-900/20 transition-colors"
                    >
                      Excluir
                    </button>
                  </form>
                </td>
              </tr>
            ))}
            {(!departments || departments.length === 0) && (
              <tr>
                <td colSpan={2} className="px-6 py-8 text-center text-gray-500 dark:text-gray-400">
                  Nenhum departamento cadastrado.
                </td>
              </tr>
            )}
          </tbody>
        </table>
      </div>
    </div>
  )
}

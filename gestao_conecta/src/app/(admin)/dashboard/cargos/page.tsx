import { createClient } from '@/utils/supabase/server'
import { createRole, deleteRole } from '@/actions/admin'

export default async function CargosPage() {
  const supabase = await createClient()
  const { data: roles } = await supabase.from('roles').select('*').order('access_level', { ascending: false })

  return (
    <div className="p-6 max-w-4xl mx-auto space-y-8">
      <div className="flex justify-between items-center">
        <h1 className="text-2xl font-bold text-gray-900 dark:text-white">Gerenciar Cargos</h1>
      </div>

      <div className="bg-white dark:bg-gray-800 p-6 rounded-lg shadow-sm border border-gray-100 dark:border-gray-700">
        <h2 className="text-lg font-semibold mb-4 text-gray-800 dark:text-gray-200">Novo Cargo</h2>
        <form action={createRole} className="flex gap-4 items-start">
          <div className="flex-1 space-y-2">
            <input 
              type="text" 
              name="name" 
              placeholder="Nome do cargo (ex: MANAGER)" 
              className="w-full px-4 py-2 border rounded-md dark:bg-gray-700 dark:border-gray-600 dark:text-white focus:outline-none focus:ring-2 focus:ring-blue-500"
              required 
            />
          </div>
          <div className="w-32 space-y-2">
            <input 
              type="number" 
              name="access_level" 
              placeholder="Nível (0-5)" 
              min="0"
              max="5"
              className="w-full px-4 py-2 border rounded-md dark:bg-gray-700 dark:border-gray-600 dark:text-white focus:outline-none focus:ring-2 focus:ring-blue-500"
              required 
            />
          </div>
          <button 
            type="submit" 
            className="bg-blue-600 hover:bg-blue-700 text-white px-6 py-2 rounded-md font-medium transition-colors shadow-sm h-[42px]"
          >
            Adicionar
          </button>
        </form>
      </div>

      <div className="bg-white dark:bg-gray-800 rounded-lg shadow-sm border border-gray-100 dark:border-gray-700 overflow-hidden">
        <table className="w-full text-left border-collapse">
          <thead>
            <tr className="bg-gray-50 dark:bg-gray-900/50 border-b dark:border-gray-700">
              <th className="px-6 py-4 font-semibold text-gray-600 dark:text-gray-400">Nome do Cargo</th>
              <th className="px-6 py-4 font-semibold text-gray-600 dark:text-gray-400">Nível de Acesso</th>
              <th className="px-6 py-4 font-semibold text-gray-600 dark:text-gray-400 text-right">Ações</th>
            </tr>
          </thead>
          <tbody className="divide-y divide-gray-100 dark:divide-gray-700">
            {roles?.map(role => (
              <tr key={role.id} className="hover:bg-gray-50 dark:hover:bg-gray-700/50 transition-colors">
                <td className="px-6 py-4 text-gray-800 dark:text-gray-200 font-medium">{role.name}</td>
                <td className="px-6 py-4 text-gray-800 dark:text-gray-200">
                  <span className="inline-flex items-center justify-center px-2 py-1 rounded-full text-xs font-semibold bg-blue-100 text-blue-800 dark:bg-blue-900/30 dark:text-blue-300">
                    Nível {role.access_level}
                  </span>
                </td>
                <td className="px-6 py-4 text-right">
                  <form action={deleteRole}>
                    <input type="hidden" name="id" value={role.id} />
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
            {(!roles || roles.length === 0) && (
              <tr>
                <td colSpan={3} className="px-6 py-8 text-center text-gray-500 dark:text-gray-400">
                  Nenhum cargo cadastrado.
                </td>
              </tr>
            )}
          </tbody>
        </table>
      </div>
    </div>
  )
}

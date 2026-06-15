import { createClient } from '@/utils/supabase/server'
import { deleteCategory } from '@/actions/admin'
import { Fragment } from 'react'
import CreateCategoryForm from './CreateCategoryForm'
import { PageHeader } from '@/components/page-header'

export default async function CategoriasPage() {
  const supabase = await createClient()
  
  // Fetch categories with department names
  const { data: categories } = await supabase
    .from('categories')
    .select('*, departments(name)')
    .order('name')

  // Fetch departments for the select dropdown
  const { data: departments } = await supabase
    .from('departments')
    .select('id, name')
    .order('name')

  // Group categories by department
  const groupedCategories = categories?.reduce((acc, cat) => {
    const deptName = cat.departments?.name || 'Sem Departamento';
    if (!acc[deptName]) acc[deptName] = [];
    acc[deptName].push(cat);
    return acc;
  }, {} as Record<string, typeof categories>) || {};

  const sortedDepts = Object.keys(groupedCategories).sort();

  return (
    <div className="p-6 max-w-4xl mx-auto space-y-8">
      <PageHeader title="Gerenciar Categorias" />

      <div className="bg-white dark:bg-gray-800 p-6 rounded-lg shadow-sm border border-gray-100 dark:border-gray-700">
        <h2 className="text-lg font-semibold mb-4 text-gray-800 dark:text-gray-200">Nova Categoria</h2>
        <CreateCategoryForm departments={departments} />
      </div>

      <div className="bg-white dark:bg-gray-800 rounded-lg shadow-sm border border-gray-100 dark:border-gray-700 overflow-hidden">
        <table className="w-full text-left border-collapse">
          <thead>
            <tr className="bg-gray-50 dark:bg-gray-900/50 border-b dark:border-gray-700">
              <th className="px-6 py-4 font-semibold text-gray-600 dark:text-gray-400">Nome</th>
              <th className="px-6 py-4 font-semibold text-gray-600 dark:text-gray-400">Departamento</th>
              <th className="px-6 py-4 font-semibold text-gray-600 dark:text-gray-400">SLA</th>
              <th className="px-6 py-4 font-semibold text-gray-600 dark:text-gray-400 text-right">Ações</th>
            </tr>
          </thead>
          <tbody className="divide-y divide-gray-100 dark:divide-gray-700">
            {sortedDepts.map(dept => (
              <Fragment key={dept}>
                <tr className="bg-gray-100 dark:bg-gray-800">
                  <td colSpan={4} className="px-6 py-3 font-bold text-gray-700 dark:text-gray-300">
                    {dept}
                  </td>
                </tr>
                {groupedCategories[dept].map((cat: any) => (
                  <tr key={cat.id} className="hover:bg-gray-50 dark:hover:bg-gray-700/50 transition-colors border-b border-gray-100 dark:border-gray-800 last:border-0">
                    <td className="px-6 py-4 text-gray-800 dark:text-gray-200 pl-10">{cat.name}</td>
                    <td className="px-6 py-4 text-gray-800 dark:text-gray-200">{cat.departments?.name || 'N/A'}</td>
                    <td className="px-6 py-4 text-gray-800 dark:text-gray-200">{cat.sla_hours || 72}h</td>
                    <td className="px-6 py-4 text-right">
                      <form action={deleteCategory}>
                        <input type="hidden" name="id" value={cat.id} />
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
              </Fragment>
            ))}
            {(!categories || categories.length === 0) && (
              <tr>
                <td colSpan={4} className="px-6 py-8 text-center text-gray-500 dark:text-gray-400">
                  Nenhuma categoria cadastrada.
                </td>
              </tr>
            )}
          </tbody>
        </table>
      </div>
    </div>
  )
}

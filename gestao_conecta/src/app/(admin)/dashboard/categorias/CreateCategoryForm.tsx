'use client'

import { useActionState } from 'react'
import { createCategory } from '@/actions/admin'

type Department = {
  id: string
  name: string
}

export default function CreateCategoryForm({ departments }: { departments: Department[] | null }) {
  const [state, formAction, pending] = useActionState(createCategory, { error: null })

  return (
    <form action={formAction} className="flex flex-col gap-2">
      <div className="flex gap-4 items-center flex-wrap">
        <input 
          type="text" 
          name="name" 
          placeholder="Nome da categoria" 
          className="flex-1 px-4 py-2 border rounded-md dark:bg-gray-700 dark:border-gray-600 dark:text-white focus:outline-none focus:ring-2 focus:ring-blue-500"
          required 
          disabled={pending}
        />
        <select 
          name="department_id" 
          className="flex-1 px-4 py-2 border rounded-md dark:bg-gray-700 dark:border-gray-600 dark:text-white focus:outline-none focus:ring-2 focus:ring-blue-500"
          required
          defaultValue=""
          disabled={pending}
        >
          <option value="" disabled>Selecione um departamento</option>
          {departments?.map(dept => (
            <option key={dept.id} value={dept.id}>{dept.name}</option>
          ))}
        </select>
        <input 
          type="number" 
          name="sla_hours" 
          placeholder="SLA (horas)" 
          defaultValue="72"
          min="1"
          className="w-32 px-4 py-2 border rounded-md dark:bg-gray-700 dark:border-gray-600 dark:text-white focus:outline-none focus:ring-2 focus:ring-blue-500"
          required 
          disabled={pending}
        />
        <button 
          type="submit" 
          className="bg-blue-600 hover:bg-blue-700 disabled:opacity-50 text-white px-6 py-2 rounded-md font-medium transition-colors shadow-sm"
          disabled={pending}
        >
          {pending ? 'Adicionando...' : 'Adicionar'}
        </button>
      </div>
      {state?.error && <p className="text-red-500 text-sm font-medium mt-2">{state.error}</p>}
    </form>
  )
}

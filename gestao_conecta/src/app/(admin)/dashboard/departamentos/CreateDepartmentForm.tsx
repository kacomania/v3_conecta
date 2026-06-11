'use client'

import { useActionState } from 'react'
import { createDepartment } from '@/actions/admin'

export default function CreateDepartmentForm() {
  const [state, formAction, pending] = useActionState(createDepartment, { error: null })

  return (
    <form action={formAction} className="flex flex-col gap-2">
      <div className="flex gap-4">
        <input 
          type="text" 
          name="name" 
          placeholder="Nome do departamento" 
          className="flex-1 px-4 py-2 border rounded-md dark:bg-gray-700 dark:border-gray-600 dark:text-white focus:outline-none focus:ring-2 focus:ring-blue-500"
          required 
          disabled={pending}
        />
        <button 
          type="submit" 
          className="bg-blue-600 hover:bg-blue-700 text-white px-6 py-2 rounded-md font-medium transition-colors shadow-sm disabled:opacity-50"
          disabled={pending}
        >
          {pending ? 'Adicionando...' : 'Adicionar'}
        </button>
      </div>
      {state?.error && <p className="text-red-500 text-sm font-medium">{state.error}</p>}
    </form>
  )
}

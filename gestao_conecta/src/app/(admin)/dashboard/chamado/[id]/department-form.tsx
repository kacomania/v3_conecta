'use client'

import { useRef, useState, useTransition } from 'react'
import { updateDepartment } from '@/actions/chamados'

type Props = {
  occurrenceId: string
  currentDepartmentId: string | null
  departments: { id: string; name: string }[]
}

export function DepartmentForm({ occurrenceId, currentDepartmentId, departments }: Props) {
  const [isPending, startTransition] = useTransition()
  const [selected, setSelected] = useState(currentDepartmentId ?? '')
  const [justification, setJustification] = useState('')
  const [success, setSuccess] = useState(false)
  const formRef = useRef<HTMLFormElement>(null)

  function handleSubmit(e: React.FormEvent<HTMLFormElement>) {
    e.preventDefault()
    if (!justification.trim()) return

    const formData = new FormData(e.currentTarget)

    startTransition(async () => {
      try {
        await updateDepartment(formData)
        setSuccess(true)
        setJustification('')
        setTimeout(() => setSuccess(false), 3000)
      } catch (error: any) {
        alert('Falha ao atualizar o departamento: ' + (error.message || 'Erro desconhecido.'))
      }
    })
  }

  const isUnchanged = selected === currentDepartmentId || (!currentDepartmentId && selected === '')
  const isValid = !isUnchanged && justification.trim().length > 0 && selected !== ''

  return (
    <form ref={formRef} onSubmit={handleSubmit} className="flex flex-col gap-3">
      <input type="hidden" name="occurrenceId" value={occurrenceId} />

      <label htmlFor="newDepartmentId" className="text-xs font-semibold text-[#737781]">
        Departamento Responsável
      </label>
      <select
        id="newDepartmentId"
        name="newDepartmentId"
        value={selected}
        onChange={(e) => setSelected(e.target.value)}
        className="w-full rounded-lg border border-[#e4e2e1] bg-white px-3 py-2.5 text-sm text-[#1b1c1c] shadow-sm outline-none transition focus:border-[#003B73] focus:ring-2 focus:ring-[#003B73]/20 disabled:opacity-50"
        disabled={isPending}
      >
        <option value="" disabled>Selecione um departamento...</option>
        {departments.map((dept) => (
          <option key={dept.id} value={dept.id}>
            {dept.name}
          </option>
        ))}
      </select>

      <label htmlFor="justification" className="mt-2 text-xs font-semibold text-[#737781]">
        Motivo da Reatribuição <span className="text-red-500">*</span>
      </label>
      <textarea
        id="justification"
        name="justification"
        rows={2}
        value={justification}
        onChange={(e) => setJustification(e.target.value)}
        placeholder="Explique por que este chamado deve ser movido..."
        required
        disabled={isPending || isUnchanged}
        className="w-full resize-none rounded-lg border border-[#e4e2e1] px-3 py-2 text-sm text-[#1b1c1c] shadow-sm outline-none transition focus:border-[#003B73] focus:ring-2 focus:ring-[#003B73]/20 disabled:cursor-not-allowed disabled:bg-[#f6f3f2]"
      />

      <button
        type="submit"
        disabled={isPending || !isValid}
        className="mt-1 flex w-full items-center justify-center gap-2 rounded-lg bg-[#003B73] px-4 py-2.5 text-sm font-semibold text-white shadow-sm transition hover:bg-[#00254d] disabled:cursor-not-allowed disabled:opacity-50"
      >
        {isPending ? (
          <>
            <svg className="h-4 w-4 animate-spin" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24">
              <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4" />
              <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8v4l3-3-3-3v4a8 8 0 100 16v-4l-3 3 3 3v-4a8 8 0 01-8-8z" />
            </svg>
            Reatribuindo…
          </>
        ) : (
          'Reatribuir Departamento'
        )}
      </button>

      {success && (
        <p className="text-center text-xs font-medium text-emerald-600">
          ✓ Departamento atualizado com sucesso!
        </p>
      )}
    </form>
  )
}

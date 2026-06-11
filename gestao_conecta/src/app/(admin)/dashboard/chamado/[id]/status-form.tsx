'use client'

import { useRef, useState, useTransition } from 'react'
import { updateStatus } from '@/actions/chamados'

type Props = {
  occurrenceId: string
  currentStatus: string
  statusOptions: { value: string; label: string }[]
}

export function StatusForm({ occurrenceId, currentStatus, statusOptions }: Props) {
  const [isPending, startTransition] = useTransition()
  const [selected, setSelected] = useState(currentStatus)
  const [success, setSuccess] = useState(false)
  const formRef = useRef<HTMLFormElement>(null)

  function handleSubmit(e: React.FormEvent<HTMLFormElement>) {
    e.preventDefault()
    const formData = new FormData(e.currentTarget)

    startTransition(async () => {
      try {
        await updateStatus(formData)
        setSuccess(true)
        setTimeout(() => setSuccess(false), 3000)
      } catch (error: any) {
        alert('Falha ao atualizar o status: ' + (error.message || 'Erro desconhecido.'))
      }
    })
  }

  return (
    <form ref={formRef} onSubmit={handleSubmit} className="flex flex-col gap-3">
      <input type="hidden" name="occurrenceId" value={occurrenceId} />
      <input type="hidden" name="oldStatus" value={currentStatus} />

      <label htmlFor="newStatus" className="text-xs font-semibold text-[#737781]">
        Novo Status
      </label>
      <select
        id="newStatus"
        name="newStatus"
        value={selected}
        onChange={(e) => setSelected(e.target.value)}
        className="w-full rounded-lg border border-[#e4e2e1] bg-white px-3 py-2.5 text-sm text-[#1b1c1c] shadow-sm outline-none transition focus:border-[#003B73] focus:ring-2 focus:ring-[#003B73]/20 disabled:opacity-50"
        disabled={isPending}
      >
        {statusOptions.map((opt) => (
          <option key={opt.value} value={opt.value}>
            {opt.label}
          </option>
        ))}
      </select>

      <button
        type="submit"
        disabled={isPending || selected === currentStatus}
        className="mt-1 flex w-full items-center justify-center gap-2 rounded-lg bg-[#003B73] px-4 py-2.5 text-sm font-semibold text-white shadow-sm transition hover:bg-[#00254d] disabled:cursor-not-allowed disabled:opacity-50"
      >
        {isPending ? (
          <>
            <svg className="h-4 w-4 animate-spin" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24">
              <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4" />
              <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8v4l3-3-3-3v4a8 8 0 100 16v-4l-3 3 3 3v-4a8 8 0 01-8-8z" />
            </svg>
            Salvando…
          </>
        ) : (
          'Atualizar Status'
        )}
      </button>

      {success && (
        <p className="text-center text-xs font-medium text-emerald-600">
          ✓ Status atualizado com sucesso!
        </p>
      )}
    </form>
  )
}

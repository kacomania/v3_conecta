'use client'

import { useState, useTransition } from 'react'
import { useRouter } from 'next/navigation'
import { lockTicket, unlockTicket } from '@/actions/chamados'

type LockControlProps = {
  occurrenceId: string
  isLockedByMe: boolean
  isFree: boolean
}

export function LockControl({ occurrenceId, isLockedByMe, isFree }: LockControlProps) {
  const router = useRouter()
  const [isPending, startTransition] = useTransition()
  const [error, setError] = useState<string | null>(null)

  const handleAction = async () => {
    setError(null)
    startTransition(async () => {
      try {
        if (isLockedByMe) {
          await unlockTicket(occurrenceId)
        } else if (isFree) {
          await lockTicket(occurrenceId)
        }
        router.refresh()
      } catch (err: any) {
        setError(err.message)
      }
    })
  }

  if (!isLockedByMe && !isFree) {
    return null
  }

  return (
    <div className="flex flex-col gap-2">
      <button
        onClick={handleAction}
        disabled={isPending}
        className={`w-full rounded-md px-4 py-2 font-semibold text-white transition-colors disabled:opacity-50 ${
          isLockedByMe ? 'bg-amber-600 hover:bg-amber-700' : 'bg-[#003B73] hover:bg-[#002a52]'
        }`}
      >
        {isPending
          ? 'Processando...'
          : isLockedByMe
          ? 'Pausar/Encerrar Atendimento'
          : 'Assumir Chamado'}
      </button>
      {error && <p className="text-sm text-red-600">{error}</p>}
    </div>
  )
}

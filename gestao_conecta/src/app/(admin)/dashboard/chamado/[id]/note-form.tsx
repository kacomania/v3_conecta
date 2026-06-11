'use client'

import { useRef, useState, useTransition } from 'react'
import { addTimelineNote } from '@/actions/chamados'

type Props = {
  occurrenceId: string
}

export function NoteForm({ occurrenceId }: Props) {
  const [isPending, startTransition] = useTransition()
  const [isPublic, setIsPublic] = useState(false)
  const [success, setSuccess] = useState(false)
  const formRef = useRef<HTMLFormElement>(null)

  function handleSubmit(e: React.FormEvent<HTMLFormElement>) {
    e.preventDefault()
    const formData = new FormData(e.currentTarget)

    const evidence = formData.get('evidence') as File | null
    if (evidence && evidence.size > 0 && !evidence.type.startsWith('image/')) {
      alert('Falha ao adicionar nota: Apenas arquivos de imagem são permitidos.')
      const fileInput = formRef.current?.querySelector('input[type="file"]') as HTMLInputElement
      if (fileInput) fileInput.value = ''
      return
    }

    startTransition(async () => {
      try {
        await addTimelineNote(formData)
        if (formRef.current) formRef.current.reset()
        setIsPublic(false)
        setSuccess(true)
        setTimeout(() => setSuccess(false), 3000)
      } catch (error: any) {
        alert('Falha ao adicionar nota: ' + (error.message || 'Erro desconhecido.'))
      }
    })
  }

  return (
    <form ref={formRef} onSubmit={handleSubmit} className="flex flex-col gap-4">
      <input type="hidden" name="occurrenceId" value={occurrenceId} />

      <div>
        <label htmlFor="description" className="mb-1.5 block text-xs font-semibold text-[#737781]">
          Mensagem
        </label>
        <textarea
          id="description"
          name="description"
          rows={4}
          placeholder="Descreva a atualização do chamado…"
          required
          disabled={isPending}
          className="w-full resize-none rounded-lg border border-[#e4e2e1] bg-white px-3 py-2.5 text-sm text-[#1b1c1c] placeholder-[#b5b1b1] shadow-sm outline-none transition focus:border-[#003B73] focus:ring-2 focus:ring-[#003B73]/20 disabled:opacity-50"
        />
      </div>

      <div>
        <label htmlFor="evidence" className="mb-1.5 block text-xs font-semibold text-[#737781]">
          Anexar Evidência (Imagem)
        </label>
        <input
          type="file"
          id="evidence"
          name="evidence"
          accept="image/*"
          disabled={isPending}
          className="w-full text-sm text-[#737781] file:mr-4 file:rounded-lg file:border-0 file:bg-[#003B73]/10 file:px-4 file:py-2 file:text-sm file:font-semibold file:text-[#003B73] hover:file:bg-[#003B73]/20 disabled:opacity-50 cursor-pointer"
        />
      </div>

      {/* Toggle: Nota Pública / Interna */}
      <label className="flex cursor-pointer items-center gap-3 rounded-lg border border-[#e4e2e1] bg-[#fbf9f8] px-4 py-3 transition hover:bg-[#f0eded]">
        <input
          type="checkbox"
          name="isPublic"
          id="isPublic"
          checked={isPublic}
          onChange={(e) => setIsPublic(e.target.checked)}
          disabled={isPending}
          className="h-4 w-4 rounded border-[#e4e2e1] accent-[#003B73]"
        />
        <div>
          <p className="text-sm font-semibold text-[#1b1c1c]">
            {isPublic ? '🌐 Nota Pública' : '🔒 Nota Interna'}
          </p>
          <p className="text-xs text-[#737781]">
            {isPublic
              ? 'O cidadão verá esta mensagem no app.'
              : 'Visível apenas para servidores. O cidadão não será notificado.'}
          </p>
        </div>
      </label>

      <button
        type="submit"
        disabled={isPending}
        className="flex w-full items-center justify-center gap-2 rounded-lg bg-[#003B73] px-4 py-2.5 text-sm font-semibold text-white shadow-sm transition hover:bg-[#00254d] disabled:cursor-not-allowed disabled:opacity-50"
      >
        {isPending ? (
          <>
            <svg className="h-4 w-4 animate-spin" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24">
              <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4" />
              <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8v4l3-3-3-3v4a8 8 0 100 16v-4l-3 3 3 3v-4a8 8 0 01-8-8z" />
            </svg>
            Enviando…
          </>
        ) : (
          'Registrar Atualização'
        )}
      </button>

      {success && (
        <p className="text-center text-xs font-medium text-emerald-600">
          ✓ Atualização registrada com sucesso!
        </p>
      )}
    </form>
  )
}

"use client"

import { useRouter, useSearchParams, usePathname } from 'next/navigation'
import { useState, useTransition, useEffect } from 'react'

export function DashboardFilters() {
  const router = useRouter()
  const pathname = usePathname()
  const searchParams = useSearchParams()
  const [isPending, startTransition] = useTransition()

  const [query, setQuery] = useState(searchParams.get('q') || '')
  const [status, setStatus] = useState(searchParams.get('status') || '')

  useEffect(() => {
    setQuery(searchParams.get('q') || '')
    setStatus(searchParams.get('status') || '')
  }, [searchParams])

  const applyFilters = (newQuery: string, newStatus: string) => {
    const params = new URLSearchParams(searchParams.toString())
    if (newQuery) {
      params.set('q', newQuery)
    } else {
      params.delete('q')
    }
    
    if (newStatus) {
      params.set('status', newStatus)
    } else {
      params.delete('status')
    }

    startTransition(() => {
      router.replace(`${pathname}?${params.toString()}`)
    })
  }

  const handleQueryChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setQuery(e.target.value)
  }

  const handleQueryKeyDown = (e: React.KeyboardEvent<HTMLInputElement>) => {
    if (e.key === 'Enter') {
      applyFilters(query, status)
    }
  }

  const handleStatusChange = (e: React.ChangeEvent<HTMLSelectElement>) => {
    setStatus(e.target.value)
    applyFilters(query, e.target.value)
  }

  const clearFilters = () => {
    setQuery('')
    setStatus('')
    startTransition(() => {
      router.replace(pathname)
    })
  }

  return (
    <div className={`flex flex-col gap-4 rounded-lg border border-[#e4e2e1] bg-white p-4 shadow-sm md:flex-row md:items-end ${isPending ? 'opacity-70' : ''}`}>
      <div className="flex-1 space-y-1">
        <label htmlFor="search" className="text-sm font-medium text-[#434750]">
          Buscar por título
        </label>
        <input
          id="search"
          type="text"
          value={query}
          onChange={handleQueryChange}
          onKeyDown={handleQueryKeyDown}
          onBlur={() => applyFilters(query, status)}
          placeholder="Ex: buraco, iluminação..."
          className="w-full rounded-md border border-[#e4e2e1] bg-[#f6f3f2] px-3 py-2 text-sm focus:border-[#003B73] focus:outline-none focus:ring-1 focus:ring-[#003B73]"
        />
      </div>
      
      <div className="w-full space-y-1 md:w-64">
        <label htmlFor="status" className="text-sm font-medium text-[#434750]">
          Status
        </label>
        <select
          id="status"
          value={status}
          onChange={handleStatusChange}
          className="w-full rounded-md border border-[#e4e2e1] bg-[#f6f3f2] px-3 py-2 text-sm focus:border-[#003B73] focus:outline-none focus:ring-1 focus:ring-[#003B73]"
        >
          <option value="">Todos</option>
          <option value="PENDING">Pendente</option>
          <option value="ANALYZING">Em Análise</option>
          <option value="IN_PROGRESS">Em Andamento</option>
          <option value="COMPLETED">Concluído</option>
          <option value="REJECTED">Rejeitado</option>
        </select>
      </div>

      <div className="flex items-center gap-2">
        <button
          type="button"
          onClick={() => applyFilters(query, status)}
          className="rounded-md bg-[#003B73] px-4 py-2 text-sm font-medium text-white transition-colors hover:bg-[#002b54] focus:outline-none focus:ring-2 focus:ring-[#003B73] focus:ring-offset-2"
        >
          Filtrar
        </button>
        <button
          type="button"
          onClick={clearFilters}
          className="rounded-md border border-[#e4e2e1] bg-white px-4 py-2 text-sm font-medium text-[#434750] transition-colors hover:bg-[#f6f3f2] focus:outline-none focus:ring-2 focus:ring-[#003B73] focus:ring-offset-2"
        >
          Limpar
        </button>
      </div>
    </div>
  )
}

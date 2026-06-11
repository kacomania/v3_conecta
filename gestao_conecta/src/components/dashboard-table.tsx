"use client"

import React, { useState, useEffect } from 'react'
import Link from 'next/link'
import { useRouter } from 'next/navigation'
import { createClient } from '@/utils/supabase/client'

export type OccurrenceListType = {
  id: string
  title: string
  description: string
  status: string
  created_at: string
  category_id: string | null
  categories: { name: string } | null
  locked_by?: string | null
  locked_at?: string | null
  locked_by_email?: string
  due_date?: string | null
}

type DashboardTableProps = {
  occurrences: OccurrenceListType[]
  currentUserId?: string
}

type SortColumn = 'category' | 'created_at' | 'status' | 'id' | 'title' | 'due_date'
type SortDirection = 'asc' | 'desc'

export function DashboardTable({ occurrences, currentUserId }: DashboardTableProps) {
  const router = useRouter()
  const [sortColumn, setSortColumn] = useState<SortColumn>('created_at')
  const [sortDirection, setSortDirection] = useState<SortDirection>('desc')
  const [expandedRows, setExpandedRows] = useState<Set<string>>(new Set())

  useEffect(() => {
    const supabase = createClient()
    const channel = supabase.channel('occurrences_dashboard')
      .on('postgres_changes', { event: '*', schema: 'public', table: 'occurrences' }, () => {
        router.refresh()
      })
      .subscribe()

    return () => {
      supabase.removeChannel(channel)
    }
  }, [router])

  const getStatusLabel = (status: string) => {
    switch (status) {
      case 'PENDING': return 'Pendente'
      case 'ANALYZING': return 'Em Análise'
      case 'IN_PROGRESS': return 'Em Andamento'
      case 'COMPLETED': return 'Concluído'
      case 'REJECTED': return 'Rejeitado'
      default: return status
    }
  }

  const getStatusColor = (status: string) => {
    switch (status) {
      case 'PENDING': return 'bg-[#fff8e1] text-[#b08d00]'
      case 'ANALYZING': return 'bg-blue-100 text-blue-800'
      case 'IN_PROGRESS': return 'bg-[#d5e3ff] text-[#001c3b]'
      case 'COMPLETED': return 'bg-[#e6f4ea] text-[#137333]'
      case 'REJECTED': return 'bg-[#ffdad6] text-[#93000a]'
      default: return 'bg-[#e4e2e1] text-[#1b1c1c]'
    }
  }

  const getStatusWeight = (status: string) => {
    switch (status) {
      case 'PENDING': return 1
      case 'ANALYZING': return 2
      case 'IN_PROGRESS': return 3
      case 'COMPLETED': return 4
      case 'REJECTED': return 5
      default: return 99
    }
  }

  const getSlaInfo = (dueDate: string | null | undefined, status: string) => {
    if (!dueDate) return { label: 'N/A', color: 'bg-[#e4e2e1] text-[#737781] border border-[#e4e2e1]' }

    const now = new Date()
    const due = new Date(dueDate)
    const diffHours = (due.getTime() - now.getTime()) / (1000 * 60 * 60)

    if (status === 'COMPLETED') {
      return { label: 'Concluído', color: 'bg-[#f0f5fa] text-[#434750] border border-[#e4e2e1]' }
    }

    if (diffHours < 0) {
      return { label: 'Atrasado', color: 'bg-red-50 text-red-700 border border-red-200' }
    } else if (diffHours <= 24) {
      return { label: 'Vencendo', color: 'bg-amber-50 text-amber-700 border border-amber-200' }
    } else {
      return { label: 'No Prazo', color: 'bg-emerald-50 text-emerald-700 border border-emerald-200' }
    }
  }

  const handleSort = (column: SortColumn) => {
    if (sortColumn === column) {
      setSortDirection(sortDirection === 'asc' ? 'desc' : 'asc')
    } else {
      setSortColumn(column)
      setSortDirection('asc')
    }
  }

  const toggleRow = (id: string) => {
    const newExpanded = new Set(expandedRows)
    if (newExpanded.has(id)) {
      newExpanded.delete(id)
    } else {
      newExpanded.add(id)
    }
    setExpandedRows(newExpanded)
  }

  const sortedOccurrences = [...occurrences].sort((a, b) => {
    let comparison = 0

    switch (sortColumn) {
      case 'category':
        const catA = a.categories?.name || 'Geral'
        const catB = b.categories?.name || 'Geral'
        comparison = catA.localeCompare(catB)
        break
      case 'created_at':
        comparison = new Date(a.created_at).getTime() - new Date(b.created_at).getTime()
        break
      case 'due_date':
        const dateA = a.due_date ? new Date(a.due_date).getTime() : Infinity
        const dateB = b.due_date ? new Date(b.due_date).getTime() : Infinity
        comparison = dateA - dateB
        break
      case 'status':
        comparison = getStatusWeight(a.status) - getStatusWeight(b.status)
        break
      case 'id':
        comparison = a.id.localeCompare(b.id)
        break
      case 'title':
        comparison = a.title.localeCompare(b.title)
        break
    }

    return sortDirection === 'asc' ? comparison : -comparison
  })

  const SortIcon = ({ column }: { column: SortColumn }) => {
    if (sortColumn !== column) return <span className="ml-1 text-[#b5b1b1]">↕</span>
    return <span className="ml-1 text-[#003B73]">{sortDirection === 'asc' ? '↑' : '↓'}</span>
  }

  const exportCSV = () => {
    const headers = ['Protocolo', 'Título', 'Categoria', 'Status', 'Data', 'SLA', 'Atendimento']
    const csvContent = [
      headers.join(';'),
      ...sortedOccurrences.map(o => {
        const thirtyMinutesAgo = new Date(Date.now() - 30 * 60 * 1000)
        const isLocked = o.locked_by && o.locked_at && new Date(o.locked_at) > thirtyMinutesAgo
        const atendimento = isLocked ? `Travado por ${o.locked_by_email || 'Alguém'}` : 'Livre'
        const slaInfo = getSlaInfo(o.due_date, o.status)

        return [
          o.id.split('-')[0].toUpperCase(),
          `"${o.title.replace(/"/g, '""')}"`,
          `"${o.categories?.name || 'Geral'}"`,
          getStatusLabel(o.status),
          new Date(o.created_at).toLocaleDateString('pt-BR'),
          `"${slaInfo.label}"`,
          `"${atendimento}"`
        ].join(';')
      })
    ].join('\n')

    const BOM = '\uFEFF'
    const blob = new Blob([BOM + csvContent], { type: 'text/csv;charset=utf-8;' })
    const link = document.createElement('a')
    const url = URL.createObjectURL(blob)
    link.setAttribute('href', url)
    link.setAttribute('download', `chamados_export_${new Date().getTime()}.csv`)
    document.body.appendChild(link)
    link.click()
    document.body.removeChild(link)
  }

  if (occurrences.length === 0) {
    return (
      <div className="overflow-hidden rounded-lg border border-[#e4e2e1] bg-white shadow-sm p-8 text-center text-[#737781]">
        Nenhum chamado encontrado para a sua busca.
      </div>
    )
  }

  const myLockedOccurrence = occurrences.find(o => {
    if (!o.locked_by || !o.locked_at) return false
    const thirtyMinutesAgo = new Date(Date.now() - 30 * 60 * 1000)
    return o.locked_by === currentUserId && new Date(o.locked_at) > thirtyMinutesAgo
  })

  return (
    <div className="flex flex-col gap-4">
      {myLockedOccurrence && (
        <div className="flex items-center justify-between rounded-lg border border-[#003B73] bg-[#f0f5fa] p-4 text-[#003B73]">
          <div className="flex items-center gap-3">
            <svg className="h-5 w-5" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M13 16h-1v-4h-1m1-4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z" /></svg>
            <p className="text-sm font-medium">Você possui o chamado <strong>{myLockedOccurrence.id.split('-')[0].toUpperCase()}</strong> em atendimento.</p>
          </div>
          <Link href={`/dashboard/chamado/${myLockedOccurrence.id}`} className="rounded-md bg-[#003B73] px-4 py-2 text-sm font-medium text-white transition-colors hover:bg-[#002a52]">
            Ir para o chamado
          </Link>
        </div>
      )}

      <div className="flex justify-end">
        <button
          onClick={exportCSV}
          className="inline-flex items-center gap-2 rounded-md bg-[#f0eded] px-4 py-2 text-sm font-medium text-[#434750] transition-colors hover:bg-[#e4e2e1]"
        >
          <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 16v1a3 3 0 003 3h10a3 3 0 003-3v-1m-4-4l-4 4m0 0l-4-4m4 4V4" /></svg>
          Exportar CSV
        </button>
      </div>
      <div className="overflow-x-auto overflow-y-hidden rounded-lg border border-[#e4e2e1] bg-white shadow-sm">
      <table className="w-full text-left text-sm">
        <thead className="bg-[#f0eded] text-[#434750]">
          <tr>
            <th 
              className="px-6 py-4 font-semibold cursor-pointer select-none hover:bg-[#e4e2e1] transition-colors"
              onClick={() => handleSort('category')}
            >
              Categoria <SortIcon column="category" />
            </th>
            <th 
              className="px-6 py-4 font-semibold cursor-pointer select-none hover:bg-[#e4e2e1] transition-colors"
              onClick={() => handleSort('created_at')}
            >
              Data <SortIcon column="created_at" />
            </th>
            <th 
              className="px-6 py-4 font-semibold cursor-pointer select-none hover:bg-[#e4e2e1] transition-colors"
              onClick={() => handleSort('due_date')}
            >
              Prazo / SLA <SortIcon column="due_date" />
            </th>
            <th 
              className="px-6 py-4 font-semibold cursor-pointer select-none hover:bg-[#e4e2e1] transition-colors"
              onClick={() => handleSort('status')}
            >
              Status <SortIcon column="status" />
            </th>
            <th 
              className="px-6 py-4 font-semibold cursor-pointer select-none hover:bg-[#e4e2e1] transition-colors"
              onClick={() => handleSort('id')}
            >
              Protocolo <SortIcon column="id" />
            </th>
            <th 
              className="px-6 py-4 font-semibold cursor-pointer select-none hover:bg-[#e4e2e1] transition-colors"
              onClick={() => handleSort('title')}
            >
              Título <SortIcon column="title" />
            </th>
            <th className="px-6 py-4 text-right font-semibold">Ação</th>
          </tr>
        </thead>
        <tbody className="divide-y divide-[#e4e2e1]">
          {sortedOccurrences.map((occurrence) => {
            const isExpanded = expandedRows.has(occurrence.id)
            const slaInfo = getSlaInfo(occurrence.due_date, occurrence.status)
            return (
              <React.Fragment key={occurrence.id}>
                <tr 
                  className={`transition-colors hover:bg-[#f6f3f2] cursor-pointer ${isExpanded ? 'bg-[#fbf9f8]' : ''}`}
                  onClick={() => toggleRow(occurrence.id)}
                >
                  <td className="px-6 py-4 text-[#434750]">
                    {occurrence.categories?.name || 'Geral'}
                  </td>
                  <td className="px-6 py-4 text-[#434750] whitespace-nowrap">
                    {new Date(occurrence.created_at).toLocaleDateString('pt-BR')}
                  </td>
                  <td className="px-6 py-4">
                    <span className={`inline-flex rounded px-2.5 py-1 text-xs font-medium ${slaInfo.color}`}>
                      {slaInfo.label}
                    </span>
                    {occurrence.due_date && (
                      <div className="text-[10px] text-[#737781] mt-1 whitespace-nowrap">
                        {new Date(occurrence.due_date).toLocaleDateString('pt-BR')}
                      </div>
                    )}
                  </td>
                  <td className="px-6 py-4">
                    <span className={`inline-flex rounded px-2.5 py-1 text-xs font-medium ${getStatusColor(occurrence.status)}`}>
                      {getStatusLabel(occurrence.status)}
                    </span>
                  </td>
                  <td className="px-6 py-4">
                    <span className="text-xs text-[#737781] font-mono">{occurrence.id.split('-')[0].toUpperCase()}</span>
                  </td>
                  <td className="px-6 py-4">
                    <p className="font-medium text-[#1b1c1c]">{occurrence.title}</p>
                  </td>
                  <td className="px-6 py-4 text-right" onClick={(e) => e.stopPropagation()}>
                    {(() => {
                      const thirtyMinutesAgo = new Date(Date.now() - 30 * 60 * 1000)
                      const isLocked = occurrence.locked_by && occurrence.locked_at && new Date(occurrence.locked_at) > thirtyMinutesAgo
                      const lockedByMe = isLocked && occurrence.locked_by === currentUserId

                      if (isLocked && !lockedByMe) {
                        return (
                          <div className="flex flex-col items-end gap-1">
                            <span className="flex items-center text-xs font-semibold text-amber-700 bg-amber-50 px-2 py-1 rounded">
                              <svg className="w-3 h-3 mr-1" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 15v2m-6 4h12a2 2 0 002-2v-6a2 2 0 00-2-2H6a2 2 0 00-2 2v6a2 2 0 002 2zm10-10V7a4 4 0 00-8 0v4h8z" /></svg>
                              Em atendimento
                            </span>
                            <span className="text-[10px] text-[#737781] truncate max-w-[120px]" title={occurrence.locked_by_email}>
                              por {occurrence.locked_by_email?.split('@')[0] || 'Alguém'}
                            </span>
                          </div>
                        )
                      }

                      return (
                        <Link
                          href={`/dashboard/chamado/${occurrence.id}`}
                          className={`inline-flex items-center justify-center rounded-md px-3 py-1.5 text-xs font-medium transition-colors ${
                            lockedByMe 
                              ? 'bg-[#003B73] text-white hover:bg-[#002a52]' 
                              : 'bg-white border border-[#e4e2e1] text-[#434750] hover:bg-[#f0eded]'
                          }`}
                        >
                          {lockedByMe ? 'Continuar Atendimento' : 'Assumir Chamado'}
                        </Link>
                      )
                    })()}
                  </td>
                </tr>
                {isExpanded && (
                  <tr className="bg-[#fbf9f8]">
                    <td colSpan={7} className="px-6 py-4 border-t-0">
                      <div className="pl-4 border-l-2 border-[#003B73]">
                        <p className="text-xs font-semibold text-[#737781] mb-1">Descrição do Chamado:</p>
                        <p className="text-sm text-[#434750] whitespace-pre-wrap">{occurrence.description || 'Sem descrição fornecida.'}</p>
                      </div>
                    </td>
                  </tr>
                )}
              </React.Fragment>
            )
          })}
        </tbody>
      </table>
    </div>
    </div>
  )
}

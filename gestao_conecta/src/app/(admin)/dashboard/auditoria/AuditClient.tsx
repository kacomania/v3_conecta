'use client'

import { useRouter, useSearchParams } from 'next/navigation'
import { useState, useCallback, useTransition, useEffect } from 'react'
import { type AuditLog } from '@/actions/audit'
import { getDepartments, getCategories, getUsersByDepartment, type FilterOption } from '@/actions/filters'

const ChevronUp = ({ className }: { className?: string }) => (
  <svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" className={className}><path d="m18 15-6-6-6 6"/></svg>
)

const ChevronDown = ({ className }: { className?: string }) => (
  <svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" className={className}><path d="m6 9 6 6 6-6"/></svg>
)

interface AuditClientProps {
  initialData: AuditLog[]
  total: number
  page: number
  totalPages: number
  initialPrefeituras: FilterOption[]
  initialFilters: {
    startDate?: string
    endDate?: string
    userName?: string
    prefeituraId?: string
    departmentId?: string
    categoryId?: string
    userId?: string
    sortBy?: 'date' | 'author'
    sortOrder?: 'asc' | 'desc'
  }
}

/**
 * Componente Client-side complexo para a visualização de Auditorias.
 * 
 * **Filtros em Cascata e Shallow Routing:** Gerencia os filtros combinados (Prefeitura -> Departamento -> Categoria/Usuário)
 * utilizando o estado local e sincronizando com a URL (`useSearchParams` e `router.push`). Essa abordagem (shallow routing)
 * permite que a URL seja a fonte da verdade sem recarregar a página inteira, mantendo a responsividade.
 * 
 * **Hydration Mismatch:** As datas são renderizadas com o atributo `suppressHydrationWarning` na célula da tabela. 
 * Isso evita que discrepâncias de timezone entre o servidor Node.js e o navegador do cliente quebrem 
 * a hidratação inicial do React.
 */
export default function AuditClient({
  initialData,
  total,
  page,
  totalPages,
  initialPrefeituras,
  initialFilters,
}: AuditClientProps) {
  const router = useRouter()
  const searchParams = useSearchParams()
  const [isPending, startTransition] = useTransition()

  // Text / Date Filters
  const [startDate, setStartDate] = useState(initialFilters.startDate || '')
  const [endDate, setEndDate] = useState(initialFilters.endDate || '')
  const [userName, setUserName] = useState(initialFilters.userName || '')

  // Cascade Dropdown Filters
  const [prefeituraId, setPrefeituraId] = useState(initialFilters.prefeituraId || '')
  const [departmentId, setDepartmentId] = useState(initialFilters.departmentId || '')
  const [categoryId, setCategoryId] = useState(initialFilters.categoryId || '')
  const [userId, setUserId] = useState(initialFilters.userId || '')

  // Cascade Options Data
  const [departments, setDepartments] = useState<FilterOption[]>([])
  const [categories, setCategories] = useState<FilterOption[]>([])
  const [users, setUsers] = useState<FilterOption[]>([])

  // Sorting
  const [sortBy, setSortBy] = useState<'date' | 'author'>(initialFilters.sortBy || 'date')
  const [sortOrder, setSortOrder] = useState<'asc' | 'desc'>(initialFilters.sortOrder || 'desc')

  // Fetch departments when prefeitura changes
  useEffect(() => {
    if (prefeituraId) {
      getDepartments(prefeituraId).then(setDepartments)
    } else {
      setDepartments([])
      setDepartmentId('')
      setCategoryId('')
      setUserId('')
    }
  }, [prefeituraId])

  // Fetch categories & users when department changes
  useEffect(() => {
    if (departmentId) {
      getCategories(departmentId).then(setCategories)
      if (prefeituraId) {
        getUsersByDepartment(prefeituraId, departmentId).then(setUsers)
      }
    } else {
      setCategories([])
      setUsers([])
      setCategoryId('')
      setUserId('')
    }
  }, [departmentId, prefeituraId])

  const updateFilters = useCallback(() => {
    const params = new URLSearchParams(searchParams.toString())
    params.set('page', '1') // Reset to page 1 on new filter
    
    if (startDate) params.set('startDate', startDate)
    else params.delete('startDate')

    if (endDate) params.set('endDate', endDate)
    else params.delete('endDate')

    if (userName) params.set('userName', userName)
    else params.delete('userName')

    if (prefeituraId) params.set('prefeituraId', prefeituraId)
    else params.delete('prefeituraId')

    if (departmentId) params.set('departmentId', departmentId)
    else params.delete('departmentId')

    if (categoryId) params.set('categoryId', categoryId)
    else params.delete('categoryId')

    if (userId) params.set('userId', userId)
    else params.delete('userId')

    params.set('sortBy', sortBy)
    params.set('sortOrder', sortOrder)

    startTransition(() => {
      router.push(`?${params.toString()}`)
    })
  }, [startDate, endDate, userName, prefeituraId, departmentId, categoryId, userId, sortBy, sortOrder, searchParams, router])

  // Trigger search when sorting changes
  useEffect(() => {
    updateFilters()
  // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [sortBy, sortOrder])

  const handlePageChange = (newPage: number) => {
    const params = new URLSearchParams(searchParams.toString())
    params.set('page', newPage.toString())
    startTransition(() => {
      router.push(`?${params.toString()}`)
    })
  }

  const clearFilters = () => {
    setStartDate('')
    setEndDate('')
    setUserName('')
    setPrefeituraId('')
    setDepartmentId('')
    setCategoryId('')
    setUserId('')
    setSortBy('date')
    setSortOrder('desc')
    startTransition(() => {
      router.push('?')
    })
  }

  const toggleSort = (col: 'date' | 'author') => {
    if (sortBy === col) {
      setSortOrder(sortOrder === 'asc' ? 'desc' : 'asc')
    } else {
      setSortBy(col)
      setSortOrder('desc') // default descending for new column
    }
  }

  const getActionBadgeColor = (action: string) => {
    if (action.includes('UPDATE')) return 'bg-blue-100 text-blue-800 border-blue-200'
    if (action.includes('CREATE')) return 'bg-green-100 text-green-800 border-green-200'
    if (action.includes('DELETE')) return 'bg-red-100 text-red-800 border-red-200'
    return 'bg-gray-100 text-gray-800 border-gray-200'
  }

  return (
    <div className="flex flex-col gap-6">
      {/* Filters */}
      <div className="bg-white p-4 rounded-md shadow-sm border border-[#e4e2e1] flex flex-col gap-4">
        
        {/* Cascade Dropdowns Row */}
        <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
          <div className="flex flex-col gap-1">
            <label className="text-xs font-semibold text-[#434750]">Prefeitura</label>
            <select 
              value={prefeituraId} 
              onChange={(e) => setPrefeituraId(e.target.value)}
              className="rounded-md border border-[#e4e2e1] px-3 py-1.5 text-sm outline-none focus:border-[#00254d] bg-white"
            >
              <option value="">Todas as Prefeituras</option>
              {initialPrefeituras.map(p => (
                <option key={p.id} value={p.id}>{p.name}</option>
              ))}
            </select>
          </div>

          {prefeituraId && (
            <div className="flex flex-col gap-1">
              <label className="text-xs font-semibold text-[#434750]">Departamento</label>
              <select 
                value={departmentId} 
                onChange={(e) => {
                  setDepartmentId(e.target.value)
                  setCategoryId('')
                  setUserId('')
                }}
                className="rounded-md border border-[#e4e2e1] px-3 py-1.5 text-sm outline-none focus:border-[#00254d] bg-white"
              >
                <option value="">Todos os Departamentos</option>
                {departments.map(d => (
                  <option key={d.id} value={d.id}>{d.name}</option>
                ))}
              </select>
            </div>
          )}

          {departmentId && (
            <>
              <div className="flex flex-col gap-1">
                <label className="text-xs font-semibold text-[#434750]">Categoria</label>
                <select 
                  value={categoryId} 
                  onChange={(e) => setCategoryId(e.target.value)}
                  className="rounded-md border border-[#e4e2e1] px-3 py-1.5 text-sm outline-none focus:border-[#00254d] bg-white"
                >
                  <option value="">Todas as Categorias</option>
                  {categories.map(c => (
                    <option key={c.id} value={c.id}>{c.name}</option>
                  ))}
                </select>
              </div>

              <div className="flex flex-col gap-1">
                <label className="text-xs font-semibold text-[#434750]">Usuário</label>
                <select 
                  value={userId} 
                  onChange={(e) => setUserId(e.target.value)}
                  className="rounded-md border border-[#e4e2e1] px-3 py-1.5 text-sm outline-none focus:border-[#00254d] bg-white"
                >
                  <option value="">Todos os Usuários</option>
                  {users.map(u => (
                    <option key={u.id} value={u.id}>{u.name}</option>
                  ))}
                </select>
              </div>
            </>
          )}
        </div>

        {/* Date and Text Search Row */}
        <div className="flex flex-wrap items-end gap-4">
          <div className="flex flex-col gap-1">
            <label className="text-xs font-semibold text-[#434750]">Data Inicial</label>
            <input 
              type="date" 
              value={startDate}
              onChange={(e) => setStartDate(e.target.value)}
              className="rounded-md border border-[#e4e2e1] px-3 py-1.5 text-sm outline-none focus:border-[#00254d]"
            />
          </div>
          <div className="flex flex-col gap-1">
            <label className="text-xs font-semibold text-[#434750]">Data Final</label>
            <input 
              type="date" 
              value={endDate}
              onChange={(e) => setEndDate(e.target.value)}
              className="rounded-md border border-[#e4e2e1] px-3 py-1.5 text-sm outline-none focus:border-[#00254d]"
            />
          </div>
          <div className="flex flex-col gap-1 flex-1 min-w-[200px]">
            <label className="text-xs font-semibold text-[#434750]">Busca Geral</label>
            <input 
              type="text" 
              value={userName}
              onChange={(e) => setUserName(e.target.value)}
              onKeyDown={(e) => e.key === 'Enter' && updateFilters()}
              placeholder="Buscar por servidor ou protocolo..."
              className="rounded-md border border-[#e4e2e1] px-3 py-1.5 text-sm outline-none focus:border-[#00254d] w-full"
            />
          </div>
          <button 
            onClick={updateFilters}
            disabled={isPending}
            className="bg-[#00254d] text-white px-4 py-1.5 rounded-md text-sm font-semibold hover:bg-[#001833] transition-colors disabled:opacity-50"
          >
            {isPending ? 'Filtrando...' : 'Filtrar'}
          </button>
          <button 
            onClick={clearFilters}
            disabled={isPending}
            className="bg-[#e4e2e1] text-[#434750] px-4 py-1.5 rounded-md text-sm font-semibold hover:bg-[#d1cfce] transition-colors disabled:opacity-50"
          >
            Limpar
          </button>
        </div>
      </div>

      {/* DataGrid */}
      <div className="bg-white rounded-md shadow-sm border border-[#e4e2e1] overflow-hidden">
        {/* Pagination & Total count (Top) */}
        {(totalPages > 1 || total > 0) && (
          <div className="border-b border-[#e4e2e1] px-4 py-3 flex items-center justify-between bg-[#fbf9f8]">
            <span className="text-sm text-[#434750]">
              {totalPages > 0 && (
                <>Página <span className="font-semibold">{page}</span> de <span className="font-semibold">{totalPages}</span> <span className="mx-2">•</span></>
              )}
              <span className="font-semibold">{total}</span> registros listados na consulta
            </span>
            {totalPages > 1 && (
              <div className="flex gap-2">
                <button
                  onClick={() => handlePageChange(page - 1)}
                  disabled={page <= 1 || isPending}
                  className="px-3 py-1 text-sm border border-[#e4e2e1] rounded bg-white text-[#434750] hover:bg-[#f6f3f2] disabled:opacity-50 transition-colors"
                >
                  Anterior
                </button>
                <button
                  onClick={() => handlePageChange(page + 1)}
                  disabled={page >= totalPages || isPending}
                  className="px-3 py-1 text-sm border border-[#e4e2e1] rounded bg-white text-[#434750] hover:bg-[#f6f3f2] disabled:opacity-50 transition-colors"
                >
                  Próxima
                </button>
              </div>
            )}
          </div>
        )}
        <div className="overflow-x-auto">
          <table className="w-full text-left text-sm border-collapse">
            <thead>
              <tr className="bg-[#fbf9f8] border-b border-[#e4e2e1]">
                <th 
                  className="px-4 py-3 font-semibold text-[#434750] whitespace-nowrap cursor-pointer hover:bg-[#f2f0ef] select-none"
                  onClick={() => toggleSort('date')}
                >
                  <div className="flex items-center gap-1">
                    Data / Hora
                    {sortBy === 'date' && (
                      sortOrder === 'asc' ? <ChevronUp className="w-4 h-4" /> : <ChevronDown className="w-4 h-4" />
                    )}
                  </div>
                </th>
                <th 
                  className="px-4 py-3 font-semibold text-[#434750] cursor-pointer hover:bg-[#f2f0ef] select-none"
                  onClick={() => toggleSort('author')}
                >
                  <div className="flex items-center gap-1">
                    Autor
                    {sortBy === 'author' && (
                      sortOrder === 'asc' ? <ChevronUp className="w-4 h-4" /> : <ChevronDown className="w-4 h-4" />
                    )}
                  </div>
                </th>
                <th className="px-4 py-3 font-semibold text-[#434750]">Ação</th>
                <th className="px-4 py-3 font-semibold text-[#434750]">Entidade Afetada</th>
                <th className="px-4 py-3 font-semibold text-[#434750]">Detalhes</th>
                <th className="px-4 py-3 font-semibold text-[#434750]"></th>
              </tr>
            </thead>
            <tbody className="divide-y divide-[#e4e2e1]">
              {initialData.length > 0 ? (
                initialData.map((log) => (
                  <tr key={log.id} className={`hover:bg-[#fbf9f8] transition-colors ${isPending ? 'opacity-50' : ''}`}>
                    <td suppressHydrationWarning className="px-4 py-3 text-[#1b1c1c] whitespace-nowrap align-top">
                      {new Date(log.created_at).toLocaleString('pt-BR', {
                        day: '2-digit', month: '2-digit', year: 'numeric',
                        hour: '2-digit', minute: '2-digit', second: '2-digit'
                      })}
                    </td>
                    <td className="px-4 py-3 align-top">
                      <div className="font-medium text-[#1b1c1c]">{log.user_name}</div>
                      <div className="text-xs text-[#8e8b8a]">{log.user_email}</div>
                    </td>
                    <td className="px-4 py-3 align-top">
                      <span className={`inline-flex items-center px-2 py-0.5 rounded text-xs font-medium border ${getActionBadgeColor(log.action)}`}>
                        {log.action}
                      </span>
                    </td>
                    <td className="px-4 py-3 align-top">
                      <div className="text-[#1b1c1c] font-medium text-xs">{log.entity_type}</div>
                      <div className="text-[#8e8b8a] text-xs font-mono mt-0.5" title={log.entity_id}>
                        {log.entity_id ? log.entity_id.split('-')[0] + '...' : '-'}
                      </div>
                    </td>
                    <td className="px-4 py-3 align-top text-[#434750] text-xs">
                      {log.details ? (
                        <div className="max-w-xs break-words">
                          {log.details.description && (
                            <div className="mb-1"><span className="font-semibold">Detalhe:</span> {log.details.description}</div>
                          )}
                          {log.details.old_status && log.details.new_status && (
                            <div><span className="font-semibold">Status:</span> {log.details.old_status} &rarr; {log.details.new_status}</div>
                          )}
                          {!log.details.description && !log.details.old_status && (
                            <pre className="text-[10px] bg-[#fbf9f8] p-1 rounded border border-[#e4e2e1] overflow-x-auto max-h-16 whitespace-pre-wrap">
                              {JSON.stringify(log.details, null, 2)}
                            </pre>
                          )}
                        </div>
                      ) : (
                        <span className="text-[#8e8b8a] italic">Sem detalhes adicionais</span>
                      )}
                    </td>
                    <td className="px-4 py-3 align-middle text-right">
                      {log.entity_type === 'OCCURRENCE' && log.entity_id && (
                        <a 
                          href={`/dashboard/chamado/${log.entity_id}`}
                          className="inline-flex items-center justify-center px-2.5 py-1.5 bg-[#f0f4f8] text-[#00254d] text-[11px] font-semibold rounded border border-[#00254d]/20 hover:bg-[#e1e9f0] transition-colors whitespace-nowrap"
                        >
                          Ver Chamado &rarr;
                        </a>
                      )}
                    </td>
                  </tr>
                ))
              ) : (
                <tr>
                  <td colSpan={6} className="px-4 py-8 text-center text-[#8e8b8a]">
                    Nenhum registro de auditoria encontrado.
                  </td>
                </tr>
              )}
            </tbody>
          </table>
        </div>
        
        {/* Pagination & Total count */}
        {(totalPages > 1 || total > 0) && (
          <div className="border-t border-[#e4e2e1] px-4 py-3 flex items-center justify-between bg-[#fbf9f8]">
            <span className="text-sm text-[#434750]">
              {totalPages > 0 && (
                <>Página <span className="font-semibold">{page}</span> de <span className="font-semibold">{totalPages}</span> <span className="mx-2">•</span></>
              )}
              <span className="font-semibold">{total}</span> registros listados na consulta
            </span>
            {totalPages > 1 && (
              <div className="flex gap-2">
                <button
                  onClick={() => handlePageChange(page - 1)}
                  disabled={page <= 1 || isPending}
                  className="px-3 py-1 text-sm border border-[#e4e2e1] rounded bg-white text-[#434750] hover:bg-[#f6f3f2] disabled:opacity-50 transition-colors"
                >
                  Anterior
                </button>
                <button
                  onClick={() => handlePageChange(page + 1)}
                  disabled={page >= totalPages || isPending}
                  className="px-3 py-1 text-sm border border-[#e4e2e1] rounded bg-white text-[#434750] hover:bg-[#f6f3f2] disabled:opacity-50 transition-colors"
                >
                  Próxima
                </button>
              </div>
            )}
          </div>
        )}
      </div>
    </div>
  )
}

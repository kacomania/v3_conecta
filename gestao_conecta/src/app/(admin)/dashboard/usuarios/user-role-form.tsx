'use client'

import { useState, useTransition } from 'react'
import { updateUserRole } from '@/actions/admin'
import { createClient } from '@/utils/supabase/client'

type Props = {
  ur: any
  emailMap: Record<string, string>
  deptMap: Record<string, string[]>
  availableRoles: any[]
  departments: any[]
  currentUserLevel: number
}

export function UserRoleForm({ ur, emailMap, deptMap, availableRoles, departments, currentUserLevel }: Props) {
  const targetLevel = ur.roles?.access_level || 0
  const canEdit = currentUserLevel >= targetLevel
  
  const [isModalOpen, setIsModalOpen] = useState(false)
  const [password, setPassword] = useState('')
  const [error, setError] = useState('')
  const [isPending, startTransition] = useTransition()
  
  const [roleId, setRoleId] = useState(ur.roles?.id || '')
  const [selectedDepts, setSelectedDepts] = useState<string[]>(deptMap[ur.user_id] || [])

  const handleDeptToggle = (deptId: string) => {
    setSelectedDepts(prev => 
      prev.includes(deptId) ? prev.filter(d => d !== deptId) : [...prev, deptId]
    )
  }

  const handleSaveClick = (e: React.FormEvent) => {
    e.preventDefault()
    
    const roleChanged = ur.roles?.id !== roleId
    
    const oldDepts = deptMap[ur.user_id] || []
    const addedIds = selectedDepts.filter(id => !oldDepts.includes(id))
    const removedIds = oldDepts.filter(id => !selectedDepts.includes(id))
    const deptsChanged = addedIds.length > 0 || removedIds.length > 0

    if (!roleChanged && !deptsChanged) {
      alert('Nenhuma alteração foi feita para ser salva.')
      return
    }

    setIsModalOpen(true)
  }

  const handleConfirm = async () => {
    setError('')
    const supabase = createClient()
    const { data: { user: currentUser } } = await supabase.auth.getUser()
    
    if (!currentUser?.email) return
    
    const { error: authError } = await supabase.auth.signInWithPassword({
      email: currentUser.email,
      password
    })
    
    if (authError) {
      setError('Senha incorreta.')
      return
    }

    const formData = new FormData()
    formData.append('user_id', ur.user_id)
    formData.append('role_id', roleId)
    
    // Calcular as mudanças de departamento
    const oldDepts = deptMap[ur.user_id] || []
    const newDepts = selectedDepts

    const addedIds = newDepts.filter(id => !oldDepts.includes(id))
    const removedIds = oldDepts.filter(id => !newDepts.includes(id))

    const addedNames = addedIds.map(id => departments.find(d => d.id === id)?.name).filter(Boolean).join(', ')
    const removedNames = removedIds.map(id => departments.find(d => d.id === id)?.name).filter(Boolean).join(', ')

    const newRole = availableRoles.find(r => r.id === roleId)
    
    let parts = []
    if (ur.roles?.id !== roleId) {
      parts.push(`Alterou cargo para ${newRole?.name || 'desconhecido'}.`)
    }
    if (addedNames) parts.push(`Adicionou: ${addedNames}.`)
    if (removedNames) parts.push(`Removeu: ${removedNames}.`)

    let desc = parts.join(' ') || 'Nenhuma alteração registrada.'

    formData.append('action_desc', desc)
    
    selectedDepts.forEach(d => formData.append('department_id', d))
    
    startTransition(() => {
      updateUserRole(formData).then(() => {
        setIsModalOpen(false)
        setPassword('')
      }).catch(e => setError(e.message))
    })
  }

  return (
    <tr className="hover:bg-gray-50 dark:hover:bg-gray-700/50 transition-colors">
      <td className="px-6 py-4 text-gray-800 dark:text-gray-200 font-medium text-sm align-middle">
        {emailMap[ur.user_id] || 'Sem email (' + ur.user_id.split('-')[0] + '...)'}
      </td>
      <td colSpan={3} className="p-0">
        <form onSubmit={handleSaveClick} className="flex items-center w-full">
          <div className="px-6 py-4 w-1/3">
            <select 
              value={roleId}
              onChange={(e) => setRoleId(e.target.value)}
              className="w-full px-3 py-2 border rounded-md dark:bg-gray-700 dark:border-gray-600 dark:text-white focus:outline-none focus:ring-2 focus:ring-blue-500 disabled:opacity-50 disabled:cursor-not-allowed"
              required
              disabled={!canEdit}
            >
              <option value="">Selecione um cargo</option>
              {canEdit 
                ? availableRoles.map(r => <option key={r.id} value={r.id}>{r.name}</option>)
                : <option value={ur.roles?.id}>{ur.roles?.name}</option>
              }
            </select>
          </div>

          <div className="px-6 py-4 w-1/3">
            <div className={`flex flex-col gap-2 max-h-32 overflow-y-auto p-2 border rounded-md dark:bg-gray-700 dark:border-gray-600 bg-gray-50 dark:bg-gray-800 ${!canEdit ? 'opacity-50 pointer-events-none' : ''}`}>
              {departments?.map(d => {
                const isChecked = selectedDepts.includes(d.id)
                return (
                  <label key={d.id} className="flex items-center gap-2 text-sm text-gray-700 dark:text-gray-300 cursor-pointer">
                    <input 
                      type="checkbox" 
                      checked={isChecked}
                      onChange={() => handleDeptToggle(d.id)}
                      disabled={!canEdit}
                      className="rounded text-blue-600 focus:ring-blue-500"
                    />
                    {d.name}
                  </label>
                )
              })}
              {(!departments || departments.length === 0) && (
                <span className="text-xs text-gray-500">Nenhum departamento cadastrado.</span>
              )}
            </div>
          </div>

          <div className="px-6 py-4 w-1/3 text-right">
            {canEdit ? (
              <button 
                type="submit" 
                className="bg-green-600 hover:bg-green-700 text-white px-4 py-2 rounded-md font-medium transition-colors shadow-sm text-sm"
              >
                Salvar
              </button>
            ) : (
              <span className="text-xs text-gray-400 italic">Protegido por Hierarquia</span>
            )}
          </div>
        </form>

        {/* Modal de Confirmação */}
        {isModalOpen && (
          <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-50 p-4">
            <div className="bg-white dark:bg-gray-800 rounded-lg shadow-xl w-full max-w-md overflow-hidden">
              <div className="p-6 border-b border-gray-100 dark:border-gray-700">
                <h3 className="text-lg font-bold text-gray-900 dark:text-white">Confirmar Alterações</h3>
              </div>
              <div className="p-6 space-y-4">
                <div className="bg-yellow-50 dark:bg-yellow-900/30 p-4 rounded-md border border-yellow-200 dark:border-yellow-800 text-sm text-yellow-800 dark:text-yellow-200">
                  <p><strong>Atenção:</strong> Você está prestes a alterar as permissões de acesso deste usuário.</p>
                  <p className="mt-2 text-xs opacity-80">Cargo selecionado: {availableRoles.find(r => r.id === roleId)?.name}</p>
                  <p className="text-xs opacity-80">Departamentos: {selectedDepts.length}</p>
                </div>
                
                {error && (
                  <div className="text-sm text-red-600 bg-red-50 p-3 rounded-md">{error}</div>
                )}
                
                <div>
                  <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">
                    Confirme sua senha para prosseguir
                  </label>
                  <input
                    type="password"
                    value={password}
                    onChange={(e) => setPassword(e.target.value)}
                    className="w-full px-3 py-2 border rounded-md dark:bg-gray-700 dark:border-gray-600 dark:text-white focus:outline-none focus:ring-2 focus:ring-blue-500"
                    placeholder="Sua senha de administrador"
                  />
                </div>
              </div>
              <div className="p-4 border-t border-gray-100 dark:border-gray-700 flex justify-end gap-3 bg-gray-50 dark:bg-gray-900/50">
                <button
                  onClick={() => { setIsModalOpen(false); setPassword(''); setError(''); }}
                  className="px-4 py-2 text-sm font-medium text-gray-700 dark:text-gray-300 hover:bg-gray-100 dark:hover:bg-gray-800 rounded-md transition-colors"
                  disabled={isPending}
                >
                  Cancelar
                </button>
                <button
                  onClick={handleConfirm}
                  disabled={!password || isPending}
                  className="px-4 py-2 text-sm font-medium bg-blue-600 hover:bg-blue-700 text-white rounded-md transition-colors disabled:opacity-50"
                >
                  {isPending ? 'Autenticando...' : 'Confirmar e Salvar'}
                </button>
              </div>
            </div>
          </div>
        )}
      </td>
    </tr>
  )
}

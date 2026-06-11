"use client"

import { useTransition } from 'react'
import { logout } from '@/app/login/actions'

export function LogoutButton() {
  const [isPending, startTransition] = useTransition()

  const handleLogout = () => {
    if (window.confirm('Tem certeza que deseja sair do sistema?')) {
      startTransition(() => {
        logout()
      })
    }
  }

  return (
    <button
      type="button"
      onClick={handleLogout}
      disabled={isPending}
      className="flex w-full items-center justify-center gap-2 rounded-md border border-[#93000a] bg-white px-3 py-2 text-sm font-medium text-[#93000a] transition-colors hover:bg-[#ffdad6] focus:outline-none focus:ring-2 focus:ring-[#93000a] focus:ring-offset-1 disabled:opacity-70"
    >
      {isPending ? 'Saindo...' : 'Sair / Logout'}
    </button>
  )
}

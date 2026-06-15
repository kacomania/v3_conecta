'use client'

import Link from 'next/link'
import { usePathname } from 'next/navigation'
import { LogoutButton } from '@/components/logout-button'

interface SidebarNavProps {
  accessLevel: number
  logoUrl?: string
  userEmail?: string
}

export function SidebarNav({ accessLevel, logoUrl, userEmail }: SidebarNavProps) {
  const pathname = usePathname()

  const isActive = (path: string) => {
    if (path === '/dashboard') {
      return pathname === '/dashboard' || pathname.startsWith('/dashboard/chamado')
    }
    return pathname.startsWith(path)
  }

  const getLinkClasses = (path: string) => {
    const active = isActive(path)
    return `flex items-center gap-3 rounded-md px-3 py-2 text-sm transition-colors ${
      active
        ? 'bg-primary/10 text-primary font-semibold border-l-4 border-primary'
        : 'font-medium text-[#434750] hover:bg-[#f6f3f2]'
    }`
  }

  return (
    <aside className="flex w-64 flex-col border-r border-[#e4e2e1] bg-[#ffffff]">
      <div className="border-b border-[#e4e2e1] p-6 flex flex-col items-center">
        {logoUrl ? (
          <img src={logoUrl} alt="Logo da Prefeitura" className="max-h-12 mb-4 object-contain" />
        ) : null}
        <h2 className="font-inter text-xl font-bold text-primary">Gestão Conecta</h2>
      </div>
      <nav className="flex-1 space-y-2 p-4">
        <Link href="/dashboard" className={getLinkClasses('/dashboard')}>
          Dashboard
        </Link>
        <Link href="/dashboard/estatisticas" className={getLinkClasses('/dashboard/estatisticas')}>
          Estatísticas
        </Link>
        <Link href="/dashboard/mapa" className={getLinkClasses('/dashboard/mapa')}>
          Mapa
        </Link>
        <Link href="/dashboard/satisfacao" className={getLinkClasses('/dashboard/satisfacao')}>
          Satisfação
        </Link>
        {accessLevel >= 2 && (
          <Link href="/dashboard/comunicados" className={getLinkClasses('/dashboard/comunicados')}>
            Comunicados
          </Link>
        )}
        
        {accessLevel >= 3 && (
          <>
            <div className="pt-4 pb-1">
              <p className="px-3 text-xs font-semibold text-[#8e8b8a] uppercase tracking-wider">Governança</p>
            </div>
            <Link href="/dashboard/auditoria" className={getLinkClasses('/dashboard/auditoria')}>
              Auditoria
            </Link>

            {accessLevel >= 4 && (
              <>
                <div className="pt-4 pb-1">
                  <p className="px-3 text-xs font-semibold text-[#8e8b8a] uppercase tracking-wider">Administração</p>
                </div>
                <Link href="/dashboard/departamentos" className={getLinkClasses('/dashboard/departamentos')}>
                  Departamentos
                </Link>
                <Link href="/dashboard/categorias" className={getLinkClasses('/dashboard/categorias')}>
                  Categorias
                </Link>
                <Link href="/dashboard/cargos" className={getLinkClasses('/dashboard/cargos')}>
                  Cargos
                </Link>
                <Link href="/dashboard/usuarios" className={getLinkClasses('/dashboard/usuarios')}>
                  Usuários
                </Link>
                <Link href="/dashboard/desenvolvedores" className={getLinkClasses('/dashboard/desenvolvedores')}>
                  Desenvolvedores
                </Link>
              </>
            )}
          </>
        )}
        
        {accessLevel >= 5 && (
          <Link href="/dashboard/configuracoes" className={getLinkClasses('/dashboard/configuracoes')}>
            Configurações
          </Link>
        )}
      </nav>
      {userEmail && (
        <div className="mt-auto border-t border-[#e4e2e1] p-4 font-inter text-xs text-[#434750]">
          <div className="mb-4">
            <p className="mb-1">Logado como:</p>
            <p className="truncate font-semibold text-[#1b1c1c]" title={userEmail}>
              {userEmail}
            </p>
          </div>
          <LogoutButton />
        </div>
      )}
    </aside>
  )
}

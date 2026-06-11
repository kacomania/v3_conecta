import Link from 'next/link'
import { redirect } from 'next/navigation'
import { createClient } from '@/utils/supabase/server'

import { LogoutButton } from '@/components/logout-button'

export default async function AdminLayout({
  children,
}: {
  children: React.ReactNode
}) {
  const supabase = await createClient()
  const { data: { user } } = await supabase.auth.getUser()

  if (!user) {
    redirect('/login')
  }

  const { data: roleData } = await supabase
    .from('user_roles')
    .select('roles(access_level)')
    .eq('user_id', user.id)
    .single()
  
  const accessLevel = roleData?.roles?.access_level ?? 0

  return (
    <div className="flex h-screen bg-[#fbf9f8]">
      {/* Sidebar */}
      <aside className="flex w-64 flex-col border-r border-[#e4e2e1] bg-[#ffffff]">
        <div className="border-b border-[#e4e2e1] p-6">
          <h2 className="font-inter text-xl font-bold text-[#00254d]">Gestão Conecta</h2>
        </div>
        <nav className="flex-1 space-y-2 p-4">
          <Link
            href="/dashboard"
            className="flex items-center gap-3 rounded-md bg-[#e4e2e1] px-3 py-2 text-sm font-semibold text-[#00254d] transition-colors"
          >
            Dashboard
          </Link>
          <Link
            href="/dashboard/estatisticas"
            className="flex items-center gap-3 rounded-md px-3 py-2 text-sm font-medium text-[#434750] transition-colors hover:bg-[#f6f3f2]"
          >
            Estatísticas
          </Link>
          <Link
            href="/dashboard/mapa"
            className="flex items-center gap-3 rounded-md px-3 py-2 text-sm font-medium text-[#434750] transition-colors hover:bg-[#f6f3f2]"
          >
            Mapa
          </Link>
          <Link
            href="/dashboard/satisfacao"
            className="flex items-center gap-3 rounded-md px-3 py-2 text-sm font-medium text-[#434750] transition-colors hover:bg-[#f6f3f2]"
          >
            Satisfação
          </Link>
          {accessLevel >= 2 && (
            <Link
              href="/dashboard/comunicados"
              className="flex items-center gap-3 rounded-md px-3 py-2 text-sm font-medium text-[#434750] transition-colors hover:bg-[#f6f3f2]"
            >
              Comunicados
            </Link>
          )}
          {/* Render links only if access level is 3 or more */}
          {(() => {
            if (accessLevel >= 3) {
              return (
                <>
                  <div className="pt-4 pb-1">
                    <p className="px-3 text-xs font-semibold text-[#8e8b8a] uppercase tracking-wider">Governança</p>
                  </div>
                  <Link
                    href="/dashboard/auditoria"
                    className="flex items-center gap-3 rounded-md px-3 py-2 text-sm font-medium text-[#434750] transition-colors hover:bg-[#f6f3f2]"
                  >
                    Auditoria
                  </Link>

                  {accessLevel >= 4 && (
                    <>
                      <div className="pt-4 pb-1">
                        <p className="px-3 text-xs font-semibold text-[#8e8b8a] uppercase tracking-wider">Administração</p>
                      </div>
                      <Link
                        href="/dashboard/departamentos"
                        className="flex items-center gap-3 rounded-md px-3 py-2 text-sm font-medium text-[#434750] transition-colors hover:bg-[#f6f3f2]"
                      >
                        Departamentos
                      </Link>
                      <Link
                        href="/dashboard/categorias"
                        className="flex items-center gap-3 rounded-md px-3 py-2 text-sm font-medium text-[#434750] transition-colors hover:bg-[#f6f3f2]"
                      >
                        Categorias
                      </Link>
                      <Link
                        href="/dashboard/cargos"
                        className="flex items-center gap-3 rounded-md px-3 py-2 text-sm font-medium text-[#434750] transition-colors hover:bg-[#f6f3f2]"
                      >
                        Cargos
                      </Link>
                      <Link
                        href="/dashboard/usuarios"
                        className="flex items-center gap-3 rounded-md px-3 py-2 text-sm font-medium text-[#434750] transition-colors hover:bg-[#f6f3f2]"
                      >
                        Usuários
                      </Link>
                      <Link
                        href="/dashboard/desenvolvedores"
                        className="flex items-center gap-3 rounded-md px-3 py-2 text-sm font-medium text-[#434750] transition-colors hover:bg-[#f6f3f2]"
                      >
                        Desenvolvedores
                      </Link>
                    </>
                  )}
                </>
              )
            }
            return null;
          })()}
          
          {accessLevel >= 5 && (
            <Link
              href="/dashboard/configuracoes"
              className="flex items-center gap-3 rounded-md px-3 py-2 text-sm font-medium text-[#434750] transition-colors hover:bg-[#f6f3f2]"
            >
              Configurações
            </Link>
          )}
        </nav>
        <div className="mt-auto border-t border-[#e4e2e1] p-4 font-inter text-xs text-[#434750]">
          <div className="mb-4">
            <p className="mb-1">Logado como:</p>
            <p className="truncate font-semibold text-[#1b1c1c]" title={user.email}>
              {user.email}
            </p>
          </div>
          <LogoutButton />
        </div>
      </aside>

      {/* Main Content */}
      <main className="flex flex-1 flex-col overflow-hidden">
        {/* Topbar */}
        <header className="flex h-16 items-center border-b border-[#e4e2e1] bg-[#ffffff] px-8">
          <h1 className="font-inter text-lg font-semibold text-[#1b1c1c]">Painel de Controle</h1>
        </header>
        
        {/* Content Area */}
        <div className="flex-1 overflow-auto p-8">
          {children}
        </div>
      </main>
    </div>
  )
}

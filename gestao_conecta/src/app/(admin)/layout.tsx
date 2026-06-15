import Link from 'next/link'
import { redirect } from 'next/navigation'
import { createClient } from '@/utils/supabase/server'

import { LogoutButton } from '@/components/logout-button'
import { SidebarNav } from '@/components/sidebar-nav'

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

  // Fetch user role and prefeitura data
  const { data: roleData } = await supabase
    .from('user_roles')
    .select(`
      roles (
        access_level
      ),
      prefeituras (
        primary_color,
        secondary_color,
        logo_url
      )
    `)
    .eq('user_id', user.id)
    .single()
  
  const currentRoles = roleData?.roles as any
  const accessLevel = Array.isArray(currentRoles) 
    ? currentRoles[0]?.access_level ?? 0 
    : currentRoles?.access_level ?? 0
  const prefeitura = Array.isArray(roleData?.prefeituras) ? roleData?.prefeituras[0] : roleData?.prefeituras
  const primaryColor = prefeitura?.primary_color || '#003B73'
  const secondaryColor = prefeitura?.secondary_color || '#005B9F'
  const logoUrl = prefeitura?.logo_url

  return (
    <div 
      className="flex h-screen bg-[#fbf9f8]" 
      style={{ 
        '--tenant-primary': primaryColor,
        '--tenant-secondary': secondaryColor,
      } as React.CSSProperties}
    >
      {/* Sidebar */}
      <SidebarNav accessLevel={accessLevel} logoUrl={logoUrl} userEmail={user.email} />

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

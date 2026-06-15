import { createClient } from '@/utils/supabase/server';
import { redirect } from 'next/navigation';
import { getPrefeituras } from '@/actions/configuracoes';
import { ConfigManager } from '@/components/config-forms';
import { PageHeader } from '@/components/page-header';

export const dynamic = 'force-dynamic';

export default async function ConfiguracoesPage() {
  const supabase = await createClient();
  const { data: { user } } = await supabase.auth.getUser();

  if (!user) {
    redirect('/login');
  }

  // Verifica nível de acesso
  const { data: roleData } = await supabase
    .from('user_roles')
    .select('roles(access_level), prefeitura_id')
    .eq('user_id', user.id)
    .single();

  const currentRoles = roleData?.roles as unknown as { access_level: number } | { access_level: number }[] | null;
  const accessLevel = Array.isArray(currentRoles)
    ? currentRoles[0]?.access_level ?? 0
    : currentRoles?.access_level ?? 0;
  const userPrefeituraId = roleData?.prefeitura_id;

  // SYSTEM_ADMIN (5) ou CITY_ADMIN (4)
  if (accessLevel < 4) {
    return (
      <div className="flex items-center justify-center h-full">
        <div className="bg-[#ffdad6] text-[#93000a] p-6 rounded-2xl shadow-sm border border-[#ffb4ab]">
          <h2 className="text-xl font-bold mb-2">Acesso Negado</h2>
          <p>Você não tem permissão para acessar esta página.</p>
        </div>
      </div>
    );
  }

  const prefeituras = await getPrefeituras();

  return (
    <div className="flex flex-col gap-6 font-inter pb-10">
      <PageHeader 
        title="Configurações do Sistema" 
        description="Gerenciamento global de Prefeituras e Secretarias." 
      />
      
      <ConfigManager 
        initialPrefeituras={prefeituras} 
        accessLevel={accessLevel} 
        userPrefeituraId={userPrefeituraId} 
      />
    </div>
  );
}

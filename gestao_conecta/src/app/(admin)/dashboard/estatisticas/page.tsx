import { createClient } from '@/utils/supabase/server';
import { getDashboardMetrics } from '@/actions/analytics';
import { AnalyticsCharts, KpiCards } from '@/components/analytics-charts';
import { redirect } from 'next/navigation';
import { PageHeader } from '@/components/page-header';

export const dynamic = 'force-dynamic';

export default async function EstatisticasPage() {
  const supabase = await createClient();
  const { data: { user } } = await supabase.auth.getUser();

  if (!user) {
    redirect('/login');
  }

  // Get prefeitura_id
  const { data: userRole } = await supabase
    .from('user_roles')
    .select('prefeitura_id, roles(access_level)')
    .eq('user_id', user.id)
    .single();

  if (!userRole?.prefeitura_id) {
    return (
      <div className="rounded-md bg-[#ffdad6] p-4 font-inter text-[#93000a]">
        Usuário não associado a uma prefeitura.
      </div>
    );
  }

  const accessLevel = userRole?.roles?.access_level ?? 0;

  let departmentId = undefined;
  if (accessLevel < 2) {
    const { data: userDepts } = await supabase
      .from('user_departments')
      .select('department_id')
      .eq('user_id', user.id);
    
    if (userDepts && userDepts.length > 0) {
      departmentId = userDepts[0].department_id;
    }
  }

  const metrics = await getDashboardMetrics(userRole.prefeitura_id, departmentId);

  return (
    <div className="flex flex-col gap-6 font-inter pb-10">
      <PageHeader title="Estatísticas e Relatórios" />
      
      <KpiCards statusData={metrics.statusDistribution} />
      <AnalyticsCharts 
        statusData={metrics.statusDistribution} 
        categoryData={metrics.categoryDistribution} 
      />
    </div>
  );
}

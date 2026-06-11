'use server';

import { createClient } from '@/utils/supabase/server';

export async function getDashboardMetrics(prefeituraId: string, departmentId?: string) {
  const supabase = await createClient();
  
  const args: any = { p_prefeitura_id: prefeituraId };
  if (departmentId) {
    args.p_department_id = departmentId;
  }

  const { data, error } = await supabase.rpc('get_dashboard_metrics', args);

  if (error) {
    console.error('Error fetching dashboard metrics:', error);
    throw new Error('Failed to fetch dashboard metrics');
  }

  return data as {
    statusDistribution: { status: string; count: number }[];
    categoryDistribution: { category: string | null; count: number }[];
  };
}

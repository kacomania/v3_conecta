'use client';

import { BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer, PieChart, Pie, Cell } from 'recharts';

type StatusData = { status: string; count: number };
type CategoryData = { category: string | null; count: number };

const COLORS = ['#006a69', '#00908d', '#4fd8d5', '#72f5f1', '#ffb4ab', '#93000a'];

const STATUS_MAP: Record<string, string> = {
  'PENDING': 'Aberto',
  'ANALYZING': 'Em Análise',
  'IN_PROGRESS': 'Em Andamento',
  'RESOLVED': 'Resolvido',
  'CLOSED': 'Fechado',
  'REJECTED': 'Rejeitado'
};

export function AnalyticsCharts({ 
  statusData, 
  categoryData 
}: { 
  statusData: StatusData[], 
  categoryData: CategoryData[] 
}) {
  const formattedStatusData = statusData.map(item => ({
    name: STATUS_MAP[item.status] || item.status,
    value: item.count
  }));

  const formattedCategoryData = categoryData.map(item => ({
    name: item.category || 'Sem Categoria',
    value: item.count
  }));

  return (
    <div className="grid grid-cols-1 lg:grid-cols-2 gap-6 mt-6">
      {/* Gráfico de Status */}
      <div className="bg-white p-6 rounded-2xl shadow-sm border border-[#e0e3e2]">
        <h3 className="text-lg font-semibold text-[#1b1c1c] mb-6">Distribuição de Status</h3>
        <div className="h-72">
          <ResponsiveContainer width="100%" height="100%">
            <PieChart>
              <Pie
                data={formattedStatusData}
                cx="50%"
                cy="50%"
                innerRadius={60}
                outerRadius={90}
                paddingAngle={5}
                dataKey="value"
                label={({ name, percent }) => `${name} ${(percent * 100).toFixed(0)}%`}
              >
                {formattedStatusData.map((entry, index) => (
                  <Cell key={`cell-${index}`} fill={COLORS[index % COLORS.length]} />
                ))}
              </Pie>
              <Tooltip />
            </PieChart>
          </ResponsiveContainer>
        </div>
      </div>

      {/* Gráfico de Categorias */}
      <div className="bg-white p-6 rounded-2xl shadow-sm border border-[#e0e3e2]">
        <h3 className="text-lg font-semibold text-[#1b1c1c] mb-6">Chamados por Categoria</h3>
        <div className="h-72">
          <ResponsiveContainer width="100%" height="100%">
            <BarChart data={formattedCategoryData} layout="vertical" margin={{ left: 20 }}>
              <CartesianGrid strokeDasharray="3 3" horizontal={false} stroke="#e0e3e2" />
              <XAxis type="number" hide />
              <YAxis 
                dataKey="name" 
                type="category" 
                axisLine={false} 
                tickLine={false}
                width={120}
                tick={{ fill: '#3f4948', fontSize: 12 }}
              />
              <Tooltip 
                cursor={{ fill: '#f4f5f4' }} 
                contentStyle={{ borderRadius: '8px', border: 'none', boxShadow: '0 4px 6px -1px rgb(0 0 0 / 0.1)' }}
              />
              <Bar dataKey="value" fill="#006a69" radius={[0, 4, 4, 0]} barSize={24} />
            </BarChart>
          </ResponsiveContainer>
        </div>
      </div>
    </div>
  );
}

export function KpiCards({ statusData }: { statusData: StatusData[] }) {
  const getTotalByStatus = (statuses: string[]) => 
    statusData.filter(s => statuses.includes(s.status)).reduce((acc, curr) => acc + curr.count, 0);

  const totalAberto = getTotalByStatus(['PENDING', 'ANALYZING']);
  const totalAndamento = getTotalByStatus(['IN_PROGRESS']);
  const totalConcluido = getTotalByStatus(['RESOLVED', 'CLOSED']);
  const total = statusData.reduce((acc, curr) => acc + curr.count, 0);

  return (
    <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
      <Card title="Total de Chamados" value={total} color="#006a69" />
      <Card title="Abertos / Em Análise" value={totalAberto} color="#ffb4ab" />
      <Card title="Em Andamento" value={totalAndamento} color="#00908d" />
      <Card title="Concluídos" value={totalConcluido} color="#4fd8d5" />
    </div>
  );
}

function Card({ title, value, color }: { title: string, value: number, color: string }) {
  return (
    <div className="bg-white p-6 rounded-2xl shadow-sm border border-[#e0e3e2] flex flex-col gap-2">
      <span className="text-sm font-medium text-[#3f4948] uppercase tracking-wider">{title}</span>
      <span className="text-3xl font-bold" style={{ color }}>{value}</span>
    </div>
  );
}

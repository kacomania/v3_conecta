'use client';

import { PieChart, Pie, Cell, ResponsiveContainer, Tooltip, Legend } from 'recharts';

type SentimentDonutProps = {
  positive: number;
  neutral: number;
  negative: number;
};

export default function SentimentDonut({ positive, neutral, negative }: SentimentDonutProps) {
  const data = [
    { name: 'Positivo', value: positive, color: '#10b981' }, // emerald-500
    { name: 'Neutro', value: neutral, color: '#9ca3af' },   // gray-400
    { name: 'Negativo', value: negative, color: '#ef4444' }, // red-500
  ];

  // If no sentiment data exists yet, avoid rendering an empty broken chart
  const total = positive + neutral + negative;
  if (total === 0) {
    return (
      <div className="flex items-center justify-center h-full text-[#8e8b8a] text-sm">
        Sem dados de sentimento
      </div>
    );
  }

  return (
    <ResponsiveContainer width="100%" height={250}>
      <PieChart>
        <Pie
          data={data}
          cx="50%"
          cy="50%"
          innerRadius={60}
          outerRadius={80}
          paddingAngle={5}
          dataKey="value"
        >
          {data.map((entry, index) => (
            <Cell key={`cell-${index}`} fill={entry.color} />
          ))}
        </Pie>
        <Tooltip 
          formatter={(value: number) => [`${value} avaliações`, 'Quantidade']}
          contentStyle={{ borderRadius: '8px', border: '1px solid #e4e2e1' }}
        />
        <Legend verticalAlign="bottom" height={36} />
      </PieChart>
    </ResponsiveContainer>
  );
}

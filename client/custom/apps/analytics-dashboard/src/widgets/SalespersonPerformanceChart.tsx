import React from 'react';
import { Card } from '../components/ui/Card';
import { ChartDataPoint } from '../types';
import { ResponsiveContainer, BarChart, Bar, XAxis, YAxis, Tooltip, CartesianGrid } from 'recharts';

interface SalespersonPerformanceProps {
  data: ChartDataPoint[];
}

export const SalespersonPerformanceChart: React.FC<SalespersonPerformanceProps> = ({ data }) => {
  const chartData = data.length > 0 ? data : [
    { name: 'Admin', value: 45000 },
    { name: 'John Doe', value: 32000 },
    { name: 'Sarah Connor', value: 28000 },
    { name: 'Alex Smith', value: 21000 }
  ];

  return (
    <Card className="p-5 flex flex-col h-[340px]">
      <h3 className="text-sm font-bold text-slate-200 uppercase tracking-wider mb-2">Revenue per Salesperson</h3>
      <div className="flex-1 w-full min-h-[240px]">
        <ResponsiveContainer width="100%" height="100%">
          <BarChart data={chartData} layout="vertical" margin={{ top: 10, right: 20, left: 20, bottom: 0 }}>
            <CartesianGrid strokeDasharray="3 3" stroke="#1e293b" />
            <XAxis type="number" stroke="#64748b" fontSize={11} tickFormatter={(v) => `$${v / 1000}k`} />
            <YAxis type="category" dataKey="name" stroke="#64748b" fontSize={11} tickLine={false} />
            <Tooltip
              contentStyle={{ background: '#0f172a', borderColor: '#334155', borderRadius: '10px', color: '#fff' }}
              formatter={(val: any) => [`$${Number(val).toLocaleString()}`, 'Revenue']}
            />
            <Bar dataKey="value" fill="#818cf8" radius={[0, 6, 6, 0]} />
          </BarChart>
        </ResponsiveContainer>
      </div>
    </Card>
  );
};

import React from 'react';
import { Card } from '../components/ui/Card';
import { ChartDataPoint } from '../types';
import { ResponsiveContainer, BarChart, Bar, XAxis, YAxis, Tooltip, CartesianGrid, Cell } from 'recharts';

interface OpportunitiesByStageChartProps {
  data: ChartDataPoint[];
}

export const OpportunitiesByStageChart: React.FC<OpportunitiesByStageChartProps> = ({ data }) => {
  const chartData = data.length > 0 ? data : [
    { name: 'Prospecting', value: 24 },
    { name: 'Qualification', value: 18 },
    { name: 'Proposal', value: 12 },
    { name: 'Negotiation', value: 9 },
    { name: 'Closed Won', value: 15 },
    { name: 'Closed Lost', value: 5 }
  ];

  const colors = ['#00a4c8', '#0284c7', '#38bdf8', '#818cf8', '#10b981', '#ef4444'];

  return (
    <Card className="p-5 flex flex-col h-[340px]">
      <h3 className="text-sm font-bold text-slate-200 uppercase tracking-wider mb-2">Opportunities by Stage</h3>
      <div className="flex-1 w-full min-h-[240px]">
        <ResponsiveContainer width="100%" height="100%">
          <BarChart data={chartData} margin={{ top: 10, right: 10, left: -20, bottom: 0 }}>
            <CartesianGrid strokeDasharray="3 3" stroke="#1e293b" />
            <XAxis dataKey="name" stroke="#64748b" fontSize={11} tickLine={false} />
            <YAxis stroke="#64748b" fontSize={11} tickLine={false} />
            <Tooltip
              contentStyle={{ background: '#0f172a', borderColor: '#334155', borderRadius: '10px', color: '#fff' }}
            />
            <Bar dataKey="value" radius={[6, 6, 0, 0]}>
              {chartData.map((entry, index) => (
                <Cell key={`cell-${index}`} fill={colors[index % colors.length]} />
              ))}
            </Bar>
          </BarChart>
        </ResponsiveContainer>
      </div>
    </Card>
  );
};

import React from 'react';
import { Card } from '../components/ui/Card';
import { ChartDataPoint } from '../types';
import { ResponsiveContainer, PieChart, Pie, Cell, Tooltip, Legend } from 'recharts';

interface LeadsBySourceChartProps {
  data: ChartDataPoint[];
}

export const LeadsBySourceChart: React.FC<LeadsBySourceChartProps> = ({ data }) => {
  const chartData = data.length > 0 ? data : [
    { name: 'Website', value: 45, color: '#00a4c8' },
    { name: 'Referral', value: 25, color: '#0284c7' },
    { name: 'Cold Call', value: 15, color: '#38bdf8' },
    { name: 'Email Campaign', value: 10, color: '#818cf8' },
    { name: 'Partner', value: 5, color: '#a855f7' }
  ];

  return (
    <Card className="p-5 flex flex-col h-[340px]">
      <h3 className="text-sm font-bold text-slate-200 uppercase tracking-wider mb-2">Leads by Source</h3>
      <div className="flex-1 w-full min-h-[240px]">
        <ResponsiveContainer width="100%" height="100%">
          <PieChart>
            <Pie
              data={chartData}
              cx="50%"
              cy="50%"
              innerRadius={55}
              outerRadius={85}
              paddingAngle={4}
              dataKey="value"
            >
              {chartData.map((entry, index) => (
                <Cell key={`cell-${index}`} fill={entry.color || '#00a4c8'} />
              ))}
            </Pie>
            <Tooltip
              contentStyle={{ background: '#0f172a', borderColor: '#334155', borderRadius: '10px', color: '#fff' }}
            />
            <Legend verticalAlign="bottom" height={36} />
          </PieChart>
        </ResponsiveContainer>
      </div>
    </Card>
  );
};

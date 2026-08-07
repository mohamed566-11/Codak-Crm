import React from 'react';
import { Card } from '../components/ui/Card';
import { ChartDataPoint } from '../types';
import { ResponsiveContainer, BarChart, Bar, XAxis, YAxis, Tooltip, CartesianGrid } from 'recharts';

interface LeadsByStatusChartProps {
  data: ChartDataPoint[];
}

export const LeadsByStatusChart: React.FC<LeadsByStatusChartProps> = ({ data }) => {
  const chartData = data.length > 0 ? data : [
    { name: 'New', value: 30 },
    { name: 'Assigned', value: 42 },
    { name: 'In Process', value: 28 },
    { name: 'Converted', value: 18 },
    { name: 'Dead', value: 8 }
  ];

  return (
    <Card className="p-5 flex flex-col h-[340px]">
      <h3 className="text-sm font-bold text-slate-200 uppercase tracking-wider mb-2">Leads by Status</h3>
      <div className="flex-1 w-full min-h-[240px]">
        <ResponsiveContainer width="100%" height="100%">
          <BarChart data={chartData} margin={{ top: 10, right: 10, left: -20, bottom: 0 }}>
            <CartesianGrid strokeDasharray="3 3" stroke="#1e293b" />
            <XAxis dataKey="name" stroke="#64748b" fontSize={11} tickLine={false} />
            <YAxis stroke="#64748b" fontSize={11} tickLine={false} />
            <Tooltip
              contentStyle={{ background: '#0f172a', borderColor: '#334155', borderRadius: '10px', color: '#fff' }}
            />
            <Bar dataKey="value" fill="#00a4c8" radius={[6, 6, 0, 0]} />
          </BarChart>
        </ResponsiveContainer>
      </div>
    </Card>
  );
};

import React from 'react';
import { Card } from '../components/ui/Card';
import { ChartDataPoint } from '../types';
import { ResponsiveContainer, AreaChart, Area, XAxis, YAxis, Tooltip, CartesianGrid } from 'recharts';

interface RevenueTrendChartProps {
  data: ChartDataPoint[];
}

export const RevenueTrendChart: React.FC<RevenueTrendChartProps> = ({ data }) => {
  const chartData = data.length > 0 ? data : [
    { name: 'Jan', value: 12000 },
    { name: 'Feb', value: 19000 },
    { name: 'Mar', value: 24000 },
    { name: 'Apr', value: 31000 },
    { name: 'May', value: 28000 },
    { name: 'Jun', value: 45000 },
    { name: 'Jul', value: 52000 }
  ];

  return (
    <Card className="p-5 flex flex-col h-[340px]">
      <h3 className="text-sm font-bold text-slate-200 uppercase tracking-wider mb-2">Revenue Growth & Trend</h3>
      <div className="flex-1 w-full min-h-[240px]">
        <ResponsiveContainer width="100%" height="100%">
          <AreaChart data={chartData} margin={{ top: 10, right: 10, left: 0, bottom: 0 }}>
            <defs>
              <linearGradient id="revenueGrad" x1="0" y1="0" x2="0" y2="1">
                <stop offset="5%" stopColor="#10b981" stopOpacity={0.4} />
                <stop offset="95%" stopColor="#10b981" stopOpacity={0} />
              </linearGradient>
            </defs>
            <CartesianGrid strokeDasharray="3 3" stroke="#1e293b" />
            <XAxis dataKey="name" stroke="#64748b" fontSize={11} tickLine={false} />
            <YAxis stroke="#64748b" fontSize={11} tickLine={false} tickFormatter={(v) => `$${v / 1000}k`} />
            <Tooltip
              contentStyle={{ background: '#0f172a', borderColor: '#334155', borderRadius: '10px', color: '#fff' }}
              formatter={(val: any) => [`$${Number(val).toLocaleString()}`, 'Revenue']}
            />
            <Area type="monotone" dataKey="value" stroke="#10b981" strokeWidth={3} fillOpacity={1} fill="url(#revenueGrad)" />
          </AreaChart>
        </ResponsiveContainer>
      </div>
    </Card>
  );
};

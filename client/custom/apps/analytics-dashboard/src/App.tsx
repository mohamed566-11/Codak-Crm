import React, { useState } from 'react';
import { QueryClient, QueryClientProvider } from '@tanstack/react-query';
import { useAnalyticsData } from './hooks/useAnalyticsData';
import { AnalyticsFilter } from './types';
import { FilterBar } from './components/FilterBar';
import { ExportToolbar } from './components/ExportToolbar';
import { KpiGrid } from './widgets/KpiGrid';
import { LeadsBySourceChart } from './widgets/LeadsBySourceChart';
import { LeadsByStatusChart } from './widgets/LeadsByStatusChart';
import { OpportunitiesByStageChart } from './widgets/OpportunitiesByStageChart';
import { RevenueTrendChart } from './widgets/RevenueTrendChart';
import { SalespersonPerformanceChart } from './widgets/SalespersonPerformanceChart';
import { RecentLeadsTable } from './widgets/RecentLeadsTable';
import { RecentOpportunitiesTable } from './widgets/RecentOpportunitiesTable';
import { BarChart3, ShieldCheck, Sparkles } from 'lucide-react';

const queryClient = new QueryClient();

function DashboardContent() {
  const [filters, setFilters] = useState<AnalyticsFilter>({
    dateRange: 'all',
    leadSource: '',
    status: '',
    assignedUserId: ''
  });

  const {
    kpis,
    leads,
    opps,
    users,
    leadsBySource,
    leadsByStatus,
    oppsByStage,
    revenueBySalesperson,
    revenueTrend,
    isLoading,
    isFetching,
    refetch
  } = useAnalyticsData(filters);

  return (
    <div className="min-h-screen p-4 md:p-6 lg:p-8 max-w-[1800px] mx-auto space-y-6">
      {/* Header Bar */}
      <header className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4 p-5 rounded-3xl border border-slate-800/90 bg-gradient-to-r from-slate-900 via-slate-900/90 to-brand-900/40 backdrop-blur-2xl shadow-stripe">
        <div className="flex items-center gap-3">
          <div className="p-3 rounded-2xl bg-gradient-to-br from-brand-600 to-brand-700 shadow-glow">
            <BarChart3 className="w-6 h-6 text-white" />
          </div>
          <div>
            <div className="flex items-center gap-2">
              <h1 className="text-xl font-extrabold text-white tracking-tight">CodakCRM Enterprise BI & Analytics</h1>
              <span className="px-2 py-0.5 rounded-full text-[10px] font-bold bg-brand-500/20 text-brand-accent border border-brand-500/30 flex items-center gap-1">
                <Sparkles className="w-3 h-3" /> Live Platform
              </span>
            </div>
            <p className="text-xs text-slate-400 font-medium mt-0.5">
              Real-time Business Intelligence • Lead Pipeline • Revenue Trends • Sales Team Performance
            </p>
          </div>
        </div>

        <div className="flex items-center gap-3 w-full sm:w-auto justify-between sm:justify-end">
          <ExportToolbar leads={leads} opps={opps} />
        </div>
      </header>

      {/* Global Filter Control Bar */}
      <FilterBar
        filters={filters}
        setFilters={setFilters}
        users={users}
        isFetching={isFetching}
        onRefresh={refetch}
      />

      {/* Top 12 KPI Cards */}
      <KpiGrid kpis={kpis} isLoading={isLoading} />

      {/* Charts Grid Row 1 */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        <LeadsBySourceChart data={leadsBySource} />
        <LeadsByStatusChart data={leadsByStatus} />
        <OpportunitiesByStageChart data={oppsByStage} />
      </div>

      {/* Charts Grid Row 2 */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        <RevenueTrendChart data={revenueTrend} />
        <SalespersonPerformanceChart data={revenueBySalesperson} />
      </div>

      {/* Interactive Tables Row 3 */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        <RecentLeadsTable leads={leads} />
        <RecentOpportunitiesTable opportunities={opps} />
      </div>

      {/* Footer */}
      <footer className="pt-6 pb-2 text-center border-t border-slate-800/80 text-xs text-slate-500 flex flex-col sm:flex-row items-center justify-between gap-2">
        <div className="flex items-center gap-1.5">
          <ShieldCheck className="w-4 h-4 text-emerald-400" />
          <span>Strict Tier-4 Architecture • Production-Ready BI Engine</span>
        </div>
        <div>
          <span>Powered by CodakCRM Analytics Platform © 2026</span>
        </div>
      </footer>
    </div>
  );
}

export default function App() {
  return (
    <QueryClientProvider client={queryClient}>
      <DashboardContent />
    </QueryClientProvider>
  );
}

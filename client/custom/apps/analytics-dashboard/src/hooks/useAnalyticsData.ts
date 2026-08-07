import { useQuery } from '@tanstack/react-query';
import { leadService } from '../api/leadService';
import { opportunityService } from '../api/opportunityService';
import { userService } from '../api/userService';
import { AnalyticsFilter, KpiMetrics } from '../types';

export function useAnalyticsData(filters: AnalyticsFilter) {
  const autoRefreshInterval = Number(import.meta.env.VITE_AUTO_REFRESH_INTERVAL || 30000);

  const leadsQuery = useQuery({
    queryKey: ['leads', filters],
    queryFn: () => leadService.getLeads(filters),
    refetchInterval: autoRefreshInterval,
    staleTime: 10000
  });

  const oppsQuery = useQuery({
    queryKey: ['opportunities', filters],
    queryFn: () => opportunityService.getOpportunities(filters),
    refetchInterval: autoRefreshInterval,
    staleTime: 10000
  });

  const usersQuery = useQuery({
    queryKey: ['users'],
    queryFn: () => userService.getUsers(),
    staleTime: 60000
  });

  const leads = leadsQuery.data || [];
  const opps = oppsQuery.data || [];
  const users = usersQuery.data || [];

  // Calculate 12 Core KPI Metrics dynamically
  const totalLeads = leads.length;
  const todayStr = new Date().toISOString().substring(0, 10);
  const newLeadsToday = leads.filter((l) => l.createdAt && l.createdAt.startsWith(todayStr)).length;
  const potentialLeads = leads.filter((l) => l.status === 'Assigned' || l.status === 'In Process').length;
  const qualifiedLeads = leads.filter((l) => l.status === 'Qualified' || l.status === 'Converted').length;
  const convertedLeads = leads.filter((l) => l.status === 'Converted').length;
  const lostLeads = leads.filter((l) => l.status === 'Dead' || l.status === 'Recycle').length;
  const conversionRate = totalLeads > 0 ? Number(((convertedLeads / totalLeads) * 100).toFixed(1)) : 0;

  const totalOpportunities = opps.length;
  const wonOpportunities = opps.filter((o) => o.stage === 'Closed Won').length;
  const openOpportunities = opps.filter((o) => o.stage !== 'Closed Won' && o.stage !== 'Closed Lost').length;
  const totalRevenue = opps
    .filter((o) => o.stage === 'Closed Won')
    .reduce((sum, o) => sum + Number(o.amount || 0), 0);
  const avgDealSize = wonOpportunities > 0 ? Math.round(totalRevenue / wonOpportunities) : 0;

  const kpis: KpiMetrics = {
    totalLeads,
    newLeadsToday,
    potentialLeads,
    qualifiedLeads,
    convertedLeads,
    lostLeads,
    conversionRate,
    totalOpportunities,
    wonOpportunities,
    openOpportunities,
    totalRevenue,
    avgDealSize
  };

  // Chart Series Data
  const leadsBySource = leadService.calculateLeadsBySource(leads);
  const leadsByStatus = leadService.calculateLeadsByStatus(leads);
  const oppsByStage = opportunityService.calculateOpportunitiesByStage(opps);
  const revenueBySalesperson = opportunityService.calculateRevenuePerSalesperson(opps);
  const revenueTrend = opportunityService.calculateRevenueTrend(opps);

  const isLoading = leadsQuery.isLoading || oppsQuery.isLoading;
  const isFetching = leadsQuery.isFetching || oppsQuery.isFetching;
  const error = leadsQuery.error || oppsQuery.error;

  return {
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
    error,
    refetch: () => {
      leadsQuery.refetch();
      oppsQuery.refetch();
    }
  };
}

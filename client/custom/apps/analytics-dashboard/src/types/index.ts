export interface LeadRecord {
  id: string;
  name: string;
  status: string;
  source?: string;
  createdAt: string;
  accountName?: string;
  emailAddress?: string;
  assignedUserName?: string;
}

export interface OpportunityRecord {
  id: string;
  name: string;
  stage: string;
  amount: number;
  closeDate?: string;
  createdAt: string;
  accountName?: string;
  assignedUserName?: string;
}

export interface UserRecord {
  id: string;
  name: string;
  userName: string;
  avatarUrl?: string;
}

export interface KpiMetrics {
  totalLeads: number;
  newLeadsToday: number;
  potentialLeads: number;
  qualifiedLeads: number;
  convertedLeads: number;
  lostLeads: number;
  conversionRate: number;
  totalOpportunities: number;
  wonOpportunities: number;
  openOpportunities: number;
  totalRevenue: number;
  avgDealSize: number;
}

export interface ChartDataPoint {
  name: string;
  value: number;
  count?: number;
  revenue?: number;
  color?: string;
}

export interface AnalyticsFilter {
  dateRange: 'all' | '7d' | '30d' | '90d' | '1y';
  leadSource: string;
  status: string;
  assignedUserId: string;
}

export interface WidgetConfig {
  id: string;
  title: string;
  type: 'kpi' | 'chart-bar' | 'chart-donut' | 'chart-area' | 'chart-funnel' | 'table';
  visible: boolean;
  order: number;
}

import { apiClient } from './client';
import { LeadRecord, ChartDataPoint, AnalyticsFilter } from '../types';

export const leadService = {
  async getLeads(filters?: AnalyticsFilter): Promise<LeadRecord[]> {
    try {
      const response = await apiClient.get('/Lead', {
        params: {
          maxSize: 200,
          select: 'id,name,status,source,createdAt,accountName,emailAddress,assignedUserName',
          orderBy: 'createdAt',
          order: 'desc'
        }
      });
      return response.data.list || [];
    } catch (error) {
      console.warn('[Analytics BI] Failed to fetch leads from EspoCRM API, returning empty list.', error);
      return [];
    }
  },

  calculateLeadsBySource(leads: LeadRecord[]): ChartDataPoint[] {
    const sourceMap: Record<string, number> = {};
    leads.forEach((l) => {
      const src = l.source || 'Direct / Unknown';
      sourceMap[src] = (sourceMap[src] || 0) + 1;
    });

    const colors = ['#00a4c8', '#0284c7', '#38bdf8', '#818cf8', '#a855f7', '#ec4899', '#f43f5e'];
    return Object.entries(sourceMap).map(([name, value], idx) => ({
      name,
      value,
      color: colors[idx % colors.length]
    }));
  },

  calculateLeadsByStatus(leads: LeadRecord[]): ChartDataPoint[] {
    const statusMap: Record<string, number> = {};
    leads.forEach((l) => {
      const st = l.status || 'New';
      statusMap[st] = (statusMap[st] || 0) + 1;
    });

    return Object.entries(statusMap).map(([name, value]) => ({
      name,
      value
    }));
  }
};

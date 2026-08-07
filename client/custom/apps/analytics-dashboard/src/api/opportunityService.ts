import { apiClient } from './client';
import { OpportunityRecord, ChartDataPoint, AnalyticsFilter } from '../types';

export const opportunityService = {
  async getOpportunities(filters?: AnalyticsFilter): Promise<OpportunityRecord[]> {
    try {
      const response = await apiClient.get('/Opportunity', {
        params: {
          maxSize: 200,
          select: 'id,name,stage,amount,closeDate,createdAt,accountName,assignedUserName',
          orderBy: 'createdAt',
          order: 'desc'
        }
      });
      return response.data.list || [];
    } catch (error) {
      console.warn('[Analytics BI] Failed to fetch opportunities from EspoCRM API, returning empty list.', error);
      return [];
    }
  },

  calculateOpportunitiesByStage(opps: OpportunityRecord[]): ChartDataPoint[] {
    const stageMap: Record<string, number> = {};
    opps.forEach((o) => {
      const st = o.stage || 'Prospecting';
      stageMap[st] = (stageMap[st] || 0) + 1;
    });

    return Object.entries(stageMap).map(([name, value]) => ({
      name,
      value
    }));
  },

  calculateRevenuePerSalesperson(opps: OpportunityRecord[]): ChartDataPoint[] {
    const userMap: Record<string, number> = {};
    opps.forEach((o) => {
      const user = o.assignedUserName || 'Unassigned';
      const amt = Number(o.amount || 0);
      userMap[user] = (userMap[user] || 0) + amt;
    });

    return Object.entries(userMap).map(([name, value]) => ({
      name,
      value
    }));
  },

  calculateRevenueTrend(opps: OpportunityRecord[]): ChartDataPoint[] {
    const monthMap: Record<string, number> = {};
    opps.forEach((o) => {
      const dateStr = o.closeDate || o.createdAt || '';
      const month = dateStr ? dateStr.substring(0, 7) : 'Current';
      const amt = Number(o.amount || 0);
      monthMap[month] = (monthMap[month] || 0) + amt;
    });

    return Object.entries(monthMap)
      .sort((a, b) => a[0].localeCompare(b[0]))
      .map(([name, value]) => ({
        name,
        value
      }));
  }
};

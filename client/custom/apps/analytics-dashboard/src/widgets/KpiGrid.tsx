import React from 'react';
import { Card } from '../components/ui/Card';
import { Skeleton } from '../components/ui/Skeleton';
import { KpiMetrics } from '../types';
import {
  Users,
  UserPlus,
  Target,
  CheckCircle2,
  TrendingUp,
  XCircle,
  Percent,
  DollarSign,
  Briefcase,
  Trophy,
  Clock,
  BarChart3
} from 'lucide-react';

interface KpiGridProps {
  kpis: KpiMetrics;
  isLoading?: boolean;
}

export const KpiGrid: React.FC<KpiGridProps> = ({ kpis, isLoading }) => {
  const cards = [
    {
      title: 'Total Leads',
      value: kpis.totalLeads.toLocaleString(),
      icon: Users,
      color: 'text-sky-400',
      badge: '+12.5%',
      badgeType: 'positive'
    },
    {
      title: 'New Leads Today',
      value: kpis.newLeadsToday.toLocaleString(),
      icon: UserPlus,
      color: 'text-emerald-400',
      badge: 'Today',
      badgeType: 'neutral'
    },
    {
      title: 'Potential Leads',
      value: kpis.potentialLeads.toLocaleString(),
      icon: Target,
      color: 'text-amber-400',
      badge: 'In Progress',
      badgeType: 'neutral'
    },
    {
      title: 'Qualified Leads',
      value: kpis.qualifiedLeads.toLocaleString(),
      icon: CheckCircle2,
      color: 'text-blue-400',
      badge: 'Ready',
      badgeType: 'positive'
    },
    {
      title: 'Converted Leads',
      value: kpis.convertedLeads.toLocaleString(),
      icon: TrendingUp,
      color: 'text-emerald-400',
      badge: 'Converted',
      badgeType: 'positive'
    },
    {
      title: 'Lost Leads',
      value: kpis.lostLeads.toLocaleString(),
      icon: XCircle,
      color: 'text-rose-400',
      badge: 'Closed',
      badgeType: 'negative'
    },
    {
      title: 'Conversion Rate',
      value: `${kpis.conversionRate}%`,
      icon: Percent,
      color: 'text-purple-400',
      badge: 'Target 25%',
      badgeType: 'positive'
    },
    {
      title: 'Total Revenue',
      value: `$${kpis.totalRevenue.toLocaleString()}`,
      icon: DollarSign,
      color: 'text-emerald-400',
      badge: 'Closed Won',
      badgeType: 'positive'
    },
    {
      title: 'Total Opportunities',
      value: kpis.totalOpportunities.toLocaleString(),
      icon: Briefcase,
      color: 'text-cyan-400',
      badge: 'Pipeline',
      badgeType: 'neutral'
    },
    {
      title: 'Won Opportunities',
      value: kpis.wonOpportunities.toLocaleString(),
      icon: Trophy,
      color: 'text-amber-400',
      badge: 'Won',
      badgeType: 'positive'
    },
    {
      title: 'Open Opportunities',
      value: kpis.openOpportunities.toLocaleString(),
      icon: Clock,
      color: 'text-sky-400',
      badge: 'Active',
      badgeType: 'neutral'
    },
    {
      title: 'Average Deal Size',
      value: `$${kpis.avgDealSize.toLocaleString()}`,
      icon: BarChart3,
      color: 'text-indigo-400',
      badge: 'Per Deal',
      badgeType: 'positive'
    }
  ];

  if (isLoading) {
    return (
      <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 xl:grid-cols-6 gap-4 mb-6">
        {Array.from({ length: 12 }).map((_, i) => (
          <Skeleton key={i} className="h-28 w-full" />
        ))}
      </div>
    );
  }

  return (
    <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 xl:grid-cols-6 gap-4 mb-6">
      {cards.map((card, idx) => {
        const Icon = card.icon;
        return (
          <Card key={idx} className="p-4 flex flex-col justify-between group">
            <div className="flex items-center justify-between">
              <span className="text-xs font-medium text-slate-400 truncate">{card.title}</span>
              <div className="p-2 rounded-xl bg-slate-800/80 border border-slate-700/50 group-hover:scale-110 transition-transform">
                <Icon className={`w-4 h-4 ${card.color}`} />
              </div>
            </div>
            <div className="mt-3 flex items-baseline justify-between">
              <span className="text-xl font-extrabold text-slate-100 tracking-tight">{card.value}</span>
              <span
                className={`text-[10px] font-bold px-1.5 py-0.5 rounded-full border ${
                  card.badgeType === 'positive'
                    ? 'bg-emerald-500/10 text-emerald-400 border-emerald-500/20'
                    : card.badgeType === 'negative'
                    ? 'bg-rose-500/10 text-rose-400 border-rose-500/20'
                    : 'bg-slate-800 text-slate-400 border-slate-700'
                }`}
              >
                {card.badge}
              </span>
            </div>
          </Card>
        );
      })}
    </div>
  );
};

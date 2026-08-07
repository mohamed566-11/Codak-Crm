import React from 'react';
import { Card } from '../components/ui/Card';
import { Badge } from '../components/ui/Badge';
import { OpportunityRecord } from '../types';
import { ExternalLink } from 'lucide-react';

interface RecentOpportunitiesTableProps {
  opportunities: OpportunityRecord[];
}

export const RecentOpportunitiesTable: React.FC<RecentOpportunitiesTableProps> = ({ opportunities }) => {
  const displayOpps = opportunities.slice(0, 5);

  const getStageBadge = (stage: string) => {
    switch (stage) {
      case 'Closed Won': return <Badge variant="success">Closed Won</Badge>;
      case 'Closed Lost': return <Badge variant="danger">Closed Lost</Badge>;
      case 'Negotiation': return <Badge variant="warning">Negotiation</Badge>;
      case 'Proposal': return <Badge variant="info">Proposal</Badge>;
      default: return <Badge variant="purple">{stage}</Badge>;
    }
  };

  const handleDrilldown = (id: string) => {
    if (window.parent && window.parent.location) {
      window.parent.location.hash = `#Opportunity/view/${id}`;
    }
  };

  return (
    <Card className="p-5 flex flex-col h-[340px]">
      <div className="flex items-center justify-between mb-3">
        <h3 className="text-sm font-bold text-slate-200 uppercase tracking-wider">Recent Opportunities</h3>
        <span className="text-xs text-slate-400">Total: {opportunities.length}</span>
      </div>
      <div className="flex-1 overflow-x-auto overflow-y-auto">
        <table className="w-full text-left text-xs text-slate-300">
          <thead className="bg-slate-800/80 text-slate-400 uppercase font-semibold sticky top-0">
            <tr>
              <th className="p-2.5">Name</th>
              <th className="p-2.5">Stage</th>
              <th className="p-2.5">Amount</th>
              <th className="p-2.5">Owner</th>
              <th className="p-2.5 text-right">Action</th>
            </tr>
          </thead>
          <tbody className="divide-y divide-slate-800/60">
            {displayOpps.length === 0 ? (
              <tr>
                <td colSpan={5} className="p-4 text-center text-slate-500 italic">
                  No opportunity records found.
                </td>
              </tr>
            ) : (
              displayOpps.map((opp) => (
                <tr key={opp.id} className="hover:bg-slate-800/40 transition-colors">
                  <td className="p-2.5 font-medium text-slate-100">{opp.name}</td>
                  <td className="p-2.5">{getStageBadge(opp.stage)}</td>
                  <td className="p-2.5 font-semibold text-emerald-400">${Number(opp.amount || 0).toLocaleString()}</td>
                  <td className="p-2.5 text-slate-400">{opp.assignedUserName || 'Admin'}</td>
                  <td className="p-2.5 text-right">
                    <button
                      onClick={() => handleDrilldown(opp.id)}
                      className="p-1 rounded bg-slate-800 hover:bg-brand-600 text-slate-300 hover:text-white transition-colors"
                      title="View in EspoCRM"
                    >
                      <ExternalLink className="w-3.5 h-3.5" />
                    </button>
                  </td>
                </tr>
              ))
            )}
          </tbody>
        </table>
      </div>
    </Card>
  );
};

import React from 'react';
import { Card } from '../components/ui/Card';
import { Badge } from '../components/ui/Badge';
import { LeadRecord } from '../types';
import { ExternalLink } from 'lucide-react';

interface RecentLeadsTableProps {
  leads: LeadRecord[];
}

export const RecentLeadsTable: React.FC<RecentLeadsTableProps> = ({ leads }) => {
  const displayLeads = leads.slice(0, 5);

  const getStatusBadge = (status: string) => {
    switch (status) {
      case 'New': return <Badge variant="info">New</Badge>;
      case 'Assigned': return <Badge variant="slate">Assigned</Badge>;
      case 'In Process': return <Badge variant="warning">In Process</Badge>;
      case 'Converted': return <Badge variant="success">Converted</Badge>;
      case 'Dead': return <Badge variant="danger">Dead</Badge>;
      default: return <Badge variant="purple">{status}</Badge>;
    }
  };

  const handleDrilldown = (id: string) => {
    if (window.parent && window.parent.location) {
      window.parent.location.hash = `#Lead/view/${id}`;
    }
  };

  return (
    <Card className="p-5 flex flex-col h-[340px]">
      <div className="flex items-center justify-between mb-3">
        <h3 className="text-sm font-bold text-slate-200 uppercase tracking-wider">Recent Leads</h3>
        <span className="text-xs text-slate-400">Total: {leads.length}</span>
      </div>
      <div className="flex-1 overflow-x-auto overflow-y-auto">
        <table className="w-full text-left text-xs text-slate-300">
          <thead className="bg-slate-800/80 text-slate-400 uppercase font-semibold sticky top-0">
            <tr>
              <th className="p-2.5">Name</th>
              <th className="p-2.5">Status</th>
              <th className="p-2.5">Source</th>
              <th className="p-2.5">Owner</th>
              <th className="p-2.5 text-right">Action</th>
            </tr>
          </thead>
          <tbody className="divide-y divide-slate-800/60">
            {displayLeads.length === 0 ? (
              <tr>
                <td colSpan={5} className="p-4 text-center text-slate-500 italic">
                  No lead records found.
                </td>
              </tr>
            ) : (
              displayLeads.map((lead) => (
                <tr key={lead.id} className="hover:bg-slate-800/40 transition-colors">
                  <td className="p-2.5 font-medium text-slate-100">{lead.name}</td>
                  <td className="p-2.5">{getStatusBadge(lead.status)}</td>
                  <td className="p-2.5 text-slate-400">{lead.source || 'Direct'}</td>
                  <td className="p-2.5 text-slate-400">{lead.assignedUserName || 'Admin'}</td>
                  <td className="p-2.5 text-right">
                    <button
                      onClick={() => handleDrilldown(lead.id)}
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

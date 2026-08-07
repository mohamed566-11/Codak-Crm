import React from 'react';
import { Download, Printer, FileSpreadsheet, FileText, Maximize2 } from 'lucide-react';
import { LeadRecord, OpportunityRecord } from '../types';

interface ExportToolbarProps {
  leads: LeadRecord[];
  opps: OpportunityRecord[];
}

export const ExportToolbar: React.FC<ExportToolbarProps> = ({ leads, opps }) => {
  const exportToCSV = () => {
    const headers = ['Type', 'ID', 'Name', 'Status/Stage', 'Amount/Source', 'Created At'];
    const rows: string[][] = [];

    leads.forEach((l) => {
      rows.push(['Lead', l.id, `"${l.name.replace(/"/g, '""')}"`, l.status || '', l.source || '', l.createdAt || '']);
    });

    opps.forEach((o) => {
      rows.push(['Opportunity', o.id, `"${o.name.replace(/"/g, '""')}"`, o.stage || '', `$${o.amount || 0}`, o.createdAt || '']);
    });

    const csvContent = 'data:text/csv;charset=utf-8,' + [headers.join(','), ...rows.map((e) => e.join(','))].join('\n');
    const encodedUri = encodeURI(csvContent);
    const link = document.createElement('a');
    link.setAttribute('href', encodedUri);
    link.setAttribute('download', `CodakCRM_Analytics_Report_${new Date().toISOString().substring(0, 10)}.csv`);
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
  };

  const handlePrint = () => {
    window.print();
  };

  const toggleFullscreen = () => {
    if (!document.fullscreenElement) {
      document.documentElement.requestFullscreen();
    } else {
      if (document.exitFullscreen) {
        document.exitFullscreen();
      }
    }
  };

  return (
    <div className="flex items-center gap-2">
      <button
        onClick={exportToCSV}
        className="flex items-center gap-1.5 px-3 py-1.5 rounded-xl bg-slate-800 hover:bg-slate-700 text-slate-200 text-xs font-medium border border-slate-700 transition-colors"
        title="Export Data to CSV"
      >
        <FileSpreadsheet className="w-3.5 h-3.5 text-emerald-400" />
        <span>Export CSV</span>
      </button>

      <button
        onClick={handlePrint}
        className="flex items-center gap-1.5 px-3 py-1.5 rounded-xl bg-slate-800 hover:bg-slate-700 text-slate-200 text-xs font-medium border border-slate-700 transition-colors"
        title="Print Dashboard Report"
      >
        <Printer className="w-3.5 h-3.5 text-sky-400" />
        <span>Print</span>
      </button>

      <button
        onClick={toggleFullscreen}
        className="p-1.5 rounded-xl bg-slate-800 hover:bg-slate-700 text-slate-200 border border-slate-700 transition-colors"
        title="Toggle Fullscreen Mode"
      >
        <Maximize2 className="w-3.5 h-3.5" />
      </button>
    </div>
  );
};

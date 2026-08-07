import React from 'react';
import { AnalyticsFilter, UserRecord } from '../types';
import { Filter, Calendar, User, RefreshCw } from 'lucide-react';

interface FilterBarProps {
  filters: AnalyticsFilter;
  setFilters: React.Dispatch<React.SetStateAction<AnalyticsFilter>>;
  users: UserRecord[];
  isFetching?: boolean;
  onRefresh: () => void;
}

export const FilterBar: React.FC<FilterBarProps> = ({
  filters,
  setFilters,
  users,
  isFetching,
  onRefresh
}) => {
  return (
    <div className="flex flex-wrap items-center justify-between gap-4 p-4 rounded-2xl border border-slate-800 bg-slate-900/80 backdrop-blur-xl shadow-linear mb-6">
      <div className="flex items-center gap-3 flex-wrap">
        <div className="flex items-center gap-2 text-slate-300 font-semibold text-xs uppercase tracking-wider">
          <Filter className="w-4 h-4 text-brand-accent" />
          <span>Global Filters:</span>
        </div>

        {/* Date Range Selector */}
        <div className="flex items-center gap-1.5 bg-slate-800/80 border border-slate-700/60 rounded-xl px-3 py-1.5 text-xs">
          <Calendar className="w-3.5 h-3.5 text-slate-400" />
          <select
            value={filters.dateRange}
            onChange={(e) => setFilters((prev) => ({ ...prev, dateRange: e.target.value as any }))}
            className="bg-transparent text-slate-200 focus:outline-none cursor-pointer"
          >
            <option value="all" className="bg-slate-900 text-slate-200">All Time</option>
            <option value="7d" className="bg-slate-900 text-slate-200">Last 7 Days</option>
            <option value="30d" className="bg-slate-900 text-slate-200">Last 30 Days</option>
            <option value="90d" className="bg-slate-900 text-slate-200">Last 90 Days</option>
            <option value="1y" className="bg-slate-900 text-slate-200">Last Year</option>
          </select>
        </div>

        {/* Salesperson Filter */}
        <div className="flex items-center gap-1.5 bg-slate-800/80 border border-slate-700/60 rounded-xl px-3 py-1.5 text-xs">
          <User className="w-3.5 h-3.5 text-slate-400" />
          <select
            value={filters.assignedUserId}
            onChange={(e) => setFilters((prev) => ({ ...prev, assignedUserId: e.target.value }))}
            className="bg-transparent text-slate-200 focus:outline-none cursor-pointer"
          >
            <option value="" className="bg-slate-900 text-slate-200">All Salespeople</option>
            {users.map((u) => (
              <option key={u.id} value={u.id} className="bg-slate-900 text-slate-200">
                {u.name || u.userName}
              </option>
            ))}
          </select>
        </div>
      </div>

      <div className="flex items-center gap-3">
        <span className="text-xs text-slate-400 hidden sm:inline-flex items-center gap-1.5">
          <span className="w-2 h-2 rounded-full bg-emerald-500 animate-ping"></span>
          Live Auto-Refresh (30s)
        </span>
        <button
          onClick={onRefresh}
          disabled={isFetching}
          className="flex items-center gap-1.5 px-3 py-1.5 rounded-xl bg-brand-600 hover:bg-brand-500 text-white text-xs font-semibold shadow-stripe transition-all duration-200 disabled:opacity-50"
        >
          <RefreshCw className={`w-3.5 h-3.5 ${isFetching ? 'animate-spin' : ''}`} />
          <span>{isFetching ? 'Refreshing...' : 'Refresh Now'}</span>
        </button>
      </div>
    </div>
  );
};

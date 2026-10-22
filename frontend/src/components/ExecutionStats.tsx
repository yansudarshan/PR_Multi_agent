"use client";

import { Activity, CheckCircle2, GitPullRequest, Layers, Wrench, RefreshCw } from 'lucide-react';
import { AnalyticsSummary } from '../lib/types';

interface ExecutionStatsProps {
  analytics?: AnalyticsSummary;
}

export default function ExecutionStats({ analytics }: ExecutionStatsProps) {
  const stats = [
    {
      label: 'Success Rate',
      value: `${analytics?.success_rate ?? 100}%`,
      icon: CheckCircle2,
      color: 'text-emerald-400',
      bg: 'bg-emerald-500/10 border-emerald-500/20',
    },
    {
      label: 'Total Tasks',
      value: analytics?.total_tasks ?? 1,
      icon: Activity,
      color: 'text-teal-400',
      bg: 'bg-teal-500/10 border-teal-500/20',
    },
    {
      label: 'Avg Iterations',
      value: analytics?.avg_iterations ?? 1.2,
      icon: RefreshCw,
      color: 'text-amber-400',
      bg: 'bg-amber-500/10 border-amber-500/20',
    },
    {
      label: 'Pull Requests Created',
      value: analytics?.total_prs_created ?? 1,
      icon: GitPullRequest,
      color: 'text-indigo-400',
      bg: 'bg-indigo-500/10 border-indigo-500/20',
    },
  ];

  return (
    <div className="grid grid-cols-2 gap-4 sm:grid-cols-4">
      {stats.map((stat, idx) => {
        const Icon = stat.icon;
        return (
          <div
            key={idx}
            className="flex items-center gap-4 rounded-xl border border-slate-800 bg-slate-900/60 p-4 backdrop-blur-md transition hover:border-slate-700"
          >
            <div className={`flex h-11 w-11 shrink-0 items-center justify-center rounded-xl border ${stat.bg}`}>
              <Icon className={`h-5 w-5 ${stat.color}`} />
            </div>
            <div>
              <p className="text-xs text-slate-400 font-medium">{stat.label}</p>
              <h4 className="font-mono text-xl font-bold text-slate-100 mt-0.5">{stat.value}</h4>
            </div>
          </div>
        );
      })}
    </div>
  );
}

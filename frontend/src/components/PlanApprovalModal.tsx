"use client";

import { Check, ShieldAlert, Play, Square } from 'lucide-react';
import { ImplementationPlan } from '../lib/types';

interface PlanApprovalModalProps {
  plan?: ImplementationPlan;
  onApprove: () => void;
  onStop: () => void;
}

export default function PlanApprovalModal({ plan, onApprove, onStop }: PlanApprovalModalProps) {
  if (!plan) return null;

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-slate-950/80 p-4 backdrop-blur-md">
      <div className="w-full max-w-2xl rounded-2xl border border-slate-800 bg-slate-900 p-6 shadow-2xl">
        <div className="flex items-center justify-between border-b border-slate-800 pb-4 mb-4">
          <div className="flex items-center gap-3">
            <div className="flex h-10 w-10 items-center justify-center rounded-xl bg-emerald-500/10 text-emerald-400 border border-emerald-500/20">
              <ShieldAlert className="h-5 w-5" />
            </div>
            <div>
              <h3 className="font-mono text-base font-bold text-slate-100">Human Plan Review Checkpoint</h3>
              <p className="text-xs text-slate-400">Review PlannerAgent output before autonomous execution begins</p>
            </div>
          </div>
          <span className="rounded-md bg-emerald-500/10 px-2.5 py-1 text-xs font-semibold text-emerald-400 border border-emerald-500/20">
            Risk: {plan.risk_level.toUpperCase()}
          </span>
        </div>

        {/* Plan summary */}
        <div className="space-y-4 text-sm text-slate-300">
          <div>
            <h4 className="font-mono text-xs font-bold text-slate-400 uppercase tracking-wider mb-1">Problem Summary</h4>
            <p className="rounded-lg bg-slate-950 p-3 text-slate-200 border border-slate-800">{plan.problem_summary}</p>
          </div>

          <div>
            <h4 className="font-mono text-xs font-bold text-slate-400 uppercase tracking-wider mb-1">Proposed Execution Steps</h4>
            <ul className="space-y-1.5 font-mono text-xs">
              {plan.implementation_steps.map((step, idx) => (
                <li key={idx} className="flex items-start gap-2 text-slate-300">
                  <span className="text-emerald-400 font-bold">{idx + 1}.</span>
                  <span>{step}</span>
                </li>
              ))}
            </ul>
          </div>

          <div>
            <h4 className="font-mono text-xs font-bold text-slate-400 uppercase tracking-wider mb-1">Target Files</h4>
            <div className="flex flex-wrap gap-2 font-mono text-xs">
              {plan.files_to_modify.map((file) => (
                <span key={file} className="rounded bg-slate-800 px-2 py-1 text-teal-300 border border-slate-700">
                  {file}
                </span>
              ))}
            </div>
          </div>
        </div>

        {/* Actions */}
        <div className="mt-6 flex items-center justify-end gap-3 border-t border-slate-800 pt-4">
          <button
            onClick={onStop}
            className="flex items-center gap-2 rounded-xl bg-slate-800 px-4 py-2 text-xs font-semibold text-slate-300 hover:bg-rose-500/10 hover:text-rose-400 hover:border-rose-500/20 border border-transparent transition"
          >
            <Square className="h-3.5 w-3.5" />
            <span>Stop Task</span>
          </button>

          <button
            onClick={onApprove}
            className="flex items-center gap-2 rounded-xl bg-gradient-to-r from-emerald-500 to-teal-500 px-5 py-2 text-xs font-bold text-slate-950 shadow-lg shadow-emerald-500/20 hover:from-emerald-400 hover:to-teal-400 transition"
          >
            <Play className="h-3.5 w-3.5 fill-slate-950" />
            <span>Approve & Start Agent</span>
          </button>
        </div>
      </div>
    </div>
  );
}

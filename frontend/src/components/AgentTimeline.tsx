"use client";

import { CheckCircle2, Circle, Loader2, AlertCircle, PauseCircle } from 'lucide-react';
import { Task } from '../lib/types';

interface AgentTimelineProps {
  task: Task;
}

interface StepItem {
  id: string;
  label: string;
  agent: string;
  states: string[];
}

const TIMELINE_STEPS: StepItem[] = [
  { id: '1', label: 'Issue analyzed', agent: 'GitHubAgent', states: ['ISSUE_ANALYSIS'] },
  { id: '2', label: 'Repository indexed & mapped', agent: 'RepositoryAgent', states: ['REPOSITORY_ANALYSIS'] },
  { id: '3', label: 'Implementation plan created', agent: 'PlannerAgent', states: ['PLANNING', 'AWAITING_PLAN_APPROVAL'] },
  { id: '4', label: 'Modifying target source files', agent: 'CodingAgent', states: ['CODING'] },
  { id: '5', label: 'Running isolated test suite', agent: 'TestingAgent', states: ['TESTING'] },
  { id: '6', label: 'Failure analysis & debugging', agent: 'DebuggerAgent', states: ['DEBUGGING'] },
  { id: '7', label: 'Code review & quality checks', agent: 'ReviewerAgent', states: ['REVIEWING'] },
  { id: '8', label: 'Git branch & commit created', agent: 'GitAgent', states: ['COMMITTING', 'PUSHING'] },
  { id: '9', label: 'GitHub Pull Request & CI check', agent: 'GitHubAgent', states: ['CREATING_PR', 'CI_CHECK', 'COMPLETED'] },
];

export default function AgentTimeline({ task }: AgentTimelineProps) {
  const currentState = task.state;
  const isFailed = currentState === 'FAILED' || currentState === 'HUMAN_REVIEW_REQUIRED';
  const isCompleted = currentState === 'COMPLETED';

  // Map current state to index in step timeline
  const getStateIndex = (state: string): number => {
    switch (state) {
      case 'INITIALIZING':
      case 'ISSUE_ANALYSIS':
        return 0;
      case 'REPOSITORY_ANALYSIS':
        return 1;
      case 'PLANNING':
      case 'AWAITING_PLAN_APPROVAL':
        return 2;
      case 'CODING':
        return 3;
      case 'TESTING':
        return 4;
      case 'DEBUGGING':
        return 5;
      case 'REVIEWING':
        return 6;
      case 'COMMITTING':
      case 'PUSHING':
        return 7;
      case 'CREATING_PR':
      case 'CI_CHECK':
      case 'COMPLETED':
        return 8;
      default:
        return 0;
    }
  };

  const currentIndex = getStateIndex(currentState);

  return (
    <div className="rounded-xl border border-slate-800 bg-slate-900/60 p-5 backdrop-blur-md">
      <div className="flex items-center justify-between border-b border-slate-800 pb-3 mb-4">
        <h3 className="font-mono text-sm font-bold uppercase tracking-wider text-slate-300 flex items-center gap-2">
          <span>Agent Activity Progress</span>
          {task.iteration_count > 0 && (
            <span className="rounded bg-amber-500/10 px-2 py-0.5 text-xs text-amber-400 font-normal border border-amber-500/20">
              Iteration {task.iteration_count} / {task.max_iterations}
            </span>
          )}
        </h3>
        <div className="text-xs font-mono text-slate-400">
          State: <span className="text-emerald-400 font-semibold">{currentState}</span>
        </div>
      </div>

      <div className="space-y-3 font-mono text-sm">
        {TIMELINE_STEPS.map((step, idx) => {
          const isDone = idx < currentIndex || (isCompleted && idx === 8);
          const isCurrent = idx === currentIndex && !isCompleted && !isFailed;
          const isPending = idx > currentIndex && !isCompleted;

          return (
            <div key={step.id} className="flex items-start justify-between gap-3 group">
              <div className="flex items-center gap-3">
                {isDone && (
                  <CheckCircle2 className="h-4 w-4 text-emerald-400 shrink-0" />
                )}
                {isCurrent && (
                  <Loader2 className="h-4 w-4 text-teal-400 animate-spin shrink-0" />
                )}
                {isPending && (
                  <Circle className="h-4 w-4 text-slate-600 shrink-0" />
                )}
                {isFailed && idx === currentIndex && (
                  <AlertCircle className="h-4 w-4 text-rose-400 shrink-0" />
                )}

                <span
                  className={`transition-colors ${
                    isDone
                      ? 'text-slate-200'
                      : isCurrent
                      ? 'text-teal-300 font-semibold'
                      : isFailed && idx === currentIndex
                      ? 'text-rose-400 font-semibold'
                      : 'text-slate-500'
                  }`}
                >
                  {step.label}
                </span>
              </div>

              <span className="text-xs text-slate-500 group-hover:text-slate-400 transition">
                {step.agent}
              </span>
            </div>
          );
        })}
      </div>
    </div>
  );
}

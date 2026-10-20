"use client";

import { useEffect, useState } from 'react';
import Link from 'next/link';
import { useParams } from 'next/navigation';
import { 
  Bot, GitPullRequest, ArrowLeft, RefreshCw, CheckCircle2, 
  XCircle, Square, Play, ShieldAlert, ExternalLink, Activity, Sparkles 
} from 'lucide-react';
import AgentTimeline from '../../../components/AgentTimeline';
import DiffViewer from '../../../components/DiffViewer';
import TerminalOutput from '../../../components/TerminalOutput';
import PlanApprovalModal from '../../../components/PlanApprovalModal';
import { api } from '../../../lib/api';
import { Task, AgentEvent, TestRun } from '../../../lib/types';

export default function TaskDetailPage() {
  const params = useParams();
  const taskId = params.id as string;

  const [task, setTask] = useState<Task | null>(null);
  const [events, setEvents] = useState<AgentEvent[]>([]);
  const [testRuns, setTestRuns] = useState<TestRun[]>([]);
  const [diff, setDiff] = useState<string>('');
  const [loading, setLoading] = useState(true);
  const [showApprovalModal, setShowApprovalModal] = useState(false);

  // Poll task state & fetch data
  useEffect(() => {
    let interval: NodeJS.Timeout;

    async function loadTaskData() {
      try {
        const [t, evtList, tests, diffData] = await Promise.all([
          api.getTask(taskId),
          api.getEvents(taskId).catch(() => []),
          api.getTests(taskId).catch(() => []),
          api.getDiff(taskId).catch(() => ({ diff: '', files_modified: [] })),
        ]);

        setTask(t);
        setEvents(evtList);
        setTestRuns(tests);
        setDiff(diffData.diff);

        if (t.state === 'AWAITING_PLAN_APPROVAL') {
          setShowApprovalModal(true);
        }
      } catch (err) {
        console.error('Error fetching task details:', err);
      } finally {
        setLoading(false);
      }
    }

    loadTaskData();
    interval = setInterval(loadTaskData, 2000);

    return () => clearInterval(interval);
  }, [taskId]);

  // Connect Server-Sent Events (SSE) for real-time live events stream!
  useEffect(() => {
    const sseUrl = `${process.env.NEXT_PUBLIC_API_URL || 'http://localhost:8000/api'}/tasks/${taskId}/stream`;
    const eventSource = new EventSource(sseUrl);

    eventSource.onmessage = (e) => {
      try {
        const parsed = JSON.parse(e.data);
        if (parsed.task_id === taskId) {
          setEvents((prev) => [...prev, parsed]);
        }
      } catch (err) {
        // Heartbeat or ping
      }
    };

    return () => {
      eventSource.close();
    };
  }, [taskId]);

  async function handleApprovePlan() {
    setShowApprovalModal(false);
    await api.approvePlan(taskId);
  }

  async function handleStopTask() {
    await api.stopTask(taskId);
  }

  async function handleContinueTask() {
    await api.continueTask(taskId);
  }

  if (loading || !task) {
    return (
      <div className="py-24 text-center font-mono text-sm text-slate-400 animate-pulse space-y-3">
        <Bot className="mx-auto h-8 w-8 text-emerald-400 animate-bounce" />
        <p>Connecting to DevAgent runtime engine...</p>
      </div>
    );
  }

  return (
    <div className="space-y-8">
      {/* Top Header Navigation */}
      <div className="flex items-center justify-between">
        <Link
          href="/"
          className="inline-flex items-center gap-2 rounded-lg bg-slate-900 px-3 py-1.5 text-xs font-mono text-slate-300 hover:text-slate-100 border border-slate-800 transition"
        >
          <ArrowLeft className="h-3.5 w-3.5" />
          <span>Back to Dashboard</span>
        </Link>

        {/* Task state badge & actions */}
        <div className="flex items-center gap-3">
          <span
            className={`rounded-full px-3 py-1 text-xs font-mono font-bold border ${
              task.state === 'COMPLETED'
                ? 'bg-emerald-500/10 text-emerald-400 border-emerald-500/20'
                : task.state === 'FAILED' || task.state === 'HUMAN_REVIEW_REQUIRED'
                ? 'bg-rose-500/10 text-rose-400 border-rose-500/20'
                : 'bg-teal-500/10 text-teal-400 border-teal-500/20 animate-pulse'
            }`}
          >
            ● {task.state}
          </span>

          {task.state !== 'COMPLETED' && task.state !== 'FAILED' && (
            <button
              onClick={handleStopTask}
              className="flex items-center gap-1.5 rounded-lg bg-slate-900 px-3 py-1.5 text-xs font-mono text-rose-400 hover:bg-rose-500/10 border border-slate-800 transition"
            >
              <Square className="h-3.5 w-3.5" />
              <span>Stop Agent</span>
            </button>
          )}

          {task.state === 'HUMAN_REVIEW_REQUIRED' && (
            <button
              onClick={handleContinueTask}
              className="flex items-center gap-1.5 rounded-lg bg-emerald-500 px-3.5 py-1.5 text-xs font-mono font-bold text-slate-950 hover:bg-emerald-400 transition"
            >
              <Play className="h-3.5 w-3.5 fill-slate-950" />
              <span>Continue Task</span>
            </button>
          )}
        </div>
      </div>

      {/* Task Summary Banner */}
      <div className="rounded-2xl border border-slate-800 bg-slate-900/60 p-6 backdrop-blur-md space-y-4">
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 border-b border-slate-800 pb-4">
          <div>
            <span className="font-mono text-xs font-semibold text-emerald-400 uppercase tracking-wider">
              {task.repository_full_name} / Issue #{task.issue_number}
            </span>
            <h1 className="font-mono text-xl sm:text-2xl font-bold text-slate-100 mt-1">
              {task.issue_title}
            </h1>
          </div>

          {task.pull_request_url && (
            <a
              href={task.pull_request_url}
              target="_blank"
              rel="noreferrer"
              className="inline-flex items-center gap-2 rounded-xl bg-gradient-to-r from-emerald-500 to-teal-500 px-4 py-2.5 text-xs font-bold text-slate-950 shadow-lg shadow-emerald-500/20 hover:from-emerald-400 transition"
            >
              <GitPullRequest className="h-4 w-4" />
              <span>GitHub PR #{task.pull_request_number || 42}</span>
              <ExternalLink className="h-3.5 w-3.5" />
            </a>
          )}
        </div>

        {/* Issue Description */}
        {task.issue_body && (
          <div className="rounded-xl bg-slate-950 p-4 border border-slate-800 text-xs text-slate-300 font-mono leading-relaxed">
            {task.issue_body}
          </div>
        )}
      </div>

      {/* Structured Implementation Plan Card */}
      {task.plan && (
        <div className="rounded-2xl border border-slate-800 bg-slate-900/60 p-6 backdrop-blur-md">
          <div className="flex items-center justify-between border-b border-slate-800 pb-3 mb-4">
            <h3 className="font-mono text-sm font-bold uppercase tracking-wider text-slate-200 flex items-center gap-2">
              <Sparkles className="h-4 w-4 text-emerald-400" />
              <span>PlannerAgent Implementation Steps</span>
            </h3>
            <span className="rounded bg-slate-800 px-2 py-0.5 text-xs font-mono text-slate-400 border border-slate-700">
              Risk: {task.plan.risk_level.toUpperCase()}
            </span>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-4 font-mono text-xs">
            {task.plan.implementation_steps.map((step, idx) => (
              <div
                key={idx}
                className="flex items-start gap-3 rounded-xl border border-slate-800 bg-slate-950/60 p-3 text-slate-300"
              >
                <span className="flex h-5 w-5 shrink-0 items-center justify-center rounded-full bg-emerald-500/10 text-emerald-400 font-bold border border-emerald-500/20">
                  {idx + 1}
                </span>
                <span>{step}</span>
              </div>
            ))}
          </div>
        </div>
      )}

      {/* Agent Timeline & Stream Grid */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
        {/* Timeline on left */}
        <div className="lg:col-span-1">
          <AgentTimeline task={task} />
        </div>

        {/* Terminal / Log Stream on right */}
        <div className="lg:col-span-2">
          <TerminalOutput events={events} testRuns={testRuns} />
        </div>
      </div>

      {/* Monaco Diff Viewer */}
      <DiffViewer diff={diff} filesModified={task.files_modified} />

      {/* Human Plan Review Checkpoint Modal */}
      {showApprovalModal && (
        <PlanApprovalModal
          plan={task.plan}
          onApprove={handleApprovePlan}
          onStop={handleStopTask}
        />
      )}
    </div>
  );
}

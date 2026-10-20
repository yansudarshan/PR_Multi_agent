"use client";

import { useEffect, useState } from 'react';
import Link from 'next/link';
import { Bot, PlusCircle, GitPullRequest, ArrowRight, Clock, ExternalLink, ShieldCheck, RefreshCw, Server, Cpu, Database, Terminal, AlertCircle } from 'lucide-react';
import ExecutionStats from '../components/ExecutionStats';
import { api } from '../lib/api';
import { Task, AnalyticsSummary } from '../lib/types';

export default function Dashboard() {
  const [tasks, setTasks] = useState<Task[]>([]);
  const [analytics, setAnalytics] = useState<AnalyticsSummary | undefined>(undefined);
  const [readiness, setReadiness] = useState<any>(null);
  const [loading, setLoading] = useState(true);
  const [testingLLM, setTestingLLM] = useState(false);
  const [llmTestResult, setLlmTestResult] = useState<any>(null);

  async function loadData() {
    try {
      const [taskList, analyticsData, readinessData] = await Promise.all([
        api.listTasks().catch(() => []),
        api.getAnalytics().catch(() => undefined),
        api.getReadiness().catch(() => null),
      ]);
      setTasks(taskList);
      setAnalytics(analyticsData);
      setReadiness(readinessData);
    } catch (err) {
      console.error('Failed loading dashboard:', err);
    } finally {
      setLoading(false);
    }
  }

  useEffect(() => {
    loadData();
  }, []);

  async function handleTestLLM() {
    setTestingLLM(true);
    try {
      const res = await api.testLLM();
      setLlmTestResult(res);
    } catch (err) {
      setLlmTestResult({ connected: false, error: String(err) });
    } finally {
      setTestingLLM(false);
    }
  }

  const isReal = readiness?.execution_mode === 'REAL';

  return (
    <div className="space-y-8">
      {/* Hero / Header banner */}
      <div className="relative overflow-hidden rounded-2xl border border-slate-800 bg-gradient-to-r from-slate-900 via-slate-900/90 to-slate-950 p-6 sm:p-8 backdrop-blur-md">
        <div className="absolute right-0 top-0 -mr-16 -mt-16 h-64 w-64 rounded-full bg-emerald-500/10 blur-3xl pointer-events-none"></div>
        <div className="relative z-10 flex flex-col sm:flex-row items-start sm:items-center justify-between gap-6">
          <div className="max-w-2xl space-y-2">
            <div className="flex items-center gap-3">
              <div className="inline-flex items-center gap-2 rounded-full bg-emerald-500/10 px-3 py-1 text-xs font-semibold text-emerald-400 border border-emerald-500/20 font-mono">
                <Bot className="h-3.5 w-3.5" />
                <span>DevAgent Core Pipeline</span>
              </div>
              
              {/* EXECUTION MODE BADGE */}
              <div className={`inline-flex items-center gap-1.5 rounded-full px-3 py-1 text-xs font-mono font-bold border ${
                isReal 
                  ? 'bg-emerald-500/20 text-emerald-300 border-emerald-500/40 shadow-lg shadow-emerald-500/10'
                  : 'bg-amber-500/20 text-amber-300 border-amber-500/40'
              }`}>
                <span className={`h-2 w-2 rounded-full ${isReal ? 'bg-emerald-400 animate-ping' : 'bg-amber-400'}`}></span>
                <span>{isReal ? '● REAL MODE' : '● DEMO MODE'}</span>
              </div>
            </div>

            <h1 className="font-mono text-2xl sm:text-3xl font-bold tracking-tight text-slate-100">
              DevAgent Dashboard
            </h1>
            <p className="text-sm text-slate-400">
              Autonomous reasoning, sandbox code execution, automated testing, failure debugging, and GitHub Pull Request generation.
            </p>
          </div>

          <Link
            href="/tasks/new"
            className="flex items-center gap-2 rounded-xl bg-gradient-to-r from-emerald-500 to-teal-500 px-5 py-3 text-sm font-bold text-slate-950 shadow-lg shadow-emerald-500/20 hover:from-emerald-400 hover:to-teal-400 transition"
          >
            <PlusCircle className="h-5 w-5" />
            <span>Launch Autonomous Task</span>
          </Link>
        </div>
      </div>

      {/* System Readiness Panel */}
      <div className="rounded-2xl border border-slate-800 bg-slate-900/60 p-6 backdrop-blur-md space-y-4">
        <div className="flex items-center justify-between border-b border-slate-800 pb-3">
          <h3 className="font-mono text-sm font-bold text-slate-100 flex items-center gap-2">
            <ShieldCheck className="h-4 w-4 text-emerald-400" />
            <span>System Readiness & Connectivity Check</span>
          </h3>
          <button
            onClick={loadData}
            className="flex items-center gap-1.5 rounded-lg border border-slate-700 bg-slate-800 px-2.5 py-1 font-mono text-xs text-slate-300 hover:border-emerald-500 hover:text-emerald-400 transition"
          >
            <RefreshCw className="h-3 w-3" />
            <span>Refresh Health</span>
          </button>
        </div>

        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-5 gap-3">
          {/* GitHub API */}
          <div className="rounded-xl border border-slate-800/80 bg-slate-950/50 p-3.5 space-y-1.5">
            <div className="flex items-center justify-between font-mono text-xs text-slate-400">
              <span className="flex items-center gap-1.5"><Server className="h-3.5 w-3.5 text-slate-400" /> GitHub API</span>
              <span className={readiness?.components?.github_api?.connected ? 'text-emerald-400 font-bold' : 'text-rose-400 font-bold'}>
                {readiness?.components?.github_api?.connected ? '✓ Connected' : '✗ Failed'}
              </span>
            </div>
            <p className="text-[11px] font-mono text-slate-300 truncate">
              {readiness?.components?.github_api?.username ? `@${readiness.components.github_api.username}` : (readiness?.components?.github_api?.error || 'TOKEN missing')}
            </p>
          </div>

          {/* LLM API */}
          <div className="rounded-xl border border-slate-800/80 bg-slate-950/50 p-3.5 space-y-1.5">
            <div className="flex items-center justify-between font-mono text-xs text-slate-400">
              <span className="flex items-center gap-1.5"><Cpu className="h-3.5 w-3.5 text-slate-400" /> LLM API</span>
              <span className={readiness?.components?.llm_api?.connected ? 'text-emerald-400 font-bold' : 'text-rose-400 font-bold'}>
                {readiness?.components?.llm_api?.connected ? '✓ Connected' : '✗ Unset'}
              </span>
            </div>
            <p className="text-[11px] font-mono text-slate-300 truncate">
              {readiness?.components?.llm_api?.model || 'Gemini 2.5 Flash'}
            </p>
          </div>

          {/* Docker Sandbox */}
          <div className="rounded-xl border border-slate-800/80 bg-slate-950/50 p-3.5 space-y-1.5">
            <div className="flex items-center justify-between font-mono text-xs text-slate-400">
              <span className="flex items-center gap-1.5"><Server className="h-3.5 w-3.5 text-slate-400" /> Sandbox</span>
              <span className={readiness?.components?.docker?.ready ? 'text-emerald-400 font-bold' : 'text-slate-400 font-bold'}>
                {readiness?.components?.docker?.ready ? '✓ Docker' : '✓ Process'}
              </span>
            </div>
            <p className="text-[11px] font-mono text-slate-300">
              {readiness?.components?.docker?.ready ? 'Docker Container' : 'Local Sandbox'}
            </p>
          </div>

          {/* Database */}
          <div className="rounded-xl border border-slate-800/80 bg-slate-950/50 p-3.5 space-y-1.5">
            <div className="flex items-center justify-between font-mono text-xs text-slate-400">
              <span className="flex items-center gap-1.5"><Database className="h-3.5 w-3.5 text-slate-400" /> Database</span>
              <span className="text-emerald-400 font-bold">✓ Connected</span>
            </div>
            <p className="text-[11px] font-mono text-slate-300 truncate">devagent.db</p>
          </div>

          {/* Git CLI */}
          <div className="rounded-xl border border-slate-800/80 bg-slate-950/50 p-3.5 space-y-1.5">
            <div className="flex items-center justify-between font-mono text-xs text-slate-400">
              <span className="flex items-center gap-1.5"><Terminal className="h-3.5 w-3.5 text-slate-400" /> Git CLI</span>
              <span className="text-emerald-400 font-bold">✓ Ready</span>
            </div>
            <p className="text-[11px] font-mono text-slate-300">Git Installed</p>
          </div>
        </div>

        {/* Readiness Test Buttons */}
        <div className="flex flex-wrap items-center gap-3 pt-2">
          <button
            onClick={handleTestLLM}
            disabled={testingLLM}
            className="rounded-lg border border-slate-700 bg-slate-800 px-3 py-1.5 font-mono text-xs font-semibold text-emerald-300 hover:border-emerald-500 hover:bg-slate-700 transition flex items-center gap-2"
          >
            <Cpu className={`h-3.5 w-3.5 ${testingLLM ? 'animate-spin' : ''}`} />
            <span>{testingLLM ? 'Testing LLM Latency...' : 'Test LLM Connection'}</span>
          </button>

          {llmTestResult && (
            <span className={`font-mono text-xs px-2.5 py-1 rounded ${llmTestResult.connected ? 'bg-emerald-500/10 text-emerald-400 border border-emerald-500/20' : 'bg-rose-500/10 text-rose-400 border border-rose-500/20'}`}>
              {llmTestResult.connected 
                ? `LLM Connected (${llmTestResult.latency_ms}ms latency)` 
                : `LLM Error: ${llmTestResult.error}`}
            </span>
          )}
        </div>
      </div>

      {/* Analytics panel */}
      <ExecutionStats analytics={analytics} />

      {/* Main Content Grid */}
      <div className="grid grid-cols-1 gap-8">
        {/* Recent Tasks List */}
        <div className="rounded-2xl border border-slate-800 bg-slate-900/60 p-6 backdrop-blur-md">
          <div className="flex items-center justify-between border-b border-slate-800 pb-4 mb-4">
            <h3 className="font-mono text-base font-bold text-slate-100 flex items-center gap-2">
              <Clock className="h-5 w-5 text-emerald-400" />
              <span>Autonomous Task Trajectories</span>
            </h3>
            <span className="text-xs text-slate-400 font-mono">{tasks.length} tasks registered</span>
          </div>

          {loading ? (
            <div className="py-12 text-center text-slate-500 font-mono text-sm animate-pulse">
              Loading task history...
            </div>
          ) : tasks.length === 0 ? (
            <div className="py-12 text-center text-slate-400 space-y-3">
              <p>No autonomous tasks executed yet.</p>
              <Link
                href="/tasks/new"
                className="inline-flex items-center gap-2 text-xs font-semibold text-emerald-400 hover:underline"
              >
                <span>Launch New Task</span>
                <ArrowRight className="h-3.5 w-3.5" />
              </Link>
            </div>
          ) : (
            <div className="divide-y divide-slate-800/80">
              {tasks.map((task) => (
                <div key={task.id} className="py-4 flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4 group">
                  <div className="space-y-1">
                    <div className="flex items-center gap-3">
                      <span className="font-mono text-xs font-semibold text-emerald-400">
                        #{task.issue_number}
                      </span>
                      <Link
                        href={`/tasks/${task.id}`}
                        className="font-semibold text-slate-200 hover:text-emerald-300 transition"
                      >
                        {task.issue_title}
                      </Link>
                    </div>
                    <div className="flex items-center gap-3 text-xs text-slate-400 font-mono">
                      <span>{task.repository_full_name}</span>
                      <span>•</span>
                      <span>{task.iteration_count} iterations</span>
                      <span>•</span>
                      <span>{new Date(task.created_at).toLocaleString()}</span>
                    </div>
                  </div>

                  <div className="flex items-center gap-3">
                    <span
                      className={`rounded-md px-2.5 py-1 text-xs font-mono font-semibold ${
                        task.state === 'COMPLETED'
                          ? 'bg-emerald-500/10 text-emerald-400 border border-emerald-500/20'
                          : task.state === 'FAILED'
                          ? 'bg-rose-500/10 text-rose-400 border border-rose-500/20'
                          : 'bg-teal-500/10 text-teal-400 border border-teal-500/20 animate-pulse'
                      }`}
                    >
                      {task.state}
                    </span>

                    {task.pull_request_url && (
                      <a
                        href={task.pull_request_url}
                        target="_blank"
                        rel="noreferrer"
                        className="flex items-center gap-1 rounded-lg bg-slate-800 px-3 py-1.5 text-xs font-semibold text-indigo-300 hover:bg-slate-700 transition"
                      >
                        <GitPullRequest className="h-3.5 w-3.5" />
                        <span>PR #{task.pull_request_number}</span>
                        <ExternalLink className="h-3 w-3" />
                      </a>
                    )}

                    <Link
                      href={`/tasks/${task.id}`}
                      className="rounded-lg bg-slate-800 px-3 py-1.5 text-xs font-semibold text-slate-200 hover:bg-slate-700 transition"
                    >
                      View Trajectory
                    </Link>
                  </div>
                </div>
              ))}
            </div>
          )}
        </div>
      </div>
    </div>
  );
}

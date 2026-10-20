"use client";

import { useState } from 'react';
import { useRouter } from 'next/navigation';
import { Bot, Play, Search, Sparkles, RefreshCw, CheckCircle } from 'lucide-react';
import { api } from '../../../lib/api';

export default function NewTaskPage() {
  const router = useRouter();
  const [repo, setRepo] = useState('demo-org/demo-backend');
  const [issueNumber, setIssueNumber] = useState<number | string>(142);
  const [issueTitle, setIssueTitle] = useState(
    'Fix authentication retry behavior when the downstream service times out and add regression tests.'
  );
  const [issueBody, setIssueBody] = useState(
    'When downstream auth provider service times out, catch TimeoutException and retry up to 3 times before raising exception. Add regression test test_auth_timeout.'
  );
  const [loading, setLoading] = useState(false);
  const [fetchingIssue, setFetchingIssue] = useState(false);
  const [fetchSuccess, setFetchSuccess] = useState(false);

  async function handleFetchIssueDetails(targetRepo = repo, targetNum = issueNumber) {
    if (!targetRepo || !targetNum) return;
    setFetchingIssue(true);
    setFetchSuccess(false);
    try {
      const data = await api.fetchGitHubIssue(targetRepo, Number(targetNum));
      if (data && data.title) {
        setIssueTitle(data.title);
        setIssueBody(data.body || `Autonomous analysis for issue #${targetNum} in ${targetRepo}`);
        setFetchSuccess(true);
      }
    } catch (err) {
      console.warn('Could not auto-fetch GitHub issue:', err);
    } finally {
      setFetchingIssue(false);
    }
  }

  function handleSelectPreset(presetRepo: string, presetNum: number, presetTitle: string, presetBody: string) {
    setRepo(presetRepo);
    setIssueNumber(presetNum);
    setIssueTitle(presetTitle);
    setIssueBody(presetBody);
    if (presetRepo !== 'demo-org/demo-backend') {
      handleFetchIssueDetails(presetRepo, presetNum);
    }
  }

  async function handleSubmit(e: React.FormEvent) {
    e.preventDefault();
    setLoading(true);
    try {
      const createdTask = await api.createTask(repo, Number(issueNumber), issueTitle, issueBody);
      router.push(`/tasks/${createdTask.id}`);
    } catch (err) {
      console.error('Failed creating task:', err);
      alert('Error launching task: ' + err);
    } finally {
      setLoading(false);
    }
  }

  return (
    <div className="mx-auto max-w-3xl space-y-6">
      {/* Header */}
      <div className="space-y-1">
        <h1 className="font-mono text-2xl font-bold tracking-tight text-slate-100 flex items-center gap-3">
          <Bot className="h-7 w-7 text-emerald-400" />
          <span>Launch New Autonomous Task</span>
        </h1>
        <p className="text-sm text-slate-400">
          Connect any GitHub repository and issue to start autonomous plan generation, sandbox coding, testing, debugging, and PR creation.
        </p>
      </div>

      {/* Form card matching wireframe aesthetic */}
      <form onSubmit={handleSubmit} className="rounded-2xl border border-slate-800 bg-slate-900/60 p-6 space-y-6 backdrop-blur-md shadow-2xl">
        
        {/* Presets Bar */}
        <div className="space-y-2">
          <label className="block font-mono text-xs font-semibold text-slate-400 uppercase tracking-wider">
            Quick Presets
          </label>
          <div className="flex flex-wrap gap-2">
            <button
              type="button"
              onClick={() => handleSelectPreset('kubernetes/kubernetes', 142561, 'Initial Future Conformance implementation', 'Implementation for Kubernetes issue #142561')}
              className="rounded-lg border border-slate-700 bg-slate-800/80 px-3 py-1.5 font-mono text-xs text-emerald-300 hover:border-emerald-500 hover:bg-slate-800 transition flex items-center gap-1.5"
            >
              <Sparkles className="h-3.5 w-3.5 text-emerald-400" />
              <span>kubernetes/kubernetes #142561</span>
            </button>
            <button
              type="button"
              onClick={() => handleSelectPreset('demo-org/demo-backend', 142, 'Fix authentication retry behavior when the downstream service times out and add regression tests.', 'When downstream auth provider service times out, catch TimeoutException and retry up to 3 times before raising exception.')}
              className="rounded-lg border border-slate-700 bg-slate-800/80 px-3 py-1.5 font-mono text-xs text-slate-300 hover:border-emerald-500 hover:bg-slate-800 transition flex items-center gap-1.5"
            >
              <span>demo-org/demo-backend #142</span>
            </button>
          </div>
        </div>

        {/* Repository & Issue Number */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
          <div className="md:col-span-2 space-y-2">
            <label className="block font-mono text-xs font-semibold text-slate-300 uppercase tracking-wider">
              GitHub Repository
            </label>
            <div className="relative">
              <input
                type="text"
                value={repo}
                onChange={(e) => setRepo(e.target.value)}
                onBlur={() => handleFetchIssueDetails()}
                placeholder="owner/repository"
                className="w-full rounded-xl border border-slate-800 bg-slate-950 px-4 py-3 font-mono text-sm text-slate-100 placeholder-slate-600 focus:border-emerald-500 focus:outline-none focus:ring-1 focus:ring-emerald-500 transition"
                required
              />
            </div>
          </div>

          <div className="space-y-2">
            <label className="block font-mono text-xs font-semibold text-slate-300 uppercase tracking-wider">
              Issue Number
            </label>
            <div className="flex gap-2">
              <input
                type="number"
                value={issueNumber}
                onChange={(e) => setIssueNumber(e.target.value)}
                onBlur={() => handleFetchIssueDetails()}
                className="w-full rounded-xl border border-slate-800 bg-slate-950 px-4 py-3 font-mono text-sm text-slate-100 placeholder-slate-600 focus:border-emerald-500 focus:outline-none focus:ring-1 focus:ring-emerald-500 transition"
                required
              />
              <button
                type="button"
                onClick={() => handleFetchIssueDetails()}
                disabled={fetchingIssue}
                title="Fetch Issue details live from GitHub"
                className="rounded-xl border border-slate-800 bg-slate-800 px-3 py-3 text-slate-300 hover:border-emerald-500 hover:text-emerald-400 transition"
              >
                <RefreshCw className={`h-4 w-4 ${fetchingIssue ? 'animate-spin text-emerald-400' : ''}`} />
              </button>
            </div>
          </div>
        </div>

        {/* Fetch Status Notification */}
        {fetchSuccess && (
          <div className="rounded-lg bg-emerald-500/10 border border-emerald-500/20 px-3 py-2 text-xs font-mono text-emerald-400 flex items-center gap-2">
            <CheckCircle className="h-4 w-4" />
            <span>Fetched live details from GitHub API for issue #{issueNumber}!</span>
          </div>
        )}

        {/* Issue Title & Description */}
        <div className="space-y-4 rounded-xl border border-slate-800/80 bg-slate-950/40 p-4">
          <div className="space-y-2">
            <label className="block font-mono text-xs font-semibold text-slate-300">
              Issue Title
            </label>
            <input
              type="text"
              value={issueTitle}
              onChange={(e) => setIssueTitle(e.target.value)}
              className="w-full rounded-lg border border-slate-800 bg-slate-950 px-3.5 py-2.5 text-sm text-slate-200 focus:border-emerald-500 focus:outline-none"
              required
            />
          </div>

          <div className="space-y-2">
            <label className="block font-mono text-xs font-semibold text-slate-300">
              Issue Description & Requirements
            </label>
            <textarea
              rows={4}
              value={issueBody}
              onChange={(e) => setIssueBody(e.target.value)}
              className="w-full rounded-lg border border-slate-800 bg-slate-950 px-3.5 py-2.5 text-sm text-slate-200 focus:border-emerald-500 focus:outline-none"
            />
          </div>
        </div>

        {/* Submit */}
        <div className="flex items-center justify-end gap-4 border-t border-slate-800 pt-4">
          <button
            type="submit"
            disabled={loading}
            className="flex items-center gap-2 rounded-xl bg-gradient-to-r from-emerald-500 to-teal-500 px-6 py-3 text-sm font-bold text-slate-950 shadow-lg shadow-emerald-500/20 hover:from-emerald-400 hover:to-teal-400 transition disabled:opacity-50"
          >
            <Play className="h-4 w-4 fill-slate-950" />
            <span>{loading ? 'Initializing Agent...' : '🚀 Start Autonomous Task'}</span>
          </button>
        </div>
      </form>
    </div>
  );
}

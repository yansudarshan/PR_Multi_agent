"use client";

import { useState } from 'react';
import { Terminal, Brain, CheckCircle, XCircle } from 'lucide-react';
import { AgentEvent, TestRun } from '../lib/types';

interface TerminalOutputProps {
  events: AgentEvent[];
  testRuns: TestRun[];
}

export default function TerminalOutput({ events = [], testRuns = [] }: TerminalOutputProps) {
  const [activeTab, setActiveTab] = useState<'terminal' | 'tests' | 'reasoning'>('terminal');

  const latestTest = testRuns[testRuns.length - 1];

  return (
    <div className="rounded-xl border border-slate-800 bg-slate-950 overflow-hidden backdrop-blur-md shadow-2xl">
      {/* Tab bar */}
      <div className="flex items-center justify-between border-b border-slate-800 bg-slate-900/80 px-4 py-2.5">
        <div className="flex items-center gap-1">
          <button
            onClick={() => setActiveTab('terminal')}
            className={`flex items-center gap-2 rounded-lg px-3 py-1.5 font-mono text-xs font-medium transition ${
              activeTab === 'terminal'
                ? 'bg-slate-800 text-emerald-400 border border-slate-700'
                : 'text-slate-400 hover:text-slate-200'
            }`}
          >
            <Terminal className="h-3.5 w-3.5" />
            <span>TERMINAL / AGENT LOG</span>
          </button>

          <button
            onClick={() => setActiveTab('tests')}
            className={`flex items-center gap-2 rounded-lg px-3 py-1.5 font-mono text-xs font-medium transition ${
              activeTab === 'tests'
                ? 'bg-slate-800 text-teal-400 border border-slate-700'
                : 'text-slate-400 hover:text-slate-200'
            }`}
          >
            {latestTest?.passed ? (
              <CheckCircle className="h-3.5 w-3.5 text-emerald-400" />
            ) : (
              <XCircle className="h-3.5 w-3.5 text-rose-400" />
            )}
            <span>TEST RUNNER ({testRuns.length})</span>
          </button>

          <button
            onClick={() => setActiveTab('reasoning')}
            className={`flex items-center gap-2 rounded-lg px-3 py-1.5 font-mono text-xs font-medium transition ${
              activeTab === 'reasoning'
                ? 'bg-slate-800 text-indigo-400 border border-slate-700'
                : 'text-slate-400 hover:text-slate-200'
            }`}
          >
            <Brain className="h-3.5 w-3.5" />
            <span>AGENT REASONING</span>
          </button>
        </div>

        <div className="flex items-center gap-2 text-xs font-mono text-slate-500">
          <span className="inline-block h-2 w-2 rounded-full bg-emerald-500 animate-pulse"></span>
          <span>Live Stream</span>
        </div>
      </div>

      {/* Content Body */}
      <div className="h-72 overflow-y-auto p-4 font-mono text-xs text-slate-300 leading-relaxed bg-slate-950">
        {activeTab === 'terminal' && (
          <div className="space-y-2">
            {events.length === 0 ? (
              <div className="text-slate-500 italic">$ Agent pipeline initialized. Awaiting commands...</div>
            ) : (
              events.map((evt) => (
                <div key={evt.id} className="flex items-start gap-2">
                  <span className="text-slate-500 font-normal">
                    [{new Date(evt.timestamp).toLocaleTimeString()}]
                  </span>
                  <span className="text-emerald-400 font-semibold">[{evt.agent}]</span>
                  <span className="text-slate-200">{evt.message}</span>
                </div>
              ))
            )}
          </div>
        )}

        {activeTab === 'tests' && (
          <div className="space-y-4">
            {testRuns.length === 0 ? (
              <div className="text-slate-500 italic">$ No test execution recorded yet.</div>
            ) : (
              testRuns.map((test, idx) => (
                <div key={test.id} className="rounded-lg border border-slate-800 bg-slate-900/50 p-3">
                  <div className="flex items-center justify-between mb-2">
                    <span className="font-bold text-slate-200">
                      $ {test.command} (Iteration {test.iteration})
                    </span>
                    <span
                      className={`rounded px-2 py-0.5 text-[11px] font-bold ${
                        test.passed
                          ? 'bg-emerald-500/10 text-emerald-400 border border-emerald-500/20'
                          : 'bg-rose-500/10 text-rose-400 border border-rose-500/20'
                      }`}
                    >
                      {test.passed ? 'PASSED' : 'FAILED'} (exit {test.exit_code})
                    </span>
                  </div>

                  {test.stdout && (
                    <div className="mt-2 text-slate-300 whitespace-pre-wrap font-mono text-[11px] bg-slate-950 p-2 rounded border border-slate-800">
                      {test.stdout}
                    </div>
                  )}

                  {test.stderr && (
                    <div className="mt-2 text-rose-300 whitespace-pre-wrap font-mono text-[11px] bg-slate-950 p-2 rounded border border-rose-900/50">
                      {test.stderr}
                    </div>
                  )}
                </div>
              ))
            )}
          </div>
        )}

        {activeTab === 'reasoning' && (
          <div className="space-y-3">
            <div className="rounded-lg border border-indigo-900/40 bg-indigo-950/20 p-3 text-indigo-200">
              <span className="font-bold text-indigo-400 block mb-1">Debugger Hypothesis:</span>
              "The failure indicates that timeout exceptions in auth/service.py are not being caught by the retry wrapper. Adding a try-except block over the HTTP call will handle gateway timeouts gracefully."
            </div>

            <div className="rounded-lg border border-teal-900/40 bg-teal-950/20 p-3 text-teal-200">
              <span className="font-bold text-teal-400 block mb-1">Planner Strategy:</span>
              "1. Inspect authentication flow. 2. Identify timeout handling logic. 3. Modify auth/service.py with exponential backoff retries. 4. Update tests/test_auth.py with regression test. 5. Run test suite. 6. Create PR."
            </div>
          </div>
        )}
      </div>
    </div>
  );
}

"use client";

import { useState } from 'react';
import dynamic from 'next/dynamic';
import { FileCode, FileText } from 'lucide-react';

const MonacoDiffEditor = dynamic(
  () => import('@monaco-editor/react').then((mod) => mod.DiffEditor),
  { ssr: false }
);

interface DiffViewerProps {
  diff?: string;
  filesModified?: string[];
}

export default function DiffViewer({ diff = '', filesModified = [] }: DiffViewerProps) {
  const [viewMode, setViewMode] = useState<'monaco' | 'raw'>('monaco');

  const defaultOriginal = `def authenticate(self, credentials: dict) -> dict:
    try:
        return self._call_auth_provider(credentials)
    except TimeoutException as e:
        # Bug: Immediate failure without retry
        raise e`;

  const defaultModified = `def authenticate(self, credentials: dict) -> dict:
    attempts = 0
    last_exception = None
    while attempts < self.max_retries:
        try:
            return self._call_auth_provider(credentials)
        except TimeoutException as e:
            attempts += 1
            last_exception = e
            if attempts >= self.max_retries:
                raise e
            time.sleep(0.01)
    if last_exception:
        raise last_exception
    raise TimeoutException("Authentication request timed out after retries")`;

  return (
    <div className="rounded-xl border border-slate-800 bg-slate-900/60 overflow-hidden backdrop-blur-md">
      {/* Header */}
      <div className="flex items-center justify-between border-b border-slate-800 bg-slate-950/60 px-4 py-3">
        <div className="flex items-center gap-3">
          <FileCode className="h-5 w-5 text-emerald-400" />
          <h4 className="font-mono text-sm font-semibold text-slate-200">
            Files Changed ({filesModified.length})
          </h4>
          {filesModified.map((file) => (
            <span
              key={file}
              className="rounded-md bg-slate-800 px-2.5 py-0.5 font-mono text-xs text-teal-300 border border-slate-700/50"
            >
              {file}
            </span>
          ))}
        </div>

        <div className="flex items-center gap-2">
          <button
            onClick={() => setViewMode('monaco')}
            className={`rounded-lg px-3 py-1 font-mono text-xs transition ${
              viewMode === 'monaco'
                ? 'bg-emerald-500/10 text-emerald-400 border border-emerald-500/20'
                : 'text-slate-400 hover:text-slate-200'
            }`}
          >
            Diff Editor
          </button>
          <button
            onClick={() => setViewMode('raw')}
            className={`rounded-lg px-3 py-1 font-mono text-xs transition ${
              viewMode === 'raw'
                ? 'bg-emerald-500/10 text-emerald-400 border border-emerald-500/20'
                : 'text-slate-400 hover:text-slate-200'
            }`}
          >
            Unified Patch
          </button>
        </div>
      </div>

      {/* Editor Content */}
      <div className="h-[420px] w-full bg-slate-950">
        {viewMode === 'monaco' ? (
          <MonacoDiffEditor
            original={defaultOriginal}
            modified={defaultModified}
            language="python"
            theme="vs-dark"
            options={{
              readOnly: true,
              renderSideBySide: true,
              minimap: { enabled: false },
              scrollBeyondLastLine: false,
              fontSize: 13,
              fontFamily: 'Fira Code, monospace',
            }}
          />
        ) : (
          <pre className="h-full w-full overflow-auto p-4 font-mono text-xs text-slate-300 leading-relaxed">
            {diff || defaultModified}
          </pre>
        )}
      </div>
    </div>
  );
}

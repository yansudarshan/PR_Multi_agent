"use client";

import Link from 'next/link';
import { Bot, GitPullRequest, PlusCircle, LayoutDashboard, ShieldCheck, Terminal } from 'lucide-react';

export default function Navbar() {
  return (
    <header className="sticky top-0 z-50 border-b border-slate-800/80 bg-slate-950/80 backdrop-blur-md">
      <div className="mx-auto flex max-w-7xl items-center justify-between px-4 py-3 sm:px-6">
        {/* Brand */}
        <Link href="/" className="flex items-center gap-3 transition hover:opacity-90">
          <div className="flex h-9 w-9 items-center justify-center rounded-xl bg-gradient-to-tr from-emerald-500 to-teal-400 p-2 shadow-lg shadow-emerald-500/20">
            <Bot className="h-5 w-5 text-slate-950 font-bold" />
          </div>
          <div>
            <div className="flex items-center gap-2">
              <span className="font-mono text-lg font-bold tracking-wider text-slate-100">DevAgent</span>
              <span className="rounded-md bg-emerald-500/10 px-2 py-0.5 text-xs font-semibold text-emerald-400 border border-emerald-500/20">v1.0</span>
            </div>
            <p className="text-[11px] text-slate-400 hidden sm:block">Autonomous AI Software Engineer</p>
          </div>
        </Link>

        {/* Navigation links */}
        <nav className="flex items-center gap-1 sm:gap-2">
          <Link
            href="/"
            className="flex items-center gap-2 rounded-lg px-3 py-1.5 text-sm font-medium text-slate-300 hover:bg-slate-900 hover:text-slate-100 transition"
          >
            <LayoutDashboard className="h-4 w-4 text-emerald-400" />
            <span className="hidden sm:inline">Dashboard</span>
          </Link>

          <Link
            href="/tasks/new"
            className="flex items-center gap-2 rounded-lg bg-gradient-to-r from-emerald-500 to-teal-500 px-3.5 py-1.5 text-sm font-semibold text-slate-950 shadow-md shadow-emerald-500/15 hover:from-emerald-400 hover:to-teal-400 transition"
          >
            <PlusCircle className="h-4 w-4" />
            <span>New Autonomous Task</span>
          </Link>
        </nav>

        {/* System Indicator */}
        <div className="flex items-center gap-3">
          <div className="flex items-center gap-2 rounded-full bg-slate-900/90 border border-slate-800 px-3 py-1 text-xs text-slate-300">
            <span className="relative flex h-2 w-2">
              <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-emerald-400 opacity-75"></span>
              <span className="relative inline-flex rounded-full h-2 w-2 bg-emerald-500"></span>
            </span>
            <span className="font-mono">Agent Ready</span>
          </div>
        </div>
      </div>
    </header>
  );
}

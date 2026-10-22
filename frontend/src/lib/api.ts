import { Repository, Task, AgentEvent, TestRun, AnalyticsSummary } from './types';

const API_BASE = process.env.NEXT_PUBLIC_API_URL || 'http://localhost:8000/api';

async function fetchJSON<T>(endpoint: string, options?: RequestInit): Promise<T> {
  const res = await fetch(`${API_BASE}${endpoint}`, {
    headers: {
      'Content-Type': 'application/json',
      ...options?.headers,
    },
    ...options,
  });
  if (!res.ok) {
    const errorBody = await res.text();
    throw new Error(`API error ${res.status}: ${errorBody}`);
  }
  return res.json();
}

export const api = {
  // Repositories
  listRepositories: () => fetchJSON<Repository[]>('/repositories'),
  connectRepository: (fullName: string) =>
    fetchJSON<Repository>('/repositories/connect', {
      method: 'POST',
      body: JSON.stringify({ full_name: fullName }),
    }),
  getIssues: (repoId: string) => fetchJSON<any[]>(`/repositories/${repoId}/issues`),
  fetchGitHubIssue: (repo: string, issueNumber: number) =>
    fetchJSON<{ repo: string; issue_number: number; title: string; body: string; html_url: string }>(
      `/repositories/github/issue?repo=${encodeURIComponent(repo)}&issue_number=${issueNumber}`
    ),

  // Tasks
  listTasks: () => fetchJSON<Task[]>('/tasks'),
  getTask: (taskId: string) => fetchJSON<Task>(`/tasks/${taskId}`),
  createTask: (repoFullName: string, issueNumber: number, issueTitle?: string, issueBody?: string) =>
    fetchJSON<Task>('/tasks', {
      method: 'POST',
      body: JSON.stringify({
        repository_full_name: repoFullName,
        issue_number: issueNumber,
        issue_title: issueTitle,
        issue_body: issueBody,
      }),
    }),
  approvePlan: (taskId: string) =>
    fetchJSON<{ status: string; message: string }>(`/tasks/${taskId}/approve-plan`, { method: 'POST' }),
  startTask: (taskId: string) =>
    fetchJSON<{ status: string; message: string }>(`/tasks/${taskId}/start`, { method: 'POST' }),
  stopTask: (taskId: string) =>
    fetchJSON<{ status: string; message: string }>(`/tasks/${taskId}/stop`, { method: 'POST' }),
  continueTask: (taskId: string) =>
    fetchJSON<{ status: string; message: string }>(`/tasks/${taskId}/continue`, { method: 'POST' }),
  getEvents: (taskId: string) => fetchJSON<AgentEvent[]>(`/tasks/${taskId}/events`),
  getDiff: (taskId: string) => fetchJSON<{ task_id: string; diff: string; files_modified: string[] }>(`/tasks/${taskId}/diff`),
  getTests: (taskId: string) => fetchJSON<TestRun[]>(`/tasks/${taskId}/tests`),
  getLogs: (taskId: string) => fetchJSON<{ task_id: string; logs: string }>(`/tasks/${taskId}/logs`),

  // Analytics
  getAnalytics: () => fetchJSON<AnalyticsSummary>('/tasks/analytics/summary'),

  // Health & Readiness
  getReadiness: () => fetchJSON<any>('/health/readiness'),
  testLLM: () => fetchJSON<any>('/health/llm', { method: 'POST' }),
};

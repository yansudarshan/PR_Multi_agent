export interface Repository {
  id: string;
  full_name: string;
  default_branch: string;
  language?: string;
  is_private: boolean;
  clone_url?: string;
}

export interface ImplementationPlan {
  problem_summary: string;
  requirements: string[];
  root_cause_hypothesis: string;
  files_to_modify: string[];
  files_to_inspect: string[];
  implementation_steps: string[];
  test_strategy: string[];
  risk_level: 'low' | 'medium' | 'high';
}

export interface Task {
  id: string;
  repository_id: string;
  repository_full_name: string;
  issue_number: number;
  issue_title: string;
  issue_body?: string;
  state: 
    | 'INITIALIZING'
    | 'ISSUE_ANALYSIS'
    | 'REPOSITORY_ANALYSIS'
    | 'PLANNING'
    | 'AWAITING_PLAN_APPROVAL'
    | 'CODING'
    | 'TESTING'
    | 'DEBUGGING'
    | 'REVIEWING'
    | 'COMMITTING'
    | 'PUSHING'
    | 'CREATING_PR'
    | 'CI_CHECK'
    | 'COMPLETED'
    | 'FAILED'
    | 'HUMAN_REVIEW_REQUIRED';
  plan?: ImplementationPlan;
  repo_metadata?: Record<string, any>;
  files_inspected?: string[];
  files_modified?: string[];
  current_diff?: string;
  iteration_count: number;
  max_iterations: number;
  branch_name?: string;
  commit_sha?: string;
  pull_request_url?: string;
  pull_request_number?: number;
  ci_status?: string;
  error_message?: string;
  created_at: string;
  updated_at: string;
  completed_at?: string;
}

export interface AgentEvent {
  id: string;
  task_id: string;
  agent: string;
  event_type: string;
  message: string;
  metadata_json?: Record<string, any>;
  timestamp: string;
}

export interface TestRun {
  id: string;
  task_id: string;
  iteration: number;
  command: string;
  passed: boolean;
  stdout?: string;
  stderr?: string;
  exit_code: number;
  failure_summary?: string;
  created_at: string;
}

export interface AnalyticsSummary {
  total_repositories: number;
  total_tasks: number;
  completed_tasks: number;
  failed_tasks: number;
  active_tasks: number;
  success_rate: number;
  avg_iterations: number;
  total_prs_created: number;
}

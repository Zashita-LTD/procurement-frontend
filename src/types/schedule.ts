// Типы для Construction Scheduling

export type StageStatus = 'not_started' | 'in_progress' | 'completed' | 'on_hold';

export interface ScheduleEstimateItem {
  name: string;
  quantity: number;
  unit: string;
  category: string;
}

export interface StageProgress {
  completed_items: number;
  total_items: number;
  percent_complete: number;
  actual_start_date: string | null;
  actual_end_date: string | null;
  notes: string | null;
}

export interface StageDependency {
  predecessor: string;
  successor: string;
  lag_weeks: number;
  dependency_type: 'finish_to_start' | 'start_to_start' | 'finish_to_finish';
}

export interface ConstructionStage {
  stage_name: string;
  relative_start_week: number;
  description: string;
  items: ScheduleEstimateItem[];
  status: StageStatus;
  progress: StageProgress | null;
  predecessors: string[];
  successors: string[];
  duration_weeks: number;
  color: string | null;
}

export interface ParsedEstimate {
  project_name: string | null;
  stages: ConstructionStage[];
  dependencies: StageDependency[];
  total_duration_weeks: number | null;
}

export interface ScheduleResponse {
  plan: ParsedEstimate;
  total_items: number;
  stages_count: number;
  uncategorized_count: number;
  total_duration_weeks: number;
}

export interface StageInfo {
  stage_name: string;
  relative_start_week: number;
  description: string;
  keywords: string[];
  category: string;
}

export interface CustomStageConfig {
  stage_name: string;
  relative_start_week: number;
  description: string;
  keywords: string[];
  duration_weeks: number;
  predecessors: string[];
}

export interface ScheduleFromItemsRequest {
  items: Array<{ name: string; quantity: number; unit: string }>;
  project_name?: string;
}

export interface ScheduleFromNamesRequest {
  materials: string[];
  project_name?: string;
}

export interface CustomScheduleRequest {
  items: Array<{ name: string; quantity: number; unit: string }>;
  project_name?: string;
  custom_stages: CustomStageConfig[];
}

export interface UpdateProgressRequest {
  stage_name: string;
  completed_items: number;
  status?: StageStatus;
  actual_start_date?: string;
  actual_end_date?: string;
  notes?: string;
}

export interface AddDependencyRequest {
  predecessor: string;
  successor: string;
  lag_weeks?: number;
  dependency_type?: 'finish_to_start' | 'start_to_start' | 'finish_to_finish';
}

export interface ExportParams {
  format: 'xlsx' | 'csv' | 'pdf';
  include_items?: boolean;
  include_gantt?: boolean;
  start_date?: string;
}

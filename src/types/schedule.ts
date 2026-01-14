// Типы для Construction Scheduling

export interface ScheduleEstimateItem {
  name: string;
  quantity: number;
  unit: string;
  category: string;
}

export interface ConstructionStage {
  stage_name: string;
  relative_start_week: number;
  description: string;
  items: ScheduleEstimateItem[];
}

export interface ParsedEstimate {
  project_name: string | null;
  stages: ConstructionStage[];
}

export interface ScheduleResponse {
  plan: ParsedEstimate;
  total_items: number;
  stages_count: number;
  uncategorized_count: number;
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

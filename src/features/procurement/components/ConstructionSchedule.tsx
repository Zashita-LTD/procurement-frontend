import { useState } from 'react';
import { List, BarChart3 } from 'lucide-react';
import { cn } from '@/lib/utils';
import { GanttView } from './GanttView';
import { StageListView } from './StageListView';
import type { ConstructionStage, ScheduleEstimateItem } from '@/types/schedule';

type ViewMode = 'gantt' | 'list';

interface ConstructionScheduleProps {
  stages: ConstructionStage[];
  projectName?: string | null;
  defaultView?: ViewMode;
  onStageClick?: (stage: ConstructionStage) => void;
  onItemClick?: (item: ScheduleEstimateItem, stage: ConstructionStage) => void;
}

export function ConstructionSchedule({
  stages,
  projectName,
  defaultView = 'list',
  onStageClick,
  onItemClick,
}: ConstructionScheduleProps) {
  const [viewMode, setViewMode] = useState<ViewMode>(defaultView);

  return (
    <div className="space-y-4">
      {/* View Switcher */}
      <div className="flex justify-end">
        <div className="inline-flex rounded-lg border bg-white p-1">
          <button
            onClick={() => setViewMode('list')}
            className={cn(
              'flex items-center gap-2 px-3 py-1.5 rounded-md text-sm font-medium transition-colors',
              viewMode === 'list'
                ? 'bg-blue-100 text-blue-700'
                : 'text-gray-600 hover:text-gray-900 hover:bg-gray-100'
            )}
          >
            <List className="h-4 w-4" />
            Список
          </button>
          <button
            onClick={() => setViewMode('gantt')}
            className={cn(
              'flex items-center gap-2 px-3 py-1.5 rounded-md text-sm font-medium transition-colors',
              viewMode === 'gantt'
                ? 'bg-blue-100 text-blue-700'
                : 'text-gray-600 hover:text-gray-900 hover:bg-gray-100'
            )}
          >
            <BarChart3 className="h-4 w-4" />
            Gantt
          </button>
        </div>
      </div>

      {/* View Content */}
      {viewMode === 'list' ? (
        <StageListView
          stages={stages}
          projectName={projectName}
          onItemClick={onItemClick}
        />
      ) : (
        <GanttView
          stages={stages}
          projectName={projectName}
          onStageClick={onStageClick}
        />
      )}
    </div>
  );
}

// Re-export sub-components
export { GanttView } from './GanttView';
export { StageListView } from './StageListView';

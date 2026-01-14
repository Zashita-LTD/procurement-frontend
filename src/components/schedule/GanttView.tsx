/**
 * GanttView - Диаграмма Ганта для этапов строительства
 * Визуализация timeline проекта с прогрессом и зависимостями
 */
import { useMemo } from 'react';
import type { ConstructionStage, StageDependency, StageStatus } from '@/types/schedule';

interface GanttViewProps {
  stages: ConstructionStage[];
  dependencies?: StageDependency[];
  totalDuration: number;
  projectStartDate?: Date;
  onStageClick?: (stage: ConstructionStage) => void;
}

const STAGE_COLORS: Record<string, string> = {
  'Stage 1': '#FFC000',
  'Stage 2': '#92D050', 
  'Stage 3': '#00B0F0',
  'Stage X': '#7030A0',
  'default': '#6B7280',
};

const STATUS_STYLES: Record<StageStatus, { bg: string; border: string; text: string }> = {
  not_started: { bg: 'bg-gray-100', border: 'border-gray-300', text: 'text-gray-500' },
  in_progress: { bg: 'bg-blue-100', border: 'border-blue-500', text: 'text-blue-700' },
  completed: { bg: 'bg-green-100', border: 'border-green-500', text: 'text-green-700' },
  on_hold: { bg: 'bg-yellow-100', border: 'border-yellow-500', text: 'text-yellow-700' },
};

function formatDate(date: Date): string {
  return date.toLocaleDateString('ru-RU', { day: 'numeric', month: 'short' });
}

function addWeeks(date: Date, weeks: number): Date {
  const result = new Date(date);
  result.setDate(result.getDate() + weeks * 7);
  return result;
}

export function GanttView({
  stages,
  dependencies = [],
  totalDuration,
  projectStartDate = new Date(),
  onStageClick,
}: GanttViewProps) {
  // Generate week markers
  const weekMarkers = useMemo(() => {
    const markers: { week: number; date: Date; label: string }[] = [];
    for (let w = 0; w <= totalDuration; w += 2) {
      const date = addWeeks(projectStartDate, w);
      markers.push({
        week: w,
        date,
        label: `W${w}`,
      });
    }
    return markers;
  }, [totalDuration, projectStartDate]);

  // Calculate pixel positions
  const weekWidth = 60; // pixels per week
  const totalWidth = totalDuration * weekWidth + 100;

  return (
    <div className="w-full overflow-x-auto">
      <div className="min-w-max" style={{ width: totalWidth }}>
        {/* Header with week markers */}
        <div className="flex border-b border-gray-200 bg-gray-50 sticky top-0 z-10">
          <div className="w-48 flex-shrink-0 p-3 font-medium text-gray-700 border-r">
            Этап
          </div>
          <div className="flex-1 flex relative">
            {weekMarkers.map((marker) => (
              <div
                key={marker.week}
                className="flex flex-col items-center border-r border-gray-200 text-xs text-gray-500"
                style={{ width: weekWidth * 2 }}
              >
                <span className="font-medium">{marker.label}</span>
                <span className="text-gray-400">{formatDate(marker.date)}</span>
              </div>
            ))}
          </div>
        </div>

        {/* Stage rows */}
        <div className="divide-y divide-gray-100">
          {stages.map((stage) => {
            const color = stage.color || STAGE_COLORS[stage.stage_name] || STAGE_COLORS.default;
            const statusStyle = STATUS_STYLES[stage.status] || STATUS_STYLES.not_started;
            const barLeft = stage.relative_start_week * weekWidth;
            const barWidth = stage.duration_weeks * weekWidth;
            const progress = stage.progress?.percent_complete || 0;

            return (
              <div
                key={stage.stage_name}
                className={`flex hover:bg-gray-50 cursor-pointer transition-colors ${statusStyle.bg}`}
                onClick={() => onStageClick?.(stage)}
              >
                {/* Stage name column */}
                <div className={`w-48 flex-shrink-0 p-3 border-r border-gray-200 ${statusStyle.text}`}>
                  <div className="font-medium truncate">{stage.stage_name}</div>
                  <div className="text-xs text-gray-500 truncate">{stage.description}</div>
                  {stage.progress && (
                    <div className="text-xs mt-1">
                      <span className="font-medium">{progress.toFixed(0)}%</span>
                      <span className="text-gray-400 ml-1">
                        ({stage.progress.completed_items}/{stage.progress.total_items})
                      </span>
                    </div>
                  )}
                </div>

                {/* Timeline bar */}
                <div className="flex-1 relative h-20 flex items-center">
                  {/* Grid lines */}
                  {weekMarkers.map((marker) => (
                    <div
                      key={marker.week}
                      className="absolute top-0 bottom-0 border-l border-gray-100"
                      style={{ left: marker.week * weekWidth }}
                    />
                  ))}

                  {/* Stage bar */}
                  <div
                    className="absolute h-10 rounded-lg shadow-sm border-2 transition-all overflow-hidden"
                    style={{
                      left: barLeft,
                      width: barWidth,
                      backgroundColor: color,
                      borderColor: statusStyle.border.replace('border-', ''),
                    }}
                  >
                    {/* Progress fill */}
                    {progress > 0 && (
                      <div
                        className="absolute inset-y-0 left-0 bg-black/20 transition-all"
                        style={{ width: `${progress}%` }}
                      />
                    )}

                    {/* Label inside bar */}
                    <div className="absolute inset-0 flex items-center justify-center text-white text-xs font-medium drop-shadow">
                      {stage.items.length} поз.
                    </div>
                  </div>

                  {/* Dependency arrows */}
                  {dependencies
                    .filter((d) => d.successor === stage.stage_name)
                    .map((dep) => {
                      const predStage = stages.find((s) => s.stage_name === dep.predecessor);
                      if (!predStage) return null;
                      const predEnd = (predStage.relative_start_week + predStage.duration_weeks) * weekWidth;
                      const succStart = barLeft;

                      return (
                        <svg
                          key={`${dep.predecessor}-${dep.successor}`}
                          className="absolute top-1/2 pointer-events-none"
                          style={{
                            left: predEnd,
                            width: succStart - predEnd,
                            height: 20,
                            transform: 'translateY(-50%)',
                          }}
                        >
                          <path
                            d={`M0,10 L${succStart - predEnd - 5},10`}
                            stroke="#9CA3AF"
                            strokeWidth="2"
                            fill="none"
                            markerEnd="url(#arrowhead)"
                          />
                          <defs>
                            <marker
                              id="arrowhead"
                              markerWidth="6"
                              markerHeight="6"
                              refX="5"
                              refY="3"
                              orient="auto"
                            >
                              <polygon points="0 0, 6 3, 0 6" fill="#9CA3AF" />
                            </marker>
                          </defs>
                        </svg>
                      );
                    })}
                </div>
              </div>
            );
          })}
        </div>

        {/* Legend */}
        <div className="flex gap-6 p-4 border-t bg-gray-50">
          <div className="text-xs text-gray-500 font-medium">Статус:</div>
          {Object.entries(STATUS_STYLES).map(([status, style]) => (
            <div key={status} className="flex items-center gap-1 text-xs">
              <div className={`w-3 h-3 rounded ${style.bg} ${style.border} border`} />
              <span className={style.text}>
                {status === 'not_started' && 'Не начат'}
                {status === 'in_progress' && 'В работе'}
                {status === 'completed' && 'Завершён'}
                {status === 'on_hold' && 'На паузе'}
              </span>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}

export default GanttView;

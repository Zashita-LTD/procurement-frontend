import { useState, useMemo } from 'react';
import { Calendar, Package, Clock, ChevronDown, ChevronRight, AlertCircle } from 'lucide-react';
import { cn } from '@/lib/utils';
import type { ConstructionStage, ScheduleEstimateItem } from '@/types/schedule';

interface GanttViewProps {
  stages: ConstructionStage[];
  projectName?: string | null;
  onStageClick?: (stage: ConstructionStage) => void;
}

// Цвета для этапов
const STAGE_COLORS: Record<string, string> = {
  'Stage 1': 'bg-amber-500',
  'Stage 2': 'bg-blue-500',
  'Stage 3': 'bg-green-500',
  'Stage X': 'bg-purple-500',
  'Uncategorized / General': 'bg-gray-400',
};

const STAGE_BG_COLORS: Record<string, string> = {
  'Stage 1': 'bg-amber-50 border-amber-200',
  'Stage 2': 'bg-blue-50 border-blue-200',
  'Stage 3': 'bg-green-50 border-green-200',
  'Stage X': 'bg-purple-50 border-purple-200',
  'Uncategorized / General': 'bg-gray-50 border-gray-200',
};

export function GanttView({ stages, projectName, onStageClick }: GanttViewProps) {
  const [expandedStages, setExpandedStages] = useState<Set<string>>(new Set());

  // Вычисляем максимальную неделю для масштаба
  const maxWeek = useMemo(() => {
    return Math.max(...stages.map(s => s.relative_start_week + 4), 16);
  }, [stages]);

  // Недели для шкалы
  const weeks = useMemo(() => {
    return Array.from({ length: maxWeek }, (_, i) => i + 1);
  }, [maxWeek]);

  const toggleStage = (stageName: string) => {
    setExpandedStages(prev => {
      const next = new Set(prev);
      if (next.has(stageName)) {
        next.delete(stageName);
      } else {
        next.add(stageName);
      }
      return next;
    });
  };

  const getStageColor = (stageName: string) => {
    return STAGE_COLORS[stageName] || 'bg-gray-500';
  };

  const getStageBgColor = (stageName: string) => {
    return STAGE_BG_COLORS[stageName] || 'bg-gray-50 border-gray-200';
  };

  // Сортировка по неделе
  const sortedStages = useMemo(() => {
    return [...stages].sort((a, b) => a.relative_start_week - b.relative_start_week);
  }, [stages]);

  const totalItems = stages.reduce((sum, s) => sum + s.items.length, 0);

  return (
    <div className="bg-white rounded-lg border shadow-sm">
      {/* Header */}
      <div className="p-4 border-b">
        <div className="flex items-center justify-between">
          <div>
            <h3 className="text-lg font-semibold flex items-center gap-2">
              <Calendar className="h-5 w-5 text-blue-600" />
              График поставок
            </h3>
            {projectName && (
              <p className="text-sm text-gray-500 mt-1">{projectName}</p>
            )}
          </div>
          <div className="flex items-center gap-4 text-sm text-gray-600">
            <span className="flex items-center gap-1">
              <Package className="h-4 w-4" />
              {totalItems} позиций
            </span>
            <span className="flex items-center gap-1">
              <Clock className="h-4 w-4" />
              {stages.length} этапов
            </span>
          </div>
        </div>
      </div>

      {/* Gantt Chart */}
      <div className="overflow-x-auto">
        <div className="min-w-[800px]">
          {/* Timeline Header */}
          <div className="flex border-b bg-gray-50">
            <div className="w-64 shrink-0 p-3 font-medium text-gray-700 border-r">
              Этап
            </div>
            <div className="flex-1 flex">
              {weeks.map(week => (
                <div
                  key={week}
                  className="flex-1 min-w-[40px] p-2 text-center text-xs font-medium text-gray-500 border-r last:border-r-0"
                >
                  Н{week}
                </div>
              ))}
            </div>
          </div>

          {/* Stages */}
          {sortedStages.map(stage => {
            const isExpanded = expandedStages.has(stage.stage_name);
            const barStart = ((stage.relative_start_week - 1) / maxWeek) * 100;
            const barWidth = (4 / maxWeek) * 100; // Длительность этапа ~4 недели

            return (
              <div key={stage.stage_name} className="border-b last:border-b-0">
                {/* Stage Row */}
                <div
                  className={cn(
                    'flex cursor-pointer hover:bg-gray-50 transition-colors',
                    isExpanded && getStageBgColor(stage.stage_name)
                  )}
                  onClick={() => {
                    toggleStage(stage.stage_name);
                    onStageClick?.(stage);
                  }}
                >
                  {/* Stage Name */}
                  <div className="w-64 shrink-0 p-3 border-r flex items-center gap-2">
                    <button className="p-0.5 hover:bg-gray-200 rounded">
                      {isExpanded ? (
                        <ChevronDown className="h-4 w-4 text-gray-500" />
                      ) : (
                        <ChevronRight className="h-4 w-4 text-gray-500" />
                      )}
                    </button>
                    <div
                      className={cn('w-3 h-3 rounded-full', getStageColor(stage.stage_name))}
                    />
                    <div className="flex-1 min-w-0">
                      <p className="font-medium text-sm truncate">{stage.stage_name}</p>
                      <p className="text-xs text-gray-500 truncate">
                        {stage.items.length} поз. • Неделя {stage.relative_start_week}
                      </p>
                    </div>
                  </div>

                  {/* Gantt Bar */}
                  <div className="flex-1 relative p-2">
                    <div className="absolute inset-y-2 flex items-center" style={{ left: `${barStart}%` }}>
                      <div
                        className={cn(
                          'h-8 rounded-md shadow-sm flex items-center px-2 text-white text-xs font-medium',
                          getStageColor(stage.stage_name)
                        )}
                        style={{ width: `${barWidth}%`, minWidth: '80px' }}
                      >
                        {stage.description.length > 20
                          ? stage.description.slice(0, 20) + '...'
                          : stage.description}
                      </div>
                    </div>
                  </div>
                </div>

                {/* Expanded Items */}
                {isExpanded && (
                  <div className={cn('border-t', getStageBgColor(stage.stage_name))}>
                    <div className="px-4 py-2">
                      <p className="text-xs font-medium text-gray-500 mb-2 uppercase tracking-wider">
                        Материалы этапа
                      </p>
                      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-2">
                        {stage.items.map((item, idx) => (
                          <ItemCard key={idx} item={item} stageColor={getStageColor(stage.stage_name)} />
                        ))}
                      </div>
                    </div>
                  </div>
                )}
              </div>
            );
          })}

          {/* Empty State */}
          {stages.length === 0 && (
            <div className="p-8 text-center text-gray-500">
              <AlertCircle className="h-12 w-12 mx-auto mb-3 text-gray-300" />
              <p>Нет данных для отображения</p>
              <p className="text-sm">Загрузите смету для формирования графика</p>
            </div>
          )}
        </div>
      </div>

      {/* Legend */}
      <div className="p-4 border-t bg-gray-50">
        <p className="text-xs font-medium text-gray-500 mb-2">Легенда:</p>
        <div className="flex flex-wrap gap-4">
          {Object.entries(STAGE_COLORS).map(([name, color]) => (
            <div key={name} className="flex items-center gap-2 text-xs text-gray-600">
              <div className={cn('w-3 h-3 rounded-full', color)} />
              <span>{name}</span>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}

// Карточка материала
function ItemCard({ item, stageColor }: { item: ScheduleEstimateItem; stageColor: string }) {
  return (
    <div className="bg-white rounded border p-2 flex items-center gap-2 text-sm">
      <div className={cn('w-1.5 h-8 rounded-full', stageColor)} />
      <div className="flex-1 min-w-0">
        <p className="font-medium truncate">{item.name}</p>
        <p className="text-xs text-gray-500">
          {item.quantity} {item.unit}
        </p>
      </div>
    </div>
  );
}

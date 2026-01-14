import { useState } from 'react';
import { List, BarChart3, Package, Clock, AlertTriangle } from 'lucide-react';
import { cn } from '@/lib/utils';
import type { ConstructionStage, ScheduleEstimateItem } from '@/types/schedule';

interface StageListViewProps {
  stages: ConstructionStage[];
  projectName?: string | null;
  onItemClick?: (item: ScheduleEstimateItem, stage: ConstructionStage) => void;
}

// Цвета для этапов
const STAGE_COLORS: Record<string, { bg: string; border: string; text: string; badge: string }> = {
  'Stage 1': { 
    bg: 'bg-amber-50', 
    border: 'border-amber-200', 
    text: 'text-amber-800',
    badge: 'bg-amber-100 text-amber-700'
  },
  'Stage 2': { 
    bg: 'bg-blue-50', 
    border: 'border-blue-200', 
    text: 'text-blue-800',
    badge: 'bg-blue-100 text-blue-700'
  },
  'Stage 3': { 
    bg: 'bg-green-50', 
    border: 'border-green-200', 
    text: 'text-green-800',
    badge: 'bg-green-100 text-green-700'
  },
  'Stage X': { 
    bg: 'bg-purple-50', 
    border: 'border-purple-200', 
    text: 'text-purple-800',
    badge: 'bg-purple-100 text-purple-700'
  },
  'Uncategorized / General': { 
    bg: 'bg-gray-50', 
    border: 'border-gray-200', 
    text: 'text-gray-800',
    badge: 'bg-gray-100 text-gray-700'
  },
};

const getStageColors = (stageName: string) => {
  return STAGE_COLORS[stageName] || STAGE_COLORS['Uncategorized / General'];
};

export function StageListView({ stages, projectName, onItemClick }: StageListViewProps) {
  const [expandedStages, setExpandedStages] = useState<Set<string>>(
    new Set(stages.map(s => s.stage_name)) // Все развернуты по умолчанию
  );

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

  // Сортировка по неделе
  const sortedStages = [...stages].sort((a, b) => a.relative_start_week - b.relative_start_week);

  const totalItems = stages.reduce((sum, s) => sum + s.items.length, 0);
  const uncategorizedCount = stages
    .filter(s => s.stage_name.toLowerCase().includes('uncategorized'))
    .reduce((sum, s) => sum + s.items.length, 0);

  return (
    <div className="space-y-4">
      {/* Summary Header */}
      <div className="bg-white rounded-lg border p-4">
        <div className="flex items-center justify-between">
          <div>
            <h3 className="text-lg font-semibold flex items-center gap-2">
              <List className="h-5 w-5 text-blue-600" />
              План поставок по этапам
            </h3>
            {projectName && (
              <p className="text-sm text-gray-500 mt-1">{projectName}</p>
            )}
          </div>
          <div className="flex items-center gap-6 text-sm">
            <div className="flex items-center gap-2 text-gray-600">
              <Package className="h-4 w-4" />
              <span><strong>{totalItems}</strong> позиций</span>
            </div>
            <div className="flex items-center gap-2 text-gray-600">
              <BarChart3 className="h-4 w-4" />
              <span><strong>{stages.length}</strong> этапов</span>
            </div>
            {uncategorizedCount > 0 && (
              <div className="flex items-center gap-2 text-yellow-600">
                <AlertTriangle className="h-4 w-4" />
                <span><strong>{uncategorizedCount}</strong> без этапа</span>
              </div>
            )}
          </div>
        </div>
      </div>

      {/* Stage Cards */}
      <div className="space-y-3">
        {sortedStages.map(stage => {
          const colors = getStageColors(stage.stage_name);
          const isExpanded = expandedStages.has(stage.stage_name);
          const isUncategorized = stage.stage_name.toLowerCase().includes('uncategorized');

          return (
            <div
              key={stage.stage_name}
              className={cn(
                'rounded-lg border-2 overflow-hidden transition-all',
                colors.border,
                isExpanded ? colors.bg : 'bg-white'
              )}
            >
              {/* Stage Header */}
              <button
                onClick={() => toggleStage(stage.stage_name)}
                className={cn(
                  'w-full p-4 flex items-center justify-between text-left',
                  'hover:bg-opacity-80 transition-colors',
                  colors.bg
                )}
              >
                <div className="flex items-center gap-3">
                  <span className={cn('px-3 py-1 rounded-full text-sm font-medium', colors.badge)}>
                    {stage.stage_name}
                  </span>
                  <div>
                    <h4 className={cn('font-semibold', colors.text)}>
                      {stage.description}
                    </h4>
                    <p className="text-sm text-gray-500 flex items-center gap-2 mt-0.5">
                      <Clock className="h-3.5 w-3.5" />
                      Неделя {stage.relative_start_week}
                      <span className="mx-1">•</span>
                      <Package className="h-3.5 w-3.5" />
                      {stage.items.length} позиций
                    </p>
                  </div>
                </div>
                <div className="text-gray-400">
                  {isExpanded ? '▼' : '▶'}
                </div>
              </button>

              {/* Items List */}
              {isExpanded && (
                <div className="px-4 pb-4">
                  <div className="bg-white rounded-lg border overflow-hidden">
                    <table className="w-full text-sm">
                      <thead className="bg-gray-50">
                        <tr>
                          <th className="text-left px-4 py-2 font-medium text-gray-600">Наименование</th>
                          <th className="text-center px-4 py-2 font-medium text-gray-600 w-32">Количество</th>
                          <th className="text-center px-4 py-2 font-medium text-gray-600 w-24">Ед. изм.</th>
                          <th className="text-center px-4 py-2 font-medium text-gray-600 w-32">Категория</th>
                        </tr>
                      </thead>
                      <tbody>
                        {stage.items.map((item, idx) => (
                          <tr
                            key={idx}
                            onClick={() => onItemClick?.(item, stage)}
                            className={cn(
                              'border-t hover:bg-gray-50 transition-colors',
                              onItemClick && 'cursor-pointer'
                            )}
                          >
                            <td className="px-4 py-2.5 font-medium">{item.name}</td>
                            <td className="px-4 py-2.5 text-center">{item.quantity}</td>
                            <td className="px-4 py-2.5 text-center text-gray-500">{item.unit}</td>
                            <td className="px-4 py-2.5 text-center">
                              <span className="px-2 py-0.5 rounded bg-gray-100 text-gray-600 text-xs">
                                {item.category}
                              </span>
                            </td>
                          </tr>
                        ))}
                      </tbody>
                    </table>
                  </div>

                  {/* Warning for uncategorized */}
                  {isUncategorized && (
                    <div className="mt-3 p-3 bg-yellow-50 border border-yellow-200 rounded-lg flex items-start gap-2">
                      <AlertTriangle className="h-5 w-5 text-yellow-600 shrink-0 mt-0.5" />
                      <div className="text-sm text-yellow-800">
                        <p className="font-medium">Требуется ручная классификация</p>
                        <p className="text-yellow-700 mt-0.5">
                          Эти материалы не удалось автоматически отнести к этапу строительства.
                          Укажите этап вручную для корректного планирования поставок.
                        </p>
                      </div>
                    </div>
                  )}
                </div>
              )}
            </div>
          );
        })}
      </div>

      {/* Empty State */}
      {stages.length === 0 && (
        <div className="bg-white rounded-lg border p-8 text-center text-gray-500">
          <Package className="h-12 w-12 mx-auto mb-3 text-gray-300" />
          <p className="font-medium">Нет данных для отображения</p>
          <p className="text-sm mt-1">Загрузите смету для формирования плана поставок</p>
        </div>
      )}
    </div>
  );
}

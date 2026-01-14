/**
 * StageListView - Список этапов строительства
 * Показывает этапы с материалами, прогрессом и возможностью редактирования
 */
import { useState } from 'react';
import { ChevronDown, ChevronRight, Calendar, Package, CheckCircle, Clock, Pause, AlertCircle } from 'lucide-react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Progress } from '@/components/ui/progress';
import type { ConstructionStage, StageStatus } from '@/types/schedule';

interface StageListViewProps {
  stages: ConstructionStage[];
  onUpdateProgress?: (stageName: string, completedItems: number) => void;
  onChangeStatus?: (stageName: string, status: StageStatus) => void;
}

const STAGE_ICONS: Record<string, string> = {
  'Stage 1': '🏗️',
  'Stage 2': '🧱',
  'Stage 3': '🔌',
  'Stage X': '🎨',
};

const STATUS_CONFIG: Record<StageStatus, { label: string; icon: typeof CheckCircle; color: string }> = {
  not_started: { label: 'Не начат', icon: Clock, color: 'text-gray-500' },
  in_progress: { label: 'В работе', icon: AlertCircle, color: 'text-blue-500' },
  completed: { label: 'Завершён', icon: CheckCircle, color: 'text-green-500' },
  on_hold: { label: 'На паузе', icon: Pause, color: 'text-yellow-500' },
};

export function StageListView({ stages, onUpdateProgress, onChangeStatus }: StageListViewProps) {
  const [expandedStages, setExpandedStages] = useState<Set<string>>(new Set());

  const toggleStage = (stageName: string) => {
    setExpandedStages((prev) => {
      const next = new Set(prev);
      if (next.has(stageName)) {
        next.delete(stageName);
      } else {
        next.add(stageName);
      }
      return next;
    });
  };

  const getProgressPercent = (stage: ConstructionStage): number => {
    if (stage.progress) {
      return stage.progress.percent_complete;
    }
    // Default: calculate from items if no progress data
    return 0;
  };

  return (
    <div className="space-y-4">
      {stages.map((stage) => {
        const isExpanded = expandedStages.has(stage.stage_name);
        const icon = STAGE_ICONS[stage.stage_name] || '📦';
        const statusConfig = STATUS_CONFIG[stage.status] || STATUS_CONFIG.not_started;
        const StatusIcon = statusConfig.icon;
        const progress = getProgressPercent(stage);

        return (
          <Card key={stage.stage_name} className="overflow-hidden">
            <CardHeader
              className="cursor-pointer hover:bg-gray-50 transition-colors"
              onClick={() => toggleStage(stage.stage_name)}
            >
              <div className="flex items-center justify-between">
                <div className="flex items-center gap-3">
                  {isExpanded ? (
                    <ChevronDown className="h-5 w-5 text-gray-400" />
                  ) : (
                    <ChevronRight className="h-5 w-5 text-gray-400" />
                  )}
                  <span className="text-2xl">{icon}</span>
                  <div>
                    <CardTitle className="text-lg">{stage.stage_name}</CardTitle>
                    <p className="text-sm text-gray-500">{stage.description}</p>
                  </div>
                </div>

                <div className="flex items-center gap-6">
                  {/* Progress */}
                  <div className="w-32">
                    <div className="flex justify-between text-xs text-gray-500 mb-1">
                      <span>Прогресс</span>
                      <span>{progress.toFixed(0)}%</span>
                    </div>
                    <Progress value={progress} className="h-2" />
                  </div>

                  {/* Stats */}
                  <div className="flex items-center gap-4 text-sm text-gray-500">
                    <div className="flex items-center gap-1">
                      <Calendar className="h-4 w-4" />
                      <span>W{stage.relative_start_week}</span>
                    </div>
                    <div className="flex items-center gap-1">
                      <Package className="h-4 w-4" />
                      <span>{stage.items.length} поз.</span>
                    </div>
                  </div>

                  {/* Status badge */}
                  <div className={`flex items-center gap-1 ${statusConfig.color}`}>
                    <StatusIcon className="h-4 w-4" />
                    <span className="text-sm font-medium">{statusConfig.label}</span>
                  </div>
                </div>
              </div>
            </CardHeader>

            {isExpanded && (
              <CardContent className="pt-0">
                {/* Status controls */}
                {onChangeStatus && (
                  <div className="flex gap-2 mb-4 pb-4 border-b">
                    <span className="text-sm text-gray-500 mr-2">Изменить статус:</span>
                    {(['not_started', 'in_progress', 'completed', 'on_hold'] as StageStatus[]).map(
                      (status) => {
                        const config = STATUS_CONFIG[status];
                        const Icon = config.icon;
                        return (
                          <Button
                            key={status}
                            variant={stage.status === status ? 'default' : 'outline'}
                            size="sm"
                            onClick={() => onChangeStatus(stage.stage_name, status)}
                          >
                            <Icon className="h-4 w-4 mr-1" />
                            {config.label}
                          </Button>
                        );
                      }
                    )}
                  </div>
                )}

                {/* Dependencies info */}
                {(stage.predecessors.length > 0 || stage.successors.length > 0) && (
                  <div className="flex gap-6 mb-4 text-sm">
                    {stage.predecessors.length > 0 && (
                      <div>
                        <span className="text-gray-500">После:</span>{' '}
                        <span className="font-medium">{stage.predecessors.join(', ')}</span>
                      </div>
                    )}
                    {stage.successors.length > 0 && (
                      <div>
                        <span className="text-gray-500">До:</span>{' '}
                        <span className="font-medium">{stage.successors.join(', ')}</span>
                      </div>
                    )}
                  </div>
                )}

                {/* Progress notes */}
                {stage.progress?.notes && (
                  <div className="mb-4 p-3 bg-blue-50 rounded-lg text-sm">
                    <span className="font-medium text-blue-700">Заметки: </span>
                    <span className="text-blue-600">{stage.progress.notes}</span>
                  </div>
                )}

                {/* Materials table */}
                <div className="rounded-lg border overflow-hidden">
                  <table className="w-full text-sm">
                    <thead className="bg-gray-50">
                      <tr>
                        <th className="text-left p-3 font-medium text-gray-700">Материал</th>
                        <th className="text-right p-3 font-medium text-gray-700 w-24">Кол-во</th>
                        <th className="text-left p-3 font-medium text-gray-700 w-20">Ед.</th>
                        <th className="text-left p-3 font-medium text-gray-700 w-32">Категория</th>
                      </tr>
                    </thead>
                    <tbody className="divide-y">
                      {stage.items.map((item, idx) => (
                        <tr key={idx} className="hover:bg-gray-50">
                          <td className="p-3">{item.name}</td>
                          <td className="p-3 text-right font-mono">{item.quantity.toLocaleString()}</td>
                          <td className="p-3 text-gray-500">{item.unit}</td>
                          <td className="p-3">
                            <span className="px-2 py-1 bg-gray-100 rounded text-xs">
                              {item.category}
                            </span>
                          </td>
                        </tr>
                      ))}
                      {stage.items.length === 0 && (
                        <tr>
                          <td colSpan={4} className="p-6 text-center text-gray-400">
                            Нет материалов в этом этапе
                          </td>
                        </tr>
                      )}
                    </tbody>
                  </table>
                </div>

                {/* Quick progress update */}
                {onUpdateProgress && stage.items.length > 0 && (
                  <div className="mt-4 flex items-center gap-4">
                    <span className="text-sm text-gray-500">Выполнено позиций:</span>
                    <input
                      type="number"
                      min={0}
                      max={stage.items.length}
                      defaultValue={stage.progress?.completed_items || 0}
                      className="w-20 px-2 py-1 border rounded text-sm"
                      onBlur={(e) => {
                        const value = parseInt(e.target.value, 10) || 0;
                        onUpdateProgress(stage.stage_name, value);
                      }}
                    />
                    <span className="text-sm text-gray-400">из {stage.items.length}</span>
                  </div>
                )}
              </CardContent>
            )}
          </Card>
        );
      })}

      {stages.length === 0 && (
        <Card>
          <CardContent className="p-12 text-center text-gray-400">
            <Package className="h-12 w-12 mx-auto mb-4 opacity-50" />
            <p>Нет этапов для отображения</p>
          </CardContent>
        </Card>
      )}
    </div>
  );
}

export default StageListView;

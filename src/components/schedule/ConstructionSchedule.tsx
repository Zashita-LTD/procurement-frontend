/**
 * ConstructionSchedule - Главный компонент планирования строительства
 * Объединяет GanttView и StageListView с переключением и экспортом
 */
import { useState, useEffect } from 'react';
import { LayoutList, BarChart3, Download, FileSpreadsheet, FileText, RefreshCw } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { GanttView } from './GanttView';
import { StageListView } from './StageListView';
import {
  getScheduleFromDocument,
  createScheduleFromItems,
  updateStageProgress,
  exportToExcel,
  exportToCsv,
  downloadExport,
} from '@/lib/scheduleApi';
import type { ScheduleResponse, ConstructionStage, StageStatus } from '@/types/schedule';

type ViewMode = 'list' | 'gantt';

interface ConstructionScheduleProps {
  projectId?: string;
  projectName?: string;
  documentId?: string;
  items?: Array<{ name: string; quantity: number; unit: string }>;
  onScheduleLoad?: (schedule: ScheduleResponse) => void;
}

export function ConstructionSchedule({
  projectId,
  projectName,
  documentId,
  items,
  onScheduleLoad,
}: ConstructionScheduleProps) {
  const [viewMode, setViewMode] = useState<ViewMode>('list');
  const [schedule, setSchedule] = useState<ScheduleResponse | null>(null);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [exporting, setExporting] = useState(false);

  // Load schedule on mount or when props change
  useEffect(() => {
    loadSchedule();
  }, [documentId, items]);

  const loadSchedule = async () => {
    setLoading(true);
    setError(null);

    try {
      let result: ScheduleResponse;

      if (documentId) {
        result = await getScheduleFromDocument(documentId);
      } else if (items && items.length > 0) {
        result = await createScheduleFromItems({
          items,
          project_name: projectName || 'Проект',
        });
      } else {
        setSchedule(null);
        setLoading(false);
        return;
      }

      setSchedule(result);
      onScheduleLoad?.(result);
    } catch (err) {
      console.error('Failed to load schedule:', err);
      setError('Не удалось загрузить план строительства');
    } finally {
      setLoading(false);
    }
  };

  const handleUpdateProgress = async (stageName: string, completedItems: number) => {
    if (!schedule) return;

    try {
      await updateStageProgress({
        stage_name: stageName,
        completed_items: completedItems,
      });

      // Update local state
      const updatedStages = schedule.plan.stages.map((stage) => {
        if (stage.stage_name === stageName) {
          const totalItems = stage.items.length;
          return {
            ...stage,
            progress: {
              completed_items: completedItems,
              total_items: totalItems,
              percent_complete: totalItems > 0 ? (completedItems / totalItems) * 100 : 0,
              actual_start_date: stage.progress?.actual_start_date || null,
              actual_end_date: stage.progress?.actual_end_date || null,
              notes: stage.progress?.notes || null,
            },
          };
        }
        return stage;
      });

      setSchedule({
        ...schedule,
        plan: {
          ...schedule.plan,
          stages: updatedStages,
        },
      });
    } catch (err) {
      console.error('Failed to update progress:', err);
    }
  };

  const handleChangeStatus = async (stageName: string, status: StageStatus) => {
    if (!schedule) return;

    // Update local state immediately
    const updatedStages = schedule.plan.stages.map((stage) => {
      if (stage.stage_name === stageName) {
        return { ...stage, status };
      }
      return stage;
    });

    setSchedule({
      ...schedule,
      plan: {
        ...schedule.plan,
        stages: updatedStages,
      },
    });
  };

  const handleExportExcel = async () => {
    if (!schedule || !items) return;

    setExporting(true);
    try {
      const blob = await exportToExcel(
        { items, project_name: projectName },
        new Date().toISOString().split('T')[0]
      );
      downloadExport(blob, `schedule_${projectName || 'project'}.xlsx`);
    } catch (err) {
      console.error('Export failed:', err);
    } finally {
      setExporting(false);
    }
  };

  const handleExportCsv = async () => {
    if (!schedule || !items) return;

    setExporting(true);
    try {
      const blob = await exportToCsv({ items, project_name: projectName });
      downloadExport(blob, `schedule_${projectName || 'project'}.csv`);
    } catch (err) {
      console.error('Export failed:', err);
    } finally {
      setExporting(false);
    }
  };

  const handleStageClick = (stage: ConstructionStage) => {
    // Could open a modal with stage details
    console.log('Stage clicked:', stage);
  };

  if (loading) {
    return (
      <Card>
        <CardContent className="flex items-center justify-center h-64">
          <RefreshCw className="h-8 w-8 animate-spin text-gray-400" />
          <span className="ml-3 text-gray-500">Загрузка плана...</span>
        </CardContent>
      </Card>
    );
  }

  if (error) {
    return (
      <Card>
        <CardContent className="flex flex-col items-center justify-center h-64">
          <p className="text-red-500 mb-4">{error}</p>
          <Button onClick={loadSchedule} variant="outline">
            <RefreshCw className="h-4 w-4 mr-2" />
            Повторить
          </Button>
        </CardContent>
      </Card>
    );
  }

  if (!schedule) {
    return (
      <Card>
        <CardContent className="flex flex-col items-center justify-center h-64 text-gray-400">
          <BarChart3 className="h-12 w-12 mb-4 opacity-50" />
          <p>Загрузите документы для создания плана строительства</p>
        </CardContent>
      </Card>
    );
  }

  return (
    <div className="space-y-4">
      {/* Header with controls */}
      <Card>
        <CardHeader className="pb-4">
          <div className="flex items-center justify-between">
            <div>
              <CardTitle>
                {schedule.plan.project_name || 'План строительства'}
              </CardTitle>
              <p className="text-sm text-gray-500 mt-1">
                {schedule.stages_count} этапов • {schedule.total_items} позиций •{' '}
                {schedule.total_duration_weeks} недель
              </p>
            </div>

            <div className="flex items-center gap-2">
              {/* View mode toggle */}
              <div className="flex border rounded-lg overflow-hidden">
                <Button
                  variant={viewMode === 'list' ? 'default' : 'ghost'}
                  size="sm"
                  className="rounded-none"
                  onClick={() => setViewMode('list')}
                >
                  <LayoutList className="h-4 w-4 mr-1" />
                  Список
                </Button>
                <Button
                  variant={viewMode === 'gantt' ? 'default' : 'ghost'}
                  size="sm"
                  className="rounded-none"
                  onClick={() => setViewMode('gantt')}
                >
                  <BarChart3 className="h-4 w-4 mr-1" />
                  Ганта
                </Button>
              </div>

              {/* Export buttons */}
              <div className="flex gap-1 ml-4">
                <Button
                  variant="outline"
                  size="sm"
                  onClick={handleExportExcel}
                  disabled={exporting || !items}
                >
                  <FileSpreadsheet className="h-4 w-4 mr-1" />
                  Excel
                </Button>
                <Button
                  variant="outline"
                  size="sm"
                  onClick={handleExportCsv}
                  disabled={exporting || !items}
                >
                  <FileText className="h-4 w-4 mr-1" />
                  CSV
                </Button>
              </div>

              {/* Refresh button */}
              <Button variant="ghost" size="sm" onClick={loadSchedule}>
                <RefreshCw className={`h-4 w-4 ${loading ? 'animate-spin' : ''}`} />
              </Button>
            </div>
          </div>
        </CardHeader>
      </Card>

      {/* Summary stats */}
      <div className="grid grid-cols-4 gap-4">
        <Card>
          <CardContent className="pt-4">
            <div className="text-2xl font-bold">{schedule.stages_count}</div>
            <div className="text-sm text-gray-500">Этапов</div>
          </CardContent>
        </Card>
        <Card>
          <CardContent className="pt-4">
            <div className="text-2xl font-bold">{schedule.total_items}</div>
            <div className="text-sm text-gray-500">Позиций</div>
          </CardContent>
        </Card>
        <Card>
          <CardContent className="pt-4">
            <div className="text-2xl font-bold">{schedule.total_duration_weeks}</div>
            <div className="text-sm text-gray-500">Недель</div>
          </CardContent>
        </Card>
        <Card>
          <CardContent className="pt-4">
            <div className="text-2xl font-bold text-yellow-600">
              {schedule.uncategorized_count}
            </div>
            <div className="text-sm text-gray-500">Без категории</div>
          </CardContent>
        </Card>
      </div>

      {/* Main view */}
      {viewMode === 'list' ? (
        <StageListView
          stages={schedule.plan.stages}
          onUpdateProgress={handleUpdateProgress}
          onChangeStatus={handleChangeStatus}
        />
      ) : (
        <Card className="overflow-hidden">
          <GanttView
            stages={schedule.plan.stages}
            dependencies={schedule.plan.dependencies}
            totalDuration={schedule.total_duration_weeks}
            onStageClick={handleStageClick}
          />
        </Card>
      )}
    </div>
  );
}

export default ConstructionSchedule;

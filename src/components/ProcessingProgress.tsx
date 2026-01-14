/**
 * ProcessingProgress - Компонент отображения прогресса обработки
 */
import { useTaskStatus, getStatusText, getStatusColor, ProcessingStatus } from '@/hooks/useTaskStatus';
import { CheckCircle, AlertCircle, Loader2, FileText, Search, Sparkles, Clock } from 'lucide-react';
import { cn } from '@/lib/utils';

interface ProcessingProgressProps {
  taskId: string | null;
  onComplete?: () => void;
  className?: string;
}

const statusIcons: Record<ProcessingStatus, typeof Loader2> = {
  pending: Clock,
  parsing: FileText,
  matching: Search,
  optimizing: Sparkles,
  completed: CheckCircle,
  error: AlertCircle,
};

export function ProcessingProgress({ taskId, onComplete, className }: ProcessingProgressProps) {
  const { status, isConnected, error } = useTaskStatus(taskId, {
    onComplete: () => onComplete?.(),
  });

  if (!taskId) return null;

  const currentStatus = status?.status || 'pending';
  const progress = status?.progress || 0;
  const message = status?.message || getStatusText(currentStatus);
  const color = getStatusColor(currentStatus);
  const Icon = statusIcons[currentStatus];

  const colorClasses = {
    gray: 'bg-gray-100 text-gray-600 border-gray-200',
    blue: 'bg-blue-50 text-blue-600 border-blue-200',
    indigo: 'bg-indigo-50 text-indigo-600 border-indigo-200',
    purple: 'bg-purple-50 text-purple-600 border-purple-200',
    green: 'bg-green-50 text-green-600 border-green-200',
    red: 'bg-red-50 text-red-600 border-red-200',
  };

  const progressColors = {
    gray: 'bg-gray-500',
    blue: 'bg-blue-500',
    indigo: 'bg-indigo-500',
    purple: 'bg-purple-500',
    green: 'bg-green-500',
    red: 'bg-red-500',
  };

  return (
    <div className={cn("rounded-xl border p-4", colorClasses[color as keyof typeof colorClasses], className)}>
      <div className="flex items-center gap-3">
        <div className={cn(
          "p-2 rounded-lg",
          currentStatus === 'completed' ? 'bg-green-100' :
          currentStatus === 'error' ? 'bg-red-100' :
          'bg-white/50'
        )}>
          <Icon className={cn(
            "h-5 w-5",
            currentStatus !== 'completed' && currentStatus !== 'error' && 'animate-pulse'
          )} />
        </div>
        
        <div className="flex-1">
          <div className="flex items-center justify-between mb-1">
            <span className="font-medium">{message}</span>
            <span className="text-sm">{Math.round(progress)}%</span>
          </div>
          
          {/* Progress bar */}
          <div className="h-2 bg-white/50 rounded-full overflow-hidden">
            <div
              className={cn(
                "h-full rounded-full transition-all duration-500",
                progressColors[color as keyof typeof progressColors]
              )}
              style={{ width: `${progress}%` }}
            />
          </div>
        </div>
      </div>

      {/* Connection status */}
      <div className="mt-2 flex items-center justify-between text-xs opacity-60">
        <div className="flex items-center gap-1">
          <div className={cn(
            "w-2 h-2 rounded-full",
            isConnected ? "bg-green-500" : "bg-gray-400"
          )} />
          <span>{isConnected ? 'Подключено' : 'Отключено'}</span>
        </div>
        {error && <span className="text-red-600">{error}</span>}
      </div>

      {/* Steps indicator */}
      <div className="mt-3 flex items-center gap-2">
        {(['parsing', 'matching', 'optimizing', 'completed'] as ProcessingStatus[]).map((step, index) => {
          const isActive = step === currentStatus;
          const isPassed = ['parsing', 'matching', 'optimizing', 'completed'].indexOf(currentStatus) > index;
          
          return (
            <div key={step} className="flex items-center gap-2">
              <div className={cn(
                "w-3 h-3 rounded-full transition-all",
                isActive ? "bg-current scale-125" :
                isPassed ? "bg-current" :
                "bg-current/30"
              )} />
              {index < 3 && (
                <div className={cn(
                  "w-8 h-0.5 transition-all",
                  isPassed ? "bg-current" : "bg-current/30"
                )} />
              )}
            </div>
          );
        })}
      </div>
    </div>
  );
}

/**
 * Компактная версия для списков
 */
export function ProcessingProgressCompact({ taskId, className }: { taskId: string | null; className?: string }) {
  const { status } = useTaskStatus(taskId);

  if (!taskId) return null;

  const currentStatus = status?.status || 'pending';
  const progress = status?.progress || 0;
  const color = getStatusColor(currentStatus);
  const Icon = statusIcons[currentStatus];

  return (
    <div className={cn("flex items-center gap-2", className)}>
      <Icon className={cn(
        "h-4 w-4",
        currentStatus !== 'completed' && currentStatus !== 'error' && 'animate-pulse',
        `text-${color}-500`
      )} />
      <div className="flex-1 h-1.5 bg-gray-200 rounded-full overflow-hidden">
        <div
          className={cn("h-full rounded-full transition-all", `bg-${color}-500`)}
          style={{ width: `${progress}%` }}
        />
      </div>
      <span className="text-xs text-gray-500">{Math.round(progress)}%</span>
    </div>
  );
}

/**
 * StrategyCard - Карточка стратегии закупки
 */
import { 
  Building2, 
  Truck, 
  CheckCircle2, 
  Star,
  Package,
  AlertTriangle
} from 'lucide-react';
import { cn } from '@/lib/utils';
import type { SourcingStrategy, StrategyType } from '@/types/sourcing';

interface StrategyCardProps {
  strategy: SourcingStrategy;
  isSelected: boolean;
  isRecommended: boolean;
  onSelect: () => void;
}

const STRATEGY_CONFIG: Record<StrategyType, {
  icon: typeof Building2;
  color: string;
  bgColor: string;
  borderColor: string;
  label: string;
}> = {
  one_stop_shop: {
    icon: Building2,
    color: 'text-amber-600',
    bgColor: 'bg-amber-50',
    borderColor: 'border-amber-300',
    label: 'Комфорт'
  },
  best_price: {
    icon: Truck,
    color: 'text-green-600',
    bgColor: 'bg-green-50',
    borderColor: 'border-green-300',
    label: 'Эконом'
  },
  balanced: {
    icon: Package,
    color: 'text-blue-600',
    bgColor: 'bg-blue-50',
    borderColor: 'border-blue-300',
    label: 'Баланс'
  }
};

export function StrategyCard({ 
  strategy, 
  isSelected, 
  isRecommended,
  onSelect 
}: StrategyCardProps) {
  const config = STRATEGY_CONFIG[strategy.strategy_type] || STRATEGY_CONFIG.balanced;
  const Icon = config.icon;

  return (
    <button
      onClick={onSelect}
      className={cn(
        "relative w-full text-left p-4 rounded-xl border-2 transition-all",
        "hover:shadow-lg",
        isSelected 
          ? `${config.borderColor} ${config.bgColor} shadow-md` 
          : "border-gray-200 bg-white hover:border-gray-300"
      )}
    >
      {/* Рекомендуемая метка */}
      {isRecommended && (
        <div className="absolute -top-2 -right-2 flex items-center gap-1 px-2 py-0.5 bg-yellow-400 text-yellow-900 text-xs font-medium rounded-full">
          <Star className="h-3 w-3" />
          AI рекомендует
        </div>
      )}

      {/* Выбрано */}
      {isSelected && (
        <div className="absolute top-3 right-3">
          <CheckCircle2 className={cn("h-6 w-6", config.color)} />
        </div>
      )}

      {/* Заголовок */}
      <div className="flex items-center gap-3 mb-3">
        <div className={cn("p-2 rounded-lg", config.bgColor)}>
          <Icon className={cn("h-5 w-5", config.color)} />
        </div>
        <div>
          <h3 className="font-semibold text-gray-900">{strategy.strategy_name}</h3>
          <p className="text-sm text-gray-500">{config.label}</p>
        </div>
      </div>

      {/* Описание */}
      <p className="text-sm text-gray-600 mb-4">{strategy.description}</p>

      {/* Цена */}
      <div className="flex items-end justify-between mb-3">
        <div>
          <div className="text-2xl font-bold text-gray-900">
            {strategy.total_budget.toLocaleString('ru-RU')} ₽
          </div>
          <div className="text-xs text-gray-500">
            товары: {strategy.total_items_cost.toLocaleString('ru-RU')} ₽ + 
            доставка: {strategy.total_delivery_cost.toLocaleString('ru-RU')} ₽
          </div>
        </div>
      </div>

      {/* Метрики */}
      <div className="flex items-center gap-4 text-sm">
        <div className="flex items-center gap-1 text-gray-600">
          <Truck className="h-4 w-4" />
          <span>{strategy.suppliers_count} доставк{strategy.suppliers_count === 1 ? 'а' : 'и'}</span>
        </div>
        <div className="flex items-center gap-1 text-gray-600">
          <Package className="h-4 w-4" />
          <span>{strategy.coverage_percent.toFixed(0)}% покрытие</span>
        </div>
      </div>

      {/* Предупреждение о недостающих товарах */}
      {strategy.missing_items.length > 0 && (
        <div className="mt-3 flex items-start gap-2 p-2 bg-yellow-50 rounded-lg text-sm">
          <AlertTriangle className="h-4 w-4 text-yellow-600 flex-shrink-0 mt-0.5" />
          <div className="text-yellow-700">
            Не найдено: {strategy.missing_items.slice(0, 2).join(', ')}
            {strategy.missing_items.length > 2 && ` и ещё ${strategy.missing_items.length - 2}`}
          </div>
        </div>
      )}
    </button>
  );
}

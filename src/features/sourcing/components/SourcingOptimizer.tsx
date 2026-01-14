/**
 * SourcingOptimizer - Главный компонент оптимизации закупок
 * 
 * Отображает кнопку оптимизации и результаты со стратегиями
 */
import { useState } from 'react';
import { useMutation } from '@tanstack/react-query';
import { 
  Sparkles, 
  Loader2, 
  TrendingDown, 
  ShoppingCart,
  AlertCircle
} from 'lucide-react';
import { cn } from '@/lib/utils';
import { optimizeStage } from '@/lib/sourcingApi';
import { StrategyCard } from './StrategyCard';
import { OrdersPreview } from './OrdersPreview';
import type { 
  StageItem, 
  OptimizationResult, 
  SourcingStrategy,
  StrategyType 
} from '@/types/sourcing';

interface SourcingOptimizerProps {
  stageName?: string;
  items: StageItem[];
  onOrdersGenerated?: (strategy: SourcingStrategy) => void;
  className?: string;
}

export function SourcingOptimizer({ 
  stageName, 
  items, 
  onOrdersGenerated,
  className 
}: SourcingOptimizerProps) {
  const [result, setResult] = useState<OptimizationResult | null>(null);
  const [selectedStrategy, setSelectedStrategy] = useState<StrategyType | null>(null);
  const [showOrders, setShowOrders] = useState(false);

  const optimizeMutation = useMutation({
    mutationFn: () => optimizeStage({
      stage_name: stageName,
      items,
      delivery_cost_estimate: 3000,
      max_candidates_per_item: 5
    }),
    onSuccess: (data) => {
      setResult(data);
      // Автовыбор рекомендуемой стратегии
      if (data.recommended_strategy) {
        setSelectedStrategy(data.recommended_strategy as StrategyType);
      }
    }
  });

  const handleOptimize = () => {
    setResult(null);
    setSelectedStrategy(null);
    setShowOrders(false);
    optimizeMutation.mutate();
  };

  const handleSelectStrategy = (strategyType: StrategyType) => {
    setSelectedStrategy(strategyType);
    setShowOrders(false);
  };

  const handleGenerateOrders = () => {
    if (!result || !selectedStrategy) return;
    
    const strategy = result.strategies.find(s => s.strategy_type === selectedStrategy);
    if (strategy) {
      setShowOrders(true);
      onOrdersGenerated?.(strategy);
    }
  };

  const selectedStrategyData = result?.strategies.find(
    s => s.strategy_type === selectedStrategy
  );

  return (
    <div className={cn("space-y-4", className)}>
      {/* Кнопка оптимизации */}
      {!result && (
        <button
          onClick={handleOptimize}
          disabled={optimizeMutation.isPending || items.length === 0}
          className={cn(
            "w-full flex items-center justify-center gap-3 px-6 py-4 rounded-xl",
            "bg-gradient-to-r from-blue-600 to-indigo-600 text-white font-medium",
            "hover:from-blue-700 hover:to-indigo-700 transition-all",
            "disabled:opacity-50 disabled:cursor-not-allowed",
            "shadow-lg hover:shadow-xl"
          )}
        >
          {optimizeMutation.isPending ? (
            <>
              <Loader2 className="h-5 w-5 animate-spin" />
              <span>Анализ цен и поставщиков...</span>
            </>
          ) : (
            <>
              <Sparkles className="h-5 w-5" />
              <span>Оптимизировать закупку</span>
              <span className="text-blue-200 text-sm">({items.length} позиций)</span>
            </>
          )}
        </button>
      )}

      {/* Ошибка */}
      {optimizeMutation.isError && (
        <div className="flex items-center gap-2 p-4 bg-red-50 border border-red-200 rounded-lg text-red-700">
          <AlertCircle className="h-5 w-5 flex-shrink-0" />
          <span>Ошибка оптимизации. Попробуйте позже.</span>
        </div>
      )}

      {/* Результаты оптимизации */}
      {result && (
        <div className="space-y-4">
          {/* Заголовок с экономией */}
          <div className="bg-gradient-to-r from-green-50 to-emerald-50 border border-green-200 rounded-xl p-4">
            <div className="flex items-center justify-between">
              <div className="flex items-center gap-3">
                <div className="p-2 bg-green-100 rounded-lg">
                  <TrendingDown className="h-6 w-6 text-green-600" />
                </div>
                <div>
                  <h3 className="font-semibold text-green-800">
                    Найдено {result.strategies.length} стратегии
                  </h3>
                  <p className="text-sm text-green-600">
                    {result.items_found} из {result.items_requested} позиций найдено
                  </p>
                </div>
              </div>
              {result.potential_savings > 0 && (
                <div className="text-right">
                  <div className="text-2xl font-bold text-green-600">
                    -{result.potential_savings.toLocaleString('ru-RU')} ₽
                  </div>
                  <div className="text-sm text-green-600">потенциальная экономия</div>
                </div>
              )}
            </div>
          </div>

          {/* AI Резюме */}
          {result.ai_summary && (
            <div className="bg-blue-50 border border-blue-200 rounded-lg p-4">
              <div className="flex items-start gap-3">
                <Sparkles className="h-5 w-5 text-blue-600 flex-shrink-0 mt-0.5" />
                <div>
                  <div className="font-medium text-blue-800 mb-1">AI-рекомендация</div>
                  <p className="text-sm text-blue-700">{result.ai_summary}</p>
                </div>
              </div>
            </div>
          )}

          {/* Карточки стратегий */}
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            {result.strategies.map((strategy) => (
              <StrategyCard
                key={strategy.strategy_type}
                strategy={strategy}
                isSelected={selectedStrategy === strategy.strategy_type}
                isRecommended={result.recommended_strategy === strategy.strategy_type}
                onSelect={() => handleSelectStrategy(strategy.strategy_type)}
              />
            ))}
          </div>

          {/* Кнопка генерации заказов */}
          {selectedStrategy && !showOrders && (
            <button
              onClick={handleGenerateOrders}
              className={cn(
                "w-full flex items-center justify-center gap-3 px-6 py-4 rounded-xl",
                "bg-gradient-to-r from-emerald-600 to-green-600 text-white font-medium",
                "hover:from-emerald-700 hover:to-green-700 transition-all",
                "shadow-lg hover:shadow-xl"
              )}
            >
              <ShoppingCart className="h-5 w-5" />
              <span>Сформировать заказы</span>
              <span className="text-emerald-200">
                ({selectedStrategyData?.suppliers_count} поставщик
                {selectedStrategyData?.suppliers_count === 1 ? '' : 'а'})
              </span>
            </button>
          )}

          {/* Предпросмотр заказов */}
          {showOrders && selectedStrategyData && (
            <OrdersPreview 
              strategy={selectedStrategyData}
              stageName={stageName}
            />
          )}

          {/* Кнопка нового анализа */}
          <button
            onClick={handleOptimize}
            className="w-full text-center text-sm text-gray-500 hover:text-gray-700 py-2"
          >
            Пересчитать оптимизацию
          </button>
        </div>
      )}
    </div>
  );
}

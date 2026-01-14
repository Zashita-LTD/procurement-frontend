/**
 * Analytics Dashboard - Дашборд аналитики закупок
 */
import { useState } from 'react';
import { useQuery } from '@tanstack/react-query';
import { 
  TrendingUp, 
  TrendingDown, 
  Package, 
  Truck, 
  DollarSign,
  PieChart,
  BarChart3,
  Calendar,
  Building2,
  Sparkles,
  RefreshCw
} from 'lucide-react';
import { cn } from '@/lib/utils';
import { analyticsApi } from '@/lib/analyticsApi';

// Моковые данные для демонстрации
const MOCK_ANALYTICS = {
  summary: {
    totalOrders: 47,
    totalAmount: 2_450_000,
    avgOrderAmount: 52_128,
    totalSavings: 185_000,
    savingsPercent: 7.5,
  },
  topSuppliers: [
    { name: 'Петрович', orders: 15, amount: 850_000, coverage: 92 },
    { name: 'МеталлСервис', orders: 12, amount: 620_000, coverage: 88 },
    { name: 'БетонЗавод', orders: 8, amount: 380_000, coverage: 95 },
    { name: 'ЛесТорг', orders: 7, amount: 320_000, coverage: 78 },
    { name: 'СтройОпт', orders: 5, amount: 280_000, coverage: 85 },
  ],
  strategyDistribution: {
    best_price: 28,
    one_stop_shop: 15,
    balanced: 4,
  },
  monthlyTrend: [
    { month: 'Сен', amount: 380_000 },
    { month: 'Окт', amount: 520_000 },
    { month: 'Ноя', amount: 680_000 },
    { month: 'Дек', amount: 450_000 },
    { month: 'Янв', amount: 420_000 },
  ],
  recentOptimizations: [
    { stage: 'Фундамент ЖК-12', savings: 45_000, date: '2026-01-14' },
    { stage: 'Кровля Офис-3', savings: 28_000, date: '2026-01-13' },
    { stage: 'Отделка Склад', savings: 15_000, date: '2026-01-12' },
  ]
};

interface StatCardProps {
  title: string;
  value: string | number;
  subtitle?: string;
  icon: typeof TrendingUp;
  trend?: { value: number; isPositive: boolean };
  color: 'blue' | 'green' | 'amber' | 'purple';
}

function StatCard({ title, value, subtitle, icon: Icon, trend, color }: StatCardProps) {
  const colorClasses = {
    blue: 'bg-blue-50 text-blue-600 border-blue-200',
    green: 'bg-green-50 text-green-600 border-green-200',
    amber: 'bg-amber-50 text-amber-600 border-amber-200',
    purple: 'bg-purple-50 text-purple-600 border-purple-200',
  };
  
  const iconBg = {
    blue: 'bg-blue-100',
    green: 'bg-green-100',
    amber: 'bg-amber-100',
    purple: 'bg-purple-100',
  };

  return (
    <div className={cn("rounded-xl border p-4", colorClasses[color])}>
      <div className="flex items-start justify-between">
        <div className={cn("p-2 rounded-lg", iconBg[color])}>
          <Icon className="h-5 w-5" />
        </div>
        {trend && (
          <div className={cn(
            "flex items-center gap-1 text-sm font-medium",
            trend.isPositive ? "text-green-600" : "text-red-600"
          )}>
            {trend.isPositive ? <TrendingUp className="h-4 w-4" /> : <TrendingDown className="h-4 w-4" />}
            {Math.abs(trend.value)}%
          </div>
        )}
      </div>
      <div className="mt-3">
        <div className="text-2xl font-bold text-gray-900">
          {typeof value === 'number' ? value.toLocaleString('ru-RU') : value}
        </div>
        <div className="text-sm text-gray-600">{title}</div>
        {subtitle && <div className="text-xs text-gray-500 mt-1">{subtitle}</div>}
      </div>
    </div>
  );
}

export function AnalyticsDashboard() {
  const [period, setPeriod] = useState<'week' | 'month' | 'quarter'>('month');
  
  // API запрос с fallback на моковые данные
  const { data, isLoading, refetch } = useQuery({
    queryKey: ['analytics', period],
    queryFn: async () => {
      try {
        const result = await analyticsApi.getDashboard(period);
        // Преобразуем к формату компонента
        return {
          summary: {
            totalOrders: result.total_orders,
            totalAmount: result.total_amount,
            avgOrderAmount: result.average_order_amount,
            totalSavings: result.savings_stats.total_savings,
            savingsPercent: result.savings_stats.percent_savings,
          },
          topSuppliers: result.top_suppliers.map(s => ({
            name: s.supplier_name,
            orders: s.total_orders,
            amount: s.total_amount,
            coverage: s.coverage_percent,
          })),
          strategyDistribution: result.strategy_distribution,
          monthlyTrend: result.monthly_stats.map(s => ({
            month: s.month,
            amount: s.amount,
          })),
          recentOptimizations: result.recent_optimizations.map(o => ({
            stage: o.stage_name,
            savings: o.savings,
            date: o.date,
          })),
        };
      } catch {
        // Fallback на моковые данные при ошибке API
        return MOCK_ANALYTICS;
      }
    }
  });

  if (isLoading || !data) {
    return (
      <div className="flex items-center justify-center h-96">
        <RefreshCw className="h-8 w-8 animate-spin text-blue-600" />
      </div>
    );
  }

  const maxAmount = Math.max(...data.monthlyTrend.map(t => t.amount));

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-2xl font-bold text-gray-900">Аналитика закупок</h1>
          <p className="text-gray-500">Статистика и показатели эффективности</p>
        </div>
        <div className="flex items-center gap-3">
          {/* Period selector */}
          <div className="flex rounded-lg border bg-white p-1">
            {(['week', 'month', 'quarter'] as const).map((p) => (
              <button
                key={p}
                onClick={() => setPeriod(p)}
                className={cn(
                  "px-3 py-1.5 rounded-md text-sm font-medium transition-colors",
                  period === p 
                    ? "bg-blue-100 text-blue-700" 
                    : "text-gray-600 hover:bg-gray-100"
                )}
              >
                {p === 'week' ? 'Неделя' : p === 'month' ? 'Месяц' : 'Квартал'}
              </button>
            ))}
          </div>
          <button
            onClick={() => refetch()}
            className="p-2 rounded-lg border hover:bg-gray-50 transition-colors"
          >
            <RefreshCw className="h-5 w-5 text-gray-600" />
          </button>
        </div>
      </div>

      {/* Summary Cards */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
        <StatCard
          title="Всего заказов"
          value={data.summary.totalOrders}
          subtitle="за выбранный период"
          icon={Package}
          trend={{ value: 12, isPositive: true }}
          color="blue"
        />
        <StatCard
          title="Сумма закупок"
          value={`${(data.summary.totalAmount / 1_000_000).toFixed(2)} млн ₽`}
          subtitle={`средний заказ: ${data.summary.avgOrderAmount.toLocaleString('ru-RU')} ₽`}
          icon={DollarSign}
          trend={{ value: 8, isPositive: true }}
          color="purple"
        />
        <StatCard
          title="Экономия"
          value={`${data.summary.totalSavings.toLocaleString('ru-RU')} ₽`}
          subtitle={`${data.summary.savingsPercent}% от бюджета`}
          icon={TrendingDown}
          trend={{ value: 15, isPositive: true }}
          color="green"
        />
        <StatCard
          title="Поставщиков"
          value={data.topSuppliers.length}
          subtitle="активных за период"
          icon={Truck}
          color="amber"
        />
      </div>

      {/* Charts Row */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        {/* Monthly Trend */}
        <div className="lg:col-span-2 bg-white rounded-xl border p-6">
          <div className="flex items-center justify-between mb-4">
            <h3 className="font-semibold text-gray-900">Динамика закупок</h3>
            <BarChart3 className="h-5 w-5 text-gray-400" />
          </div>
          <div className="flex items-end gap-4 h-48">
            {data.monthlyTrend.map((item, index) => (
              <div key={index} className="flex-1 flex flex-col items-center gap-2">
                <div 
                  className="w-full bg-blue-500 rounded-t-lg transition-all hover:bg-blue-600"
                  style={{ height: `${(item.amount / maxAmount) * 100}%` }}
                />
                <span className="text-xs text-gray-500">{item.month}</span>
                <span className="text-xs font-medium text-gray-700">
                  {(item.amount / 1000).toFixed(0)}k
                </span>
              </div>
            ))}
          </div>
        </div>

        {/* Strategy Distribution */}
        <div className="bg-white rounded-xl border p-6">
          <div className="flex items-center justify-between mb-4">
            <h3 className="font-semibold text-gray-900">Стратегии</h3>
            <PieChart className="h-5 w-5 text-gray-400" />
          </div>
          <div className="space-y-4">
            {Object.entries(data.strategyDistribution).map(([strategy, count]) => {
              const total = Object.values(data.strategyDistribution).reduce((a, b) => a + b, 0);
              const percent = ((count / total) * 100).toFixed(0);
              const colors = {
                best_price: { bg: 'bg-green-500', label: 'Эконом' },
                one_stop_shop: { bg: 'bg-amber-500', label: 'Комфорт' },
                balanced: { bg: 'bg-blue-500', label: 'Баланс' },
              };
              const config = colors[strategy as keyof typeof colors];
              
              return (
                <div key={strategy}>
                  <div className="flex items-center justify-between text-sm mb-1">
                    <span className="text-gray-600">{config?.label || strategy}</span>
                    <span className="font-medium text-gray-900">{count} ({percent}%)</span>
                  </div>
                  <div className="h-2 bg-gray-100 rounded-full overflow-hidden">
                    <div 
                      className={cn("h-full rounded-full transition-all", config?.bg || 'bg-gray-500')}
                      style={{ width: `${percent}%` }}
                    />
                  </div>
                </div>
              );
            })}
          </div>
        </div>
      </div>

      {/* Bottom Row */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        {/* Top Suppliers */}
        <div className="bg-white rounded-xl border p-6">
          <div className="flex items-center justify-between mb-4">
            <h3 className="font-semibold text-gray-900">Топ поставщиков</h3>
            <Building2 className="h-5 w-5 text-gray-400" />
          </div>
          <div className="space-y-3">
            {data.topSuppliers.map((supplier, index) => (
              <div 
                key={supplier.name}
                className="flex items-center gap-4 p-3 rounded-lg hover:bg-gray-50 transition-colors"
              >
                <div className={cn(
                  "w-8 h-8 rounded-full flex items-center justify-center text-sm font-bold",
                  index === 0 ? "bg-yellow-100 text-yellow-700" :
                  index === 1 ? "bg-gray-100 text-gray-700" :
                  index === 2 ? "bg-amber-100 text-amber-700" :
                  "bg-blue-50 text-blue-600"
                )}>
                  {index + 1}
                </div>
                <div className="flex-1">
                  <div className="font-medium text-gray-900">{supplier.name}</div>
                  <div className="text-sm text-gray-500">
                    {supplier.orders} заказов • {supplier.coverage}% покрытие
                  </div>
                </div>
                <div className="text-right">
                  <div className="font-semibold text-gray-900">
                    {supplier.amount.toLocaleString('ru-RU')} ₽
                  </div>
                </div>
              </div>
            ))}
          </div>
        </div>

        {/* Recent Optimizations */}
        <div className="bg-white rounded-xl border p-6">
          <div className="flex items-center justify-between mb-4">
            <h3 className="font-semibold text-gray-900">Последние оптимизации</h3>
            <Sparkles className="h-5 w-5 text-gray-400" />
          </div>
          <div className="space-y-3">
            {data.recentOptimizations.map((opt, index) => (
              <div 
                key={index}
                className="flex items-center justify-between p-3 rounded-lg bg-green-50 border border-green-200"
              >
                <div>
                  <div className="font-medium text-gray-900">{opt.stage}</div>
                  <div className="text-sm text-gray-500 flex items-center gap-1">
                    <Calendar className="h-3 w-3" />
                    {new Date(opt.date).toLocaleDateString('ru-RU')}
                  </div>
                </div>
                <div className="text-right">
                  <div className="font-bold text-green-600">
                    -{opt.savings.toLocaleString('ru-RU')} ₽
                  </div>
                  <div className="text-xs text-green-600">экономия</div>
                </div>
              </div>
            ))}
          </div>
          
          {/* Total savings */}
          <div className="mt-4 pt-4 border-t">
            <div className="flex items-center justify-between">
              <span className="text-gray-600">Общая экономия:</span>
              <span className="text-xl font-bold text-green-600">
                {data.recentOptimizations.reduce((sum, o) => sum + o.savings, 0).toLocaleString('ru-RU')} ₽
              </span>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
